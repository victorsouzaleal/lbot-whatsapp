import { downloadMediaMessage, WASocket, S_WHATSAPP_NET } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { Group, ParticipantCounter } from "../interfaces/group.interface.js";
import { BaileysController } from "../controllers/baileys.controller.js";
import { buildText, getCurrentBotVersion, messageErrorCommandUsage, timestampToDate } from "../lib/util.js";
import getGeneralMessages from "../lib/general-messages.js";
import getCommands from "./list.commands.js";
import { UserController } from "../controllers/user.controller.js";
import { GroupController } from "../controllers/group.controller.js";
import { BotController } from "../controllers/bot.controller.js";
import { adminMenu } from "../lib/menu.js";

export async function adminCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    await baileysController.replyText(message.chat_id, adminMenu(botInfo), message.wa_message)
}

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

export async function sairCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const groupController = new GroupController()
    const commandsData = getCommands(botInfo)
    
    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let currentGroups = await groupController.getAllGroups()
    let chosenGroupNumber = Number(message.text_command)
    const indexGroup = chosenGroupNumber - 1

    if (!chosenGroupNumber || !currentGroups[indexGroup]) throw new Error(commandsData.admin.sair.msgs.error)

    const replyText = buildText(commandsData.admin.sair.msgs.reply, currentGroups[indexGroup].name, chosenGroupNumber)

    await baileysController.leaveGroup(currentGroups[indexGroup].id)

    if (message.isGroupMsg && currentGroups[indexGroup].id == message.chat_id) await baileysController.sendText(message.sender, replyText)
    else await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function vergruposCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const groupController = new GroupController()
    const commandsData = getCommands(botInfo)

    const currentGroups = await groupController.getAllGroups()
    let replyText = buildText(commandsData.admin.vergrupos.msgs.reply_title, currentGroups.length)
    let groupNumber = 0

    for (let group of currentGroups){
        groupNumber++
        const adminsGroup = group.admins
        const isBotGroupAdmin = adminsGroup.includes(botInfo.host_number)
        const linkGroupCommand = isBotGroupAdmin ? `${botInfo.prefix}linkgrupo ${groupNumber}` : '----'
        replyText += buildText(commandsData.admin.vergrupos.msgs.reply_item, groupNumber, group.name, group.participants.length, adminsGroup.length,  isBotGroupAdmin ? "Sim" : "Não",  linkGroupCommand, groupNumber)
    }

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function sairgruposCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const groupController = new GroupController()
    const commandsData = getCommands(botInfo)

    const currentGroups = await groupController.getAllGroups()
    const replyText = buildText(commandsData.admin.sairgrupos.msgs.reply, currentGroups.length)

    currentGroups.forEach(async (group) =>{
        await baileysController.leaveGroup(group.id)
    })

    if (message.isGroupMsg) await baileysController.sendText(message.sender, replyText)
    else await baileysController.replyText(message.chat_id, replyText, message.wa_message) 
}

export async function linkgrupoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const groupController = new GroupController()
    const commandsData = getCommands(botInfo)
    
    if(!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let currentGroups = await groupController.getAllGroups()
    let chosenGroupNumber = Number(message.text_command)
    const indexGroup = chosenGroupNumber - 1

    if(!chosenGroupNumber || !currentGroups[indexGroup]) throw new Error(commandsData.admin.linkgrupo.msgs.error_not_found)
    if(!currentGroups[indexGroup].admins.includes(botInfo.host_number)) throw new Error(commandsData.admin.linkgrupo.msgs.error_bot_not_admin)

    const inviteLink = await baileysController.getGroupInviteLink(currentGroups[indexGroup].id)
    const replyTextAdmin = buildText(commandsData.admin.linkgrupo.msgs.reply_admin, currentGroups[indexGroup].name, chosenGroupNumber, inviteLink)

    if(message.isGroupMsg){
        const replyText = commandsData.admin.linkgrupo.msgs.reply_group
        await baileysController.replyText(message.chat_id, replyText, message.wa_message)
        await baileysController.sendText(message.sender, replyTextAdmin)
    } else {
        await baileysController.replyText(message.chat_id, replyTextAdmin, message.wa_message)
    }
}

export async function veradminsCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const generalText = getGeneralMessages(botInfo)

    if(!message.isBotOwner) throw new Error(generalText.permission.owner_bot_only)

    const adminsBot = await userController.getAdmins()
    let replyText = buildText(commandsData.admin.veradmins.msgs.reply_title, adminsBot.length)

    adminsBot.forEach((admin) => {
        const adminNumberList  = adminsBot.indexOf(admin) + 1
        const userType = admin.owner ? generalText.user_types.owner : (admin.admin ? generalText.user_types.admin  : generalText.user_types.user)
        replyText += buildText(commandsData.admin.veradmins.msgs.reply_item, adminNumberList, admin.name, admin.id.replace(S_WHATSAPP_NET, ''), userType)
    })

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function addadminCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const generalText = getGeneralMessages(botInfo)

    if(!message.isBotOwner) throw new Error(generalText.permission.owner_bot_only)

    const currentAdmins = await userController.getAdmins()
    const currentAdminsId = currentAdmins.map(user => user.id)
    let targetUserId : string

    if (message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage?.sender
    else if (message.mentioned.length) targetUserId = message.mentioned[0]
    else if (message.args.length) targetUserId = message.text_command.replace(/\W+/g,"") + S_WHATSAPP_NET
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    const userData = await userController.getUser(targetUserId)

    if(!userData) throw new Error(commandsData.admin.addadmin.msgs.error_user_not_found)
    if(currentAdminsId.includes(userData.id)) throw new Error(commandsData.admin.addadmin.msgs.error_already_admin)

    await userController.promoteUser(userData.id)
    const replyText = buildText(commandsData.admin.addadmin.msgs.reply, userData.id.replace(S_WHATSAPP_NET, ''), userData.name)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function rmadminCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const generalText = getGeneralMessages(botInfo)

    if(!message.isBotOwner) throw new Error(generalText.permission.owner_bot_only)

    const currentAdmins = await userController.getAdmins()
    const ownerData = await userController.getOwner()
    const currentAdminsId = currentAdmins.map(user => user.id)
    let targetUserId : string

    if (message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage?.sender
    else if (message.mentioned.length) targetUserId = message.mentioned[0]
    else if (message.args.length == 1 && message.args[0].length <= 3) targetUserId = currentAdmins[parseInt(message.text_command) - 1].id
    else if (message.args.length) targetUserId = message.text_command.replace(/\W+/g,"") + S_WHATSAPP_NET
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    const userData = await userController.getUser(targetUserId)

    if(!userData) throw new Error(commandsData.admin.rmadmin.msgs.error_user_not_found)
    if(!currentAdminsId.includes(userData.id)) throw new Error(commandsData.admin.rmadmin.msgs.error_not_admin)
    if(ownerData?.id == userData.id) throw new Error(commandsData.admin.rmadmin.msgs.error_demote_owner)

    await userController.demoteUser(userData.id)
    const replyText = buildText(commandsData.admin.addadmin.msgs.reply, userData.id.replace(S_WHATSAPP_NET, ''), userData.name)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function comandospvCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)
    const replyText = botInfo.commands_pv ? commandsData.admin.comandospv.msgs.reply_off : commandsData.admin.comandospv.msgs.reply_on

    botController.setCommandsPv(!botInfo.commands_pv)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}


