import { WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import { waLib, miscLib } from "../libraries/library.js"
import { buildText, messageErrorCommandUsage, uppercaseFirst} from "../utils/general.util.js"
import botTexts from "../helpers/bot.texts.helper.js"
import miscCommands from "./misc.list.commands.js"
import { GroupController } from "../controllers/group.controller.js"
import path from 'path'

export async function sorteioCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(message))
    } 

    const chosenNumber = Number(message.text_command)

    if (!chosenNumber || chosenNumber <= 1){
        throw new Error(miscCommands.sorteio.msgs.error_invalid_value)
    } 
    
    const randomNumber = Math.floor(Math.random() * chosenNumber) + 1
    const replyText = buildText(miscCommands.sorteio.msgs.reply, randomNumber)
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function sorteiomembroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const groupController = new GroupController()

    if (!message.isGroupMsg || !group){
        throw new Error(botTexts.permission.group)
    } 

    const currentParticipantsIds = await groupController.getParticipantsIds(group.id)
    const randomParticipant = currentParticipantsIds[Math.floor(Math.random() * currentParticipantsIds.length)]
    const replyText = buildText(miscCommands.sorteiomembro.msgs.reply, waLib.removeWhatsappSuffix(randomParticipant))
    await waLib.replyWithMentions(client, message.chat_id, replyText, [randomParticipant], message.wa_message, {expiration: message.expiration})
}

export async function mascoteCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const imagePath = path.resolve('dist/media/mascote.png')
    await waLib.replyFile(client, message.chat_id, 'imageMessage', imagePath, 'WhatsApp Jr.', message.wa_message, {expiration: message.expiration})
}

/*
export async function simiCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const miscCommands = commandsMisc(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(message))

    const simiResult = await miscLib.simSimi(message.text_command)
    const replyText = buildText(miscCommands.simi.msgs.reply, timestampToDate(Date.now()), simiResult)
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}*/

export async function viadometroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.isGroupMsg){
        throw new Error(botTexts.permission.group)
    } else if (!message.isQuoted && !message.mentioned.length){
        throw new Error(messageErrorCommandUsage(message))
    } else if (message.mentioned.length > 1){
        throw new Error(miscCommands.viadometro.msgs.error_mention)
    }

    const randomNumber = Math.floor(Math.random() * 100)
    const messageToReply = (message.quotedMessage && message.mentioned.length != 1) ? message.quotedMessage?.wa_message : message.wa_message
    const replyText = buildText(miscCommands.viadometro.msgs.reply, randomNumber)
    await waLib.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})   
}

export async function detectorCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.isGroupMsg) {
        throw new Error(botTexts.permission.group)
    } else if (!message.isQuoted) {
        throw new Error(messageErrorCommandUsage(message))
    }

    const quotedMessage = message.quotedMessage?.wa_message

    if (!quotedMessage) {
        throw new Error(miscCommands.detector.msgs.error_message)
    }
    
    const imagePathCalibration = path.resolve('dist/media/calibrando.png')
    const imagePathsResult = [
        path.resolve('dist/media/calibrando.png'),
        path.resolve('dist/media/estressealto.png'),
        path.resolve('dist/media/incerteza.png'),
        path.resolve('dist/media/kao.png'),
        path.resolve('dist/media/meengana.png'),
        path.resolve('dist/media/mentiroso.png'),
        path.resolve('dist/media/vaipra.png'),
        path.resolve('dist/media/verdade.png')
    ]

    const randomIndex = Math.floor(Math.random() * imagePathsResult.length)
    const waitReply = miscCommands.detector.msgs.wait
    await waLib.replyFile(client, message.chat_id, 'imageMessage', imagePathCalibration, waitReply, quotedMessage, {expiration: message.expiration})
    await waLib.replyFile(client, message.chat_id, 'imageMessage', imagePathsResult[randomIndex], '', quotedMessage, {expiration: message.expiration})
}

export async function roletarussaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const bulletPosition = Math.floor(Math.random() * 6) + 1
    const currentPosition = Math.floor(Math.random() * 6) + 1
    const hasShooted  = (bulletPosition == currentPosition)
    let replyText : string

    if (hasShooted) {
        replyText = miscCommands.roletarussa.msgs.reply_dead
    } else {
        replyText = miscCommands.roletarussa.msgs.reply_alive
    } 

    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function casalCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const groupController = new GroupController()

    if (!message.isGroupMsg || !group) {
        throw new Error(botTexts.permission.group)
    } 
    
    let currentParticipantsIds = await groupController.getParticipantsIds(group.id)

    if (currentParticipantsIds && currentParticipantsIds.length < 2) {
        throw new Error(miscCommands.casal.msgs.error)
    }
    
    let randomIndex = Math.floor(Math.random() * currentParticipantsIds.length)
    let chosenParticipant1 = currentParticipantsIds[randomIndex]
    currentParticipantsIds.splice(randomIndex, 1)
    randomIndex = Math.floor(Math.random() * currentParticipantsIds.length)
    let chosenParticipant2 = currentParticipantsIds[randomIndex]
    let replyText = buildText(miscCommands.casal.msgs.reply, waLib.removeWhatsappSuffix(chosenParticipant1), waLib.removeWhatsappSuffix(chosenParticipant2))
    await waLib.sendTextWithMentions(client, message.chat_id, replyText, [chosenParticipant1, chosenParticipant2], {expiration: message.expiration})
}

