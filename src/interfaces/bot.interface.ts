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