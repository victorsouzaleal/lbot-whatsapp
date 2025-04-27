import { Bot } from "../interfaces/bot.interface.js"
import path from "node:path"
import fs from 'fs-extra'
import moment from "moment-timezone"
import { waLib } from "../libraries/library.js"
import { deepMerge } from "../utils/general.util.js"

export class BotService {
    private pathJSON = path.resolve("storage/bot.json")

    private defaultBot : Bot = {
        started : 0,
        host_number: '',
        name: "LBOT",
        prefix: "!",
        executed_cmds: 0,
        db_migrated: true,
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

    constructor(){
        const storageFolderExists = fs.pathExistsSync(path.resolve("storage"))
        const jsonFileExists = fs.existsSync(this.pathJSON)
        
        if (!storageFolderExists) fs.mkdirSync(path.resolve("storage"), {recursive: true})
        if (!jsonFileExists) this.initBot()
    }

    private initBot(){
        this.updateBot(this.defaultBot)
    }

    public migrateBot() {
        const oldBotData =  this.getBot() as any
        const newBotData : Bot = deepMerge(this.defaultBot, oldBotData)
        this.deleteBotData()
        this.updateBot(newBotData)
    }

    private updateBot(bot : Bot){
        fs.writeFileSync(this.pathJSON, JSON.stringify(bot))
    }

    private deleteBotData(){
        fs.writeFileSync(this.pathJSON, JSON.stringify({}))
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
        this.updateBot(bot)
    }

    public setDbMigrated(status: boolean) {
        let bot = this.getBot()
        bot.db_migrated = status
        this.updateBot(bot)
    }
    
    public setPrefix(prefix: string){
        let bot = this.getBot()
        bot.prefix = prefix
        this.updateBot(bot)
    }

    public incrementExecutedCommands(){
        let bot = this.getBot()
        bot.executed_cmds++
        this.updateBot(bot)
    }

    public setAutosticker(status: boolean){
        let bot = this.getBot()
        bot.autosticker = status
        this.updateBot(bot)
    }

    public setAdminMode(status: boolean){
        let bot = this.getBot()
        bot.admin_mode = status
        this.updateBot(bot)
    }

    public setCommandsPv(status: boolean){
        let bot = this.getBot()
        bot.commands_pv = status
        this.updateBot(bot)
    }

    public async setCommandRate(status: boolean, maxCommandsMinute: number, blockTime: number){
        let bot = this.getBot()
        bot.command_rate.status = status
        bot.command_rate.max_cmds_minute = maxCommandsMinute
        bot.command_rate.block_time = blockTime
        this.updateBot(bot)
    }

    public blockCommandsGlobally(prefix: string, commands: string[]) {
        let botInfo = this.getBot()
        const commandsWithoutPrefix = commands.map(command => waLib.removePrefix(prefix, command))
        const blockCommands = commandsWithoutPrefix.filter(command => !botInfo.block_cmds.includes(command))
        botInfo.block_cmds.push(...blockCommands)
        this.updateBot(botInfo)
        return blockCommands.map(command => prefix+command)
    }

    public unblockCommandsGlobally(prefix: string, commands: string[]) {
        let botInfo = this.getBot()
        const commandsWithoutPrefix = commands.map(command => waLib.removePrefix(prefix, command))
        const unblockCommands = commandsWithoutPrefix.filter(command => botInfo.block_cmds.includes(command))

        unblockCommands.forEach((command) => {
            botInfo.block_cmds.splice(botInfo.block_cmds.indexOf(command), 1)
        })

        this.updateBot(botInfo)
        return unblockCommands.map(command => prefix+command)
    }
}