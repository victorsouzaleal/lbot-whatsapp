import {proto, WAMessage} from 'baileys'

export type CommandCategory  = "info" | "utility" | "sticker" | "download" | "fun" | "group" | "admin"
export type MessageTypes = "conversation" | "extendedTextMessage" | "imageMessage" | "documentMessage" | "videoMessage" | "stickerMessage" | "audioMessage"
export type MimeTypes = "audio/mp4" | "audio/mp3" | "image/png" | "image/webp" | "video/mp4" | "document/pdf" | "application/pdf"
export interface Bot {
    started: number,
    host_number: string,
    name: string,
    author_sticker: string,
    pack_sticker: string,
    prefix: string,
    executed_cmds: number,
    autosticker: boolean,
    block_cmds: string[],
    antispam_cmds:{
        status: boolean,
        max_cmds_minute: number,
        block_time: number,
        users: {
            id_user : string,
            cmds : number,
            expiration : number
        }[],
        limited_users: {
            id_user : string,
            expiration : number
        }[]
    },
    pv_allowed: boolean
}

export interface User {
    id : string,
    name? : string|null,
    commands: number,
    receivedWelcome: boolean,
    admin: boolean,
}

export interface Group {
    id: string,
    name : string, 
    description : string | undefined,
    participants : string[],
    admins : string[],
    owner : string | undefined,
    restricted : boolean | undefined,
    muted : boolean,
    welcome : {
        status: boolean,
        msg : string
    },
    antifake: {
        status: boolean,
        allowed : string[]
    },
    antilink: boolean,
    antiflood: {
        status: boolean,
        max_messages: number,
        interval: number,
        messages : AntiFloodMessage []
    },
    autosticker: boolean,
    counter: {
        status: boolean,
        started: string
    }
    block_cmds: string[],
    blacklist : string[]
}

export interface AntiFloodMessage {
    id: string,
    expire: number,
    qty: number
}

export interface CounterUser {
    group_id : string,
    user_id : string,
    msgs : number,
    image : number,
    audio : number,
    sticker : number,
    video : number,
    text : number,
    other : number
}

export type DeletedMessage = {
    remoteJid?: string | null
    fromMe? : boolean,
    id?: string | null,
    participant?: string | null
} | proto.IMessageKey



export interface Message {
    message_id: string,
    sender: string,
    type: MessageTypes,
    t : number | Long.Long,
    chat_id: string,
    pushname? : string | null,
    body: string,
    caption?: string | null,
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
export type UsersType = 'dono' | 'comum'