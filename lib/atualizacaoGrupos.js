const db = require("../db-modulos/database")
const obterMensagensTexto = require("./msgs")
const socket = require("../lib-baileys/socket-funcoes")

module.exports = {
    atualizarGrupos: async (groupsInfo)=>{
            try{
                var msgs_texto = obterMensagensTexto()
                for(var grupo of groupsInfo){
                    let participantesGrupo = await socket.getGroupMembersIdFromMetadata(grupo)
                    let adminsGrupo = await socket.getGroupAdminsFromMetadata(grupo)
                    await db.atualizarGrupo(grupo.id, grupo.subject, grupo.desc, participantesGrupo, adminsGrupo, grupo.owner, grupo.announce)
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

    atualizacaoDadosGrupo: async(groupUpdate)=>{
        try{
            if(groupUpdate.subject != undefined) await db.atualizarNomeGrupo(groupUpdate.id, groupUpdate.subject)
            if(groupUpdate.announce != undefined) await db.atualizarRestritoGrupo(groupUpdate.id, groupUpdate.announce)
        } catch(err){
            err.message = `atualizacaoDadosGrupo - ${err.message}`
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