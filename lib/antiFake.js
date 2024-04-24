import * as gruposdb from '../database/grupos.js'
import {criarTexto, consoleErro} from './util.js'
import { obterMensagensTexto } from './msgs.js'
import * as socket from '../baileys/socket-funcoes.js'
import * as bot from '../controle/botControle.js'

export const antiFake = async (c,event,g_info) =>{
    try{
        if(g_info.antifake.status){
            let msgs_texto = await obterMensagensTexto()
            let botInfo = await bot.obterInformacoesBot()
            let participantId = event.participants[0], botNumber = botInfo.numero_dono,  groupAdmins = g_info.admins, isBotGroupAdmins = groupAdmins.includes(botNumber)
            if(!isBotGroupAdmins){
                await gruposdb.alterarAntiFake(event.id,false)
            } else {
                for(ddi of g_info.antifake.ddi_liberados){
                    if(participantId.startsWith(ddi)) return true
                }
                await socket.sendTextWithMentions(c, event.id, criarTexto(msgs_texto.geral.resposta_ban, participantId.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antifake.motivo, botInfo.nome), [participantId])
                await socket.removeParticipant(c, event.id, participantId)
                return false
            }
        }
        return true 
    } catch(err){
        err.message = `antiFake - ${err.message}`
        consoleErro(err, "ANTI-FAKE")
        return true
    }
}