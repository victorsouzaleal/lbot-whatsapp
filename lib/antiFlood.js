const db = require('./database')
const msgs_texto = require("./msgs")
const {botInfo} = require("./bot")
const {criarTexto, consoleErro} = require("./util")
const socket = require("../lib-translate/socket-functions")
const {MessageTypes}  = require("../lib-translate/message")

module.exports = antiFlood = async (c, messageTranslated) => {
    try{
        const {chatId, sender, isGroupMsg, chat} = messageTranslated
        const botNumber = await socket.getHostNumberFromBotJSON()
        const groupId = isGroupMsg ? chatId : ''
        const groupAdmins = isGroupMsg ? await socket.getGroupAdminsFromDb(groupId) : ''
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
                            await socket.removeParticipant(c, groupId, sender)
                            await socket.sendTextWithMentions(c,chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, botInfo().nome), [sender])
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

