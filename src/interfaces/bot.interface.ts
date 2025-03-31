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
    admin_mode: boolean,
    command_rate:{
        status: boolean,
        max_cmds_minute: number,
        block_time: number,
    }
}

export interface UserCommandRate {
    user_id : string,
    limited: boolean,
    expire_limited: number,
    cmds : number,
    expire_cmds : number
}