//REQUERINDO MODULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {downloadMediaMessage} from '@whiskeysockets/baileys'
import {obterMensagensTexto} from '../lib/msgs.js'


export const grupo = async(c, mensagemBaileys, botInfo) => {
    //Atribuição de valores
    const grupos = new GrupoControle()
    const msgs_texto = obterMensagensTexto(botInfo)
    const {prefixo, nome_bot, hostNumber: numero_bot} = botInfo
    const { 
        comando,
        args,
        texto_recebido,
        mensagem_completa,
        id_chat,
        remetente,
        mensagem_grupo,
        nome_usuario,
        tipo,
        mensagem_midia,
        mensagem_citada,
        midia,
        grupo,
        citacao,
        mencionados,
    } = mensagemBaileys
    const {mimetype} = {...midia}
    const {id_grupo, dono, participantes, admins, usuario_admin, bot_admin} = {...grupo}
    const comandoSemPrefixo = comando.replace(prefixo, "")

    // Verificação se é mensagem do grupo
    if (!mensagem_grupo) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.grupo, mensagem_completa)
    
    // Comandos de grupo
    try{
        switch(comandoSemPrefixo){
            case 'regras':
                try{
                    let grupoDescricao = grupo.descricao || msgs_texto.grupo.regras.sem_descrição
                    await socket.obterFotoPerfil(c, id_grupo).then(async (grupoFoto)=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, id_chat, grupoFoto, grupoDescricao, mensagem_completa)
                    }).catch(async ()=>{
                        await socket.responderTexto(c, id_chat, grupoDescricao, mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "fotogrupo":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    if(mensagem_midia || mensagem_citada){
                        let dadosMensagem = {
                            tipo : (mensagem_midia) ? tipo : citacao.tipo,
                            mimetype : (mensagem_midia)? mimetype : citacao.mimetype,
                            mensagem: (mensagem_midia) ? mensagem_completa : citacao.mensagem_citacao
                        }
                        if(dadosMensagem.tipo == MessageTypes.image){
                            let fotoBuffer = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                            await socket.alterarFotoPerfil(c, id_chat, fotoBuffer)
                            await socket.responderTexto(c, id_chat, msgs_texto.grupo.fotogrupo.sucesso, mensagem_completa)
                        } else {
                            return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                        }
                    } else {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                break
                
            
            case 'status':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    let resposta = msgs_texto.grupo.status.resposta_titulo
                    //Bem-vindo
                    resposta += (grupo.bemvindo.status) ? msgs_texto.grupo.status.resposta_variavel.bemvindo.on : msgs_texto.grupo.status.resposta_variavel.bemvindo.off
                    //Mutar
                    resposta += (grupo.mutar) ? msgs_texto.grupo.status.resposta_variavel.mutar.on : msgs_texto.grupo.status.resposta_variavel.mutar.off
                    //Auto-Sticker
                    resposta += (grupo.autosticker) ? msgs_texto.grupo.status.resposta_variavel.autosticker.on : msgs_texto.grupo.status.resposta_variavel.autosticker.off
                    //Anti-Link
                    resposta += (grupo.antilink) ? msgs_texto.grupo.status.resposta_variavel.antilink.on : msgs_texto.grupo.status.resposta_variavel.antilink.off
                    //Anti-fake
                    resposta += (grupo.antifake.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antifake.on, grupo.antifake.ddi_liberados.toString()) : msgs_texto.grupo.status.resposta_variavel.antifake.off
                    //Anti-flood
                    resposta += (grupo.antiflood.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antiflood.on, grupo.antiflood.max, grupo.antiflood.intervalo) : msgs_texto.grupo.status.resposta_variavel.antiflood.off 
                    //Contador
                    resposta += (grupo.contador.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.contador.on, grupo.contador.inicio) : msgs_texto.grupo.status.resposta_variavel.contador.off
                    //Bloqueio de CMDS
                    let comandosBloqueados = []
                    for (let comandoBloqueado of grupo.block_cmds){
                        comandosBloqueados.push(prefixo+comandoBloqueado)
                    }
                    resposta += (grupo.block_cmds.length != 0) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.on, comandosBloqueados.toString()) : msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.off
                    //Lista Negra
                    resposta += criarTexto(msgs_texto.grupo.status.resposta_variavel.listanegra, grupo.lista_negra.length)
                    await socket.enviarTexto(c, id_chat, resposta)
                } catch(err){
                    throw err
                }
                break
            
            case 'bv':
                try{
                    if (!usuario_admin) return socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    let estadoNovo = !grupo.bemvindo.status
                    if (estadoNovo) {
                        let usuarioMensagem = args.slice(1).join(" ")
                        await grupos.alterarBemVindo(id_grupo, true, usuarioMensagem)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.bemvindo.ligado, mensagem_completa)
                    } else {
                        await grupos.alterarBemVindo(id_grupo, false)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.bemvindo.desligado, mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                
                break

            case "blista":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    let blista_numero
                    if(mensagem_citada) {
                        blista_numero = citacao.remetente
                    } else if(mencionados.length > 0){
                        blista_numero = mencionados[0]
                    } else{
                        if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                        blista_numero = texto_recebido.slice(8).trim().replace(/\W+/g,"")
                        if(blista_numero.length == 0) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.blista.numero_vazio , mensagem_completa)
                        blista_numero = blista_numero+"@s.whatsapp.net"
                    }
                    if(blista_numero == numero_bot) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.blista.bot_erro , mensagem_completa)
                    else if(admins.includes(blista_numero)) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.blista.admin_erro , mensagem_completa)
                    let blista_grupo_lista = await grupos.obterListaNegra(id_grupo)
                    if(blista_grupo_lista.includes(blista_numero)) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.blista.ja_listado, mensagem_completa)
                    await grupos.adicionarUsuarioListaNegra(id_grupo, blista_numero)
                    await socket.responderTexto(c, id_chat, msgs_texto.grupo.blista.sucesso, mensagem_completa)
                    if(participantes.includes(blista_numero)) await socket.removerParticipante(c, id_chat, blista_numero)
                } catch(err){
                    throw err
                }
                break
            
            case "dlista":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let dlista_numero = texto_recebido.slice(8).trim().replace(/\W+/g,"")
                    if(dlista_numero.length == 0) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.dlista.numero_vazio, mensagem_completa)
                    let dlista_grupo_lista = await grupos.obterListaNegra(id_grupo), dlista_id_usuario = dlista_numero+"@s.whatsapp.net"
                    if(!dlista_grupo_lista.includes(dlista_id_usuario)) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.dlista.nao_listado, mensagem_completa)
                    await grupos.removerUsuarioListaNegra(id_grupo, dlista_id_usuario)
                    await socket.responderTexto(c, id_chat, msgs_texto.grupo.dlista.sucesso, mensagem_completa)
                } catch(err){
                    throw err
                }
                break
            
            case "listanegra":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    let lista_negra_grupo = await grupos.obterListaNegra(id_grupo), resposta_listanegra = msgs_texto.grupo.listanegra.resposta_titulo
                    if(lista_negra_grupo.length == 0) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.listanegra.lista_vazia, mensagem_completa)
                    for(let usuario_lista of lista_negra_grupo){
                        resposta_listanegra += criarTexto(msgs_texto.grupo.listanegra.resposta_itens, usuario_lista.replace(/@s.whatsapp.net/g, ''))
                    }
                    resposta_listanegra += `╠\n╚═〘 ${nome_bot?.trim()}®〙`
                    await socket.enviarTexto(c, id_chat, resposta_listanegra)
                } catch(err){
                    throw err
                }
                break

            case 'alink':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c,id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    let estadoNovo = !grupo.antilink
                    if (estadoNovo) {
                        await grupos.alterarAntiLink(id_grupo, true)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.antilink.ligado, mensagem_completa)
                    } else {
                        await grupos.alterarAntiLink(id_grupo, false)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.antilink.desligado, mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                break

            case 'autosticker':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    let estadoNovo = !grupo.autosticker
                    if (estadoNovo) {
                        await grupos.alterarAutoSticker(id_grupo, true)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.autosticker.ligado, mensagem_completa)
                    } else {
                        await grupos.alterarAutoSticker(id_grupo, false)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.autosticker.desligado, mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                break
                    
            case 'rlink':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    await socket.revogarLinkGrupo(c, id_grupo).then(async ()=>{
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.rlink.sucesso ,mensagem_completa)}
                    ).catch(async ()=>{
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.rlink.erro ,mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break        

            case 'afake':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    let estadoNovo = !grupo.antifake.status
                    if (estadoNovo) {
                        let DDIAutorizados = (texto_recebido.slice(7).length == 0) ? ["55"] : texto_recebido.slice(7).split(" ")
                        await grupos.alterarAntiFake(id_grupo, true, DDIAutorizados)
                        await socket.responderTexto(c, id_chat,  msgs_texto.grupo.antifake.ligado, mensagem_completa)
                    } else {
                        await grupos.alterarAntiFake(id_grupo, false)
                        await socket.responderTexto(c, id_chat,  msgs_texto.grupo.antifake.desligado, mensagem_completa)
                    } 
                } catch(err){
                    throw err
                }
                break

            case "mutar":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    let estadoNovo = !grupo.mutar
                    if (estadoNovo) {
                        await grupos.alterarMutar(id_grupo)
                        await socket.responderTexto(c, id_chat,  msgs_texto.grupo.mutar.ligado, mensagem_completa)
                    } else {
                        await grupos.alterarMutar(id_grupo,false)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.mutar.desligado, mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                break
                    
            case 'contador':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    let estadoNovo = !grupo.contador.status
                    let membrosAtuais = grupo.participantes
                    if (estadoNovo) {
                        await grupos.alterarContador(id_grupo)
                        await grupos.registrarContagemGrupo(id_grupo, membrosAtuais)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.contador.ligado, mensagem_completa)
                    } else {
                        await grupos.alterarContador(id_grupo, false)
                        await grupos.removerContagemGrupo(id_grupo)
                        await socket.responderTexto(c, id_chat, msgs_texto.grupo.contador.desligado, mensagem_completa)
                    } 
                } catch(err){
                    throw err
                }
                break

            case "atividade":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    if(!grupo.contador.status) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.atividade.erro_contador, mensagem_completa)
                    let atividadeUsuario
                    if(mensagem_citada){
                        atividadeUsuario = await grupos.obterAtividadeParticipante(id_grupo, citacao.remetente)
                        if(!atividadeUsuario) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.atividade.fora_grupo, mensagem_completa)
                    } else if (mencionados.length === 1){
                        atividadeUsuario = await grupos.obterAtividadeParticipante(id_grupo, mencionados[0])
                        if(!atividadeUsuario) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.atividade.fora_grupo, mensagem_completa)
                    } else {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo),mensagem_completa)
                    }
                    let atividadeResposta = criarTexto(msgs_texto.grupo.atividade.resposta, atividadeUsuario.msg, atividadeUsuario.texto, atividadeUsuario.imagem, atividadeUsuario.video, atividadeUsuario.sticker, atividadeUsuario.audio, atividadeUsuario.outro)
                    await socket.responderTexto(c, id_chat, atividadeResposta, mensagem_completa)
                } catch(err){
                    throw err
                }
                break

            case "imarcar":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let qtdMensagem = args[1]
                    if(isNaN(qtdMensagem)) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.minativos.erro_qtd , mensagem_completa)
                    if(qtdMensagem < 1 || qtdMensagem > 50) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.minativos.limite_qtd, mensagem_completa)
                    if(!grupo.contador.status) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.minativos.erro_contador, mensagem_completa)
                    let usuariosInativos = await grupos.obterParticipantesInativos(id_grupo, qtdMensagem)
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
                        await socket.enviarTextoComMencoes(c, id_chat, inativosResposta, mencionarUsuarios)
                    } else {
                        await socket.responderTexto(c, id_chat,msgs_texto.grupo.minativos.sem_inativo, mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                break
                
            case "ibanir":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let qtdMensagem = args[1]
                    if(isNaN(qtdMensagem)) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.binativos.erro_qtd , mensagem_completa)
                    if(qtdMensagem < 1 || qtdMensagem > 50) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.binativos.limite_qtd, mensagem_completa)
                    if(!grupo.contador.status) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.binativos.erro_contador , mensagem_completa)
                    let usuariosInativos = await grupos.obterParticipantesInativos(id_grupo, qtdMensagem), usuariosBanidos = 0
                    if(usuariosInativos.length != 0){
                        for(let usuario of usuariosInativos){
                            if(!admins.includes(usuario.id_usuario) && usuario.id_usuario != numero_bot){
                                await socket.removerParticipante(c, id_chat, usuario.id_usuario)
                                usuariosBanidos++
                            }
                        }
                    } 
                    if(usuariosBanidos) await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.grupo.binativos.sucesso, usuariosBanidos, qtdMensagem), mensagem_completa)
                    else await socket.responderTexto(c, id_chat,msgs_texto.grupo.binativos.sem_inativo, mensagem_completa)
                } catch(err){
                    throw err
                }
                break

            case "topativos":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let qtdUsuarios = args[1]
                    if(isNaN(qtdUsuarios)) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.topativos.erro_qtd , mensagem_completa)
                    if(qtdUsuarios < 1 || qtdUsuarios > 50) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.topativos.limite_qtd , mensagem_completa)
                    if(!grupo.contador.status) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.topativos.erro_contador , mensagem_completa)
                    let usuariosAtivos = await grupos.obterParticipantesAtivos(id_grupo, qtdUsuarios)
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
                    await socket.enviarTextoComMencoes(c, id_chat, respostaTop, usuariosMencionados)
                } catch(err){
                    throw err
                }
                break
            
            case "enquete":
                try{
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let enquetePergunta = texto_recebido.slice(9).split(",")[0], enqueteOpcoes = texto_recebido.slice(9).split(",").slice(1)
                    if(enqueteOpcoes.length < 2) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.enquete.min_opcao , mensagem_completa)
                    await socket.enviarEnquete(c, id_chat, enquetePergunta, enqueteOpcoes)
                } catch(err){
                    throw err
                }
                break
          
            case 'aflood':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    let intervalo = 10, maxMensagem = 10, estadoNovo = !grupo.antiflood.status
                    //VALIDAÇÃO DO ARGUMENTO - INTERVALO
                    if(args.length === 3){
                        let intervaloInserido = args[2]
                        if(!isNaN(intervaloInserido) && intervaloInserido>=10 && intervaloInserido<=60){
                            intervalo = intervaloInserido
                        } else {
                            return await socket.responderTexto(c, id_chat, msgs_texto.grupo.antiflood.intervalo,mensagem_completa)
                        }
                    }
                    //VALIDACAO DO ARGUMENTO - MÁX MENSAGEM
                    if(args.length >= 2){
                        let maxMensagemInserido = args[1]
                        if(!isNaN(maxMensagemInserido) && maxMensagemInserido>= 5 && maxMensagemInserido <= 20){
                            maxMensagem = maxMensagemInserido
                        } else {
                            return socket.responderTexto(c, id_chat, msgs_texto.grupo.antiflood.max,mensagem_completa)
                        }
                    }
                    if(estadoNovo) {
                        await grupos.alterarAntiFlood(id_grupo, true, maxMensagem, intervalo)
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.grupo.antiflood.ligado, maxMensagem, intervalo), mensagem_completa)
                    } else {
                        await grupos.alterarAntiFlood(id_grupo, false)
                        await socket.responderTexto(c, id_chat,  msgs_texto.grupo.antiflood.desligado, mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                break
            
            case "bcmd":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                    let usuarioComandos = texto_recebido.slice(6).split(" "), respostaBloqueio = await grupos.bloquearComandosGrupo(usuarioComandos, id_grupo, botInfo)
                    await socket.responderTexto(c, id_chat, respostaBloqueio, mensagem_completa)
                } catch(err){
                    throw err
                }   
                break
            
            case "dcmd":
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo),mensagem_completa)
                    let usuarioComandos = texto_recebido.slice(6).split(" "), respostaDesbloqueio = await grupos.desbloquearComandosGrupo(usuarioComandos, id_grupo, botInfo)
                    await socket.responderTexto(c, id_chat, respostaDesbloqueio, mensagem_completa)
                } catch(err){
                    throw err
                }
                break

            case 'link':
                try{
                    if (!bot_admin) return await socket.responderTexto(c, id_chat,msgs_texto.permissao.bot_admin, mensagem_completa)
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin , mensagem_completa)
                    let linkConvite = await socket.obterLinkGrupo(c, id_grupo)
                    let nome = grupo.nome
                    await socket.enviarLinkComPrevia(c, id_chat, criarTexto(msgs_texto.grupo.link.resposta, nome, linkConvite))
                } catch(err){
                    throw err
                }
                break

            case 'adms':
                try{
                    let usuarioTexto = texto_recebido.slice(6).trim()
                    let respostaMarcar = criarTexto(msgs_texto.grupo.adms.resposta_titulo, admins.length)
                    if(usuarioTexto.length > 0) respostaMarcar += criarTexto(msgs_texto.grupo.adms.mensagem, usuarioTexto)
                    for (let adm of admins) {
                        respostaMarcar += criarTexto(msgs_texto.grupo.adms.resposta_itens, adm.replace(/@s.whatsapp.net/g, ''))
                    }
                    let mensagemAlvo = mensagem_citada ? citacao.mensagem_citacao : mensagem_completa
                    await socket.responderComMencoes(c, id_chat, respostaMarcar, admins, mensagemAlvo)
                } catch(err){
                    throw err
                }
                break

            case "dono":
                try{
                    if(dono) await socket.responderComMencoes(c, id_chat, criarTexto(msgs_texto.grupo.dono.resposta, dono.replace("@s.whatsapp.net", "")), [dono], mensagem_completa)
                    else await socket.responderTexto(c, id_chat, msgs_texto.grupo.dono.sem_dono, mensagem_completa)
                } catch(err){
                    throw err
                }
                break

            case 'mt':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(4).trim()
                    let respostaMarcar = usuarioTexto.length > 0 ? criarTexto(msgs_texto.grupo.mt.resposta_motivo, participantes.length, usuarioTexto) : criarTexto(msgs_texto.grupo.mt.resposta, participantes.length)
                    await socket.enviarTextoComMencoes(c, id_chat, respostaMarcar, participantes)
                } catch(err){
                    throw err
                }
                break
                
            case 'mm':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    let membrosMarcados = []
                    let usuarioTexto = texto_recebido.slice(4).trim()
                    for(let membro of participantes){
                        if(!admins.includes(membro)) {
                            membrosMarcados.push(membro)
                        }
                    }
                    if(membrosMarcados.length == 0) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.mm.sem_membros, mensagem_completa)
                    let respostaMarcar = usuarioTexto.length > 0 ? criarTexto(msgs_texto.grupo.mm.resposta_motivo, membrosMarcados.length, usuarioTexto) : criarTexto(msgs_texto.grupo.mm.resposta, membrosMarcados.length)
                    await socket.enviarTextoComMencoes(c, id_chat, respostaMarcar, membrosMarcados)
                } catch(err){
                    throw err
                }
                break  
            
            case 'bantodos':
                try{
                    let verificarDono = remetente == dono
                    if (!verificarDono) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_dono_grupo, mensagem_completa)           
                    if (!bot_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.bot_admin, mensagem_completa)
                    for(let membro of participantes){
                        if (!admins.includes(membro)) await socket.removerParticipante(c, id_grupo, membro)
                    }
                    await socket.responderTexto(c, id_chat, msgs_texto.grupo.banirtodos.banir_sucesso, mensagem_completa)
                } catch(err){
                    throw err
                }
                break  
            
            case 'add':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.bot_admin, mensagem_completa)
                    if (args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioNumeros = texto_recebido.slice(5).split(",")
                    for(let numero of usuarioNumeros){
                        let numeroCompleto = numero.trim().replace(/\W+/g,"")+"@s.whatsapp.net"
                        await socket.adicionarParticipante(c, id_chat, numeroCompleto).then(async (res)=>{
                            if (res.status != 200) await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.grupo.add.add_erro, numeroCompleto.replace("@s.whatsapp.net", "")), mensagem_completa)
                        })
                        .catch(async ()=>{
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.grupo.add.numero_invalido, numeroCompleto.replace("@s.whatsapp.net", "")), mensagem_completa)
                        })
                    }
                } catch(err){
                    throw err
                }
                break

            case 'ban':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.bot_admin, mensagem_completa)
                    let usuariosSelecionados = []
                    if(mencionados.length === 0 && mensagem_citada) usuariosSelecionados.push(citacao.remetente)
                    else if(mencionados.length > 0) usuariosSelecionados = mencionados
                    else return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let idParticipantesAtuais = participantes
                    for(let usuario of usuariosSelecionados){
                        if(idParticipantesAtuais.includes(usuario)){
                            if(!admins.includes(usuario)){
                                await socket.removerParticipante(c, id_grupo, usuario).then(async ()=>{
                                    if(usuariosSelecionados.length === 1) {
                                        await socket.enviarTextoComMencoes(c, id_chat, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.banir.motivo, nome_usuario))
                                    }
                                })
                            } else {
                                if(usuariosSelecionados.length === 1) await socket.responderTexto(c, id_chat, msgs_texto.grupo.banir.banir_admin, mensagem_completa)
                            }
                        } else {
                            if(usuariosSelecionados.length === 1) await socket.responderTexto(c, id_chat,  msgs_texto.grupo.banir.banir_erro, mensagem_completa)
                        }
                    }   
                } catch(err){
                    throw err
                }
                break

            case 'promover':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.bot_admin, mensagem_completa)
                    let usuariosSelecionados = [], respostaUsuarios = ''
                    if(mencionados.length > 0) usuariosSelecionados = mencionados
                    else if(mensagem_citada) usuariosSelecionados.push(citacao.remetente)
                    else return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    if(usuariosSelecionados.includes(numero_bot)) usuariosSelecionados.splice(usuariosSelecionados.indexOf(numero_bot),1)
                    for(let usuario of usuariosSelecionados){
                        if(!admins.includes(usuario)) {
                            await socket.promoverParticipante(c, id_grupo, usuario)
                            respostaUsuarios += criarTexto(msgs_texto.grupo.promover.sucesso_usuario, usuario.replace("@s.whatsapp.net", ""))
                        } else {
                            respostaUsuarios += criarTexto(msgs_texto.grupo.promover.erro_usuario, usuario.replace("@s.whatsapp.net", ""))
                        }
                    }
                    if(!usuariosSelecionados.length) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.promover.erro_bot, mensagem_completa)
                    await socket.enviarTextoComMencoes(c, id_chat, criarTexto(msgs_texto.grupo.promover.resposta, respostaUsuarios), usuariosSelecionados)
                } catch(err){
                    throw err
                }
                break

            case 'rebaixar':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    if (!bot_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.bot_admin, mensagem_completa)
                    let usuariosSelecionados = [], respostaUsuarios = ''
                    if(mencionados.length > 0) usuariosSelecionados = mencionados
                    else if(mensagem_citada) usuariosSelecionados.push(citacao.remetente)
                    else return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    if(usuariosSelecionados.includes(numero_bot)) usuariosSelecionados.splice(usuariosSelecionados.indexOf(numero_bot),1)
                    for(let usuario of usuariosSelecionados){
                        if(admins.includes(usuario)) {
                            await socket.rebaixarParticipante(c, id_grupo, usuario)
                            respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.sucesso_usuario, usuario.replace("@s.whatsapp.net", ""))
                        } else {
                            respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.erro_usuario, usuario.replace("@s.whatsapp.net", ""))
                        }
                    }
                    if(!usuariosSelecionados.length) return await socket.responderTexto(c, id_chat, msgs_texto.grupo.rebaixar.erro_bot, mensagem_completa)
                    await socket.enviarTextoComMencoes(c, id_chat, criarTexto(msgs_texto.grupo.rebaixar.resposta, respostaUsuarios), usuariosSelecionados)
                } catch(err){
                    throw err
                }
                break

            case 'apg':
                try{
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    if (!mensagem_citada) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    await socket.deletarMensagem(c, mensagem_completa, mensagem_citada)
                } catch (err){
                    throw err
                }
                break

            case 'f':
                try{
                    if (!bot_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.bot_admin, mensagem_completa)
                    if (!usuario_admin) return await socket.responderTexto(c, id_chat, msgs_texto.permissao.apenas_admin, mensagem_completa)
                    let estadoNovo = !grupo.restrito_msg
                    await socket.alterarRestricaoGrupo(c, id_grupo, estadoNovo)
                } catch(err){
                    throw err
                }
                break 
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem_completa)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "GRUPO")
    }
}