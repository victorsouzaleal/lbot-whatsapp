import { Bot, UserCommandRate } from "../interfaces/bot.interface.js"
import { CategoryCommand } from "../interfaces/command.interface.js"
import path from "node:path"
import fs from 'fs-extra'
import moment from "moment-timezone"
import { buildText, commandExist } from "../lib/util.js"
import getCommands from "../commands/list.commands.js"
import Datastore from "@seald-io/nedb";

const db = {
    command_rate: new Datastore<UserCommandRate>({filename : './storage/command-rate.bot.db', autoload: true})
}

export class BotService {
    private pathJSON = path.resolve("storage/bot.json")

    constructor(){
        const storageFolderExists = fs.pathExistsSync(path.resolve("storage"))
        const jsonFileExists = fs.existsSync(this.pathJSON)
        
        if (!storageFolderExists) fs.mkdirSync(path.resolve("storage"), {recursive: true})
        if (!jsonFileExists) this.initBot()
    }

    private updateBot(bot : Bot){
        fs.writeFileSync(this.pathJSON, JSON.stringify(bot))
    }

    private initBot(){
        const bot : Bot = {
            started : 0,
            host_number: '',
            name: "LBOT",
            author_sticker: "Leal",
            pack_sticker: "LBOT Sticker",
            prefix: "!",
            executed_cmds: 0,
            autosticker: false,
            commands_pv: true, 
            block_cmds: [],    
            command_rate:{
                status: false,
                max_cmds_minute: 5,
                block_time: 60,
            },
            api_keys:{
                deepgram: {
                    secret_key: null
                },
                acrcloud: {
                    host: null,
                    access_key: null,
                    secret_key: null
                }
            }
        }

        this.updateBot(bot)
    }

    public startBot(hostNumber : string){
        let bot = this.getBot()
        bot.started = moment.now()
        bot.host_number = hostNumber
        this.updateBot(bot)
    }

    public getBot(){
        return JSON.parse(fs.readFileSync(this.pathJSON, {encoding: "utf-8"})) as Bot
    }

    public setNameBot(name: string){
        let bot = this.getBot()
        bot.name = name
        return this.updateBot(bot)
    }

    public setAuthorSticker(name: string){
        let bot = this.getBot()
        bot.author_sticker = name
        return this.updateBot(bot)
    }

    public setPackSticker(name: string){
        let bot = this.getBot()
        bot.pack_sticker = name
        return this.updateBot(bot)
    }
    
    public setPrefix(prefix: string){
        let bot = this.getBot()
        bot.prefix = prefix
        return this.updateBot(bot)
    }

    public incrementExecutedCommands(){
        let bot = this.getBot()
        bot.executed_cmds++
        return this.updateBot(bot)
    }


    // Recursos do BOT
    // Auto-Sticker
    public setAutosticker(status: boolean){
        let bot = this.getBot()
        bot.autosticker = status
        return this.updateBot(bot)
    }

    // Comandos no PV
    public setCommandsPv(status: boolean){
        let bot = this.getBot()
        bot.commands_pv = status
        return this.updateBot(bot)
    }

    // Taxa de comandos
    public async setCommandRate(status: boolean, maxCommandsMinute: number, blockTime: number){
        if(!status) await this.removeCommandRate()
        let bot = this.getBot()
        bot.command_rate.status = status
        bot.command_rate.max_cmds_minute = maxCommandsMinute
        bot.command_rate.block_time = blockTime
        return this.updateBot(bot)
    }

    public async hasExceededCommandRate(botInfo: Bot, userId: string, isBotAdmin: boolean){
        const currentTimestamp = Math.round(moment.now()/1000)
        const userCommandRate = await this.getUserCommandRate(userId)
        let hasExceeded = false

        if(isBotAdmin) return false

        if (userCommandRate){
            if (userCommandRate.limited){
                const hasExpiredLimited = await this.hasExpiredLimited(userCommandRate, botInfo, currentTimestamp)
                if (hasExpiredLimited) hasExceeded = false
                else hasExceeded = true
            } else {
                const hasExpiredMessages = await this.hasExpiredCommands(userCommandRate, currentTimestamp)
                if (!hasExpiredMessages && userCommandRate.cmds >= botInfo.command_rate.max_cmds_minute) {
                    hasExceeded = true
                    await this.setLimitUserCommandRate(userCommandRate.user_id, true, botInfo, currentTimestamp)
                } else {
                    hasExceeded = false
                }
            }
        } else {
            await this.registerUserCommandRate(userId)
        }
    
        return hasExceeded
    }

    private removeCommandRate(){
        return db.command_rate.removeAsync({}, {multi: true})
    }

