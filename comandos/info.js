//REQUERINDO MÓDULOS
const fs = require('fs-extra')
const menu = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const { version } = require('../package.json')
const {criarTexto, erroComandoMsg, removerNegritoComando, timestampParaData} = require("../lib/util")
const path = require('path')
const db = require('../lib/database')
const {botInfo} = require(path.resolve("lib/bot.js"))
const client = require("../lib-translate/baileys")
const {MessageTypes}  = require("../lib-translate/msgtypes")

module.exports = info = async(c, abrirMenu, messageTranslated) => {
    try{
        const {id, chatId, sender, chat, isGroupMsg, caption, body, username} = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const botNumber = await client.getHostNumberFromBotJSON()
        const groupId = isGroupMsg ? chatId : null
        const groupAdmins = isGroupMsg ? await client.getGroupAdminsFromDb(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender) : false
        const ownerNumber = process.env.NUMERO_DONO.trim()
        if(abrirMenu) command = "!menu"

        switch(command){
            case "!info":
                try{
                    const botFotoURL = await client.getProfilePicFromServer(c,botNumber)
                    var infoBot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
                    var botInicializacaoData = timestampParaData(infoBot.iniciado)
                    var resposta = criarTexto(msgs_texto.info.info.resposta, process.env.NOME_ADMINISTRADOR.trim(), process.env.NOME_BOT.trim(), botInicializacaoData, infoBot.cmds_executados, ownerNumber, version)
                    if(botFotoURL != undefined){
                        await client.replyFileFromUrl(c, MessageTypes.image, chatId, botFotoURL, resposta, id)
                    } else {
                        await client.reply(c, chatId, resposta, id)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break
            
            case "!reportar":
                try{
                    if(args.length == 1) return client.reply(c, chatId, erroComandoMsg(command) ,id)
                    var usuarioMensagem = body.slice(10).trim(), resposta = criarTexto(msgs_texto.info.reportar.resposta, username, sender.replace("@s.whatsapp.net",""), usuarioMensagem)
                    await client.sendText(c,ownerNumber+"@s.whatsapp.net", resposta)
                    await client.reply(c,chatId,msgs_texto.info.reportar.sucesso,id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break
            
            case '!meusdados':
                try{
                    var dadosUsuario = await db.obterUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    var nomeUsuario = username , resposta = criarTexto(msgs_texto.info.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                    if(botInfo().limite_diario.status) resposta += criarTexto(msgs_texto.info.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                    if(isGroupMsg){
                        var dadosGrupo = await db.obterGrupo(groupId)
                        if(dadosGrupo.contador.status){
                            var usuarioAtividade = await db.obterAtividade(groupId,sender)
                            resposta += criarTexto(msgs_texto.info.meusdados.resposta_grupo, usuarioAtividade.msg)
                        }   
                    }
                    await client.reply(c, chatId, resposta, id)
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case '!menu':
            case '!ajuda':
                try{
                    var dadosUsuario = await db.obterUsuario(sender), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite" 
                    tipoUsuario = msgs_texto.tipos[tipoUsuario]
                    var dadosResposta = '', nomeUsuario = username
                    if(botInfo().limite_diario.status){
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario)
                    } else {
                        dadosResposta = criarTexto(msgs_texto.info.ajuda.resposta_comum, nomeUsuario, tipoUsuario)
                    }
                    dadosResposta += `═════════════════\n`

                    if(args.length == 1){
                        var menuResposta = menu.menuPrincipal()
                        await client.sendText(c, chatId, dadosResposta+menuResposta)
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
                                else return await client.reply(c, chatId, msgs_texto.permissao.grupo, id)
                                break
                            case "5":
                                menuResposta = menu.menuDiversao(isGroupMsg)
                                break
                            case "6":
                                menuResposta = menu.menuCreditos()
                                break
                        }
                        await client.sendText(c, chatId, dadosResposta+menuResposta)
                    }
                } catch(err){
                    await client.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        }
    } catch(err){
        consoleErro(err, "INFO")
    }
    

}