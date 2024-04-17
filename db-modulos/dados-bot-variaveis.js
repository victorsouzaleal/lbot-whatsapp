import fs from 'fs-extra'
import path from 'node:path'

export const obterBotVariaveis = () => {
    const existeBotJson = fs.existsSync(path.resolve('database/bot.json')) 
    let nome_bot, nome_adm, nome_sticker, prefixo = "!"
    if(existeBotJson){
        let botInfo = JSON.parse(fs.readFileSync(path.resolve('database/bot.json')))
        nome_bot = botInfo.nome_bot
        nome_adm = botInfo.nome_adm
        nome_sticker = botInfo.nome_pack
        prefixo =  botInfo.prefixo
    }
    return {nome_bot, nome_adm, nome_sticker, prefixo}
}