import { WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import * as Whatsapp from '../lib/whatsapp.js'
import { buildText, removeWhatsappSuffix, messageErrorCommandUsage, timestampToDate, uppercaseFirst} from "../lib/util.js"
import { generalLibrary } from "@victorsouzaleal/biblioteca-lbot"
import getCommands from "./list.commands.js"
import getGeneralMessages from "../lib/general-messages.js"

export async function mascoteCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const PIC_URL = "https://i.imgur.com/mVwa7q4.png"
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', PIC_URL, 'WhatsApp Jr.', message.wa_message, {expiration: message.expiration})
}

export async function simiCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const simiResult = await generalLibrary.simSimi(message.text_command)
    const replyText = buildText(commandsData.fun.simi.msgs.reply, timestampToDate(Date.now()), simiResult)
    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function viadometroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if (!message.isGroupMsg) throw new Error(generalMessages.permission.group)
    if (!message.isQuoted && !message.mentioned.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    if (message.mentioned.length > 1) throw new Error(commandsData.fun.viadometro.msgs.error_mention)
    
    const randomNumber = Math.floor(Math.random() * 100)
    const messageToReply = (message.quotedMessage && message.mentioned.length != 1) ? message.quotedMessage?.wa_message : message.wa_message
    const replyText = buildText(commandsData.fun.viadometro.msgs.reply, randomNumber)
    await Whatsapp.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})   
}

export async function detectorCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if (!message.isGroupMsg) throw new Error(generalMessages.permission.group)
    if (!message.isQuoted) throw new Error(messageErrorCommandUsage(botInfo, message))

    const quotedMessage = message.quotedMessage?.wa_message

    if (!quotedMessage) throw new Error(commandsData.fun.detector.msgs.error_message)

    const truthMachineResult = generalLibrary.truthMachine()
    const waitReply = commandsData.fun.detector.msgs.wait
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', truthMachineResult.calibration_url, waitReply, quotedMessage, {expiration: message.expiration})
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', truthMachineResult.result_url, '', quotedMessage, {expiration: message.expiration})
}

export async function roletarussaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)
    if (!message.isGroupAdmin) throw new Error (generalMessages.permission.admin_group_only)
    if (!group.admins.includes(botInfo.host_number)) throw new Error(generalMessages.permission.bot_group_admin)
    
    let eligibleParticipants = group.participants
    eligibleParticipants.splice(eligibleParticipants.indexOf(botInfo.host_number), 1)
    if (group.owner && group.owner != botInfo.host_number) eligibleParticipants.splice(eligibleParticipants.indexOf(group.owner),1)

    if (!eligibleParticipants.length) throw new Error(commandsData.fun.roletarussa.msgs.error)

    let randomIndex = Math.floor(Math.random() * eligibleParticipants.length)
    let chosenParticipant = eligibleParticipants[randomIndex]
    const waitReply = commandsData.fun.roletarussa.msgs.wait
    const replyText = buildText(commandsData.fun.roletarussa.msgs.reply, removeWhatsappSuffix(chosenParticipant))
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    await Whatsapp.sendTextWithMentions(client, message.chat_id, replyText, [chosenParticipant], {expiration: message.expiration})
    await Whatsapp.removeParticipant(client, message.chat_id, chosenParticipant) 
}

export async function casalCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
   
    if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)
    
    let currentParticipants = group.participants

    if (currentParticipants && currentParticipants.length < 2) throw new Error(commandsData.fun.casal.msgs.error)
    
    let randomIndex = Math.floor(Math.random() * currentParticipants.length)
    let chosenParticipant1 = currentParticipants[randomIndex]
    currentParticipants.splice(randomIndex, 1)
    randomIndex = Math.floor(Math.random() * currentParticipants.length)
    let chosenParticipant2 = currentParticipants[randomIndex]
    let replyText = buildText(commandsData.fun.casal.msgs.reply, removeWhatsappSuffix(chosenParticipant1), removeWhatsappSuffix(chosenParticipant2))
    await Whatsapp.sendTextWithMentions(client, message.chat_id, replyText, [chosenParticipant1, chosenParticipant2], {expiration: message.expiration})
}

export async function caracoroaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const validChoices = ['cara', 'coroa']
    const userChoice = message.text_command.toLowerCase()

    if (!message.args.length || !validChoices.includes(userChoice)) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    const flipCoinInfo = generalLibrary.flipCoin()
    const waitText = commandsData.fun.caracoroa.msgs.wait
    await Whatsapp.replyText(client, message.chat_id, waitText, message.wa_message, {expiration: message.expiration})

    const isUserVictory = flipCoinInfo.chosen_side == userChoice
    let replyText : string

    if (isUserVictory) replyText = buildText(commandsData.fun.caracoroa.msgs.reply_victory, uppercaseFirst(flipCoinInfo.chosen_side))
    else replyText = buildText(commandsData.fun.caracoroa.msgs.reply_defeat, uppercaseFirst(flipCoinInfo.chosen_side))
    
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', flipCoinInfo.image_coin_url, replyText, message.wa_message, {expiration: message.expiration})
}

