const db = require('../lib/database')
const client  = require("../lib-translate/baileys")
const msgs_texto = require("./msgs")
const {criarTexto, consoleErro} = require("./util")

module.exports = cadastrarGrupo = async (c, tipo, data = {}, groupsInfo = []) => {
        try{
            if(tipo == "msg"){ //Ao receber uma mensagem (Usa c, tipo, data)
                const {isGroupMsg,chat } = data
                if(isGroupMsg) {
                    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
                    let g_registrado = await db.verificarGrupo(groupId)
                    if(!g_registrado) {
                        let participantes = await client.getGroupMembersId(c,groupId)
                        await db.registrarGrupo(groupId, participantes)  
                    } 
                }
            } else if(tipo == "added"){  //Ao ser adicionado em um grupo (Usa c, tipo, data)
                let g_registrado = await db.verificarGrupo(data.id)
                if(!g_registrado){
                    let participantes = await client.getGroupMembersId(c,data.id)
                    await db.registrarGrupo(data.id, participantes)  
                }
            } else if(tipo == "inicio"){
                for(let grupo of groupsInfo){ //Ao iniciar o bot (Usa c, tipo, groupsInfo)
                    let g_registrado = await db.verificarGrupo(grupo.id)
                    if(!g_registrado){
                        let participantes = await client.getGroupMembersId(c,grupo.id)
                        await db.registrarGrupo(grupo.id,participantes)  
                    } 
                }
            }
            return msgs_texto.inicio.cadastro_grupos
        } catch (err) {
            err.message = `cadastrarGrupo - ${err.message}`
            throw err
        }  
}