import { downloadMediaMessage, WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import { BaileysController } from "../controllers/baileys.controller.js"
import { buildText, messageErrorCommandUsage} from "../lib/util.js"
import { audioLibrary, generalLibrary, imageLibrary, stickerLibrary } from "@victorsouzaleal/biblioteca-lbot"
import getCommands from "./list.commands.js"


export async function sCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    
    let stickerType : "resize" | "contain" | "circle" =  'resize'
    if (message.args[0] === '1') stickerType = 'circle'
    if (message.args[0] === '2') stickerType = 'contain'
    
    let messageData = {
        type : (message.isQuoted) ? message.quotedMessage?.type : message.type,
        mimetype : (message.isQuoted) ? message.quotedMessage?.media?.mimetype : message.media?.mimetype,
        message: (message.isQuoted) ? message.quotedMessage?.wa_message  : message.wa_message,
        seconds: (message.isQuoted) ? message.quotedMessage?.media?.seconds : message.media?.seconds
    }

    if (!messageData.type || !messageData.mimetype || !messageData.message) throw new Error(commandsData.sticker.s.msgs.error_message)

    if (messageData.type != "imageMessage" && messageData.type != "videoMessage") throw new Error(messageErrorCommandUsage(botInfo, message))

    if (messageData.type == "videoMessage" && messageData.seconds && messageData.seconds  > 9) throw new Error(commandsData.sticker.s.msgs.error_limit)
    
    let mediaBuffer = await downloadMediaMessage(messageData.message, "buffer", {})
    let stickerBuffer = await stickerLibrary.createSticker(mediaBuffer, {pack: botInfo.pack_sticker.trim(), author: botInfo.author_sticker.trim(), fps: 9, type: stickerType})

    await baileysController.sendSticker(message.chat_id, stickerBuffer)
}

export async function simgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.isQuoted) throw new Error(messageErrorCommandUsage(botInfo, message))

    if (message.quotedMessage?.type != "stickerMessage") throw new Error(commandsData.sticker.simg.msgs.error_sticker)

    let stickerBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, "buffer", {})
    let imageBuffer = await stickerLibrary.stickerToImage(stickerBuffer)

    await baileysController.replyFileFromBuffer(message.chat_id, 'imageMessage', imageBuffer, '', message.wa_message, 'image/png')
}

export async function ssfCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    let messageData = {
        type : (message.isQuoted) ? message.quotedMessage?.type : message.type,
        mimetype : (message.isQuoted) ? message.quotedMessage?.media?.mimetype : message.media?.mimetype,
        message: (message.isQuoted) ? message.quotedMessage?.wa_message : message.wa_message
    }

    if (!messageData.type || !messageData.mimetype || !messageData.message) throw new Error(commandsData.sticker.ssf.msgs.error_message)

    if (messageData.type != "imageMessage") throw new Error(commandsData.sticker.ssf.msgs.error_image)

    await baileysController.replyText(message.chat_id, commandsData.sticker.ssf.msgs.wait, message.wa_message)

    const mediaBuffer = await downloadMediaMessage(messageData.message, "buffer", {})
    const imageBuffer = await imageLibrary.removeBackground(mediaBuffer)
    const stickerBuffer = await stickerLibrary.createSticker(imageBuffer, {pack: botInfo.pack_sticker?.trim(), author: botInfo.author_sticker?.trim(), fps: 9, type: 'resize'})

    await baileysController.sendSticker(message.chat_id, stickerBuffer)
}

export async function emojimixCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let [emoji1, emoji2] = message.text_command.split("+")

    if (!emoji1 || !emoji2) throw new Error(messageErrorCommandUsage(botInfo, message))

    const imageBuffer = await imageLibrary.emojiMix(emoji1.trim(), emoji2.trim())
    const stickerBuffer = await stickerLibrary.createSticker(imageBuffer, {pack: botInfo.pack_sticker?.trim(), author: botInfo.author_sticker?.trim(), fps: 9, type: 'resize'})
    
    await baileysController.sendSticker(message.chat_id, stickerBuffer)
}

export async function snomeCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.isQuoted || message.quotedMessage?.type != "stickerMessage") throw new Error(messageErrorCommandUsage(botInfo, message))

    let [pack, author] = message.text_command.split(',')

    if (!pack || !author) throw new Error(messageErrorCommandUsage(botInfo, message))

    let messageQuotedData = message.quotedMessage.wa_message

    if (!messageQuotedData.message?.stickerMessage) throw new Error(commandsData.sticker.snome.msgs.error_message)
    
    messageQuotedData.message.stickerMessage.url = (messageQuotedData.message.stickerMessage.url == "https://web.whatsapp.net") 
        ? `https://mmg.whatsapp.net${messageQuotedData.message.stickerMessage.directPath}` 
        : messageQuotedData.message.stickerMessage.url

    let stickerBuffer = await downloadMediaMessage(messageQuotedData, 'buffer', {})
    let stickerRenamedBuffer = await stickerLibrary.renameSticker(stickerBuffer, pack, author)

    await baileysController.sendSticker(message.chat_id, stickerRenamedBuffer)
}

export async function autoSticker(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (message.type != 'imageMessage' && message.type != "videoMessage") return

    if (message.type == "videoMessage" && message.media?.seconds && message.media?.seconds > 9) return

    let mediaBuffer = await downloadMediaMessage(message.wa_message, "buffer", {})
    let stickerBuffer = await stickerLibrary.createSticker(mediaBuffer, {pack: botInfo.pack_sticker?.trim(), author: botInfo.author_sticker?.trim(), fps: 9, type: 'resize'})
    
    await baileysController.sendSticker(message.chat_id, stickerBuffer)
}

