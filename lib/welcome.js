const fs = require('fs-extra')

module.exports = welcome = async (client, event) => {
    try {
        if (event.action == 'add') {
            const welcome_groups = JSON.parse(fs.readFileSync('./lib/welcome.json'))
            const isWelcome = welcome_groups.includes(event.chat)
            const antifake_groups = JSON.parse(fs.readFileSync('./lib/antifake.json'))
            const isAntifake = antifake_groups.includes(event.chat)
            const gChat = await client.getChatById(event.chat) //Group info
            const pChat = await client.getContact(event.who) // Person info
            const { contact, groupMetadata, name } = gChat
            if(isAntifake){
                const botNumber = await client.getHostNumber()
                const groupAdmins = await client.getGroupAdmins(event.chat)
                const isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
                if(!isBotGroupAdmins){
                    antifake_groups.splice(antifake_groups.indexOf(event.chat), 1)
                    fs.writeFileSync('./lib/antifake.json', JSON.stringify(antifake_groups))
                } else {
                    if(pChat.id.slice(0,2) != '55') {
                        client.removeParticipant(event.chat, pChat.id)
                        return
                    }
                }
            } 
            if(isWelcome){
                console.log('Bem vindo')
                const text_welcome = `[BOT] 👋 Olá @${pChat.id.replace(/@c.us/g, '')}\n - Seja bem vindo(a) ao grupo *${name}*\n\n Digite *!ajuda* para ver os comandos.`
                await client.sendTextWithMentions(event.chat,text_welcome)
            }
        }
    } catch (err) {
        console.log(err)
    }
}
