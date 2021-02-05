const path = require('path')
const fs = require("fs-extra")


const botInfoUpdate = async ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    bot.cmds_executados = bot.cmds_executados + 1
    await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
}

const botInfo= ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    return bot
}

const botStart = async ()=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    let data = new Date()
    let dia = `0${data.getDate()}`, mes = `0${data.getMonth()+1}`, horas = `0${data.getHours()}`, minutos = `0${data.getMinutes()}`, segundos = `0${data.getSeconds()}`
    bot.iniciado = `${dia.substr(-2)}/${mes.substr(-2)}/${data.getFullYear()}  ${horas.substr(-2)}:${minutos.substr(-2)}:${segundos.substr(-2)}`
    await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
}

// * LIMITE DIARIO DE COMANDOS
const botQtdLimiteDiario = async (limite)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    bot.limite_diario.qtd = parseInt(limite)
    await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    await db.definirLimite(parseInt(limite))
}

const botAlterarLimiteDiario = async (status,qtd=40)=>{
    let db = require(path.resolve("database/database.js"))
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    let timestamp_atual = Math.round(new Date().getTime()/1000)
    bot.limite_diario.expiracao = (status) ? timestamp_atual+86400 : 0
    bot.limite_diario.status = status
    bot.limite_diario.qtd = (status) ? parseInt(qtd) : null
    fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    if(status){
        await db.definirLimite(parseInt(qtd))
    } else {
        await db.resetarComandosDia()
        await db.definirLimite(null)
    }
}

const botVerificarExpiracaoLimite = async ()=>{
    let db = require(path.resolve("database/database.js"))
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    let timestamp_atual = Math.round(new Date().getTime()/1000)
    if(timestamp_atual >= bot.limite_diario.expiracao){
        await db.resetarComandosDia()
        bot.limite_diario.expiracao = bot.limite_diario.expiracao + 86400
        fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    } 
}
//

// * LIMITE DE COMANDOS POR MINUTO
const botAlterarLimitador = (status= true, cmds_minuto = 5, tempo_bloqueio= 60)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    bot.limitecomandos.status = status
    bot.limitecomandos.cmds_minuto_max = cmds_minuto
    bot.limitecomandos.tempo_bloqueio = tempo_bloqueio
    bot.limitecomandos.usuarios = []
    bot.limitecomandos.usuarios_limitados = []
    fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
}

const botLimitarComando = (usuario_id, tipo_usuario, isAdmin)=>{
    let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
    let timestamp_atual = Math.round(new Date().getTime()/1000)

    //VERIFICA OS USUARIOS LIMITADOS QUE JÁ ESTÃO EXPIRADOS E REMOVE ELES DA LISTA
    for (let i = 0; i < bot.limitecomandos.usuarios_limitados.length; i++){
        if(bot.limitecomandos.usuarios_limitados[i].horario_liberacao <= timestamp_atual) bot.limitecomandos.usuarios_limitados.splice(i,1)
    }

    //VERIFICA OS USUARIOS QUE JÁ ESTÃO COM COMANDO EXPIRADOS NO ULTIMO MINUTO
    for (let i = 0; i < bot.limitecomandos.usuarios.length; i++){
        if(bot.limitecomandos.usuarios[i].expiracao <= timestamp_atual) bot.limitecomandos.usuarios.splice(i,1)
    }

    
    //SE NÃO FOR UM USUARIO DO TIPO COMUM OU FOR ADMINISTRADOR DO GRUPO , NÃO FAÇA A CONTAGEM.
     if(tipo_usuario != "comum" || isAdmin){
        fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
        return {comando_bloqueado: false}
    }

    //VERIFICA SE O USUARIO ESTÁ LIMITADO
    let usuarioIndexLimitado = bot.limitecomandos.usuarios_limitados.findIndex(usuario=> usuario.usuario_id == usuario_id)
    if(usuarioIndexLimitado != -1) {
        fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
        return {comando_bloqueado: true}
    }

    //OBTEM O INDICE DO USUARIO NA LISTA DE USUARIOS
    let usuarioIndex = bot.limitecomandos.usuarios.findIndex(usuario=> usuario.usuario_id == usuario_id)

    //VERIFICA SE O USUARIO ESTÁ NA LISTA DE USUARIOS
    if(usuarioIndex != -1){
        bot.limitecomandos.usuarios[usuarioIndex].cmds++ //ADICIONA A CONTAGEM DE COMANDOS ATUAIS
        if(bot.limitecomandos.usuarios[usuarioIndex].cmds >= bot.limitecomandos.cmds_minuto_max){ //SE ATINGIR A QUANTIDADE MAXIMA DE COMANDOS POR MINUTO
            //ADICIONA A LISTA DE USUARIOS LIMITADOS
            bot.limitecomandos.usuarios_limitados.push({usuario_id, horario_liberacao: timestamp_atual + bot.limitecomandos.tempo_bloqueio})
            bot.limitecomandos.usuarios.splice(usuarioIndex,1)
            fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
            return {
                comando_bloqueado: true,
                msg: `[❗] Você está impossibilitado de mandar comandos por *${bot.limitecomandos.tempo_bloqueio}* segundos, pega leve cara.`
            }
        } else { //SE NÃO ATINGIU A QUANTIDADE MÁXIMA DE COMANDOS
            fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
            return {comando_bloqueado: false}
        }
    } else {//SE NÃO EXISTIR NA LISTA
       bot.limitecomandos.usuarios.push({usuario_id, cmds: 1, expiracao: timestamp_atual+60})
       fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
       return {comando_bloqueado: false} 
    }
    //
}

exports.botInfoUpdate = botInfoUpdate
exports.botInfo = botInfo
exports.botStart = botStart
exports.botQtdLimiteDiario = botQtdLimiteDiario
exports.botAlterarLimitador = botAlterarLimitador
exports.botLimitarComando = botLimitarComando
exports.botAlterarLimiteDiario = botAlterarLimiteDiario
exports.botVerificarExpiracaoLimite = botVerificarExpiracaoLimite