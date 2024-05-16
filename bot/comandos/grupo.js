//REQUERINDO MODULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {downloadMediaMessage} from '@whiskeysockets/baileys'
import {obterMensagensTexto} from '../lib/msgs.js'


export const grupo = async(c, mensagemBaileys, botInfoJSON) => {
    const grupos = new GrupoControle()
    const msgs_texto = obterMensagensTexto(botInfoJSON)
    const botNumber = botInfoJSON.hostNumber, {prefixo, nome_bot} = botInfoJSON
    const {groupId, grupoInfo, groupOwner, groupMembers, groupAdmins, isGroupAdmins, isBotGroupAdmins} = mensagemBaileys.grupo
    const {command, args, textoRecebido, id, chatId, sender, isGroupMsg, username, type, isMedia, mimetype, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList} = mensagemBaileys

    if (!isGroupMsg) return await socket.responderTexto(c, chatId, msgs_texto.permissao.grupo, id)
    let cmdSemPrefixo = command.replace(prefixo, "")

    try{
        switch(cmdSemPrefixo){
            case 'regras':
                try{
                    let grupoDescricao = grupoInfo.descricao || msgs_texto.grupo.regras.sem_descrição
                    await socket.obterFotoPerfil(c, groupId).then(async (grupoFoto)=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, chatId, grupoFoto, grupoDescricao, id)
                    }).catch(async ()=>{
                        await socket.responderTexto(c, chatId, grupoDescricao, id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "fotogrupo":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    if(isMedia || quotedMsg){
                        let dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            mensagem: (isMedia) ? id : quotedMsgObj
                        }
                        if(dadosMensagem.tipo == MessageTypes.image){
                            let fotoBuffer = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                            await socket.alterarFotoPerfil(c, chatId, fotoBuffer)
                            await socket.responderTexto(c, chatId, msgs_texto.grupo.fotogrupo.sucesso, id)
                        } else {
                            return await socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                        }
                    } else {
                        return await socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                    }
                } catch(err){
                    throw err
                }
                break
                
            
            case 'status':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    let resposta = msgs_texto.grupo.status.resposta_titulo
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
                    resposta += (grupoInfo.antiflood.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antiflood.on, grupoInfo.antiflood.max, grupoInfo.antiflood.intervalo) : msgs_texto.grupo.status.resposta_variavel.antiflood.off 
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
                    await socket.enviarTexto(c, chatId, resposta)
                } catch(err){
                    throw err
                }
                break
            
            case 'bv':
                try{
                    if (!isGroupAdmins) return socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    let estadoNovo = !grupoInfo.bemvindo.status
                    if (estadoNovo) {
                        let usuarioMensagem = args.slice(1).join(" ")
                        await grupos.alterarBemVindo(groupId, true, usuarioMensagem)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.bemvindo.ligado, id)
                    } else {
                        await grupos.alterarBemVindo(groupId, false)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.bemvindo.desligado, id)
                    }
                } catch(err){
                    throw err
                }
                
                break

            case "blista":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let blista_numero
                    if(quotedMsg) {
                        blista_numero = quotedMsgObjInfo.sender
                    } else if(mentionedJidList.length > 0){
                        blista_numero = mentionedJidList[0]
                    } else{
                        if(args.length == 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                        blista_numero = textoRecebido.slice(8).trim().replace(/\W+/g,"")
                        if(blista_numero.length == 0) return await socket.responderTexto(c, chatId, msgs_texto.grupo.blista.numero_vazio , id)
                        blista_numero = blista_numero+"@s.whatsapp.net"
                    }
                    if(blista_numero == botNumber) return await socket.responderTexto(c, chatId, msgs_texto.grupo.blista.bot_erro , id)
                    else if(groupAdmins.includes(blista_numero)) return await socket.responderTexto(c, chatId, msgs_texto.grupo.blista.admin_erro , id)
                    let blista_grupo_lista = await grupos.obterListaNegra(groupId)
                    if(blista_grupo_lista.includes(blista_numero)) return await socket.responderTexto(c, chatId, msgs_texto.grupo.blista.ja_listado, id)
                    await grupos.adicionarUsuarioListaNegra(groupId, blista_numero)
                    await socket.responderTexto(c, chatId, msgs_texto.grupo.blista.sucesso, id)
                    if(groupMembers.includes(blista_numero)) await socket.removerParticipante(c, chatId, blista_numero)
                } catch(err){
                    throw err
                }
                break
            
            case "dlista":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    if(args.length == 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let dlista_numero = textoRecebido.slice(8).trim().replace(/\W+/g,"")
                    if(dlista_numero.length == 0) return await socket.responderTexto(c, chatId, msgs_texto.grupo.dlista.numero_vazio, id)
                    let dlista_grupo_lista = await grupos.obterListaNegra(groupId), dlista_id_usuario = dlista_numero+"@s.whatsapp.net"
                    if(!dlista_grupo_lista.includes(dlista_id_usuario)) return await socket.responderTexto(c, chatId, msgs_texto.grupo.dlista.nao_listado, id)
                    await grupos.removerUsuarioListaNegra(groupId, dlista_id_usuario)
                    await socket.responderTexto(c, chatId, msgs_texto.grupo.dlista.sucesso, id)
                } catch(err){
                    throw err
                }
                break
            
            case "listanegra":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let lista_negra_grupo = await grupos.obterListaNegra(groupId), resposta_listanegra = msgs_texto.grupo.listanegra.resposta_titulo
                    if(lista_negra_grupo.length == 0) return await socket.responderTexto(c, chatId, msgs_texto.grupo.listanegra.lista_vazia, id)
                    for(let usuario_lista of lista_negra_grupo){
                        resposta_listanegra += criarTexto(msgs_texto.grupo.listanegra.resposta_itens, usuario_lista.replace(/@s.whatsapp.net/g, ''))
                    }
                    resposta_listanegra += `╠\n╚═〘 ${nome_bot?.trim()}®〙`
                    await socket.enviarTexto(c, chatId, resposta_listanegra)
                } catch(err){
                    throw err
                }
                break

            case 'alink':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c,chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let estadoNovo = !grupoInfo.antilink
                    if (estadoNovo) {
                        await grupos.alterarAntiLink(groupId, true)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.antilink.ligado, id)
                    } else {
                        await grupos.alterarAntiLink(groupId, false)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.antilink.desligado, id)
                    }
                } catch(err){
                    throw err
                }
                break

            case 'autosticker':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    let estadoNovo = !grupoInfo.autosticker
                    if (estadoNovo) {
                        await grupos.alterarAutoSticker(groupId, true)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.autosticker.ligado, id)
                    } else {
                        await grupos.alterarAutoSticker(groupId, false)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.autosticker.desligado, id)
                    }
                } catch(err){
                    throw err
                }
                break
                    
            case 'rlink':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    await socket.revokeGroupInviteLink(c, groupId).then(async ()=>{
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.rlink.sucesso ,id)}
                    ).catch(async ()=>{
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.rlink.erro ,id)
                    })
                } catch(err){
                    throw err
                }
                break        

            case 'afake':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let estadoNovo = !grupoInfo.antifake.status
                    if (estadoNovo) {
                        let DDIAutorizados = (textoRecebido.slice(7).length == 0) ? ["55"] : textoRecebido.slice(7).split(" ")
                        await grupos.alterarAntiFake(groupId, true, DDIAutorizados)
                        await socket.responderTexto(c, chatId,  msgs_texto.grupo.antifake.ligado, id)
                    } else {
                        await grupos.alterarAntiFake(groupId, false)
                        await socket.responderTexto(c, chatId,  msgs_texto.grupo.antifake.desligado, id)
                    } 
                } catch(err){
                    throw err
                }
                break

            case "mutar":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    let estadoNovo = !grupoInfo.mutar
                    if (estadoNovo) {
                        await grupos.alterarMutar(groupId)
                        await socket.responderTexto(c, chatId,  msgs_texto.grupo.mutar.ligado, id)
                    } else {
                        await grupos.alterarMutar(groupId,false)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.mutar.desligado, id)
                    }
                } catch(err){
                    throw err
                }
                break
                    
            case 'contador':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    let estadoNovo = !grupoInfo.contador.status
                    let membrosAtuais = grupoInfo.participantes
                    if (estadoNovo) {
                        await grupos.alterarContador(groupId)
                        await grupos.registrarContagemGrupo(groupId, membrosAtuais)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.contador.ligado, id)
                    } else {
                        await grupos.alterarContador(groupId, false)
                        await grupos.removerContagemGrupo(groupId)
                        await socket.responderTexto(c, chatId, msgs_texto.grupo.contador.desligado, id)
                    } 
                } catch(err){
                    throw err
                }
                break

            case "atividade":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if(!grupoInfo.contador.status) return await socket.responderTexto(c, chatId, msgs_texto.grupo.atividade.erro_contador, id)
                    let atividadeUsuario
                    if(quotedMsg){
                        atividadeUsuario = await grupos.obterAtividadeParticipante(groupId, quotedMsgObjInfo.sender)
                        if(!atividadeUsuario) return await socket.responderTexto(c, chatId, msgs_texto.grupo.atividade.fora_grupo, id)
                    } else if (mentionedJidList.length === 1){
                        atividadeUsuario = await grupos.obterAtividadeParticipante(groupId, mentionedJidList[0])
                        if(!atividadeUsuario) return await socket.responderTexto(c, chatId, msgs_texto.grupo.atividade.fora_grupo, id)
                    } else {
                        return await socket.responderTexto(c, chatId, await erroComandoMsg(command),id)
                    }
                    let atividadeResposta = criarTexto(msgs_texto.grupo.atividade.resposta, atividadeUsuario.msg, atividadeUsuario.texto, atividadeUsuario.imagem, atividadeUsuario.video, atividadeUsuario.sticker, atividadeUsuario.audio, atividadeUsuario.outro)
                    await socket.responderTexto(c, chatId, atividadeResposta, id)
                } catch(err){
                    throw err
                }
                break

            case "imarcar":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                    let qtdMensagem = args[1]
                    if(isNaN(qtdMensagem)) return await socket.responderTexto(c, chatId, msgs_texto.grupo.minativos.erro_qtd , id)
                    if(qtdMensagem < 1 || qtdMensagem > 50) return await socket.responderTexto(c, chatId, msgs_texto.grupo.minativos.limite_qtd, id)
                    if(!grupoInfo.contador.status) return await socket.responderTexto(c, chatId, msgs_texto.grupo.minativos.erro_contador, id)
                    let usuariosInativos = await grupos.obterParticipantesInativos(groupId, qtdMensagem)
                    let qtdInativos = usuariosInativos.length
                    if(qtdInativos > 0){
                        let mencionarUsuarios = []
                        let inativosResposta = criarTexto(msgs_texto.grupo.minativos.resposta_titulo, qtdMensagem, qtdInativos)
                        inativosResposta += `═════════════════\n╠\n`
                        for(let usuario of usuariosInativos){
                            inativosResposta += criarTexto(msgs_texto.grupo.minativos.resposta_itens, usuario.id_usuario.replace(/@s.whatsapp.net/g, ''), usuario.msg)
                            mencionarUsuarios.push(usuario.id_usuario)
                        }
                        inativosResposta += `╠\n╚═〘 ${nome_bot?.trim()}® 〙`
                        await socket.enviarTextoComMencoes(c, chatId, inativosResposta, mencionarUsuarios)
                    } else {
                        await socket.responderTexto(c, chatId,msgs_texto.grupo.minativos.sem_inativo, id)
                    }
                } catch(err){
                    throw err
                }
                break
                
            case "ibanir":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let qtdMensagem = args[1]
                    if(isNaN(qtdMensagem)) return await socket.responderTexto(c, chatId, msgs_texto.grupo.binativos.erro_qtd , id)
                    if(qtdMensagem < 1 || qtdMensagem > 50) return await socket.responderTexto(c, chatId, msgs_texto.grupo.binativos.limite_qtd, id)
                    if(!grupoInfo.contador.status) return await socket.responderTexto(c, chatId, msgs_texto.grupo.binativos.erro_contador , id)
                    let usuariosInativos = await grupos.obterParticipantesInativos(groupId, qtdMensagem), usuariosBanidos = 0
                    if(usuariosInativos.length != 0){
                        for(let usuario of usuariosInativos){
                            if(!groupAdmins.includes(usuario.id_usuario) && usuario.id_usuario != botNumber){
                                await socket.removerParticipante(c, chatId, usuario.id_usuario)
                                usuariosBanidos++
                            }
                        }
                    } 
                    if(usuariosBanidos) await socket.responderTexto(c, chatId, criarTexto(msgs_texto.grupo.binativos.sucesso, usuariosBanidos, qtdMensagem), id)
                    else await socket.responderTexto(c, chatId,msgs_texto.grupo.binativos.sem_inativo, id)
                } catch(err){
                    throw err
                }
                break

            case "topativos":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length == 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                    let qtdUsuarios = args[1]
                    if(isNaN(qtdUsuarios)) return await socket.responderTexto(c, chatId, msgs_texto.grupo.topativos.erro_qtd , id)
                    if(qtdUsuarios < 1 || qtdUsuarios > 50) return await socket.responderTexto(c, chatId, msgs_texto.grupo.topativos.limite_qtd , id)
                    if(!grupoInfo.contador.status) return await socket.responderTexto(c, chatId, msgs_texto.grupo.topativos.erro_contador , id)
                    let usuariosAtivos = await grupos.obterParticipantesAtivos(groupId, qtdUsuarios)
                    let usuariosMencionados = []
                    let respostaTop = criarTexto(msgs_texto.grupo.topativos.resposta_titulo, qtdUsuarios)
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
                    await socket.enviarTextoComMencoes(c, chatId, respostaTop, usuariosMencionados)
                } catch(err){
                    throw err
                }
                break
            
            case "enquete":
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                    let enquetePergunta = textoRecebido.slice(9).split(",")[0], enqueteOpcoes = textoRecebido.slice(9).split(",").slice(1)
                    if(enqueteOpcoes.length < 2) return await socket.responderTexto(c, chatId, msgs_texto.grupo.enquete.min_opcao , id)
                    await socket.enviarEnquete(c, chatId, enquetePergunta, enqueteOpcoes)
                } catch(err){
                    throw err
                }
                break
          
            case 'aflood':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let intervalo = 10, maxMensagem = 10, estadoNovo = !grupoInfo.antiflood.status
                    //VALIDAÇÃO DO ARGUMENTO - INTERVALO
                    if(args.length === 3){
                        let intervaloInserido = args[2]
                        if(!isNaN(intervalo) && intervalo>=10 && intervalo<=60){
                            intervalo = intervaloInserido
                        } else {
                            return await socket.responderTexto(c, chatId, msgs_texto.grupo.antiflood.intervalo,id)
                        }
                    }
                    //VALIDACAO DO ARGUMENTO - MÁX MENSAGEM
                    if(args.length >= 2){
                        let maxMensagemInserido = args[1]
                        if(!isNaN(maxMensagemInserido) && maxMensagemInserido>= 5 && maxMensagemInserido <= 20){
                            maxMensagem = maxMensagemInserido
                        } else {
                            return socket.responderTexto(c, chatId, msgs_texto.grupo.antiflood.max,id)
                        }
                    }
                    if(estadoNovo) {
                        await grupos.alterarAntiFlood(groupId, true, maxMensagem, intervalo)
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.grupo.antiflood.ligado, maxMensagem, intervalo), id)
                    } else {
                        await grupos.alterarAntiFlood(groupId, false)
                        await socket.responderTexto(c, chatId,  msgs_texto.grupo.antiflood.desligado, id)
                    }
                } catch(err){
                    throw err
                }
                break
            
            case "bcmd":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) ,id)
                    let usuarioComandos = textoRecebido.slice(6).split(" "), respostaBloqueio = await grupos.bloquearComandosGrupo(usuarioComandos, groupId)
                    await socket.responderTexto(c, chatId, respostaBloqueio, id)
                } catch(err){
                    throw err
                }   
                break
            
            case "dcmd":
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command),id)
                    let usuarioComandos = textoRecebido.slice(6).split(" "), respostaDesbloqueio = await grupos.desbloquearComandosGrupo(usuarioComandos, groupId)
                    await socket.responderTexto(c, chatId, respostaDesbloqueio, id)
                } catch(err){
                    throw err
                }
                break

            case 'link':
                try{
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId,msgs_texto.permissao.bot_admin, id)
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    let linkConvite = await socket.obterLinkGrupo(c, groupId)
                    let nome = grupoInfo.nome
                    await socket.enviarLinkComPrevia(c, chatId, criarTexto(msgs_texto.grupo.link.resposta, nome, linkConvite))
                } catch(err){
                    throw err
                }
                break

            case 'adms':
                try{
                    let usuarioTexto = textoRecebido.slice(6).trim()
                    let respostaMarcar = criarTexto(msgs_texto.grupo.adms.resposta_titulo, groupAdmins.length)
                    if(usuarioTexto.length > 0) respostaMarcar += criarTexto(msgs_texto.grupo.adms.mensagem, usuarioTexto)
                    for (let adm of groupAdmins) {
                        respostaMarcar += criarTexto(msgs_texto.grupo.adms.resposta_itens, adm.replace(/@s.whatsapp.net/g, ''))
                    }
                    let mensagemAlvo = quotedMsg ? quotedMsgObj : id
                    await socket.responderComMencoes(c, chatId, respostaMarcar, groupAdmins, mensagemAlvo)
                } catch(err){
                    throw err
                }
                break

            case "dono":
                try{
                    if(groupOwner) await socket.responderComMencoes(c, chatId, criarTexto(msgs_texto.grupo.dono.resposta, groupOwner.replace("@s.whatsapp.net", "")), [groupOwner], id)
                    else await socket.responderTexto(c, chatId, msgs_texto.grupo.dono.sem_dono, id)
                } catch(err){
                    throw err
                }
                break

            case 'mt':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    let usuarioTexto = textoRecebido.slice(4).trim()
                    let respostaMarcar = usuarioTexto.length > 0 ? criarTexto(msgs_texto.grupo.mt.resposta_motivo, groupMembers.length, usuarioTexto) : criarTexto(msgs_texto.grupo.mt.resposta, groupMembers.length)
                    await socket.enviarTextoComMencoes(c, chatId, respostaMarcar, groupMembers)
                } catch(err){
                    throw err
                }
                break
                
            case 'mm':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    let membrosMarcados = []
                    let usuarioTexto = textoRecebido.slice(4).trim()
                    for(let membro of groupMembers){
                        if(!groupAdmins.includes(membro)) {
                            membrosMarcados.push(membro)
                        }
                    }
                    if(membrosMarcados.length == 0) return await socket.responderTexto(c, chatId, msgs_texto.grupo.mm.sem_membros, id)
                    let respostaMarcar = usuarioTexto.length > 0 ? criarTexto(msgs_texto.grupo.mm.resposta_motivo, membrosMarcados.length, usuarioTexto) : criarTexto(msgs_texto.grupo.mm.resposta, membrosMarcados.length)
                    await socket.enviarTextoComMencoes(c, chatId, respostaMarcar, membrosMarcados)
                } catch(err){
                    throw err
                }
                break  
            
            case 'bantodos':
                try{
                    let verificarDono = sender == groupOwner
                    if (!verificarDono) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_dono_grupo, id)           
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.bot_admin, id)
                    for(let membro of groupMembers){
                        if (!groupAdmins.includes(membro)) await socket.removerParticipante(c, groupId, membro)
                    }
                    await socket.responderTexto(c, chatId, msgs_texto.grupo.banirtodos.banir_sucesso, id)
                } catch(err){
                    throw err
                }
                break  
            
            case 'add':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.bot_admin, id)
                    if (args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let usuarioNumeros = textoRecebido.slice(5).split(",")
                    for(let numero of usuarioNumeros){
                        let numeroCompleto = numero.trim().replace(/\W+/g,"")+"@s.whatsapp.net"
                        await socket.adicionarParticipante(c, chatId, numeroCompleto).then(async (res)=>{
                            if (res.status != 200) await socket.responderTexto(c, chatId, criarTexto(msgs_texto.grupo.add.add_erro, numeroCompleto.replace("@s.whatsapp.net", "")), id)
                        })
                        .catch(async ()=>{
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.grupo.add.numero_invalido, numeroCompleto.replace("@s.whatsapp.net", "")), id)
                        })
                    }
                } catch(err){
                    throw err
                }
                break

            case 'ban':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.bot_admin, id)
                    let usuariosSelecionados = []
                    if(mentionedJidList.length === 0 && quotedMsg) usuariosSelecionados.push(quotedMsgObjInfo.sender)
                    else if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                    else return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let idParticipantesAtuais = groupMembers
                    for(let usuario of usuariosSelecionados){
                        if(idParticipantesAtuais.includes(usuario)){
                            if(!groupAdmins.includes(usuario)){
                                await socket.removerParticipante(c, groupId, usuario).then(async ()=>{
                                    if(usuariosSelecionados.length === 1) {
                                        await socket.enviarTextoComMencoes(c, chatId, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.banir.motivo, username))
                                    }
                                })
                            } else {
                                if(usuariosSelecionados.length === 1) await socket.responderTexto(c, chatId, msgs_texto.grupo.banir.banir_admin, id)
                            }
                        } else {
                            if(usuariosSelecionados.length === 1) await socket.responderTexto(c, chatId,  msgs_texto.grupo.banir.banir_erro, id)
                        }
                    }   
                } catch(err){
                    throw err
                }
                break

            case 'promover':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.bot_admin, id)
                    let usuariosSelecionados = [], respostaUsuarios = ''
                    if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                    else if(quotedMsg) usuariosSelecionados.push(quotedMsgObjInfo.sender)
                    else return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    if(usuariosSelecionados.includes(botNumber)) usuariosSelecionados.splice(usuariosSelecionados.indexOf(botNumber),1)
                    for(let usuario of usuariosSelecionados){
                        if(!groupAdmins.includes(usuario)) {
                            await socket.promoverParticipante(c, groupId, usuario)
                            respostaUsuarios += criarTexto(msgs_texto.grupo.promover.sucesso_usuario, usuario.replace("@s.whatsapp.net", ""))
                        } else {
                            respostaUsuarios += criarTexto(msgs_texto.grupo.promover.erro_usuario, usuario.replace("@s.whatsapp.net", ""))
                        }
                    }
                    if(!usuariosSelecionados.length) return await socket.responderTexto(c, chatId, msgs_texto.grupo.promover.erro_bot, id)
                    await socket.enviarTextoComMencoes(c, chatId, criarTexto(msgs_texto.grupo.promover.resposta, respostaUsuarios), usuariosSelecionados)
                } catch(err){
                    throw err
                }
                break

            case 'rebaixar':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.bot_admin, id)
                    let usuariosSelecionados = [], respostaUsuarios = ''
                    if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                    else if(quotedMsg) usuariosSelecionados.push(quotedMsgObjInfo.sender)
                    else return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    if(usuariosSelecionados.includes(botNumber)) usuariosSelecionados.splice(usuariosSelecionados.indexOf(botNumber),1)
                    for(let usuario of usuariosSelecionados){
                        if(groupAdmins.includes(usuario)) {
                            await socket.rebaixarParticipante(c, groupId, usuario)
                            respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.sucesso_usuario, usuario.replace("@s.whatsapp.net", ""))
                        } else {
                            respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.erro_usuario, usuario.replace("@s.whatsapp.net", ""))
                        }
                    }
                    if(!usuariosSelecionados.length) return await socket.responderTexto(c, chatId, msgs_texto.grupo.rebaixar.erro_bot, id)
                    await socket.enviarTextoComMencoes(c, chatId, criarTexto(msgs_texto.grupo.rebaixar.resposta, respostaUsuarios), usuariosSelecionados)
                } catch(err){
                    throw err
                }
                break

            case 'apg':
                try{
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    if (!quotedMsg) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    await socket.deletarMensagem(c, id, quotedMsg)
                } catch (err){
                    throw err
                }
                break

            case 'f':
                try{
                    if (!isBotGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.bot_admin, id)
                    if (!isGroupAdmins) return await socket.responderTexto(c, chatId, msgs_texto.permissao.apenas_admin, id)
                    let estadoNovo = !grupoInfo.restrito_msg
                    await socket.alterarRestricaoGrupo(c, groupId, estadoNovo)
                } catch(err){
                    throw err
                }
                break 
        }
    } catch(err){
        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "GRUPO")
    }
}