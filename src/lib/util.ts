import moment from "moment-timezone"
import chalk from 'chalk'
import path from 'node:path'
import fs from 'fs-extra'
import { GroupMetadata, WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import {CategoryCommand, Commands } from "../interfaces/command.interface.js"
import getCommands from "../commands/list.commands.js"
import getGeneralMessages from "./general-messages.js"
import { BaileysController } from "../controllers/baileys.controller.js"
import { Message } from "../interfaces/message.interface.js"

export function commandExist(botInfo: Bot, command: string, category? : CategoryCommand){
    const commandsData = getCommands(botInfo)
    let commands
    if (!category){
        commands = [
            ...Object.keys(commandsData.utility),
            ...Object.keys(commandsData.fun),
            ...Object.keys(commandsData.info),
            ...Object.keys(commandsData.group),
            ...Object.keys(commandsData.admin),
            ...Object.keys(commandsData.sticker),
            ...Object.keys(commandsData.download),
        ].map(command => botInfo.prefix+command)
    } else {
        commands = Object.keys(commandsData[category]).map(command => botInfo.prefix+command)
    }
    return commands.includes(command)
}

export function getCommandCategory(command: string, prefix: string){
    const commandsData = getCommands()
    const categories = Object.keys(commandsData)
    let foundCategory : CategoryCommand | null = null 
    for (let category of categories){
        const commandsCategory = Object.keys(commandsData[category as CategoryCommand])
        if (commandsCategory.includes(command.replace(prefix, ''))) foundCategory = category as CategoryCommand
    }
    return foundCategory
}

export function getCommandGuide(botInfo: Bot, command: string, category : CategoryCommand){
    const commandsData = getCommands(botInfo)
    const {guide_header_text} = getGeneralMessages(botInfo)
    const {prefix} = botInfo
    command = command.replace(prefix, '')
    const commandsCategory  = commandsData[category] as Commands
    return guide_header_text + commandsCategory[command].guide
}


export function getGroupParticipantsByMetadata(group : GroupMetadata){ 
    const {participants} = group
    let groupParticipants : string[] = []
    participants.forEach((participant)=>{
        groupParticipants.push(participant.id)
    })
    return groupParticipants
}

export function getGroupAdminsByMetadata(group: GroupMetadata){ 
    const {participants} = group
    const admins = participants.filter(user => (user.admin != null))
    let groupAdmins : string[] = []
    admins.forEach((admin)=>{
        groupAdmins.push(admin.id)
    })
    return groupAdmins
}

export function messageErrorCommandUsage(botInfo: Bot, message: Message){
    const generalMessages = getGeneralMessages(botInfo)
    return buildText(generalMessages.error_command_usage, message.command, message.command)
}

export function messageErrorCommand(botInfo: Bot, command: string, reason: string){
    const generalMessages = getGeneralMessages()
    return buildText(generalMessages.error_command, command, reason)
}

export function getCurrentBotVersion(){
    return JSON.parse(fs.readFileSync(path.resolve('package.json'), {encoding: 'utf-8'})).version
}

export function colorText(text: string, color?: string){
    return !color ? chalk.green(text) : chalk.hex(color)(text)
}

export function buildText(text : string, ...params : any[]){
  for(let i = 0; i < params.length; i++){
      text = text.replace(`{p${i+1}}`, params[i])
  }
  return text
}

export function timestampToDate(timestamp : number){
    return moment(timestamp).format('DD/MM HH:mm:ss')
}

export function currentDate(){
  return moment(Date.now()).format('DD/MM HH:mm:ss')
}

export function getResponseTime(timestamp: number){
    let responseTime = ((moment.now()/1000) - timestamp).toFixed(2)
    return responseTime
}

export function showCommandConsole(isGroup : boolean, categoryName: string, command: string, hexColor: string, messageTimestamp: number, pushName: string, groupName?: string){
    let formattedMessageTimestamp = timestampToDate(messageTimestamp * 1000)
    let responseTimeSeconds = getResponseTime(messageTimestamp)
    if (!pushName) pushName = "DESCONHECIDO"
    if (!groupName) groupName = "DESCONHECIDO"

    if (isGroup){
      console.log('\x1b[1;31m~\x1b[1;37m>', colorText(`[${categoryName}]`, hexColor), formattedMessageTimestamp, colorText(command), 'de', colorText(pushName), 'em', colorText(groupName), `(${colorText(`${responseTimeSeconds}s`)})`)
    } else {
      console.log('\x1b[1;31m~\x1b[1;37m>', colorText(`[${categoryName}]`, hexColor), formattedMessageTimestamp, colorText(command), 'de', colorText(pushName), `(${colorText(`${responseTimeSeconds}s`)})`)
    }
}

export function uppercaseFirst(text: string){
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function removeBold(text: string){
    return text.replace(/\*/gm, "").trim()
}

export function getRandomFilename(extension : '.mp4' | '.mp3' | '.jpg' | '.png'){
    return `${Math.floor(Math.random() * 10000)}${extension}`
}

export function randomDelay(ms_min : number, ms_max : number){
   return new Promise <void> ((resolve, reject)=>{
      let randomDelayMs = Math.floor(Math.random() * (ms_max - ms_min + 1)) + ms_min
      setTimeout(async ()=>{
          resolve()
      }, randomDelayMs)
   })
}

export function showConsoleError(err: any, error_type : string){
  console.error(colorText(`[${error_type}]`,"#d63e3e"), err)
}
