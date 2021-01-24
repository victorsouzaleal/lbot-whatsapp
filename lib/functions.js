const fs = require('fs-extra')
const path = require('path')
const emoji = require('emoji-regex')



const emojiStrip = (string) => {
    return string.replace(emoji, '')
}

const criarEnv = async ()=>{
    try {
      if(!fs.existsSync(path.resolve("database/json/bot.json")) || !fs.existsSync(path.resolve('.env'))){
        //CRIA O ARQUIVO COM AS INFORMAÇÕES INICIAIS DO BOT
        if(!fs.existsSync(path.resolve("database/json/bot.json"))){
          const bot = {
              nome:"LBOT",
              criador:"Leal",
              criado_em:"21/12/2020",
              iniciado:"",
              limite_diario_usuarios:30,
              cmds_executados:0
          }
          await fs.writeFile(path.resolve("database/json/bot.json"), JSON.stringify(bot))
        }
      //CRIA O ARQUIVO .ENV
      if(!fs.existsSync(path.resolve('.env'))) {
        const env = `# Coloque abaixo seu número com o código do país incluído 
NUMERO_DONO=5521xxxxxxxxx
# Coloque abaixo sua chave API do site remove.bg
API_REMOVE_BG=??????
# Coloque abaixo sua chave API do site newsapi.org
API_NEWS_ORG=??????
#Coloque abaixo sua chave API do site WeatherAPI.com
API_CLIMA=??????` 
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

exports.criarEnv = criarEnv
exports.emojiStrip = emojiStrip
exports.sleep = sleep
exports.segParaHora = segParaHora
