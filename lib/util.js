const fs = require('fs-extra')
const path = require('path')
const emoji = require('emoji-regex')
const {msgs_texto} = require("./msgs")
const {criacaoEnv} = require("./env")
const {botCriarArquivo} = require("./bot")
const guias = require("./guias")
const color = require('./color')

module.exports = {
  emojiStrip : (string) => {
    return string.replace(emoji, '')
  },

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

  criarArquivosNecessarios : async ()=>{
      try {
        const existeBotJson = fs.existsSync(path.resolve("database/json/bot.json")), existeEnv = fs.existsSync(path.resolve('.env'))
        if(existeBotJson && existeEnv) return false
        if(!existeBotJson){
          //CRIA O ARQUIVO COM AS INFORMAÇÕES INICIAIS DO BOT
          await botCriarArquivo()
        }
        if(!existeEnv) {
          //CRIA O ARQUIVO .ENV
          await criacaoEnv()
        }
        return true
      } catch(err){
          throw new Error(err)
      }
  },

  segParaHora : (time, with_seg = true)=>{
    var hours = Math.floor( time / 3600 )
      var minutes = Math.floor( (time % 3600) / 60 )
      var seconds = time % 60
      seconds = parseFloat(seconds).toFixed(2)
      minutes = minutes < 10 ? '0' + minutes : minutes;     
      seconds = seconds < 10 ? '0' + seconds : seconds
      hours = hours < 10 ? '0' + hours : hours
      if(with_seg) return  hours + ":" + minutes + ":" + seconds;
      return  hours + ":" + minutes;
  },
      
  sleep : async (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      });
  },

  consoleErro : (msg, tipo_erro = "API")=>{
    console.error(color(`[${tipo_erro}]`,"red"), msg)
  }
}
