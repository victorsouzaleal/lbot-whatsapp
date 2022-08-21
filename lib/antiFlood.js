
const db = require('./database')
const msgs_texto = require("./msgs")
const {botInfo} = require("./bot")
const {criarTexto, consoleErro} = require("./util")

module.exports = antiFlood = async (client, message) => {
    try{
        const {chatId, sender, isGroupMsg, chat} = message
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        if(isGroupMsg){
            const afl_status = await db.obterGrupo(groupId)
            if(afl_status.antiflood){
                if (!isBotGroupAdmins || (await db.grupoInfoAntiFlood(groupId) == undefined)) {
                    await db.alterarAntiFlood(groupId,false)
                } else {
                    let flood = await db.addMsgFlood(groupId,sender.id)
                    if(flood) {
                        if(!groupAdmins.includes(sender.id)) {
                            await client.removeParticipant(groupId, sender.id).then(async ()=>{
                                await client.sendTextWithMentions(chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.id.replace("@c.us", ""), msgs_texto.grupo.antiflood.motivo, botInfo().nome))         
                            })
                            return false
                        }
                    } 
                }
            }
        }
        return true
    } catch(err){
        consoleErro(err.message, 'ANTI-FLOOD')
        return false
    }
}

