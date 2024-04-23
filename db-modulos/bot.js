import path from 'node:path'
import fs from 'fs-extra'
import { obterMensagensTexto } from '../lib/msgs.js' 
import moment from "moment-timezone"
import {getHostNumber} from '../baileys/socket-funcoes.js'
import * as usuariosdb from '../db-modulos/usuarios.js'
import {criarTexto} from '../lib/util.js'

export const botObjeto = {
    iniciado: 0,
    nome_bot: "LBOT",
    nome_adm: "Leal",
    nome_pack: "LBOT Stickers",
    prefixo: "!",
    numero_dono:"",
    cmds_executados:0,
    autosticker: false,
    bloqueio_cmds:[],
    limite_diario:{
        status: false,
        expiracao: 0,
        limite_tipos: {
            comum : 50,
            premium: 100,
            vip: null
        }
    },
    limitarmensagens:{
        status:false,
        max: 10,
        intervalo: 10,
        msgs:[]
    },
    limitecomandos:{
        status: false,
        cmds_minuto_max: 5,
        tempo_bloqueio: 60,
        usuarios: [],
        usuarios_limitados: []
    },
    pvliberado: true
}

export const botCriarArquivo = async ()=>{
    const bot = botObjeto
    await fs.writeFile(path.resolve("database/bot.json"), JSON.stringify(bot))
}

export const botInfoUpdate = ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.cmds_executados = bot.cmds_executados + 1
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

export const botInfo = ()=>{
    let bot
    if(!fs.existsSync(path.resolve('database/bot.json'))){
        bot = botObjeto
    } else {
        bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    }
    return bot
}

export const botStart = async (c)=>{
    try{
        let msgs_texto = obterMensagensTexto()
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
        bot.iniciado = moment.now()
        bot.hostNumber = await getHostNumber(c)
        fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
        return msgs_texto.inicio.dados_bot
    }catch(err){
        err.message = `botStart - ${err.message}`
        throw err
    }
}

// Alterar numero do dono
export const botAlterarNumeroDono = async(numeroDono)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.numero_dono = numeroDono
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}


// Alterar nome do bot
export const botAlterarNomeBot = async(nomeBot)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.nome_bot = nomeBot
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}


// Alterar nome do administrador
export const botAlterarNomeAdm = async(nomeAdm)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.nome_adm = nomeAdm
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

// Alterar nome do pack de figurinhas
export const botAlterarNomeFigurinhas = async(nomeAutor)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.nome_pack = nomeAutor
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

// Alterar prefixo dos comandos
export const botAlterarPrefixo = async(prefixo)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.prefixo = prefixo
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

// * PV Liberado
export const botAlterarPvLiberado = async (status= true)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.pvliberado = status
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

// * AUTO-STICKER PRIVADO
export const botAlterarAutoSticker = async (status= true)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.autosticker = status
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

// * LIMITE DIARIO DE COMANDOS
export const botQtdLimiteDiario = async (tipo, limite)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    if(limite == -1) limite = null
    if(bot.limite_diario.limite_tipos[tipo] === undefined) return false
    bot.limite_diario.limite_tipos[tipo] = parseInt(limite)
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
    await usuariosdb.definirLimite(tipo, parseInt(limite))
    return true
}

export const botAlterarLimiteDiario = async (status)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    let timestamp_atual = Math.round(new Date().getTime()/1000)
    bot.limite_diario.expiracao = (status) ? timestamp_atual+86400 : 0
    bot.limite_diario.status = status
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
    if(status){
        for(var tipo in bot.limite_diario.limite_tipos){
            await usuariosdb.definirLimite(tipo, parseInt(bot.limite_diario.limite_tipos[tipo]))
        }
    } else {
        await usuariosdb.resetarComandosDia()
        for(var tipo in bot.limite_diario.limite_tipos){
            await usuariosdb.definirLimite(tipo, null)
        }
    }
}

export const botVerificarExpiracaoLimite = async ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    let timestamp_atual = Math.round(new Date().getTime()/1000)
    if(timestamp_atual >= bot.limite_diario.expiracao){
        await usuariosdb.resetarComandosDia()
        bot.limite_diario.expiracao = timestamp_atual + 86400
        await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
    } 
}
//

// * LIMITE DE COMANDOS POR MINUTO
export const botAlterarLimitador = async (status= true, cmds_minuto = 5, tempo_bloqueio= 60)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.limitecomandos.status = status
    bot.limitecomandos.cmds_minuto_max = cmds_minuto
    bot.limitecomandos.tempo_bloqueio = tempo_bloqueio
    bot.limitecomandos.usuarios = []
    bot.limitecomandos.usuarios_limitados = []
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

