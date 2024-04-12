//ATUALIZADO PARA O BAILEYS 05-04-2024
const db = require("./database")
const msgs_texto = require("./msgs")
const {criarTexto, consoleErro} = require('./util')
const {botInfo} = require("./bot")
const client = require("../lib-translate/baileys")

module.exports = {
    verificacaoListaNegraGeral : async(c, groupsInfo)=>{
        try {
            for(var grupo of groupsInfo){
                var botNumber = await client.getHostNumber(c), groupAdmins = await client.getGroupAdmins(c,grupo.id),  isBotGroupAdmins = groupAdmins.includes(botNumber)
                if(isBotGroupAdmins){
                    let groupId = grupo.id, participantesGrupo = await client.getGroupMembersId(c, groupId), lista_negra = await db.obterListaNegra(groupId), usuarios_listados = []
                    for(let participante of participantesGrupo){
                        if(lista_negra.includes(participante)) usuarios_listados.push(participante)
                    }
                    for(let usuario of usuarios_listados){
                        await client.removeParticipant(c, groupId, usuario)
                        await client.sendTextWithMentions(c, groupId, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo().nome), [usuario])
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
            const botNumber = await client.getHostNumber(c), groupAdmins = await client.getGroupAdmins(c, event.id),  isBotGroupAdmins = groupAdmins.includes(botNumber)
            if(isBotGroupAdmins){
                let lista_negra = await db.obterListaNegra(event.id)
                if(lista_negra.includes(event.participants[0])){
                    await client.removeParticipant(c, event.id, event.participants[0])
                    await client.sendTextWithMentions(c, event.id, criarTexto(msgs_texto.geral.resposta_ban, event.participants[0].replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo().nome), [event.participants[0]])
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