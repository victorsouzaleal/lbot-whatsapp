export interface Group {
    id: string
    name : string
    description?: string
    commands_executed: number
    participants : string[]
    admins : string[]
    owner?: string
    restricted?: boolean
    muted: boolean,
    welcome: {
        status: boolean
        msg : string
    },
    antifake: {
        status: boolean
        allowed : string[]
    },
    antilink: boolean
    antiflood: {
        status: boolean
        max_messages: number
        interval: number
    },
    autosticker: boolean
    counter: {
        status: boolean
        started: string
    }
    block_cmds: string[]
    blacklist : string[]
}

export interface ParticipantAntiFlood {
    group_id: string,
    user_id: string,
    expire: number,
    msgs: number
}

export interface ParticipantCounter {
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