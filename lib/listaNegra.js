import * as db from '../db-modulos/database.js'
import {obterMensagensTexto} from './msgs.js'
import {criarTexto, consoleErro} from './util.js'
import {botInfo} from '../db-modulos/bot.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'


export const verificacaoListaNegraGeral = async(c, groupsInfo)=>{
    try {
        var msgs_texto = obterMensagensTexto()
        for(var grupo of groupsInfo){
            var botNumber = await socketdb.getHostNumberFromBotJSON(), groupAdmins = await socket.getGroupAdminsFromMetadata(grupo),  isBotGroupAdmins = groupAdmins.includes(botNumber)
            if(isBotGroupAdmins){
                let groupId = grupo.id, participantesGrupo = await socket.getGroupMembersIdFromMetadata(grupo), lista_negra = await db.obterListaNegra(groupId), usuarios_listados = []
                for(let participante of participantesGrupo){
                    if(lista_negra.includes(participante)) usuarios_listados.push(participante)
                }
                for(let usuario of usuarios_listados){
                    await socket.removeParticipant(c, groupId, usuario)
                    await socket.sendTextWithMentions(c, groupId, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo().nome), [usuario])
                }
            }
        }
        return msgs_texto.inicio.lista_negra
    } catch (err) {
        err.message = `verificacaoListaNegraGeral - ${err.message}`
        throw err
    }
}

export const verificarUsuarioListaNegra = async(c, event)=>{
    try{
        var msgs_texto = obterMensagensTexto()
        const botNumber = await socketdb.getHostNumberFromBotJSON(), groupAdmins = await socketdb.getGroupAdminsFromDb(event.id),  isBotGroupAdmins = groupAdmins.includes(botNumber)
        if(isBotGroupAdmins){
            let lista_negra = await db.obterListaNegra(event.id)
            if(lista_negra.includes(event.participants[0])){
                await socket.removeParticipant(c, event.id, event.participants[0])
                await socket.sendTextWithMentions(c, event.id, criarTexto(msgs_texto.geral.resposta_ban, event.participants[0].replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo().nome), [event.participants[0]])
                return false
            }
        }
        return true
    } catch(err){
        err.message = `verificacaoUsuarioListaNegra - ${err.message}`
        consoleErro(err, "LISTA NEGRA")
        return true
    }
}
