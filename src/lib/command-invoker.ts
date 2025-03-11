import { WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { getCommandCategory, getCommandGuide, messageErrorCommand, showCommandConsole } from "./util.js";
import { Group } from "../interfaces/group.interface.js";
import { BaileysController } from "../controllers/baileys.controller.js";
import { Commands, CategoryCommand} from "../interfaces/command.interface.js";
import getCommands from "../commands/list.commands.js";
import { autoSticker } from "../commands/category-sticker.commands.js";
import getGeneralMessages from "./general-messages.js";

export async function commandInvoker(client: WASocket, botInfo: Bot, message: Message, group: Group|null){
    const isGuide = (!message.args.length) ? false : message.args[0] === 'guia'
    const categoryCommand = getCommandCategory(message.command, botInfo.prefix)
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
    const commandWithoutPrefix = message.command.replace(botInfo.prefix, '')

    try{
        switch (categoryCommand) {
            case 'info':
                //Categoria INFO
                if(isGuide) {
                    await sendCommandGuide(client, botInfo, message, categoryCommand)
                } else {
                    if(Object.keys(commandsData.info).includes(commandWithoutPrefix)){
                        const commandsInfo = commandsData.info as Commands
                        await commandsInfo[commandWithoutPrefix].function(client, botInfo, message, group || undefined)
                        showCommandConsole(message.isGroupMsg, "INFO", message.command, "#8ac46e", message.t, message.pushname, group?.name)
                    }
                }
                break
            case 'utility':
                //Categoria UTILIDADE
                if(isGuide){
                    await sendCommandGuide(client, botInfo, message, categoryCommand)
                } else {
                    if(Object.keys(commandsData.utility).includes(commandWithoutPrefix)){
                        const commandsUtility = commandsData.utility as Commands
                        await commandsUtility[commandWithoutPrefix].function(client, botInfo, message, group || undefined)
                        showCommandConsole(message.isGroupMsg, "UTILIDADE", message.command, "#de9a07", message.t, message.pushname, group?.name)
                    }                
                }
                break
            case 'sticker':
                //Categoria STICKER
                if(isGuide){
                    await sendCommandGuide(client, botInfo, message, categoryCommand)
                } else {
                    if(Object.keys(commandsData.sticker).includes(commandWithoutPrefix)){
                        const commandsSticker = commandsData.sticker as Commands
                        await commandsSticker[commandWithoutPrefix].function(client, botInfo, message, group || undefined)
                        showCommandConsole(message.isGroupMsg, "STICKER", message.command, "#ae45d1", message.t, message.pushname, group?.name)
                    }         
                }
                break
            case 'download':
                //Categoria DOWNLOAD
                if(isGuide){
                    await sendCommandGuide(client, botInfo, message, categoryCommand)
                } else {
                    if(Object.keys(commandsData.download).includes(commandWithoutPrefix)){
                        const commandsDownload = commandsData.download as Commands
                        await commandsDownload[commandWithoutPrefix].function(client, botInfo, message, group || undefined)
                        showCommandConsole(message.isGroupMsg, "DOWNLOAD", message.command, "#2195cf", message.t, message.pushname, group?.name)
                    }         
                }
                break
            case 'fun':
                //Categoria DIVERSÃO
                if(isGuide){
                    await sendCommandGuide(client, botInfo, message, categoryCommand)
                } else {
                    if(Object.keys(commandsData.fun).includes(commandWithoutPrefix)){
                        const commandsFun = commandsData.fun as Commands
                        await commandsFun[commandWithoutPrefix].function(client, botInfo, message, group || undefined)
                        showCommandConsole(message.isGroupMsg, "DIVERSÃO", message.command, "#22e3dd", message.t, message.pushname, group?.name)
                    }         
                }
                break
            case 'group':
                //Categoria GRUPO
                if(!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)

                if(isGuide){
                    await sendCommandGuide(client, botInfo, message, categoryCommand)
                } else {
                    if(Object.keys(commandsData.group).includes(commandWithoutPrefix)){
                        const commandsGroup = commandsData.group as Commands
                        await commandsGroup[commandWithoutPrefix].function(client, botInfo, message, group)
                        showCommandConsole(message.isGroupMsg, "GRUPO", message.command, "#e0e031", message.t, message.pushname, group?.name)
                    }         
                }
                break
            case 'admin':
                //Categoria ADMIN
                showCommandConsole(message.isGroupMsg, "ADMINISTRAÇÃO", message.command, "#d1d1d1", message.t, message.pushname, group?.name)
                break
            default:
                //Outros - Autosticker
                if((message.isGroupMsg && group?.autosticker) || (!message.isGroupMsg && botInfo.autosticker)){
                    await autoSticker(client, botInfo, message, group || undefined)
                    showCommandConsole(message.isGroupMsg, "STICKER", "AUTO-STICKER", "#ae45d1", message.t, message.pushname, group?.name)
                }
                break
        }
    } catch(err: any){
        await new BaileysController(client).replyText(message.chat_id, messageErrorCommand(botInfo, message.command, err.message), message.wa_message)
    }

}

async function sendCommandGuide(client: WASocket, botInfo: Bot, message : Message, category: CategoryCommand){
    await new BaileysController(client).replyText(message.chat_id, getCommandGuide(botInfo, message.command, category), message.wa_message)
}