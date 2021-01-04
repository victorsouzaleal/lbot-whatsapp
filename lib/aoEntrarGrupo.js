const fs = require('fs-extra')

module.exports = aoEntrarGrupo = async (client, event) => {
    try {
        if (event.action == 'add') {
            const bv_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            const isWelcome = bv_recursos.bemvindo.includes(event.chat)
            const af_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            const isAntifake = af_recursos.antifake.includes(event.chat)
            const gChat = await client.getChatById(event.chat) //Group info
            const pChat = await client.getContact(event.who) // Person info
            const { contact, groupMetadata, name } = gChat
            if(isAntifake){
                const botNumber = await client.getHostNumber()
                const groupAdmins = await client.getGroupAdmins(event.chat)
                const isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
                if(!isBotGroupAdmins){
                    af_recursos.antifake.splice(af_recursos.antifake.indexOf(event.chat), 1)
                    fs.writeFileSync('./lib/recursos.json', JSON.stringify(af_recursos))
                } else {
                    if(pChat.id.slice(0,2) != '55') {
                        client.removeParticipant(event.chat, pChat.id)
                        return
                    }
                }
            } 
            if(isWelcome){
                const text_welcome = `[BOT] 👋 Olá @${pChat.id.replace(/@c.us/g, '')}\n - Seja bem vindo(a) ao grupo *${name}*\n\n Digite *!ajuda* para ver os comandos.`
                await client.sendTextWithMentions(event.chat,text_welcome)
            }
        }
    } catch (err) {
        console.log(err)
    }
}
