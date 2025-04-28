import moment from "moment-timezone"
import chalk from 'chalk'
import path from 'node:path'
import fs from 'fs-extra'
import { Message } from "../interfaces/message.interface.js"
import botTexts from "../helpers/bot.texts.helper.js"
import { FileExtensions } from "../interfaces/library.interface.js"
import { tmpdir } from "node:os"
import crypto from 'node:crypto'
import { BotController } from "../controllers/bot.controller.js"
import { getCommandGuide } from "./commands.util.js"

export function messageErrorCommandUsage(message: Message){
  const botInfo = new BotController().getBot()
  return buildText(botTexts.error_command_usage, message.command, getCommandGuide(botInfo.prefix, message.command))
}

export function messageErrorCommand(command: string, reason: string){
  return buildText(botTexts.error_command, command, reason)
}

export function getCurrentBotVersion(){
  return JSON.parse(fs.readFileSync(path.resolve('package.json'), {encoding: 'utf-8'})).version
}

export function colorText(text: string, color?: string){
  return !color ? chalk.green(text) : chalk.hex(color)(text)
}

export function buildText(text : string, ...params : any[]){
  if (text.includes('{$p}')) {
    const prefix = new BotController().getBot().prefix
    text = text.replaceAll('{$p}', prefix)
  }

  for (let i = 0; i < params.length; i++){
    text = text.replaceAll(`{$${i+1}}`, params[i])
  }

  return text
}

export function timestampToDate(timestamp : number){
  return moment(timestamp).format('DD/MM/YYYY HH:mm:ss')
}

export function formatSeconds(seconds : number){
  return moment(seconds * 1000).format('mm:ss')
}

export function currentDate(){
  return moment(Date.now()).format('DD/MM/YYYY HH:mm:ss')
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

export function removeFormatting(text: string){
  return text.replace(/(_)|(\*)|(~)|(```)/g, "").trim()
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
  console.error(colorText(`[${error_type}]`,"#d63e3e"), err.message)
}

export function showConsoleLibraryError(err: any, error_type : string){
  console.error(colorText(`[${error_type}]`,"#d63e3e"), err.message)
}

export function getRandomFilename(ext: FileExtensions){
  return `${Math.floor(Math.random() * 10000)}.${ext}`
}

export function getTempPath(ext: FileExtensions){
  if(!fs.existsSync(path.join(tmpdir(), 'lbot-whatsapp'))){
    fs.mkdirSync(path.join(tmpdir(), 'lbot-whatsapp'))
  }
  
  return path.join(tmpdir(), 'lbot-whatsapp', `${crypto.randomBytes(20).toString('hex')}.${ext}`)
}

export function deepMerge<T>(defaultObj: T, overrideObj: any): T {
  const result: any = { ...defaultObj }

  for (const key in defaultObj) {
    if (overrideObj && Object.prototype.hasOwnProperty.call(overrideObj, key)) {
      if (typeof defaultObj[key] === 'object' && defaultObj[key] !== null && !Array.isArray(defaultObj[key])) {
        result[key] = deepMerge(defaultObj[key], overrideObj[key]);
      } else {
        result[key] = overrideObj[key];
      }
    }
  }

  return result
}


