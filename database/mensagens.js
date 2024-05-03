import Datastore from '@seald-io/nedb'

const db = new Datastore({filename : './database/db/mensagens.db', autoload: true})


export const obterMensagensChat = async (chatId)=>{
    let mensagens = await db.findAsync({chatId})
    return mensagens
}

export const armazenarMensagem = async(mensagem)=>{
    let chatId = mensagem.key.remoteJid
    let mensagemJSON = JSON.stringify(mensagem)
    await db.updateAsync({chatId}, {$push : {mensagens : mensagemJSON}}, {upsert: true})
    await db.compactDatafileAsync()
}

export const obterMensagem = async(chatId, mensagemId)=>{
    let m = await db.findOneAsync({chatId})
    let mensagem = m.mensagens.find(msg => JSON.parse(msg).key.id == mensagemId)
    return mensagem ? JSON.parse(mensagem) : undefined
}

export const limparMensagens = async()=>{
    await db.removeAsync({}, {multi: true})
}