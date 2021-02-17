const db = require("../database/database")
const {msgs_texto} = require("./msgs")

module.exports = {
    atualizarParticipantesInicio: async (client)=>{
            try{
                let grupos = await client.getAllGroups()
                for(const grupo of grupos){
                    let groupId = grupo.id
                    let participantesGrupo = await client.getGroupMembersId(groupId), novosParticipantes = []

                    //VERIFICA SE HOUVE NOVOS PARTICIPANTES ENQUANTO O BOT ESTAVA OFF E ATUALIZA OS PARTICIPANTES
                    for(let participante of participantesGrupo){
                        let participanteExiste = await db.participanteExiste(groupId,participante)
                        if(!participanteExiste) novosParticipantes.push(participante)
                    }

                    await db.atualizarParticipantesAdd(groupId, novosParticipantes)
            
                    //VERIFICA SE SAIU PARTICIPANTES ENQUANTO O BOT ESTAVA OFF E ATUALIZA OS PARTICIPANTES
                    let participantesDb = await db.obterParticipantesGrupo(groupId), removerParticipantes = []
                    for(let participante of participantesDb){
                        if(!participantesGrupo.includes(participante)) {
                            removerParticipantes.push(participante)
                        }
                    }
                    await db.atualizarParticipantesRemover(groupId, removerParticipantes)
                }
                return msgs_texto.inicio.participantes_atualizados
            } catch(err) {
                throw new Error("Erro no atualizarParticipantesInicio")
            }
    },
    atualizarParticipantesAdd: async(groupId, participante)=>{
        let participanteExiste = await db.participanteExiste(groupId,participante)
        if(!participanteExiste) await db.atualizarParticipantesAdd(groupId, [participante])
    },
    atualizarParticipantesRemover: async(groupId, participante)=>{
        await db.atualizarParticipantesRemover(groupId,[participante])
    },

}