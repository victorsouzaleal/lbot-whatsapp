import { downloadMediaMessage, WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { Group } from "../interfaces/group.interface.js";
import { waLib } from "../libraries/library.js";
import { buildText, messageErrorCommandUsage } from "../utils/general.util.js";
import getBotTexts from "../utils/bot.texts.util.js";
import { UserController } from "../controllers/user.controller.js";
import { GroupController } from "../controllers/group.controller.js";
import { commandsGroup } from "./group.list.commands.js";

export async function grupoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupCommands = commandsGroup(botInfo)
    const groupController = new GroupController()
    const currentParticipants = await groupController.getParticipants(group.id)
    const currentAdmins = await groupController.getAdmins(group.id)

    let replyText = buildText(groupCommands.grupo.msgs.reply_title, group.name, currentParticipants.length, currentAdmins.length, group.description || '---', group.commands_executed)

    if (message.isGroupAdmin) {
        replyText += groupCommands.grupo.msgs.reply_resource_title
        //Bem-vindo
        replyText += (group.welcome.status) ? groupCommands.grupo.msgs.reply_item_welcome_on : groupCommands.grupo.msgs.reply_item_welcome_off
        //Mutar
        replyText += (group.muted) ? groupCommands.grupo.msgs.reply_item_mute_on : groupCommands.grupo.msgs.reply_item_mute_off
        //Auto-Sticker
        replyText += (group.autosticker) ? groupCommands.grupo.msgs.reply_item_autosticker_on : groupCommands.grupo.msgs.reply_item_autosticker_off
        //Anti-Link
        replyText += (group.antilink) ? groupCommands.grupo.msgs.reply_item_antilink_on : groupCommands.grupo.msgs.reply_item_antilink_off
        //Anti-Fake
        replyText += (group.antifake.status) ? buildText(groupCommands.grupo.msgs.reply_item_antifake_on, group.antifake.allowed.toString()) : groupCommands.grupo.msgs.reply_item_antifake_off
        //Anti-Flood
        replyText += (group.antiflood.status) ? buildText(groupCommands.grupo.msgs.reply_item_antiflood_on, group.antiflood.max_messages, group.antiflood.interval) : groupCommands.grupo.msgs.reply_item_antiflood_off
        
        //Bloqueio de CMDS
        let blockedCommands = []
        for (let command of group.block_cmds){
            blockedCommands.push(botInfo.prefix+command)
        }
        replyText += (group.block_cmds.length) ? buildText(groupCommands.grupo.msgs.reply_item_blockcmds_on, blockedCommands.toString()) : groupCommands.grupo.msgs.reply_item_blockcmds_off
        
        //Lista Negra
        replyText += buildText(groupCommands.grupo.msgs.reply_item_blacklist, group.blacklist.length)
    }

    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function avisoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)
    let targetUserId : string
    let replyText: string

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    if (message.mentioned.length) {
        targetUserId = message.mentioned[0]
    } else if (message.isQuoted && message.quotedMessage) {
        targetUserId = message.quotedMessage.sender
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    const isBotTarget = botInfo.host_number == targetUserId
    const isAdminTarget = await groupController.isAdmin(group.id, targetUserId)
    
    if (isBotTarget) {
        throw new Error(groupCommands.aviso.msgs.error_warning_bot)
    } else if (isAdminTarget) {
        throw new Error(groupCommands.aviso.msgs.error_warning_admin)
    }

    await groupController.addWarning(group.id, targetUserId)
    const participant = await groupController.getParticipant(group.id, targetUserId)

    if (!participant) {
        throw new Error(groupCommands.aviso.msgs.error_not_registered)
    }
    
    if (participant.warnings < 3){
        replyText = buildText(groupCommands.aviso.msgs.reply, waLib.removeWhatsappSuffix(targetUserId), participant.warnings)
        await waLib.sendTextWithMentions(client, message.chat_id, replyText, [targetUserId], {expiration: message.expiration})
    } else {
        replyText = buildText(groupCommands.aviso.msgs.reply_max_warning, waLib.removeWhatsappSuffix(targetUserId))
        await waLib.sendTextWithMentions(client, message.chat_id, replyText, [targetUserId], {expiration: message.expiration})
        await groupController.addBlackList(group.id, targetUserId)
        await waLib.removeParticipant(client, group.id, targetUserId)
    }
}

