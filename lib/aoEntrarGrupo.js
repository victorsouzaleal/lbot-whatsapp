const db = require('../database/database')

module.exports = aoEntrarGrupo = async (client, event) => {
    try {
        if (event.action == 'add') {
            const g_info = await db.obterGrupo(event.chat)
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
            if(g_info.bemvindo){
                const text_welcome = `[BOT] 👋 Olá @${pChat.id.replace(/@c.us/g, '')}\n - Seja bem vindo(a) ao grupo *${name}*\n\n Digite *!ajuda* para ver os comandos.`
                await client.sendTextWithMentions(event.chat,text_welcome)
            }
        }
    } catch (err) {
        console.log(err)
    }
}
