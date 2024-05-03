import * as mensagensdb from '../database/mensagens.js'
import {WAProto} from '@whiskeysockets/baileys'

export const armazenarMensagem = async (mensagem) =>{
    await mensagensdb.armazenarMensagem(mensagem)
}

export const recuperarMensagem = async (remoteJid, mensagemId) =>{
    let mensagem = await mensagensdb.obterMensagem(remoteJid, mensagemId)
    return WAProto.WebMessageInfo.fromObject(mensagem)
}

export const obterMensagensChat = async(remoteJid) =>{
    let mensagens = await mensagensdb.obterMensagensChat(remoteJid)
    return mensagens
}

export const limparMensagensArmazenadas = async()=>{
    await mensagensdb.limparMensagens()
}
