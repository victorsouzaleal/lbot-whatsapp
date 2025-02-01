import {getContentType } from '@whiskeysockets/baileys'
import {tiposMensagem} from './mensagem.js'
import {delayAleatorio} from '../lib/util.js'
import api from '@victorsouzaleal/lbot-api-comandos'

// Gerais
export const deletarMensagem = async(c, mensagem, mensagemCitada = false)=>{
    let mensagemDeletada 
    if(mensagemCitada){
        mensagemDeletada = {
            remoteJid: mensagem.key.remoteJid,
            fromMe: false,
            id: mensagem.message.extendedTextMessage.contextInfo.stanzaId,
            participant: mensagem.message.extendedTextMessage.contextInfo.participant
        }
    } else{
        mensagemDeletada = mensagem.key
    }
    return await c.sendMessage(mensagem.key.remoteJid, {delete: mensagemDeletada})
}

export const lerMensagem = async(c, id_chat, remetente, id_mensagem) =>{
    return await c.sendReceipt(id_chat, remetente, [id_mensagem], 'read')
}

export const atualizarPresenca = async(c, id_chat, tipo)=>{
    await c.presenceSubscribe(id_chat)
    await delayAleatorio(200, 400)
    await c.sendPresenceUpdate(tipo, id_chat)
    await delayAleatorio(300, 1000)
    await c.sendPresenceUpdate('paused', id_chat)
}

export const alterarFotoPerfil = async(c, id_chat, bufferImagem)=>{
    return await c.updateProfilePicture(id_chat, bufferImagem)
}

export const alterarStatusPerfil = async(c, status)=>{
    return await c.updateProfileStatus(status)
}

export const encerrarBot = async(c)=>{
    return await c.end(new Error("Comando"))
}

export const obterFotoPerfil = async (c, id_chat) => {
    try {
      return await c.profilePictureUrl(id_chat, 'image')
    } catch (err) {
      console.error('Erro ao obter foto de perfil:', err)
      return null
    }
  }

export const bloquearContato = async(c, id_usuario)=>{
    return await c.updateBlockStatus(id_usuario, "block")
}

export const desbloquearContato = async(c, id_usuario)=>{
    return await c.updateBlockStatus(id_usuario, "unblock")
}

export const obterNumeroHost = async(c)=>{ 
    let id = c.user.id.replace(/:[0-9]+/ism, '')
    return id
}

export const obterContatosBloqueados = async(c)=>{ 
    return await c.fetchBlocklist()
}



// Envio de mensagens
export const enviarTexto = async(c, id_chat, texto)=>{
    await atualizarPresenca(c, id_chat, "composing")
    return await c.sendMessage(id_chat, {text : texto, linkPreview: null})
}

export const retransmitirMensagem = async(c, id_chat, mensagem, mensagemCitacao)=>{
    mensagem[Object.keys(mensagem)[0]].contextInfo = {
        stanzaId: mensagemCitacao.key.id,
        remoteJid: mensagemCitacao.key.remoteJid,
        participant: mensagemCitacao.key.participant || mensagemCitacao.key.remoteJid,
        fromMe: mensagemCitacao.key.fromMe,
        quotedMessage: {}
    }
    return await c.relayMessage(id_chat, mensagem, {})
}

export const enviarEnquete = async(c, id_chat, nomeEnquete, valoresEnquete)=>{
    return await c.sendMessage(id_chat, {poll : {name: nomeEnquete, values: valoresEnquete, selectableCount: 1}})
}

export const enviarLinkComPrevia = async(c, id_chat, texto) =>{
    await atualizarPresenca(c, id_chat, "composing")
    return await c.sendMessage(id_chat, {text: texto})
}

export const enviarTextoComMencoes = async(c, id_chat, texto, mencionados)=>{ 
    await atualizarPresenca(c, id_chat, "composing")
    return await c.sendMessage(id_chat, {text : texto , mentions: mencionados})
}

export const retransmitirMensagemMarcando = async(c, id_chat, mensagem, mencionados)=>{
    let tipoMensagem = getContentType(mensagem.message)
    if(tipoMensagem == "conversation"){
        let textoMensagem = mensagem.message[tipoMensagem]
        mensagem.message = {
            extendedTextMessage : {
                text: textoMensagem,
                contextInfo : {
                    mentionedJid: mencionados,
                    isForwarded: true
                }
            }
        }
    } else {
        mensagem.message[tipoMensagem].contextInfo = {mentionedJid : mencionados, isForwarded: true} 
    }
    return await c.relayMessage(id_chat, mensagem.message, {})
}

export const enviarFigurinha = async(c, id_chat, sticker)=>{ 
    return await c.sendMessage(id_chat, {sticker})
}

export const enviarArquivoUrl = async(c, tipo, id_chat, url, legenda) =>{ 
    if(tipo == tiposMensagem.imagem){
        return await c.sendMessage(id_chat, {image: {url}, caption: legenda})
    }
}

export const responderTexto = async(c, id_chat, texto, mensagemCitacao)=>{ 
    await atualizarPresenca(c, id_chat, "composing")
    return await c.sendMessage(id_chat, {text: texto, linkPreview: null}, {quoted: mensagemCitacao})
}

