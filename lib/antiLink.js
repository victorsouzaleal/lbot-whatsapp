const db = require('../db-modulos/database')
const {consoleErro, criarTexto} = require('./util')
const {botInfo} = require("../db-modulos/bot")
const obterMensagensTexto = require("./msgs")
const socket = require("../lib-baileys/socket-funcoes")
const socketdb = require("../lib-baileys/socket-db-funcoes")
const {MessageTypes}  = require("../lib-baileys/mensagem")

module.exports = antiLink = async (c, messageTranslated) => {
    try{
        const {sender, chatId, isGroupMsg, body,  type, caption, id} = messageTranslated
        const botNumber = await socketdb.getHostNumberFromBotJSON()
        const msgs_texto = obterMensagensTexto()

        if(isGroupMsg){
            const groupId = isGroupMsg ? chatId : ''
            const al_status = await socketdb.getGroupInfoFromDb(groupId)
            if(al_status.antilink){     
                const groupAdmins = isGroupMsg ? await socketdb.getGroupAdminsFromDb(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
                if (!isBotGroupAdmins) {
                    await db.alterarAntiLink(groupId,false)
                } else {
                    let mensagem = body || caption
                    if(mensagem != undefined){
                        const isUrl = mensagem.match(new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img))
                        if(isUrl && !groupAdmins.includes(sender)){
                            await socket.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.grupo.antilink.detectou, sender.replace("@s.whatsapp.net", "")), [sender])
                            await socket.deleteMessage(c, id)
                            return false
                        }
                    }
                }
            }
        }
        return true   
    } catch(err){
        err.message = `antiLink - ${err.message}`
        consoleErro(err, "ANTI-LINK")
        return true
    }
        
}