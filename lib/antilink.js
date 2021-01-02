const fs = require('fs-extra')
const msgs_texto = require('./msgs')

module.exports = anti_link = async (client, message) => {
        const { id, from,sender, isGroupMsg, body, chat } = message
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const antilink_groups = JSON.parse(fs.readFileSync('./lib/antilink.json'))
        const isAntiLink = antilink_groups.includes(groupId)
        if(isAntiLink){
            const botNumber = await client.getHostNumber()
            const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
            const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
            if (!isBotGroupAdmins) {
                antilink_groups.splice(antilink_groups.indexOf(groupId),1)
                fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink_groups))
            } else {
                let is_GroupURL = false
                if(body != undefined){
                    if(((body.match(/(https:\/\/chat.whatsapp.com)/gi) != null) || (body.match(/(http:\/\/chat.whatsapp.com)/gi) != null))) is_GroupURL = true 
                    if(is_GroupURL && isGroupMsg && (!groupAdmins.includes(sender.id))) {
                        await client.removeParticipant(groupId, sender.id)
                        return
                    } 
                }
            }
        }     
}