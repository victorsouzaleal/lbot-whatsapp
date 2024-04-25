//REQUERINDO MODULOS
import * as bot from '../controle/botControle.js'
import * as usuarios from '../controle/usuariosControle.js'
import { criarTexto, guiaComandoMsg, consoleComando } from './util.js'
import {autoSticker} from './sticker.js'
import * as socket from '../baileys/socket-funcoes.js'
import {MessageTypes} from '../baileys/mensagem.js'
import moment from "moment-timezone"
import {grupo} from '../comandos/grupo.js'; import {utilidades} from '../comandos/utilidades.js'; import {diversao} from '../comandos/diversao.js'; import {admin} from '../comandos/admin.js';
import {info} from '../comandos/info.js'; import {figurinhas} from '../comandos/figurinhas.js'; import {downloads} from '../comandos/downloads.js'

import PQueue from 'p-queue';
const queueMensagem = new PQueue({concurrency: 5, timeout: 60000})

export const chamadaComando = async (c, mensagemInfoCompleta) => {
    try {
        const {msgs_texto, lista_comandos, ownerNumber} = mensagemInfoCompleta
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {grupoInfo, isGroupAdmins, formattedTitle} = mensagemInfoCompleta.grupo
        const {command, args, sender, isGroupMsg, type, id, chatId, username} = mensagemInfoCompleta.mensagem
        const t = moment.now()
        const blockedNumbers = await socket.getBlockedIds(c)
        const isBlocked = blockedNumbers.includes(sender)
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const queueMensagemEspera = queueMensagem.size > 10
        let comandoExiste = (
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
            if(queueMensagemEspera) await socket.reply(c, chatId, criarTexto(msgs_texto.geral.fila_comando, queueMensagem.size), id)
            if(lista_comandos.utilidades.includes(command)){
                //UTILIDADES
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c,chatId, await guiaComandoMsg("utilidade", command), id)
                    await utilidades(c, mensagemInfoCompleta)
                    consoleComando(isGroupMsg, "UTILIDADES", command, "#de9a07", t, username, formattedTitle)
                }, {priority: 1})
            }  else if(lista_comandos.figurinhas.includes(command)){
                //FIGURINHAS
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c,chatId, await guiaComandoMsg("figurinhas", command), id)
                    await figurinhas(c, mensagemInfoCompleta)
                    consoleComando(isGroupMsg, "FIGURINHAS", command, "#ae45d1", t, username, formattedTitle)
                }, {priority: 2})
            } else if(lista_comandos.downloads.includes(command)){
                //DOWNLOADS
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c, chatId, await guiaComandoMsg("downloads", command), id)
                    await downloads(c, mensagemInfoCompleta)
                    consoleComando(isGroupMsg, "DOWNLOADS", command, "#2195cf", t, username, formattedTitle)
                }, {priority: 1})
            } else if (lista_comandos.grupo.includes(command)){
                //GRUPO
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c, chatId, await guiaComandoMsg("grupo", command), id)
                    await grupo(c, mensagemInfoCompleta)
                    if(isGroupMsg) consoleComando(isGroupMsg, "ADMINISTRAÇÃO", command, "#e0e031", t, username, formattedTitle)
                }, {priority: 3})
            } else if(lista_comandos.diversao.includes(command)){
                //DIVERSÃO
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c, chatId, await guiaComandoMsg("diversao", command), id)
                    await diversao(c, mensagemInfoCompleta)
                    consoleComando(isGroupMsg, "DIVERSÃO", command, "#22e3dd", t, username, formattedTitle)
                }, {priority: 2})
            } else if(lista_comandos.admin.includes(command)){
                //ADMIN
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c, chatId, await guiaComandoMsg("admin", command), id)
                    await admin(c, mensagemInfoCompleta)
                    consoleComando(isGroupMsg, "DONO", command, "#d1d1d1", t, username, formattedTitle)
                }, {priority: 4})
            } else if(lista_comandos.info.includes(command)){
                //INFO
                queueMensagem.add(async()=>{
                    if(msgGuia) return await socket.reply(c, chatId, await guiaComandoMsg("info", command), id)
                    await info(c, mensagemInfoCompleta)
                    consoleComando(isGroupMsg, "INFO", command, "#8ac46e", t, username, formattedTitle)
                }, {priority: 3})
            }
        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //AUTO-STICKER GRUPO
            if(isGroupMsg && (type == MessageTypes.image || type == MessageTypes.video) && grupoInfo.autosticker){
                //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
                if (isGroupMsg && isBlocked) return
                //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
                if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfoJSON.limitecomandos.status){
                    let usuario = await usuarios.obterDadosUsuario(sender)
                    let limiteComando = await bot.verificarLimiteComando(sender, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await socket.reply(c,chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfoJSON.limite_diario.status){
                    await bot.verificarExpiracaoLimite()
                    let ultrapassou = await usuarios.verificarUltrapassouLimiteComandos(sender)
                    if(!ultrapassou) await usuarios.adicionarContagemDiariaComandos(sender) 
                    else return await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber.replace("@s.whatsapp.net", "")), id)
                } else {
                    await usuarios.adicionarContagemTotalComandos(sender)
                }
                await autoSticker(c, mensagemInfoCompleta)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
            }

            //AUTO-STICKER PRIVADO
            if(!isGroupMsg && (type == MessageTypes.image || type == MessageTypes.video) && botInfoJSON.autosticker){
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfoJSON.limitecomandos.status){
                    let usuario = await usuarios.obterDadosUsuario(sender)
                    let limiteComando = await bot.verificarLimiteComando(sender, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await socket.reply(c, chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfoJSON.limite_diario.status){
                    await bot.verificarExpiracaoLimite()
                    let ultrapassou = await usuarios.verificarUltrapassouLimiteComandos(sender)
                    if(!ultrapassou) await usuarios.adicionarContagemDiariaComandos(sender) 
                    else return await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber.replace("@s.whatsapp.net", "")), id)
                } else {
                    await usuarios.adicionarContagemTotalComandos(sender)
                }
                await autoSticker(c, mensagemInfoCompleta)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
            }

            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfoJSON.limitarmensagens.status){
                let u = await usuarios.obterDadosUsuario(sender)
                let tipo_usuario_pv = u ? u.tipo : "comum"
                let limitarMensagens = await bot.verificarLimitarMensagensPv(sender, tipo_usuario_pv)
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
