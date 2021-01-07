const fs = require('fs-extra')
const msgs_texto = require('./msgs')

module.exports = antiLink = async (client, message) => {
        const { id, from,sender, isGroupMsg, body, chat } = message
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const al_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
        const isAntiLink = al_recursos.antilink.includes(groupId)
        if(isAntiLink){
            const botNumber = await client.getHostNumber()
            const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
            const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
            const inviteLink = await client.getGroupInviteLink(groupId)
            if (!isBotGroupAdmins) {
                al_recursos.antilink.splice(al_recursos.antilink.indexOf(groupId),1)
                fs.writeFileSync('./lib/recursos.json', JSON.stringify(al_recursos))
            } else {
                if(body != undefined){
                    let banirURL = ((body.match(/(https:\/\/chat.whatsapp.com)/gi) != null) || (body.match(/(http:\/\/chat.whatsapp.com)/gi) != null)) ? true : false
                    if(banirURL) banirURL = body.indexOf(inviteLink) === -1
                    if(banirURL && isGroupMsg && (!groupAdmins.includes(sender.id))) {
                        await client.removeParticipant(groupId, sender.id)
                        return
                    } 
                }
            }
        }     
}