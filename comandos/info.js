//REQUERINDO MÓDULOS
import fs from 'fs-extra'
import * as menu from '../lib/menu.js'
import { obterMensagensTexto } from '../lib/msgs.js' 
import {criarTexto, erroComandoMsg, removerNegritoComando, timestampParaData} from '../lib/util.js'
import path from 'node:path'
import * as db from '../db-modulos/database.js'
import {botInfo} from "../db-modulos/bot.js"
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'
import {MessageTypes} from '../lib-baileys/mensagem.js'
import {obterBotVariaveis} from '../db-modulos/dados-bot-variaveis.js'


export const info = async(c, messageTranslated) => {
    try{
        const {id, chatId, sender, isGroupMsg, caption, body, username} = messageTranslated
        const {prefixo, nome_bot, nome_adm} = obterBotVariaveis()
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const botNumber = await socketdb.getHostNumberFromBotJSON()
        const groupId = isGroupMsg ? chatId : null
        const groupAdmins = isGroupMsg ? await socketdb.getGroupAdminsFromDb(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender) : false
        const ownerNumber = process.env.NUMERO_DONO?.trim()
        var cmdSemPrefixo = command.replace(prefixo, "")

        const msgs_texto = obterMensagensTexto()

        switch(cmdSemPrefixo){
            case `info`:
                try{
                    var version = JSON.parse(fs.readFileSync(path.resolve('package.json'))).version
                    const botFotoURL = await socket.getProfilePicFromServer(c,botNumber)
                    var infoBot = JSON.parse(fs.readFileSync(path.resolve("database/bot.json")))
                    var botInicializacaoData = timestampParaData(infoBot.iniciado)
                    var resposta = criarTexto(msgs_texto.info.info.resposta, nome_adm?.trim(), nome_bot?.trim(), botInicializacaoData, infoBot.cmds_executados, ownerNumber, version)
                    if(botFotoURL != undefined){
                        await socket.replyFileFromUrl(c, MessageTypes.image, chatId, botFotoURL, resposta, id)
                    } else {
                        await socket.reply(c, chatId, resposta, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break
            
            case `reportar`:
                try{
                    if(args.length == 1) return socket.reply(c, chatId, erroComandoMsg(command) ,id)
                    var usuarioMensagem = body.slice(10).trim(), resposta = criarTexto(msgs_texto.info.reportar.resposta, username, sender.replace("@s.whatsapp.net",""), usuarioMensagem)
                    await socket.sendText(c,ownerNumber+"@s.whatsapp.net", resposta)
                    await socket.reply(c,chatId,msgs_texto.info.reportar.sucesso,id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break
            
            case `meusdados`:
                try{
                    var dadosUsuario = await db.obterUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    var nomeUsuario = username , resposta = criarTexto(msgs_texto.info.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                    if(botInfo().limite_diario.status) resposta += criarTexto(msgs_texto.info.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    if(isGroupMsg){
                        var dadosGrupo = await socketdb.getGroupInfoFromDb(groupId)
                        if(dadosGrupo.contador.status){
                            var usuarioAtividade = await db.obterAtividade(groupId,sender)
                            resposta += criarTexto(msgs_texto.info.meusdados.resposta_grupo, usuarioAtividade.msg)
                        }   
                    }
                    await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case `menu`:
                try{
                    var dadosUsuario = await db.obterUsuario(sender)
                    var tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite", totalComandos = dadosUsuario.comandos_total
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    var dadosResposta = '', nomeUsuario = username
                    if(botInfo().limite_diario.status){
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario, totalComandos)
                    } else {
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_comum, nomeUsuario, tipoUsuario, totalComandos)
                    }
                    dadosResposta += `═════════════════\n`

                    if(args.length == 1){
                        var menuResposta = menu.menuPrincipal()
                        await socket.sendText(c, chatId, dadosResposta+menuResposta)
                    } else {
                        var usuarioOpcao = args[1]
                        var menuResposta = menu.menuPrincipal()
                        switch(usuarioOpcao){
                            case "0":
                                menuResposta = menu.menuInfoSuporte()
                                break
                            case "1":
                                menuResposta = menu.menuFigurinhas()
                                break
                            case "2":
                                menuResposta = menu.menuUtilidades()
                                break
                            case "3":
                                menuResposta = menu.menuDownload()
                                break
                            case "4":
                                if(isGroupMsg) menuResposta = menu.menuGrupo(isGroupAdmins)
                                else return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                                break
                            case "5":
                                menuResposta = menu.menuDiversao(isGroupMsg)
                                break
                            case "6":
                                menuResposta = menu.menuCreditos()
                                break
                        }
                        await socket.sendText(c, chatId, dadosResposta+menuResposta)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        }
    } catch(err){
        consoleErro(err, "INFO")
    }
    

}