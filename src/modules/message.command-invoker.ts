import { WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { getCommandCategory, getCommandGuide, showCommandConsole } from "./util.js";
import { Group } from "../interfaces/group.interface.js";
import { categoryInfo } from "./commands/commands.category-info.js";
import { BaileysController } from "../controllers/BaileysController.js";
import { CommandCategory } from "../interfaces/command.interface.js";

export async function commandInvoker(client: WASocket, botInfo: Bot, message: Message, group: Group|null){
    const isGuide = (!message.args.length) ? false : message.args[0] === 'guia'
    const commandCategory = getCommandCategory(message.command, botInfo.prefix)

    switch (commandCategory) {
        case 'info':
            //Categoria INFO
            if(isGuide){
                await sendCommandGuide(client, botInfo, message, commandCategory)
                return
            } else {
                await categoryInfo(client, botInfo, message, group)
                showCommandConsole(message.isGroupMsg, "INFO", message.command, "#8ac46e", message.t, message.pushname, group?.name)
            }
            break
        case 'utility':
            //Categoria UTILIDADE
            showCommandConsole(message.isGroupMsg, "UTILIDADE", message.command, "#de9a07", message.t, message.pushname, group?.name)
            break
        case 'sticker':
            //Categoria STICKER
            showCommandConsole(message.isGroupMsg, "FIGURINHA", message.command, "#ae45d1", message.t, message.pushname, group?.name)
            break
        case 'download':
            //Categoria DOWNLOAD
            showCommandConsole(message.isGroupMsg, "DOWNLOAD", message.command, "#2195cf", message.t, message.pushname, group?.name)
            break
        case 'fun':
            //Categoria DIVERSÃO
            showCommandConsole(message.isGroupMsg, "DIVERSÃO", message.command, "#22e3dd", message.t, message.pushname, group?.name)
            break
        case 'group':
            //Categoria GRUPO
            showCommandConsole(message.isGroupMsg, "GRUPO", message.command, "#e0e031", message.t, message.pushname, group?.name)
            break
        case 'admin':
            //Categoria ADMIN
            showCommandConsole(message.isGroupMsg, "ADMINISTRAÇÃO", message.command, "#d1d1d1", message.t, message.pushname, group?.name)
            break
        default:
            //Outros - Autosticker
            showCommandConsole(message.isGroupMsg, "FIGURINHA", "AUTO-STICKER", "#ae45d1", message.t, message.pushname, group?.name)
            break
    }
}

async function sendCommandGuide(client: WASocket, botInfo: Bot, message : Message, category: CommandCategory){
    await new BaileysController(client).replyText(message.chat_id, getCommandGuide(botInfo, message.command, category), message.wa_message)
}