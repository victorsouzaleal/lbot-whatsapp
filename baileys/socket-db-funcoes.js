
import * as db from '../db-modulos/database.js'
import fs from 'fs-extra'
import path from 'node:path'


// BOT INFOS
export const getHostNumberFromBotJSON = async()=>{ 
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    return bot.hostNumber
}

// GROUP INFOS
export const getGroupInfoFromDb = async(groupId)=>{ 
    return await db.obterGrupo(groupId)
}

export const getAllGroupsFromDb = async()=>{
    let groups = await db.obterTodosGrupos()
    return groups
}

export const getGroupAdminsFromDb = async(groupId)=>{ 
    let groupAdmins = await db.obterAdminsGrupo(groupId)
    return groupAdmins
}

export const getGroupOwnerFromDb = async(groupId)=>{ 
    let ownerGroup = await db.obterDonoGrupo(groupId)
    return ownerGroup
}

export const getGroupAnnounceFromDb = async(groupId)=>{ 
    let announceGroup = await db.obterStatusRestritoMsg(groupId)
    return announceGroup
}

export const getGroupMembersIdFromDb = async(groupId)=>{ 
    let groupMembers = await db.obterParticipantesGrupo(groupId)
    return groupMembers
}


