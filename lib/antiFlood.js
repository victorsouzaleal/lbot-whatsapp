
const db = require('../lib/database')
const msgs_texto = require("./msgs")
const color = require('./color')
const path = require("path")
const {makeText} = require("./util")

module.exports = antiFlood = async (client, message) => {
    try{
        const {from, sender, isGroupMsg, chat} = message
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        if(isGroupMsg){
            const afl_status = await db.obterGrupo(groupId)
            if(afl_status.antiflood){
                if (!isBotGroupAdmins || (db.grupoInfoAntiFlood(groupId) == undefined)) return db.alterarAntiFlood(groupId,false)
                let flood = await db.addMsgFlood(groupId,sender.id)
                if(flood) {
                    if(!groupAdmins.includes(sender.id)) {
                        client.removeParticipant(groupId, sender.id).then(()=>{
                            client.sendTextWithMentions(from, makeText(msgs_texto.grupo.antiflood.ban_resposta, sender.id.replace(/@c.us/g, '')))
                        })
                    }
                } 
            }
        }
    } catch(err){
        console.error(color("[ERRO]","red"), err)
    }
}

