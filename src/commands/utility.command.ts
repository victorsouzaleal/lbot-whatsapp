import { WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import { BaileysController } from "../controllers/baileys.controller.js"
import { messageErrorCommand } from "../lib/util.js"

export async function categoryUtility(client: WASocket, botInfo: Bot, message: Message, group: Group|null){
    const commandWithoutPrefix = message.command.replace(botInfo.prefix, '')

    try{
        switch(commandWithoutPrefix){
            case 'voz':
                
                break
        }
    } catch (err : any){
        await new BaileysController(client).replyText(message.chat_id, messageErrorCommand(botInfo, message.command, err.message), message.wa_message)
    }
}