const fs = require('fs-extra')
const path = require('path')
const emoji = require('emoji-regex')



const emojiStrip = (string) => {
    return string.replace(emoji, '')
}

const preencherTexto = (texto, ...params)=>{
   for(let i = 0; i < params.length; i++){
      texto = texto.replace(`{p${i+1}}`, params[i])
   }
   return texto
}

const criarArquivosNecessarios = async ()=>{
    try {
      if(!fs.existsSync(path.resolve("database/json/bot.json")) || !fs.existsSync(path.resolve('.env'))){
        //CRIA O ARQUIVO COM AS INFORMAÇÕES INICIAIS DO BOT
        if(!fs.existsSync(path.resolve("database/json/bot.json"))){
          const bot = {
              nome:"LBOT",
              criador:"Leal",
              criado_em:"21/12/2020",
              iniciado:"",
              cmds_executados:0,
              limite_diario:{
                status: false,
                expiracao: 0,
                qtd: null
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
              }
          }
          await fs.writeFile(path.resolve("database/json/bot.json"), JSON.stringify(bot))
        }
      //CRIA O ARQUIVO .ENV
      if(!fs.existsSync(path.resolve('.env'))) {
        const env = "# Coloque abaixo seu número com o código do país incluído\n"+
        "NUMERO_DONO=5521xxxxxxxxx\n"+
        "# Coloque abaixo sua chave API do site remove.bg\n"+
        "API_REMOVE_BG=??????\n"+
        "# Coloque abaixo sua chave API do site newsapi.org\n"+
        "API_NEWS_ORG=??????`\n"
        await fs.writeFile(path.resolve('.env'), env , 'utf8')
      }
      return true
    } else {
      return false
    }
  } catch(err){
      console.log(err)
  }
}

const segParaHora = (time, with_seg = true)=>{
  var hours = Math.floor( time / 3600 )
    var minutes = Math.floor( (time % 3600) / 60 )
    var seconds = time % 60
    seconds = parseFloat(seconds).toFixed(2)
    minutes = minutes < 10 ? '0' + minutes : minutes;     
    seconds = seconds < 10 ? '0' + seconds : seconds
    hours = hours < 10 ? '0' + hours : hours
    if(with_seg) return  hours + ":" + minutes + ":" + seconds;
    return  hours + ":" + minutes;
}
    
const sleep = async (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    });
}

exports.criarArquivosNecessarios = criarArquivosNecessarios
exports.emojiStrip = emojiStrip
exports.sleep = sleep
exports.preencherTexto = preencherTexto
exports.segParaHora = segParaHora