export async function caracoroaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const coinSides = ['cara', 'coroa']
    const userChoice = message.text_command.toLowerCase()

    if (!message.args.length || !coinSides.includes(userChoice)) {
        throw new Error(messageErrorCommandUsage(message))
    }
    
    const chosenSide = coinSides[Math.floor(Math.random() * coinSides.length)]
    const imagePath = chosenSide === 'cara' ? path.resolve('dist/media/cara.png') : path.resolve('dist/media/coroa.png')
    const waitText = miscCommands.caracoroa.msgs.wait
    await waLib.replyText(client, message.chat_id, waitText, message.wa_message, {expiration: message.expiration})
    const isUserVictory = chosenSide == userChoice
    let replyText : string

    if (isUserVictory) {
        replyText = buildText(miscCommands.caracoroa.msgs.reply_victory, uppercaseFirst(chosenSide))
    } else {
        replyText = buildText(miscCommands.caracoroa.msgs.reply_defeat, uppercaseFirst(chosenSide))
    }
    
    await waLib.replyFile(client, message.chat_id, 'imageMessage', imagePath, replyText, message.wa_message, { expiration: message.expiration })
    
}

export async function pptCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const validChoices = ["pedra", "papel", "tesoura"]
    const userChoice = message.text_command.toLocaleLowerCase()
    const randomIndex = Math.floor(Math.random() * validChoices.length)

    if (!message.args.length || !validChoices.includes(userChoice)) {
        throw new Error(messageErrorCommandUsage(message))
    }

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

    if (isUserVictory === true) {
        replyText = buildText(miscCommands.ppt.msgs.reply_victory, userIconChoice, botIconChoice)
    } else if (isUserVictory === false) {
        replyText = buildText(miscCommands.ppt.msgs.reply_defeat, userIconChoice, botIconChoice)
    } else {
        replyText = buildText(miscCommands.ppt.msgs.reply_draw, userIconChoice, botIconChoice)
    }
    
    await waLib.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function gadometroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.isGroupMsg || !group) {
        throw new Error(botTexts.permission.group)
    } else if (!message.isQuoted && !message.mentioned.length) {
        throw new Error(messageErrorCommandUsage(message))
    } else if (message.mentioned.length > 1) {
        throw new Error(miscCommands.gadometro.msgs.error_mention)
    }
    
    const randomNumber = Math.floor(Math.random() * 100)
    const messageToReply = (message.quotedMessage && message.mentioned.length != 1) ? message.quotedMessage?.wa_message : message.wa_message
    const replyText = buildText(miscCommands.gadometro.msgs.reply, randomNumber)
    await waLib.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})   
}

export async function bafometroCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.isGroupMsg || !group) {
        throw new Error(botTexts.permission.group)
    } else if (!message.isQuoted && !message.mentioned.length) {
        throw new Error(messageErrorCommandUsage(message))
    } else if (message.mentioned.length > 1) {
        throw new Error(miscCommands.bafometro.msgs.error_mention)
    }

    const randomNumber = Math.floor(Math.random() * 100)
    const messageToReply = (message.quotedMessage && message.mentioned.length != 1) ? message.quotedMessage?.wa_message : message.wa_message
    const replyText = buildText(miscCommands.bafometro.msgs.reply, randomNumber)
    await waLib.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})   
}

export async function top5Command(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const groupController = new GroupController()

    if (!message.isGroupMsg || !group) {
        throw new Error(botTexts.permission.group)
    } else if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(message))
    }
    
    let rankingTheme = message.text_command
    let currentParticipantsIds = await groupController.getParticipantsIds(group.id)

    if (currentParticipantsIds.length < 5) {
        throw new Error(miscCommands.top5.msgs.error_members)
    }

    let replyText = buildText(miscCommands.top5.msgs.reply_title, rankingTheme)
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

        let randomIndex = Math.floor(Math.random() * currentParticipantsIds.length)
        let chosenParticipant = currentParticipantsIds[randomIndex]
        replyText += buildText(miscCommands.top5.msgs.reply_item, icon, i, waLib.removeWhatsappSuffix(chosenParticipant))
        mentionList.push(chosenParticipant)
        currentParticipantsIds.splice(currentParticipantsIds.indexOf(chosenParticipant), 1)                
    }

    await waLib.sendTextWithMentions(client, message.chat_id, replyText, mentionList, {expiration: message.expiration})
}

export async function parCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.isGroupMsg || !group) {
        throw new Error(botTexts.permission.group)
    } else if (message.mentioned.length !== 2) {
        throw new Error(messageErrorCommandUsage(message))
    }

    const randomNumber = Math.floor(Math.random() * 100)
    let replyText = buildText(miscCommands.par.msgs.reply, waLib.removeWhatsappSuffix(message.mentioned[0]), waLib.removeWhatsappSuffix(message.mentioned[1]), randomNumber)
    await waLib.sendTextWithMentions(client, message.chat_id, replyText, message.mentioned, {expiration: message.expiration})
}

export async function chanceCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(message))
    }

    const randomNumber = Math.floor(Math.random() * 100)
    const replyText = buildText(miscCommands.chance.msgs.reply, randomNumber, message.text_command)
    const messageToReply = (message.isQuoted && message.quotedMessage) ? message.quotedMessage?.wa_message : message.wa_message
    await waLib.replyText(client, message.chat_id, replyText, messageToReply, {expiration: message.expiration})
}

export async function fraseCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const phraseResult = await miscLib.funnyRandomPhrases()
    const replyText =  buildText(miscCommands.frase.msgs.reply, phraseResult)
    const imagePath = path.resolve('dist/media/frasewhatsappjr.png')
    await waLib.replyFile(client, message.chat_id, 'imageMessage', imagePath, replyText, message.wa_message, {expiration: message.expiration})
}