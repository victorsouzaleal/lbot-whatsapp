const fs = require('fs-extra')
const emoji = require('emoji-regex')



const emojiStrip = (string) => {
    return string.replace(emoji, '')
}

const criarArquivosJson = async ()=>{
    try {
      if(!fs.existsSync('./lib/recursos.json')){
        await fs.writeFile("./lib/recursos.json", JSON.stringify({"bemvindo":[],"antilink":[],"antifake":[],"antiflood":{"grupos":[],"dados":[]}}) , 'utf8')
        console.log("JSON - Recursos GERADO")
      } 
      if(!fs.existsSync('./.env')) {
        const env = `# Coloque abaixo seu número com o código do país incluído 
NUMERO_DONO=5521xxxxxxxxx
# Coloque abaixo sua chave API do site remove.bg
API_REMOVE_BG=??????
# Coloque abaixo sua chave API do site newsapi.org
API_NEWS_ORG=??????` 
        await fs.writeFile("./.env", env , 'utf8')
        console.log(".env GERADO")
        console.log("CONFIGURE SEU .env e abra novamente.")
        return
      }
    } catch(err){
        console.log(err)
    }
}


const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.criarArquivosJson = criarArquivosJson
exports.emojiStrip = emojiStrip
exports.sleep = sleep
