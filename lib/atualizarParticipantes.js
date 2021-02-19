const db = require("../database/database")
const {msgs_texto} = require("./msgs")

module.exports = {
    atualizarParticipantes: async (client)=>{
            try{
                let grupos = await client.getAllGroups()
                for(const grupo of grupos){
                    let groupId = grupo.id
                    let participantesGrupo = await client.getGroupMembersId(groupId)
                    await db.atualizarParticipantes(groupId, participantesGrupo)
                }
                return msgs_texto.inicio.participantes_atualizados
            } catch(err) {
                throw new Error("Erro no atualizarParticipantes")
            }
    },
    adicionarParticipante: async(groupId, participante)=>{
        let participanteExiste = await db.participanteExiste(groupId,participante)
        if(!participanteExiste) await db.adicionarParticipante(groupId, participante)
    },
    removerParticipante: async(groupId, participante)=>{
        await db.removerParticipante(groupId, participante)
    },

}