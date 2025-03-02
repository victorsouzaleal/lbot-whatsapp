import { WASocket } from "baileys"
import { Bot } from "./bot.interface.js"
import { Message } from "./message.interface.js"
import { Group } from "./group.interface.js"

export type CategoryCommand = "info" | "utility" | "download" | "fun" | "group" | "sticker" | "admin"
type CommandFunction = (client: WASocket, botInfo: Bot, message: Message, group?: Group) => Promise<void>

export type Commands = {
    [command_name : string] : {
        guide: string,
        msgs?: {
            [message_type : string] : string
        }
        function: CommandFunction
    }
}

export type CommandsList = {
    [category in CategoryCommand]: Commands
}



