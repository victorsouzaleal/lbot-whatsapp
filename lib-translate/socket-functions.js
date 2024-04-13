const {MessageTypes}  = require("./message")
const {getVideoThumbnail} = require("../lib/conversao")
const db = require("../lib/database")
const fs = require('fs-extra')
const path = require('path')

module.exports ={
    // >>>>>>>>>>>>>>> FUNÇÕES GERAIS
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

    getHostNumber: async(c)=>{ //PEGAR NÚMERO DO BOT - FUNCIONANDO
        var id = c.user.id.replace(/:[0-9]+/ism, '')
        return id
    },

    getBlockedIds: async(c)=>{ //PEGAR ID DE USUARIOS BLOQUEADOS - FUNCIONANDO
        return await c.fetchBlocklist()
    },


    // >>>>>>>>>>>>>>> FUNÇÕES DE ENVIO DE MENSAGENS/CONTEÚDO

    sendText: async(c, id, text)=>{ 
        return await c.sendMessage(id, {text, linkPreview: null})
    },

    sendPoll: async(c, chatId, pollName, pollValues)=>{
        return await c.sendMessage(chatId, {poll : {name: pollName, values: pollValues, selectableCount: 1}})
    },

    sendLinkWithAutoPreview: async(c, chatId, textWithLink) =>{
        return await c.sendMessage(chatId, {text: textWithLink})
    },
    
    sendTextWithMentions: async(c, id, text, mentionedIdsArray)=>{ //ENVIAR TEXTO MENCIONANDO UM MEMBRO 
        return await c.sendMessage(id, {text , mentions: mentionedIdsArray})
    },

    sendSticker: async(c,id, sticker)=>{ //ENVIA UM STICKER
        return await c.sendMessage(id, sticker)
    },

    sendFileFromUrl: async(c, type, chatId, filePath, caption) =>{ //ENVIA COM MIDIA DE URL REMOTO
        if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: {url: filePath}, caption})
        }
    },

    reply: async(c, chatId, text, quotedMessage)=>{ //RESPONDER COM TEXTO - FUNCIONANDO
        return await c.sendMessage(chatId, {text, linkPreview: null}, {quoted: quotedMessage})
    },

    replyFile: async(c, type, chatId, filePath, caption, quotedMessage, mimetype = '') =>{ //RESPONDER COM MIDIA DE ARQUIVO LOCAL
        if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: {url: filePath}, caption}, {quoted: quotedMessage})
        } else if (type == MessageTypes.video){
            var base64Thumb = await getVideoThumbnail(filePath)
            return await c.sendMessage(chatId,{video: {url: filePath}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
        } else if (type == MessageTypes.audio){
            return await c.sendMessage(chatId, {audio: {url: filePath}, mimetype}, {quoted: quotedMessage})
        }
    },

    replyFileFromUrl: async(c, type, chatId, url, caption, quotedMessage, mimetype = '') =>{ //RESPONDER COM MIDIA DE URL REMOTO
        if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: {url}, caption}, {quoted: quotedMessage})
        } else if (type == MessageTypes.video){
            var base64Thumb = await getVideoThumbnail(url, "url")
            return await c.sendMessage(chatId,{video: {url}, mimetype, caption, jpegThumbnail : base64Thumb}, {quoted: quotedMessage})
        } else if (type == MessageTypes.audio){
            return await c.sendMessage(chatId, {audio: {url}, mimetype}, {quoted: quotedMessage})
        }
    },

    replyFileFromBuffer: async(c, type, chatId, buffer, caption, quotedMessage, mimetype = '')=>{ //RESPONDER COM MIDIA EM BUFFER
        if(type == MessageTypes.video){
            var base64Thumb = await getVideoThumbnail(buffer, "buffer")
            return await c.sendMessage(chatId,{video: buffer, caption, mimetype, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
        } else if(type == MessageTypes.image){
            return await c.sendMessage(chatId,{image: buffer, caption}, {quoted: quotedMessage})
        }
    },

    replyWithMentions: async(c, chatId, text, mentionedIdsArray, quotedMessage)=>{ //RESPONDER TEXTO MENCIONANDO UM MEMBRO 
        return await c.sendMessage(chatId, {text , mentions: mentionedIdsArray}, {quoted: quotedMessage})
    },


    // >>>>>>>>>>>>>>> FUNÇÕES DE GRUPOS

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

    
    getGroupAdmins : async(c, groupId)=>{ // PEGAR ADMINS DO GRUPO - FUNCIONANDO
        let {participants} = await c.groupMetadata(groupId)
        let groupAdmins = participants.filter(member => (member.admin != null))
        let admins = []
        groupAdmins.forEach((admin)=>{
            admins.push(admin.id)
        })
        return admins
    },

    getGroupInfo : async(c, groupId)=>{ //PEGAR DADOS DE UM GRUPO
        return await c.groupMetadata(groupId)
    },

    getGroupMembersId : async(c, groupId)=>{ // PEGAR ID DE PARTIPANTES DE UM GRUPO  -  FUNCIONANDO
        let {participants} = await c.groupMetadata(groupId)
        let participantsId = []
        participants.forEach((participant)=>{
            participantsId.push(participant.id)
        })
        return participantsId
    },

    getGroupMembersIdFromMetadata : async(groupMetadata)=>{ // PEGAR ID DE PARTIPANTES DE UM GRUPO  -  FUNCIONANDO
        let {participants} = groupMetadata
        let participantsId = []
        participants.forEach((participant)=>{
            participantsId.push(participant.id)
        })
        return participantsId
    },

    getGroupAdminsFromMetadata : async(groupMetadata)=>{ // PEGAR ADMINS DO GRUPO - FUNCIONANDO
        let {participants} = groupMetadata
        let groupAdmins = participants.filter(member => (member.admin != null))
        let admins = []
        groupAdmins.forEach((admin)=>{
            admins.push(admin.id)
        })
        return admins
    },

    getAllGroups: async(c)=>{ // PEGAR GRUPOS PARTIPANTES  -  FUNCIONANDO
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


    // >>>>>>>>>>>>>>> FUNÇÕES DE SOCKET ACESSANDO DB

    getGroupInfoFromDb : async(groupId)=>{ //PEGAR DADOS DE UM GRUPO
        return await db.obterGrupo(groupId)
    },

    getHostNumberFromBotJSON: async()=>{ //PEGAR NÚMERO DO BOT - FUNCIONANDO
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
        return bot.hostNumber
    },

    getAllGroupsFromDb: async()=>{
        let groups = await db.obterTodosGrupos()
        return groups
    },

    getGroupAdminsFromDb : async(groupId)=>{ 
        let groupAdmins = await db.obterAdminsGrupo(groupId)
        return groupAdmins
    },

    getGroupOwnerFromDb : async(groupId)=>{ 
        let ownerGroup = await db.obterDonoGrupo(groupId)
        return ownerGroup
    },

    getGroupAnnounceFromDb : async(groupId)=>{ 
        let announceGroup = await db.obterStatusRestritoMsg(groupId)
        return announceGroup
    },

    getGroupMembersIdFromDb : async(groupId)=>{ 
        let groupMembers = await db.obterParticipantesGrupo(groupId)
        return groupMembers
    },



}

