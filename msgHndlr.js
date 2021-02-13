
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
const { preencherTexto } = require('./lib/util')
const { msgs_texto } = require('./lib/msgs')


module.exports = msgHandler = async (client, message) => {
    try {
        const timestamp_inicio = new Date().getTime()
        const {t, sender, isGroupMsg, chat, type, caption,id, from} = message
        let { body } = message
        const {formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot
        const isOwner = ownerNumber.includes(sender.id.replace(/@c.us/g, ''))
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
       
        //1.0 - SE NÃO FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
        if (!isGroupMsg && isBlocked) return

        //2.0- SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, ADICIONA A CONTAGEM
        if(isGroupMsg && g_info.contador.status) await db.addContagem(groupId,sender.id,type)

        //3.0 - SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            let registrado = await db.verificarRegistro(sender.id)
            //3.0.1 - SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
            if(!registrado) {
                if(ownerNumber.includes(sender.id.replace("@c.us", ""))){
                    await db.registrarDono(sender.id, pushname)
                } else {
                    await db.registrarUsuarioComum(sender.id, pushname)
                }
            }

            //3.0.2 - ATUALIZE NOME DO USUÁRIO 
            await db.atualizarNome(sender.id, pushname)

            //3.0.3 - SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
            if (isGroupMsg && isBlocked) {
                return
            }

            //3.0.4 - SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
            if(isGroupMsg && !isGroupAdmins && g_info.mutar) return
            
            //3.0.5 - LIMITACAO DE COMANDO POR MINUTO
            if(botInfo().limitecomandos.status){
                let usuario = await db.obterUsuario(sender.id)
                let limiteComando = botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) client.reply(from, limiteComando.msg, id)
                    return 
                }
            }
            


            //3.0.6 - BLOQUEIO GLOBAL DE COMANDOS
            if(botInfo().bloqueio_cmds.includes(command) && !isOwner){
                return client.reply(from, preencherTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, command), id)
            }
            
            //3.0.7 - SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && g_info.block_cmds.includes(command) && !isGroupAdmins) return client.reply(from,preencherTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, command), id)

            //3.0.8 - SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES
            if(botInfo().limite_diario.status && !lista_comandos.excecoes_contagem.includes(command)){
                //LIMITADOR DIARIO DE COMANDOS
                await botVerificarExpiracaoLimite()
                let ultrapassou = await db.ultrapassouLimite(sender.id)
                if(!ultrapassou){ // 3.0.8.1 - SE NÃO ULTRAPASSAR LIMITE DIARIO
                    await db.addContagemDiaria(sender.id) // ADICIONA CONTAGEM
                } else { //3.0.8.2 - SE ULTRAPASSAR LIMITE DIARIO
                    pushname = (pushname != undefined) ? pushname : ""
                    return client.reply(from, preencherTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, pushname, botInfo().limite_diario.qtd, id))
                }
            } else if(botInfo().limite_diario.status && lista_comandos.excecoes_contagem.includes(command)) {
                await db.addContagemTotal(sender.id)
                await botVerificarExpiracaoLimite()
            } else {
                await db.addContagemTotal(sender.id)
            }
          
            //3.0.9 - ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await botInfoUpdate()

        } else { // 4.0 SE NÃO FOR UM COMANDO EXISTENTE
            //4.0.1 - SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
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

        //5.0 - APÓS TODAS AS VERIFICAÇÕES SOLICITE OS COMANDOS
        if(lista_comandos.utilidades.includes(command)){
            await utilidades(client,message)
            const timestamp_pos_comando = new Date().getTime(), tempo_resposta = (timestamp_pos_comando - timestamp_inicio)/1000
            if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', color("[PRIVADO - UTILIDADE]","orange"), time, color(msgs(command)), 'de', color(pushname), `(${color(tempo_resposta+"s")})`)
            if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', color("[GRUPO - UTILIDADE]","orange"), time, color(msgs(command)), 'de', color(pushname), 'em', color(formattedTitle), `(${color(tempo_resposta+"s")})`)
        } else if (lista_comandos.admin_grupo.includes(command)){
            await admin_grupo(client,message)
            const timestamp_pos_comando = new Date().getTime(), tempo_resposta = (timestamp_pos_comando - timestamp_inicio)/1000
            if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', color("[GRUPO - ADMINISTRAÇÃO]","yellow"), time, color(msgs(command)), 'de', color(pushname), 'em', color(formattedTitle), `(${color(tempo_resposta+"s")})`)
        } else if(lista_comandos.diversao.includes(command)){
            await diversao(client,message)
            const timestamp_pos_comando = new Date().getTime(), tempo_resposta = (timestamp_pos_comando - timestamp_inicio)/1000
            if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>',color("[PRIVADO - DIVERSÃO]","cyan"), time, color(msgs(command)), 'de', color(pushname), `(${color(tempo_resposta+"s")})`)
            if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', color("[GRUPO - DIVERSÃO]","cyan"), time, color(msgs(command)), 'de', color(pushname), 'em', color(formattedTitle), `(${color(tempo_resposta+"s")})`)
        } else if(lista_comandos.dono_bot.includes(command)){
            await dono_bot(client,message)
            const timestamp_pos_comando = new Date().getTime(), tempo_resposta = (timestamp_pos_comando - timestamp_inicio)/1000
            if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', color("[PRIVADO - DONO]","white"), time, color(msgs(command)), 'de', color(pushname), `(${color(tempo_resposta+"s")})`)
            if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', color("[GRUPO - DONO]","white"), time, color(msgs(command)), 'de', color(pushname), 'em', color(formattedTitle), `(${color(tempo_resposta+"s")})`)
        } else {
            if(!isGroupMsg) return client.reply(from, msgs_texto.geral.comando_invalido ,id)
        }

    } catch (err) {
        console.log(color('[ERRO]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
