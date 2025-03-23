import { WASocket } from "baileys";
import { Bot } from "../../interfaces/bot.interface.js";
import { Message } from "../../interfaces/message.interface.js";
import { messageErrorCommand, showCommandConsole } from "../../utils/general.utils.js";
import { Group } from "../../interfaces/group.interface.js";
import { Commands } from "../../interfaces/command.interface.js";
import { autoSticker } from "../commands/sticker.functions.commands.js";
import getGeneralMessages from "../../utils/text.utils.js";
import { removePrefix, replyText } from "./whatsapp.helper.js";
import commandsInfo from "../commands/info.list.commands.js";
import { commandsUtility } from "../commands/utility.list.commands.js";
import { commandsSticker } from '../commands/sticker.list.commands.js'
import { commandsDownload } from "../commands/download.list.commands.js";
import { commandsMisc } from "../commands/misc.list.commands.js";
import { commandsGroup } from "../commands/group.list.commands.js";
import { commandsAdmin } from "../commands/admin.list.commands.js";
import { getCommandCategory, getCommandGuide } from "../../utils/commands.utils.js";

export async function commandInvoker(client: WASocket, botInfo: Bot, message: Message, group: Group|null){
    const isGuide = (!message.args.length) ? false : message.args[0] === 'guia'
    const categoryCommand = getCommandCategory(botInfo, message.command)
    const generalMessages = getGeneralMessages(botInfo)
    const commandName = removePrefix(botInfo.prefix, message.command)

    try{
        if(isGuide) return sendCommandGuide(client, botInfo, message)

        switch (categoryCommand) {
            case 'info':
                //Categoria INFO
                const infoCommands = commandsInfo(botInfo) as Commands
                if (Object.keys(infoCommands).includes(commandName)){
                    await infoCommands[commandName].function(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "INFO", message.command, "#8ac46e", message.t, message.pushname, group?.name)
                }
                break
            case 'utility':
                //Categoria UTILIDADE
                const utilityCommands = commandsUtility(botInfo) as Commands
                if (Object.keys(utilityCommands).includes(commandName)){
                    await utilityCommands[commandName].function(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "UTILIDADE", message.command, "#de9a07", message.t, message.pushname, group?.name)
                }                
                break
            case 'sticker':
                //Categoria STICKER
                const stickerCommands = commandsSticker(botInfo) as Commands
                if (Object.keys(stickerCommands).includes(commandName)){
                    await stickerCommands[commandName].function(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "STICKER", message.command, "#ae45d1", message.t, message.pushname, group?.name)
                }         
                break
            case 'download':
                //Categoria DOWNLOAD
                const downloadCommands = commandsDownload(botInfo) as Commands
                if (Object.keys(downloadCommands).includes(commandName)){
                    await downloadCommands[commandName].function(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "DOWNLOAD", message.command, "#2195cf", message.t, message.pushname, group?.name)
                }         
                break
            case 'misc':
                //Categoria VARIADO
                const miscCommands = commandsMisc(botInfo) as Commands
                if (Object.keys(miscCommands).includes(commandName)){
                    await miscCommands[commandName].function(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "VARIADO", message.command, "#22e3dd", message.t, message.pushname, group?.name)
                }         
                break
            case 'group':
                //Categoria GRUPO
                if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)

                const groupCommands = commandsGroup(botInfo) as Commands
                if (Object.keys(groupCommands).includes(commandName)){
                    await groupCommands[commandName].function(client, botInfo, message, group)
                    showCommandConsole(message.isGroupMsg, "GRUPO", message.command, "#e0e031", message.t, message.pushname, group?.name)
                }         
                break
            case 'admin':
                //Categoria ADMIN
                if (!message.isBotAdmin) throw new Error(generalMessages.permission.admin_bot_only)

                const adminCommands = commandsAdmin(botInfo) as Commands
                if (Object.keys(adminCommands).includes(commandName)){
                    await adminCommands[commandName].function(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "ADMINISTRAÇÃO", message.command, "#d1d1d1", message.t, message.pushname, group?.name)
                }         
                break
            default:
                //Outros - Autosticker
                if ((message.isGroupMsg && group?.autosticker) || (!message.isGroupMsg && botInfo.autosticker)){
                    await autoSticker(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "STICKER", "AUTO-STICKER", "#ae45d1", message.t, message.pushname, group?.name)
                }
                break
        }
    } catch(err: any){
        await replyText(client, message.chat_id, messageErrorCommand(botInfo, message.command, err.message), message.wa_message, {expiration: message.expiration})
    }

}

async function sendCommandGuide(client: WASocket, botInfo: Bot, message : Message){
    await replyText(client, message.chat_id, getCommandGuide(botInfo, message.command), message.wa_message, {expiration: message.expiration})
}