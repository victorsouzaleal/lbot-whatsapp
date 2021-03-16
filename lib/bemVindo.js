const msgs_texto = require("./msgs")
const {criarTexto} = require("./util")

module.exports = bemVindo = async(client,event,g_info)=>{
    if(g_info.bemvindo.status){
        const gChat = await client.getChatById(event.chat)
        const pChat = await client.getContact(event.who)  
        const {name } = gChat
        let msg_customizada = (g_info.bemvindo.msg != "") ? g_info.bemvindo.msg+"\n\n" : "" 
        let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, pChat.id.replace(/@c.us/g, ''), name, msg_customizada)
        await client.sendTextWithMentions(event.chat,mensagem_bemvindo)
    }
}