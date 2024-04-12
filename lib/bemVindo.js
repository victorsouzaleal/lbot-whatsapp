const msgs_texto = require("./msgs")
const {criarTexto, consoleErro} = require("./util")
const client = require('../lib-translate/baileys')

module.exports = bemVindo = async(c, event, g_info)=>{
    try{
        if(g_info.bemvindo.status){
            let {subject} = await client.getGroupInfo(c, event.id)
            let msg_customizada = (g_info.bemvindo.msg != "") ? g_info.bemvindo.msg+"\n\n" : "" 
            let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, event.participants[0].replace("@s.whatsapp.net", ""), subject, msg_customizada)
            await client.sendTextWithMentions(c, event.id, mensagem_bemvindo, [event.participants[0]])
        }
    } catch(err){
        err.message = `bemVindo - ${err.message}`
        consoleErro(err, "BEM VINDO")
    }

}