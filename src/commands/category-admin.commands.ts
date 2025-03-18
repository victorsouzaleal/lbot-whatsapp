import { downloadMediaMessage, WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { Group } from "../interfaces/group.interface.js";
import { BaileysController } from "../controllers/baileys.controller.js";
import { buildText, removeWhatsappSuffix, addWhatsappSuffix, messageErrorCommandUsage, timestampToDate } from "../lib/util.js";
import getGeneralMessages from "../lib/general-messages.js";
import getCommands from "./list.commands.js";
import { UserController } from "../controllers/user.controller.js";
import { GroupController } from "../controllers/group.controller.js";
import { BotController } from "../controllers/bot.controller.js";
import { adminMenu } from "../lib/menu.js";
import os from 'node:os'
import moment from "moment";

export async function adminCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    await baileysController.replyText(message.chat_id, adminMenu(botInfo), message.wa_message)
}

export async function apiCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const botController = new BotController()
    const supportedServices =  ['deepgram', 'acrcloud']
    const args = message.text_command.split(',')
    
    if (!message.text_command || !supportedServices.includes(args[0].toLowerCase().trim())) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    const [serviceName] = args
    let replyText : string 

    if (serviceName.trim() == 'deepgram'){
        if (args.length != 2) throw new Error(commandsData.admin.api.msgs.reply_deepgram_error)
        const [secret_key] = args.slice(1)
        botController.setDeepgramApiKey(secret_key.trim())
        replyText = commandsData.admin.api.msgs.reply_deepgram_success
    } else {
        if (args.length != 4) throw new Error(commandsData.admin.api.msgs.reply_acrcloud_error)
        const [host, access_key, secret_key] = args.slice(1)
        botController.setAcrcloudApiKey(host.trim(), access_key.trim(), secret_key.trim())
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

    for (let group of currentGroups){
        const groupNumber = currentGroups.indexOf(group) + 1
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
    const generalMessages = getGeneralMessages(botInfo)

    if(!message.isBotOwner) throw new Error(generalMessages.permission.owner_bot_only)

    const adminsBot = await userController.getAdmins()
    let replyText = buildText(commandsData.admin.veradmins.msgs.reply_title, adminsBot.length)

    adminsBot.forEach((admin) => {
        const adminNumberList  = adminsBot.indexOf(admin) + 1
        const userType = admin.owner ? generalMessages.user_types.owner : (admin.admin ? generalMessages.user_types.admin  : generalMessages.user_types.user)
        replyText += buildText(commandsData.admin.veradmins.msgs.reply_item, adminNumberList, admin.name, removeWhatsappSuffix(admin.id), userType)
    })

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function addadminCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if(!message.isBotOwner) throw new Error(generalMessages.permission.owner_bot_only)

    const currentAdmins = await userController.getAdmins()
    const currentAdminsId = currentAdmins.map(user => user.id)
    let targetUserId : string

    if (message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage?.sender
    else if (message.mentioned.length) targetUserId = message.mentioned[0]
    else if (message.args.length) targetUserId = addWhatsappSuffix(message.text_command)
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    const userData = await userController.getUser(targetUserId)

    if(!userData) throw new Error(commandsData.admin.addadmin.msgs.error_user_not_found)
    if(currentAdminsId.includes(userData.id)) throw new Error(commandsData.admin.addadmin.msgs.error_already_admin)

    await userController.promoteUser(userData.id)
    const replyText = buildText(commandsData.admin.addadmin.msgs.reply, removeWhatsappSuffix(userData.id), userData.name)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function rmadminCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if(!message.isBotOwner) throw new Error(generalMessages.permission.owner_bot_only)

    const currentAdmins = await userController.getAdmins()
    const ownerData = await userController.getOwner()
    const currentAdminsId = currentAdmins.map(user => user.id)
    let targetUserId : string

    if (message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage?.sender
    else if (message.mentioned.length) targetUserId = message.mentioned[0]
    else if (message.args.length == 1 && message.args[0].length <= 3) targetUserId = currentAdmins[parseInt(message.text_command) - 1].id
    else if (message.args.length) targetUserId = addWhatsappSuffix(message.text_command)
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    const userData = await userController.getUser(targetUserId)

    if(!userData) throw new Error(commandsData.admin.rmadmin.msgs.error_user_not_found)
    if(!currentAdminsId.includes(userData.id)) throw new Error(commandsData.admin.rmadmin.msgs.error_not_admin)
    if(ownerData?.id == userData.id) throw new Error(commandsData.admin.rmadmin.msgs.error_demote_owner)

    await userController.demoteUser(userData.id)
    const replyText = buildText(commandsData.admin.addadmin.msgs.reply, removeWhatsappSuffix(userData.id), userData.name)
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

export async function taxacomandosCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)
    let replyText : string

    if(!botInfo.command_rate.status){
        if(!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

        let max_commands_minute = Number(message.args[0])
        let block_time = Number(message.args[1])
    
        if(!block_time) block_time = 60
        if(!max_commands_minute || max_commands_minute < 3) throw new Error(commandsData.admin.taxacomandos.msgs.error_max_commands_invalid)
        if(!block_time || block_time < 10) throw new Error(commandsData.admin.taxacomandos.msgs.error_block_time_invalid)

        replyText = buildText(commandsData.admin.taxacomandos.msgs.reply_on, max_commands_minute, block_time)
        await botController.setCommandRate(true, max_commands_minute, block_time)
    } else {
        replyText = commandsData.admin.taxacomandos.msgs.reply_off
        await botController.setCommandRate(false)
    }

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function autostickerpvCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)
    
    const replyText = botInfo.autosticker ? commandsData.admin.autostickerpv.msgs.reply_off : commandsData.admin.autostickerpv.msgs.reply_on
    botController.setAutosticker(!botInfo.autosticker)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function bcmdglobalCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const replyText = botController.blockCommandsGlobally(message.args)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function dcmdglobalCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const replyText = botController.unblockCommandsGlobally(message.args)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function entrargrupoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const linkGroup = message.text_command
    const isValidLink = linkGroup.match(/(https:\/\/chat.whatsapp.com)/gi)

    if (!isValidLink) throw new Error(commandsData.admin.entrargrupo.msgs.error_link_invalid)

    const linkId = linkGroup.replace(/(https:\/\/chat.whatsapp.com\/)/gi, '')
    const groupResponse =  await baileysController.joinGroupInviteLink(linkId).catch(() => {
        throw new Error(commandsData.admin.entrargrupo.msgs.error_group)
    })

    if(!groupResponse) await baileysController.replyText(message.chat_id, commandsData.admin.entrargrupo.msgs.reply_pending, message.wa_message)
    await baileysController.replyText(message.chat_id, commandsData.admin.entrargrupo.msgs.reply, message.wa_message)
}

export async function bcgruposCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const groupController = new GroupController()
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const currentGroups = await groupController.getAllGroups()
    const waitReply = buildText(commandsData.admin.bcgrupos.msgs.wait, currentGroups.length, currentGroups.length)
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)

    currentGroups.forEach(async (group) => {
        if(!group.restricted){
            await new Promise<void>((resolve)=>{
                setTimeout(async ()=>{
                    const announceMessage = buildText(commandsData.admin.bcgrupos.msgs.message, message.text_command)
                    await baileysController.sendText(group.id, announceMessage).catch()
                    resolve()
                }, 1000)
            })
        }
    })

    await baileysController.replyText(message.chat_id, commandsData.admin.bcgrupos.msgs.reply, message.wa_message)
}

