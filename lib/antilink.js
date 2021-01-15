const db = require('../database/database')

module.exports = antiLink = async (client, message) => {
        const {sender, isGroupMsg, body, chat } = message
        if(isGroupMsg){
            const groupId = isGroupMsg ? chat.groupMetadata.id : ''
            const al_status = await db.obterGrupo(groupId)
            if(al_status.antilink){
                const botNumber = await client.getHostNumber()
                const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
                const inviteLink = await client.getGroupInviteLink(groupId)
                if (!isBotGroupAdmins) {
                    await db.alterarAntiLink(groupId,false)
                } else {
                    if(body != undefined){
                        let banirURL = (body.match(/https?:\/\/chat\.whatsapp\.com/) != null)  ? true : false
                        if(banirURL) banirURL = body.indexOf(inviteLink) === -1
                        if(banirURL && isGroupMsg && (!groupAdmins.includes(sender.id))) {
                            await client.removeParticipant(groupId, sender.id)
                            return
                        } 
                    }
                }
            }   
        }
}