export async function pptCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
    const validChoices = ["pedra", "papel", "tesoura"]
    const userChoice = message.text_command.toLocaleLowerCase()
    const randomIndex = Math.floor(Math.random() * validChoices.length)

    if (!message.args.length || !validChoices.includes(userChoice)) throw new Error(messageErrorCommandUsage(botInfo, message))

    let botChoice = validChoices[randomIndex]
    let botIconChoice : string
    let userIconChoice : string
    let isUserVictory : boolean | undefined
    
    if (botChoice == "pedra"){
        botIconChoice = "✊"
        if (userChoice == "pedra") userIconChoice = "✊";
        else if (userChoice == "tesoura") isUserVictory = false, userIconChoice = "✌️";
        else isUserVictory = true, userIconChoice = "✋";
    } else if (botChoice == "papel"){
        botIconChoice = "✋"
        if (userChoice == "pedra") isUserVictory = false, userIconChoice = "✊";
        else if (userChoice == "tesoura") isUserVictory = true, userIconChoice = "✌️";
        else userIconChoice = "✋";
    } else  {
        botIconChoice = "✌️"
        if (userChoice == "pedra") isUserVictory = true, userIconChoice = "✊";
        else if (userChoice == "tesoura") userIconChoice = "✌️";
        else isUserVictory = false, userIconChoice = "✋";
    }

    let replyText : string

    if (isUserVictory === true) replyText = buildText(commandsData.fun.ppt.msgs.reply_victory, userIconChoice, botIconChoice)
    else if (isUserVictory === false) replyText = buildText(commandsData.fun.ppt.msgs.reply_defeat, userIconChoice, botIconChoice)
    else replyText = buildText(commandsData.fun.ppt.msgs.reply_draw, userIconChoice, botIconChoice)
    
    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function gadometroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
   
    if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)
    if (!message.isQuoted && !message.mentioned.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    if (message.mentioned.length > 1) throw new Error(commandsData.fun.gadometro.msgs.error_mention)
    
    const randomNumber = Math.floor(Math.random() * 100)
    const messageToReply = (message.quotedMessage && message.mentioned.length != 1) ? message.quotedMessage?.wa_message : message.wa_message
    const replyText = buildText(commandsData.fun.gadometro.msgs.reply, randomNumber)
    await Whatsapp.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})   
}

export async function bafometroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)
   
    if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)
    if (!message.isQuoted && !message.mentioned.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    if (message.mentioned.length > 1) throw new Error(commandsData.fun.bafometro.msgs.error_mention)

    const randomNumber = Math.floor(Math.random() * 100)
    const messageToReply = (message.quotedMessage && message.mentioned.length != 1) ? message.quotedMessage?.wa_message : message.wa_message
    const replyText = buildText(commandsData.fun.bafometro.msgs.reply, randomNumber)
    await Whatsapp.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})   
}

export async function top5Command(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)
    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    let rankingTheme = message.text_command
    let currentParticipants = group.participants

    if (currentParticipants.length < 5) throw new Error(commandsData.fun.top5.msgs.error_members)

    let replyText = buildText(commandsData.fun.top5.msgs.reply_title, rankingTheme)
    let mentionList = []

    for (let i = 1 ; i <= 5 ; i++){
        let icon

        switch(i){
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

        let randomIndex = Math.floor(Math.random() * currentParticipants.length)
        let chosenParticipant = currentParticipants[randomIndex]
        replyText += buildText(commandsData.fun.top5.msgs.reply_item, icon, i, removeWhatsappSuffix(chosenParticipant))
        mentionList.push(chosenParticipant)
        currentParticipants.splice(currentParticipants.indexOf(chosenParticipant, 1))                
    }

    await Whatsapp.sendTextWithMentions(client, message.chat_id, replyText, mentionList, {expiration: message.expiration})
}

export async function parCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if (!message.isGroupMsg || !group) throw new Error(generalMessages.permission.group)
    if (message.mentioned.length !== 2) throw new Error(messageErrorCommandUsage(botInfo, message))

    const randomNumber = Math.floor(Math.random() * 100)
    let replyText = buildText(commandsData.fun.par.msgs.reply, removeWhatsappSuffix(message.mentioned[0]), removeWhatsappSuffix(message.mentioned[1]), randomNumber)
    await Whatsapp.sendTextWithMentions(client, message.chat_id, replyText, message.mentioned, {expiration: message.expiration})
}

export async function chanceCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const generalMessages = getGeneralMessages(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const randomNumber = Math.floor(Math.random() * 100)
    const replyText = buildText(commandsData.fun.chance.msgs.reply, randomNumber, message.text_command)
    const messageToReply = (message.isQuoted && message.quotedMessage) ? message.quotedMessage?.wa_message : message.wa_message
    await Whatsapp.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})
}

export async function fraseCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const commandsData = getCommands(botInfo)
    const phraseResult = await generalLibrary.funnyRandomPhrases()
    const replyText =  buildText(commandsData.fun.frase.msgs.reply, phraseResult.text)
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', phraseResult.image_url, replyText, message.wa_message, {expiration: message.expiration})
}