export async function rmavisoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)
    let targetUserId : string

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    if (message.mentioned.length) {
        targetUserId = message.mentioned[0]
    } else if (message.isQuoted && message.quotedMessage) {
        targetUserId = message.quotedMessage.sender
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    const participant = await groupController.getParticipant(group.id, targetUserId)

    if (!participant) {
        throw new Error(groupCommands.rmaviso.msgs.error_not_registered)
    } else if(participant.warnings < 1) {
        throw new Error(groupCommands.rmaviso.msgs.error_no_warning)
    } else {
        const currentWarnings = participant.warnings
        const newWarningCount = participant.warnings - 1
        await groupController.removeWarning(group.id, targetUserId, currentWarnings)
        const replyText = buildText(groupCommands.rmaviso.msgs.reply, waLib.removeWhatsappSuffix(targetUserId), newWarningCount)
        await waLib.replyWithMentions(client, message.chat_id, replyText, [targetUserId], message.wa_message, { expiration : message.expiration })
    }
}

export async function zeraravisosCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    await groupController.removeParticipantsWarnings(group.id)
    const replyText = groupCommands.zeraravisos.msgs.reply
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, { expiration: message.expiration })
}

export async function fotogrupoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    } else if (message.type != 'imageMessage' && message.quotedMessage?.type != 'imageMessage') {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }
    
    let imageBuffer : Buffer

    if (message.isQuoted && message.quotedMessage) {
        imageBuffer = await downloadMediaMessage(message.quotedMessage?.wa_message, "buffer", {})
    } else {
        imageBuffer = await downloadMediaMessage(message.wa_message, "buffer", {})
    }

    await waLib.updateProfilePic(client, group.id, imageBuffer)
    await waLib.replyText(client, group.id, groupCommands.fotogrupo.msgs.reply, message.wa_message, {expiration: message.expiration})
}

export async function addlistaCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)
    let targetUserId : string

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    if (message.isQuoted && message.quotedMessage) {
        targetUserId = message.quotedMessage?.sender
    } else if (message.mentioned.length) {
        targetUserId = message.mentioned[0]
    } else if (message.args.length) {
        targetUserId = waLib.addWhatsappSuffix(message.text_command)
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    if (targetUserId == botInfo.host_number) {
        throw new Error(groupCommands.addlista.msgs.error_add_bot)
    } else if (await groupController.isAdmin(group.id, targetUserId)) {
        throw new Error(groupCommands.addlista.msgs.error_add_admin)
    } 

    const currentBlacklist = await groupController.getBlackList(group.id)

    if (currentBlacklist.includes(targetUserId)) {
        throw new Error(groupCommands.addlista.msgs.error_already_listed)
    }

    await groupController.addBlackList(group.id, targetUserId)
    await waLib.replyText(client, message.chat_id, groupCommands.addlista.msgs.reply, message.wa_message, {expiration: message.expiration})

    if (await groupController.isParticipant(group.id, targetUserId)) {
        await waLib.removeParticipant(client, group.id, targetUserId)
    }
}

export async function rmlistaCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)
    let targetUserId : string

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    } else if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }
    
    const currentBlacklist = await groupController.getBlackList(group.id)

    if (message.args.length == 1 && message.args[0].length <= 3) {
        targetUserId = currentBlacklist[parseInt(message.text_command) - 1]
    } else {
        targetUserId = waLib.addWhatsappSuffix(message.text_command)
    }

    if (!currentBlacklist.includes(targetUserId)) {
        throw new Error(groupCommands.rmlista.msgs.error_not_listed)
    }

    await groupController.removeBlackList(group.id, targetUserId)
    await waLib.replyText(client, message.chat_id, groupCommands.rmlista.msgs.reply, message.wa_message, {expiration: message.expiration})
}