export const botLimitarComando = async (usuario_id, tipo_usuario, isAdmin)=>{
    let msgs_texto = obterMensagensTexto()
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json'))),timestamp_atual = Math.round(new Date().getTime()/1000), resposta = {}
    //VERIFICA OS USUARIOS LIMITADOS QUE JÁ ESTÃO EXPIRADOS E REMOVE ELES DA LISTA
    for (let i = 0; i < bot.limitecomandos.usuarios_limitados.length; i++){
        if(bot.limitecomandos.usuarios_limitados[i].horario_liberacao <= timestamp_atual) bot.limitecomandos.usuarios_limitados.splice(i,1)
    }
    //VERIFICA OS USUARIOS QUE JÁ ESTÃO COM COMANDO EXPIRADOS NO ULTIMO MINUTO
    for (let i = 0; i < bot.limitecomandos.usuarios.length; i++){
        if(bot.limitecomandos.usuarios[i].expiracao <= timestamp_atual) bot.limitecomandos.usuarios.splice(i,1)
    }
    //SE NÃO FOR UM USUARIO DO TIPO DONO OU FOR ADMINISTRADOR DO GRUPO , NÃO FAÇA A CONTAGEM.
        if(tipo_usuario == "dono" || isAdmin){
        resposta = {comando_bloqueado : false}
    } else {
        //VERIFICA SE O USUARIO ESTÁ LIMITADO
        let usuarioIndexLimitado = bot.limitecomandos.usuarios_limitados.findIndex(usuario=> usuario.usuario_id == usuario_id)
        if(usuarioIndexLimitado != -1) {
            resposta = {comando_bloqueado : true}
        } else {
            //OBTEM O INDICE DO USUARIO NA LISTA DE USUARIOS
            let usuarioIndex = bot.limitecomandos.usuarios.findIndex(usuario=> usuario.usuario_id == usuario_id)
            //VERIFICA SE O USUARIO ESTÁ NA LISTA DE USUARIOS
            if(usuarioIndex != -1){
                bot.limitecomandos.usuarios[usuarioIndex].cmds++ //ADICIONA A CONTAGEM DE COMANDOS ATUAIS
                if(bot.limitecomandos.usuarios[usuarioIndex].cmds >= bot.limitecomandos.cmds_minuto_max){ //SE ATINGIR A QUANTIDADE MAXIMA DE COMANDOS POR MINUTO
                    //ADICIONA A LISTA DE USUARIOS LIMITADOS
                    bot.limitecomandos.usuarios_limitados.push({usuario_id, horario_liberacao: timestamp_atual + bot.limitecomandos.tempo_bloqueio})
                    bot.limitecomandos.usuarios.splice(usuarioIndex,1)
                    resposta = {
                        comando_bloqueado: true,
                        msg: criarTexto(msgs_texto.admin.limitecomandos.resposta_usuario_limitado, bot.limitecomandos.tempo_bloqueio)
                    }
                } else { //SE NÃO ATINGIU A QUANTIDADE MÁXIMA DE COMANDOS
                    resposta = {comando_bloqueado: false}
                }
            } else {//SE NÃO EXISTIR NA LISTA
                bot.limitecomandos.usuarios.push({usuario_id, cmds: 1, expiracao: timestamp_atual+60})
                resposta = {comando_bloqueado: false} 
            }
        }
    }

    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
    return resposta
}
//

// * LIMITE DE MENSAGENS NO PRIVADO
export const botAlterarLimitarMensagensPv = async (status, max = 10, intervalo= 10)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    bot.limitarmensagens.status = status
    bot.limitarmensagens.max = max
    bot.limitarmensagens.intervalo = intervalo
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

export const botLimitarMensagensPv = async (usuario_msg,usuario_tipo)=>{
    let msgs_texto = obterMensagensTexto()
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json'))), timestamp_atual = Math.round(new Date().getTime()/1000), resposta = {}
    //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
    for(let i = 0; i < bot.limitarmensagens.msgs.length; i++){
        if(timestamp_atual >= bot.limitarmensagens.msgs[i].expiracao) bot.limitarmensagens.msgs.splice(i,1)
    }
    //SE O USUARIO NÃO FOR DO TIPO DONO RETORNE FALSO
    if(usuario_tipo == "dono") {
        resposta = {bloquear_usuario : false}
    } else {
        //PESQUISA O INDICE DO USUARIO
        let usuarioIndex = bot.limitarmensagens.msgs.findIndex(usuario=> usuario.id_usuario == usuario_msg)
        //SE O USUARIO JÁ ESTIVER NA LISTA
        if(usuarioIndex != -1){
            //INCREMENTA A CONTAGEM
            bot.limitarmensagens.msgs[usuarioIndex].qtd++
            let max_msg = bot.limitarmensagens.max
            if(bot.limitarmensagens.msgs[usuarioIndex].qtd >= max_msg){
                bot.limitarmensagens.msgs.splice(usuarioIndex,1)
                resposta = {
                    bloquear_usuario : true,
                    msg: msgs_texto.admin.limitarmsgs.resposta_usuario_bloqueado
                }
            } else{
                resposta = {bloquear_usuario : false}
            }
        } else {
            //ADICIONA O USUARIO NA LISTA
            bot.limitarmensagens.msgs.push({
                id_usuario: usuario_msg,
                expiracao: timestamp_atual + bot.limitarmensagens.intervalo,
                qtd: 1
            })
            resposta = {bloquear_usuario : false}
        }
    }
    //ATUALIZAÇÃO DOS DADOS E RETORNO
    await fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
    return resposta
}
//

//BLOQUEIO DE COMANDOS
export const botBloquearComando = async (cmds) =>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    for(let cmd of cmds){
        bot.bloqueio_cmds.push(cmd)
    }
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}

export const botDesbloquearComando = async (cmds) =>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
    for(let cmd of cmds){
        let index = bot.bloqueio_cmds.findIndex(cmd_block=> cmd_block == cmd)
        if(index != -1){
            bot.bloqueio_cmds.splice(index,1)
        }
    }
    fs.writeFileSync(path.resolve('database/bot.json'), JSON.stringify(bot))
}
