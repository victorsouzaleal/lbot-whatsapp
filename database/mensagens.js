import Datastore from '@seald-io/nedb'

const db = new Datastore({filename : './database/db/mensagens.db', autoload: true})

export const armazenarMensagem = async(mensagem)=>{
    let dadosMensagem = {
        chatId : mensagem.key.remoteJid,
        mensagemId : mensagem.key.id,
        mensagem : JSON.stringify(mensagem.message)
    }
    await db.insertAsync(dadosMensagem)
}

export const obterMensagem = async(chatId, mensagemId)=>{
    let dadosMensagem = await db.findOneAsync({chatId, mensagemId})
    return dadosMensagem ? JSON.parse(dadosMensagem.mensagem) : undefined
}

export const limparMensagens = async()=>{
    await db.removeAsync({}, {multi: true})
}