const path = require('path')
const fs = require("fs-extra")


const botInfoUpdate = async ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    bot.cmds_executados = bot.cmds_executados + 1
    await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
}

const botStart = async ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    let data = new Date()
    let mes = data.getMonth()+1
    mes = (mes.toString.length == 1) ? `0${mes}` : mes
    let minutos = (data.getMinutes().toString().length == 1) ? `0${data.getMinutes()}` : data.getMinutes()
    let segundos = (data.getSeconds().toString().length == 1) ? `0${data.getSeconds()}` : data.getSeconds()
    bot.iniciado = `${data.getDate()}/${mes}/${data.getFullYear()}  ${data.getHours()}:${minutos}:${segundos}`
    await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
}

const botMudarLimite = async (limite)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    bot.limite_diario_usuarios = limite
    await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
}

exports.botInfoUpdate = botInfoUpdate
exports.botStart = botStart
exports.botMudarLimite = botMudarLimite