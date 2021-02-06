
//REQUERINDO MODULOS
require('dotenv').config()
const fs = require('fs-extra')
const moment = require('moment-timezone')
const color = require('./lib/color')
const db = require('./database/database')
moment.tz.setDefault('America/Sao_Paulo')
const {botInfoUpdate, botLimitarComando, botInfo, botVerificarExpiracaoLimite,botLimitarMensagensPv} = require("./lib/bot")

//COMANDOS
const lista_comandos = JSON.parse(fs.readFileSync('./comandos/comandos.json'))
const admin_grupo = require('./comandos/admin_grupo')
const utilidades = require('./comandos/utilidades')
const diversao = require('./comandos/diversao')
const dono_bot = require('./comandos/dono_bot')


module.exports = msgHandler = async (client, message) => {
    try {
        const {t, sender, isGroupMsg, chat, type, caption,id, from} = message
        let { body } = message
        const {formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const g_info = isGroupMsg ? await db.obterGrupo(groupId) : ''

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
        const comandoExiste = (lista_comandos.utilidades.includes(command) || lista_comandos.admin_grupo.includes(command) || lista_comandos.diversao.includes(command) ||lista_comandos.dono_bot.includes(command)) 
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
       
        //SE NÃO FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
        if (!isGroupMsg && isBlocked) return

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, ADICIONA A CONTAGEM
        if(isGroupMsg && g_info.contador.status) await db.addContagem(groupId,sender.id,type)

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            let registrado = await db.verificarRegistro(sender.id)
            //SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
            if(!registrado) {
                if(ownerNumber.includes(sender.id.replace("@c.us", ""))){
                    await db.registrarDono(sender.id, pushname)
                } else {
                    await db.registrarUsuarioComum(sender.id, pushname)
                }
            }

            //ATUALIZE NOME DO USUÁRIO 
            await db.atualizarNome(sender.id, pushname)

            //SE FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
            if (isGroupMsg && isBlocked) {
                return
            }
            
            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfo().limitecomandos.status){
                let usuario = await db.obterUsuario(sender.id)
                let limiteComando = botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) client.reply(from, limiteComando.msg, id)
                    return 
                }
            }
            
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && g_info.block_cmds.includes(command) && !isGroupAdmins) return client.reply(from,`[❗] O comando *${command}* está temporariamente bloqueado neste grupo pelo administrador.`,id)

            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES
            if(botInfo().limite_diario.status && !lista_comandos.excecoes_contagem.includes(command)){
                //LIMITADOR DIARIO DE COMANDOS
                await botVerificarExpiracaoLimite()
                let ultrapassou = await db.ultrapassouLimite(sender.id)
                if(!ultrapassou){ //SE NÃO ULTRAPASSAR LIMITE DIARIO
                    await db.addContagemDiaria(sender.id) // ADICIONA CONTAGEM
                } else { //SE ULTRAPASSAR
                    return client.reply(from, 
                    (pushname != undefined) ? `[❗]  ${pushname} - você ultrapassou seu limite diário de ${botInfo().limite_diario_usuarios} comandos por dia.`
                    : `[❗]  Você ultrapassou seu limite diário de ${botInfo().limite_diario_usuarios} comandos por dia.`
                    ,id) 
                }
            } else if(botInfo().limite_diario.status && lista_comandos.excecoes_contagem.includes(command)) {
                await db.addContagemTotal(sender.id)
                await botVerificarExpiracaoLimite()
            } else {
                await db.addContagemTotal(sender.id)
            }
          
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await botInfoUpdate()

        } else {// SE NÃO FOR UM COMANDO EXISTENTE

            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfo().limitarmensagens.status){
                let u = await db.obterUsuario(sender.id)
                let tipo_usuario_pv = (u != null) ? u.tipo : "comum"
                let limitarMensagens = botLimitarMensagensPv(sender.id, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    client.sendText(sender.id, limitarMensagens.msg).then(async()=>{
                        await client.contactBlock(sender.id)
                    })
                    return 
                }
            }
        }

        //APÓS TODAS AS VERIFICAÇÕES SOLICITE OS COMANDOS
        if(lista_comandos.utilidades.includes(command)){
            await utilidades(client,message)
        } else if (lista_comandos.admin_grupo.includes(command)){
            await admin_grupo(client,message)
        } else if(lista_comandos.diversao.includes(command)){
            await diversao(client,message)
        } else if(lista_comandos.dono_bot.includes(command)){
            await dono_bot(client,message)
        } else {
            if(!isGroupMsg) return client.reply(from, "[❗] Parece que você não digitou corretamente o comando ou não sabe como usá-los, digite o comando *!ajuda* para mais informações.",id)
        }

    } catch (err) {
        console.log(color('[ERRO]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
