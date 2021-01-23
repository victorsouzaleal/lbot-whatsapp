const db = require('../database/database')

module.exports = aoEntrarGrupo = async (client, event) => {
    try {
        const g_info = await db.obterGrupo(event.chat)
        if (event.action == 'add') {
            const gChat = await client.getChatById(event.chat) //Group info
            const pChat = await client.getContact(event.who) // Person info
            const {name } = gChat
            if(g_info.antifake){
                const botNumber = await client.getHostNumber()
                const groupAdmins = await client.getGroupAdmins(event.chat)
                const isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
                if(!isBotGroupAdmins){
                    db.alterarAntiFake(event.chat,false)
                } else {
                    if(pChat.id.slice(0,2) != '55') {
                        client.removeParticipant(event.chat, pChat.id)
                        return
                    }
                }
            } 
            if(g_info.bemvindo.status){
                let msg_bv = `👋 Olá @${pChat.id.replace(/@c.us/g, '')}\nSeja bem vindo(a) ao grupo *${name}*\n\n`
                if(g_info.bemvindo.msg != "") msg_bv += g_info.bemvindo.msg+"\n\n"
                msg_bv += `Digite *!ajuda* para ver os comandos.`
                await client.sendTextWithMentions(event.chat,msg_bv)
            }
            if(g_info.contador) await db.registrarContagem(event.chat,event.who)
        } else if(event.action == "remove"){
            if(g_info.contador) await db.removerContagem(event.chat,event.who)
        }
    } catch (err) {
        console.log(err)
    }
}
