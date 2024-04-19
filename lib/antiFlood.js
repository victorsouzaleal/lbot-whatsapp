import * as db from '../db-modulos/database.js'
import {criarTexto, consoleErro} from './util.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'


export const antiFlood = async (c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {groupId, groupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
        const {chatId, sender, isGroupMsg} = mensagemInfoCompleta.mensagem
        if(!isGroupMsg) return true
        const afl_status = await socketdb.getGroupInfoFromDb(groupId)
        if(!afl_status.antiflood) return true

        if (!isBotGroupAdmins || (await db.grupoInfoAntiFlood(groupId) == undefined)) {
            await db.alterarAntiFlood(groupId,false)
        } else {
            let flood = await db.addMsgFlood(groupId,sender)
            if(flood) {
                if(!groupAdmins.includes(sender)) {
                    await socket.removeParticipant(c, groupId, sender)
                    await socket.sendTextWithMentions(c,chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, process.env.NOME_BOT), [sender])
                    return false
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

