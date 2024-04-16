const obterMensagensTexto = require("./msgs")
const {criarTexto, consoleErro} = require("./util")
const socket = require('../lib-baileys/socket-funcoes')

module.exports = bemVindo = async(c, event, g_info)=>{
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