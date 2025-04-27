import { BotService } from "../services/bot.service.js"

export class BotController {
    private botService
    
    constructor(){
        this.botService = new BotService()
    }

    public startBot(hostNumber : string){
        return this.botService.startBot(hostNumber)
    }

    public migrateBot(){
        return this.botService.migrateBot()
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

    public setDbMigrated(status: boolean) {
        return this.botService.setDbMigrated(status)
    }    

    public incrementExecutedCommands(){
        return this.botService.incrementExecutedCommands()
    }

    public setAutosticker(status: boolean){
        return this.botService.setAutosticker(status)
    }

    public setAdminMode(status: boolean){
        return this.botService.setAdminMode(status)
    }

    public setCommandsPv(status: boolean){
        return this.botService.setCommandsPv(status)
    }

    public setCommandRate(status = true, maxCommandsMinute = 5, blockTime = 60){
        return this.botService.setCommandRate(status, maxCommandsMinute, blockTime)
    }

    public blockCommandsGlobally(prefix: string, commands: string[]){
        return this.botService.blockCommandsGlobally(prefix, commands)
    }

    public unblockCommandsGlobally(prefix: string, commands: string[]){
        return this.botService.unblockCommandsGlobally(prefix, commands)
    }
}