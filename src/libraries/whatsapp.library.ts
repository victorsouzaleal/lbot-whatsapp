import { GroupMetadata, WAMessage, WAPresence, WASocket, S_WHATSAPP_NET, generateWAMessageFromContent, getContentType, proto } from "baileys"
import { randomDelay } from "../utils/general.util.js"
import { MessageOptions, MessageTypes, Message } from "../interfaces/message.interface.js"
import * as convertLibrary from './convert.library.js'
import { Group } from "../interfaces/group.interface.js"
import { User } from "../interfaces/user.interface.js"
import { removeBold } from "../utils/general.util.js"
import { GroupController } from "../controllers/group.controller.js"

async function updatePresence(client: WASocket, chatId: string, presence: WAPresence){
    await client.presenceSubscribe(chatId)
    await randomDelay(200, 400)
    await client.sendPresenceUpdate(presence, chatId)
    await randomDelay(300, 1000)
    await client.sendPresenceUpdate('paused', chatId)
}

export function addWhatsappSuffix(userNumber : string){
    const userId = userNumber.replace(/\W+/g,"") + S_WHATSAPP_NET
    return userId
}

export function removeWhatsappSuffix(userId: string){
    const userNumber = userId.replace(S_WHATSAPP_NET, '')
    return userNumber
}

