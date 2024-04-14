
const {MessageTypes}  = require("./mensagem")
const db = require("../db-modulos/database")
const fs = require('fs-extra')
const path = require('path')


module.exports ={

    // BOT INFOS
    getHostNumberFromBotJSON: async()=>{ 
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
        return bot.hostNumber
    },

    // GROUP INFOS
    getGroupInfoFromDb : async(groupId)=>{ 
        return await db.obterGrupo(groupId)
    },

    getAllGroupsFromDb: async()=>{
        let groups = await db.obterTodosGrupos()
        return groups
    },

    getGroupAdminsFromDb : async(groupId)=>{ 
        let groupAdmins = await db.obterAdminsGrupo(groupId)
        return groupAdmins
    },

    getGroupOwnerFromDb : async(groupId)=>{ 
        let ownerGroup = await db.obterDonoGrupo(groupId)
        return ownerGroup
    },

    getGroupAnnounceFromDb : async(groupId)=>{ 
        let announceGroup = await db.obterStatusRestritoMsg(groupId)
        return announceGroup
    },

    getGroupMembersIdFromDb : async(groupId)=>{ 
        let groupMembers = await db.obterParticipantesGrupo(groupId)
        return groupMembers
    },

}

