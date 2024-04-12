//ATUALIZADO PARA O BAILEYS 05-04-2024
const db = require("../lib/database")
const msgs_texto = require("./msgs")
const client = require("../lib-translate/baileys")
const {criarTexto, consoleErro} = require('./util')


module.exports = {
    participanteExiste : async(event)=>{
        let participanteExiste = await db.participanteExiste(event.id, event.participants[0])
        return participanteExiste
    },
    atualizarParticipantes: async (c, groupsInfo)=>{
            try{
                for(const grupo of groupsInfo){
                    let groupId = grupo.id
                    let participantesGrupo = await client.getGroupMembersId(c,groupId)
                    await db.atualizarParticipantes(groupId, participantesGrupo)
                }
                return msgs_texto.inicio.participantes_atualizados
            } catch(err) {
                err.message = `atualizarParticipantes - ${err.message}`
                throw err
            }
    },
    adicionarParticipante: async(groupId, participante)=>{
        try{
            let participanteExiste = await db.participanteExiste(groupId,participante)
            if(!participanteExiste) await db.adicionarParticipante(groupId, participante)
        } catch(err){
            err.message = `adicionarParticipante - ${err.message}`
            throw err
        }
    },
    removerParticipante: async(groupId, participante)=>{
        try{
            await db.removerParticipante(groupId, participante)
        } catch(err){
            err.message = `removerrParticipante - ${err.message}`
            throw err
        }
    },

}