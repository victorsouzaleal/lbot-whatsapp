export interface Group {
    id: string,
    name : string, 
    description : string | undefined,
    commands_executed: number,
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