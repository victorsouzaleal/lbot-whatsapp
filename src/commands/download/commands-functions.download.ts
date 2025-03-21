import { WASocket } from "baileys"
import { Bot } from "../../interfaces/bot.interface.js"
import { Group } from "../../interfaces/group.interface.js"
import { Message } from "../../interfaces/message.interface.js"
import { buildText, messageErrorCommandUsage} from "../../lib/util.lib.js"
import { downloadLibrary, imageLibrary, convertLibrary } from "@victorsouzaleal/biblioteca-lbot"
import * as Whatsapp from '../../lib/whatsapp.lib.js'
import format from 'format-duration'
import { commandsDownload } from "./commands-list.download.js"

export async function playCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const videoInfo = await downloadLibrary.youtubeMedia(message.text_command)

    if (videoInfo.is_live) throw new Error(downloadCommands.play.msgs.error_live)
    if (videoInfo.duration > 360) throw new Error(downloadCommands.play.msgs.error_limit)

    const waitReply = buildText(downloadCommands.play.msgs.wait, videoInfo.title, videoInfo.duration_formatted)
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    const audioBuffer = await convertLibrary.convertMp4ToMp3('url', videoInfo.url)
    await Whatsapp.replyFileFromBuffer(client, message.chat_id, 'audioMessage', audioBuffer, '', message.wa_message, {expiration: message.expiration, mimetype: 'audio/mpeg'})
}

export async function ytCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const videoInfo = await downloadLibrary.youtubeMedia(message.text_command)

    if (videoInfo.is_live) throw new Error(downloadCommands.yt.msgs.error_live)
    if (videoInfo.duration > 360) throw new Error(downloadCommands.yt.msgs.error_limit)

    const waitReply = buildText(downloadCommands.yt.msgs.wait, videoInfo.title, videoInfo.duration_formatted)
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', videoInfo.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
}

export async function fbCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const fbInfo = await downloadLibrary.facebookMedia(message.text_command)

    if (fbInfo.duration > 360) throw new Error(downloadCommands.fb.msgs.error_limit)

    const waitReply = buildText(downloadCommands.fb.msgs.wait, fbInfo.title, format(fbInfo.duration * 1000))
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', fbInfo.sd, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
}

export async function igCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const igInfo = await downloadLibrary.instagramMedia(message.text_command)
    const waitReply = buildText(downloadCommands.ig.msgs.wait, igInfo.author_fullname, igInfo.author_username, igInfo.caption, igInfo.likes)
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})

    for await (let media of igInfo.media){
        if (media.type == "image") await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', media.url, '', message.wa_message, {expiration: message.expiration})
        if (media.type == "video") await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', media.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
    }
}

export async function xCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const xInfo = await downloadLibrary.xMedia(message.text_command)

    const waitReply = buildText(downloadCommands.x.msgs.wait, xInfo.text)
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    
    for await(let media of xInfo.media){
        if (media.type == "image") await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', media.url, '', message.wa_message, {expiration: message.expiration})
        if (media.type == "video") await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', media.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
    }
}

export async function tkCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const tiktok = await downloadLibrary.tiktokMedia(message.text_command)
    const waitReply = buildText(downloadCommands.tk.msgs.wait, tiktok.author_profile, tiktok.description)
    await Whatsapp.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    
    if (!Array.isArray(tiktok.url)){
        if (tiktok.type == 'image') await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', tiktok.url, '', message.wa_message, {expiration: message.expiration})
        if (tiktok.type == 'video') await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', tiktok.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
    } else {
        for await (const url of tiktok.url) {
            if (tiktok.type == 'image') await Whatsapp.replyFileFromUrl(client, message.chat_id, 'imageMessage', url, '', message.wa_message, {expiration: message.expiration})
            if (tiktok.type == 'video') await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
        }
    }
}

export async function imgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const downloadCommands = commandsDownload(botInfo)

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
        await Whatsapp.sendFileFromUrl(client, message.chat_id, 'imageMessage', chosenImage, '', {expiration: message.expiration}).then(() =>{
            imagesSent++
        }).catch()
        images.splice(randomIndex, 1)

        if (imagesSent == MAX_SENT) break
    }

    if (!imagesSent) throw new Error (downloadCommands.img.msgs.error) 
}

