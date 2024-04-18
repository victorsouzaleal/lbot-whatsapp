import * as db from '../db-modulos/database.js'
import {consoleErro, criarTexto} from './util.js'
import { obterMensagensTexto } from './msgs.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'


export const antiLink = async (c, messageTranslated) => {
    try{
        const {sender, chatId, isGroupMsg, body, caption, id} = messageTranslated
        if(!isGroupMsg) return true
        const botNumber = await socketdb.getHostNumberFromBotJSON()
        const msgs_texto = obterMensagensTexto()
        const groupId = chatId
        const al_status = await socketdb.getGroupInfoFromDb(groupId)
        if(!al_status.antilink) return true

        const groupAdmins = await socketdb.getGroupAdminsFromDb(groupId)
        const isBotGroupAdmins = groupAdmins.includes(botNumber) 
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

        return true   
    } catch(err){
        err.message = `antiLink - ${err.message}`
        consoleErro(err, "ANTI-LINK")
        return true
    }
        
}