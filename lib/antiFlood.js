//ATUALIZADO PARA O BAILEYS 05-04-2024
const db = require('./database')
const msgs_texto = require("./msgs")
const {botInfo} = require("./bot")
const {criarTexto, consoleErro} = require("./util")
const client = require("../lib-translate/baileys")
const {MessageTypes}  = require("../lib-translate/msgtypes")

module.exports = antiFlood = async (c, m, messageTranslated) => {
    try{
        const {chatId, sender, isGroupMsg, chat} = messageTranslated
        const botNumber = await client.getHostNumber(c)
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(c,groupId) : ''
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
        if(isGroupMsg){
            const afl_status = await db.obterGrupo(groupId)
            if(afl_status.antiflood){
                if (!isBotGroupAdmins || (await db.grupoInfoAntiFlood(groupId) == undefined)) {
                    await db.alterarAntiFlood(groupId,false)
                } else {
                    let flood = await db.addMsgFlood(groupId,sender)
                    if(flood) {
                        if(!groupAdmins.includes(sender)) {
                            await client.removeParticipant(c, groupId, sender)
                            await client.sendTextWithMention(c,chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, botInfo().nome), [sender])
                            return false
                        }
                    } 
                }
            }
        }
        return true
    } catch(err){
        err.message = `antiFlood - ${err.message}`
        consoleErro(err, "ANTI-FLOOD")
        return true
    }
}

