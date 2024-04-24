import { listarComandos } from '../comandos/comandos.js'
import { obterMensagensTexto } from './msgs.js'
import {criarTexto} from './util.js'
import * as gruposdb from '../database/grupos.js'
import * as grupos from '../controle/gruposControle.js'
import * as bot from '../controle/botControle.js'

export const bloquearComandosGrupo = async (usuarioComandos, idGrupo)=>{
    var listaComandos = await listarComandos()
    var msgs_texto = await obterMensagensTexto()
    let {prefixo} = await bot.obterInformacoesBot()
    var comandosBloqueados = [], grupoInfo = await grupos.obterGrupoInfo(idGrupo), respostaBloqueio = msgs_texto.grupo.bcmd.resposta_titulo
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
            if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
            } else {
                comandosBloqueados.push(comando.replace(prefixo, ''))
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
            }
        }
    } else {
        for(var comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))){
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando.replace(prefixo, ''))
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando)){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.nao_existe, comando)
            }
        }
    }

    if(comandosBloqueados.length != 0) await gruposdb.addBlockedCmd(idGrupo, comandosBloqueados)
    return respostaBloqueio
}

export const desbloquearComandosGrupo = async (usuarioComandos, idGrupo)=>{
    var listaComandos = await listarComandos()
    var msgs_texto = await obterMensagensTexto()
    let {prefixo} = await bot.obterInformacoesBot()
    var comandosDesbloqueados = [], grupoInfo = await grupos.obterGrupoInfo(idGrupo), respostaDesbloqueio = msgs_texto.grupo.dcmd.resposta_titulo
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
            if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))) {
                comandosDesbloqueados.push(comando.replace(prefixo, ''))
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }

    } else {
        for(var comando of usuarioComandos){
            if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))) {
                comandosDesbloqueados.push(comando.replace(prefixo, ''))
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    }

    if(comandosDesbloqueados.length != 0) await gruposdb.removeBlockedCmd(idGrupo, comandosDesbloqueados)
    return respostaDesbloqueio
}

export const verificarBloqueioGrupo = async (comando, grupoInfo, prefixo)=>{
    return grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))
}

export const bloquearComandosGlobal = async (usuarioComandos)=>{
    var listaComandos = await listarComandos()
    var msgs_texto = await obterMensagensTexto()
    let botInfoJSON = await bot.obterInformacoesBot()
    let {prefixo} = botInfoJSON
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
            if(botInfoJSON.bloqueio_cmds.includes(comando.replace(prefixo, ''))){
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
            } else {
                comandosBloqueados.push(comando.replace(prefixo, ''))
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
            }
        }         

    } else { 
        for(let comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(botInfoJSON.bloqueio_cmds.includes(comando.replace(prefixo, ''))){
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando.replace(prefixo, ''))
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando) ){
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.nao_existe, comando)
            }
        }
    }

    if(comandosBloqueados.length != 0) await bot.bloquearComandos(comandosBloqueados)
    return respostaBloqueio
}

export const desbloquearComandosGlobal = async (usuarioComandos)=>{
    var listaComandos = await listarComandos()
    var msgs_texto = await obterMensagensTexto()
    let botInfoJSON = await bot.obterInformacoesBot()
    let {prefixo} = botInfoJSON
    var comandosDesbloqueados = [], respostaDesbloqueio = msgs_texto.admin.dcmdglobal.resposta_titulo
    var categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "todos":
                comandosCategoria = botInfoJSON.bloqueio_cmds
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
            if(botInfoJSON.bloqueio_cmds.includes(comando.replace(prefixo, ''))) {
                comandosDesbloqueados.push(comando.replace(prefixo, ''))
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    } else {
        for(let comando of usuarioComandos){
            if(botInfoJSON.bloqueio_cmds.includes(comando.replace(prefixo, ''))) {
                comandosDesbloqueados.push(comando.replace(prefixo, ''))
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    }

    if(comandosDesbloqueados.length != 0)  await bot.desbloquearComandos(comandosDesbloqueados)
    return respostaDesbloqueio
}

export const verificarBloqueioGlobal = async (comando, botInfoJSON)=>{
    let {prefixo} = botInfoJSON
    return botInfoJSON.bloqueio_cmds.includes(comando.replace(prefixo, ''))
}
