import { Bot } from "../interfaces/bot.interface.js"
import { CategoryCommand } from "../interfaces/command.interface.js"
import path from "node:path"
import fs from 'fs-extra'
import moment from "moment-timezone"
import { buildText } from "../utils/general.util.js"
import { proto } from "baileys"
import NodeCache from "node-cache"
import { commandExist, getCommandsByCategory } from "../utils/commands.util.js"
import { commandsAdmin } from "../commands/admin.list.commands.js"
import { waLib } from "../libraries/library.js"

export class BotService {
    private pathJSON = path.resolve("storage/bot.json")

    constructor(){
        const storageFolderExists = fs.pathExistsSync(path.resolve("storage"))
        const jsonFileExists = fs.existsSync(this.pathJSON)
        
        if (!storageFolderExists) {
            fs.mkdirSync(path.resolve("storage"), {recursive: true})
        }

        if (!jsonFileExists) {
            this.initBot()
        }
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
            admin_mode: false, 
            block_cmds: [],    
            command_rate:{
                status: false,
                max_cmds_minute: 5,
                block_time: 60,
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

    public storeMessageOnCache(message : proto.IWebMessageInfo, messageCache : NodeCache){
        if (message.key.remoteJid && message.key.id && message.message){
            messageCache.set(message.key.id, message.message)
        }    
    }

    public getMessageFromCache(messageId: string, messageCache: NodeCache){
        let message = messageCache.get(messageId) as proto.IMessage | undefined 
        return message
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

    // Modo admin
    public setAdminMode(status: boolean){
        let bot = this.getBot()
        bot.admin_mode = status
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
        let bot = this.getBot()
        bot.command_rate.status = status
        bot.command_rate.max_cmds_minute = maxCommandsMinute
        bot.command_rate.block_time = blockTime
        return this.updateBot(bot)
    }

    // Bloquear/Desbloquear comandos
    public blockCommandsGlobally(commands : string[]){
        let botInfo = this.getBot()
        const adminCommands = commandsAdmin(botInfo)
        const {prefix} = botInfo
        let blockResponse = adminCommands.bcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] = ['sticker', 'utility', 'download', 'misc']

        if (commands[0] == 'variado') {
            commands[0] = 'misc'
        } else if (commands[0] == 'utilidade') {
            commands[0] = 'utility'
        } 
        
        if (categories.includes(commands[0] as CategoryCommand)) {
            commands = getCommandsByCategory(botInfo, commands[0] as CategoryCommand)
        }
        
        for(let command of commands){
            if (commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'misc') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')){
                if (botInfo.block_cmds.includes(waLib.removePrefix(prefix, command))){
                    blockResponse += buildText(adminCommands.bcmdglobal.msgs.reply_item_already_blocked, command)
                } else {
                    botInfo.block_cmds.push(waLib.removePrefix(prefix, command))
                    blockResponse += buildText(adminCommands.bcmdglobal.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info') ){
                blockResponse += buildText(adminCommands.bcmdglobal.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(adminCommands.bcmdglobal.msgs.reply_item_not_exist, command)
            }
        }

        this.updateBot(botInfo)
        return blockResponse
    }

    public unblockCommandsGlobally(commands: string[]){
        let botInfo = this.getBot()
        const adminCommands = commandsAdmin(botInfo)
        const {prefix} = botInfo
        let unblockResponse = adminCommands.dcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'misc']

        if (commands[0] == 'todos') {
            commands[0] = 'all'
        } else if (commands[0] == 'utilidade') {
            commands[0] = 'utility'
        } else if (commands[0] == 'variado') {
            commands[0] = 'misc'
        } 
        
        if (categories.includes(commands[0])){
            if (commands[0] === 'all') {
                commands = botInfo.block_cmds.map(command => prefix+command)
            } else {
                commands = getCommandsByCategory(botInfo, commands[0] as CategoryCommand)
            }
        }

        for(let command of commands){
            if (botInfo.block_cmds.includes(waLib.removePrefix(prefix, command))) {
                let commandIndex = botInfo.block_cmds.findIndex(command_blocked => command_blocked == waLib.removePrefix(prefix, command))
                botInfo.block_cmds.splice(commandIndex, 1)
                unblockResponse += buildText(adminCommands.dcmdglobal.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(adminCommands.dcmdglobal.msgs.reply_item_not_blocked, command)
            }
        }

        this.updateBot(botInfo)
        return unblockResponse
    }

    public isCommandBlockedGlobally(command: string){
        let botInfo = this.getBot()
        const {prefix} = botInfo
        return botInfo.block_cmds.includes(waLib.removePrefix(prefix, command))
    }
}