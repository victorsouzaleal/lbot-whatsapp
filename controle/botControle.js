import * as bot from '../db_funcoes/bot.js'
import {obterMensagensTexto} from '../lib/msgs.js'
import { listarComandos } from '../comandos/comandos.js'
import {consoleErro, criarTexto, corTexto} from '../lib/util.js'

export const inicializarBot = async(c)=>{
    await bot.botStart(c)
    console.log("[BOT]", corTexto((await obterMensagensTexto()).inicio.dados_bot))
}

export const criarArquivo = async()=>{
    await bot.botCriarArquivo()
}

export const atualizarComandosFeitos = async()=>{
    await bot.botInfoUpdate()
}

export const obterInformacoesBot = async()=>{
    let botInfo = bot.botInfo()
    return botInfo
}

export const verificarLimiteComando = async(usuario, tipo, admin)=>{
    let resposta = bot.botLimitarComando(usuario, tipo, admin)
    return resposta
}

export const verificarExpiracaoLimite = async()=>{
    await bot.botVerificarExpiracaoLimite()
}

export const bloquearComandos = async(comandos)=>{
    await bot.botBloquearComando(comandos)
}

export const desbloquearComandos = async(comandos)=>{
    await bot.botDesbloquearComando(comandos)
}

export const bloquearComandosGlobal = async(usuarioComandos)=>{
    let listaComandos = await listarComandos()
    let msgs_texto = await obterMensagensTexto()
    let botInfoJSON = await obterInformacoesBot()
    let {prefixo} = botInfoJSON
    let comandosBloqueados = [], respostaBloqueio = msgs_texto.admin.bcmdglobal.resposta_titulo
    let categorias = ['figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]

    if(categorias.includes(primeiroComando)){
        let comandosCategoria = []
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

    if(comandosBloqueados.length != 0) await bloquearComandos(comandosBloqueados)
    return respostaBloqueio
}

export const desbloquearComandosGlobal = async(usuarioComandos)=>{
    let listaComandos = await listarComandos()
    let msgs_texto = await obterMensagensTexto()
    let botInfoJSON = await obterInformacoesBot()
    let {prefixo} = botInfoJSON
    let comandosDesbloqueados = [], respostaDesbloqueio = msgs_texto.admin.dcmdglobal.resposta_titulo
    let categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        let comandosCategoria = []
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

    if(comandosDesbloqueados.length != 0)  await desbloquearComandos(comandosDesbloqueados)
    return respostaDesbloqueio
}

export const verificarComandosBloqueadosGlobal = async(comando, botInfoJSON)=>{
    let {prefixo} = botInfoJSON
    return botInfoJSON.bloqueio_cmds.includes(comando.replace(prefixo, ''))
}

export const obterNumeroBot = async()=>{
    let {hostNumber} = bot.botInfo()
    return hostNumber
}

export const obterNumeroDono = async()=>{
    let {numero_dono} = bot.botInfo()
    return numero_dono
}

export const alterarNumeroDono = async(numero)=>{
    await bot.botAlterarNumeroDono(numero)
}

export const alterarPrefixo = async(prefixo)=>{
    await bot.botAlterarPrefixo(prefixo)
}

export const alterarQtdLimiteDiarioTipo = async(tipo, limite)=>{
    await bot.botQtdLimiteDiario(tipo, limite)
}

export const alterarAutoSticker = async(status)=>{
    await bot.botAlterarAutoSticker(status)
}

export const alterarPvLiberado = async(status)=>{
    await bot.botAlterarPvLiberado(status)
}

export const alterarLimiteDiario = async(status)=>{
    await bot.botAlterarLimiteDiario(status)
}

export const alterarLimitador = async(status= true, cmds_minuto = 5, tempo_bloqueio= 60)=>{
    await bot.botAlterarLimitador(status, cmds_minuto, tempo_bloqueio)
}

export const alterarNomeBot = async(nome)=>{
    await bot.botAlterarNomeBot(nome)
}

export const alterarNomeAdm = async(nome)=>{
    await bot.botAlterarNomeAdm(nome)
}

export const alterarNomeFigurinhas = async(nome)=>{
    await bot.botAlterarNomeFigurinhas(nome)
}

