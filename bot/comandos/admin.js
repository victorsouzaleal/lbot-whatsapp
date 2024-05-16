//REQUERINDO MODULOS
import * as menu from '../lib/menu.js'
import moment from "moment-timezone"
import {criarTexto,erroComandoMsg, timestampParaData, consoleErro, versaoAtual} from '../lib/util.js'
import * as socket from '../baileys/socket.js'
import {BotControle} from '../controles/BotControle.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import { MessageTypes } from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import os from 'node:os'
import {obterMensagensTexto} from '../lib/msgs.js'


export const admin = async(c, mensagemBaileys, botInfoJSON) => {
    const bot = new BotControle()
    const usuarios = new UsuarioControle()
    const grupos = new GrupoControle()
    const msgs_texto = obterMensagensTexto(botInfoJSON)
    const ownerNumber = botInfoJSON.numero_dono, botNumber = botInfoJSON.hostNumber, {prefixo, nome_bot, nome_adm} = botInfoJSON
    const {groupId} = mensagemBaileys.grupo
    const {isOwner, textoRecebido, command, args, id, chatId, isGroupMsg, t, type, mimetype, isMedia, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList } = mensagemBaileys

    if (!isOwner) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_dono_bot, id)
    const blockNumber = await socket.obterContatosBloqueados(c)
    let cmdSemPrefixo = command.replace(prefixo, "")

    try{
        switch(cmdSemPrefixo){
            case "admin":
                try{
                    await socket.enviarTexto(c, chatId, menu.menuAdmin(botInfoJSON))
                } catch(err){
                    throw err
                }
                break

            case "infocompleta":
                try{
                    let version = versaoAtual()
                    let infoBot = botInfoJSON
                    let expiracaoLimiteDiario = timestampParaData(infoBot.limite_diario.expiracao * 1000)
                    let botInicializacaoData = timestampParaData(infoBot.iniciado)
                    let resposta = criarTexto(msgs_texto.admin.infocompleta.resposta_superior, nome_adm?.trim(), nome_bot?.trim(), botInicializacaoData, version)
                    // AUTO-STICKER
                    resposta += (infoBot.autosticker) ? msgs_texto.admin.infocompleta.resposta_variavel.autosticker.on: msgs_texto.admin.infocompleta.resposta_variavel.autosticker.off
                    // PV LIBERADO
                    resposta += (infoBot.pvliberado) ? msgs_texto.admin.infocompleta.resposta_variavel.pvliberado.on: msgs_texto.admin.infocompleta.resposta_variavel.pvliberado.off
                    // LIMITE COMANDOS DIARIO
                    resposta += (infoBot.limite_diario.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.on,  expiracaoLimiteDiario) : msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.off
                    // LIMITE COMANDOS POR MINUTO
                    resposta += (infoBot.limitecomandos.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.on, infoBot.limitecomandos.cmds_minuto_max, infoBot.limitecomandos.tempo_bloqueio) : msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.off
                    // BLOQUEIO DE COMANDOS
                    let comandosBloqueados = []
                    for(let comandoBloqueado of infoBot.bloqueio_cmds){
                        comandosBloqueados.push(prefixo+comandoBloqueado)
                    }
                    resposta += (infoBot.bloqueio_cmds.length != 0) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.on, comandosBloqueados.toString()) : msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.off
                    resposta += criarTexto(msgs_texto.admin.infocompleta.resposta_inferior, blockNumber.length, infoBot.cmds_executados, ownerNumber.replace("@s.whatsapp.net", ""))
                    await socket.obterFotoPerfil(c, botNumber).then(async (fotoBot)=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, chatId, fotoBot, resposta, id)
                    }).catch(async ()=>{
                        await socket.responderTexto(c, chatId, resposta, id)
                    })
                } catch(err){
                    throw err
                }

                break
                
            case 'entrargrupo':
                try{
                    if (args.length < 2) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let linkGrupo = args[1]
                    let linkValido = linkGrupo.match(/(https:\/\/chat.whatsapp.com)/gi)
                    if (!linkValido) return await socket.responderTexto(c, chatId, msgs_texto.admin.entrar_grupo.link_invalido, id)
                    let idLink = linkGrupo.replace(/(https:\/\/chat.whatsapp.com\/)/gi, '')
                    await socket.entrarLinkGrupo(c, idLink).then(async (res)=>{
                        if (res == undefined) await socket.responderTexto(c, chatId, msgs_texto.admin.entrar_grupo.pendente,id)
                        else await socket.responderTexto(c, chatId, msgs_texto.admin.entrar_grupo.entrar_sucesso,id)
                    }).catch(async ()=>{
                        await socket.responderTexto(c, chatId, msgs_texto.admin.entrar_grupo.entrar_erro, id)
                    })
                } catch(err){
                    throw err
                }

                break

            case 'sair':
                try{
                    if(args.length > 1){
                        let gruposAtuais = await grupos.obterTodosGruposInfo()
                        let indexGrupo = textoRecebido.slice(6).trim()
                        if(isNaN(indexGrupo)) return await socket.responderTexto(c, chatId, msgs_texto.admin.sair.nao_encontrado, id)
                        indexGrupo = parseInt(indexGrupo) - 1
                        if(!gruposAtuais[indexGrupo]) return await socket.responderTexto(c, chatId, msgs_texto.admin.sair.nao_encontrado, id)
                        await socket.sairGrupo(c, gruposAtuais[indexGrupo].id_grupo)
                        await socket.enviarTexto(c, ownerNumber, msgs_texto.admin.sair.resposta_admin)
                    } else if(args.length == 1 && isGroupMsg){
                        await socket.sairGrupo(c, groupId)
                        await socket.enviarTexto(c, ownerNumber, msgs_texto.admin.sair.resposta_admin)
                    } else{
                        await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON) ,id)
                    }
                } catch(err){
                    throw err
                }
                break

            case 'listablock':
                try{
                    if(blockNumber.length == 0) return await socket.responderTexto(c, chatId, msgs_texto.admin.listablock.lista_vazia, id)
                    let resposta = criarTexto(msgs_texto.admin.listablock.resposta_titulo, blockNumber.length)
                    for (let i of blockNumber) resposta += criarTexto(msgs_texto.admin.listablock.resposta_itens, i.replace(/@s.whatsapp.net/g,''))
                    await socket.responderTexto(c, chatId, resposta, id)
                } catch(err){
                    throw err
                }
                break

            case "bcmdglobal":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON) ,id)
                    let usuarioComandos = textoRecebido.slice(12).split(" "), respostaBloqueio = await bot.bloquearComandosGlobal(usuarioComandos, botInfoJSON)
                    await socket.responderTexto(c, chatId, respostaBloqueio, id)
                } catch(err){
                    throw err
                }
                break
            
            case "dcmdglobal":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId,erroComandoMsg(command, botInfoJSON),id)
                    let usuarioComandos = textoRecebido.slice(12).split(" "), respostaDesbloqueio = await bot.desbloquearComandosGlobal(usuarioComandos, botInfoJSON)
                    await socket.responderTexto(c, chatId, respostaDesbloqueio, id)
                } catch(err){
                    throw err
                }
                break
            
            case 'sairgrupos':
                try{
                    let gruposAtuais = await grupos.obterTodosGruposInfo()
                    for (let grupo of gruposAtuais) await socket.sairGrupo(c, grupo.id_grupo)
                    let resposta = criarTexto(msgs_texto.admin.sairtodos.resposta, gruposAtuais.length)
                    await socket.responderTexto(c, ownerNumber, resposta, id)
                } catch(err){
                    throw err
                }
                break

            case "bloquear":
                try{
                    let usuariosBloqueados = []
                    if(quotedMsg){
                        usuariosBloqueados.push(quotedMsgObjInfo.sender)
                    } else if(mentionedJidList.length > 1) {
                        usuariosBloqueados = mentionedJidList
                    } else {
                        let numeroInserido = textoRecebido.slice(10).trim()
                        if(numeroInserido.length == 0) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                        usuariosBloqueados.push(numeroInserido.replace(/\W+/g,"")+"@s.whatsapp.net")
                    }
                    for (let usuario of usuariosBloqueados){
                        if(ownerNumber == usuario){
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.bloquear.erro_dono, usuario.replace(/@s.whatsapp.net/g, '')), id)
                        } else {
                            if(blockNumber.includes(usuario)) {
                                await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.bloquear.ja_bloqueado, usuario.replace(/@s.whatsapp.net/g, '')), id)
                            } else {
                                await socket.bloquearContato(c, usuario)
                                await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.bloquear.sucesso, usuario.replace(/@s.whatsapp.net/g, '')), id)
                            }
                        }
                    }
                } catch(err){
                    throw err
                }
                break      

            case "desbloquear":
                try{
                    let usuariosDesbloqueados = []
                    if(quotedMsg){
                        usuariosDesbloqueados.push(quotedMsgObjInfo.sender)
                    } else if(mentionedJidList.length > 1) {
                        usuariosDesbloqueados = mentionedJidList
                    } else {
                        let numeroInserido = textoRecebido.slice(13).trim()
                        if(numeroInserido.length == 0) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                        usuariosDesbloqueados.push(numeroInserido.replace(/\W+/g,"")+"@s.whatsapp.net")
                    }
                    for (let usuario of usuariosDesbloqueados){
                        if(!blockNumber.includes(usuario)) {
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.desbloquear.ja_desbloqueado, usuario.replace(/@s.whatsapp.net/g,'')), id)
                        } else {
                            await socket.desbloquearContato(c, usuario)
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.desbloquear.sucesso, usuario.replace(/@s.whatsapp.net/g,'')), id)
                        }
                    }
                } catch(err){
                    throw err
                }
                break

            case "autostickerpv":
                try{
                    let novoEstado = !botInfoJSON.autosticker
                    if(novoEstado){
                        await bot.alterarAutoSticker(true, botInfoJSON)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.autostickerpv.ativado,id)
                    } else {
                        await bot.alterarAutoSticker(false, botInfoJSON)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.autostickerpv.desativado,id)
                    } 
                } catch(err){
                    throw err
                }
                break

            case "pvliberado":
                try{
                    let novoEstado = !botInfoJSON.pvliberado
                    if(novoEstado){
                        await bot.alterarPvLiberado(true, botInfoJSON)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.pvliberado.ativado,id)
                    } else {
                        await bot.alterarPvLiberado(false, botInfoJSON)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.pvliberado.desativado,id)
                    } 
                } catch(err){
                    throw err
                }
                break

            case "fotobot":
                try{
                    if(!isMedia && !quotedMsg) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON) , id)
                    let dadosMensagem = {
                        tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                        mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                        mensagem: (isMedia) ? id : quotedMsgObj
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON) , id)
                    let fotoBuffer = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                    await socket.alterarFotoPerfil(c, botNumber, fotoBuffer)
                    await socket.responderTexto(c, chatId, msgs_texto.admin.fotobot.sucesso, id)
                } catch(err){
                    throw err
                }
                break

            case "limitediario":
                try{
                    let novoEstado = !botInfoJSON.limite_diario.status
                    if(novoEstado){
                        await bot.alterarLimiteDiario(true, botInfoJSON)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.limitediario.ativado, id)
                    } else {
                        await bot.alterarLimiteDiario(false, botInfoJSON)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.limitediario.desativado, id)
                    } 
                } catch(err){
                    throw err
                }

                break

            case "taxalimite":
                try{
                    let novoEstado = !botInfoJSON.limitecomandos.status
                    if(novoEstado){
                        if(args.length !== 3) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                        let qtd_max_minuto = args[1], tempo_bloqueio = args[2]
                        if(isNaN(qtd_max_minuto) || qtd_max_minuto < 3) return await socket.responderTexto(c, chatId,msgs_texto.admin.limitecomandos.qtd_invalida, id)
                        if(isNaN(tempo_bloqueio) || tempo_bloqueio < 10) return await socket.responderTexto(c, chatId,msgs_texto.admin.limitecomandos.tempo_invalido, id)
                        await bot.alterarLimitador(botInfoJSON, true, parseInt(qtd_max_minuto), parseInt(tempo_bloqueio))
                        await socket.responderTexto(c, chatId, msgs_texto.admin.limitecomandos.ativado, id)
                    } else {
                        await bot.alterarLimitador(botInfoJSON, false)
                        await socket.responderTexto(c, chatId, msgs_texto.admin.limitecomandos.desativado, id)
                    }
                } catch(err){
                    throw err
                }
                break

            case "nomebot":
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let usuarioTexto = textoRecebido.slice(9).trim()
                    await bot.alterarNomeBot(usuarioTexto, botInfoJSON)
                    await socket.responderTexto(c, chatId, msgs_texto.admin.nomebot.sucesso, id)
                } catch(err){
                    throw err
                }
                break
            
            case "nomeadm":
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let usuarioTexto = textoRecebido.slice(9).trim()
                    await bot.alterarNomeAdm(usuarioTexto, botInfoJSON)
                    await socket.responderTexto(c, chatId, msgs_texto.admin.nomeadm.sucesso, id)
                } catch(err){
                    throw err
                }
                break

            case "nomesticker":
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let usuarioTexto = textoRecebido.slice(13).trim()
                    await bot.alterarNomeFigurinhas(usuarioTexto, botInfoJSON)
                    await socket.responderTexto(c, chatId, msgs_texto.admin.nomesticker.sucesso, id)
                } catch(err){
                    throw err
                }
                break

            case "prefixo":
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let usuarioTexto = textoRecebido.slice(9).trim(), prefixosSuportados = ["!", "#", ".", "*"]
                    if(!prefixosSuportados.includes(usuarioTexto)) return await socket.responderTexto(c, chatId, msgs_texto.admin.prefixo.nao_suportado, id)
                    await bot.alterarPrefixo(usuarioTexto, botInfoJSON)
                    await socket.responderTexto(c, chatId, msgs_texto.admin.prefixo.sucesso, id)
                } catch(err){
                    throw err
                }
                break
            
            case "mudarlimite":
                try{
                    if(!botInfoJSON.limite_diario.status) return await socket.responderTexto(c, chatId, msgs_texto.admin.mudarlimite.erro_limite_diario, id)
                    if(args.length === 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let tipo = args[1].toLowerCase(), qtd = args[2]
                    if(qtd != -1) if(isNaN(qtd) || qtd < 5) return await socket.responderTexto(c, chatId, msgs_texto.admin.mudarlimite.invalido, id)
                    let alterou = await bot.alterarQtdLimiteDiarioTipo(tipo, parseInt(qtd), botInfoJSON)
                    if(!alterou) return await socket.responderTexto(c, chatId, msgs_texto.admin.mudarlimite.tipo_invalido, id)
                    await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.mudarlimite.sucesso, tipo.toUpperCase(), qtd == -1 ? "∞" : qtd), id)
                } catch(err){
                    throw err
                }
                break
            
            case "usuarios":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let tipo = args[1].toLowerCase()
                    let usuariosTipo = await usuarios.obterUsuariosTipo(tipo)
                    if(usuariosTipo.length == 0) return await socket.responderTexto(c, chatId, msgs_texto.admin.usuarios.nao_encontrado, id)
                    let respostaItens = ''
                    for (let usuario of usuariosTipo) respostaItens += criarTexto(msgs_texto.admin.usuarios.resposta_item, usuario.nome, usuario.id_usuario.replace("@s.whatsapp.net", ""), usuario.comandos_total)
                    let resposta = criarTexto(msgs_texto.admin.usuarios.resposta_titulo, tipo.toUpperCase(), usuariosTipo.length, respostaItens)
                    await socket.responderTexto(c, chatId, resposta, id)
                } catch(err){
                    throw err
                }
                break

            case "limpartipo":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let tipo = args[1].toLowerCase()
                    let limpou = await usuarios.limparTipo(tipo, botInfoJSON)
                    if(!limpou) return await socket.responderTexto(c, chatId, msgs_texto.admin.limpartipo.erro, id)
                    await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.limpartipo.sucesso, tipo.toUpperCase()), id)
                } catch(err){
                    throw err
                }
                break

            case "alterartipo":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let usuario_tipo = ""
                    if(quotedMsg) usuario_tipo = quotedMsgObjInfo.sender
                    else if(mentionedJidList.length === 1) usuario_tipo = mentionedJidList[0]
                    else if(args.length > 2) usuario_tipo = args.slice(2).join("").replace(/\W+/g,"")+"@s.whatsapp.net"
                    else return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON),id)
                    if(ownerNumber == usuario_tipo) return await socket.responderTexto(c, chatId, msgs_texto.admin.alterartipo.tipo_dono, id)
                    let c_registrado = await usuarios.verificarRegistro(usuario_tipo)
                    if(c_registrado){
                        let alterou = await usuarios.alterarTipoUsuario(usuario_tipo, args[1], botInfoJSON)
                        if(!alterou) return await socket.responderTexto(c, chatId, msgs_texto.admin.alterartipo.tipo_invalido, id)
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.alterartipo.sucesso, args[1].toUpperCase()), id)
                    } else {
                        await socket.responderTexto(c, chatId, msgs_texto.admin.alterartipo.nao_registrado, id)
                    }
                } catch(err){
                    throw err
                }
                break
        
            case "tipos":
                try{
                    let tipos = botInfoJSON.limite_diario.limite_tipos, respostaTipos = ''
                    for (let tipo in tipos) respostaTipos += criarTexto(msgs_texto.admin.tipos.item_tipo, msgs_texto.tipos[tipo], tipos[tipo] || "∞")
                    await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.tipos.resposta, respostaTipos), id)
                } catch(err){
                    throw err
                }
                break
            
            case "rtodos":
                try{
                    if(!botInfoJSON.limite_diario.status) return await socket.responderTexto(c, chatId, msgs_texto.admin.rtodos.erro_limite_diario,id)
                    await usuarios.resetarComandosDia()
                    await socket.responderTexto(c, chatId, msgs_texto.admin.rtodos.sucesso,id)
                } catch(err){
                    throw err
                }
                break

            case "r":
                try{
                    if(!botInfoJSON.limite_diario.status) return await socket.responderTexto(c, chatId, msgs_texto.admin.r.erro_limite_diario,id)
                    if(quotedMsg){
                        let r_registrado = await usuarios.verificarRegistro(quotedMsgObjInfo.sender)
                        if(r_registrado){
                            await usuarios.resetarComandosDiaUsuario(quotedMsgObjInfo.sender)
                            await socket.responderTexto(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            return await socket.responderTexto(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else if (mentionedJidList.length === 1){
                        let r_registrado = await usuarios.verificarRegistro(mentionedJidList[0])
                        if(r_registrado){
                            await usuarios.resetarComandosDiaUsuario(mentionedJidList[0])
                            await socket.responderTexto(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            return await socket.responderTexto(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else if(args.length >= 1){
                        let r_numero_usuario = ""
                        for (let i = 1; i < args.length; i++){
                            r_numero_usuario += args[i]
                        }
                        r_numero_usuario = r_numero_usuario.replace(/\W+/g,"")
                        let r_registrado = await usuarios.verificarRegistro(r_numero_usuario+"@s.whatsapp.net")
                        if(r_registrado){
                            await usuarios.resetarComandosDiaUsuario(r_numero_usuario+"@s.whatsapp.net")
                            await socket.responderTexto(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            await socket.responderTexto(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else {
                        await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON),id)
                    }
                } catch(err){
                    throw err
                }
                break  
                
            case "verdados":
                try{
                    let idUsuario = "", dadosUsuario = {}
                    if(quotedMsg) idUsuario = quotedMsgObjInfo.sender
                    else if(mentionedJidList.length === 1) idUsuario = mentionedJidList[0]
                    else if(args.length > 1) idUsuario =  args.slice(1).join("").replace(/\W+/g,"")+"@s.whatsapp.net"
                    else return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON),id)
                    let usuarioRegistrado = await usuarios.verificarRegistro(idUsuario)
                    if(usuarioRegistrado) dadosUsuario = await usuarios.obterDadosUsuario(idUsuario)
                    else return await socket.responderTexto(c, chatId,msgs_texto.admin.verdados.nao_registrado,id)
                    let maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite"
                    let tipoUsuario = msgs_texto.tipos[dadosUsuario.tipo]
                    let nomeUsuario =  dadosUsuario.nome || "Ainda não obtido"
                    let resposta = criarTexto(msgs_texto.admin.verdados.resposta_superior, nomeUsuario, tipoUsuario, dadosUsuario.id_usuario.replace("@s.whatsapp.net",""))
                    if(botInfoJSON.limite_diario.status) resposta += criarTexto(msgs_texto.admin.verdados.resposta_variavel.limite_diario.on, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    resposta += criarTexto(msgs_texto.admin.verdados.resposta_inferior, dadosUsuario.comandos_total)
                    await socket.responderTexto(c, chatId, resposta, id)
                } catch(err){
                    throw err
                }
                break
                     
            case 'bcgrupos':
                try{
                    if(args.length === 1) return socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    let mensagem = textoRecebido.slice(10).trim(), gruposAtuais = await grupos.obterTodosGruposInfo()
                    await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.bcgrupos.espera, gruposAtuais.length, gruposAtuais.length) , id)
                    for (let grupo of gruposAtuais) {
                        if (!grupo.restrito_msg) {
                            await new Promise((resolve)=>{
                                setTimeout(async ()=>{
                                    await socket.enviarTexto(c, grupo.id_grupo, criarTexto(msgs_texto.admin.bcgrupos.anuncio, mensagem)).catch(()=>{})
                                    resolve()
                                }, 1000)
                            })
                        }
                    }
                    await socket.responderTexto(c, chatId, msgs_texto.admin.bcgrupos.bc_sucesso , id)
                } catch(err){
                    throw err
                }
                break
            
            case "grupos":
                try{
                    let gruposAtuais = await grupos.obterTodosGruposInfo(), resposta = criarTexto(msgs_texto.admin.grupos.resposta_titulo, gruposAtuais.length)
                    let numGrupo = 0
                    for (let grupo of gruposAtuais){
                        numGrupo++
                        let adminsGrupo = grupo.admins
                        let botAdmin = adminsGrupo.includes(botNumber)
                        let comandoLink = botAdmin ? `${prefixo}linkgrupo ${numGrupo}` : '----'
                        resposta += criarTexto(msgs_texto.admin.grupos.resposta_itens, numGrupo, grupo.nome, grupo.participantes.length, adminsGrupo.length,  botAdmin ? "Sim" : "Não",  comandoLink)
                    }
                    await socket.responderTexto(c, chatId, resposta, id)
                } catch(err){
                    throw err
                }
                break

            case 'linkgrupo':
                try{
                    let gruposAtuais = await grupos.obterTodosGruposInfo()
                    let indexGrupo = textoRecebido.slice(11).trim()
                    if(isNaN(indexGrupo)) return await socket.responderTexto(c, chatId, msgs_texto.admin.linkgrupo.nao_encontrado, id)
                    indexGrupo = parseInt(indexGrupo) - 1
                    if(!gruposAtuais[indexGrupo]) return await socket.responderTexto(c, chatId, msgs_texto.admin.linkgrupo.nao_encontrado, id)
                    let botAdmin = gruposAtuais[indexGrupo].admins.includes(botNumber)
                    if(!botAdmin) return await socket.responderTexto(c, chatId, msgs_texto.admin.linkgrupo.nao_admin, id)
                    let link = await socket.obterLinkGrupo(c, gruposAtuais[indexGrupo].id_grupo)
                    await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.linkgrupo.resposta, link), id)               
                } catch(err){
                    throw err
                }
                break

            case 'estado':
                try{
                    if(args.length != 2) return await socket.responderTexto(c, chatId,erroComandoMsg(command, botInfoJSON),id)
                    switch(args[1]){
                        case 'online':
                            await socket.alterarStatusPerfil(c, "< 🟢 Online />")
                            await socket.responderTexto(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break
                        case 'offline':
                            await socket.alterarStatusPerfil(c, "< 🔴 Offline />")
                            await socket.responderTexto(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break    
                        case 'manutencao':
                            await socket.alterarStatusPerfil(c, "< 🟡 Manutenção />")
                            await socket.responderTexto(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break
                        default:
                            await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON), id)
                    }
                } catch(err){
                    throw err
                }
                break

            case 'desligar':
                try{
                    await socket.responderTexto(c, chatId, msgs_texto.admin.desligar.sucesso, id).then(async()=>{
                        await socket.encerrarBot(c)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "ping":
                try{
                    let tempoResposta = (moment.now()/1000) - t
                    let memoriaTotal = os.totalmem()/1024000000, memoriaUsada = (os.totalmem() - os.freemem())/1024000000
                    let sistemaOperacional = `${os.type()} ${os.release()}`
                    let nomeProcessador = os.cpus()[0].model
                    let gruposAtuais = await grupos.obterTodosGruposInfo()
                    let contatos = await usuarios.obterDadosTodosUsuarios()
                    await socket.responderTexto(c, chatId, criarTexto(
                    msgs_texto.admin.ping.resposta, 
                    sistemaOperacional, 
                    nomeProcessador, 
                    memoriaUsada.toFixed(2), 
                    memoriaTotal.toFixed(2), 
                    tempoResposta.toFixed(3),
                    contatos.length,
                    gruposAtuais.length,
                    timestampParaData(botInfoJSON.iniciado)), id)
                } catch(err){
                    throw err
                }
                break

            case 'devtest':
                try{
                    //PARA TESTES
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "ADMIN")
    }
    
}