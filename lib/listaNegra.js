const db = require("./database")
const msgs_texto = require("./msgs")
const {criarTexto} = require('./util')
const {botInfo} = require("./bot")

module.exports = {
    verificacaoListaNegraGeral : async(client)=>{
        try {
            let grupos = await client.getAllGroups()
            for(const grupo of grupos){
                const botNumber = await client.getHostNumber(), groupAdmins = await client.getGroupAdmins(grupo.id),  isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
                if(isBotGroupAdmins){
                    let groupId = grupo.id, participantesGrupo = await client.getGroupMembersId(groupId), lista_negra = await db.obterListaNegra(groupId), usuarios_listados = []
                    for(let participante of participantesGrupo){
                        if(lista_negra.includes(participante)) usuarios_listados.push(participante)
                    }
        
                    for(let usuario of usuarios_listados){
                        await client.removeParticipant(groupId, usuario)
                        await client.sendTextWithMentions(groupId, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@c.us", ""), msgs_texto.grupo.listanegra.motivo, botInfo().nome))
                    }
                }
            }
            return msgs_texto.inicio.lista_negra
        } catch {
            throw new Error("Erro no verificacaoListaNegraGeral")
        }
    },
    verificarUsuarioListaNegra: async(client, event)=>{
        const botNumber = await client.getHostNumber(), groupAdmins = await client.getGroupAdmins(event.chat),  isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
        let estaListado = false
        if(isBotGroupAdmins){
            let lista_negra = await db.obterListaNegra(event.chat)
            if(lista_negra.includes(event.who)){
                await client.removeParticipant(event.chat, event.who)
                await client.sendTextWithMentions(event.chat, criarTexto(msgs_texto.geral.resposta_ban, event.who.replace("@c.us", ""), msgs_texto.grupo.listanegra.motivo, botInfo().nome))
                estaListado = true
            }
        }
        return estaListado
    }
}