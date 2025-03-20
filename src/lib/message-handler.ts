import { WASocket } from "baileys";
import { Bot } from "../interfaces/bot.interface.js";
import { Group } from "../interfaces/group.interface.js";
import { Message } from "../interfaces/message.interface.js";
import { UserController } from "../controllers/user.controller.js";
import getGeneralMessages from "./general-messages.js";
import { GroupController } from "../controllers/group.controller.js";
import { buildText, commandExist, removeWhatsappSuffix } from "./util.js";
import { BotController } from "../controllers/bot.controller.js";
import { commandInvoker } from "./command-invoker.js";
import { deleteMessage, getBlockedContacts, readMessage, removeParticipant, replyText, sendText, sendTextWithMentions } from "./whatsapp.js";

export async function handlePrivateMessage(client: WASocket, botInfo: Bot, message: Message){
    const userController = new UserController()
    const botController = new BotController()
    const {command, sender} = message
    const isCommand = commandExist(botInfo, command)
    const isAutosticker = ((message.type === 'videoMessage' || message.type === "imageMessage") && botInfo.autosticker)

    //Verifica se o usuário está bloqueado, se estiver retorna.
    if (await isUserBlocked(client, sender)) return

    //Verifica se é um registro de dono, se for retorne.
    if (await isOwnerRegister(client, userController, botInfo, message)) return

    //Se o PV do bot não estiver liberado e o usuário não for um admin, retorne.
    if (isIgnoredByPvAllowed(message, botInfo)) return

    //Se o usuário não tiver recebido boas vindas no PV, faça-o
    await sendPrivateWelcome(client, userController, message, botInfo)

    //Leia a mensagem do usuário
    await readUserMessage(client, message)

    //Atualize o nome do usuário
    await updateUserName(userController, message)

    if (isCommand || isAutosticker){
        //Se a taxa de comandos estiver ativado e o usuário estiver limitado, retorne.
        if (await isUserLimitedByCommandRate(client, botController, botInfo, message)) return

        //Se o comando estiver bloqueado globalmente, retorne.
        if (await isCommandBlockedGlobally(client, botController, botInfo, message)) return

        //Incrementa contagem de comandos do usuário
        await userController.increaseUserCommandsCount(sender)

        //Incrementa contagem de comandos do bot
        botController.incrementExecutedCommands()

        //Faz a chamada do comando
        await commandInvoker(client, botInfo, message, null)
    }
}

export async function handleGroupMessage(client: WASocket, group: Group|null, botInfo: Bot, message: Message){
    const userController = new UserController()
    const groupController = new GroupController()
    const botController = new BotController()
    const {command, sender} = message
    const isCommand = commandExist(botInfo, command)
    const isAutosticker = ((message.type === 'videoMessage' || message.type === "imageMessage") && group?.autosticker)
    const isGroupAdmin = group?.admins.includes(sender) || false

    //Se por acaso o grupo não estiver cadastrado, retorne
    if (!group) return

    //Verifica se o usuário está bloqueado, se estiver retorna.
    if (await isUserBlocked(client, sender)) return 

    //Se o grupo estiver restrito para admins e o bot não for um admin, retorne.
    if (await isBotLimitedByGroupRestricted(group, botInfo)) return

    //Se o antilink estiver ativado, e for detectado um link na mensagem, retorne.
    if (await isDetectedByAntiLink(client, groupController, botInfo, group, message)) return

    //Se o Anti-FLOOD estiver ativado, e for detectada como FLOOD, retorne.
    if (await isDetectedByAntiFlood(client, groupController, botInfo, group, message)) return

    //Verifica se é um registro de dono, se for retorne.
    if (await isOwnerRegister(client, userController, botInfo, message)) return

    //Se o contador estiver ativado, verifica se precisa adicionar o participante e incrementa a contagem dele.
    await handleUserCounter(groupController, message, group)

    //Se o grupo estiver mutado e o participante não for um admin, retorne.
    if (await isIgnoredByGroupMuted(group, isGroupAdmin)) return

    //Leia a mensagem do usuário
    await readUserMessage(client, message)

    //Atualize o nome do usuário
    await updateUserName(userController, message)

    if (isCommand || isAutosticker){
        //Se a taxa de comandos estiver ativa e o usuário estiver limitado, retorne.
        if (await isUserLimitedByCommandRate(client, botController, botInfo, message)) return

        //Se o comando estiver bloqueado globalmente, retorne.
        if (await isCommandBlockedGlobally(client, botController, botInfo, message)) return

        //Se o comando estiver bloqueado no grupo, retorne.
        if (await isCommandBlockedGroup(client, groupController, group, isGroupAdmin, botInfo, message)) return

        //Incrementa contagem de comandos do usuário
        await userController.increaseUserCommandsCount(sender)

        //Incrementa contagem de comandos do bot
        botController.incrementExecutedCommands()

        //Incrementa contagem de comandos do grupo
        await groupController.incrementGroupCommands(group.id)

        //Faz a chamada do comando
        await commandInvoker(client, botInfo, message, group)
    }
}

