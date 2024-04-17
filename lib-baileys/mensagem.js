import {generateWAMessageFromContent, getContentType} from '@whiskeysockets/baileys'
import pino from 'pino'

// TRADUZIR CONTEUDO DA MENSAGEM PARA A BIBLIOTECA BAILEYS
export const messageData = async(m) =>{
    try {
        m = m.messages[0]
        let messageData = {}
        let type = getContentType(m.message)
        let quotedMsg = type == MessageTypes.extendedText && m.message.extendedTextMessage?.contextInfo?.quotedMessage != undefined
        messageData = {
            sender : m.key.participant || m.key.remoteJid ,
            username : m.pushName,
            broadcast : m.key.remoteJid == "status@broadcast",
            caption : m.message[type].caption,
            messageId : m.key.id,
            body : m.message.conversation || m.message.extendedTextMessage?.text,
            id: m,
            type,
            t : m.messageTimestamp,
            mentionedJidList: m.message[type].contextInfo?.mentionedJid || [],
            mimetype: m.message[type].mimetype,
            mediaUrl: m.message[type].url,
            fromMe : m.key.fromMe,
            chatId: m.key.remoteJid,
            isGroupMsg : m.key.remoteJid.includes("@g.us"),
            isMedia : type == MessageTypes.image || type == MessageTypes.video,
            seconds : m.message[type].seconds,
            fileLength: m.message[type].fileLength,
            quotedMsg
        }

        if(quotedMsg) {
            let quotedType = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
            messageData.quotedMsgObj = generateWAMessageFromContent(m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid, m.message.extendedTextMessage.contextInfo.quotedMessage , { logger : pino() })
            messageData.quotedMsgObjInfo = {
                type : getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage),
                sender : m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid,
                body : m.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || m.message.extendedTextMessage.contextInfo.quotedMessage?.extendedTextMessage?.text,
                caption : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.caption,
                url : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.url,
                mimetype : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.mimetype,
                fileLength: m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.fileLength,
                seconds: m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.seconds
            }
        }
        return messageData
    } catch (err) {
        console.log(err)
        return m
    }
}

export const MessageTypes = {
    text : "conversation",
    extendedText : "extendedTextMessage",
    image: "imageMessage",
    document: "documentMessage",
    video: "videoMessage",
    sticker: "stickerMessage",
    audio: "audioMessage"
}

export const allowedMessageTypes = [
    "conversation",
    "extendedTextMessage",
    "imageMessage",
    "documentMessage",
    "videoMessage",
    "stickerMessage",
    "audioMessage"
]



