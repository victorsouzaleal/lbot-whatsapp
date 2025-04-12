export interface Bot {
    started: number,
    host_number: string,
    name: string,
    prefix: string,
    executed_cmds: number,
    database_updated: boolean,
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