import moment from "moment-timezone"
import {obterMensagensTexto} from './msgs.js'
import {obterGuias} from './guias.js'
import chalk from 'chalk'
import {BotControle} from '../controles/BotControle.js'
import {UsuarioControle} from "../controles/UsuarioControle.js"
import path from 'node:path'
import fs from 'fs-extra'


export const erroComandoMsg = (comando, botInfo) =>{
  const msgs_texto = obterMensagensTexto(botInfo)
  return criarTexto(msgs_texto.geral.cmd_erro, comando, comando)
}

export const versaoAtual = () =>{
    return JSON.parse(fs.readFileSync(path.resolve('package.json'))).version
}

export const corTexto = (texto, cor)=>{
    return !cor ? chalk.green(texto) : chalk.hex(cor)(texto)
}

export const guiaComandoMsg = (tipo,comando, prefixo)=>{
  let guias = obterGuias(prefixo)
  comando = comando.replace(prefixo, "")
  return guias[tipo][comando]
}

export const criarTexto = (texto, ...params)=>{
  for(let i = 0; i < params.length; i++){
      texto = texto.replace(`{p${i+1}}`, params[i])
  }
  return texto
}

export const timestampParaData = (timestampMsg)=>{
    return moment(timestampMsg).format('DD/MM HH:mm:ss')
}

export const dataHoraAtual = ()=>{
  return moment(Date.now()).format('DD/MM HH:mm:ss')
}

export const obterTempoRespostaSeg = (timestampMensagem) => {
    let tResposta = moment.now() - timestampMensagem
    return (tResposta/1000).toFixed(2)
}

export const consoleComando = (isGroup, categoria, comando, hex, timestampMsg, nomeUsuario, nomeChat)=>{
    let tMensagem = timestampParaData(timestampMsg)
    let tResposta = obterTempoRespostaSeg(timestampMsg)
    if(isGroup){
      console.log('\x1b[1;31m~\x1b[1;37m>', corTexto(`[GRUPO - ${categoria}]`, hex), tMensagem, corTexto(comando), 'de', corTexto(nomeUsuario), 'em', corTexto(nomeChat), `(${corTexto(`${tResposta}s`)})`)
    } else {
      console.log('\x1b[1;31m~\x1b[1;37m>', corTexto(`[PRIVADO - ${categoria}]`, hex), tMensagem, corTexto(comando), 'de', corTexto(nomeUsuario), `(${corTexto(`${tResposta}s`)})`)
    }
}

export const primeiraLetraMaiuscula = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const removerNegritoComando = (comando)=>{
    return comando.replace(/\*/gm, "").trim()
}

export const obterNomeAleatorio =(ext = '')=>{
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

export const delayAleatorio = (minDelayMs, maxDelayMs)=>{
   return new Promise((resolve, reject)=>{
      let delayAleatorioMs = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs
      setTimeout(async ()=>{
          resolve()
      }, delayAleatorioMs)
   })
}

export const consoleErro = (msg, tipo_erro = "API")=>{
  console.error(corTexto(`[${tipo_erro}]`,"#d63e3e"), msg)
}

export const criacaoEnv = async ()=>{
    const env = "# CONFIGURAÇÃO DE API KEYS PARA COMANDOS\n\n"+
    "# ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)\n"+
    "acr_host=??????\n"+
    "acr_access_key=??????\n"+
    "acr_access_secret=??????\n\n"+
    "# DEEPGRAM - Coloque abaixo sua chave do DEEPGRAM (Transcrição de aúdio para texto)\n"+
    "dg_secret_key=??????\n\n"
    await fs.writeFile(path.resolve('.env'), env , 'utf8')
}

export const verificarComandoExiste = (lista_comandos, comando) => {
  const comandoExiste = (
    lista_comandos.utilidades.includes(comando) ||
    lista_comandos.grupo.includes(comando) || 
    lista_comandos.diversao.includes(comando) ||
    lista_comandos.admin.includes(comando) ||
    lista_comandos.info.includes(comando) ||
    lista_comandos.figurinhas.includes(comando) ||
    lista_comandos.downloads.includes(comando)
  )
  return comandoExiste
}

export const verificarEnv = async ()=>{
    try{
      let resposta = {
          acrcloud :{
            resposta: (process.env.acr_host?.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
              ? "A API do ACRCloud ainda não foi configurada corretamente" : "✓ API ACRCloud configurada.",
            cor_resposta: (process.env.acr_host?.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
            ? "#d63e3e" : false
          },
          deepgram : {
            resposta: (process.env.dg_secret_key?.trim() == "??????") ? "A API do DEEPGRAM ainda não foi configurada" : "✓ API DEEPGRAM configurada.",
            cor_resposta: (process.env.dg_secret_key?.trim() == "??????") ? "#d63e3e" : false
          },
        }
    
        console.log("[ENV]", corTexto(resposta.acrcloud.resposta, resposta.acrcloud.cor_resposta))
        console.log("[ENV]", corTexto(resposta.deepgram.resposta, resposta.deepgram.cor_resposta))
    } catch(err){
        err.message = `verificarEnv - ${err.message}`
        throw err
    }
  }

export const verificarNumeroDono = async()=>{
    const numero_dono = await new UsuarioControle().obterIdDono()
    let resposta = (!numero_dono) ? "O número do DONO ainda não foi configurado, digite !admin para cadastrar seu número como dono." : "✓ Número do DONO configurado."
    let cor_resposta = (!numero_dono) ? "#d63e3e" : false
    console.log("[DONO]", corTexto(resposta, cor_resposta))
}



export async function criarArquivosNecessarios(){
    try {
        const bot = new BotControle()
        const existePastaDados = fs.pathExistsSync(path.resolve("dados"))
        const existePastaTemp = fs.pathExistsSync(path.resolve("temp"))
        const existeBotJson = fs.existsSync(bot.obterCaminhoJSON()), existeEnv = fs.existsSync(path.resolve('.env'))
        if(!existePastaDados) fs.mkdirSync(path.resolve("dados"), {recursive: true})
        if(!existePastaTemp) fs.mkdirSync(path.resolve("temp"), {recursive: true})
        if(existeBotJson && existeEnv) return 
        if(!existeBotJson) await bot.criarArquivo()
        if(!existeEnv) await criacaoEnv()
      } catch(err){
          throw new Error(err)
      }
}

