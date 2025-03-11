import { BotService } from "../services/bot.service.js"

export class BotController {
    private botService
    
    constructor(){
        this.botService = new BotService()
    }

    startBot(hostNumber : string){
        return this.botService.startBot(hostNumber)
    }

    getBot(){
        return this.botService.getBot()
    }

    setName(name: string){
        return this.botService.setNameBot(name)
    }

    setAuthorSticker(name: string){
        return this.botService.setAuthorSticker(name)
    }

    setPackSticker(name: string){
        return this.botService.setPackSticker(name)
    }

    setPrefix(prefix: string){
        return this.botService.setPrefix(prefix)
    }

    incrementExecutedCommands(){
        return this.botService.incrementExecutedCommands()
    }

    // Recursos do BOT

    // Auto-Sticker Privado
    setAutosticker(status: boolean){
        return this.botService.setAutosticker(status)
    }

    // PV liberado
    setPvAllowed(status: boolean){
        return this.botService.setPvAllowed(status)
    }

    // Taxa de comandos
    setCommandRate(status = true, maxCommandsMinute = 5, blockTime = 60){
        return this.botService.setCommandRate(status, maxCommandsMinute, blockTime)
    }

    isCommandLimitedByRate(userId: string, isAdminBot: boolean, isAdminGroup: boolean){
        return this.botService.isCommandLimitedByRate(userId, isAdminBot, isAdminGroup)
    }

    // Bloquear/Desbloquear comandos globalmente
    blockCommandsGlobally(commands: string[]){
        return this.botService.blockCommandsGlobally(commands)
    }

    unblockCommandsGlobally(commands: string[]){
        return this.botService.unblockCommandsGlobally(commands)
    }

    isCommandBlockedGlobally(command: string){
        return this.botService.isCommandBlockedGlobally(command)
    }

}