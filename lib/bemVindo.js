const msgs_texto = require("./msgs")
const {criarTexto} = require("./util")

module.exports = bemVindo = async(client,event,g_info)=>{
    if(g_info.bemvindo.status){
        const {id} = await client.getContact(event.who)
        const {title} = await client.getGroupInfo(event.chat)
        let msg_customizada = (g_info.bemvindo.msg != "") ? g_info.bemvindo.msg+"\n\n" : "" 
        let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, id.replace("@c.us", ""), title, msg_customizada)
        await client.sendTextWithMentions(event.chat, mensagem_bemvindo)
    }
}