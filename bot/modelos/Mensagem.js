import Datastore from '@seald-io/nedb'
const db = new Datastore({filename : './dados/mensagens.db', autoload: true})

export class Mensagem{
    constructor(){}

    async armazenarMensagem(dadosMensagem){
        await db.insertAsync(dadosMensagem)
    }

    async obterMensagem(chatId, mensagemId){
        return await db.findOneAsync({chatId, mensagemId})
    }

    async limparMensagens(){
        await db.removeAsync({}, {multi: true})
    }
}