    private async registerUserCommandRate(userId: string){
        const isRegistered = (await this.getUserCommandRate(userId)) ? true : false

        if (isRegistered) return 

        const timestamp = Math.round(moment.now()/1000)

        const userCommandRate : UserCommandRate = {
            user_id: userId,
            limited: false,
            expire_limited: 0,
            cmds: 1,
            expire_cmds: timestamp + 60
        }

        return db.command_rate.insertAsync(userCommandRate)
    }

    private async getUserCommandRate(userId: string){
        const userCommandRate = await db.command_rate.findOneAsync({user_id: userId}) as UserCommandRate | null
        return userCommandRate
    }

    private async hasExpiredCommands(userCommandRate: UserCommandRate, currentTimestamp: number){
        if (currentTimestamp > userCommandRate.expire_cmds){
            const expireTimestamp = currentTimestamp + 60
            await db.command_rate.updateAsync({user_id: userCommandRate.user_id}, { $set : { expire_cmds: expireTimestamp, cmds: 1 } })
            return true
        } else {
            await db.command_rate.updateAsync({user_id: userCommandRate.user_id}, { $inc : { cmds: 1 } })
            return false
        }
    }

    private async hasExpiredLimited(userCommandRate: UserCommandRate, botInfo: Bot, currentTimestamp: number){
        if (currentTimestamp > userCommandRate.expire_limited){
            await this.setLimitUserCommandRate(userCommandRate.user_id, false, botInfo, currentTimestamp)
            return true
        } else {
            return false
        }
    }

    private setLimitUserCommandRate(userId: string, isLimited: boolean, botInfo: Bot, currentTimestamp: number){
        if(isLimited){
            return db.command_rate.updateAsync({user_id: userId}, { $set : { limited: isLimited, expire_limited: currentTimestamp + botInfo.command_rate.block_time} })
        } else {
            return db.command_rate.updateAsync({user_id: userId}, { $set : { limited: isLimited, expire_limited: 0, cmds: 1, expire_cmds: currentTimestamp + 60} })
        }
    }

    // Bloquear/Desbloquear comandos
    public blockCommandsGlobally(commands : string[]){
        let botInfo = this.getBot()
        const commandsData = getCommands(botInfo)
        const {prefix: prefix} = botInfo
        let blockResponse = commandsData.admin.bcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] = ['sticker', 'utility', 'download', 'fun']

        if (categories.includes(commands[0] as CategoryCommand)) commands = Object.keys(commandsData[commands[0] as CategoryCommand]).map(command => prefix+command)

        for(let command of commands){
            if (commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'fun') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')){
                if (botInfo.block_cmds.includes(command.replace(prefix, ''))){
                    blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_already_blocked, command)
                } else {
                    botInfo.block_cmds.push(command.replace(prefix, ''))
                    blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info') ){
                blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(commandsData.admin.bcmdglobal.msgs.reply_item_not_exist, command)
            }
        }

        this.updateBot(botInfo)
        return blockResponse
    }

    public unblockCommandsGlobally(commands: string[]){
        let botInfo = this.getBot()
        const commandsData = getCommands(botInfo)
        const {prefix} = botInfo
        let unblockResponse = commandsData.admin.dcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'fun']

        if (categories.includes(commands[0])){
            if (commands[0] === 'all') commands = botInfo.block_cmds.map(command => prefix+command)
            else commands = Object.keys(commandsData[commands[0] as CategoryCommand]).map(command => prefix+command)
        }

        for(let command of commands){
            if (botInfo.block_cmds.includes(command.replace(prefix, ''))) {
                let commandIndex = botInfo.block_cmds.findIndex(command_blocked => command_blocked == command)
                botInfo.block_cmds.splice(commandIndex,1)
                unblockResponse += buildText(commandsData.admin.dcmdglobal.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(commandsData.admin.dcmdglobal.msgs.reply_item_not_blocked, command)
            }
        }

        this.updateBot(botInfo)
        return unblockResponse
    }

    public isCommandBlockedGlobally(command: string){
        let botInfo = this.getBot()
        const {prefix} = botInfo
        return botInfo.block_cmds.includes(command.replace(prefix, ''))
    }

    // Configuração de API
    public setDeepgramApiKey(secret_key: string){
        let bot = this.getBot()
        bot.api_keys.deepgram.secret_key = secret_key
        return this.updateBot(bot)
    }

    public setAcrcloudApiKey(host: string, access_key: string, secret_key: string){
        let bot = this.getBot()
        bot.api_keys.acrcloud.host = host
        bot.api_keys.acrcloud.access_key = access_key
        bot.api_keys.acrcloud.secret_key = secret_key
        return this.updateBot(bot)
    }
}