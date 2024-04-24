
import * as gruposdb from '../database/grupos.js'
import fs from 'fs-extra'
import path from 'node:path'


// BOT INFOS
export const getHostNumberFromBotJSON = async()=>{ 
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/db/bot.json')))
    return bot.hostNumber
}

// GROUP INFOS
export const getGroupInfoFromDb = async(groupId)=>{ 
    return await gruposdb.obterGrupo(groupId)
}

export const getAllGroupsFromDb = async()=>{
    let groups = await gruposdb.obterTodosGrupos()
    return groups
}

export const getGroupAdminsFromDb = async(groupId)=>{ 
    let groupAdmins = await gruposdb.obterAdminsGrupo(groupId)
    return groupAdmins
}

export const getGroupOwnerFromDb = async(groupId)=>{ 
    let ownerGroup = await gruposdb.obterDonoGrupo(groupId)
    return ownerGroup
}

export const getGroupAnnounceFromDb = async(groupId)=>{ 
    let announceGroup = await gruposdb.obterStatusRestritoMsg(groupId)
    return announceGroup
}

export const getGroupMembersIdFromDb = async(groupId)=>{ 
    let groupMembers = await gruposdb.obterParticipantesGrupo(groupId)
    return groupMembers
}


