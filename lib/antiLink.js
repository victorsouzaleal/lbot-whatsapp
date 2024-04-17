import * as db from '../db-modulos/database.js'
import {consoleErro, criarTexto} from './util.js'
import {botInfo} from '../db-modulos/bot.js'
import { obterMensagensTexto } from './msgs.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'
import {MessageTypes} from '../lib-baileys/mensagem.js'

export const antiLink = async (c, messageTranslated) => {
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