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

    public rebuildBot(){
        return this.botService.rebuildBot()
    }

    public getBot(){
        return this.botService.getBot()
    }

    public setName(name: string){
        return this.botService.setNameBot(name)
    }

    public setPrefix(prefix: string){
        return this.botService.setPrefix(prefix)
    }

    public setDatabaseUpdated(status: boolean) {
        return this.botService.setDatabaseUpdated(status)
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

    public isDatabaseUpdated(){
        return this.botService.isDatabaseUpdated()
    }

    // Recursos do BOT

    // Auto-Sticker PV
    public setAutosticker(status: boolean){
        return this.botService.setAutosticker(status)
    }

    // Modo admin
    public setAdminMode(status: boolean){
        return this.botService.setAdminMode(status)
    }

    // Comandos no PV
    public setCommandsPv(status: boolean){
        return this.botService.setCommandsPv(status)
    }

    // Taxa de comandos
    public setCommandRate(status = true, maxCommandsMinute = 5, blockTime = 60){
        return this.botService.setCommandRate(status, maxCommandsMinute, blockTime)
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
}