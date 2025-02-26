import {proto, WAMessage} from 'baileys'

export type MessageTypes = "conversation" | "extendedTextMessage" | "imageMessage" | "documentMessage" | "videoMessage" | "stickerMessage" | "audioMessage"

export type MimeTypes = "audio/mp4" | "audio/mp3" | "image/png" | "image/webp" | "video/mp4" | "document/pdf" | "application/pdf"

export interface Message {
    message_id: string,
    sender: string,
    type: MessageTypes,
    t : number,
    chat_id: string,
    pushname : string,
    body: string,
    caption?: string,
    mentioned: string[],
    text_command: string,
    command: string,
    args: string[],
    isQuoted: boolean,
    isGroupMsg : boolean,
    isGroupAdmin: boolean,
    isBotAdmin : boolean,
    isBotMessage: boolean,
    isBroadcast: boolean,
    isMedia: boolean,
    wa_message: WAMessage,
    media? : {
        mimetype?: string | null,
        url?: string | null,
        seconds?: number | null,
        file_length?: number | Long | null
    },
    quotedMessage?: {
        type: keyof proto.IMessage,
        sender: string | null,
        body: string,
        caption? : string | null,
        url?: string | null,
        mimetype?: string | null,
        file_length?: number | Long | null,
        seconds?: number | null,
        wa_message : WAMessage
    }

}

export type DeletedMessage = {
    remoteJid?: string | null
    fromMe? : boolean,
    id?: string | null,
    participant?: string | null
} | proto.IMessageKey