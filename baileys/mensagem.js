import {generateWAMessageFromContent, getContentType} from '@whiskeysockets/baileys'
import pino from 'pino'
import {listarComandos} from '../comandos/comandos.js'
import {obterMensagensTexto} from '../lib/msgs.js'
import * as bot from '../controle/botControle.js'
import * as grupos from '../controle/gruposControle.js'


export const converterMensagem = async(m) =>{
    try {
        m = m.messages[0]
        let respostaInformacoes = {}
        let type = getContentType(m.message)
        let quotedMsg = type == MessageTypes.extendedText && m.message.extendedTextMessage?.contextInfo?.quotedMessage != undefined
        let sender =  m.key.participant || m.key.remoteJid
        let lista_comandos = await listarComandos(),  msgs_texto = await obterMensagensTexto(), botInfoJSON = await bot.obterInformacoesBot()
        let textoRecebido = m.message[type]?.caption || m.message.conversation || m.message.extendedTextMessage?.text || ''
        let ownerNumber = botInfoJSON.numero_dono
        let isOwner = ownerNumber == sender
        let isGroupMsg = m.key.remoteJid.includes("@g.us")
        let groupId = isGroupMsg ? m.key.remoteJid : null
        let grupoInfo = isGroupMsg ? await grupos.obterGrupoInfo(groupId) : null
        let groupAdmins = (isGroupMsg && grupoInfo) ? grupoInfo.admins : null
        let isGroupAdmins = (isGroupMsg && grupoInfo) ? groupAdmins.includes(sender) : null
        let botNumber = await bot.obterNumeroBot()
        let isBotGroupAdmins = (isGroupMsg && grupoInfo) ? groupAdmins.includes(botNumber) : null

        respostaInformacoes = {
            mensagem:{
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
                chatId: m.key.remoteJid,
                isGroupMsg,
                participant: m.key.participant,
                isMedia : type == MessageTypes.image || type == MessageTypes.video,
                seconds : m.message[type]?.seconds,
                fileLength: m.message[type]?.fileLength,
                quotedMsg
            },
            bot:{
                botNumber,
                botInfoJSON
            },
            grupo:{
                groupId,
                grupoInfo,
                groupAdmins,
                isGroupAdmins,
                formattedTitle: grupoInfo?.nome || null,
                groupOwner: grupoInfo?.dono || null,
                groupMembers: grupoInfo?.participantes || null,
                isBotGroupAdmins,
            },
            msgs_texto,
            lista_comandos,
            ownerNumber
        }

        if(quotedMsg) {
            let quotedType = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
            respostaInformacoes.mensagem.quotedMsgObj = generateWAMessageFromContent(m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid, m.message.extendedTextMessage.contextInfo.quotedMessage , { logger : pino() })
            respostaInformacoes.mensagem.quotedMsgObjInfo = {
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
        return respostaInformacoes
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

export const tiposPermitidosMensagens = [
    "conversation",
    "extendedTextMessage",
    "imageMessage",
    "documentMessage",
    "videoMessage",
    "stickerMessage",
    "audioMessage"
]



