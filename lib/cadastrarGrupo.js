const db = require('../database/database')

module.exports = cadastrarGrupo = async (data, tipo = "msg") => {
    if(tipo == "msg"){
        const {isGroupMsg,chat } = data
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        if(isGroupMsg) {
            let g_registrado = await db.verificarGrupo(groupId)
            if(!g_registrado) await db.registrarGrupo(groupId)   
        }
    } else if (tipo == "add"){
        let g_registrado = await db.verificarGrupo(data.chat)
        if(!g_registrado) await db.registrarGrupo(data.chat)  
    } else if(tipo == "added"){
        let g_registrado = await db.verificarGrupo(data)
        if(!g_registrado) await db.registrarGrupo(data)  
    }
}