export function removePrefix(prefix: string, command: string){
    const commandWithoutPrefix = command.replace(prefix, '')
    return commandWithoutPrefix
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

export function deleteMessage(client: WASocket, message : WAMessage, deleteQuoted : boolean){
    let deletedMessage
    let chatId = message.key.remoteJid

    if (!chatId) return

    if (deleteQuoted){
        deletedMessage = {
            remoteJid: message.key.remoteJid,
            fromMe: message.key.participant === message?.message?.extendedTextMessage?.contextInfo?.participant,
            id: message.message?.extendedTextMessage?.contextInfo?.stanzaId,
            participant: message?.message?.extendedTextMessage?.contextInfo?.participant
        }
    } else{
        deletedMessage = message.key
    }

    return client.sendMessage(chatId, {delete: deletedMessage})
}

export function readMessage(client: WASocket, chatId: string, sender: string, messageId: string){
    return client.sendReceipt(chatId, sender, [messageId], 'read')
}

export function updateProfilePic(client: WASocket, chatId: string , image: Buffer){
    return client.updateProfilePicture(chatId, image)
}

export function updateProfileStatus(client: WASocket, text: string){
    return client.updateProfileStatus(text)
}

export function shutdownBot(client: WASocket){
    return client.end(new Error("admin_command"))
}

export function getProfilePicUrl(client: WASocket, chatId: string){
    return client.profilePictureUrl(chatId, "image")
}

export function blockContact(client: WASocket, userId: string){
    return client.updateBlockStatus(userId, "block")
}

export function unblockContact(client: WASocket, userId: string){
    return client.updateBlockStatus(userId, "unblock")
}

export function getHostNumber(client: WASocket){
    let id = client.user?.id.replace(/:[0-9]+/ism, '')
    return id || ''
}

export function getBlockedContacts(client: WASocket){
    return client.fetchBlocklist()
}

export async function sendText(client: WASocket, chatId: string, text: string, options?: MessageOptions){
    await updatePresence(client, chatId, "composing")
    return client.sendMessage(chatId, {text, linkPreview: null}, {ephemeralExpiration: options?.expiration})
}

export function sendLinkWithPreview(client: WASocket, chatId: string, text: string, options?: MessageOptions){
    return client.sendMessage(chatId, {text}, {ephemeralExpiration: options?.expiration})
}

export async function sendTextWithMentions(client: WASocket, chatId: string, text: string, mentions: string[], options?: MessageOptions) {
    await updatePresence(client, chatId, "composing")
    return client.sendMessage(chatId, {text , mentions}, {ephemeralExpiration: options?.expiration})
}

export function sendSticker(client: WASocket, chatId: string, sticker: Buffer, options?: MessageOptions){
    return client.sendMessage(chatId, {sticker}, {ephemeralExpiration: options?.expiration})
}

export async function sendFileFromUrl(client: WASocket, chatId: string, type: MessageTypes, url: string, caption: string, options?: MessageOptions){
    if (type === "imageMessage") {
        return client.sendMessage(chatId, {image: {url}, caption}, {ephemeralExpiration: options?.expiration})
    }else if (type === 'videoMessage'){
        const base64Thumb = await convertLibrary.convertVideoToThumbnail('url', url)
        return client.sendMessage(chatId, {video: {url}, mimetype: options?.mimetype, caption, jpegThumbnail: base64Thumb}, {ephemeralExpiration: options?.expiration})
    } else if (type === 'audioMessage'){
        return client.sendMessage(chatId, {audio: {url}, mimetype: options?.mimetype}, {ephemeralExpiration: options?.expiration})
    }
}

export async function replyText (client: WASocket, chatId: string, text: string, quoted: WAMessage, options?: MessageOptions){ 
    await updatePresence(client, chatId, "composing")
    return client.sendMessage(chatId, {text, linkPreview: null}, {quoted, ephemeralExpiration: options?.expiration})
}

export async function replyFile (client: WASocket, chatId: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, options?: MessageOptions){ 
    if (type == "imageMessage"){
        return client.sendMessage(chatId, {image: {url}, caption}, {quoted, ephemeralExpiration: options?.expiration})
    } else if (type == "videoMessage"){
        const base64Thumb = await convertLibrary.convertVideoToThumbnail('file', url)
        return client.sendMessage(chatId, {video: {url}, mimetype: options?.mimetype, caption, jpegThumbnail: base64Thumb}, {quoted, ephemeralExpiration: options?.expiration})
    } else if (type == "audioMessage"){
        return client.sendMessage(chatId, {audio: {url}, mimetype: options?.mimetype}, {quoted, ephemeralExpiration: options?.expiration})
    }
}

export async function replyFileFromUrl (client: WASocket, chatId: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, options?: MessageOptions){ 
    if (type == "imageMessage"){
        return client.sendMessage(chatId, {image: {url}, caption}, {quoted, ephemeralExpiration: options?.expiration})
    } else if (type == "videoMessage"){
        const base64Thumb = await convertLibrary.convertVideoToThumbnail('url', url)
        return client.sendMessage(chatId, {video: {url}, mimetype: options?.mimetype, caption, jpegThumbnail: base64Thumb}, {quoted, ephemeralExpiration: options?.expiration})
    } else if (type == "audioMessage"){
        return client.sendMessage(chatId, {audio: {url}, mimetype: options?.mimetype}, {quoted, ephemeralExpiration: options?.expiration})
    }
}

export async function replyFileFromBuffer (client: WASocket, chatId: string, type: MessageTypes, buffer: Buffer, caption: string, quoted: WAMessage, options?: MessageOptions){ 
    if (type == "videoMessage"){
        const base64Thumb = await convertLibrary.convertVideoToThumbnail('buffer', buffer)
        return client.sendMessage(chatId, {video: buffer, caption, mimetype: options?.mimetype, jpegThumbnail: base64Thumb}, {quoted, ephemeralExpiration: options?.expiration})
    } else if (type == "imageMessage"){
        return client.sendMessage(chatId, {image: buffer, caption}, {quoted, ephemeralExpiration: options?.expiration})
    } else if (type == "audioMessage"){
        return client.sendMessage(chatId, {audio: buffer, mimetype: options?.mimetype}, {quoted, ephemeralExpiration: options?.expiration})
    }
}

export async function replyWithMentions (client: WASocket, chatId: string, text: string, mentions: string[], quoted: WAMessage, options?: MessageOptions){ 
    await updatePresence(client, chatId, "composing")
    return client.sendMessage(chatId, {text , mentions}, {quoted, ephemeralExpiration: options?.expiration})
}

export function joinGroupInviteLink (client: WASocket, linkGroup : string){
    return client.groupAcceptInvite(linkGroup)
}

export function revokeGroupInvite (client: WASocket, groupId: string){
    return client.groupRevokeInvite(groupId)
}

export async function getGroupInviteLink (client: WASocket, groupId: string){
    let inviteCode = await client.groupInviteCode(groupId)
    return inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : undefined
}

export function leaveGroup (client: WASocket, groupId: string){
    return client.groupLeave(groupId)
}

export function getGroupInviteInfo (client: WASocket, linkGroup: string){
    return client.groupGetInviteInfo(linkGroup)
}

export function updateGroupRestriction(client: WASocket, groupId: string, status: boolean){
    let config : "announcement" | "not_announcement" = status ? "announcement" : "not_announcement"
    return client.groupSettingUpdate(groupId, config)
}

export async function getAllGroups(client: WASocket){ 
    let groups = await client.groupFetchAllParticipating()
    let groupsInfo : GroupMetadata[] = []

    for (let [key, value] of Object.entries(groups)) {
        groupsInfo.push(value)
    }
    
    return groupsInfo
}

export async function removeParticipant(client: WASocket, groupId: string, participant: string){
    const [response] = await client.groupParticipantsUpdate(groupId, [participant], "remove")
    return response
}

export async function addParticipant(client: WASocket, groupId: string, participant: string){
    const [response] = await client.groupParticipantsUpdate(groupId, [participant], "add")
    return response
}

export async function promoteParticipant(client: WASocket, groupId: string, participant: string){
    const [response] = await client.groupParticipantsUpdate(groupId, [participant], "promote")
    return response
}

export async function demoteParticipant(client: WASocket, groupId: string, participant: string){
    const [response] = await client.groupParticipantsUpdate(groupId, [participant], "demote")
    return response
}

export async function formatWAMessage(m: WAMessage, group: Group|null, hostId: string, admins: User[]){
    if (!m.message) {
        return
    }
    
    const type = getContentType(m.message)

    if (!type || !isAllowedType(type) || !m.message[type]) {
        return
    }

    const contextInfo : proto.IContextInfo | undefined  = (typeof m.message[type] != "string" && m.message[type] && "contextInfo" in m.message[type]) ? m.message[type].contextInfo as proto.IContextInfo: undefined
    const isQuoted = (contextInfo?.quotedMessage) ? true : false
    const sender = (m.key.fromMe) ? hostId : m.key.participant || m.key.remoteJid
    const pushName = m.pushName
    const body =  m.message.conversation ||  m.message.extendedTextMessage?.text || undefined
    const caption = (typeof m.message[type] != "string" && m.message[type] && "caption" in m.message[type]) ? m.message[type].caption as string | null: undefined
    const text =  caption || body || ''
    const [command, ...args] = text.trim().split(" ")
    const isGroupMsg = m.key.remoteJid?.includes("@g.us") ?? false
    const message_id = m.key.id
    const t = m.messageTimestamp as number
    const chat_id = m.key.remoteJid
    const isGroupAdmin = (sender && group) ? await new GroupController().isParticipantAdmin(group.id, sender) : false

    if (!message_id || !t || !sender || !chat_id || !pushName ) {
        return 
    }

    let formattedMessage : Message = {
        message_id,
        sender,
        type : type as MessageTypes,
        t,
        chat_id,
        expiration : contextInfo?.expiration || undefined,
        pushname: pushName,
        body: m.message.conversation || m.message.extendedTextMessage?.text || '',
        caption : caption || '',
        mentioned: contextInfo?.mentionedJid || [],
        text_command: args?.join(" ").trim() || '',
        command: removeBold(command?.toLowerCase().trim()) || '',
        args,
        isQuoted,
        isGroupMsg,
        isGroupAdmin,
        isBotAdmin : admins.map(admin => admin.id).includes(sender),
        isBotOwner: admins.find(admin => admin.owner == true)?.id == sender,
        isBotMessage: m.key.fromMe ?? false,
        isBroadcast: m.key.remoteJid == "status@broadcast",
        isMedia: type != "conversation" && type != "extendedTextMessage",
        wa_message: m,
    }

    if (formattedMessage.isMedia){
        const mimetype = (typeof m.message[type] != "string" && m.message[type] && "mimetype" in m.message[type]) ? m.message[type].mimetype as string | null : undefined
        const url = (typeof m.message[type] != "string" && m.message[type] && "url" in m.message[type]) ? m.message[type].url as string | null : undefined
        const seconds = (typeof m.message[type] != "string" && m.message[type] && "seconds" in m.message[type]) ? m.message[type].seconds as number | null : undefined
        const file_length = (typeof m.message[type] != "string" && m.message[type] && "fileLength" in m.message[type]) ? m.message[type].fileLength as number | Long | null : undefined

        if (!mimetype || !url || !file_length) return

        formattedMessage.media = {
            mimetype,
            url,
            seconds : seconds || undefined,
            file_length
        }
    }


    if (formattedMessage.isQuoted){
        const quotedMessage = contextInfo?.quotedMessage
        if (!quotedMessage) return
        const typeQuoted = getContentType(quotedMessage)
        const senderQuoted = contextInfo.participant || contextInfo.remoteJid
        if (!typeQuoted || !senderQuoted ) return
        const captionQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "caption" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].caption as string | null : undefined

        formattedMessage.quotedMessage = {
            type: typeQuoted,
            sender: senderQuoted,
            body: quotedMessage.conversation || quotedMessage.extendedTextMessage?.text || '',
            caption: captionQuoted || '',
            isMedia : typeQuoted != "conversation" && typeQuoted != "extendedTextMessage",
            wa_message: generateWAMessageFromContent(formattedMessage.chat_id, quotedMessage, {userJid: senderQuoted})
        }

        if (formattedMessage.quotedMessage?.isMedia){
            const urlQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "url" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].url as string | null : undefined
            const mimetypeQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "mimetype" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].mimetype as string | null : undefined
            const fileLengthQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "fileLength" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].fileLength as number| Long | null : undefined
            const secondsQuoted = (typeof quotedMessage[typeQuoted] != "string" && quotedMessage[typeQuoted] && "seconds" in quotedMessage[typeQuoted]) ? quotedMessage[typeQuoted].seconds as number| null : undefined
            
            if (!urlQuoted || !mimetypeQuoted || !fileLengthQuoted) return

            formattedMessage.quotedMessage.media = {
                url: urlQuoted,
                mimetype: mimetypeQuoted,
                file_length: fileLengthQuoted,
                seconds: secondsQuoted || undefined,
            }
        }
        
    }

    return formattedMessage
}

function isAllowedType(type : keyof proto.IMessage){
    const allowedTypes : MessageTypes[] = [
        "conversation",
        "extendedTextMessage",
        "audioMessage",
        "imageMessage",
        "audioMessage",
        "documentMessage",
        "stickerMessage",
        "videoMessage",
    ]

    return allowedTypes.includes(type as MessageTypes)
}