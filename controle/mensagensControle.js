import * as mensagensdb from '../db_funcoes/mensagens.js'
import {WAProto} from '@whiskeysockets/baileys'

export const armazenarMensagem = async (mensagem) =>{
    await mensagensdb.armazenarMensagem(mensagem)
}

export const recuperarMensagem = async (remoteJid, mensagemId) =>{
    let mensagem = await mensagensdb.obterMensagem(remoteJid, mensagemId)
    return  mensagem ? WAProto.Message.fromObject(mensagem) : undefined
}

export const limparMensagensArmazenadas = async()=>{
    await mensagensdb.limparMensagens()
}