export async function listanegraCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const userController = new UserController()
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    const currentBlacklist = await groupController.getBlackList(group.id)
    let replyText = buildText(groupCommands.listanegra.msgs.reply_title, currentBlacklist.length)

    if (!currentBlacklist.length) {
        throw new Error(groupCommands.listanegra.msgs.error_empty_list)
    }

    for(let userId of currentBlacklist){
        const userData = await userController.getUser(userId)
        const userNumberList = currentBlacklist.indexOf(userId) + 1
        replyText += buildText(groupCommands.listanegra.msgs.reply_item, userNumberList, userData?.name || '---', waLib.removeWhatsappSuffix(userId))
    }

    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function addCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    } else if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }
    
    let userId = waLib.addWhatsappSuffix(message.text_command.trim())

    if (!Number(waLib.removeWhatsappSuffix(userId))) {
        throw new Error(groupCommands.add.msgs.error_input)
    }

    let addResponse = await waLib.addParticipant(client, group.id, userId).catch((err) => {
        throw new Error(buildText(groupCommands.add.msgs.error_invalid_number, waLib.removeWhatsappSuffix(userId)))
    })

    if (addResponse.status != "200") {
        throw new Error(buildText(groupCommands.add.msgs.error_add, waLib.removeWhatsappSuffix(userId)))
    }

    const replyText = buildText(groupCommands.add.msgs.reply, waLib.removeWhatsappSuffix(userId))
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function banCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    let targetUsers : string[] = []

    if (!message.mentioned.length && message.isQuoted && message.quotedMessage) {
        targetUsers.push(message.quotedMessage?.sender)
    } else if (message.mentioned.length) {
        targetUsers = message.mentioned
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    let replyText = groupCommands.ban.msgs.reply_title

    for(let userId of targetUsers){
        if (await groupController.isParticipant(group.id, userId)){
            if (!await groupController.isAdmin(group.id, userId)){
                await waLib.removeParticipant(client, group.id, userId)
                replyText += buildText(groupCommands.ban.msgs.reply_item_success, waLib.removeWhatsappSuffix(userId))
            } else {
                replyText += buildText(groupCommands.ban.msgs.reply_item_ban_admin, waLib.removeWhatsappSuffix(userId))
            }
        } else {
            replyText += buildText(groupCommands.ban.msgs.reply_item_not_found, waLib.removeWhatsappSuffix(userId))
        }
    }

    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function promoverCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }
    
    let targetUsers : string[] = []
    let replyText = groupCommands.promover.msgs.reply_title

    if (message.mentioned.length) {
        targetUsers = message.mentioned
    } else if (message.isQuoted && message.quotedMessage) {
        targetUsers.push(message.quotedMessage.sender)
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    for(let userId of targetUsers){
        if (!await groupController.isAdmin(group.id, userId)) {
            await waLib.promoteParticipant(client, group.id, userId)
            replyText += buildText(groupCommands.promover.msgs.reply_item_success, waLib.removeWhatsappSuffix(userId))
        } else {
            replyText += buildText(groupCommands.promover.msgs.reply_item_error, waLib.removeWhatsappSuffix(userId))
        }
    }

    await waLib.replyWithMentions(client, group.id, replyText, targetUsers, message.wa_message, {expiration: message.expiration})
}

export async function rebaixarCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }
    
    let targetUsers : string[] = []
    let replyText = groupCommands.rebaixar.msgs.reply_title

    if (message.mentioned.length > 0) {
        targetUsers = message.mentioned
    } else if (message.isQuoted && message.quotedMessage) {
        targetUsers.push(message.quotedMessage.sender)
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    for(let userId of targetUsers){
        if (userId == botInfo.host_number || userId == group.owner){
            replyText += buildText(groupCommands.rebaixar.msgs.reply_item_error, waLib.removeWhatsappSuffix(userId))
        } else if (await groupController.isAdmin(group.id, userId)) {
            replyText += buildText(groupCommands.rebaixar.msgs.reply_item_success, waLib.removeWhatsappSuffix(userId))
            await waLib.demoteParticipant(client, group.id, userId)
        } else {
            replyText += buildText(groupCommands.rebaixar.msgs.reply_item_error_is_member, waLib.removeWhatsappSuffix(userId))
        }
    }

    await waLib.replyWithMentions(client, message.chat_id, replyText, targetUsers, message.wa_message, {expiration: message.expiration})
}

export async function mtCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const currentParticipantsIds = await groupController.getParticipantsIds(group.id)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    }
    
    let replyMention : string

    if (message.args.length) {
        replyMention = buildText(groupCommands.mt.msgs.reply_with_message, currentParticipantsIds.length, message.text_command)
    } else {
        replyMention = buildText(groupCommands.mt.msgs.reply, currentParticipantsIds.length)
    }

    await waLib.replyWithMentions(client, message.chat_id, replyMention, currentParticipantsIds, message.wa_message, {expiration: message.expiration})
}

