//ATUALIZADO PARA O BAILEYS 05-04-2024
const db = require("./database")
const msgs_texto = require("./msgs")
const client = require("../lib-translate/baileys")
const {criarTexto, consoleErro} = require('./util')


module.exports = {
    atualizarGrupos: async (groupsInfo)=>{
            try{
                for(var grupo of groupsInfo){
                    let participantesGrupo = await client.getGroupMembersIdFromMetadata(grupo)
                    let adminsGrupo = await client.getGroupAdminsFromMetadata(grupo)
                    await db.atualizarGrupo(grupo.id, grupo.subject, grupo.desc, participantesGrupo, adminsGrupo)
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

    adicionarAdmin: async(groupId, usuarioId)=>{
        try{
            await db.adicionarAdmin(groupId, usuarioId)
        } catch(err){
            err.message = `adicionarAdmin - ${err.message}`
            throw err
        }
    },
    
    removerParticipante: async(groupId, participante)=>{
        try{
            let usuarioAdministrador = await db.verificarAdmin(groupId, participante)
            if (usuarioAdministrador) await db.removerAdmin(groupId, participante) 
            await db.removerParticipante(groupId, participante)
        } catch(err){
            err.message = `removerParticipante - ${err.message}`
            throw err
        }
    },

    removerAdmin: async(groupId, usuarioId)=>{
        try{
            await db.removerAdmin(groupId, usuarioId)
        } catch(err){
            err.message = `removerAdmin - ${err.message}`
            throw err
        }
    },

}