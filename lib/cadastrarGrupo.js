import * as db from '../db-modulos/database.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import { obterMensagensTexto } from './msgs.js'
import {criarTexto, consoleErro} from './util.js'


export const inicioCadastrarGrupo = async(groupsMetadata)=>{
    try{
        var msgs_texto = obterMensagensTexto()
        for(let grupo of groupsMetadata){ 
            let g_registrado = await db.verificarGrupo(grupo.id)
            if(!g_registrado){
                let participantes = await socket.getGroupMembersIdFromMetadata(grupo)
                let admins = await socket.getGroupAdminsFromMetadata(grupo)
                await db.registrarGrupo(grupo.id, grupo.subject, grupo.desc, participantes, admins, grupo.owner, grupo.announce)  
            } 
        }
        return msgs_texto.inicio.cadastro_grupos
    } catch(err){
        err.message = `inicioCadastrarGrupo - ${err.message}`
        throw err
    }
}

export const adicionadoCadastrarGrupo = async(groupMetadata)=>{
    try{
        let g_registrado = await db.verificarGrupo(groupMetadata.id)
        if(!g_registrado){
            let participantes = await socket.getGroupMembersIdFromMetadata(groupMetadata)
            let admins = await socket.getGroupAdminsFromMetadata(groupMetadata)
            await db.registrarGrupo(groupMetadata.id, groupMetadata.subject, groupMetadata.desc, participantes, admins, groupMetadata.owner, groupMetadata.announce)  
        }
    } catch(err){
        err.message = `adicionadoCadastrarGrupo - ${err.message}`
        throw err
    }
}

export const removerGrupo = async(groupId)=>{
    try{
        let g_registrado = await db.verificarGrupo(groupId)
        if(g_registrado) await db.removerGrupo(groupId)
    } catch(err){
        err.message = `removerGrupo - ${err.message}`
        throw err
    }
}
