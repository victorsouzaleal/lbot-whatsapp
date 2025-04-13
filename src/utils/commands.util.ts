
import { Bot } from "../interfaces/bot.interface.js"
import {CategoryCommand, Commands } from "../interfaces/command.interface.js"
import infoCommands from "../commands/info.list.commands.js"
import utilityCommands from "../commands/utility.list.commands.js"
import miscCommands from "../commands/misc.list.commands.js"
import groupCommands from "../commands/group.list.commands.js"
import adminCommands from "../commands/admin.list.commands.js"
import stickerCommands from "../commands/sticker.list.commands.js"
import downloadCommands from "../commands/download.list.commands.js"
import botTexts from "../helpers/bot.texts.helper.js"
import { removePrefix } from "../libraries/whatsapp.library.js"
import { buildText } from "./general.util.js"

const COMMAND_CATEGORIES = ['info', 'utility', 'download', 'sticker', 'misc', 'group', 'admin']

export function commandExist(prefix: string, command: string, category? : CategoryCommand){
    if (!category) {
        return getCommands(prefix).includes(command)
    } else {
        return getCommandsByCategory(prefix, category).includes(command)
    }
}

export function getCommands(prefix: string){
    const commands = [
        ...Object.keys(utilityCommands),
        ...Object.keys(miscCommands),
        ...Object.keys(infoCommands),
        ...Object.keys(groupCommands),
        ...Object.keys(adminCommands),
        ...Object.keys(stickerCommands),
        ...Object.keys(downloadCommands),
    ].map(command => prefix+command)
    
    return commands
}

export function getCommandsByCategory(prefix: string, category: CategoryCommand){
    switch(category){
        case 'info':
            return Object.keys(infoCommands).map(command => prefix+command)
        case 'utility':
            return Object.keys(utilityCommands).map(command => prefix+command)
        case 'download':
            return Object.keys(downloadCommands).map(command => prefix+command)
        case 'sticker':
            return Object.keys(stickerCommands).map(command => prefix+command)
        case 'misc':
            return Object.keys(miscCommands).map(command => prefix+command)
        case 'group':
            return Object.keys(groupCommands).map(command => prefix+command)
        case 'admin':
            return Object.keys(adminCommands).map(command => prefix+command)
    }
}

export function getCommandCategory(prefix: string, command: string){
    let foundCategory : CategoryCommand | null = null
    const categories = COMMAND_CATEGORIES as CategoryCommand[] 

    for (let category of categories){
        if (getCommandsByCategory(prefix, category).includes(command)) {
            foundCategory = category as CategoryCommand
        }
    }

    return foundCategory
}

export function getCommandGuide(prefix: string, command: string){
    const commandCategory = getCommandCategory(prefix, command)
    const {guide_header_text, no_guide_found} = botTexts
    let guide_text : string

    switch(commandCategory){
        case 'info':
            const info = infoCommands as Commands
            guide_text = guide_header_text + info[removePrefix(prefix, command)].guide
            break
        case 'utility':
            const utility = utilityCommands as Commands
            guide_text = guide_header_text + utility[removePrefix(prefix, command)].guide
            break
        case 'download':
            const download = downloadCommands as Commands
            guide_text = guide_header_text + download[removePrefix(prefix, command)].guide
            break
        case 'sticker':
            const sticker = stickerCommands as Commands
            guide_text = guide_header_text + sticker[removePrefix(prefix, command)].guide
            break
        case 'misc':
            const misc = miscCommands as Commands
            guide_text = guide_header_text + misc[removePrefix(prefix, command)].guide
            break
        case 'group':
            const group = groupCommands as Commands
            guide_text = guide_header_text + group[removePrefix(prefix, command)].guide
            break
        case 'admin':
            const admin = adminCommands as Commands
            guide_text = guide_header_text + admin[removePrefix(prefix, command)].guide
            break
        default:
            guide_text = no_guide_found
    }

    return buildText(guide_text)
}