import * as bot from '../database/bot.js'
import {corTexto} from '../lib/util.js'
import {obterMensagensTexto} from '../lib/msgs.js'

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

export const verificarLimitarMensagensPv = async(usuario, tipo)=>{
    let resposta = bot.botLimitarMensagensPv(usuario, tipo)
    return resposta
}

export const bloquearComandos = async(comandos)=>{
    await bot.botBloquearComando(comandos)
}

export const desbloquearComandos = async(comandos)=>{
    await bot.botDesbloquearComando(comandos)
}

export const obterNumeroBot = async()=>{
    let {numero_dono} = bot.botInfo()
    return numero_dono
}

export const alterarNumeroDono = async(numero)=>{
    await bot.botAlterarNumeroDono(numero)
}

export const alterarPrefixo = async(prefixo)=>{
    await bot.botAlterarPrefixo(prefixo)
}

export const alterarLimitarMensagensPv = async(status, max= 10, intervalo= 10)=>{
    await bot.botAlterarLimitarMensagensPv(status, max, intervalo)
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

