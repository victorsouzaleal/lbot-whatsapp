//REQUERINDO MODULOS
import * as db from '../db-modulos/database.js'
import {botLimitarComando, botInfo, botVerificarExpiracaoLimite,botLimitarMensagensPv} from '../db-modulos/bot.js'
import { criarTexto, guiaComandoMsg, removerNegritoComando, consoleErro, consoleComando } from './util.js'
import { obterMensagensTexto } from './msgs.js'
import {autoSticker} from './sticker.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'
import {MessageTypes} from '../lib-baileys/mensagem.js'
import moment from "moment-timezone"
import {obterBotVariaveis} from '../db-modulos/dados-bot-variaveis.js'
import {listarComandos} from '../comandos/comandos.js'

import {grupo} from '../comandos/grupo.js'; import {utilidades} from '../comandos/utilidades.js'; import {diversao} from '../comandos/diversao.js'; import {admin} from '../comandos/admin.js';
import {info} from '../comandos/info.js'; import {figurinhas} from '../comandos/figurinhas.js'; import {downloads} from '../comandos/downloads.js'


export const chamadaComando = async (c, messageTranslated) => {
    try {
        const lista_comandos = listarComandos(), {prefixo, nome_bot, nome_adm} = obterBotVariaveis(), msgs_texto = obterMensagensTexto()
        const {sender, isGroupMsg, type, caption, id, chatId, body, username} = messageTranslated
        const t = moment.now()
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const ownerNumber = process.env.NUMERO_DONO?.trim()
        const groupId = isGroupMsg ? chatId : ''
        const grupoInfo = isGroupMsg ? await socketdb.getGroupInfoFromDb(groupId) : null
        const groupAdmins = isGroupMsg ? grupoInfo.admins : null
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender) : false
        const formattedTitle = grupoInfo?.nome || null
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await socket.getBlockedIds(c)
        const isBlocked = blockedNumbers.includes(sender)
        var comandoExiste = (
            lista_comandos.utilidades.includes(command) ||
            lista_comandos.grupo.includes(command) || 
            lista_comandos.diversao.includes(command) ||
            lista_comandos.admin.includes(command) ||
            lista_comandos.info.includes(command) ||
            lista_comandos.figurinhas.includes(command) ||
            lista_comandos.downloads.includes(command)
        )

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            if(lista_comandos.utilidades.includes(command)){
                //UTILIDADES
                if(msgGuia) return await socket.reply(c,chatId, guiaComandoMsg("utilidade", command), id)
                await utilidades(c,messageTranslated)
                consoleComando(isGroupMsg, "UTILIDADES", command, "#de9a07", t, username, formattedTitle)
            }  else if(lista_comandos.figurinhas.includes(command)){
                //FIGURINHAS
                if(msgGuia) return await socket.reply(c,chatId, guiaComandoMsg("figurinhas", command), id)
                await figurinhas(c,messageTranslated)
                consoleComando(isGroupMsg, "FIGURINHAS", command, "#ae45d1", t, username, formattedTitle)
            } else if(lista_comandos.downloads.includes(command)){
                //DOWNLOADS
                if(msgGuia) return await socket.reply(c, chatId, guiaComandoMsg("downloads", command), id)
                await downloads(c,messageTranslated)
                consoleComando(isGroupMsg, "DOWNLOADS", command, "#2195cf", t, username, formattedTitle)
            } else if (lista_comandos.grupo.includes(command)){
                //GRUPO
                if(msgGuia) return await socket.reply(c, chatId, guiaComandoMsg("grupo", command), id)
                await grupo(c,messageTranslated)
                if(isGroupMsg) consoleComando(isGroupMsg, "ADMINISTRAÇÃO", command, "#e0e031", t, username, formattedTitle)
            } else if(lista_comandos.diversao.includes(command)){
                //DIVERSÃO
                if(msgGuia) return await socket.reply(c, chatId, guiaComandoMsg("diversao", command), id)
                await diversao(c,messageTranslated)
                consoleComando(isGroupMsg, "DIVERSÃO", command, "#22e3dd", t, username, formattedTitle)
            } else if(lista_comandos.admin.includes(command)){
                //ADMIN
                if(msgGuia) return await socket.reply(c, chatId, guiaComandoMsg("admin", command), id)
                await admin(c,messageTranslated)
                consoleComando(isGroupMsg, "DONO", command, "#d1d1d1", t, username, formattedTitle)
            } else if(lista_comandos.info.includes(command)){
                //INFO
                if(msgGuia) return await socket.reply(c, chatId, guiaComandoMsg("info", command), id)
                await info(c, messageTranslated)
                consoleComando(isGroupMsg, "INFO", command, "#8ac46e", t, username, formattedTitle)
            }
        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //AUTO-STICKER GRUPO
            if(isGroupMsg && (type == MessageTypes.image || type == MessageTypes.video) && grupoInfo.autosticker){
                //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
                if (isGroupMsg && isBlocked) return
                //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
                if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfo().limitecomandos.status){
                    let usuario = await db.obterUsuario(sender)
                    let limiteComando = await botLimitarComando(sender, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await socket.reply(c,chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfo().limite_diario.status){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender)
                    if(!ultrapassou) await db.addContagemDiaria(sender) 
                    else return await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender)
                }
                await autoSticker(c, messageTranslated)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
            }

            //AUTO-STICKER PRIVADO
            if(!isGroupMsg && (type == MessageTypes.image || type == MessageTypes.video) && botInfo().autosticker){
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfo().limitecomandos.status){
                    let usuario = await db.obterUsuario(sender)
                    let limiteComando = await botLimitarComando(sender, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await socket.reply(c, chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfo().limite_diario.status){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender)
                    if(!ultrapassou) await db.addContagemDiaria(sender) 
                    else return await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender)
                }
                await autoSticker(c, messageTranslated)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
            }

            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfo().limitarmensagens.status){
                let u = await db.obterUsuario(sender)
                let tipo_usuario_pv = u ? u.tipo : "bronze"
                let limitarMensagens = await botLimitarMensagensPv(sender, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    await socket.sendText(sender, limitarMensagens.msg)
                    return await socket.contactBlock(sender)
                }
            }
        }
    } catch (err) {
        err.message = `chamadaComando - ${err.message}`
        throw err
    }
}
