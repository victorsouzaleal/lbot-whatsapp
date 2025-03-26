import { WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Group } from "../interfaces/group.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { UserController } from "../controllers/user.controller.js";
import getBotTexts from "../utils/bot.texts.util.js";
import { GroupController } from "../controllers/group.controller.js";
import { buildText } from "../utils/general.util.js";
import { BotController } from "../controllers/bot.controller.js";
import { waLib } from "../libraries/library.js";
import { commandExist } from "../utils/commands.util.js";

export async function handlePrivateMessage(client: WASocket, botInfo: Bot, message: Message){
    const userController = new UserController()
    const botController = new BotController()
    const {command, sender} = message
    const isCommand = commandExist(botInfo, command)
    const isAutosticker = ((message.type === 'videoMessage' || message.type === "imageMessage") && botInfo.autosticker)
    let callCommand : boolean

    //Verifica se o usuário está bloqueado, se estiver retorna.
    if (await isUserBlocked(client, sender)) return false
    //Verifica se é um registro de dono, se for retorne.
    if (await isOwnerRegister(client, userController, botInfo, message)) return false
    //Se o PV do bot não estiver liberado e o usuário não for um admin, retorne.
    if (isIgnoredByPvAllowed(message, botInfo)) return false
    //Se o usuário não tiver recebido boas vindas no PV, faça-o
    await sendPrivateWelcome(client, userController, message, botInfo)
    //Leia a mensagem do usuário
    await readUserMessage(client, message)
    //Atualize o nome do usuário
    await updateUserName(userController, message)

    if (isCommand || isAutosticker){
        //Se a taxa de comandos estiver ativado e o usuário estiver limitado, retorne.
        if (await isUserLimitedByCommandRate(client, botController, botInfo, message)) return false
        //Se o comando estiver bloqueado globalmente, retorne.
        if (await isCommandBlockedGlobally(client, botController, botInfo, message)) return false
        //Incrementa contagem de comandos do usuário
        await userController.increaseUserCommandsCount(sender)
        //Incrementa contagem de comandos do bot
        botController.incrementExecutedCommands()
        callCommand = true
    } else {
        callCommand = false
    }

    return callCommand
}

export async function handleGroupMessage(client: WASocket, group: Group, botInfo: Bot, message: Message){
    const userController = new UserController()
    const groupController = new GroupController()
    const botController = new BotController()
    const {command, sender, isGroupAdmin} = message
    const isCommand = commandExist(botInfo, command)
    const isAutosticker = ((message.type === 'videoMessage' || message.type === "imageMessage") && group?.autosticker)
    let callCommand : boolean

    //Verifica se o usuário está bloqueado, se estiver retorna.
    if (await isUserBlocked(client, sender)) return false
    //Se o grupo estiver restrito para admins e o bot não for um admin, retorne.
    if (await isBotLimitedByGroupRestricted(groupController, group, botInfo)) return false
    //Se o antilink estiver ativado, e for detectado um link na mensagem, retorne.
    if (await isDetectedByAntiLink(client, groupController, botInfo, group, message)) return false
    //Se o Anti-FLOOD estiver ativado, e for detectada como FLOOD, retorne.
    if (await isDetectedByAntiFlood(client, groupController, botInfo, group, message)) return false
    //Verifica se é um registro de dono, se for retorne.
    if (await isOwnerRegister(client, userController, botInfo, message)) return false
    //Se o contador estiver ativado, verifica se precisa adicionar o participante e incrementa a contagem dele.
    await incrementParticipantActivity(groupController, message, isCommand)
    //Se o grupo estiver mutado e o participante não for um admin, retorne.
    if (await isIgnoredByGroupMuted(group, isGroupAdmin)) return false
    //Leia a mensagem do usuário
    await readUserMessage(client, message)
    //Atualize o nome do usuário
    await updateUserName(userController, message)

    if (isCommand || isAutosticker){
        //Se a taxa de comandos estiver ativa e o usuário estiver limitado, retorne.
        if (await isUserLimitedByCommandRate(client, botController, botInfo, message)) return false
        //Se o comando estiver bloqueado globalmente, retorne.
        if (await isCommandBlockedGlobally(client, botController, botInfo, message)) return false
        //Se o comando estiver bloqueado no grupo, retorne.
        if (await isCommandBlockedGroup(client, groupController, group, isGroupAdmin, botInfo, message)) return false
        //Incrementa contagem de comandos do usuário
        await userController.increaseUserCommandsCount(sender)
        //Incrementa contagem de comandos do bot
        botController.incrementExecutedCommands()
        //Incrementa contagem de comandos do grupo
        await groupController.incrementGroupCommands(group.id)
        callCommand = true
    } else {
        callCommand = false
    }

    return callCommand
}

