import {MessageTypes} from './mensagem.js'
import {delayAleatorio} from '../lib/util.js'
import api from '../../api/api.js'

// Gerais
export const deletarMensagem = async(c, message, isQuoted = false)=>{
    let deleteMessage
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

export const lerMensagem = async(c, chatId, sender, messageId) =>{
    return await c.sendReceipt(chatId, sender, [messageId], 'read')
}

export const atualizarPresenca = async(c, chatId, type)=>{
    await c.presenceSubscribe(chatId)
    await delayAleatorio(200, 400)
    await c.sendPresenceUpdate(type, chatId)
    await delayAleatorio(300, 1000)
    await c.sendPresenceUpdate('paused', chatId)
}

export const alterarFotoPerfil = async(c, id, buffer)=>{
    return await c.updateProfilePicture(id, buffer)
}

export const alterarStatusPerfil = async(c, status)=>{
    return await c.updateProfileStatus(status)
}

export const encerrarBot = async(c)=>{
    return await c.end(new Error("Comando"))
}

export const obterFotoPerfil = async(c, userId)=>{
    return await c.profilePictureUrl(userId, "image")
}

export const bloquearContato = async(c, userId)=>{
    return await c.updateBlockStatus(userId, "block")
}

export const desbloquearContato = async(c, userId)=>{
    return await c.updateBlockStatus(userId, "unblock")
}

export const obterNumeroHost = async(c)=>{ 
    let id = c.user.id.replace(/:[0-9]+/ism, '')
    return id
}

export const obterContatosBloqueados = async(c)=>{ 
    return await c.fetchBlocklist()
}



// Envio de mensagens
export const enviarTexto = async(c, chatId, text)=>{
    await atualizarPresenca(c, chatId, "composing")
    await c.sendMessage(chatId, {text, linkPreview: null})
}

export const retransmitirMensagem = async(c, chatId, mensagem)=>{
    await c.relayMessage(chatId, mensagem)
}

export const enviarEnquete = async(c, chatId, pollName, pollValues)=>{
    return await c.sendMessage(chatId, {poll : {name: pollName, values: pollValues, selectableCount: 1}})
}

export const enviarLinkComPrevia = async(c, chatId, textWithLink) =>{
    await atualizarPresenca(c, chatId, "composing")
    return await c.sendMessage(chatId, {text: textWithLink})
}

export const enviarTextoComMencoes = async(c, chatId, text, mentionedIdsArray)=>{ 
    await atualizarPresenca(c, chatId, "composing")
    return await c.sendMessage(chatId, {text , mentions: mentionedIdsArray})
}

export const enviarFigurinha = async(c,id, sticker)=>{ 
    return await c.sendMessage(id, {sticker})
}

export const enviarArquivoUrl = async(c, type, chatId, url, caption) =>{ 
    if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: {url}, caption})
    }
}

export const responderTexto = async(c, chatId, text, quotedMessage)=>{ 
    await atualizarPresenca(c, chatId, "composing")
    return await c.sendMessage(chatId, {text, linkPreview: null}, {quoted: quotedMessage})
}

export const responderArquivoLocal = async(c, type, chatId, filePath, caption, quotedMessage, mimetype = '') =>{ 
    if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: {url: filePath}, caption}, {quoted: quotedMessage})
    } else if (type == MessageTypes.video){
        let base64Thumb = (await api.Videos.obterThumbnailVideo(filePath)).resultado
        return await c.sendMessage(chatId,{video: {url: filePath}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
    } else if (type == MessageTypes.audio){
        return await c.sendMessage(chatId, {audio: {url: filePath}, mimetype}, {quoted: quotedMessage})
    }
}

export const responderArquivoUrl = async(c, type, chatId, url, caption, quotedMessage, mimetype = '') =>{ 
    if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: {url}, caption}, {quoted: quotedMessage})
    } else if (type == MessageTypes.video){
        let base64Thumb = (await api.Videos.obterThumbnailVideo(url, "url")).resultado
        return await c.sendMessage(chatId,{video: {url}, mimetype, caption, jpegThumbnail : base64Thumb}, {quoted: quotedMessage})
    } else if (type == MessageTypes.audio){
        return await c.sendMessage(chatId, {audio: {url}, mimetype}, {quoted: quotedMessage})
    }
}

export const responderArquivoBuffer = async(c, type, chatId, buffer, caption, quotedMessage, mimetype = '')=>{ 
    if(type == MessageTypes.video){
        let base64Thumb = (await api.Videos.obterThumbnailVideo(buffer, "buffer")).resultado
        return await c.sendMessage(chatId,{video: buffer, caption, mimetype, jpegThumbnail: base64Thumb}, {quoted: quotedMessage})
    } else if(type == MessageTypes.image){
        return await c.sendMessage(chatId,{image: buffer, caption}, {quoted: quotedMessage})
    } else if (type == MessageTypes.audio){
        return await c.sendMessage(chatId, {audio: buffer, mimetype}, {quoted: quotedMessage})
    }
}

export const responderComMencoes = async(c, chatId, text, mentionedIdsArray, quotedMessage)=>{ 
    await atualizarPresenca(c, chatId, "composing")
    return await c.sendMessage(chatId, {text , mentions: mentionedIdsArray}, {quoted: quotedMessage})
}


// Grupos
export const entrarLinkGrupo = async(c, idLink)=>{
    return await c.groupAcceptInvite(idLink)
}

export const revogarLinkGrupo = async(c, groupId)=>{
    return await c.groupRevokeInvite(groupId)
}

export const obterLinkGrupo = async(c, groupId)=>{
    let inviteCode = await c.groupInviteCode(groupId)
    return inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : undefined
}


export const sairGrupo = async(c, groupId)=>{
    return await c.groupLeave(groupId)
}

export const obterInfoConviteGrupo = async(c, link)=>{
    return await c.groupGetInviteInfo(link)
}

export const alterarRestricaoGrupo = async(c, groupId, state)=>{
    let setting = state ? "announcement" : "not_announcement"
    return await c.groupSettingUpdate(groupId, setting)
}

export const obterMembrosGrupoPorMetadata = async(groupMetadata)=>{ 
    let {participants} = groupMetadata
    let participantsId = []
    participants.forEach((participant)=>{
        participantsId.push(participant.id)
    })
    return participantsId
}

export const obterAdminsGrupoPorMetadata = async(groupMetadata)=>{ 
    let {participants} = groupMetadata
    let groupAdmins = participants.filter(member => (member.admin != null))
    let admins = []
    groupAdmins.forEach((admin)=>{
        admins.push(admin.id)
    })
    return admins
}

export const obterTodosGrupos = async(c)=>{ 
    let groups = await c.groupFetchAllParticipating()
    let groupsData = []
    for (let [key, value] of Object.entries(groups)) {
        groupsData.push(value)
    }
    return groupsData
}

export const removerParticipante = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "remove")
    return response[0]
}

export const adicionarParticipante = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "add")
    return response[0]
}

export const promoverParticipante = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "promote")
    return response[0]
}

export const rebaixarParticipante = async(c, groupId, participantId)=>{
    let response = await c.groupParticipantsUpdate(groupId, [participantId], "demote")
    return response[0]
}




