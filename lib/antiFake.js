const db = require('./database')
const {botInfo} = require("./bot")
const {criarTexto, consoleErro} = require("./util")
const msgs_texto = require('./msgs')

module.exports = antiFake = async (client,event,g_info) =>{
    try{
        if(g_info.antifake.status){
            const pChat = await client.getContact(event.who), botNumber = await client.getHostNumber(),  groupAdmins = await client.getGroupAdmins(event.chat), isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
            if(!isBotGroupAdmins){
                await db.alterarAntiFake(event.chat,false)
            } else {
                for(ddi of g_info.antifake.ddi_liberados){
                    if(pChat.id.startsWith(ddi)) return true
                }
                await client.removeParticipant(event.chat, pChat.id)
                await client.sendTextWithMentions(event.chat, criarTexto(msgs_texto.geral.resposta_ban, pChat.id.replace("@c.us", ""), msgs_texto.grupo.antifake.motivo, botInfo().nome))
                return false
            }
        }
        return true 
    } catch(err){
        consoleErro(err.message, 'ANTI-FAKE')
        return false
    }
}