import { proto } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { BotService } from "../services/bot.service.js"
import NodeCache from "node-cache"

export class BotController {
    private botService
    
    constructor(){
        this.botService = new BotService()
    }

    public startBot(hostNumber : string){
        return this.botService.startBot(hostNumber)
    }

    public getBot(){
        return this.botService.getBot()
    }

    public setName(name: string){
        return this.botService.setNameBot(name)
    }

    public setAuthorSticker(name: string){
        return this.botService.setAuthorSticker(name)
    }

    public setPackSticker(name: string){
        return this.botService.setPackSticker(name)
    }

    public setPrefix(prefix: string){
        return this.botService.setPrefix(prefix)
    }

    public storeMessageOnCache(message : proto.IWebMessageInfo, messageCache : NodeCache){
        return this.botService.storeMessageOnCache(message, messageCache)
    }

    public getMessageFromCache(messageId: string, messageCache: NodeCache){
        return this.botService.getMessageFromCache(messageId, messageCache)
    }

    public incrementExecutedCommands(){
        return this.botService.incrementExecutedCommands()
    }

    // Recursos do BOT

    // Auto-Sticker PV
    public setAutosticker(status: boolean){
        return this.botService.setAutosticker(status)
    }

    // Comandos no PV
    public setCommandsPv(status: boolean){
        return this.botService.setCommandsPv(status)
    }

    // Taxa de comandos
    public setCommandRate(status = true, maxCommandsMinute = 5, blockTime = 60){
        return this.botService.setCommandRate(status, maxCommandsMinute, blockTime)
    }

    public hasExceededCommandRate(botInfo: Bot, userId: string, isBotAdmin: boolean){
        return this.botService.hasExceededCommandRate(botInfo, userId, isBotAdmin)
    }

    // Bloquear/Desbloquear comandos globalmente
    public blockCommandsGlobally(commands: string[]){
        return this.botService.blockCommandsGlobally(commands)
    }

    public unblockCommandsGlobally(commands: string[]){
        return this.botService.unblockCommandsGlobally(commands)
    }

    public isCommandBlockedGlobally(command: string){
        return this.botService.isCommandBlockedGlobally(command)
    }
    
    // Configurar API
    public setDeepgramApiKey(secret_key: string){
        return this.botService.setDeepgramApiKey(secret_key)
    }

    public setAcrcloudApiKey(host: string, access_key: string, secret_key: string){
        return this.botService.setAcrcloudApiKey(host, access_key, secret_key)
    }

}