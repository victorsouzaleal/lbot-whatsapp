export interface User {
    id : string,
    name? : string|null,
    commands: number,
    receivedWelcome: boolean,
    owner : boolean,
    admin: boolean,
    command_rate: UserCommandRate
}

export interface UserCommandRate {
    limited: boolean,
    expire_limited: number,
    cmds : number,
    expire_cmds : number
}

