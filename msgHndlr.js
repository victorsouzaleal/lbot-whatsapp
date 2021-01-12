
//REQUERINDO MODULOS
require('dotenv').config()
const fs = require('fs-extra')
const moment = require('moment-timezone')
const color = require('./lib/color')
const db = require('./database/database')
moment.tz.setDefault('America/Sao_Paulo')

//COMANDOS
const lista_comandos = JSON.parse(fs.readFileSync('./comandos/comandos.json'))
const admin_grupo = require('./comandos/admin_grupo')
const utilidades = require('./comandos/utilidades')
const diversao = require('./comandos/diversao')
const dono_bot = require('./comandos/dono_bot')


module.exports = msgHandler = async (client, message) => {
    try {
        const {t, sender, isGroupMsg, chat, caption,id, from} = message
        let { body } = message
        const {formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot

        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const blockNumber = await client.getBlockedIds()
        const isBlocked = blockNumber.includes(sender.id)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return

        if(lista_comandos.utilidades.includes(command) || lista_comandos.admin_grupo.includes(command) || lista_comandos.diversao.includes(command) ||lista_comandos.dono_bot.includes(command)){
            let registrado = await db.verificarRegistro(sender.id)
            if(!registrado) {
                let nome_usuario = (pushname == undefined)? verifiedName : pushname
                if(ownerNumber.includes(sender.id.replace("@c.us", ""))){
                    await db.registrarDono(sender.id, nome_usuario)
                } else {
                    await db.registrarUsuarioComum(sender.id, nome_usuario)
                }
            }
            if(!lista_comandos.excecoes_contagem.includes(command)){
                let ultrapassou = await db.ultrapassouLimite(sender.id)
                if(!ultrapassou){
                    await db.addContagem(sender.id)
                } else {
                    duser  = await db.obterUsuario(sender.id)
                    return client.reply(from, `${duser.nome} - você ultrapassou seu limite diário de ${duser.max_comandos_dia} comandos por dia.`,id)
                }
            }
        }

        if(lista_comandos.utilidades.includes(command)){
            await utilidades(client,message)
        } else if (lista_comandos.admin_grupo.includes(command)){
            await admin_grupo(client,message)
        } else if(lista_comandos.diversao.includes(command)){
            await diversao(client,message)
        } else if(lista_comandos.dono_bot.includes(command)){
            await dono_bot(client,message)
        } else {
            if(!isGroupMsg) return client.reply(from, "[❗] Parece que você não digitou corretamente o comando ou não sabe como usá-los, digite *!ajuda* para mais informações.",id)
        }

    } catch (err) {
        console.log(color('[ERRO]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