export async function mmCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupCommands = commandsGroup(botInfo)
    const groupController = new GroupController()
    const botTexts = getBotTexts(botInfo)
    let replyText : string

    if (!message.isGroupAdmin) throw new Error(botTexts.permission.admin_group_only)
    
    const currentParticipants = await groupController.getParticipants(group.id)
    const participantsNotAdmins = currentParticipants.filter(participant => participant.admin == false).map(participant => participant.user_id)

    if (!participantsNotAdmins.length) {
        throw new Error(groupCommands.mm.msgs.error_no_members)
    }

    if (message.args.length) {
        replyText = buildText(groupCommands.mm.msgs.reply_with_message, participantsNotAdmins.length, message.text_command)
    } else {
        replyText = buildText(groupCommands.mm.msgs.reply, participantsNotAdmins.length)
    }

    await waLib.replyWithMentions(client, message.chat_id, replyText, participantsNotAdmins, message.wa_message, {expiration: message.expiration})
}

export async function admsCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const adminsIds = await groupController.getAdminsIds(group.id)
    let replyText : string
    
    if (message.args.length) {
        replyText = buildText(groupCommands.adms.msgs.reply_with_message, adminsIds.length, message.text_command)
    } else {
        replyText = buildText(groupCommands.adms.msgs.reply, adminsIds.length)
    }

    const messageToReply = (message.isQuoted && message.quotedMessage) ? message.quotedMessage.wa_message : message.wa_message
    await waLib.replyWithMentions(client, message.chat_id, replyText, adminsIds, messageToReply, {expiration: message.expiration})
}

export async function donoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupCommands = commandsGroup(botInfo)

    if (!group.owner) {
        throw new Error(groupCommands.dono.msgs.error)
    }
    
    const replyText = buildText(groupCommands.dono.msgs.reply, waLib.removeWhatsappSuffix(group.owner))
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function mutarCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    }
    
    let replyText = group.muted ? groupCommands.mutar.msgs.reply_off : groupCommands.mutar.msgs.reply_on
    await groupController.setMuted(group.id, !group.muted)
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function linkCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    let inviteLink = await waLib.getGroupInviteLink(client, group.id)
    const replyText = buildText(groupCommands.link.msgs.reply, group.name, inviteLink)
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function rlinkCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    await waLib.revokeGroupInvite(client, group.id).catch(() => {
        throw new Error(groupCommands.rlink.msgs.error)
    })

    const replyText = groupCommands.rlink.msgs.reply
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function restritoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }
    
    await waLib.updateGroupRestriction(client, group.id, !group.restricted)
    const replyText = (group.restricted) ? groupCommands.restrito.msgs.reply_off : groupCommands.restrito.msgs.reply_on
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function antilinkCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }
    
    const replyText = group.antilink ? groupCommands.antilink.msgs.reply_off : groupCommands.antilink.msgs.reply_on
    await groupController.setAntiLink(group.id, !group.antilink)
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function autostickerCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    }
    
    const replyText = group.autosticker ? groupCommands.autosticker.msgs.reply_off : groupCommands.autosticker.msgs.reply_on
    await groupController.setAutoSticker(group.id, !group.autosticker)
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function bemvindoCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    }
    
    const replyText = group.welcome.status ? groupCommands.bemvindo.msgs.reply_off : groupCommands.bemvindo.msgs.reply_on
    await groupController.setWelcome(group.id, !group.welcome.status, message.text_command || undefined)
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function antifakeCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }
    
    const allowedDDI = !message.args.length ? ["55"] : message.args
    const replyText = group.antifake.status ? groupCommands.antifake.msgs.reply_off : groupCommands.antifake.msgs.reply_on
    await groupController.setAntiFake(group.id, !group.antifake.status, allowedDDI)
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function antifloodCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const groupCommands = commandsGroup(botInfo)
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    }

    let interval = '10'
    let maxMessage = '10'
                
    if (message.args.length == 2) {
        [maxMessage, interval] = message.args
    } else if (message.args.length == 1) {
        [maxMessage] = message.args
    }

    if (!Number(interval) || Number(interval) < 10 || Number(interval) > 60) {
        throw new Error(groupCommands.antiflood.msgs.error_value_interval)
    }

    if (!Number(maxMessage) || Number(maxMessage) < 5 || Number(maxMessage) > 20) {
        throw new Error(groupCommands.antiflood.msgs.error_value_message)
    }
    
    const replyText = group.antiflood.status ? groupCommands.antiflood.msgs.reply_off : buildText(groupCommands.antiflood.msgs.reply_on, maxMessage, interval)
    await groupController.setAntiFlood(group.id, !group.antiflood.status, Number(maxMessage), Number(interval))
    await waLib.replyText(client, group.id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function apgCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const botTexts = getBotTexts(botInfo)
    const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!isBotGroupAdmin) {
        throw new Error(botTexts.permission.bot_group_admin)
    } else if (!message.isQuoted || !message.quotedMessage) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }
    
    await waLib.deleteMessage(client, message.wa_message, true)
}

