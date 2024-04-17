import { AsyncNedb } from 'nedb-async'
import {MessageTypes} from '../lib-baileys/mensagem.js'
import path from 'node:path'
import fs from 'fs-extra'
import moment from "moment-timezone"

var db = {}
db.usuarios = new AsyncNedb({filename : './database/usuarios.db', autoload: true})
db.grupos = new AsyncNedb({filename : './database/grupos.db', autoload: true})
db.contador = new AsyncNedb({filename : './database/contador.db', autoload: true})

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
        max_comandos_dia : limite_diario.limite_tipos.bronze,
        tipo: "bronze"
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
        await db.usuarios.asyncUpdate({tipo: "dono"}, {$set:{tipo: "bronze",  max_comandos_dia : limite_diario.limite_tipos.bronze}}, {multi: true})
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
    if(limite_diario.limite_tipos[tipo] === undefined || tipo === "bronze") return false
    await db.usuarios.asyncUpdate({tipo}, {$set: {tipo: "bronze", max_comandos_dia: limite_diario.limite_tipos.bronze}}, {multi: true})
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

//##################### FUNCOES GRUPO #########################

//### GERAL
export const verificarGrupo = async(id_grupo) =>{
    let resp = await db.grupos.asyncFindOne({id_grupo})
    return (resp != null)
}

export const registrarGrupo = async(id_grupo, ...dados)=>{
    let cadastro_grupo = {
        id_grupo,
        nome : dados[0],
        descricao : dados[1],
        participantes: dados[2],
        admins: dados[3],
        dono: dados[4],
        restrito_msg: dados[5],
        mutar: false,
        bemvindo: {status: false, msg: ""},
        antifake: {status: false, ddi_liberados:[]},
        antilink: false,
        antiflood: false,
        autosticker: false,
        contador: {status:false, inicio: ''},
        block_cmds: [],
        lista_negra: []
    }
    await db.grupos.asyncInsert(cadastro_grupo)
}

export const resetarGrupos = async()=>{
    db.grupos.asyncUpdate({}, 
    {$set: {
    mutar: false,
    bemvindo: {status: false, msg:""},
    antifake: {status: false, ddi_liberados:[]},
    antilink: false,
    antiflood: false,
    autosticker: false,
    contador: {status:false, inicio: ''},
    block_cmds: [],
    lista_negra: []
    }}, {multi: true})
}

export const obterGrupo = async(id_grupo)=>{
    let grupo_info = await db.grupos.asyncFindOne({id_grupo})
    return grupo_info
}

export const removerGrupo = async(id_grupo)=>{
    await db.grupos.asyncRemove({id_grupo}, {multi: true})
}

export const obterTodosGrupos = async()=>{
    let grupos = await db.grupos.asyncFind({})
    return grupos
}

//###

// ### PARTICIPANTES 
export const obterParticipantesGrupo = async (id_grupo)=>{
    let grupo = await db.grupos.asyncFindOne({id_grupo})
    if(grupo == null) return false
    return grupo.participantes
}

export const obterAdminsGrupo = async (id_grupo)=>{
    let grupo = await db.grupos.asyncFindOne({id_grupo})
    if(grupo == null) return false
    return grupo.admins
}

export const obterDonoGrupo = async (id_grupo)=>{
    let grupo = await db.grupos.asyncFindOne({id_grupo})
    if(grupo == null) return false
    return grupo.dono
}

export const obterStatusRestritoMsg = async (id_grupo)=>{
    let grupo = await db.grupos.asyncFindOne({id_grupo})
    if(grupo == null) return false
    return grupo.restrito_msg
}

export const atualizarGrupo = async(id_grupo, ...dados)=>{  
    await db.grupos.asyncUpdate({id_grupo}, {$set: {nome: dados[0], descricao: dados[1], participantes: dados[2], admins: dados[3], dono: dados[4], restrito_msg: dados[5]}})
}

export const atualizarNomeGrupo = async(id_grupo, nome)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{nome}})
}

export const atualizarRestritoGrupo = async(id_grupo, restrito_msg)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{restrito_msg}})
}

export const adicionarParticipante = async(id_grupo, participante)=>{ 
    await db.grupos.asyncUpdate({id_grupo}, {$push: { participantes: participante} })
}

export const adicionarAdmin = async(id_grupo, participante)=>{ 
    await db.grupos.asyncUpdate({id_grupo}, {$push: { admins: participante} })
}

