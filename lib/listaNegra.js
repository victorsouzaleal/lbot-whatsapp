const db = require("../db-modules/database")
const msgs_texto = require("./msgs")
const {criarTexto, consoleErro} = require('./util')
const {botInfo} = require("../db-modules/bot")
const socket = require("../lib-translate/socket-functions")
const socketdb = require("../lib-translate/socket-db-functions")

module.exports = {
    verificacaoListaNegraGeral : async(c, groupsInfo)=>{
        try {
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
    },
    verificarUsuarioListaNegra: async(c, event)=>{
        try{
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
}