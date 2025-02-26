import { WASocket } from "baileys";
import { Bot } from "../../interfaces/bot.interface.js";
import { Message } from "../../interfaces/message.interface.js";
import { Group } from "../../interfaces/group.interface.js";
import { BaileysController } from "../../controllers/BaileysController.js";
import { buildText, getCurrentBotVersion, timestampToDate } from "../util.js";
import getGeneralMessagesBot from "../bot.general-messages.js";
import getCommandsBot from "./commands.list.js";
import { UserController } from "../../controllers/UserController.js";

export async function categoryInfo(client: WASocket, botInfo: Bot, message: Message, group: Group|null){
    const baileysController = new BaileysController(client)
    const {command, chat_id, sender, args} = message
    const generalMessages = getGeneralMessagesBot(botInfo)
    const commandWithoutPrefix = command.replace(botInfo.prefix, '')

    try{
        switch(commandWithoutPrefix){
            case 'info':
                await commandInfo(baileysController, botInfo, message)
                break
        }
    } catch (err : any){
        await baileysController.replyText(chat_id, buildText(generalMessages.error_command, command, err.message), message.wa_message)
    }
}

async function commandInfo(baileysController: BaileysController, botInfo: Bot, message: Message){
    const commandsData = getCommandsBot(botInfo)
    const admin = await new UserController().getAdminId() || ''
    let currentVersion = getCurrentBotVersion()
    let startedDate = timestampToDate(botInfo.started)
    let reply = buildText(commandsData.info.info.msgs.reply, botInfo.name.trim(), startedDate, botInfo.executed_cmds, admin.replace("@s.whatsapp.net", ""), currentVersion)
    baileysController.getProfilePicUrl(botInfo.host_number).then(async(url)=>{
        if(url)
            await baileysController.replyFileFromUrl(message.chat_id, "imageMessage", url, reply, message.wa_message)
        else 
            await baileysController.replyText(message.chat_id, reply, message.wa_message)
    }).catch(async()=>{
        await baileysController.replyText(message.chat_id, reply, message.wa_message)
    })
}