export const removerParticipante = async(id_grupo, participante)=>{   
    await db.grupos.asyncUpdate({id_grupo}, { $pull: { participantes : participante } })
}

export const removerAdmin = async(id_grupo, participante)=>{   
    await db.grupos.asyncUpdate({id_grupo}, { $pull: { admins : participante } })
}

export const participanteExiste = async (id_grupo, id_usuario)=>{
    let grupo = await db.grupos.asyncFindOne({id_grupo})
    return (grupo != null && grupo.participantes.includes(id_usuario))
}

export const verificarAdmin = async (id_grupo, id_usuario)=>{
    let grupo = await db.grupos.asyncFindOne({id_grupo})
    return (grupo != null && grupo.admins.includes(id_usuario))
}

//###

//### ALTERAR RECURSOS
export const alterarBemVindo = async(id_grupo, status, msg = "")=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{"bemvindo.status": status, "bemvindo.msg":msg}})
}

export const alterarAntiFake = async(id_grupo, status = true, ddi=[])=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{"antifake.status": status, "antifake.ddi_liberados": ddi}})
}

export const alterarMutar = async(id_grupo, status = true)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{mutar: status}})
}

export const alterarAntiLink = async(id_grupo, status = true)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{antilink: status}})
}

export const alterarAutoSticker = async(id_grupo, status = true)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$set:{autosticker: status}})
}

export const alterarContador = async(id_grupo, status = true)=>{
    let data_atual = (status) ? moment(moment.now()).format("DD/MM HH:mm:ss") : ''
    await db.grupos.asyncUpdate({id_grupo}, {$set:{"contador.status":status, "contador.inicio":data_atual}})
}

export const alterarAntiFlood = async(id_grupo, status = true, max = 10, intervalo=10)=>{
    db.grupos.asyncUpdate({id_grupo}, {$set:{antiflood:status}})
    let antifloodJson = JSON.parse(fs.readFileSync(path.resolve('database/antiflood.json')))
    if(status){
        antifloodJson.push({
            id_grupo: id_grupo,
            max: parseInt(max),
            intervalo : parseInt(intervalo),
            msgs : []
        })
    } else {
        antifloodJson.splice(antifloodJson.findIndex(item => item.id_grupo == id_grupo), 1)
    }
    fs.writeFileSync(path.resolve('database/antiflood.json'), JSON.stringify(antifloodJson))
}

//### LISTA NEGRA
export const obterListaNegra  = async (id_grupo)=>{
    let {lista_negra}= await db.grupos.asyncFindOne({id_grupo})
    return lista_negra
}

export const adicionarListaNegra = async(id_grupo, id_usuario)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$push: { lista_negra: id_usuario } })
}

export const removerListaNegra = async(id_grupo, id_usuario)=>{
    await db.grupos.asyncUpdate({id_grupo}, {$pull: { lista_negra: id_usuario } } )
}
//###

//### ANTIFLOOD GRUPO
export const grupoInfoAntiFlood = (id_grupo)=>{
    let antifloodJson = JSON.parse(fs.readFileSync(path.resolve('database/antiflood.json'))), grupoIndex = antifloodJson.findIndex(item => item.id_grupo == id_grupo)
    return antifloodJson[grupoIndex]
}

export const addMsgFlood = async(id_grupo, usuario_msg)=>{
    try{
        let antifloodJson = JSON.parse(fs.readFileSync(path.resolve('database/antiflood.json'))), grupoIndex = antifloodJson.findIndex(item => item.id_grupo == id_grupo)
        let grupo_info = antifloodJson[grupoIndex], timestamp_atual = Math.round(new Date().getTime()/1000),  resposta = false
        //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
        for(let i = 0; i < grupo_info.msgs.length; i++){
            if(timestamp_atual >= grupo_info.msgs[i].expiracao) grupo_info.msgs.splice(i,1)
                
        }
        //PESQUISA O INDICE DO USUARIO
        let usuarioIndex = grupo_info.msgs.findIndex(usuario=> usuario.id_usuario == usuario_msg)
        //SE O USUARIO JÁ ESTIVER NA LISTA
        if(usuarioIndex != -1){
            //INCREMENTA A CONTAGEM
            grupo_info.msgs[usuarioIndex].qtd++
            let max_msg = grupo_info.max
            if(grupo_info.msgs[usuarioIndex].qtd >= max_msg){
                grupo_info.msgs.splice(usuarioIndex,1)
                resposta = true
            } else{
                resposta = false
            }
        } else {
            //ADICIONA O USUARIO NA LISTA
            grupo_info.msgs.push({
                id_usuario: usuario_msg,
                expiracao: timestamp_atual + grupo_info.intervalo,
                qtd: 1
            })
            resposta = false
        }

        //ATUALIZAÇÃO DO JSON E RETORNO
        antifloodJson[grupoIndex] = grupo_info
        await fs.writeFileSync(path.resolve('database/antiflood.json'), JSON.stringify(antifloodJson))
        return resposta
    } catch(err){
        throw new Error(err)
    }
}
//###

