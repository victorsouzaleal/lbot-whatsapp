import {proto}  from 'baileys'
import { Group } from '../interfaces/group.interface.js'
import { Message, MessageTypes } from '../interfaces/message.interface.js'
import { getContentType, generateWAMessageFromContent, WAMessage } from 'baileys'
import NodeCache from 'node-cache'

export class MessageService{
    constructor(){}

    storeMessageCache(message : proto.IWebMessageInfo, messageCache: NodeCache){
        if(message.key.remoteJid && message.key.id && message.message){
            messageCache.set(message.key.id,{
                message : message.message
            })
        }
    }

    getMessageCache(messageId: string, messageCache: NodeCache){
        let message : proto.IMessage | undefined = messageCache.get(messageId)
        return message
    }

    private isAllowedType(type : keyof proto.IMessage){
        const allowedTypes : MessageTypes[] = [
            "conversation",
            "extendedTextMessage",
            "audioMessage",
            "imageMessage",
            "audioMessage",
            "documentMessage",
            "stickerMessage",
            "videoMessage",
        ]

        return allowedTypes.includes(type as MessageTypes)
    }
    
    formatWAMessage(m: WAMessage, group: Group|null, hostId: string, adminId?: string){
        if(!m.message) return
        const type = getContentType(m.message)
        if(!type) return 
        if(!this.isAllowedType(type)) return 
        if(!m.message[type]) return 
        const contextInfo : proto.IContextInfo | undefined  = (typeof m.message[type] != "string" && m.message[type] && "contextInfo" in m.message[type]) ? m.message[type].contextInfo as proto.IContextInfo: undefined
        const isQuoted = (contextInfo?.quotedMessage) ? true : false
        const sender = (m.key.fromMe) ? hostId : m.key.participant || m.key.remoteJid
        const body =  m.message.conversation ||  m.message.extendedTextMessage?.text || undefined
        const caption = (typeof m.message[type] != "string" && m.message[type] && "caption" in m.message[type]) ? m.message[type].caption as string | null: undefined
        const text =  caption || body || ''
        const [command, ...args] = text.trim().split(" ") 
        const isBotAdmin = adminId == sender
        const isGroupMsg = m.key.remoteJid?.includes("@g.us") ?? false
        const message_id = m.key.id
        const t = m.messageTimestamp as number
        const chat_id = m.key.remoteJid
        const isGroupAdmin = (sender && group) ? group.admins.includes(sender) : false

        if(!message_id || !t || !sender || !chat_id ) return 

        let formattedMessage : Message = {
            message_id,
            sender,
            type : type as MessageTypes,
            t,
            chat_id,
            pushname: m.pushName || '',
            body: m.message.conversation || m.message.extendedTextMessage?.text || '',
            caption : caption || '',
            mentioned: contextInfo?.mentionedJid || [],
            text_command: args?.join(" ").trim() || '',
            command: command?.toLowerCase().trim() || '',
            args,
            isQuoted,
            isGroupMsg,
            isGroupAdmin,
            isBotAdmin,
            isBotMessage: m.key.fromMe ?? false,
            isBroadcast: m.key.remoteJid == "status@broadcast",
            isMedia: type != "conversation" && type != "extendedTextMessage",
            wa_message: m,
        }

        if(formattedMessage.isMedia){
            const mimetype = (typeof m.message[type] != "string" && m.message[type] && "mimetype" in m.message[type]) ? m.message[type].mimetype as string | null : undefined
            const url = (typeof m.message[type] != "string" && m.message[type] && "url" in m.message[type]) ? m.message[type].url as string | null : undefined
            const seconds = (typeof m.message[type] != "string" && m.message[type] && "seconds" in m.message[type]) ? m.message[type].seconds as number | null : undefined
            const file_length = (typeof m.message[type] != "string" && m.message[type] && "fileLength" in m.message[type]) ? m.message[type].fileLength as number | Long | null : undefined

            if(!mimetype || !url || !file_length) return

            formattedMessage.media = {
                mimetype,
                url,
                seconds : seconds || undefined,
                file_length
            }
        }


        if(formattedMessage.isQuoted){
            const quotedMessage = contextInfo?.quotedMessage
            if(!quotedMessage) return
            const typeQuoted = getContentType(quotedMessage)
            const senderQuoted = contextInfo.participant || contextInfo.remoteJid
            if(!typeQuoted || !senderQuoted ) return
            const captionQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "caption" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].caption as string | null : undefined
          

            formattedMessage.quotedMessage = {
                type: typeQuoted,
                sender: senderQuoted,
                body: quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '',
                caption: captionQuoted || '',
                isMedia : typeQuoted != "conversation" && typeQuoted != "extendedTextMessage",
                wa_message: generateWAMessageFromContent(senderQuoted, quotedMessage, {userJid: senderQuoted})
            }

            if(formattedMessage.quotedMessage?.isMedia){
                const urlQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "url" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].url as string | null : undefined
                const mimetypeQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "mimetype" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].mimetype as string | null : undefined
                const fileLengthQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "fileLength" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].fileLength as number| Long | null : undefined
                const secondsQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "seconds" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].seconds as number| null : undefined
                
                if(!urlQuoted || !mimetypeQuoted || !fileLengthQuoted) return

                formattedMessage.quotedMessage.media = {
                    url: urlQuoted,
                    mimetype: mimetypeQuoted,
                    file_length: fileLengthQuoted,
                    seconds: secondsQuoted || undefined,
                }
            }
            
        }

        return formattedMessage
    }
}