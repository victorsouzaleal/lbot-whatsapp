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
    commands_pv: boolean,
    command_rate:{
        status: boolean,
        max_cmds_minute: number,
        block_time: number,
    },
    api_keys: {
        deepgram: {
            secret_key: string | null
        },
        acrcloud: {
            host: string | null,
            access_key: string | null,
            secret_key: string | null
        }
    }
}

export interface UserCommandRate {
    user_id : string,
    limited: boolean,
    expire_limited: number,
    cmds : number,
    expire_cmds : number
}