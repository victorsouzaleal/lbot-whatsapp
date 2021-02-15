const db = require('../database/database')
const {msgs_texto} = require("./msgs")

module.exports = cadastrarGrupo = async (data, tipo = "msg", client) => {
    return new Promise(async(resolve,reject)=>{
        try{
            if(tipo == "msg"){
                const {isGroupMsg,chat } = data
                const groupId = isGroupMsg ? chat.groupMetadata.id : ''
                let participantes = await client.getGroupMembersId(groupId)
                if(isGroupMsg) {
                    let g_registrado = await db.verificarGrupo(groupId)
                    if(!g_registrado) await db.registrarGrupo(groupId, participantes)   
                }
            } else if (tipo == "add"){
                let participantes = await client.getGroupMembersId(data.chat)
                let g_registrado = await db.verificarGrupo(data.chat)
                if(!g_registrado) await db.registrarGrupo(data.chat, participantes)  
            } else if(tipo == "added"){
                let participantes = await client.getGroupMembersId(data)
                let g_registrado = await db.verificarGrupo(data)
                if(!g_registrado) await db.registrarGrupo(data, participantes)  
            } else if(tipo == "inicio"){
                let grupos = await client.getAllGroups()
                grupos.forEach(async grupo=>{
                    let participantes = await client.getGroupMembersId(grupo.id)
                    let g_registrado = await db.verificarGrupo(grupo.id)
                    if(!g_registrado) await db.registrarGrupo(grupo.id,participantes)  
                })
            }
            resolve(msgs_texto.inicio.cadastro_grupos)
        } catch {
            reject()
        }
    })
    
}