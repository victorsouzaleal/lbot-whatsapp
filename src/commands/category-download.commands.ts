import { WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import { BaileysController } from "../controllers/baileys.controller.js"
import { buildText, messageErrorCommandUsage} from "../lib/util.js"
import { downloadLibrary, imageLibrary, convertLibrary } from "@victorsouzaleal/biblioteca-lbot"
import format from 'format-duration'
import getCommands from "./list.commands.js"

export async function playCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    
    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const videoInfo = await downloadLibrary.youtubeMedia(message.text_command)

    if (videoInfo.is_live) throw new Error(commandsData.download.play.msgs.error_live)
    if (videoInfo.duration > 360) throw new Error(commandsData.download.play.msgs.error_limit)

    const waitReply = buildText(commandsData.download.play.msgs.wait, videoInfo.title, videoInfo.duration_formatted)
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)
    const audioBuffer = await convertLibrary.convertMp4ToMp3('url', videoInfo.url)
    await baileysController.replyFileFromBuffer(message.chat_id, 'audioMessage', audioBuffer, '', message.wa_message, 'audio/mpeg')
}

export async function ytCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const videoInfo = await downloadLibrary.youtubeMedia(message.text_command)

    if (videoInfo.is_live) throw new Error(commandsData.download.yt.msgs.error_live)
    if (videoInfo.duration > 360) throw new Error(commandsData.download.yt.msgs.error_limit)

    const waitReply = buildText(commandsData.download.yt.msgs.wait, videoInfo.title, videoInfo.duration_formatted)
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)
    await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', videoInfo.url, '', message.wa_message, 'video/mp4')
}

export async function fbCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const fbInfo = await downloadLibrary.facebookMedia(message.text_command)

    if (fbInfo.duration > 360) throw new Error(commandsData.download.fb.msgs.error_limit)

    const waitReply = buildText(commandsData.download.fb.msgs.wait, fbInfo.title, format(fbInfo.duration * 1000))
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)
    await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', fbInfo.sd, '', message.wa_message, 'video/mp4')
}

export async function igCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const igInfo = await downloadLibrary.instagramMedia(message.text_command)
    const waitReply = buildText(commandsData.download.ig.msgs.wait, igInfo.author_fullname, igInfo.author_username, igInfo.caption, igInfo.likes)
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)

    for await (let media of igInfo.media){
        if (media.type == "image") await baileysController.replyFileFromUrl(message.chat_id, 'imageMessage', media.url, '', message.wa_message)
        if (media.type == "video") await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', media.url, '', message.wa_message)
    }
}

export async function xCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const xInfo = await downloadLibrary.xMedia(message.text_command)

    const waitReply = buildText(commandsData.download.x.msgs.wait, xInfo.text)
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)
    
    for await(let media of xInfo.media){
        if (media.type == "image") await baileysController.replyFileFromUrl(message.chat_id, 'imageMessage', media.url, '', message.wa_message)
        if (media.type == "video") await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', media.url, '', message.wa_message, 'video/mp4')
    }
}

export async function tkCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const tiktok = await downloadLibrary.tiktokMedia(message.text_command)
    const waitReply = buildText(commandsData.download.tk.msgs.wait, tiktok.author_profile, tiktok.description)
    await baileysController.replyText(message.chat_id, waitReply, message.wa_message)
    
    if (!Array.isArray(tiktok.url)){
        if (tiktok.type == 'image') await baileysController.replyFileFromUrl(message.chat_id, 'imageMessage', tiktok.url, '', message.wa_message)
        if (tiktok.type == 'video') await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', tiktok.url, '', message.wa_message, 'video/mp4')
    } else {
        for await (const url of tiktok.url) {
            if (tiktok.type == 'image') await baileysController.replyFileFromUrl(message.chat_id, 'imageMessage', url, '', message.wa_message)
            if (tiktok.type == 'video') await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', url, '', message.wa_message, 'video/mp4')
        }
    }
}

export async function imgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const MAX_SENT = 5
    const MAX_RESULTS = 50
    let imagesSent = 0
    let images =  await imageLibrary.imageSearchGoogle(message.text_command)
    const maxImageResults = images.length > MAX_RESULTS ? MAX_RESULTS : images.length
    images = images.splice(0, maxImageResults)

    for (let i = 0; i < maxImageResults; i++){
        let randomIndex = Math.floor(Math.random() * images.length)
        let chosenImage = images[randomIndex].url
        await baileysController.sendFileFromUrl(message.chat_id, 'imageMessage', chosenImage, '').then(() =>{
            imagesSent++
        }).catch(()=>{})
        images.splice(randomIndex, 1)

        if (imagesSent == MAX_SENT) break
    }

    if (!imagesSent) throw new Error (commandsData.download.img.msgs.error) 
}

