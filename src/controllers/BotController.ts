import { BotService } from "../services/BotService.js"
import { UsersType } from "../modules/interfaces.js"

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

    public incrementExecutedCommands(){
        return this.botService.incrementExecutedCommands()
    }


    // Bot features
    // Autosticker
    public setAutosticker(status: boolean){
        return this.botService.setAutosticker(status)
    }

    // PV liberado
    public setPvAllowed(status: boolean){
        return this.botService.setPvAllowed(status)
    }

    // Antispam
    public setAntispamCommands(status = true, maxCommandsMinute = 5, blockTime = 60){
        return this.botService.setAntispamCommands(status, maxCommandsMinute, blockTime)
    }

    public isCommandSpam(user_id: string, isAdminBot: boolean, isAdminGroup: boolean){
        return this.botService.isSpamCommand(user_id, isAdminBot, isAdminGroup)
    }

    // Block/Unblock commands globally
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