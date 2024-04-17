import path from 'node:path'
import fs from 'fs-extra'
import { listarComandos } from '../comandos/comandos.js'
import { obterMensagensTexto } from './msgs.js'
import {criarTexto} from './util.js'
import * as db from '../db-modulos/database.js'
import {botInfo, botBloquearComando, botDesbloquearComando} from '../db-modulos/bot.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'

export const bloquearComandosGrupo = async (usuarioComandos, idGrupo)=>{
    var listaComandos = listarComandos()
    var msgs_texto = obterMensagensTexto()
    var comandosBloqueados = [], grupoInfo = await socketdb.getGroupInfoFromDb(idGrupo), respostaBloqueio = msgs_texto.grupo.bcmd.resposta_titulo
    var categorias = ['figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "figurinhas":
                comandosCategoria = listaComandos.figurinhas
                break
            case "utilidades":
                comandosCategoria = listaComandos.utilidades
                break
            case "downloads":
                comandosCategoria = listaComandos.downloads
                break
            case "diversão":
                comandosCategoria = listaComandos.diversao
                break
        }

        for(var comando of comandosCategoria){
            if(grupoInfo.block_cmds.includes(comando)){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
            } else {
                comandosBloqueados.push(comando)
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
            }
        }
    } else {
        for(var comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(grupoInfo.block_cmds.includes(comando)){
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando)
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando)){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.nao_existe, comando)
            }
        }
    }

    if(comandosBloqueados.length != 0) await db.addBlockedCmd(idGrupo, comandosBloqueados)
    return respostaBloqueio
}

export const desbloquearComandosGrupo = async (usuarioComandos, idGrupo)=>{
    var listaComandos = listarComandos()
    var msgs_texto = obterMensagensTexto()
    var comandosDesbloqueados = [], grupoInfo = await socketdb.getGroupInfoFromDb(idGrupo), respostaDesbloqueio = msgs_texto.grupo.dcmd.resposta_titulo
    var categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "todos":
                comandosCategoria = grupoInfo.block_cmds
                break
            case "figurinhas":
                comandosCategoria = listaComandos.figurinhas
                break
            case "utilidades":
                comandosCategoria = listaComandos.utilidades
                break
            case "downloads":
                comandosCategoria = listaComandos.downloads
                break
            case "diversão":
                comandosCategoria = listaComandos.diversao
                break
        }

        for(var comando of comandosCategoria){
            if(grupoInfo.block_cmds.includes(comando)) {
                comandosDesbloqueados.push(comando)
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }

    } else {
        for(var comando of usuarioComandos){
            if(grupoInfo.block_cmds.includes(comando)) {
                comandosDesbloqueados.push(comando)
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    }

    if(comandosDesbloqueados.length != 0) await db.removeBlockedCmd(idGrupo, comandosDesbloqueados)
    return respostaDesbloqueio
}

export const verificarBloqueioGrupo = async (comando, idGrupo)=>{
    var grupoInfo = await socketdb.getGroupInfoFromDb(idGrupo)
    return grupoInfo.block_cmds.includes(comando)
}

export const bloquearComandosGlobal = async (usuarioComandos)=>{
    var listaComandos = listarComandos()
    var msgs_texto = obterMensagensTexto()
    var comandosBloqueados = [], respostaBloqueio = msgs_texto.admin.bcmdglobal.resposta_titulo
    var categorias = ['figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]

    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "figurinhas":
                comandosCategoria = listaComandos.figurinhas
                break
            case "utilidades":
                comandosCategoria = listaComandos.utilidades
                break
            case "downloads":
                comandosCategoria = listaComandos.downloads
                break
            case "diversão":
                comandosCategoria = listaComandos.diversao
                break
        }

        for(let comando of comandosCategoria){
            if(botInfo().bloqueio_cmds.includes(comando)){
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
            } else {
                comandosBloqueados.push(comando)
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
            }
        }         

    } else { 
        for(let comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(botInfo().bloqueio_cmds.includes(comando)){
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando)
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando) ){
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.nao_existe, comando)
            }
        }
    }

    if(comandosBloqueados.length != 0) botBloquearComando(comandosBloqueados)
    return respostaBloqueio
}

export const desbloquearComandosGlobal = async (usuarioComandos)=>{
    var listaComandos = listarComandos()
    var msgs_texto = obterMensagensTexto()
    var comandosDesbloqueados = [], respostaDesbloqueio = msgs_texto.admin.dcmdglobal.resposta_titulo
    var categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "todos":
                comandosCategoria = botInfo().bloqueio_cmds
                break
            case "figurinhas":
                comandosCategoria = listaComandos.figurinhas
                break
            case "utilidades":
                comandosCategoria = listaComandos.utilidades
                break
            case "downloads":
                comandosCategoria = listaComandos.downloads
                break
            case "diversão":
                comandosCategoria = listaComandos.diversao
                break
        }

        for(let comando of comandosCategoria){
            if(botInfo().bloqueio_cmds.includes(comando)) {
                comandosDesbloqueados.push(comando)
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    } else {
        for(let comando of usuarioComandos){
            if(botInfo().bloqueio_cmds.includes(comando)) {
                comandosDesbloqueados.push(comando)
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    }

    if(comandosDesbloqueados.length != 0)  botDesbloquearComando(comandosDesbloqueados)
    return respostaDesbloqueio
}

export const verificarBloqueioGlobal = async (comando)=>{
    return botInfo().bloqueio_cmds.includes(comando)
}
