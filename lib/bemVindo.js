import { obterMensagensTexto } from './msgs.js'
import {criarTexto, consoleErro} from './util.js'
import * as socket from '../lib-baileys/socket-funcoes.js'

export const bemVindo = async(c, event, g_info)=>{
    try{
        var msgs_texto = obterMensagensTexto()
        if(g_info.bemvindo.status){
            let msg_customizada = (g_info.bemvindo.msg != "") ? g_info.bemvindo.msg+"\n\n" : "" 
            let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, event.participants[0].replace("@s.whatsapp.net", ""), g_info.nome, msg_customizada)
            await socket.sendTextWithMentions(c, event.id, mensagem_bemvindo, [event.participants[0]])
        }
    } catch(err){
        err.message = `bemVindo - ${err.message}`
        consoleErro(err, "BEM VINDO")
    }
}