const {MessageTypes}  = require("../lib-translate/msgtypes")
const {generateWAMessage, generateWAMessageFromContent} = require('@whiskeysockets/baileys')
const client = require("../lib-translate/baileys")
const {} = require('@whiskeysockets/baileys')
const {getVideoThumbnail} = require("../lib/conversao")
const pino  = require("pino")
const fs = require('fs-extra')
const path = require('path')
const { obterNomeAleatorio } = require("../lib/util")

module.exports ={
    // TRADUZIR CONTEUDO DA MENSAGEM PARA A BIBLIOTECA BAILEYS
    messageData : async(c,m) =>{
        try {
            m = m.messages[0]
            let msg = {}, type = Object.keys(m.message)[0], quotedMsg = type == "extendedTextMessage" && m.message.extendedTextMessage?.contextInfo?.quotedMessage != undefined, quotedType  = null
            if(m.message.extendedTextMessage?.contextInfo?.quotedMessage){
                quotedType = quotedMsg ? Object.keys(m.message.extendedTextMessage?.contextInfo?.quotedMessage)[0] : null
            }
            msg = {
                sender : m.key.participant || m.key.remoteJid ,
                username : m.pushName,
                broadcast : m.key.remoteJid == "status@broadcast",
                caption : m.message[type].caption || null,
                chat : null,
                messageId : m.key.id,
                body : m.message.conversation || m.message.extendedTextMessage?.text || null,
                id: m,
                type,
                t : m.messageTimestamp,
                mentionedJidList: m.message[type].contextInfo?.mentionedJid || [],
                mimetype: (type != MessageTypes.text && type != MessageTypes.extendedText) ? m.message[type].mimetype || null : null,
                mediaUrl: (type == MessageTypes.video || type == MessageTypes.image) ? m.message[type].url : null,
                fromMe : m.key.fromMe,
                chatId: m.key.remoteJid,
                isGroupMsg : m.key.remoteJid.includes("@g.us"),
                isMedia : type == MessageTypes.image || type == MessageTypes.video,
                seconds : (type == MessageTypes.video || type == MessageTypes.audio) ? m.message[type].seconds : null,
                quotedMsg,
                quotedMsgObj : quotedMsg ? await generateWAMessageFromContent(m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid, m.message.extendedTextMessage.contextInfo.quotedMessage , { logger : pino() }) : null,
                quotedMsgObjInfo : quotedMsg ? {
                    type : quotedType,
                    sender : m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid,
                    body : m.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || m.message.extendedTextMessage.contextInfo.quotedMessage?.extendedTextMessage?.text || null,
                    caption : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.caption || null,
                    url : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.url || null,
                    mimetype : m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.mimetype || null,
                    seconds: (quotedType == MessageTypes.video || quotedType == MessageTypes.audio) ? m.message.extendedTextMessage.contextInfo.quotedMessage[quotedType]?.seconds : null
                } : null
            }

            //SE FOR MENSAGEM DE GRUPO TRAGA AS INFORMAÇÕES DO GRUPO
            if(msg.isGroupMsg){
                const group = await c.groupMetadata(msg.chatId)
                msg.chat = {
                    isOwner: group.owner == msg.sender,
                    isAdmin: group.participants[group.participants.findIndex(a => a.id == msg.sender)].admin != null,
                    formattedTitle : group.subject,
                    groupMetadata:{
                        id: group.id,
                        formattedTitle : group.subject,
                        announce: group.announce,
                        owner: group.owner,
                        size: group.size,
                        description : group.desc,
                        restrict: group.restrict,
                        participants: group.participants
                    }
                }
            }
            return msg
        } catch (err) {
            console.log(err)
            return m
        }
    },

    //TRADUZIR FUNÇÕES GERAIS DO SOCKET BAILEYS

    //GERAIS

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

    getAllGroups: async(c)=>{ // PEGAR GRUPOS PARTIPANTES  -  FUNCIONANDO
        let groups = await c.groupFetchAllParticipating()
        let groupsData = []
        for (let [key, value] of Object.entries(groups)) {
            groupsData.push(value)
        }
        return groupsData
    },

    contactBlock: async(c, userId)=>{
        return await c.updateBlockStatus(userId, "block")
    },

    contactUnblock: async(c, userId)=>{
        return await c.updateBlockStatus(userId, "unblock")
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

    getHostNumber: async(c)=>{ //PEGAR NÚMERO DO BOT - FUNCIONANDO
        var id = c.user.id.replace(/:[0-9]+/ism, '')
        return id
    },

    getBlockedIds: async(c)=>{ //PEGAR ID DE USUARIOS BLOQUEADOS - FUNCIONANDO
        return await c.fetchBlocklist()
    },

    getGroupInviteLink: async(c, groupId)=>{
        var inviteCode = await c.groupInviteCode(groupId)
        return `https://chat.whatsapp.com/${inviteCode}`
    },

    /////////  FUNÇÕES ENVIO NORMAL
    sendText: async(c, id, text)=>{ //ENVIAR TEXTO
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

    /////////  FUNÇÕES DE RESPOSTA
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

}

