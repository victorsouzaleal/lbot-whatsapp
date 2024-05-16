//REQUERINDO MÓDULOS
import * as menu from '../lib/menu.js'
import {criarTexto, erroComandoMsg, timestampParaData, consoleErro, versaoAtual} from '../lib/util.js'
import * as socket from '../baileys/socket.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {obterMensagensTexto} from '../lib/msgs.js'



export const info = async(c, mensagemBaileys, botInfoJSON) => {
    const usuarios = new UsuarioControle()
    const grupos = new GrupoControle()
    const msgs_texto = obterMensagensTexto(botInfoJSON)
    const ownerNumber = botInfoJSON.numero_dono, botNumber = botInfoJSON.hostNumber, {prefixo, nome_bot, nome_adm} = botInfoJSON
    const {groupId, isGroupAdmins} = mensagemBaileys.grupo
    const {command, args, textoRecebido, id, chatId, sender, isGroupMsg, username} = mensagemBaileys
    let cmdSemPrefixo = command.replace(prefixo, "")

    try{
        switch(cmdSemPrefixo){
            case `info`:
                try{
                    let version = versaoAtual()
                    let infoBot = botInfoJSON
                    let botInicializacaoData = timestampParaData(infoBot.iniciado)
                    let resposta = criarTexto(msgs_texto.info.info.resposta, nome_adm?.trim(), nome_bot?.trim(), botInicializacaoData, infoBot.cmds_executados, ownerNumber.replace("@s.whatsapp.net", ""), version)
                    await socket.obterFotoPerfil(c, botNumber).then( async (botFotoURL)=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, chatId, botFotoURL, resposta, id)
                    }).catch(async()=>{
                        await socket.responderTexto(c, chatId, resposta, id)
                    })
                } catch(err){
                    throw err
                }
                
                break
            
            case `reportar`:
                try{
                    if(args.length == 1) return socket.responderTexto(c, chatId, erroComandoMsg(command, botInfoJSON) ,id)
                    if(ownerNumber == '') return socket.responderTexto(c, chatId, msgs_texto.info.reportar.erro, id)
                    let usuarioMensagem = textoRecebido.slice(10).trim(), resposta = criarTexto(msgs_texto.info.reportar.resposta, username, sender.replace("@s.whatsapp.net",""), usuarioMensagem)
                    await socket.enviarTexto(c,ownerNumber, resposta)
                    await socket.responderTexto(c,chatId,msgs_texto.info.reportar.sucesso,id)
                } catch(err){
                    throw err
                }
                break
            
            case `meusdados`:
                try{
                    let dadosUsuario = await usuarios.obterDadosUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    let nomeUsuario = username
                    let resposta = criarTexto(msgs_texto.info.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                    if(botInfoJSON.limite_diario.status) resposta += criarTexto(msgs_texto.info.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    if(isGroupMsg){
                        let dadosGrupo = await grupos.obterGrupoInfo(groupId)
                        if(dadosGrupo.contador.status){
                            let usuarioAtividade = await grupos.obterAtividadeParticipante(groupId,sender)
                            resposta += criarTexto(msgs_texto.info.meusdados.resposta_grupo, usuarioAtividade.msg)
                        }   
                    }
                    await socket.responderTexto(c, chatId, resposta, id)
                } catch(err){
                    throw err
                }
                break
            
            case `menu`:
                try{
                    let dadosUsuario = await usuarios.obterDadosUsuario(sender)
                    let tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite", totalComandos = dadosUsuario.comandos_total
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    let dadosResposta = '', nomeUsuario = username
                    if(botInfoJSON.limite_diario.status){
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario, totalComandos)
                    } else {
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_comum, nomeUsuario, tipoUsuario, totalComandos)
                    }
                    dadosResposta += `═════════════════\n`

                    if(args.length == 1){
                        let menuResposta = menu.menuPrincipal(botInfoJSON)
                        await socket.enviarTexto(c, chatId, dadosResposta+menuResposta)
                    } else {
                        let usuarioOpcao = args[1]
                        let menuResposta = menu.menuPrincipal(botInfoJSON)
                        switch(usuarioOpcao){
                            case "0":
                                menuResposta = menu.menuInfoSuporte(botInfoJSON)
                                break
                            case "1":
                                menuResposta = menu.menuFigurinhas(botInfoJSON)
                                break
                            case "2":
                                menuResposta = menu.menuUtilidades(botInfoJSON)
                                break
                            case "3":
                                menuResposta = menu.menuDownload(botInfoJSON)
                                break
                            case "4":
                                if(isGroupMsg) menuResposta = menu.menuGrupo(isGroupAdmins, botInfoJSON)
                                else return await socket.responderTexto(c, chatId, msgs_texto.permissao.grupo, id)
                                break
                            case "5":
                                menuResposta = menu.menuDiversao(isGroupMsg, botInfoJSON)
                                break
                        }
                        await socket.enviarTexto(c, chatId, dadosResposta+menuResposta)
                    }
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "INFO")
    }
    

}