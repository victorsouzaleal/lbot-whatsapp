const fs = require('fs-extra')
const path = require('path')
const moment = require('moment-timezone')
const msgs_texto = require("./msgs")
const guias = require("./guias")
const chalk = require('chalk')

module.exports = {
    erroComandoMsg : (comando) =>{
      return module.exports.criarTexto(msgs_texto.geral.cmd_erro, comando, comando)
    },

    corTexto : (texto, cor)=>{
       return !cor ? chalk.green(texto) : chalk.hex(cor)(texto)
    },

    guiaComandoMsg : (tipo,comando)=>{
      comando = comando.replace("!", "")
      return guias[tipo][comando]
    },

    criarTexto : (texto, ...params)=>{
      for(let i = 0; i < params.length; i++){
          texto = texto.replace(`{p${i+1}}`, params[i])
      }
      return texto
    },

    timestampParaData : (timestampMsg)=>{
        return moment(timestampMsg).format('DD/MM HH:mm:ss')
    },

    obterTempoRespostaSeg : (timestampMensagem) => {
        var tResposta = moment.now() - timestampMensagem
        return (tResposta/1000).toFixed(2)
    },

    consoleComando : (isGroup, categoria, comando, hex, timestampMsg, nomeUsuario, nomeChat)=>{
        var tMensagem = module.exports.timestampParaData(timestampMsg)
        var tResposta = module.exports.obterTempoRespostaSeg(timestampMsg)
        if(isGroup){
          console.log('\x1b[1;31m~\x1b[1;37m>', module.exports.corTexto(`[GRUPO - ${categoria}]`, hex), tMensagem, module.exports.corTexto(comando), 'de', module.exports.corTexto(nomeUsuario), 'em', module.exports.corTexto(nomeChat), `(${module.exports.corTexto(`${tResposta}s`)})`)
        } else {
          console.log('\x1b[1;31m~\x1b[1;37m>', module.exports.corTexto(`[PRIVADO - ${categoria}]`, hex), tMensagem, module.exports.corTexto(comando), 'de', module.exports.corTexto(nomeUsuario), `(${module.exports.corTexto(`${tResposta}s`)})`)
        }
    },

    primeiraLetraMaiuscula : (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    removerNegritoComando: (comando)=>{
       return comando.replace(/\*/gm, "").trim()
    },

    obterNomeAleatorio:(ext)=>{
        return `${Math.floor(Math.random() * 10000)}${ext}`
    },

    consoleErro : (msg, tipo_erro = "API")=>{
      console.error(module.exports.corTexto(`[${tipo_erro}]`,"#d63e3e"), msg)
    },
    
    criarArquivosNecessarios : async ()=>{
        try {
          const {criacaoEnv} = require(path.resolve("lib/env.js"))
          const {botCriarArquivo} = require(path.resolve("db-modulos/bot.js"))
          const existePastaDatabase = fs.pathExistsSync(path.resolve("database"))
          const existePastaTemp = fs.pathExistsSync(path.resolve("temp"))
          const existeBotJson = fs.existsSync(path.resolve("database/bot.json")), existeEnv = fs.existsSync(path.resolve('.env')), existeAntiflood = fs.existsSync(path.resolve('database/antiflood.json'))
          
          //VERIFICA SE AS PASTAS DATABASE E TEMP EXISTEM
          if(!existePastaDatabase) fs.mkdirSync(path.resolve("database"), {recursive: true})
          if(!existePastaTemp) fs.mkdirSync(path.resolve("temp"), {recursive: true})

          //SE NÃO PRECISAR CRIAR NENHUM ARQUIVO NECESSÁRIO, RETORNE
          if(existeBotJson && existeEnv && existeAntiflood) return false

          if(!existeBotJson){
            //CRIA O ARQUIVO COM AS INFORMAÇÕES INICIAIS DO BOT
            await botCriarArquivo()
          }
          if(!existeEnv) {
            //CRIA O ARQUIVO .ENV
            await criacaoEnv()
          }
          if(!existeAntiflood){
            //CRIAR O ARQUIVO JSON DO ANTIFLOOD
            await fs.writeFile(path.resolve("database/antiflood.json"), "[]")
          }
          return true
        } catch(err){
            throw new Error(err)
        }
    }
}
