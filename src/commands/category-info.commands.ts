import { WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { Group } from "../interfaces/group.interface.js";
import * as Whatsapp from '../lib/whatsapp.js'
import { buildText, getCurrentBotVersion, removeWhatsappSuffix, addWhatsappSuffix, messageErrorCommandUsage, timestampToDate } from "../lib/util.js";
import getGeneralMessages from "../lib/general-messages.js";
import getCommands from "./list.commands.js";
import { UserController } from "../controllers/user.controller.js";
import { GroupController } from "../controllers/group.controller.js";
import * as menu from "../lib/menu.js";

export async function infoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const blockedUsers = await Whatsapp.getBlockedContacts(client)
    const adminsBot = await userController.getAdmins()
    const adminsBotContacts = adminsBot.map(admin => `- wa.me/${removeWhatsappSuffix(admin.id)}\n`)

    let version = getCurrentBotVersion()
    let botStartedAt = timestampToDate(botInfo.started)
    let replyText = buildText(commandsData.info.info.msgs.reply_title, botInfo.name?.trim(), botStartedAt, version, botInfo.executed_cmds, adminsBotContacts)

    if(message.isBotAdmin){
        replyText += commandsData.info.info.msgs.reply_title_resources
        // AUTO-STICKER
        replyText += (botInfo.autosticker) ? commandsData.info.info.msgs.reply_item_autosticker_on: commandsData.info.info.msgs.reply_item_autosticker_off
        // PV LIBERADO
        replyText += (botInfo.commands_pv) ? commandsData.info.info.msgs.reply_item_commandspv_on : commandsData.info.info.msgs.reply_item_commandspv_off
        // TAXA DE COMANDOS POR MINUTO
        replyText += (botInfo.command_rate.status) ? buildText(commandsData.info.info.msgs.reply_item_commandsrate_on, botInfo.command_rate.max_cmds_minute, botInfo.command_rate.block_time) : commandsData.info.info.msgs.reply_item_commandsrate_off
        // BLOQUEIO DE COMANDOS
        let blockedCommands = []

        for(let commandName of botInfo.block_cmds){
            blockedCommands.push(botInfo.prefix+commandName)
        }
        replyText += (botInfo.block_cmds.length != 0) ? buildText(commandsData.info.info.msgs.reply_item_blockcmds_on, blockedCommands.toString()) : commandsData.info.info.msgs.reply_item_blockcmds_off
        //USUARIOS BLOQUEADOS
        replyText += buildText(commandsData.info.info.msgs.reply_item_blocked_count, blockedUsers.length)
    }

    //RESPOSTA
    await Whatsapp.getProfilePicUrl(client, botInfo.host_number).then(async (pic)=>{
        if (pic) await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', pic, replyText, message.wa_message, {expiration: message.expiration})
        else await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
    }).catch(async ()=>{
        await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
    })
}

export async function reportarCommand(client: WASocket, botInfo: Bot, message: Message, group?: Group){
    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const commandsData = getCommands(botInfo)
    const admins = await new UserController().getAdmins()

    if (!admins.length) throw new Error(commandsData.info.reportar.msgs.error)

    admins.forEach(async (admin) => {
        let replyAdmin = buildText(commandsData.info.reportar.msgs.reply_admin, message.pushname, removeWhatsappSuffix(message.sender), message.text_command)
        await Whatsapp.sendText(client, admin.id, replyAdmin)
    })

    await Whatsapp.replyText(client, message.chat_id, commandsData.info.reportar.msgs.reply, message.wa_message, {expiration: message.expiration})
}

export async function meusdadosCommand(client: WASocket, botInfo: Bot, message: Message, group?: Group){
    const generalMessages = getGeneralMessages(botInfo)
    const commandsData = getCommands(botInfo)
    const userData = await new UserController().getUser(message.sender)

    if (!userData) throw new Error(commandsData.info.meusdados.msgs.error_not_found)

    const userName = userData.name || '---'
    const userType = userData.owner ? generalMessages.user_types.owner : (userData.admin ? generalMessages.user_types.admin  : generalMessages.user_types.user)
    let replyMessage = buildText(commandsData.info.meusdados.msgs.reply, userType, userName, userData.commands)

    if (message.isGroupMsg && group){
        if (group.counter.status){
            const groupController = new GroupController()
            let userActivity = await groupController.getParticipantActivity(group.id, message.sender)
            replyMessage = buildText(commandsData.info.meusdados.msgs.reply_group, userType, userName, userData.commands, userActivity?.msgs)
        }   
    }

    await Whatsapp.replyText(client, message.chat_id, replyMessage, message.wa_message, {expiration: message.expiration})
}

export async function menuCommand(client: WASocket, botInfo: Bot, message: Message, group?: Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
    const userData = await new UserController().getUser(message.sender)

    if (!userData) throw new Error(commandsData.info.menu.msgs.error_user_not_found)

    const userType = userData.owner ? generalMessages.user_types.owner : (userData.admin ? generalMessages.user_types.admin  : generalMessages.user_types.user)
    let replyText = buildText(commandsData.info.menu.msgs.reply, userData.name, userType, userData.commands)

    if (!message.args.length){
        replyText += menu.mainMenu(botInfo)
    } else {
        const commandText = message.text_command.trim()
        switch(commandText){
            case "0":
                replyText += menu.infoMenu(botInfo)
                break
            case "1":
                replyText += menu.stickerMenu(botInfo)
                break
            case "2":
                replyText += menu.utilityMenu(botInfo)
                break
            case "3":
                replyText += menu.downloadMenu(botInfo)
                break
            case "4":
                if (!message.isGroupMsg) throw new Error(getGeneralMessages(botInfo).permission.group)

                if (message.isGroupAdmin) replyText += menu.groupAdminMenu(botInfo)
                else replyText += menu.groupMenu(botInfo)
                break
            case "5":
                if (message.isGroupMsg) replyText += menu.funGroupMenu(botInfo)
                else replyText += menu.funMenu(botInfo)
                break
            default:
                throw new Error(commandsData.info.menu.msgs.error_invalid_option)
        }
    }

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