async function isUserBlocked(client: WASocket, userId: string){
    const blockedContacts = await getBlockedContacts(client)
    return blockedContacts.includes(userId)
}

async function isOwnerRegister(client: WASocket, userController: UserController, botInfo: Bot, message: Message){
    const admins = await userController.getAdmins()
    const generalMessages = getGeneralMessages(botInfo)

    if (!admins.length && message.command == `${botInfo.prefix}admin`){
        await userController.registerOwner(message.sender)
        await replyText(client, message.chat_id, generalMessages.admin_registered, message.wa_message, {expiration: message.expiration})
        return true
    }
    
    return false
}

async function handleUserCounter(groupController: GroupController, message: Message, group: Group){
    if (group?.counter.status) {
        await groupController.registerParticipantActivity(message.chat_id, message.sender)
        await groupController.incrementParticipantActivity(message.chat_id, message.sender, message.type)
    }
}

function isIgnoredByPvAllowed(message: Message, botInfo: Bot){
    if (!message.isBotAdmin && !botInfo.commands_pv) return true
    return false
}

async function isIgnoredByGroupMuted(group: Group, isGroupAdmin: boolean){
    return (group.muted && !isGroupAdmin)
}

async function isBotLimitedByGroupRestricted(group: Group, botInfo: Bot){
    if (group.restricted){
        if (!botInfo.host_number) return true
        const isBotGroupAdmin = group.admins.includes(botInfo.host_number)
        if (!isBotGroupAdmin) return true
    }
    return false
}

async function sendPrivateWelcome(client: WASocket, userController : UserController, message: Message, botInfo: Bot){
    const generalMessages = getGeneralMessages(botInfo)
    const user = await userController.getUser(message.sender)
    if (user && !user.receivedWelcome){
        await sendText(client, message.chat_id, buildText(generalMessages.new_user, botInfo.name, message.pushname), {expiration: message.expiration})
        await userController.setReceivedWelcome(user.id, true)
    }
}

async function readUserMessage(client: WASocket, message: Message){
    await readMessage(client, message.chat_id, message.sender, message.message_id)
}

async function updateUserName(userController: UserController, message: Message){
    if (message.pushname) await userController.setName(message.sender, message.pushname)
}

async function isUserLimitedByCommandRate(client: WASocket, botController: BotController, botInfo: Bot, message: Message){
    if (botInfo.command_rate.status){
        const isLimited = await botController.hasExceededCommandRate(botInfo, message.sender, message.isBotAdmin)
        if (isLimited){
            const generalMessages = getGeneralMessages(botInfo)
            await replyText(client, message.chat_id, buildText(generalMessages.command_rate_limited_message, botInfo.command_rate.block_time), message.wa_message, {expiration: message.expiration})
            return true
        }
    }
    return false
}

async function isCommandBlockedGlobally(client: WASocket, botController: BotController, botInfo: Bot, message: Message ){
    const commandBlocked = botController.isCommandBlockedGlobally(message.command)
    const generalMessages = getGeneralMessages(botInfo)
    if (commandBlocked && !message.isBotAdmin){
        await replyText(client, message.chat_id, buildText(generalMessages.globally_blocked_command, message.command), message.wa_message, {expiration: message.expiration})
        return true
    }
    return false
}

async function isCommandBlockedGroup(client: WASocket, groupController: GroupController, group: Group, isGroupAdmin: boolean, botInfo: Bot, message: Message){
    const commandBlocked = groupController.isBlockedCommand(group, message.command, botInfo)
    const generalMessages = getGeneralMessages(botInfo)
    if (commandBlocked && !isGroupAdmin){
        await replyText(client, message.chat_id, buildText(generalMessages.group_blocked_command, message.command), message.wa_message, {expiration: message.expiration})
        return true
    }
    return false
}

async function isDetectedByAntiLink(client: WASocket, groupController: GroupController, botInfo: Bot, group: Group, message: Message){
    const generalMessages = getGeneralMessages(botInfo)
    const isDetectedByAntilink = await groupController.isMessageWithLink(message, group, botInfo)
    if (isDetectedByAntilink){
        await sendTextWithMentions(client, message.chat_id, buildText(generalMessages.detected_link, removeWhatsappSuffix(message.sender)), [message.sender], {expiration: message.expiration})
        await deleteMessage(client, message.wa_message, false)
        return true
    }
    return false
}

async function isDetectedByAntiFlood(client: WASocket, groupController: GroupController, botInfo: Bot, group: Group, message: Message){
    const generalMessages = getGeneralMessages(botInfo)
    const isDetectedByAntiFlood = await groupController.isFlood(group, message.sender, message.isGroupAdmin)
    if (isDetectedByAntiFlood){
        await removeParticipant(client, message.chat_id, message.sender)
        await sendTextWithMentions(client, message.chat_id, buildText(generalMessages.antiflood_ban_messages, removeWhatsappSuffix(message.sender), botInfo.name), [message.sender], {expiration: message.expiration})
        return true
    }
    return false
}

