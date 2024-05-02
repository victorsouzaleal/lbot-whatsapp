import {MessageTypes} from './mensagem.js'
import {delayAleatorio, getVideoThumbnail} from '../lib/util.js'

// GENERAL FUNCTIONS
export const deleteMessage = async(c, message, isQuoted = false)=>{
    var deleteMessage
    if(isQuoted){
        deleteMessage = {
            remoteJid: message.key.remoteJid,
            fromMe: false,
            id: message.message.extendedTextMessage.contextInfo.stanzaId,
            participant: message.message.extendedTextMessage.contextInfo.participant
        }
    } else{
        deleteMessage = message.key
    }
    return await c.sendMessage(message.key.remoteJid, {delete: deleteMessage})
}

export const readMessage = async(c, chatId, participant, messageId) =>{
    return await c.sendReceipt(chatId, participant, [messageId], 'read')
}

export const updatePresence = async(c, chatId, type)=>{
    return await c.sendPresenceUpdate(type, chatId)
}

export const setProfilePic = async(c, id, buffer)=>{
    return await c.updateProfilePicture(id, buffer)
}

export const setMyStatus = async(c, status)=>{
    return await c.updateProfileStatus(status)
}

export const botLogout = async(c)=>{
    return await c.end(new Error("Comando"))
}

export const getProfilePicFromServer = async(c, userId)=>{
    return await c.profilePictureUrl(userId, "image")
}

export const contactBlock = async(c, userId)=>{
    return await c.updateBlockStatus(userId, "block")
}

export const contactUnblock = async(c, userId)=>{
    return await c.updateBlockStatus(userId, "unblock")
}

export const getHostNumber = async(c)=>{ 
    var id = c.user.id.replace(/:[0-9]+/ism, '')
    return id
}

export const getBlockedIds = async(c)=>{ 
    return await c.fetchBlocklist()
}


// SEND MESSAGES/MEDIAS FUNCTIONS
export const sendText = async(c, chatId, text)=>{
    await updatePresence(c, chatId, "composing")
    await delayAleatorio(400, 1000)
    await c.sendMessage(chatId, {text, linkPreview: null})
}

export const sendPoll = async(c, chatId, pollName, pollValues)=>{
    return await c.sendMessage(chatId, {poll : {name: pollName, values: pollValues, selectableCount: 1}})
}

export const sendLinkWithAutoPreview = async(c, chatId, textWithLink) =>{
    await updatePresence(c, chatId, "composing")
    await delayAleatorio(400, 1000)
    return await c.sendMessage(chatId, {text: textWithLink})
}

export const sendTextWithMentions = async(c, chatId, text, mentionedIdsArray)=>{ 
    await updatePresence(c, chatId, "composing")
    await delayAleatorio(400, 1000) 
    return await c.sendMessage(chatId, {text , mentions: mentionedIdsArray})
}

export const sendSticker = async(c,id, sticker)=>{ 
    return await c.sendMessage(id, {sticker})
}

export const sendFileFromUrl = async(c, type, chatId, filePath, caption) =>{ 
    if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: {url: filePath}, caption})
    }
}

export const reply = async(c, chatId, text, quotedMessage)=>{ 
    await updatePresence(c, chatId, "composing")
    await delayAleatorio(400, 1000)
    return await c.sendMessage(chatId, {text, linkPreview: null}, {quoted: quotedMessage})
}