//### BLOQUEIO DE COMANDOS
export const addBlockedCmd = async(id_grupo, cmds)=>{
    db.grupos.asyncUpdate({id_grupo}, {$push: { block_cmds: {$each: cmds} }})
}

export const removeBlockedCmd = async(id_grupo, cmds)=>{
    for(let cmd of cmds){
        await db.grupos.asyncUpdate({id_grupo}, {$pull:{block_cmds: cmd}})
    }
}
//###

//##################### FUNCOES CONTADOR #########################
export const registrarContagemTodos =async(id_grupo,usuarios)=>{
    for(let usuario of usuarios){
        let id_unico = `${id_grupo}-${usuario}`
        await db.contador.asyncInsert({id_grupo,id_usuario: usuario, id_unico, msg:0,imagem:0,audio:0,sticker:0,video:0,outro:0,texto:0})
    }
}

export const existeUsuarioContador = async(id_grupo,id_usuario)=>{
    let id_unico = `${id_grupo}-${id_usuario}`
    let contador = await db.contador.asyncFindOne({id_unico})
    if(contador == null) {
        db.contador.asyncInsert({id_grupo,id_usuario,id_unico,msg:0,imagem:0,audio:0,sticker:0,video:0,outro:0,texto:0})
    }
}

export const registrarContagem = async(id_grupo,id_usuario)=>{
    let id_unico = `${id_grupo}-${id_usuario}`
    db.contador.asyncInsert({id_grupo,id_usuario,id_unico,msg:0,imagem:0,audio:0,sticker:0,video:0,outro:0,texto:0}) 
}

export const addContagem = async(id_grupo,id_usuario,tipo_msg)=>{
    switch(tipo_msg){
        case MessageTypes.text :
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, texto: 1}})
            break
        case MessageTypes.extendedText:
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, texto: 1}})
            break
        case MessageTypes.image:
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, imagem: 1}})
            break
        case MessageTypes.video:
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, video: 1}})
            break
        case MessageTypes.sticker:
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, sticker: 1}})
            break
        case MessageTypes.audio:
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, audio: 1}})
            break
        case MessageTypes.document:
            db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, outro: 1}})
            break    
    }
}

export const obterAtividade = async(id_grupo,id_usuario)=>{
    let atividade = await db.contador.asyncFindOne({id_grupo,id_usuario})
    return atividade
}

export const alterarContagemUsuario = async(id_grupo,id_usuario,qtd)=>{
    let resto = parseInt(qtd % 6)
    let msgs_cada = parseInt((qtd - resto)/6)
    await db.contador.asyncUpdate({id_grupo,id_usuario}, {$set:{msg:parseInt(qtd), texto:msgs_cada, imagem:msgs_cada, video:msgs_cada, sticker:msgs_cada, audio:msgs_cada, outro: resto }})
}

export const obterUsuariosInativos = async(id_grupo,min)=>{
    min = parseInt(min)
    let usuarios_inativos = await db.contador.asyncFind({id_grupo, msg: {$lt: min}},[ ["sort", {msg:-1}]])
    return usuarios_inativos
}

export const obterUsuariosAtivos = async(id_grupo, limite) =>{
    let usuarios_ativos = await db.contador.asyncFind({id_grupo}, [ ["sort", {msg:-1}] , ['limit', limite] ] )
    return usuarios_ativos
}

export const obterTodasContagensGrupo = async(id_grupo)=>{
    let contagens = await db.contador.asyncFind({id_grupo})
    return contagens
}

export const removerContagem = async(id_grupo,id_usuario)=>{
    await db.contador.asyncRemove({id_grupo,id_usuario})
}

export const removerContagemGrupo = async(id_grupo)=>{
    await db.contador.asyncRemove({id_grupo}, {multi: true})
}
