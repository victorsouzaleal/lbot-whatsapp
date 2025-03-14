export interface User {
    id : string,
    name? : string|null,
    commands: number,
    receivedWelcome: boolean,
    owner : boolean,
    admin: boolean,
}
