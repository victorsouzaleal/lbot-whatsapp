//REQUERINDO MÓDULOS
import fs from 'fs-extra'
import * as menu from '../lib/menu.js'
import {criarTexto, erroComandoMsg, timestampParaData, consoleErro} from '../lib/util.js'
import path from 'node:path'
import * as gruposdb from '../database/grupos.js'
import * as usuariosdb from '../database/usuarios.js'
import * as socket from '../baileys/socket-funcoes.js'
import * as grupos from '../controle/gruposControle.js'
import {MessageTypes} from '../baileys/mensagem.js'


export const info = async(c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto, ownerNumber} = mensagemInfoCompleta
        const {botInfoJSON, botNumber} = mensagemInfoCompleta.bot
        const {groupId, isGroupAdmins} = mensagemInfoCompleta.grupo
        const {command, args, textoRecebido, id, chatId, sender, isGroupMsg, username} = mensagemInfoCompleta.mensagem
        const {prefixo, nome_bot, nome_adm} = botInfoJSON
        let cmdSemPrefixo = command.replace(prefixo, "")

        switch(cmdSemPrefixo){
            case `info`:
                try{
                    var version = JSON.parse(fs.readFileSync(path.resolve('package.json'))).version
                    const botFotoURL = await socket.getProfilePicFromServer(c,botNumber)
                    var infoBot = botInfoJSON
                    var botInicializacaoData = timestampParaData(infoBot.iniciado)
                    var resposta = criarTexto(msgs_texto.info.info.resposta, nome_adm?.trim(), nome_bot?.trim(), botInicializacaoData, infoBot.cmds_executados, ownerNumber.replace("@s.whatsapp.net", ""), version)
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
                    if(args.length == 1) return socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                    if(ownerNumber == '') return socket.reply(c, chatId, msgs_texto.info.reportar.erro, id)
                    var usuarioMensagem = textoRecebido.slice(10).trim(), resposta = criarTexto(msgs_texto.info.reportar.resposta, username, sender.replace("@s.whatsapp.net",""), usuarioMensagem)
                    await socket.sendText(c,ownerNumber, resposta)
                    await socket.reply(c,chatId,msgs_texto.info.reportar.sucesso,id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break
            
            case `meusdados`:
                try{
                    var dadosUsuario = await usuariosdb.obterUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    var nomeUsuario = username , resposta = criarTexto(msgs_texto.info.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                    if(botInfoJSON.limite_diario.status) resposta += criarTexto(msgs_texto.info.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    if(isGroupMsg){
                        var dadosGrupo = await grupos.obterGrupoInfo(groupId)
                        if(dadosGrupo.contador.status){
                            var usuarioAtividade = await gruposdb.obterAtividade(groupId,sender)
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
                    var dadosUsuario = await usuariosdb.obterUsuario(sender)
                    var tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite", totalComandos = dadosUsuario.comandos_total
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    var dadosResposta = '', nomeUsuario = username
                    if(botInfoJSON.limite_diario.status){
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario, totalComandos)
                    } else {
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_comum, nomeUsuario, tipoUsuario, totalComandos)
                    }
                    dadosResposta += `═════════════════\n`

                    if(args.length == 1){
                        var menuResposta = await menu.menuPrincipal()
                        await socket.sendText(c, chatId, dadosResposta+menuResposta)
                    } else {
                        var usuarioOpcao = args[1]
                        var menuResposta = await menu.menuPrincipal()
                        switch(usuarioOpcao){
                            case "0":
                                menuResposta = await menu.menuInfoSuporte()
                                break
                            case "1":
                                menuResposta = await menu.menuFigurinhas()
                                break
                            case "2":
                                menuResposta = await menu.menuUtilidades()
                                break
                            case "3":
                                menuResposta = await menu.menuDownload()
                                break
                            case "4":
                                if(isGroupMsg) menuResposta = await menu.menuGrupo(isGroupAdmins)
                                else return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                                break
                            case "5":
                                menuResposta = await menu.menuDiversao(isGroupMsg)
                                break
                            case "6":
                                menuResposta = await menu.menuCreditos()
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