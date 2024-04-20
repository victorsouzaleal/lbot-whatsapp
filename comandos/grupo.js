//REQUERINDO MODULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import {bloquearComandosGrupo, desbloquearComandosGrupo} from '../lib/bloqueioComandos.js'
import * as db from '../db-modulos/database.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import { MessageTypes } from '../lib-baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'


export const grupo = async(c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {botNumber, botInfoJSON} = mensagemInfoCompleta.bot
        const {groupId, grupoInfo, groupOwner, groupMembers, groupAdmins, isGroupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
        const {command, args, textoRecebido, id, chatId, sender, isGroupMsg, username, type, isMedia, mimetype, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList} = mensagemInfoCompleta.mensagem
        const {prefixo, nome_bot} = botInfoJSON
        if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
        let cmdSemPrefixo = command.replace(prefixo, "")

        switch(cmdSemPrefixo){
            case 'regras':
                try{
                    var grupoDescricao = grupoInfo.descricao || msgs_texto.grupo.regras.sem_descrição
                    await socket.getProfilePicFromServer(c, groupId).then((grupoFoto)=>{
                        socket.replyFileFromUrl(c, MessageTypes.image, chatId, grupoFoto, grupoDescricao, id)
                    }).catch(()=>{
                        socket.reply(c, chatId, grupoDescricao, id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "fotogrupo":
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    if(isMedia || quotedMsg){
                        var dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            mensagem: (isMedia) ? id : quotedMsgObj
                        }
                        if(dadosMensagem.tipo == MessageTypes.image){
                            var fotoBuffer = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                            await socket.setProfilePic(c, chatId, fotoBuffer)
                            await socket.reply(c, chatId, msgs_texto.grupo.fotogrupo.sucesso, id)
                        } else {
                            return socket.reply(c, chatId, erroComandoMsg(command) , id)
                        }
                    } else {
                        return socket.reply(c, chatId, erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                
            
            case 'status':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    var resposta = msgs_texto.grupo.status.resposta_titulo
                    //Bem-vindo
                    resposta += (grupoInfo.bemvindo.status) ? msgs_texto.grupo.status.resposta_variavel.bemvindo.on : msgs_texto.grupo.status.resposta_variavel.bemvindo.off
                    //Mutar
                    resposta += (grupoInfo.mutar) ? msgs_texto.grupo.status.resposta_variavel.mutar.on : msgs_texto.grupo.status.resposta_variavel.mutar.off
                    //Auto-Sticker
                    resposta += (grupoInfo.autosticker) ? msgs_texto.grupo.status.resposta_variavel.autosticker.on : msgs_texto.grupo.status.resposta_variavel.autosticker.off
                    //Anti-Link
                    resposta += (grupoInfo.antilink) ? msgs_texto.grupo.status.resposta_variavel.antilink.on : msgs_texto.grupo.status.resposta_variavel.antilink.off
                    //Anti-fake
                    resposta += (grupoInfo.antifake.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antifake.on, grupoInfo.antifake.ddi_liberados.toString()) : msgs_texto.grupo.status.resposta_variavel.antifake.off
                    //Anti-flood
                    let infoAntiFlood = db.grupoInfoAntiFlood(groupId)
                    resposta += (grupoInfo.antiflood) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antiflood.on, infoAntiFlood.max, infoAntiFlood.intervalo) : msgs_texto.grupo.status.resposta_variavel.antiflood.off 
                    //Contador
                    resposta += (grupoInfo.contador.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.contador.on, grupoInfo.contador.inicio) : msgs_texto.grupo.status.resposta_variavel.contador.off
                    //Bloqueio de CMDS
                    let comandosBloqueados = []
                    for (let comandoBloqueado of grupoInfo.block_cmds){
                        comandosBloqueados.push(prefixo+comandoBloqueado)
                    }
                    resposta += (grupoInfo.block_cmds.length != 0) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.on, comandosBloqueados.toString()) : msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.off
                    //Lista Negra
                    resposta += criarTexto(msgs_texto.grupo.status.resposta_variavel.listanegra, grupoInfo.lista_negra.length)
                    await socket.sendText(c, chatId, resposta)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'bv':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    var estadoNovo = !grupoInfo.bemvindo.status
                    if (estadoNovo) {
                        var usuarioMensagem = args.slice(1).join(" ")
                        await db.alterarBemVindo(groupId, true, usuarioMensagem)
                        await socket.reply(c, chatId, msgs_texto.grupo.bemvindo.ligado, id)
                    } else {
                        await db.alterarBemVindo(groupId, false)
                        await socket.reply(c, chatId, msgs_texto.grupo.bemvindo.desligado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break

            case "blista": //FAZER MELHORIA EM FUTURAS VERSÕES PARA BANIR SE O USUARIO ADICIONADO A LISTA NEGRA ESTIVER NO GRUPO
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let blista_numero
                    if(quotedMsg) {
                        blista_numero = quotedMsgObjInfo.sender
                    } else{
                        if(args.length == 1) return socket.reply(c, chatId, erroComandoMsg(command), id)
                        blista_numero = textoRecebido.slice(8).trim().replace(/\W+/g,"")
                        if(blista_numero.length == 0) return socket.reply(c, chatId, msgs_texto.grupo.blista.numero_vazio , id)
                        blista_numero = blista_numero+"@s.whatsapp.net"
                    }
                    if(blista_numero == botNumber) return socket.reply(c, chatId, msgs_texto.grupo.blista.bot_erro , id)
                    else if(groupAdmins.includes(blista_numero)) return socket.reply(c, chatId, msgs_texto.grupo.blista.admin_erro , id)
                    let blista_grupo_lista = await db.obterListaNegra(groupId)
                    if(blista_grupo_lista.includes(blista_numero)) return socket.reply(c, chatId, msgs_texto.grupo.blista.ja_listado, id)
                    await db.adicionarListaNegra(groupId, blista_numero)
                    await socket.reply(c, chatId, msgs_texto.grupo.blista.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "dlista":
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    if(args.length == 1) return socket.reply(c, chatId, erroComandoMsg(command), id)
                    let dlista_numero = textoRecebido.slice(8).trim().replace(/\W+/g,"")
                    if(dlista_numero.length == 0) return socket.reply(c, chatId, msgs_texto.grupo.dlista.numero_vazio, id)
                    let dlista_grupo_lista = await db.obterListaNegra(groupId), dlista_id_usuario = dlista_numero+"@s.whatsapp.net"
                    if(!dlista_grupo_lista.includes(dlista_id_usuario)) return socket.reply(c, chatId, msgs_texto.grupo.dlista.nao_listado, id)
                    await db.removerListaNegra(groupId, dlista_id_usuario)
                    await socket.reply(c, chatId, msgs_texto.grupo.dlista.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "listanegra":
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let lista_negra_grupo = await db.obterListaNegra(groupId), resposta_listanegra = msgs_texto.grupo.listanegra.resposta_titulo
                    if(lista_negra_grupo.length == 0) return socket.reply(c, chatId, msgs_texto.grupo.listanegra.lista_vazia, id)
                    for(let usuario_lista of lista_negra_grupo){
                        resposta_listanegra += criarTexto(msgs_texto.grupo.listanegra.resposta_itens, usuario_lista.replace(/@s.whatsapp.net/g, ''))
                    }
                    resposta_listanegra += `╚═〘 ${nome_bot?.trim()}®〙`
                    await socket.sendText(c, chatId, resposta_listanegra)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'alink':
                try{
                    if (!isGroupAdmins) return await socket.reply(c,chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    var estadoNovo = !grupoInfo.antilink
                    if (estadoNovo) {
                        await db.alterarAntiLink(groupId, true)
                        await socket.reply(c, chatId, msgs_texto.grupo.antilink.ligado, id)
                    } else {
                        await db.alterarAntiLink(groupId, false)
                        await socket.reply(c, chatId, msgs_texto.grupo.antilink.desligado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'autosticker':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    var estadoNovo = !grupoInfo.autosticker
                    if (estadoNovo) {
                        await db.alterarAutoSticker(groupId, true)
                        await socket.reply(c, chatId, msgs_texto.grupo.autosticker.ligado, id)
                    } else {
                        await db.alterarAutoSticker(groupId, false)
                        await socket.reply(c, chatId, msgs_texto.grupo.autosticker.desligado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                    
            case 'rlink':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    await socket.revokeGroupInviteLink(c, groupId).then(async ()=>{
                        await socket.reply(c, chatId, msgs_texto.grupo.rlink.sucesso ,id)}
                    ).catch(async ()=>{
                        await socket.reply(c, chatId, msgs_texto.grupo.rlink.erro ,id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break        

            case 'afake':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    var estadoNovo = !grupoInfo.antifake.status
                    if (estadoNovo) {
                        var DDIAutorizados = (textoRecebido.slice(7).length == 0) ? ["55"] : textoRecebido.slice(7).split(" ")
                        await db.alterarAntiFake(groupId, true, DDIAutorizados)
                        await socket.reply(c, chatId,  msgs_texto.grupo.antifake.ligado, id)
                    } else {
                        await db.alterarAntiFake(groupId, false)
                        await socket.reply(c, chatId,  msgs_texto.grupo.antifake.desligado, id)
                    } 
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "mutar":
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    var estadoNovo = !grupoInfo.mutar
                    if (estadoNovo) {
                        await db.alterarMutar(groupId)
                        await socket.reply(c, chatId,  msgs_texto.grupo.mutar.ligado, id)
                    } else {
                        await db.alterarMutar(groupId,false)
                        await socket.reply(c, chatId, msgs_texto.grupo.mutar.desligado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                    
            case 'contador':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    var estadoNovo = !grupoInfo.contador.status
                    var membrosAtuais = grupoInfo.participantes
                    if (estadoNovo) {
                        await db.alterarContador(groupId)
                        await db.registrarContagemTodos(groupId, membrosAtuais)
                        await socket.reply(c, chatId, msgs_texto.grupo.contador.ligado, id)
                    } else {
                        await db.alterarContador(groupId, false)
                        await db.removerContagemGrupo(groupId)
                        await socket.reply(c, chatId, msgs_texto.grupo.contador.desligado, id)
                    } 
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "atividade":
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if(!grupoInfo.contador.status) return socket.reply(c, chatId, msgs_texto.grupo.atividade.erro_contador, id)
                    var atividadeUsuario
                    if(quotedMsg){
                        if(quotedMsgObjInfo.sender == botNumber) return socket.reply(c, chatId, msgs_texto.grupo.atividade.bot_erro, id)
                        atividadeUsuario = await db.obterAtividade(groupId, quotedMsgObjInfo.sender)
                        if(atividadeUsuario == null) return socket.reply(c, chatId, msgs_texto.grupo.atividade.fora_grupo, id)
                    } else if (mentionedJidList.length === 1){
                        if(mentionedJidList[0] == botNumber) return socket.reply(c, chatId, msgs_texto.grupo.atividade.bot_erro, id)
                        atividadeUsuario = await db.obterAtividade(groupId, mentionedJidList[0])
                        if(atividadeUsuario == null) return socket.reply(c, chatId, msgs_texto.grupo.atividade.fora_grupo, id)
                    } else {
                        return socket.reply(chatId, erroComandoMsg(command),id)
                    }
                    var atividadeResposta = criarTexto(msgs_texto.grupo.atividade.resposta, atividadeUsuario.msg, atividadeUsuario.texto, atividadeUsuario.imagem, atividadeUsuario.video, atividadeUsuario.sticker, atividadeUsuario.audio, atividadeUsuario.outro)
                    await socket.reply(c, chatId, atividadeResposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "alterarcont":
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1)  return socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioNumeroMsg = args[1]
                    if(isNaN(usuarioNumeroMsg) || usuarioNumeroMsg < 0)  return await socket.reply(c, chatId, msgs_texto.grupo.alterarcont.num_invalido, id)
                    if(!grupoInfo.contador.status) return await socket.reply(c, chatId, msgs_texto.grupo.alterarcont.erro_contador, id)
                    if(!quotedMsg && mentionedJidList.length != 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioSelecionado = quotedMsg ? quotedMsgObjInfo.sender : mentionedJidList[0]
                    var contagemUsuario = await db.obterAtividade(groupId, usuarioSelecionado)
                    if(!contagemUsuario) return await socket.reply(c, chatId, msgs_texto.grupo.alterarcont.fora_grupo, id) 
                    await db.alterarContagemUsuario(groupId, usuarioSelecionado, usuarioNumeroMsg)
                    await socket.reply(c, chatId, msgs_texto.grupo.alterarcont.sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "imarcar":
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1) return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    var qtdMensagem = args[1]
                    if(isNaN(qtdMensagem)) return await socket.reply(c, chatId, msgs_texto.grupo.minativos.erro_qtd , id)
                    if(qtdMensagem < 1 || qtdMensagem > 50) return await socket.reply(c, chatId, msgs_texto.grupo.minativos.limite_qtd, id)
                    if(!grupoInfo.contador.status) return await socket.reply(c, chatId, msgs_texto.grupo.minativos.erro_contador, id)
                    var usuariosInativos = await db.obterUsuariosInativos(groupId, qtdMensagem)
                    var qtdInativos = usuariosInativos.length - 1
                    if(qtdInativos > 0){
                        var mencionarUsuarios
                        var inativosResposta = criarTexto(msgs_texto.grupo.minativos.resposta_titulo, qtdMensagem, qtdInativos)
                        inativosResposta += `═════════════════\n`
                        for(let usuario of usuariosInativos){
                            if(usuario.id_usuario != botNumber) {
                                inativosResposta += criarTexto(msgs_texto.grupo.minativos.resposta_itens, usuario.id_usuario.replace(/@s.whatsapp.net/g, ''), usuario.msg)
                                mencionarUsuarios.push(usuario.id_usuario)
                            }
                        }
                        inativosResposta += `╚═〘 ${nome_bot?.trim()}® 〙`
                        await socket.sendTextWithMentions(c, chatId, inativosResposta, mencionarUsuarios)
                    } else {
                        await socket.reply(c, chatId,msgs_texto.grupo.minativos.sem_inativo, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                
            case "ibanir":
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var qtdMensagem = args[1]
                    if(isNaN(qtdMensagem)) return await socket.reply(c, chatId, msgs_texto.grupo.binativos.erro_qtd , id)
                    if(qtdMensagem < 1 || qtdMensagem > 50) return await socket.reply(c, chatId, msgs_texto.grupo.binativos.limite_qtd, id)
                    if(!grupoInfo.contador.status) return await socket.reply(c, chatId, msgs_texto.grupo.binativos.erro_contador , id)
                    var usuariosInativos = await db.obterUsuariosInativos(groupId, qtdMensagem)
                    if(usuariosInativos.length != 0){
                        for(let usuario of usuariosInativos){
                            if(usuario.id_usuario != botNumber) await socket.removeParticipant(c, chatId, usuario.id_usuario)
                        }
                        await socket.reply(c, chatId, criarTexto(msgs_texto.grupo.binativos.sucesso, usuariosInativos.length - 1, qtdMensagem), id)
                    } else {
                        await socket.reply(c, chatId,msgs_texto.grupo.binativos.sem_inativo, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "topativos":
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1) return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    var qtdUsuarios = args[1]
                    if(isNaN(qtdUsuarios)) return await socket.reply(c, chatId, msgs_texto.grupo.topativos.erro_qtd , id)
                    if(qtdUsuarios < 1 || qtdUsuarios > 50) return await socket.reply(c, chatId, msgs_texto.grupo.topativos.limite_qtd , id)
                    if(!grupoInfo.contador.status) return await socket.reply(c, chatId, msgs_texto.grupo.topativos.erro_contador , id)
                    var usuariosAtivos = await db.obterUsuariosAtivos(groupId, qtdUsuarios)
                    var usuariosMencionados = []
                    var respostaTop = criarTexto(msgs_texto.grupo.topativos.resposta_titulo, qtdUsuarios)
                    for (let i = 0 ; i < usuariosAtivos.length ; i++){
                        let medalha = ''
                        switch(i+1){
                            case 1:
                                medalha = '🥇'
                            break
                            case 2:
                                medalha = '🥈'
                            break
                            case 3:
                                medalha = '🥉'
                            break
                            default:
                                medalha = ''
                        }
                        respostaTop += criarTexto(msgs_texto.grupo.topativos.resposta_itens, medalha, i+1, usuariosAtivos[i].id_usuario.replace(/@s.whatsapp.net/g, ''), usuariosAtivos[i].msg)
                        usuariosMencionados.push(usuariosAtivos[i].id_usuario)   
                    }
                    respostaTop += `╠\n╚═〘 ${nome_bot?.trim()}® 〙`
                    await socket.sendTextWithMentions(c, chatId, respostaTop, usuariosMencionados)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "enquete":
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    var enquetePergunta = textoRecebido.slice(9).split(",")[0], enqueteOpcoes = textoRecebido.slice(9).split(",").slice(1)
                    if(enqueteOpcoes.length < 2) return socket.reply(c, chatId, msgs_texto.grupo.enquete.min_opcao , id)
                    await socket.sendPoll(c, chatId, enquetePergunta, enqueteOpcoes)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
          
            case 'aflood':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    var intervalo = 10, maxMensagem = 10, estadoNovo = !grupoInfo.antiflood
                    //VALIDAÇÃO DO ARGUMENTO - INTERVALO
                    if(args.length === 3){
                        var intervaloInserido = args[2]
                        if(!isNaN(intervalo) && intervalo>=10 && intervalo<=60){
                            intervalo = intervaloInserido
                        } else {
                            return socket.reply(c, chatId, msgs_texto.grupo.antiflood.intervalo,id)
                        }
                    }
                    //VALIDACAO DO ARGUMENTO - MÁX MENSAGEM
                    if(args.length >= 2){
                        var maxMensagemInserido = args[1]
                        if(!isNaN(maxMensagemInserido) && maxMensagemInserido>= 5 && maxMensagemInserido <= 20){
                            maxMensagem = maxMensagemInserido
                        } else {
                            return socket.reply(c, chatId, msgs_texto.grupo.antiflood.max,id)
                        }
                    }
                    if(estadoNovo) {
                        await db.alterarAntiFlood(groupId, true, maxMensagem, intervalo)
                        await socket.reply(c, chatId, criarTexto(msgs_texto.grupo.antiflood.ligado, maxMensagem, intervalo), id)
                    } else {
                        await db.alterarAntiFlood(groupId, false)
                        await socket.reply(c, chatId,  msgs_texto.grupo.antiflood.desligado, id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "bcmd":
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command) ,id)
                    var usuarioComandos = textoRecebido.slice(6).split(" "), respostaBloqueio = await bloquearComandosGrupo(usuarioComandos, groupId)
                    await socket.reply(c, chatId, respostaBloqueio, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }   
                break
            
            case "dcmd":
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command),id)
                    var usuarioComandos = textoRecebido.slice(6).split(" "), respostaDesbloqueio = await desbloquearComandosGrupo(usuarioComandos, groupId)
                    await socket.reply(c, chatId, respostaDesbloqueio, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'link':
                try{
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    var linkConvite = await socket.getGroupInviteLink(c, groupId)
                    var nome = grupoInfo.nome
                    await socket.sendLinkWithAutoPreview(c, chatId, criarTexto(msgs_texto.grupo.link.resposta, nome, linkConvite))
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'adms':
                try{
                    var mensagemAlvo = quotedMsg ? quotedMsgObj : id
                    var admsResposta = msgs_texto.grupo.adms.resposta_titulo
                    for (let adm of groupAdmins) {
                        admsResposta += criarTexto(msgs_texto.grupo.adms.resposta_itens, adm.replace(/@s.whatsapp.net/g, ''))
                    }
                    await socket.replyWithMentions(c, chatId, admsResposta, groupAdmins, mensagemAlvo)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "dono":
                try{
                    if(groupOwner) await socket.replyWithMentions(c, chatId, criarTexto(msgs_texto.grupo.dono.resposta, groupOwner.replace("@s.whatsapp.net", "")), [groupOwner], id)
                    else await socket.reply(c, chatId, msgs_texto.grupo.dono.sem_dono, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'mt':
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    var usuarioTexto = textoRecebido.slice(4).trim()
                    var respostaMarcar = (args.length > 1) ? criarTexto(msgs_texto.grupo.mt.resposta_titulo_variavel, usuarioTexto) : msgs_texto.grupo.mt.resposta_titulo_comum
                    for(let membro of groupMembers){
                        respostaMarcar += criarTexto(msgs_texto.grupo.mt.resposta_itens, membro.replace("@s.whatsapp.net", ""))
                    }
                    respostaMarcar += `╚═〘 ${nome_bot?.trim()}®〙`
                    await socket.sendTextWithMentions(c, chatId, respostaMarcar, groupMembers)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                
            case 'mm':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    var membrosMarcados = []
                    var usuarioTexto = textoRecebido.slice(4).trim()
                    var respostaMarcar = (args.length > 1) ? criarTexto(msgs_texto.grupo.mm.resposta_titulo_variavel, usuarioTexto) : msgs_texto.grupo.mm.resposta_titulo_comum
                    for(let membro of groupMembers){
                        if(!groupAdmins.includes(membro)) {
                            respostaMarcar += criarTexto(msgs_texto.grupo.mm.resposta_itens, membro.replace("@s.whatsapp.net", ""))
                            membrosMarcados.push(membro)
                        }
                    }
                    respostaMarcar += `╚═〘 ${nome_bot?.trim()}®〙`
                    if(membrosMarcados.length == 0) return await socket.reply(c, chatId, msgs_texto.grupo.mm.sem_membros, id)
                    await socket.sendTextWithMentions(c, chatId, respostaMarcar, membrosMarcados)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
            
            case 'bantodos':
                try{
                    var verificarDono = sender == groupOwner
                    if (!verificarDono) return socket.reply(c, chatId, msgs_texto.permissao.apenas_dono_grupo, id)           
                    if (!isBotGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
                    for(let membro of groupMembers){
                        if (!groupAdmins.includes(membro)) await socket.removeParticipant(c, groupId, membro)
                    }
                    await socket.reply(c, chatId, msgs_texto.grupo.banirtodos.banir_sucesso, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
            
            case 'add':
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
                    if (args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioNumeros = textoRecebido.slice(5).split(",")
                    for(let numero of usuarioNumeros){
                        var numeroCompleto = numero.trim().replace(/\W+/g,"")+"@s.whatsapp.net"
                        await socket.addParticipant(c, chatId, numeroCompleto).then(async (res)=>{
                            if (res.status != 200) await socket.reply(c, chatId, criarTexto(msgs_texto.grupo.add.add_erro, numeroCompleto.replace("@s.whatsapp.net", "")), id)
                        })
                        .catch(async ()=>{
                            await socket.reply(c, chatId, criarTexto(msgs_texto.grupo.add.numero_invalido, numeroCompleto.replace("@s.whatsapp.net", "")), id)
                        })
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'ban':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
                    var usuariosSelecionados = []
                    if(mentionedJidList.length === 0 && quotedMsg) usuariosSelecionados.push(quotedMsgObjInfo.sender)
                    else if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                    else return socket.reply(c, chatId, erroComandoMsg(command), id)
                    var idParticipantesAtuais = groupMembers
                    for(let usuario of usuariosSelecionados){
                        if(idParticipantesAtuais.includes(usuario)){
                            if(!groupAdmins.includes(usuario)){
                                await socket.removeParticipant(c, groupId, usuario).then(async ()=>{
                                    if(usuariosSelecionados.length === 1) {
                                        await socket.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.banir.motivo, username))
                                    }
                                })
                            } else {
                                if(usuariosSelecionados.length === 1) await socket.reply(c, chatId, msgs_texto.grupo.banir.banir_admin, id)
                            }
                        } else {
                            if(usuariosSelecionados.length === 1) await socket.reply(c, chatId,  msgs_texto.grupo.banir.banir_erro, id)
                        }
                    }   
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'promover':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
                    var usuariosSelecionados = [], respostaUsuarios = ''
                    if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                    else if(quotedMsg) usuariosSelecionados.push(quotedMsgObjInfo.sender)
                    else return socket.reply(c, chatId, erroComandoMsg(command), id)
                    if(usuariosSelecionados.includes(botNumber)) usuariosSelecionados.splice(usuariosSelecionados.indexOf(botNumber),1)
                    for(let usuario of usuariosSelecionados){
                        if(!groupAdmins.includes(usuario)) {
                            await socket.promoteParticipant(c, groupId, usuario)
                            respostaUsuarios += criarTexto(msgs_texto.grupo.promover.sucesso_usuario, usuario.replace("@s.whatsapp.net", ""))
                        } else {
                            respostaUsuarios += criarTexto(msgs_texto.grupo.promover.erro_usuario, usuario.replace("@s.whatsapp.net", ""))
                        }
                    }
                    if(!usuariosSelecionados.length) return await socket.reply(c, chatId, msgs_texto.grupo.promover.erro_bot, id)
                    await socket.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.grupo.promover.resposta, respostaUsuarios), usuariosSelecionados)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'rebaixar':
                try{
                    if (!isGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
                    var usuariosSelecionados = [], respostaUsuarios = ''
                    if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                    else if(quotedMsg) usuariosSelecionados.push(quotedMsgObjInfo.sender)
                    else return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    if(usuariosSelecionados.includes(botNumber)) usuariosSelecionados.splice(usuariosSelecionados.indexOf(botNumber),1)
                    for(let usuario of usuariosSelecionados){
                        if(groupAdmins.includes(usuario)) {
                            await socket.demoteParticipant(c, groupId, usuario)
                            respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.sucesso_usuario, usuario.replace("@s.whatsapp.net", ""))
                        } else {
                            respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.erro_usuario, usuario.replace("@s.whatsapp.net", ""))
                        }
                    }
                    if(!usuariosSelecionados.length) return socket.reply(c, chatId, msgs_texto.grupo.rebaixar.erro_bot, id)
                    await socket.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.grupo.rebaixar.resposta, respostaUsuarios), usuariosSelecionados)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'apg':
                try{
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!quotedMsg) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    await socket.deleteMessage(c, id, quotedMsg)
                } catch (err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'f':
                try{
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.bot_admin, id)
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    var estadoNovo = !grupoInfo.restrito_msg
                    await socket.setGroupToAdminsOnly(c, groupId, estadoNovo)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break 
        }
    } catch(err){
        consoleErro(err, "GRUPO")
    }
    
}