import * as gruposdb from '../database/grupos.js'

export const obterGrupoInfo = async(grupoId)=>{
    return await gruposdb.obterGrupo(grupoId)
}

export const obterAdminsGrupo = async(grupoId)=>{
    return await gruposdb.obterAdminsGrupo(grupoId)
}

export const obterDonoGrupo = async(grupoId)=>{ 
    let dono = await gruposdb.obterDonoGrupo(grupoId)
    return dono
}

export const obterStatusRestritoGrupo = async(grupoId)=>{ 
    let status = await gruposdb.obterStatusRestritoMsg(grupoId)
    return status
}

export const obterParticipantesGrupo = async(grupoId)=>{ 
    let participantes = await gruposdb.obterParticipantesGrupo(grupoId)
    return participantes
}

export const obterTodosGruposInfo = async()=>{
    let grupos = await gruposdb.obterTodosGrupos()
    return grupos
}