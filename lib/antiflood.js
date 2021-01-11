const fs = require('fs-extra')

module.exports = antiFlood = async (client, message) => {
    const { id, from, sender, isGroupMsg, chat} = message
    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

    if(isGroupMsg){
        const afl_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
        const isAntiFlood = afl_recursos.antiflood.grupos.includes(chat.id)
        let cont_flood = 0
        let max_count = 10
        if(isAntiFlood){
            const dado_index = afl_recursos.antiflood.dados.findIndex(dado => dado.groupId = groupId)
  
            if(afl_recursos.antiflood.dados[dado_index].msgs.length < afl_recursos.antiflood.dados[dado_index].max){
                afl_recursos.antiflood.dados[dado_index].msgs.push(sender.id)
            } else {
                afl_recursos.antiflood.dados[dado_index].msgs.shift()
                afl_recursos.antiflood.dados[dado_index].msgs.push(sender.id)
            }
            fs.writeFileSync('./lib/recursos.json', JSON.stringify(afl_recursos))
            max_count = afl_recursos.antiflood.dados[dado_index].max
            afl_recursos.antiflood.dados[dado_index].msgs.forEach(msg =>{
                if(msg == sender.id) cont_flood++
            })

            if(cont_flood == max_count) {
                if(!groupAdmins.includes(sender.id)) {
                    if (!isBotGroupAdmins){
                        afl_recursos.antiflood.grupos.splice(afl_recursos.antiflood.grupos.indexOf(groupId),1)
                        afl_recursos.antiflood.dados.splice(afl_recursos.antiflood.dados.findIndex(dado => dado.groupId == groupId),1)
                        fs.writeFileSync('./lib/recursos.json', JSON.stringify(afl_recursos))
                    } else {
                        await client.removeParticipant(groupId, sender.id).then(()=>{
                            client.sendTextWithMentions(from, `BANIDO @${sender.id.replace(/@c.us/g, '')} - ANTI FLOOD`)
                            afl_recursos.antiflood.dados[dado_index].msgs = []
                            fs.writeFileSync('./lib/recursos.json', JSON.stringify(afl_recursos))
                            return
                        })
                    }
                }
            } 
        }
    }
}