import * as gruposdb from '../database/grupos.js'
import { obterMensagensTexto } from './msgs.js'
import * as socket from '../baileys/socket-funcoes.js'


export const atualizarGrupos = async (groupsInfo)=>{
        try{
            var msgs_texto = await obterMensagensTexto()
            for(var grupo of groupsInfo){
                let participantesGrupo = await socket.getGroupMembersIdFromMetadata(grupo)
                let adminsGrupo = await socket.getGroupAdminsFromMetadata(grupo)
                await gruposdb.atualizarGrupo(grupo.id, grupo.subject, grupo.desc, participantesGrupo, adminsGrupo, grupo.owner, grupo.announce)
            }
            return msgs_texto.inicio.participantes_atualizados
        } catch(err) {
            err.message = `atualizarParticipantes - ${err.message}`
            throw err
        }
}

export const adicionarParticipante = async(groupId, participante)=>{
    try{
        let participanteExiste = await gruposdb.participanteExiste(groupId,participante)
        if(!participanteExiste) await gruposdb.adicionarParticipante(groupId, participante)
    } catch(err){
        err.message = `adicionarParticipante - ${err.message}`
        throw err
    }
}

export const atualizarDadosGrupo = async(groupUpdate)=>{
    try{
        if(groupUpdate.subject != undefined) await gruposdb.atualizarNomeGrupo(groupUpdate.id, groupUpdate.subject)
        if(groupUpdate.announce != undefined) await gruposdb.atualizarRestritoGrupo(groupUpdate.id, groupUpdate.announce)
    } catch(err){
        err.message = `atualizarDadosGrupo - ${err.message}`
        throw err
    }

}

export const adicionarAdmin = async(groupId, usuarioId)=>{
    try{
        await gruposdb.adicionarAdmin(groupId, usuarioId)
    } catch(err){
        err.message = `adicionarAdmin - ${err.message}`
        throw err
    }
}

export const removerParticipante = async(groupId, participante)=>{
    try{
        let usuarioAdministrador = await gruposdb.verificarAdmin(groupId, participante)
        if (usuarioAdministrador) await gruposdb.removerAdmin(groupId, participante) 
        await gruposdb.removerParticipante(groupId, participante)
    } catch(err){
        err.message = `removerParticipante - ${err.message}`
        throw err
    }
}

export const removerAdmin = async(groupId, usuarioId)=>{
    try{
        await gruposdb.removerAdmin(groupId, usuarioId)
    } catch(err){
        err.message = `removerAdmin - ${err.message}`
        throw err
    }
}

