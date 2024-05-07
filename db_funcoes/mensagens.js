import Datastore from '@seald-io/nedb'

const db = new Datastore({filename : './dados/mensagens.db', autoload: true})

async function Mensagem(mensagem){
    const 
    CHATID = mensagem.key.remoteJid,
    MENSAGEMID = mensagem.key.id,
    MENSAGEM = JSON.stringify(mensagem.message)

    return {
        chatId : CHATID,
        mensagemId : MENSAGEMID,
        mensagem : MENSAGEM
    }
}

export const armazenarMensagem = async(mensagem)=>{
    await db.insertAsync(await Mensagem(mensagem))
}

export const obterMensagem = async(chatId, mensagemId)=>{
    let dadosMensagem = await db.findOneAsync({chatId, mensagemId})
    return dadosMensagem ? JSON.parse(dadosMensagem.mensagem) : undefined
}

export const limparMensagens = async()=>{
    await db.removeAsync({}, {multi: true})
}