export const responderArquivoLocal = async(c, tipo, id_chat, caminhoArquivo, legenda, mensagemCitacao, mimetype = '') =>{ 
    if(tipo == tiposMensagem.imagem){
        return await c.sendMessage(id_chat, {image: {url: caminhoArquivo}, caption: legenda}, {quoted: mensagemCitacao})
    } else if (tipo == tiposMensagem.video){
        let base64Thumb = (await api.Videos.obterThumbnailVideo(caminhoArquivo)).resultado
        return await c.sendMessage(id_chat, {video: {url: caminhoArquivo}, mimetype, caption: legenda, jpegThumbnail: base64Thumb}, {quoted: mensagemCitacao})
    } else if (tipo == tiposMensagem.audio){
        return await c.sendMessage(id_chat, {audio: {url: caminhoArquivo}, mimetype}, {quoted: mensagemCitacao})
    }
}

export const responderArquivoUrl = async(c, tipo, id_chat, url, legenda, mensagemCitacao, mimetype = '') =>{ 
    if(tipo == tiposMensagem.imagem){
        return await c.sendMessage(id_chat, {image: {url}, caption: legenda}, {quoted: mensagemCitacao})
    } else if (tipo == tiposMensagem.video){
        let base64Thumb = (await api.Videos.obterThumbnailVideo(url, "url")).resultado
        return await c.sendMessage(id_chat, {video: {url}, mimetype, caption: legenda, jpegThumbnail : base64Thumb}, {quoted: mensagemCitacao})
    } else if (tipo == tiposMensagem.audio){
        return await c.sendMessage(id_chat, {audio: {url}, mimetype}, {quoted: mensagemCitacao})
    }
}

export const responderArquivoBuffer = async(c, tipo, id_chat, buffer, legenda, mensagemCitacao, mimetype = '')=>{ 
    if(tipo == tiposMensagem.video){
        let base64Thumb = (await api.Videos.obterThumbnailVideo(buffer, "buffer")).resultado
        return await c.sendMessage(id_chat, {video: buffer, caption: legenda, mimetype, jpegThumbnail: base64Thumb}, {quoted: mensagemCitacao})
    } else if(tipo == tiposMensagem.imagem){
        return await c.sendMessage(id_chat, {image: buffer, caption: legenda}, {quoted: mensagemCitacao})
    } else if (tipo == tiposMensagem.audio){
        return await c.sendMessage(id_chat, {audio: buffer, mimetype}, {quoted: mensagemCitacao})
    }
}

export const responderComMencoes = async(c, id_chat, texto, mencionados, mensagemCitacao)=>{ 
    await atualizarPresenca(c, id_chat, "composing")
    return await c.sendMessage(id_chat, {text: texto , mentions: mencionados}, {quoted: mensagemCitacao})
}


// Grupos
export const entrarLinkGrupo = async(c, idLink)=>{
    return await c.groupAcceptInvite(idLink)
}

export const revogarLinkGrupo = async(c, id_grupo)=>{
    return await c.groupRevokeInvite(id_grupo)
}

export const obterLinkGrupo = async(c, id_grupo)=>{
    let codigoConvite = await c.groupInviteCode(id_grupo)
    return codigoConvite ? `https://chat.whatsapp.com/${codigoConvite}` : undefined
}


export const sairGrupo = async(c, id_grupo)=>{
    return await c.groupLeave(id_grupo)
}

export const obterInfoConviteGrupo = async(c, link)=>{
    return await c.groupGetInviteInfo(link)
}

export const alterarRestricaoGrupo = async(c, id_grupo, status)=>{
    let config = status ? "announcement" : "not_announcement"
    return await c.groupSettingUpdate(id_grupo, config)
}

export const obterMembrosGrupoPorMetadata = async(grupoMetadata)=>{ 
    let {participants} = grupoMetadata
    let participantes = []
    participants.forEach((participant)=>{
        participantes.push(participant.id)
    })
    return participantes
}

export const obterAdminsGrupoPorMetadata = async(grupoMetadata)=>{ 
    let {participants} = grupoMetadata
    let grupoAdmins = participants.filter(member => (member.admin != null))
    let admins = []
    grupoAdmins.forEach((admin)=>{
        admins.push(admin.id)
    })
    return admins
}

export const obterTodosGrupos = async(c)=>{ 
    let grupos = await c.groupFetchAllParticipating()
    let gruposInfo = []
    for (let [key, value] of Object.entries(grupos)) {
        gruposInfo.push(value)
    }
    return gruposInfo
}

export const removerParticipante = async(c, id_grupo, participante)=>{
    let resposta = await c.groupParticipantsUpdate(id_grupo, [participante], "remove")
    return resposta[0]
}

export const adicionarParticipante = async(c, id_grupo, participante)=>{
    let resposta = await c.groupParticipantsUpdate(id_grupo, [participante], "add")
    return resposta[0]
}

export const promoverParticipante = async(c, id_grupo, participante)=>{
    let resposta = await c.groupParticipantsUpdate(id_grupo, [participante], "promote")
    return resposta[0]
}

export const rebaixarParticipante = async(c, id_grupo, participante)=>{
    let resposta = await c.groupParticipantsUpdate(id_grupo, [participante], "demote")
    return resposta[0]
}




