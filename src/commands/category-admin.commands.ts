import { downloadMediaMessage, WASocket, S_WHATSAPP_NET } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { Group, ParticipantCounter } from "../interfaces/group.interface.js";
import { BaileysController } from "../controllers/baileys.controller.js";
import { buildText, messageErrorCommandUsage } from "../lib/util.js";
import getGeneralMessages from "../lib/general-messages.js";
import getCommands from "./list.commands.js";
import { UserController } from "../controllers/user.controller.js";
import { GroupController } from "../controllers/group.controller.js";
import { BotController } from "../controllers/bot.controller.js";

export async function apiCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const botController = new BotController()
    const supportedServices =  ['deepgram', 'acrcloud']

    if (!message.args.length || !supportedServices.includes(message.args[0].toLowerCase())) throw new Error(messageErrorCommandUsage(botInfo, message))

    const [serviceName] = message.args
    let replyText : string 

    if (serviceName == 'deepgram'){
        if (message.args.length != 2) throw new Error(commandsData.admin.api.msgs.reply_deepgram_error)
        const [secret_key] = message.args.slice(1)
        botController.setDeepgramApiKey(secret_key)
        replyText = commandsData.admin.api.msgs.reply_deepgram_success
    } else {
        if (message.args.length != 4) throw new Error(commandsData.admin.api.msgs.reply_acrcloud_error)
        const [host, access_key, secret_key] = message.args.slice(1)
        botController.setAcrcloudApiKey(host, access_key, secret_key)
        replyText = commandsData.admin.api.msgs.reply_acrcloud_success
    }
    
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}