export async function fotobotCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if(message.type != 'imageMessage' && message.quotedMessage?.type != 'imageMessage') throw new Error(messageErrorCommandUsage(botInfo, message))

    const messageData = (message.isQuoted) ? message.quotedMessage?.wa_message : message.wa_message

    if(!messageData) throw new Error(commandsData.admin.fotobot.msgs.error_message)

    let imageBuffer = await downloadMediaMessage(messageData, "buffer", {})
    await baileysController.updateProfilePic(botInfo.host_number, imageBuffer)
    await baileysController.replyText(message.chat_id, commandsData.admin.fotobot.msgs.reply, message.wa_message)
}

export async function nomebotCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    botController.setName(message.text_command)
    await baileysController.replyText(message.chat_id, commandsData.admin.nomebot.msgs.reply, message.wa_message)
}

export async function nomepackCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    botController.setPackSticker(message.text_command)
    await baileysController.replyText(message.chat_id, commandsData.admin.nomepack.msgs.reply, message.wa_message)
}

export async function nomeautorCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    botController.setAuthorSticker(message.text_command)
    await baileysController.replyText(message.chat_id, commandsData.admin.nomeautor.msgs.reply, message.wa_message)
}

export async function prefixoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const botController = new BotController()
    const commandsData = getCommands(botInfo)
    const supportedPrefixes = ["!", "#", ".", "*"]

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    if (!supportedPrefixes.includes(message.text_command)) throw new Error(commandsData.admin.prefixo.msgs.error_not_supported)

    botController.setPrefix(message.text_command)
    await baileysController.replyText(message.chat_id, commandsData.admin.prefixo.msgs.reply, message.wa_message)
}

