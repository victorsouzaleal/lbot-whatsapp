import { WASocket } from "baileys";
import { Bot } from "../../interfaces/bot.interface.js";
import { Message } from "../../interfaces/message.interface.js";
import { Group } from "../../interfaces/group.interface.js";
import { BaileysController } from "../../controllers/BaileysController.js";
import { buildText, getCurrentBotVersion, messageErrorCommand, messageErrorCommandUsage, timestampToDate } from "../util.js";
import getGeneralMessagesBot from "../bot.general-messages.js";
import getCommandsBot from "./commands.list.js";
import { UserController } from "../../controllers/UserController.js";
import { GroupController } from "../../controllers/GroupController.js";
import * as menu from "./commands.menu-builder.js";

export async function categoryInfo(client: WASocket, botInfo: Bot, message: Message, group: Group|null){
    const baileysController = new BaileysController(client)
    const commandWithoutPrefix = message.command.replace(botInfo.prefix, '')
    try{
        switch(commandWithoutPrefix){
            case 'info':
                await commandInfo(baileysController, botInfo, message)
                break
            case 'reportar':
                await commandReport(baileysController, botInfo, message)
                break
            case 'meusdados':
                await commandMyData(baileysController, botInfo, group, message)
                break
            case 'menu':
                await commandMenu(baileysController, botInfo, message)
                break
        }
    } catch (err : any){
        await baileysController.replyText(message.chat_id, messageErrorCommand(botInfo, message.command, err.message), message.wa_message)
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

async function commandReport(baileysController: BaileysController, botInfo: Bot, message: Message){
    if(!message.args.length){
        await baileysController.replyText(message.chat_id, messageErrorCommandUsage(botInfo, message.command) , message.wa_message)
        return
    } 
    const commandsData = getCommandsBot(botInfo)
    const adminBot = await new UserController().getAdminId()
    if(!adminBot)
        throw new Error(commandsData.info.reportar.msgs.error)
    let replyAdmin = buildText(commandsData.info.reportar.msgs.reply_admin, message.pushname, message.sender.replace("@s.whatsapp.net",""), message.text_command)
    await baileysController.sendText(adminBot, replyAdmin)
    await baileysController.replyText(message.chat_id, commandsData.info.reportar.msgs.reply, message.wa_message)
}

async function commandMyData(baileysController: BaileysController, botInfo: Bot, group: Group|null, message: Message){
    const commandsData = getCommandsBot(botInfo)
    let userData = await new UserController().getUser(message.sender)
    if(!userData) throw new Error(commandsData.info.meusdados.msgs.error_not_found)
    let userName = userData.name || ''
    let userType = userData.admin ? '💻 Admin'  : '👤 Comum'
    let replyMessage = buildText(commandsData.info.meusdados.msgs.reply, userType, userName, userData.commands)
    if(message.isGroupMsg && group){
        if(group.counter.status){
            const groupController = new GroupController()
            let userActivity = await groupController.getParticipantActivity(group.id, message.sender)
            replyMessage = buildText(commandsData.info.meusdados.msgs.reply_group, userType, userName, userData.commands, userActivity?.msgs)
        }   
    }
    await baileysController.replyText(message.chat_id, replyMessage, message.wa_message)
}

async function commandMenu(baileysController: BaileysController, botInfo: Bot, message: Message){
    const commandsData = getCommandsBot(botInfo)
    let userData = await new UserController().getUser(message.sender)
    if(!userData) 
        throw new Error(commandsData.info.menu.msgs.error_user_not_found)
    let userType = userData.admin ? '💻 Admin'  : '👤 Comum'
    let response = ''
    response = buildText(commandsData.info.menu.msgs.reply, userData.name, userType, userData.commands)
    response += `═════════════════\n`
    if(!message.args.length){
        response += menu.mainMenu(botInfo)
    } else {
        let commandText = message.text_command.trim()
        switch(commandText){
            case "0":
                response += menu.infoMenu(botInfo)
                break
            case "1":
                response += menu.stickerMenu(botInfo)
                break
            case "2":
                response += menu.utilityMenu(botInfo)
                break
            case "3":
                response += menu.downloadMenu(botInfo)
                break
            case "4":
                if(!message.isGroupMsg)
                    throw new Error(getGeneralMessagesBot(botInfo).permission.group)
                if(message.isGroupAdmin) 
                    response += menu.groupAdminMenu(botInfo)
                else 
                    response += menu.groupMenu(botInfo)
                break
            case "5":
                if(message.isGroupMsg)
                    response += menu.funGroupMenu(botInfo)
                else
                    response += menu.funMenu(botInfo)
                break
            default:
                throw new Error(commandsData.info.menu.msgs.error_invalid_option)
        }
    }

    await baileysController.sendText(message.chat_id, response)
}

