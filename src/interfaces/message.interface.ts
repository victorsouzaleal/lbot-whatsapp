import {proto, WAMessage} from 'baileys'

export type MessageTypes = "conversation" | "extendedTextMessage" | "imageMessage" | "documentMessage" | "videoMessage" | "stickerMessage" | "audioMessage"

export type MimeTypes = "audio/mpeg"| "audio/mp4" | "audio/mp3" | "image/png" | "image/webp" | "video/mp4" | "document/pdf" | "application/pdf"

export interface Message {
    message_id: string,
    sender: string,
    type: MessageTypes,
    t : number,
    chat_id: string,
    pushname : string,
    body: string,
    caption: string,
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
        mimetype: string,
        url: string,
        seconds?: number,
        file_length: number | Long 
    },
    quotedMessage?: {
        type: keyof proto.IMessage,
        sender: string,
        body: string,
        caption : string,
        isMedia: boolean,
        media? : {
            url: string,
            mimetype: string,
            file_length: number | Long,
            seconds?: number,
        }
        wa_message : WAMessage
    }

}