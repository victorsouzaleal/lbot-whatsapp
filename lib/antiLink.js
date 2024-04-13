//ATUALIZADO PARA O BAILEYS 05-04-2024
const db = require('./database')
const {consoleErro, criarTexto} = require('./util')
const {botInfo} = require("./bot")
const msgs_texto = require("./msgs")
const client = require("../lib-translate/baileys")
const {MessageTypes}  = require("../lib-translate/msgtypes")

module.exports = antiLink = async (c, messageTranslated) => {
    try{
        const {sender, chatId, isGroupMsg, body,  type, caption, id} = messageTranslated
        const botNumber = await client.getHostNumberFromBotJSON()

        if(isGroupMsg){
            const groupId = isGroupMsg ? chatId : ''
            const al_status = await db.obterGrupo(groupId)
            if(al_status.antilink){     
                const groupAdmins = isGroupMsg ? await client.getGroupAdminsFromDb(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false
                if (!isBotGroupAdmins) {
                    await db.alterarAntiLink(groupId,false)
                } else {
                    if(body != undefined){
                        let mensagem
                        if((type == MessageTypes.image || type == MessageTypes.video) && caption != undefined){
                            mensagem = caption
                        } else if (type == MessageTypes.text || type == MessageTypes.extendedText){
                            mensagem = body
                        } else {
                            return true
                        }
                        //LINKS AO TODO
                        const isUrl = mensagem.match(new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img))
                        //&& !groupAdmins.includes(sender)
                        if(isUrl){
                            await client.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.grupo.antilink.detectou, sender.replace("@s.whatsapp.net", "")), [sender])
                            await client.deleteMessage(c, id)
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