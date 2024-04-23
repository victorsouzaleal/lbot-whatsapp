import { AsyncNedb } from 'nedb-async'
import {MessageTypes} from '../baileys/mensagem.js'
import path from 'node:path'
import fs from 'fs-extra'
import moment from "moment-timezone"
var db = {usuarios: new AsyncNedb({filename : './database/usuarios.db', autoload: true})}

// ######################## FUNCOES USUARIO #####################
export const obterUsuario = async (id_usuario) =>{
    let usuario = await db.usuarios.asyncFindOne({id_usuario : id_usuario})
    return usuario
}

export const obterUsuariosTipo = async (tipo) =>{
    let usuarios = await db.usuarios.asyncFind({tipo})
    return usuarios
}

export const obterTodosUsuarios = async()=>{
    let usuarios = await db.usuarios.asyncFind({})
    return usuarios
}

export const verificarRegistro  = async (id_usuario) => {
    let resp = await db.usuarios.asyncFindOne({id_usuario})
    return (resp != null)
}

export const atualizarNome = async(id_usuario,nome) =>{
    await db.usuarios.asyncUpdate({id_usuario}, {$set:{nome}})
}

export const registrarUsuario = async(id_usuario, nome) =>{
    let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/bot.json")))
    var cadastro_usuario = {
        id_usuario,
        nome,
        comandos_total: 0,
        comandos_dia: 0,
        max_comandos_dia : limite_diario.limite_tipos.comum,
        tipo: "comum"
    }
    await db.usuarios.asyncInsert(cadastro_usuario)
}

export const registrarDono = async(id_usuario, nome)=>{
    var cadastro_usuario_dono = {
        id_usuario,
        nome,
        comandos_total: 0,
        comandos_dia: 0,
        max_comandos_dia : null,
        tipo: "dono"
    }
    await db.usuarios.asyncInsert(cadastro_usuario_dono)
}

export const verificarDonoAtual = async(id_usuario)=>{
    let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/bot.json")))
    var usuario = await db.usuarios.asyncFindOne({id_usuario, tipo: "dono"})
    if(!usuario){
        await db.usuarios.asyncUpdate({tipo: "dono"}, {$set:{tipo: "comum",  max_comandos_dia : limite_diario.limite_tipos.comum}}, {multi: true})
        await db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo : "dono", max_comandos_dia: null}})
    }
}

export const alterarTipoUsuario = async(id_usuario, tipo)=>{
    let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/bot.json")))
    if(limite_diario.limite_tipos[tipo] || limite_diario.limite_tipos[tipo] == null){
        await db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia: limite_diario.limite_tipos[tipo]}})
        return true
    } else {
        return false
    }
}

export const limparTipo = async(tipo)=>{
    let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/bot.json")))
    if(limite_diario.limite_tipos[tipo] === undefined || tipo === "comum") return false
    await db.usuarios.asyncUpdate({tipo}, {$set: {tipo: "comum", max_comandos_dia: limite_diario.limite_tipos.comum}}, {multi: true})
    return true
}

export const ultrapassouLimite = async(id_usuario)=>{
    let usuario =  await db.usuarios.asyncFindOne({id_usuario : id_usuario})
    if(usuario.max_comandos_dia == null) return false
    return (usuario.comandos_dia >= usuario.max_comandos_dia)
}

export const addContagemDiaria = async(id_usuario)=>{
    db.usuarios.asyncUpdate({id_usuario}, {$inc: {comandos_total: 1, comandos_dia: 1}})
}

export const addContagemTotal = async(id_usuario)=>{
    db.usuarios.asyncUpdate({id_usuario}, {$inc: {comandos_total: 1}})
}

export const definirLimite = async(tipo, limite)=>{
    db.usuarios.asyncUpdate({tipo}, {$set: {max_comandos_dia: limite}}, {multi: true})
}

export const resetarComandosDia = async() =>{
    db.usuarios.asyncUpdate({}, {$set:{comandos_dia : 0}}, {multi: true})
}

export const resetarComandosDiaUsuario = async(id_usuario) =>{
    db.usuarios.asyncUpdate({id_usuario}, {$set:{comandos_dia : 0}})
}
//###########################################################