import {Mensagem} from '../modelos/Mensagem.js'
import {WAProto} from '@whiskeysockets/baileys'

export class MensagemControle{
    constructor(){
        this.mensagem = new Mensagem()
    }

    async armazenarMensagem(mensagem){
        let dadosMensagem = {
            chatId : mensagem.key.remoteJid,
            mensagemId : mensagem.key.id,
            mensagem : JSON.stringify(mensagem.message)
        }
        await this.mensagem.armazenarMensagem(dadosMensagem) 
    }

    async recuperarMensagem(remoteJid, mensagemId){
        let dadosMensagem = await this.mensagem.obterMensagem(remoteJid, mensagemId)
        return dadosMensagem ? WAProto.Message.fromObject(JSON.parse(dadosMensagem.mensagem)) : undefined
    }

    async limparMensagensArmazenadas(){
        await this.mensagem.limparMensagens()
    }
}