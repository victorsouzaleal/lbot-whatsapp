//REQUERINDO MODULOS
const menu = require('../lib/menu')
const moment = require("moment-timezone")
const { version } = require('../package.json');
const msgs_texto = require('../lib/msgs')
const {criarTexto,erroComandoMsg, removerNegritoComando, timestampParaData, consoleErro} = require('../lib/util')
const {desbloquearComandosGlobal, bloquearComandosGlobal} = require("../lib/bloqueioComandos")
const db = require('../lib/database')
const fs = require("fs-extra")
const path = require("path")
const client = require('../lib-translate/baileys')
const {botAlterarLimitador, botInfo, botAlterarLimiteDiario, botQtdLimiteDiario, botAlterarLimitarMensagensPv, botAlterarAutoSticker, botAlterarPvLiberado} = require('../lib/bot')
const {obterTodosUsuarios, obterTodosGrupos} = require("../lib/database");
const { MessageTypes } = require('../lib-translate/msgtypes');
const {downloadMediaMessage} = require('@whiskeysockets/baileys')


module.exports = admin = async(c,messageTranslated) => {
    try{
        const {id, chatId, sender, isGroupMsg, t, chat, body, caption, type, mimetype, isMedia, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList } = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const botNumber = await client.getHostNumber(c)
        const blockNumber = await client.getBlockedIds(c)
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const ownerNumber = process.env.NUMERO_DONO.trim()
        const isOwner = ownerNumber == sender.replace("@s.whatsapp.net", '')
        if (!isOwner) return client.reply(c, chatId, msgs_texto.permissao.apenas_dono_bot, id)

        switch(command){
            case "!admin":
                try{
                    await client.sendText(c, chatId, menu.menuAdmin())
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!infocompleta":
                try{
                    var fotoBot = await client.getProfilePicFromServer(c, botNumber)
                    var infoBot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
                    var expiracaoLimiteDiario = timestampParaData(infoBot.limite_diario.expiracao * 1000)
                    var botInicializacaoData = timestampParaData(infoBot.iniciado)
                    var resposta = criarTexto(msgs_texto.admin.infocompleta.resposta_superior, process.env.NOME_ADMINISTRADOR.trim(), process.env.NOME_BOT.trim(), botInicializacaoData, version)
                    // AUTO-STICKER
                    resposta += (infoBot.autosticker) ? msgs_texto.admin.infocompleta.resposta_variavel.autosticker.on: msgs_texto.admin.infocompleta.resposta_variavel.autosticker.off
                    // PV LIBERADO
                    resposta += (infoBot.pvliberado) ? msgs_texto.admin.infocompleta.resposta_variavel.pvliberado.on: msgs_texto.admin.infocompleta.resposta_variavel.pvliberado.off
                    // LIMITE COMANDOS DIARIO
                    resposta += (infoBot.limite_diario.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.on,  expiracaoLimiteDiario) : msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.off
                    // LIMITE COMANDOS POR MINUTO
                    resposta += (infoBot.limitecomandos.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.on, infoBot.limitecomandos.cmds_minuto_max, infoBot.limitecomandos.tempo_bloqueio) : msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.off
                    // LIMITE MENSAGENS PV
                    resposta += (infoBot.limitarmensagens.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.on, infoBot.limitarmensagens.max, infoBot.limitarmensagens.intervalo) : msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.off
                    // BLOQUEIO DE COMANDOS
                    resposta += (infoBot.bloqueio_cmds.length != 0) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.on, infoBot.bloqueio_cmds.toString()) : msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.off
                    resposta += criarTexto(msgs_texto.admin.infocompleta.resposta_inferior, blockNumber.length, infoBot.cmds_executados, ownerNumber)
                    if(fotoBot) await client.replyFileFromUrl(c, MessageTypes.image, chatId, fotoBot, resposta, id)
                    else await client.reply(c, chatId, resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break
                
            case '!entrargrupo':
                try{
                    if (args.length < 2) return await client.reply(c, chatId, erroComandoMsg(command), id)
                    var linkGrupo = args[1]
                    var linkValido = linkGrupo.match(/(https:\/\/chat.whatsapp.com)/gi)
                    if (!linkValido) return await client.reply(c, chatId, msgs_texto.admin.entrar_grupo.link_invalido, id)
                    var idLink = linkGrupo.replace(/(https:\/\/chat.whatsapp.com\/)/gi, '')
                    await client.joinGroupViaLink(c, idLink).catch(async ()=>{
                        await client.reply(c, chatId, msgs_texto.admin.entrar_grupo.entrar_erro, id)
                    })
                    await client.reply(c, chatId, msgs_texto.admin.entrar_grupo.entrar_sucesso,id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case '!sair':
                try{
                    if (!isGroupMsg) return await client.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    await client.sendText(c, chatId, msgs_texto.admin.sair.sair_sucesso)
                    await client.leaveGroup(c, groupId)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case '!listablock':
                try{
                    if(blockNumber.length == 0) return client.reply(c, chatId, msgs_texto.admin.listablock.lista_vazia, id)
                    var resposta = criarTexto(msgs_texto.admin.listablock.resposta_titulo, blockNumber.length)
                    for (let i of blockNumber) resposta += criarTexto(msgs_texto.admin.listablock.resposta_itens, i.replace(/@s.whatsapp.net/g,''))
                    await client.reply(c, chatId, resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!bcmdglobal":
                try{
                    if(args.length === 1) return await client.reply(c, chatId, erroComandoMsg(command) ,id)
                    var usuarioComandos = body.slice(12).split(" "), respostaBloqueio = await bloquearComandosGlobal(usuarioComandos)
                    await client.reply(c, chatId, respostaBloqueio, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "!dcmdglobal":
                try{
                    if(args.length === 1) return await client.reply(c, chatId,erroComandoMsg(command),id)
                    var usuarioComandos = body.slice(12).split(" "), respostaDesbloqueio = await desbloquearComandosGlobal(usuarioComandos)
                    await client.reply(c, chatId, respostaDesbloqueio, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case '!rconfig':
                try{
                    await db.resetarGrupos()
                    await client.reply(c, chatId,msgs_texto.admin.rconfig.reset_sucesso,id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case '!sairgrupos':
                try{
                    var grupos = await client.getAllGroups(c)
                    for (var grupo of grupos) await client.leaveGroup(c, grupo.id)
                    var resposta = criarTexto(msgs_texto.admin.sairtodos.resposta, grupos.length)
                    await client.reply(c, ownerNumber+"@s.whatsapp.net", resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!bloquear":
                try{
                    var usuariosBloqueados = []
                    if(quotedMsg){
                        usuariosBloqueados.push(quotedMsgObjInfo.sender)
                    } else if(mentionedJidList.length > 1) {
                        usuariosBloqueados = mentionedJidList
                    } else {
                        var numeroInserido = body.slice(10).trim()
                        if(numeroInserido.length == 0) return await client.reply(c, chatId, erroComandoMsg(command), id)
                        usuariosBloqueados.push(numeroInserido.replace(/\W+/g,"")+"@s.whatsapp.net")
                    }
                    for (var usuario of usuariosBloqueados){
                            if(ownerNumber == usuario.replace(/@s.whatsapp.net/g, '')){
                                await client.reply(c, chatId, criarTexto(msgs_texto.admin.bloquear.erro_dono, usuario.replace(/@s.whatsapp.net/g, '')), id)
                            } else {
                                if(blockNumber.includes(usuario)) {
                                    await client.reply(c, chatId, criarTexto(msgs_texto.admin.bloquear.ja_bloqueado, usuario.replace(/@s.whatsapp.net/g, '')), id)
                                } else {
                                    client.contactBlock(c, usuario)
                                    await client.reply(c, chatId, criarTexto(msgs_texto.admin.bloquear.sucesso, usuario.replace(/@s.whatsapp.net/g, '')), id)
                                }
                            }
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break      

            case "!desbloquear":
                try{
                    let usuariosDesbloqueados = []
                    if(quotedMsg){
                        usuariosDesbloqueados.push(quotedMsgObjInfo.sender)
                    } else if(mentionedJidList.length > 1) {
                        usuariosDesbloqueados = mentionedJidList
                    } else {
                        var numeroInserido = body.slice(13).trim()
                        if(numeroInserido.length == 0) return await client.reply(c, chatId, erroComandoMsg(command), id)
                        usuariosDesbloqueados.push(numeroInserido.replace(/\W+/g,"")+"@s.whatsapp.net")
                    }
                    for (var usuario of usuariosDesbloqueados){
                        if(!blockNumber.includes(usuario)) {
                            await client.reply(c, chatId, criarTexto(msgs_texto.admin.desbloquear.ja_desbloqueado, usuario.replace(/@s.whatsapp.net/g,'')), id)
                        } else {
                            client.contactUnblock(c, usuario)
                            await client.reply(c, chatId, criarTexto(msgs_texto.admin.desbloquear.sucesso, usuario.replace(/@s.whatsapp.net/g,'')), id)
                        }
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!autostickerpv":
                try{
                    var novoEstado = !botInfo().autosticker
                    if(novoEstado){
                        botAlterarAutoSticker(true)
                        await client.reply(c, chatId, msgs_texto.admin.autostickerpv.ativado,id)
                    } else {
                        botAlterarAutoSticker(false)
                        await client.reply(c, chatId, msgs_texto.admin.autostickerpv.desativado,id)
                    } 
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!pvliberado":
                try{
                    var novoEstado = !botInfo().pvliberado
                    if(novoEstado){
                        botAlterarPvLiberado(true)
                        await client.reply(c, chatId, msgs_texto.admin.pvliberado.ativado,id)
                    } else {
                        botAlterarPvLiberado(false)
                        await client.reply(c, chatId, msgs_texto.admin.pvliberado.desativado,id)
                    } 
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!fotobot":
                try{
                    if(isMedia || quotedMsg){
                        var dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            mensagem: (isMedia) ? id : quotedMsgObj
                        }
                        if(dadosMensagem.tipo == MessageTypes.image){
                            var fotoBuffer = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                            await client.setProfilePic(c, botNumber, fotoBuffer)
                            await client.reply(c, chatId, msgs_texto.admin.fotobot.sucesso, id)
                        } else {
                            return client.reply(c, chatId, erroComandoMsg(command) , id)
                        }
                    } else {
                        return client.reply(c, chatId, erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!limitediario":
                try{
                    var novoEstado = !botInfo().limite_diario.status
                    if(novoEstado){
                        botAlterarLimiteDiario(true)
                        await client.reply(c, chatId, msgs_texto.admin.limitediario.ativado, id)
                    } else {
                        botAlterarLimiteDiario(false)
                        await client.reply(c, chatId, msgs_texto.admin.limitediario.desativado, id)
                    } 
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case "!taxalimite":
                try{
                    var novoEstado = !botInfo().limitecomandos.status
                    if(novoEstado){
                        if(args.length !== 3) return await client.reply(c, chatId, erroComandoMsg(command), id)
                        var qtd_max_minuto = args[1], tempo_bloqueio = args[2]
                        if(isNaN(qtd_max_minuto) || qtd_max_minuto < 3) return await client.reply(c, chatId,msgs_texto.admin.limitecomandos.qtd_invalida, id)
                        if(isNaN(tempo_bloqueio) || tempo_bloqueio < 10) return await client.reply(c, chatId,msgs_texto.admin.limitecomandos.tempo_invalido, id)
                        botAlterarLimitador(true, parseInt(qtd_max_minuto), parseInt(tempo_bloqueio))
                        await client.reply(c, chatId, msgs_texto.admin.limitecomandos.ativado, id)
                    } else {
                        botAlterarLimitador(false)
                        await client.reply(c, chatId, msgs_texto.admin.limitecomandos.desativado, id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "!limitarmsgs":
                try{
                    var novoEstado = !botInfo().limitarmensagens.status
                    if(novoEstado){
                        if(args.length !== 3) return await client.reply(c, chatId, erroComandoMsg(command), id)
                        let max_msg = args[1], msgs_intervalo = args[2]
                        if(isNaN(max_msg) || max_msg < 3) return await client.reply(c, chatId, msgs_texto.admin.limitarmsgs.qtd_invalida, id)
                        if(isNaN(msgs_intervalo) || msgs_intervalo < 10) return await client.reply(c, chatId, msgs_texto.admin.limitarmsgs.tempo_invalido, id)
                        botAlterarLimitarMensagensPv(true,parseInt(max_msg),parseInt(msgs_intervalo))
                        await client.reply(c, chatId, msgs_texto.admin.limitarmsgs.ativado, id)
                    } else {
                        botAlterarLimitarMensagensPv(false)
                        await client.reply(c, chatId, msgs_texto.admin.limitarmsgs.desativado, id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "!mudarlimite":
                try{
                    if(!botInfo().limite_diario.status) return await client.reply(c, chatId, msgs_texto.admin.mudarlimite.erro_limite_diario, id)
                    if(args.length === 1) return await client.reply(c, chatId, erroComandoMsg(command), id)
                    var tipo = args[1].toLowerCase(), qtd = args[2]
                    if(qtd != -1) if(isNaN(qtd) || qtd < 5) return await client.reply(c, chatId, msgs_texto.admin.mudarlimite.invalido, id)
                    var alterou = await botQtdLimiteDiario(tipo, parseInt(qtd))
                    if(!alterou) return await client.reply(c, chatId, msgs_texto.admin.mudarlimite.tipo_invalido, id)
                    await client.reply(c, chatId, criarTexto(msgs_texto.admin.mudarlimite.sucesso, tipo.toUpperCase(), qtd == -1 ? "∞" : qtd), id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "!usuarios":
                try{
                    if(args.length === 1) return await client.reply(c, chatId, erroComandoMsg(command), id)
                    var tipo = args[1].toLowerCase()
                    var usuarios = await db.obterUsuariosTipo(tipo)
                    if(usuarios.length == 0) return await client.reply(c, chatId, msgs_texto.admin.usuarios.nao_encontrado, id)
                    var respostaItens = ''
                    for (var usuario of usuarios) respostaItens += criarTexto(msgs_texto.admin.usuarios.resposta_item, usuario.nome, usuario.id_usuario.replace("@s.whatsapp.net", ""), usuario.comandos_total)
                    var resposta = criarTexto(msgs_texto.admin.usuarios.resposta_titulo, tipo.toUpperCase(), usuarios.length, respostaItens)
                    await client.reply(c, chatId, resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!limpartipo":
                try{
                    if(args.length === 1) return await client.reply(c, chatId, erroComandoMsg(command), id)
                    var tipo = args[1].toLowerCase()
                    var limpou = await db.limparTipo(tipo)
                    if(!limpou) return await client.reply(c, chatId, msgs_texto.admin.limpartipo.erro, id)
                    await client.reply(c, chatId, criarTexto(msgs_texto.admin.limpartipo.sucesso, tipo.toUpperCase()), id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!alterartipo":
                try{
                    if(args.length === 1) return await client.reply(c, chatId, erroComandoMsg(command), id)
                    var usuario_tipo = ""
                    if(quotedMsg) usuario_tipo = quotedMsgObjInfo.sender
                    else if(mentionedJidList.length === 1) usuario_tipo = mentionedJidList[0]
                    else if(args.length > 2) usuario_tipo = args.slice(2).join("").replace(/\W+/g,"")+"@s.whatsapp.net"
                    else return await client.reply(c, chatId, erroComandoMsg(command),id)
                    if(ownerNumber == usuario_tipo.replace("@s.whatsapp.net","")) return await client.reply(c, chatId, msgs_texto.admin.alterartipo.tipo_dono, id)
                    let c_registrado = await db.verificarRegistro(usuario_tipo)
                    if(c_registrado){
                        var alterou = await db.alterarTipoUsuario(usuario_tipo, args[1])
                        if(!alterou) return await client.reply(c, chatId, msgs_texto.admin.alterartipo.tipo_invalido, id)
                        await client.reply(c, chatId, criarTexto(msgs_texto.admin.alterartipo.sucesso, args[1].toUpperCase()), id)
                    } else {
                        await client.reply(c, chatId, msgs_texto.admin.alterartipo.nao_registrado, id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        
            case "!tipos":
                try{
                    var tipos = botInfo().limite_diario.limite_tipos, respostaTipos = ''
                    for (var tipo in tipos) respostaTipos += criarTexto(msgs_texto.admin.tipos.item_tipo, msgs_texto.tipos[tipo], tipos[tipo] || "∞")
                    await client.reply(c, chatId, criarTexto(msgs_texto.admin.tipos.resposta, respostaTipos), id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "!rtodos":
                try{
                    if(!botInfo().limite_diario.status) return await client.reply(c, chatId, msgs_texto.admin.rtodos.erro_limite_diario,id)
                    await db.resetarComandosDia()
                    await client.reply(c, chatId, msgs_texto.admin.rtodos.sucesso,id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "!r":
                try{
                    if(!botInfo().limite_diario.status) return await client.reply(c, chatId, msgs_texto.admin.r.erro_limite_diario,id)
                    if(quotedMsg){
                        let r_registrado = await db.verificarRegistro(quotedMsgObjInfo.sender)
                        if(r_registrado){
                            await db.resetarComandosDiaUsuario(quotedMsgObjInfo.sender)
                            await client.reply(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            return await client.reply(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else if (mentionedJidList.length === 1){
                        let r_registrado = await db.verificarRegistro(mentionedJidList[0])
                        if(r_registrado){
                            await db.resetarComandosDiaUsuario(mentionedJidList[0])
                            await client.reply(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            return await client.reply(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else if(args.length >= 1){
                        let r_numero_usuario = ""
                        for (let i = 1; i < args.length; i++){
                            r_numero_usuario += args[i]
                        }
                        r_numero_usuario = r_numero_usuario.replace(/\W+/g,"")
                        let r_registrado = await db.verificarRegistro(r_numero_usuario+"@s.whatsapp.net")
                        if(r_registrado){
                            await db.resetarComandosDiaUsuario(r_numero_usuario+"@s.whatsapp.net")
                            await client.reply(c, chatId, msgs_texto.admin.r.sucesso,id)
                        } else {
                            await client.reply(c, chatId, msgs_texto.admin.r.nao_registrado,id)
                        }
                    } else {
                        await client.reply(c, chatId, erroComandoMsg(command),id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
                
            case "!verdados":
                try{
                    var idUsuario = "", dadosUsuario = {}
                    if(quotedMsg) idUsuario = quotedMsgObjInfo.sender
                    else if(mentionedJidList.length === 1) idUsuario = mentionedJidList[0]
                    else if(args.length >= 1) idUsuario =  args.slice(1).join("").replace(/\W+/g,"")+"@s.whatsapp.net"
                    else return await client.reply(c, chatId, erroComandoMsg(command),id)
                    var usuarioRegistrado = await db.verificarRegistro(idUsuario)
                    if(usuarioRegistrado) dadosUsuario = await db.obterUsuario(idUsuario)
                    else return await client.reply(c, chatId,msgs_texto.admin.verdados.nao_registrado,id)
                    var maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite"
                    var tipoUsuario = msgs_texto.tipos[dadosUsuario.tipo]
                    var nomeUsuario =  dadosUsuario.nome || "Ainda não obtido"
                    var resposta = criarTexto(msgs_texto.admin.verdados.resposta_superior, nomeUsuario, tipoUsuario, dadosUsuario.id_usuario.replace("@s.whatsapp.net",""))
                    if(botInfo().limite_diario.status) resposta += criarTexto(msgs_texto.admin.verdados.resposta_variavel.limite_diario.on, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    resposta += criarTexto(msgs_texto.admin.verdados.resposta_inferior, dadosUsuario.comandos_total)
                    await client.reply(c, chatId, resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                     
            case '!bcgrupos':
                try{
                    if(args.length === 1) return client.reply(c, chatId, erroComandoMsg(command), id)
                    var mensagem = body.slice(10).trim(), grupos = await client.getAllGroups(c)
                    await client.reply(c, chatId, criarTexto(msgs_texto.admin.bcgrupos.espera, grupos.length, grupos.length) , id)
                    for (var grupo of grupos) {
                        if (!grupo.announce) {
                            await new Promise((resolve)=>{
                                setTimeout(async ()=>{
                                    resolve(await client.sendText(c, grupo.id, criarTexto(msgs_texto.admin.bcgrupos.anuncio, mensagem)))
                                }, 1000)
                            })
                        }
                    }
                    await client.reply(c, chatId, msgs_texto.admin.bcgrupos.bc_sucesso , id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break
            
            case "!grupos":
                try{
                    var grupos = await client.getAllGroups(c), resposta = criarTexto(msgs_texto.admin.grupos.resposta_titulo, grupos.length)
                    for (var grupo of grupos){
                        var adminsGrupo = await client.getGroupAdmins(c, grupo.id)
                        var botAdmin = adminsGrupo.includes(botNumber)
                        var linkGrupo = "Não Disponível"
                        if(botAdmin) linkGrupo = await client.getGroupInviteLink(c, grupo.id)
                        resposta += criarTexto(msgs_texto.admin.grupos.resposta_itens, grupo.subject, grupo.participants.length, botAdmin ? "Sim" : "Não", linkGrupo)
                    }
                    await client.reply(c, chatId, resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case '!estado':
                try{
                    if(args.length != 2)  return client.reply(c, chatId,erroComandoMsg(command),id)
                    switch(args[1]){
                        case 'online':
                            await client.setMyStatus(c, "< 🟢 Online />")
                            await client.reply(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break
                        case 'offline':
                            await client.setMyStatus(c, "< 🔴 Offline />")
                            await client.reply(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break    
                        case 'manutencao':
                            await client.setMyStatus(c, "< 🟡 Manutenção />")
                            await client.reply(c, chatId,msgs_texto.admin.estado.sucesso,id)
                            break
                        default:
                            await client.reply(c, chatId, erroComandoMsg(command), id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case '!desligar':
                try{
                    await client.reply(c, chatId, msgs_texto.admin.desligar.sucesso, id).then(async()=>{
                        await client.botLogout(c)
                    })
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break
            
            case "!ping":
                try{
                    var os = require('os')
                    var tempoResposta = (moment.now()/1000) - t
                    var memoriaTotal = os.totalmem()/1024000000, memoriaUsada = (os.totalmem() - os.freemem())/1024000000
                    var sistemaOperacional = `${os.type()} ${os.release()}`
                    var nomeProcessador = os.cpus()[0].model
                    var grupos = await obterTodosGrupos()
                    var contatos = await obterTodosUsuarios()
                    await client.reply(c, chatId, criarTexto(
                    msgs_texto.admin.ping.resposta, 
                    sistemaOperacional, 
                    nomeProcessador, 
                    memoriaUsada.toFixed(2), 
                    memoriaTotal.toFixed(2), 
                    tempoResposta.toFixed(3),
                    contatos.length,
                    grupos.length,
                    timestampParaData(botInfo().iniciado)), id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        }
    } catch(err){
        consoleErro(err, "ADMIN")
    }
    
}