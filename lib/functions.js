const fs = require('fs-extra')
const emoji = require('emoji-regex')



const emojiStrip = (string) => {
    return string.replace(emoji, '')
}

const criarEnv = async ()=>{
    try {
      if(!fs.existsSync('./.env')) {
        const env = `# Coloque abaixo seu número com o código do país incluído 
NUMERO_DONO=5521xxxxxxxxx
# Coloque abaixo sua chave API do site remove.bg
API_REMOVE_BG=??????
# Coloque abaixo sua chave API do site newsapi.org
API_NEWS_ORG=??????
#Coloque abaixo sua chave API do site WeatherAPI.com
API_CLIMA=??????` 
        await fs.writeFile("./.env", env , 'utf8')
        console.log(".env GERADO")
        console.log("CONFIGURE SEU .env e abra novamente.")
        return
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.criarEnv = criarEnv
exports.emojiStrip = emojiStrip
exports.sleep = sleep
exports.segParaHora = segParaHora