export async function listablockCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const blockedUsers = await baileysController.getBlockedContacts()

    if (!blockedUsers.length) throw new Error(commandsData.admin.listablock.msgs.error)

    let replyText = buildText(commandsData.admin.listablock.msgs.reply_title, blockedUsers.length)

    for (let userId of blockedUsers) {
        const userPosition = blockedUsers.indexOf(userId) + 1
        replyText += buildText(commandsData.admin.listablock.msgs.reply_item, userPosition, removeWhatsappSuffix(userId))
    }

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function bloquearCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const adminsId = (await userController.getAdmins()).map(admin => admin.id)
    const blockedUsers = await baileysController.getBlockedContacts()
    const commandsData = getCommands(botInfo)
    let targetUserId : string

    if(message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage?.sender
    else if(message.mentioned.length) targetUserId = message.mentioned[0]
    else if (message.args.length) targetUserId =  addWhatsappSuffix(message.text_command)
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    if (adminsId.includes(targetUserId)){
        throw new Error(buildText(commandsData.admin.bloquear.msgs.error_block_admin_bot, removeWhatsappSuffix(targetUserId)))
    } else if (blockedUsers.includes(targetUserId)) {
        throw new Error(buildText(commandsData.admin.bloquear.msgs.error_already_blocked, removeWhatsappSuffix(targetUserId)))
    } else {
        const replyText = buildText(commandsData.admin.bloquear.msgs.reply, removeWhatsappSuffix(targetUserId))
        await baileysController.blockContact(targetUserId).catch(() => {
            throw new Error(commandsData.admin.bloquear.msgs.error_block)
        })
        await baileysController.replyText(message.chat_id, replyText, message.wa_message)
    }
}

export async function desbloquearCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const blockedUsers = await baileysController.getBlockedContacts()
    const commandsData = getCommands(botInfo)
    let targetUserId : string

    if(message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage?.sender
    else if(message.mentioned.length) targetUserId = message.mentioned[0]
    else if(message.args.length == 1 && message.args[0].length <= 3 && Number(message.args[0])) targetUserId = blockedUsers[Number(message.args[0]) - 1]
    else if (message.args.length) targetUserId =  addWhatsappSuffix(message.text_command)
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    if (!blockedUsers.includes(targetUserId)) {
        throw new Error(buildText(commandsData.admin.desbloquear.msgs.error_already_unblocked, removeWhatsappSuffix(targetUserId)))
    } else {
        const replyText = buildText(commandsData.admin.desbloquear.msgs.reply, removeWhatsappSuffix(targetUserId))
        await baileysController.unblockContact(targetUserId).catch(() => {
            throw new Error(commandsData.admin.desbloquear.msgs.error_unblock)
        })
        await baileysController.replyText(message.chat_id, replyText, message.wa_message)
    }
}

export async function recadoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    
    if(!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    await baileysController.updateProfileStatus(message.text_command)
    const replyText = buildText(commandsData.admin.recado.msgs.reply, message.text_command)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function verusuarioCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
    let targetUserId : string

    if(message.isQuoted && message.quotedMessage) targetUserId = message.quotedMessage.sender
    else if(message.mentioned.length) targetUserId = message.mentioned[0]
    else if(message.args.length) targetUserId =  addWhatsappSuffix(message.text_command)
    else throw new Error(messageErrorCommandUsage(botInfo, message))

    let userData = await userController.getUser(targetUserId)

    if (!userData) throw new Error(commandsData.admin.verusuario.msgs.error_user_not_found)

    const userType = userData.owner ? generalMessages.user_types.owner : (userData.admin ? generalMessages.user_types.admin  : generalMessages.user_types.user)
    const replyText = buildText(commandsData.admin.verusuario.msgs.reply, userData.name || '---', userType, removeWhatsappSuffix(userData.id), userData.commands)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function desligarCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    await baileysController.replyText(message.chat_id, commandsData.admin.desligar.msgs.reply, message.wa_message).then(async()=>{
        baileysController.shutdownBot()
    })
}

export async function pingCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const baileysController = new BaileysController(client)
    const userController = new UserController()
    const groupController = new GroupController()
    const commandsData = getCommands(botInfo)
    const replyTime = ((moment.now()/1000) - message.t).toFixed(2)
    const ramTotal = (os.totalmem()/1024000000).toFixed(2)
    const ramUsed = ((os.totalmem() - os.freemem())/1024000000).toFixed(2)
    const systemName = `${os.type()} ${os.release()}`
    const cpuName = os.cpus()[0].model
    const currentGroups = await groupController.getAllGroups()
    const currentUsers = await userController.getUsers()
    const botStarted = timestampToDate(botInfo.started)
    const replyText = buildText(commandsData.admin.ping.msgs.reply, systemName, cpuName, ramUsed, ramTotal, replyTime, currentUsers.length, currentGroups.length, botStarted)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}


