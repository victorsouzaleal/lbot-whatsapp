import { Bot } from "../interfaces/bot.interface.js"
import { CategoryCommand } from "../interfaces/command.interface.js"
import path from "node:path"
import fs from 'fs-extra'
import moment from "moment-timezone"
import { buildText, commandExist } from "../lib/util.js"
import getCommandsBot from "../lib/commands-list.js"

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

    initBot(){
        const bot : Bot = {
            started : 0,
            host_number: '',
            name: "LBOT",
            author_sticker: "Leal",
            pack_sticker: "LBOT Sticker",
            prefix: "!",
            executed_cmds: 0,
            autosticker: false,
            block_cmds: [],    
            antispam_cmds:{
                status: false,
                max_cmds_minute: 5,
                block_time: 60,
                users: [],
                limited_users: []
            },
            pv_allowed: true 
        }

        this.updateBot(bot)
    }

    startBot(hostNumber : string){
        let bot = this.getBot()
        bot.started = moment.now()
        bot.host_number = hostNumber
        this.updateBot(bot)
    }

    getBot(){
        return JSON.parse(fs.readFileSync(this.pathJSON, {encoding: "utf-8"})) as Bot
    }

    setNameBot(name: string){
        let bot = this.getBot()
        bot.name = name
        return this.updateBot(bot)
    }

    setAuthorSticker(name: string){
        let bot = this.getBot()
        bot.author_sticker = name
        return this.updateBot(bot)
    }

    setPackSticker(name: string){
        let bot = this.getBot()
        bot.pack_sticker = name
        return this.updateBot(bot)
    }
    
    setPrefix(prefix: string){
        let bot = this.getBot()
        bot.prefix = prefix
        return this.updateBot(bot)
    }

    incrementExecutedCommands(){
        let bot = this.getBot()
        bot.executed_cmds++
        return this.updateBot(bot)
    }


    //Bot Features
    // Autosticker
    setAutosticker(status: boolean){
        let bot = this.getBot()
        bot.autosticker = status
        return this.updateBot(bot)
    }

    // PV liberado
    setPvAllowed(status: boolean){
        let bot = this.getBot()
        bot.pv_allowed = status
        return this.updateBot(bot)
    }

    // Antispam
    setAntispamCommands(status: boolean, maxCommandsMinute: number, blockTime: number){
        let bot = this.getBot()
        bot.antispam_cmds.status = status
        bot.antispam_cmds.max_cmds_minute = maxCommandsMinute
        bot.antispam_cmds.block_time = blockTime
        return this.updateBot(bot)
    }

    isSpamCommand(userId: string, isAdminBot: boolean, isAdminGroup: boolean){
        let bot = this.getBot()
        const CURRENT_TIMESTAMP =  Math.round(moment.now()/1000)
        let isSpam = false

        //VERIFICA OS USUARIOS LIMITADOS QUE JÁ ESTÃO EXPIRADOS E REMOVE ELES DA LISTA
        for (let i = 0; i < bot.antispam_cmds.limited_users.length; i++){
            if(bot.antispam_cmds.limited_users[i].expiration <= CURRENT_TIMESTAMP) bot.antispam_cmds.limited_users.splice(i,1)
        }

        //VERIFICA OS USUARIOS QUE JÁ ESTÃO COM COMANDO EXPIRADOS NO ULTIMO MINUTO
        for (let i = 0; i < bot.antispam_cmds.users.length; i++){
            if(bot.antispam_cmds.users[i].expiration <= CURRENT_TIMESTAMP) bot.antispam_cmds.users.splice(i,1)
        }

        //SE NÃO FOR UM USUARIO ADMIN E NÃO FOR ADMINISTRADOR DO GRUPO , FAÇA A CONTAGEM.
        if(!isAdminBot && !isAdminGroup){
            //VERIFICA SE O USUARIO ESTÁ LIMITADO
            let limitedUserIndex = bot.antispam_cmds.limited_users.findIndex(usuario => usuario.id_user == userId)
            //SE O USUÁRIO NÃO ESTIVER LIMITADO
            if(limitedUserIndex === -1){
                //OBTEM O INDICE DO USUARIO NA LISTA DE USUARIOS
                let userIndex = bot.antispam_cmds.users.findIndex(user=> user.id_user == userId)
                //VERIFICA SE O USUARIO ESTÁ NA LISTA DE USUARIOS
                if(userIndex !== -1){
                    bot.antispam_cmds.users[userIndex].cmds++ //ADICIONA A CONTAGEM DE COMANDOS ATUAIS
                    if(bot.antispam_cmds.users[userIndex].cmds >= bot.antispam_cmds.max_cmds_minute){ //SE ATINGIR A QUANTIDADE MAXIMA DE COMANDOS POR MINUTO
                        //ADICIONA A LISTA DE USUARIOS LIMITADOS
                        bot.antispam_cmds.limited_users.push({id_user: userId, expiration: CURRENT_TIMESTAMP + bot.antispam_cmds.block_time})
                        bot.antispam_cmds.users.splice(userIndex, 1)
                        isSpam = true
                    }
                } else {//SE NÃO EXISTIR NA LISTA
                    bot.antispam_cmds.users.push({id_user: userId, cmds: 1, expiration: CURRENT_TIMESTAMP+60})
                }
            }
        }

        this.updateBot(bot)
        return isSpam
    }

    // Block/Unblock Commands
    blockCommandsGlobally(commands : string[]){
        let botInfo = this.getBot()
        const COMMANDS_DATA = getCommandsBot(botInfo)
        const {prefix: PREFIX} = botInfo
        let blockResponse = COMMANDS_DATA.admin.bcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] = ['sticker', 'utility', 'download', 'fun']

        if(categories.includes(commands[0] as CategoryCommand)) commands = Object.keys(COMMANDS_DATA[commands[0] as CategoryCommand]).map(command => PREFIX+command)

        for(let command of commands){
            if(commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'fun') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')){
                if(botInfo.block_cmds.includes(command.replace(PREFIX, ''))){
                    blockResponse += buildText(COMMANDS_DATA.admin.bcmdglobal.msgs.reply_item_already_blocked, command)
                } else {
                    botInfo.block_cmds.push(command.replace(PREFIX, ''))
                    blockResponse += buildText(COMMANDS_DATA.admin.bcmdglobal.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info') ){
                blockResponse += buildText(COMMANDS_DATA.admin.bcmdglobal.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(COMMANDS_DATA.admin.bcmdglobal.msgs.reply_item_not_exist, command)
            }
        }

        this.updateBot(botInfo)
        return blockResponse
    }

    unblockCommandsGlobally(commands: string[]){
        let botInfo = this.getBot()
        const COMMANDS_DATA = getCommandsBot(botInfo)
        const {prefix} = botInfo
        let unblockResponse = COMMANDS_DATA.admin.dcmdglobal.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'fun']

        if(categories.includes(commands[0])){
            if(commands[0] === 'all') commands = botInfo.block_cmds.map(command => prefix+command)
            else commands = Object.keys(COMMANDS_DATA[commands[0] as CategoryCommand]).map(command => prefix+command)
        }

        for(let command of commands){
            if(botInfo.block_cmds.includes(command.replace(prefix, ''))) {
                let commandIndex = botInfo.block_cmds.findIndex(command_blocked=> command_blocked == command)
                botInfo.block_cmds.splice(commandIndex,1)
                unblockResponse += buildText(COMMANDS_DATA.admin.dcmdglobal.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(COMMANDS_DATA.admin.dcmdglobal.msgs.reply_item_not_blocked, command)
            }
        }

        this.updateBot(botInfo)
        return unblockResponse
    }

    isCommandBlockedGlobally(command: string){
        let botInfo = this.getBot()
        const {prefix} = botInfo
        return botInfo.block_cmds.includes(command.replace(prefix, ''))
    }
}