export const replyFile = async(c, type, chatId, filePath, caption, quotedMessage, mimetype = '') =>{ 
    if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: {url: filePath}, caption}, {quoted: quotedMessage})
    } else if (type == MessageTypes.video){
        var base64Thumb = await getVideoThumbnail(filePath)
        return await c.sendMessage(chatId,{video: {url: filePath}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
    } else if (type == MessageTypes.audio){
        return await c.sendMessage(chatId, {audio: {url: filePath}, mimetype}, {quoted: quotedMessage})
    }
}

export const replyFileFromUrl = async(c, type, chatId, url, caption, quotedMessage, mimetype = '') =>{ 
    if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: {url}, caption}, {quoted: quotedMessage})
    } else if (type == MessageTypes.video){
        var base64Thumb = await getVideoThumbnail(url, "url")
        return await c.sendMessage(chatId,{video: {url}, mimetype, caption, jpegThumbnail : base64Thumb}, {quoted: quotedMessage})
    } else if (type == MessageTypes.audio){
        return await c.sendMessage(chatId, {audio: {url}, mimetype}, {quoted: quotedMessage})
    }
}

export const replyFileFromBuffer = async(c, type, chatId, buffer, caption, quotedMessage, mimetype = '')=>{ 
    if(type == MessageTypes.video){
        var base64Thumb = await getVideoThumbnail(buffer, "buffer")
        return await c.sendMessage(chatId,{video: buffer, caption, mimetype, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
    } else if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: buffer, caption}, {quoted: quotedMessage})
    }
}

export const replyWithMentions = async(c, chatId, text, mentionedIdsArray, quotedMessage)=>{ 
    await updatePresence(c, chatId, "composing")
    await delayAleatorio(400, 1000)
    return await c.sendMessage(chatId, {text , mentions: mentionedIdsArray}, {quoted: quotedMessage})
}


// GROUP FUNCTIONS
export const joinGroupViaLink = async(c, idLink)=>{
    return await c.groupAcceptInvite(idLink)
}

export const revokeGroupInviteLink = async(c, groupId)=>{
    return await c.groupRevokeInvite(groupId)
}

export const leaveGroup = async(c, groupId)=>{
    return await c.groupLeave(groupId)
}

export const inviteInfo = async(c, link)=>{
    return await c.groupGetInviteInfo(link)
}

export const setGroupToAdminsOnly = async(c, groupId, state)=>{
    let setting = state ? "announcement" : "not_announcement"
    return await c.groupSettingUpdate(groupId, setting)
}

export const getGroupAdmins = async(c, groupId)=>{ 
    let {participants} = await c.groupMetadata(groupId)
    let groupAdmins = participants.filter(member => (member.admin != null))
    let admins = []
    groupAdmins.forEach((admin)=>{
        admins.push(admin.id)
    })
    return admins
}

export const getGroupInfo = async(c, groupId)=>{ 
    return await c.groupMetadata(groupId)
}

export const getGroupMembersId = async(c, groupId)=>{ 
    let {participants} = await c.groupMetadata(groupId)
    let participantsId = []
    participants.forEach((participant)=>{
        participantsId.push(participant.id)
    })
    return participantsId
}

export const getGroupMembersIdFromMetadata = async(groupMetadata)=>{ 
    let {participants} = groupMetadata
    let participantsId = []
    participants.forEach((participant)=>{
        participantsId.push(participant.id)
    })
    return participantsId
}

export const getGroupAdminsFromMetadata = async(groupMetadata)=>{ 
    let {participants} = groupMetadata
    let groupAdmins = participants.filter(member => (member.admin != null))
    let admins = []
    groupAdmins.forEach((admin)=>{
        admins.push(admin.id)
    })
    return admins
}

export const getAllGroups = async(c)=>{ 
    let groups = await c.groupFetchAllParticipating()
    let groupsData = []
    for (let [key, value] of Object.entries(groups)) {
        groupsData.push(value)
    }
    return groupsData
}

export const removeParticipant = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "remove")
    return response[0]
}

export const addParticipant = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "add")
    return response[0]
}

export const promoteParticipant = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "promote")
    return response[0]
}

export const demoteParticipant = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "demote")
    return response[0]
}

export const getGroupInviteLink = async(c, groupId)=>{
    var inviteCode = await c.groupInviteCode(groupId)
    return `https://chat.whatsapp.com/${inviteCode}`
}


