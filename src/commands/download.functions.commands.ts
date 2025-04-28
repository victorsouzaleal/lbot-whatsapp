import { WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import { buildText, messageErrorCommandUsage} from "../utils/general.util.js"
import { downloadLib, imageLib, convertLib, waLib } from "../libraries/library.js"
import format from 'format-duration'
import downloadCommands from "./download.list.commands.js"

export async function playCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    } 

    const videoInfo = await downloadLib.youtubeMedia(message.text_command, 'mp3')

    if (!videoInfo){
        throw new Error(downloadCommands.play.msgs.error_not_found)
    } else if (videoInfo.duration > 360){
        throw new Error(downloadCommands.play.msgs.error_limit)
    }

    const waitReply = buildText(downloadCommands.play.msgs.wait, videoInfo.title, videoInfo.duration_formatted)
    await waLib.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    await waLib.replyFileFromUrl(client, message.chat_id, 'audioMessage', videoInfo.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'audio/mpeg'})
}

export async function ytCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    }

    const videoInfo = await downloadLib.youtubeMedia(message.text_command, '480')

    if (!videoInfo){
        throw new Error(downloadCommands.yt.msgs.error_not_found)
    } else if (videoInfo.duration > 360){
        throw new Error(downloadCommands.yt.msgs.error_limit)
    }

    const waitReply = buildText(downloadCommands.yt.msgs.wait, videoInfo.title, videoInfo.duration_formatted)
    await waLib.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    await waLib.replyFileFromUrl(client, message.chat_id, 'videoMessage', videoInfo.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
}

export async function fbCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    }

    const fbInfo = await downloadLib.facebookMedia(message.text_command)

    if (fbInfo.duration > 360){
        throw new Error(downloadCommands.fb.msgs.error_limit)
    }

    const waitReply = buildText(downloadCommands.fb.msgs.wait, fbInfo.title, format(fbInfo.duration * 1000))
    await waLib.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    await waLib.replyFileFromUrl(client, message.chat_id, 'videoMessage', fbInfo.sd, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
}

export async function igCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    }

    const igInfo = await downloadLib.instagramMedia(message.text_command)
    const waitReply = buildText(downloadCommands.ig.msgs.wait, igInfo.author_fullname, igInfo.author_username, igInfo.caption, igInfo.likes)
    await waLib.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})

    for await (let media of igInfo.media){
        if (media.type == "image"){
            await waLib.replyFileFromUrl(client, message.chat_id, 'imageMessage', media.url, '', message.wa_message, {expiration: message.expiration})
        } else if (media.type == "video"){
            await waLib.replyFileFromUrl(client, message.chat_id, 'videoMessage', media.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
        }
    }
}

export async function xCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    }

    const xInfo = await downloadLib.xMedia(message.text_command)

    if (!xInfo){
        throw new Error(downloadCommands.x.msgs.error_not_found)
    }

    const waitReply = buildText(downloadCommands.x.msgs.wait, xInfo.text)
    await waLib.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    
    for await(let media of xInfo.media){
        if (media.type == "image"){
            await waLib.replyFileFromUrl(client, message.chat_id, 'imageMessage', media.url, '', message.wa_message, {expiration: message.expiration})
        } else if (media.type == "video"){
            await waLib.replyFileFromUrl(client, message.chat_id, 'videoMessage', media.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
        }
    }
}

export async function tkCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    }

    const tiktok = await downloadLib.tiktokMedia(message.text_command)

    if (!tiktok) {
        throw new Error(downloadCommands.tk.msgs.error_not_found)
    }

    const waitReply = buildText(downloadCommands.tk.msgs.wait, tiktok.author_profile, tiktok.description)
    await waLib.replyText(client, message.chat_id, waitReply, message.wa_message, {expiration: message.expiration})
    
    if (!Array.isArray(tiktok.url)){
        if (tiktok.type == 'image') {
            await waLib.replyFileFromUrl(client, message.chat_id, 'imageMessage', tiktok.url, '', message.wa_message, {expiration: message.expiration})
        } else if (tiktok.type == 'video'){
            await waLib.replyFileFromUrl(client, message.chat_id, 'videoMessage', tiktok.url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
        } 
    } else {
        for await (const url of tiktok.url) {
            if (tiktok.type == 'image') {
                await waLib.replyFileFromUrl(client, message.chat_id, 'imageMessage', url, '', message.wa_message, {expiration: message.expiration})
            }  else if (tiktok.type == 'video') {
                await waLib.replyFileFromUrl(client, message.chat_id, 'videoMessage', url, '', message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
            }
        }
    }
}

export async function imgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    if (!message.args.length){
        throw new Error(messageErrorCommandUsage(botInfo.prefix, message))
    } 

    const MAX_SENT = 5
    const MAX_RESULTS = 50
    let imagesSent = 0

    let images = await imageLib.imageSearchGoogle(message.text_command)
    const maxImageResults = images.length > MAX_RESULTS ? MAX_RESULTS : images.length
    images = images.splice(0, maxImageResults)

    for (let i = 0; i < maxImageResults; i++){
        let randomIndex = Math.floor(Math.random() * images.length)
        let chosenImage = images[randomIndex].url
        await waLib.sendFileFromUrl(client, message.chat_id, 'imageMessage', chosenImage, '', {expiration: message.expiration, mimetype: 'image/jpeg'}).then(() =>{
            imagesSent++
        }).catch(() => {
            //Ignora se não for possível enviar essa imagem
        })
        images.splice(randomIndex, 1)

        if (imagesSent == MAX_SENT){
            break
        }
    }

    if (!imagesSent) {
        throw new Error (downloadCommands.img.msgs.error) 
    }
}

