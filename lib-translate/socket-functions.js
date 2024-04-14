const {MessageTypes}  = require("./message")
const {getVideoThumbnail} = require("../lib/conversao")

module.exports ={

    // GENERAL FUNCTIONS
    deleteMessage: async(c, message, isQuoted = false)=>{
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
    },

    setProfilePic: async(c, id, buffer)=>{
        return await c.updateProfilePicture(id, buffer)
    },

    setMyStatus: async(c, status)=>{
        return await c.updateProfileStatus(status)
    },

    botLogout: async(c)=>{
        return await c.end(new Error("Comando"))
    },

    getProfilePicFromServer: async(c, userId)=>{
        return await c.profilePictureUrl(userId, "image")
    },

    contactBlock: async(c, userId)=>{
        return await c.updateBlockStatus(userId, "block")
    },

    contactUnblock: async(c, userId)=>{
        return await c.updateBlockStatus(userId, "unblock")
    },

    getHostNumber: async(c)=>{ 
        var id = c.user.id.replace(/:[0-9]+/ism, '')
        return id
    },

    getBlockedIds: async(c)=>{ 
        return await c.fetchBlocklist()
    },


    // SEND MESSAGES/MEDIAS FUNCTIONS
    sendText: async(c, id, text)=>{ 
        return await c.sendMessage(id, {text, linkPreview: null})
    },

    sendPoll: async(c, chatId, pollName, pollValues)=>{
        return await c.sendMessage(chatId, {poll : {name: pollName, values: pollValues, selectableCount: 1}})
    },

    sendLinkWithAutoPreview: async(c, chatId, textWithLink) =>{
        return await c.sendMessage(chatId, {text: textWithLink})
    },
    
    sendTextWithMentions: async(c, id, text, mentionedIdsArray)=>{  
        return await c.sendMessage(id, {text , mentions: mentionedIdsArray})
    },

    sendSticker: async(c,id, sticker)=>{ 
        return await c.sendMessage(id, sticker)
    },

    sendFileFromUrl: async(c, type, chatId, filePath, caption) =>{ 
        if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: {url: filePath}, caption})
        }
    },

    reply: async(c, chatId, text, quotedMessage)=>{ 
        return await c.sendMessage(chatId, {text, linkPreview: null}, {quoted: quotedMessage})
    },

    replyFile: async(c, type, chatId, filePath, caption, quotedMessage, mimetype = '') =>{ 
        if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: {url: filePath}, caption}, {quoted: quotedMessage})
        } else if (type == MessageTypes.video){
            var base64Thumb = await getVideoThumbnail(filePath)
            return await c.sendMessage(chatId,{video: {url: filePath}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
        } else if (type == MessageTypes.audio){
            return await c.sendMessage(chatId, {audio: {url: filePath}, mimetype}, {quoted: quotedMessage})
        }
    },

    replyFileFromUrl: async(c, type, chatId, url, caption, quotedMessage, mimetype = '') =>{ 
        if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: {url}, caption}, {quoted: quotedMessage})
        } else if (type == MessageTypes.video){
            var base64Thumb = await getVideoThumbnail(url, "url")
            return await c.sendMessage(chatId,{video: {url}, mimetype, caption, jpegThumbnail : base64Thumb}, {quoted: quotedMessage})
        } else if (type == MessageTypes.audio){
            return await c.sendMessage(chatId, {audio: {url}, mimetype}, {quoted: quotedMessage})
        }
    },

    replyFileFromBuffer: async(c, type, chatId, buffer, caption, quotedMessage, mimetype = '')=>{ 
        if(type == MessageTypes.video){
            var base64Thumb = await getVideoThumbnail(buffer, "buffer")
            return await c.sendMessage(chatId,{video: buffer, caption, mimetype, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
        } else if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: buffer, caption}, {quoted: quotedMessage})
        }
    },

    replyWithMentions: async(c, chatId, text, mentionedIdsArray, quotedMessage)=>{ 
        return await c.sendMessage(chatId, {text , mentions: mentionedIdsArray}, {quoted: quotedMessage})
    },


    // GROUP FUNCTIONS
    joinGroupViaLink : async(c, idLink)=>{
        return await c.groupAcceptInvite(idLink)
    },

    revokeGroupInviteLink: async(c, groupId)=>{
        return await c.groupRevokeInvite(groupId)
    },

    leaveGroup: async(c, groupId)=>{
        return await c.groupLeave(groupId)
    },

    inviteInfo : async(c, link)=>{
        return await c.groupGetInviteInfo(link)
    },

    setGroupToAdminsOnly: async(c, groupId, state)=>{
        let setting = state ? "announcement" : "not_announcement"
        return await c.groupSettingUpdate(groupId, setting)
    },

    
    getGroupAdmins : async(c, groupId)=>{ 
        let {participants} = await c.groupMetadata(groupId)
        let groupAdmins = participants.filter(member => (member.admin != null))
        let admins = []
        groupAdmins.forEach((admin)=>{
            admins.push(admin.id)
        })
        return admins
    },

    getGroupInfo : async(c, groupId)=>{ 
        return await c.groupMetadata(groupId)
    },

    getGroupMembersId : async(c, groupId)=>{ 
        let {participants} = await c.groupMetadata(groupId)
        let participantsId = []
        participants.forEach((participant)=>{
            participantsId.push(participant.id)
        })
        return participantsId
    },

    getGroupMembersIdFromMetadata : async(groupMetadata)=>{ 
        let {participants} = groupMetadata
        let participantsId = []
        participants.forEach((participant)=>{
            participantsId.push(participant.id)
        })
        return participantsId
    },

    getGroupAdminsFromMetadata : async(groupMetadata)=>{ 
        let {participants} = groupMetadata
        let groupAdmins = participants.filter(member => (member.admin != null))
        let admins = []
        groupAdmins.forEach((admin)=>{
            admins.push(admin.id)
        })
        return admins
    },

    getAllGroups: async(c)=>{ 
        let groups = await c.groupFetchAllParticipating()
        let groupsData = []
        for (let [key, value] of Object.entries(groups)) {
            groupsData.push(value)
        }
        return groupsData
    },

    removeParticipant: async(c, groupId, participantId)=>{
        let response = await c.groupParticipantsUpdate(groupId, [participantId], "remove")
        return response[0]
    },

    addParticipant: async(c, groupId, participantId)=>{
        let response = await c.groupParticipantsUpdate(groupId, [participantId], "add")
        return response[0]
    },

    promoteParticipant: async(c, groupId, participantId)=>{
        let response = await c.groupParticipantsUpdate(groupId, [participantId], "promote")
        return response[0]
    },

    demoteParticipant: async(c, groupId, participantId)=>{
        let response = await c.groupParticipantsUpdate(groupId, [participantId], "demote")
        return response[0]
    },

    getGroupInviteLink: async(c, groupId)=>{
        var inviteCode = await c.groupInviteCode(groupId)
        return `https://chat.whatsapp.com/${inviteCode}`
    },

}