export async function topativosCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const botTexts = getBotTexts(botInfo)
    const groupCommands = commandsGroup(botInfo)
    let qtyRanking = 10

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    }

    if (Number(message.text_command)) {
        qtyRanking = Number(message.text_command)
    }

    if (qtyRanking < 1 || qtyRanking > 50) {
        throw new Error(groupCommands.topativos.msgs.error_value_limit)
    }
    
    const usersRanking = await groupController.getParticipantsActivityRanking(group, qtyRanking)
    let mentionedUsers = []
    let replyText = buildText(groupCommands.topativos.msgs.reply_title, qtyRanking)

    for (let i = 0 ; i < usersRanking.length ; i++){
        let icon : string
        let positionRanking = i + 1

        switch(positionRanking){
            case 1:
                icon = '🥇'
            break
            case 2:
                icon = '🥈'
            break
            case 3:
                icon = '🥉'
            break
            default:
                icon = ''
        }

        replyText += buildText(groupCommands.topativos.msgs.reply_item, icon, positionRanking, waLib.removeWhatsappSuffix(usersRanking[i].user_id), usersRanking[i].msgs)
        mentionedUsers.push(usersRanking[i].user_id)   
    }

    await waLib.replyWithMentions(client, message.chat_id, replyText, mentionedUsers, message.wa_message, {expiration: message.expiration})
}

export async function membroCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const userController = new UserController()
    const botTexts = getBotTexts(botInfo)
    const groupCommands = commandsGroup(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    }
    
    let targetUserId : string

    if (message.isQuoted && message.quotedMessage) {
        targetUserId = message.quotedMessage.sender
    } else if (message.mentioned.length === 1) {
        targetUserId = message.mentioned[0]
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    let participant = await groupController.getParticipant(group.id, targetUserId)

    if(!participant) {
        throw new Error(groupCommands.membro.msgs.error_not_member)
    }
    
    const userData = await userController.getUser(targetUserId)
    const replyText = buildText(groupCommands.membro.msgs.reply, userData?.name || '---', waLib.removeWhatsappSuffix(targetUserId), participant.warnings, participant.registered_since, participant.commands, participant.msgs, participant.text, participant.image, participant.video, participant.sticker, participant.audio, participant.other)
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function inativosCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const botTexts = getBotTexts(botInfo)
    const groupCommands = commandsGroup(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    const qtyMessage = Number(message.text_command)

    if (!qtyMessage) {
        throw new Error(groupCommands.inativos.msgs.error_value_invalid)
    } else if (qtyMessage < 1) {
        throw new Error(groupCommands.inativos.msgs.error_value_limit)
    }

    const inactiveUsers = await groupController.getParticipantsActivityLowerThan(group, qtyMessage)
    const inactiveUsersIds = inactiveUsers.map(user => user.user_id)

    if (!inactiveUsers.length) {
        throw new Error(groupCommands.inativos.msgs.error_no_inactives)
    }

    let replyText = buildText(groupCommands.inativos.msgs.reply_title, inactiveUsers.length, qtyMessage)

    for(let user of inactiveUsers){
        replyText += buildText(groupCommands.inativos.msgs.reply_item, waLib.removeWhatsappSuffix(user.user_id), user.msgs)
    }

    await waLib.replyWithMentions(client, group.id, replyText, inactiveUsersIds, message.wa_message, {expiration: message.expiration})
}

export async function bcmdCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const botTexts = getBotTexts(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    const replyText = await groupController.blockCommands(group, message.args, botInfo)
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function dcmdCommand(client: WASocket, botInfo: Bot, message: Message, group: Group){
    const groupController = new GroupController()
    const botTexts = getBotTexts(botInfo)

    if (!message.isGroupAdmin) {
        throw new Error(botTexts.permission.admin_group_only)
    } else if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    const replyText = await groupController.unblockCommands(group, message.args, botInfo)
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}



