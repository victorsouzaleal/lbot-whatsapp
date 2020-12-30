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
        if (!isBotGroupAdmins) return client.reply(from,"[ANTI-LINK] "+msgs_texto.permissao.bot_admin, id)
        if((body != undefined) && (body.match(/(https:\/\/chat.whatsapp.com)/gi) != null) && isGroupMsg && (!groupAdmins.includes(sender.id))) {
            await client.removeParticipant(groupId, sender.id)
            return 
        } 
    }
}