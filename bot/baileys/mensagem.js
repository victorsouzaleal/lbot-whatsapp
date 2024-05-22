import {generateWAMessageFromContent, getContentType} from '@whiskeysockets/baileys'
import pino from 'pino'
import {GrupoControle} from '../controles/GrupoControle.js'


export const converterMensagem = async(m, botInfo) =>{
    try {
        m = m.messages[0]
        let type = getContentType(m.message)
        let viewOnce = type.includes('viewOnce')
        if(viewOnce){
            m.message = m.message[type].message
            type = getContentType(m.message)
        }
        let quotedMsg = type == MessageTypes.extendedText && m.message.extendedTextMessage?.contextInfo?.quotedMessage != undefined
        let botNumber = botInfo.hostNumber
        let sender = (m.key.fromMe) ? botNumber : m.key.participant || m.key.remoteJid
        let textoRecebido = m.message[type]?.caption || m.message.conversation || m.message.extendedTextMessage?.text || ''
        let ownerNumber = botInfo.numero_dono
        let isOwner = ownerNumber == sender
        let isGroupMsg = m.key.remoteJid.includes("@g.us")
        
        let respostaInformacoes = {
            textoRecebido,
            command: textoRecebido.toLowerCase().split(' ')[0] || '',
            args: textoRecebido.split(" "),
            sender,
            isOwner,
            username : m.pushName,
            broadcast : m.key.remoteJid == "status@broadcast",
            caption : m.message[type]?.caption,
            messageId : m.key.id,
            body : m.message.conversation || m.message.extendedTextMessage?.text,
            id: m,
            type,
            t : m.messageTimestamp,
            mentionedJidList: m.message[type]?.contextInfo?.mentionedJid || [],
            mimetype: m.message[type]?.mimetype,
            mediaUrl: m.message[type]?.url,
            fromMe : m.key.fromMe,
            viewOnce,
            chatId: m.key.remoteJid,
            isMedia : type == MessageTypes.image || type == MessageTypes.video,
            seconds : m.message[type]?.seconds,
            fileLength: m.message[type]?.fileLength,
            quotedMsg,
            quotedMsgObj: {},
            quotedMsgObjInfo: {},
            isGroupMsg,
            participant: m.key.participant,
            grupo : {},
        }
        

        if(isGroupMsg){
            let groupId = isGroupMsg ? m.key.remoteJid : null
            let grupoInfo = isGroupMsg ? await new GrupoControle().obterGrupoInfo(groupId) : null
            let groupAdmins = (isGroupMsg && grupoInfo) ? grupoInfo.admins : null
            let isGroupAdmins = (isGroupMsg && grupoInfo) ? groupAdmins.includes(sender) : null
            let isBotGroupAdmins = (isGroupMsg && grupoInfo) ? groupAdmins.includes(botNumber) : null
            respostaInformacoes.grupo = {
                groupId,
                grupoInfo,
                groupAdmins,
                isGroupAdmins,
                formattedTitle: grupoInfo?.nome || null,
                groupOwner: grupoInfo?.dono || null,
                groupMembers: grupoInfo?.participantes || null,
                isBotGroupAdmins
            }
        }

        if(quotedMsg) {
            let quotedType = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
            let viewOnce = quotedType.includes('viewOnce')
            if(viewOnce) {
                m.message.extendedTextMessage.contextInfo.quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType].message
                quotedType = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
            }
            respostaInformacoes.quotedMsgObj = generateWAMessageFromContent(m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid, m.message.extendedTextMessage.contextInfo.quotedMessage , { logger : pino() })
            respostaInformacoes.quotedMsgObjInfo = {
                type : getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage),
                sender : m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid,
                body : m.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || m.message.extendedTextMessage.contextInfo.quotedMessage?.extendedTextMessage?.text,
                caption : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.caption,
                url : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.url,
                mimetype : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.mimetype,
                fileLength: m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.fileLength,
                seconds: m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.seconds,
                viewOnce
            }
        }
        
        return respostaInformacoes
    } catch (err) {
        throw err
    }
}

export const obterTipoDeMensagem = (type) => {
    if(type == MessageTypes.text || type == MessageTypes.extendedText) return 'Texto'
    if(type == MessageTypes.image) return 'Imagem'
    if(type == MessageTypes.document) return 'Documento/Arquivo'
    if(type == MessageTypes.video) return 'Video/GIF'
    if(type == MessageTypes.sticker) return 'Sticker'
    if(type == MessageTypes.audio) return 'Audio'
    return null
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

export const tiposPermitidosMensagens = [
    "conversation",
    "extendedTextMessage",
    "imageMessage",
    "documentMessage",
    "videoMessage",
    "stickerMessage",
    "audioMessage"
]