async function isUserBlocked(client: WASocket, userId: string){
    const blockedContacts = await waLib.getBlockedContacts(client)
    return blockedContacts.includes(userId)
}

async function isOwnerRegister(client: WASocket, userController: UserController, botInfo: Bot, message: Message){
    const admins = await userController.getAdmins()
    const botTexts = getBotTexts(botInfo)

    if (!admins.length && message.command == `${botInfo.prefix}admin`){
        await userController.registerOwner(message.sender)
        await waLib.replyText(client, message.chat_id, botTexts.admin_registered, message.wa_message, {expiration: message.expiration})
        return true
    }
    
    return false
}

async function incrementParticipantActivity(groupController: GroupController, message: Message, isCommand: boolean){
    await groupController.incrementParticipantActivity(message.chat_id, message.sender, message.type, isCommand)
}

function isIgnoredByPvAllowed(message: Message, botInfo: Bot){
    if (!message.isBotAdmin && !botInfo.commands_pv) return true
    return false
}

async function isIgnoredByGroupMuted(group: Group, isGroupAdmin: boolean){
    return (group.muted && !isGroupAdmin)
}

async function isBotLimitedByGroupRestricted(groupController: GroupController, group: Group, botInfo: Bot){
    if (group.restricted){
        if (!botInfo.host_number) return true
        const isBotGroupAdmin = await groupController.isAdmin(group.id, botInfo.host_number)
        if (!isBotGroupAdmin) return true
    }
    return false
}

async function sendPrivateWelcome(client: WASocket, userController : UserController, message: Message, botInfo: Bot){
    const botTexts = getBotTexts(botInfo)
    const user = await userController.getUser(message.sender)
    if (user && !user.receivedWelcome){
        const replyText = buildText(botTexts.new_user, botInfo.name, message.pushname)
        await waLib.sendText(client, message.chat_id, replyText, {expiration: message.expiration})
        await userController.setReceivedWelcome(user.id, true)
    }
}

async function readUserMessage(client: WASocket, message: Message){
    await waLib.readMessage(client, message.chat_id, message.sender, message.message_id)
}

async function updateUserName(userController: UserController, message: Message){
    if (message.pushname) await userController.setName(message.sender, message.pushname)
}

async function isUserLimitedByCommandRate(client: WASocket, botController: BotController, botInfo: Bot, message: Message){
    if (botInfo.command_rate.status){
        const isLimited = await botController.hasExceededCommandRate(botInfo, message.sender, message.isBotAdmin)
        if (isLimited){
            const botTexts = getBotTexts(botInfo)
            const replyText = buildText(botTexts.command_rate_limited_message, botInfo.command_rate.block_time)
            await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
            return true
        }
    }
    return false
}

async function isCommandBlockedGlobally(client: WASocket, botController: BotController, botInfo: Bot, message: Message ){
    const commandBlocked = botController.isCommandBlockedGlobally(message.command)
    const botTexts = getBotTexts(botInfo)
    if (commandBlocked && !message.isBotAdmin){
        const replyText = buildText(botTexts.globally_blocked_command, message.command)
        await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
        return true
    }
    return false
}

async function isCommandBlockedGroup(client: WASocket, groupController: GroupController, group: Group, isGroupAdmin: boolean, botInfo: Bot, message: Message){
    const commandBlocked = groupController.isBlockedCommand(group, message.command, botInfo)
    const botTexts = getBotTexts(botInfo)
    if (commandBlocked && !isGroupAdmin){
        const replyText = buildText(botTexts.group_blocked_command, message.command)
        await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
        return true
    }
    return false
}

async function isDetectedByAntiLink(client: WASocket, groupController: GroupController, botInfo: Bot, group: Group, message: Message){
    const botTexts = getBotTexts(botInfo)
    const isDetectedByAntilink = await groupController.isMessageWithLink(message, group, botInfo)
    if (isDetectedByAntilink){
        const replyText = buildText(botTexts.detected_link, waLib.removeWhatsappSuffix(message.sender))
        await waLib.sendTextWithMentions(client, message.chat_id, replyText, [message.sender], {expiration: message.expiration})
        await waLib.deleteMessage(client, message.wa_message, false)
        return true
    }
    return false
}

async function isDetectedByAntiFlood(client: WASocket, groupController: GroupController, botInfo: Bot, group: Group, message: Message){
    const botTexts = getBotTexts(botInfo)
    const isDetectedByAntiFlood = await groupController.isFlood(group, message.sender, message.isGroupAdmin)

    if (isDetectedByAntiFlood){
        const replyText = buildText(botTexts.antiflood_ban_messages, waLib.removeWhatsappSuffix(message.sender), botInfo.name)
        await waLib.removeParticipant(client, message.chat_id, message.sender)
        await waLib.sendTextWithMentions(client, message.chat_id, replyText, [message.sender], {expiration: message.expiration})
        return true
    }
    
    return false
}

