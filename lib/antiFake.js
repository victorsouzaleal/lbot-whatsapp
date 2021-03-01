const db = require('../database/database')

module.exports = antiFake = async (client,event,g_info) =>{
    if(g_info.antifake.status){
        const pChat = await client.getContact(event.who), botNumber = await client.getHostNumber(),  groupAdmins = await client.getGroupAdmins(event.chat), isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
        let liberado = false
        if(!isBotGroupAdmins){
            liberado = true
            await db.alterarAntiFake(event.chat,false)
        } else {
            for(ddi of g_info.antifake.ddi_liberados){
                if(pChat.id.startsWith(ddi)) liberado = true
            }
            if(!liberado) client.removeParticipant(event.chat, pChat.id)
        }
        return liberado
    }
    return true 
}