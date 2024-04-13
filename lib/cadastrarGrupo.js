const db = require('../lib/database')
const client  = require("../lib-translate/baileys")
const msgs_texto = require("./msgs")
const {criarTexto, consoleErro} = require("./util")

module.exports = {
    mensagemCadastrarGrupo: async(c, messageTranslated)=>{
        try{
            const {isGroupMsg, chatId } = messageTranslated
            if(isGroupMsg) {
                const groupId = chatId
                let g_registrado = await db.verificarGrupo(groupId)
                if(!g_registrado) {
                    let groupMetadata = await client.getGroupInfo(c,groupId)
                    let participantes = await client.getGroupMembersIdFromMetadata(groupMetadata)
                    let admins = await client.getGroupAdminsFromMetadata(groupMetadata)
                    await db.registrarGrupo(groupId, groupMetadata.subject, groupMetadata.desc, participantes, admins)  
                } 
            }
        } catch(err){
            err.message = `mensagemCadastrarGrupo - ${err.message}`
            throw err
        }

    },

    inicioCadastrarGrupo: async(groupsMetadata)=>{
        try{
            for(let grupo of groupsMetadata){ 
                let g_registrado = await db.verificarGrupo(grupo.id)
                if(!g_registrado){
                    let participantes = await client.getGroupMembersIdFromMetadata(grupo)
                    let admins = await client.getGroupAdminsFromMetadata(grupo)
                    await db.registrarGrupo(grupo.id, grupo.subject, grupo.desc, participantes, admins)  
                } 
            }
            return msgs_texto.inicio.cadastro_grupos
        } catch(err){
            err.message = `inicioCadastrarGrupo - ${err.message}`
            throw err
        }
    },

    adicionadoCadastrarGrupo: async(groupMetadata)=>{
        try{
            let g_registrado = await db.verificarGrupo(groupMetadata.id)
            if(!g_registrado){
                let participantes = await client.getGroupMembersIdFromMetadata(data)
                let admins = await client.getGroupAdminsFromMetadata(data)
                await db.registrarGrupo(data.id, data.subject, data.desc, participantes, admins)  
            }
        } catch(err){
            err.message = `adicionadoCadastrarGrupo - ${err.message}`
            throw err
        }
    }
}