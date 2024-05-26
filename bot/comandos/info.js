//REQUERINDO MÓDULOS
import * as menu from '../lib/menu.js'
import {criarTexto, erroComandoMsg, timestampParaData, consoleErro, versaoAtual} from '../lib/util.js'
import * as socket from '../baileys/socket.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {obterMensagensTexto} from '../lib/msgs.js'



export const info = async(c, mensagemBaileys, botInfo) => {
    //Atribuição de valores
    const usuarios = new UsuarioControle()
    const grupos = new GrupoControle()
    const msgs_texto = obterMensagensTexto(botInfo)
    const { numero_dono, hostNumber: numero_bot, prefixo, nome_bot, nome_adm } = botInfo
    const {
        comando,
        args,
        remetente,
        texto_recebido,
        nome_usuario,
        mensagem_completa,
        id_chat,
        mensagem_grupo,
        grupo
    } = mensagemBaileys
    const { usuario_admin } = {...grupo}
    const comandoSemPrefixo = comando.replace(prefixo, "")

    //Comandos de info
    try{
        switch(comandoSemPrefixo){
            case `info`:
                try{
                    let version = versaoAtual()
                    let infoBot = botInfo
                    let botInicializacaoData = timestampParaData(infoBot.iniciado)
                    let resposta = criarTexto(msgs_texto.info.info.resposta, nome_adm?.trim(), nome_bot?.trim(), botInicializacaoData, infoBot.cmds_executados, numero_dono.replace("@s.whatsapp.net", ""), version)
                    await socket.obterFotoPerfil(c, numero_bot).then( async (botFotoURL)=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, id_chat, botFotoURL, resposta, mensagem_completa)
                    }).catch(async()=>{
                        await socket.responderTexto(c, id_chat, resposta, mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                
                break
            
            case `reportar`:
                try{
                    if(args.length == 1) return socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                    if(!numero_dono) return socket.responderTexto(c, id_chat, msgs_texto.info.reportar.erro, mensagem_completa)
                    let usuarioMensagem = texto_recebido.slice(10).trim(), resposta = criarTexto(msgs_texto.info.reportar.resposta, nome_usuario, remetente.replace("@s.whatsapp.net",""), usuarioMensagem)
                    await socket.enviarTexto(c,numero_dono, resposta)
                    await socket.responderTexto(c,id_chat,msgs_texto.info.reportar.sucesso,mensagem_completa)
                } catch(err){
                    throw err
                }
                break
            
            case `meusdados`:
                try{
                    let dadosUsuario = await usuarios.obterDadosUsuario(remetente), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    let nomeUsuario = nome_usuario
                    let resposta = criarTexto(msgs_texto.info.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                    if(botInfo.limite_diario.status) resposta += criarTexto(msgs_texto.info.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    if(mensagem_grupo){
                        let dadosGrupo = await grupos.obterGrupoInfo(id_chat)
                        if(dadosGrupo.contador.status){
                            let usuarioAtividade = await grupos.obterAtividadeParticipante(id_chat, remetente)
                            resposta += criarTexto(msgs_texto.info.meusdados.resposta_grupo, usuarioAtividade.msg)
                        }   
                    }
                    await socket.responderTexto(c, id_chat, resposta, mensagem_completa)
                } catch(err){
                    throw err
                }
                break
            
            case `menu`:
                try{
                    let dadosUsuario = await usuarios.obterDadosUsuario(remetente)
                    let tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite", totalComandos = dadosUsuario.comandos_total
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    let dadosResposta = '', nomeUsuario = nome_usuario
                    if(botInfo.limite_diario.status){
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario, totalComandos)
                    } else {
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_comum, nomeUsuario, tipoUsuario, totalComandos)
                    }
                    dadosResposta += `═════════════════\n`

                    if(args.length == 1){
                        let menuResposta = menu.menuPrincipal(botInfo)
                        await socket.enviarTexto(c, id_chat, dadosResposta+menuResposta)
                    } else {
                        let usuarioOpcao = args[1]
                        let menuResposta = menu.menuPrincipal(botInfo)
                        switch(usuarioOpcao){
                            case "0":
                                menuResposta = menu.menuInfoSuporte(botInfo)
                                break
                            case "1":
                                menuResposta = menu.menuFigurinhas(botInfo)
                                break
                            case "2":
                                menuResposta = menu.menuUtilidades(botInfo)
                                break
                            case "3":
                                menuResposta = menu.menuDownload(botInfo)
                                break
                            case "4":
                                if(mensagem_grupo) menuResposta = menu.menuGrupo(usuario_admin, botInfo)
                                else return await socket.responderTexto(c, id_chat, msgs_texto.permissao.grupo, mensagem_completa)
                                break
                            case "5":
                                menuResposta = menu.menuDiversao(mensagem_grupo, botInfo)
                                break
                        }
                        await socket.enviarTexto(c, id_chat, dadosResposta+menuResposta)
                    }
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem_completa)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "INFO")
    }
    

}