const db = require("../database/database")
const msgs_texto = require("./msgs")

module.exports = {
    verificacaoListaNegraGeral : async(client)=>{
        try {
            let grupos = await client.getAllGroups()
            for(const grupo of grupos){
                let groupId = grupo.id, participantesGrupo = await client.getGroupMembersId(groupId), lista_negra = await db.obterListaNegra(groupId), usuarios_listados = []
                for(let participante of participantesGrupo){
                    if(lista_negra.includes(participante)) usuarios_listados.push(participante)
                }
    
                for(let usuario of usuarios_listados){
                    client.removeParticipant(groupId, usuario)
                }
            }
            return msgs_texto.inicio.lista_negra
        } catch {
            throw new Error("Erro no verificacaoListaNegraGeral")
        }
    },
    verificarUsuarioListaNegra: async(client, event)=>{
        let lista_negra = await db.obterListaNegra(event.chat), estaListado = false
        if(lista_negra.includes(event.who)){
            client.removeParticipant(event.chat, event.who)
            estaListado = true
        }
        return estaListado
    }
}