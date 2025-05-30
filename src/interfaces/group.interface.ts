export interface Group {
    id: string
    name : string
    description?: string
    commands_executed: number
    owner?: string
    restricted?: boolean
    expiration?: number,
    muted: boolean,
    welcome: {
        status: boolean
        msg : string
    },
    antifake: { 
        status: boolean, 
        exceptions: {
            prefixes: string[],
            numbers: string[]
        }
    },
    antilink: {
        status: boolean,
        exceptions: string[]
    },
    antiflood: {
        status: boolean
        max_messages: number
        interval: number
    },
    auto_reply: {
        status: boolean,
        config: {
            word: string,
            reply: string
        }[]
    }
    autosticker: boolean
    block_cmds: string[]
    blacklist : string[]
    word_filter: string[]
}

export interface ParticipantAntiFlood {
    group_id: string,
    user_id: string,
    expire: number,
    msgs: number
}

export interface Participant{
    group_id : string,
    user_id : string,
    admin: boolean,
    registered_since: string,
    commands: number,
    msgs : number,
    image : number,
    audio : number,
    sticker : number,
    video : number,
    text : number,
    other : number,
    warnings: number,
    antiflood: {
        expire: number,
        msgs: number
    }
}