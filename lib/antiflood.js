const db = require('../database/database')

module.exports = antiFlood = async (client, message) => {
    const { id, from, sender, isGroupMsg, chat} = message
    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

    if(isGroupMsg){
        const afl_status = await db.obterGrupo(groupId)
        if(afl_status.antiflood.status){
            let flood = await db.addMsgFlood(groupId,sender.id)
            if(flood) {
                if(!groupAdmins.includes(sender.id)) {
                    if (!isBotGroupAdmins){
                        db.alterarAntiFlood(groupId,false)
                    } else {
                        await client.removeParticipant(groupId, sender.id).then(async ()=>{
                            await client.sendTextWithMentions(from, `BANIDO @${sender.id.replace(/@c.us/g, '')} - ANTI FLOOD`)
                            await db.resetMsgFlood(groupId)
                        })
                    }
                }
            } 
        }
    }
}