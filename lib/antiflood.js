const fs = require('fs-extra')

module.exports = antiflood_grupo = async (client, message) => {
    const { id, from, sender, isGroupMsg, chat} = message
    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

    if(isGroupMsg){
        const antiflood = JSON.parse(fs.readFileSync('./lib/antiflood.json'))
        const antiflood_g = JSON.parse(fs.readFileSync('./lib/antiflood.json'))
        const isAntiFlood = antiflood_g.grupos.includes(chat.id)
        let cont_flood = 0
        let max_count = 10
        if(isAntiFlood){
            antiflood.dados.forEach(dado=>{
                if(dado.groupId == chat.id){
                    if(dado.msgs.length < dado.max) {
                        dado.msgs.push(sender.id)
                    } else {
                        dado.msgs.shift()
                        dado.msgs.push(sender.id)
                    }
                    fs.writeFileSync('./lib/antiflood.json', JSON.stringify(antiflood))
                    max_count = dado.max
                    dado.msgs.forEach(msg =>{
                        if(msg == sender.id) cont_flood++
                    })
                }
            })
            if(cont_flood == max_count) {
                if(!groupAdmins.includes(sender.id)) {
                    if (!isBotGroupAdmins){
                        client.reply(from, msgs_texto.permissao.bot_admin, id)
                    } else {
                        await client.removeParticipant(groupId, sender.id)
                        await client.sendTextWithMentions(from, `BANIDO @${sender.id.replace(/@c.us/g, '')}- ANTI FLOOD`)
                    }
                }
            } 
        }
    }
}