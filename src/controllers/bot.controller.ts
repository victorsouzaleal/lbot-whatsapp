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

    // Bot features
    // Autosticker
    setAutosticker(status: boolean){
        return this.botService.setAutosticker(status)
    }

    // PV liberado
    setPvAllowed(status: boolean){
        return this.botService.setPvAllowed(status)
    }

    // Antispam
    setAntispamCommands(status = true, maxCommandsMinute = 5, blockTime = 60){
        return this.botService.setAntispamCommands(status, maxCommandsMinute, blockTime)
    }

    isCommandSpam(userId: string, isAdminBot: boolean, isAdminGroup: boolean){
        return this.botService.isSpamCommand(userId, isAdminBot, isAdminGroup)
    }

    // Block/Unblock commands globally
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