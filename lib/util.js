const fs = require('fs-extra')
const path = require('path')
const msgs_texto = require("./msgs")
const {criacaoEnv} = require("./env")
const {botCriarArquivo} = require("./bot")
const guias = require("./guias")
const color = require('./color')

module.exports = {
    erroComandoMsg : (comando) =>{
      return module.exports.preencherTexto(msgs_texto.geral.cmd_erro, comando, comando)
    },
    guiaComandoMsg : (tipo,comando)=>{
      comando = comando.replace("!", "")
      return guias[tipo][comando]
    },
    preencherTexto : (texto, ...params)=>{
      for(let i = 0; i < params.length; i++){
          texto = texto.replace(`{p${i+1}}`, params[i])
      }
      return texto
    },
    primeiraLetraMaiuscula : (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    obterNomeAleatorio:(ext)=>{
        return `${Math.floor(Math.random() * 10000)}${ext}`
    },
    consoleErro : (msg, tipo_erro = "API")=>{
      console.error(color(`[${tipo_erro}]`,"red"), msg)
    },
    criarArquivosNecessarios : async ()=>{
        try {
          const existeBotJson = fs.existsSync(path.resolve("database/json/bot.json")), existeEnv = fs.existsSync(path.resolve('.env')), existeAntiflood = fs.existsSync(path.resolve('database/json/antiflood.json'))
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
            await fs.writeFile(path.resolve("database/json/antiflood.json"), "[]")
          }
          return true
        } catch(err){
            throw new Error(err)
        }
    }
}
