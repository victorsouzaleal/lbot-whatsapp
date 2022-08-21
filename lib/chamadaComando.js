//REQUERINDO MODULOS
const { MessageTypes } = require('@open-wa/wa-automate')
const path = require("path")
const fs = require('fs-extra')
const db = require('./database')
const {botLimitarComando, botInfo, botVerificarExpiracaoLimite,botLimitarMensagensPv} = require("./bot")
const { criarTexto, guiaComandoMsg, removerNegritoComando, consoleErro, consoleComando } = require('./util')
const msgs_texto = require('./msgs')
const {autoSticker} = require("./sticker")
const moment = require('moment-timezone')

//COMANDOS
const lista_comandos = JSON.parse(fs.readFileSync(path.resolve('comandos/comandos.json')))
const grupo = require('../comandos/grupo'), utilidades = require('../comandos/utilidades'), diversao = require('../comandos/diversao'), admin = require('../comandos/admin'), info = require('../comandos/info'), figurinhas = require('../comandos/figurinhas'), downloads = require('../comandos/downloads')

module.exports = chamadaComando = async (client, message) => {
    try {
        const t = moment.now()
        const {sender, isGroupMsg, chat, type, caption, id, chatId, body} = message
        const {formattedTitle} = chat, { pushname, verifiedName, formattedName } = sender, username = pushname || verifiedName || formattedName
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const ownerNumber = process.env.NUMERO_DONO.trim()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const grupoInfo = isGroupMsg ? await db.obterGrupo(groupId) : ''
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await client.getBlockedIds()
        const isBlocked = blockedNumbers.includes(sender.id)
        var comandoExiste = (
            lista_comandos.utilidades.includes(command) ||
            lista_comandos.grupo.includes(command) || 
            lista_comandos.diversao.includes(command) ||
            lista_comandos.admin.includes(command) ||
            lista_comandos.info.includes(command) ||
            lista_comandos.figurinhas.includes(command) ||
            lista_comandos.downloads.includes(command)
        )
        const abrirMenu = commands.match(/comandos|comando|ajuda|menu|help/gmi) && !isGroupMsg && !comandoExiste && !message.fromMe
        if(abrirMenu) command = "!menu", comandoExiste = true

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            if(lista_comandos.utilidades.includes(command)){
                //UTILIDADES
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("utilidade", command), id)
                await utilidades(client,message)
                consoleComando(isGroupMsg, "UTILIDADES", command, "#de9a07", t, username, formattedTitle)
            }  else if(lista_comandos.figurinhas.includes(command)){
                //FIGURINHAS
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("figurinhas", command), id)
                await figurinhas(client,message)
                consoleComando(isGroupMsg, "FIGURINHAS", command, "#ae45d1", t, username, formattedTitle)
            } else if(lista_comandos.downloads.includes(command)){
                //DOWNLOADS
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("downloads", command), id)
                await downloads(client,message)
                consoleComando(isGroupMsg, "DOWNLOADS", command, "#2195cf", t, username, formattedTitle)
            } else if (lista_comandos.grupo.includes(command)){
                //GRUPO
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("grupo", command), id)
                await grupo(client,message)
                if(isGroupMsg) consoleComando(isGroupMsg, "ADMINISTRAÇÃO", command, "#e0e031", t, username, formattedTitle)
            } else if(lista_comandos.diversao.includes(command)){
                //DIVERSÃO
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("diversao", command), id)
                await diversao(client,message)
                consoleComando(isGroupMsg, "DIVERSÃO", command, "#22e3dd", t, username, formattedTitle)
            } else if(lista_comandos.admin.includes(command)){
                //ADMIN
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("admin", command), id)
                await admin(client,message)
                consoleComando(isGroupMsg, "DONO", command, "#d1d1d1", t, username, formattedTitle)
            } else if(lista_comandos.info.includes(command)){
                //INFO
                if(msgGuia) return await client.reply(chatId, guiaComandoMsg("info", command), id)
                await info(client, message, abrirMenu)
                consoleComando(isGroupMsg, "INFO", command, "#8ac46e", t, username, formattedTitle)
            }
        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //AUTO-STICKER GRUPO
            if(isGroupMsg && (type == MessageTypes.IMAGE || type == MessageTypes.VIDEO) && grupoInfo.autosticker){
                //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
                if (isGroupMsg && isBlocked) return
                //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
                if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfo().limitecomandos.status){
                    let usuario = await db.obterUsuario(sender.id)
                    let limiteComando = await botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await client.reply(chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfo().limite_diario.status){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender.id)
                    if(!ultrapassou) await db.addContagemDiaria(sender.id) 
                    else return await client.reply(chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender.id)
                }
                await autoSticker(client, message)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
            }

            //AUTO-STICKER PRIVADO
            if(!isGroupMsg && (type == MessageTypes.IMAGE || type == MessageTypes.VIDEO) && botInfo().autosticker){
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfo().limitecomandos.status){
                    let usuario = await db.obterUsuario(sender.id)
                    let limiteComando = await botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await client.reply(chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfo().limite_diario.status){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender.id)
                    if(!ultrapassou) await db.addContagemDiaria(sender.id) 
                    else return await client.reply(chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender.id)
                }
                await autoSticker(client, message)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
            }

            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfo().limitarmensagens.status){
                let u = await db.obterUsuario(sender.id)
                let tipo_usuario_pv = u ? u.tipo : "bronze"
                let limitarMensagens = await botLimitarMensagensPv(sender.id, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    await client.sendText(sender.id, limitarMensagens.msg)
                    return client.contactBlock(sender.id)
                }
            }
        }
    } catch (err) {
        consoleErro(err, 'chamadaComando')
    }
}
