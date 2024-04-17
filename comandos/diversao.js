//REQUERINDO MODULOS
import { obterMensagensTexto } from '../lib/msgs.js' 
import {criarTexto, primeiraLetraMaiuscula, erroComandoMsg, consoleErro} from '../lib/util.js'
import path from 'node:path'
import * as api from '../lib/api.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import * as socketdb from '../lib-baileys/socket-db-funcoes.js'
import { MessageTypes } from '../lib-baileys/mensagem.js'
import {obterBotVariaveis} from '../db-modulos/dados-bot-variaveis.js'


export const diversao = async(c,messageTranslated) => {
    try {
        const {id, chatId, sender, isGroupMsg, caption, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList, body} = messageTranslated
        const {prefixo, nome_bot, nome_adm} = obterBotVariaveis()
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        var cmdSemPrefixo = command.replace(prefixo, "")

        const ownerNumber = process.env.NUMERO_DONO?.trim() // Número do administrador do bot
        const botNumber = await socketdb.getHostNumberFromBotJSON()
        const groupId = isGroupMsg ? chatId : null

        //OBTENDO DADOS DO GRUPO
        const grupoInfo = isGroupMsg ? await socketdb.getGroupInfoFromDb(groupId) : null
        const groupAdmins = isGroupMsg ? grupoInfo.admins : null
        const groupOwner = isGroupMsg ? grupoInfo.dono : null
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false

        const msgs_texto = obterMensagensTexto()
        
        switch(cmdSemPrefixo){
            case 'detector' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg) return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    var imgsDetector = ['verdade','vaipra','mentiroso','meengana','kao','incerteza','estresse','conversapraboi']
                    var indexAleatorio = Math.floor(Math.random() * imgsDetector.length)
                    await socket.replyFile(c,MessageTypes.image, chatId, './media/detector/calibrando.png', msgs_texto.diversao.detector.espera, id)
                    await socket.replyFile(c,MessageTypes.image, chatId, `./media/detector/${imgsDetector[indexAleatorio]}.png`, '', quotedMsgObj)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'viadometro' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.viadometro.apenas_um, id)
                    var respostas = msgs_texto.diversao.viadometro.respostas
                    var indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0].replace("@s.whatsapp.net", "")
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender.replace("@s.whatsapp.net", "")
                    if(ownerNumber == alvo) indexAleatorio = 0
                    var respostaTexto = criarTexto(msgs_texto.diversao.viadometro.resposta,respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'bafometro' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    if (mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.bafometro.apenas_um, id)
                    var respostas = msgs_texto.diversao.bafometro.respostas
                    var indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0].replace("@s.whatsapp.net", '')
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender.replace("@s.whatsapp.net", '')
                    if(ownerNumber == alvo) indexAleatorio = 0
                    var respostaTexto = criarTexto(msgs_texto.diversao.bafometro.resposta, respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'chance' :
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var num = Math.floor(Math.random() * 100), temaChance = body.slice(8).trim()
                    if(quotedMsg){  //SE O COMANDO TIVER SIDO USADO EM RESPOSTA
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.chance.resposta, num, temaChance), quotedMsgObj)
                    } else {
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.chance.resposta, num, temaChance), id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "caracoroa":
                try{
                    var ladosMoeda = ["cara","coroa"], indexAleatorio = Math.floor(Math.random() * ladosMoeda.length)
                    await socket.reply(c, chatId, msgs_texto.diversao.caracoroa.espera, id)
                    var respostaTexto = criarTexto(msgs_texto.diversao.caracoroa.resposta, primeiraLetraMaiuscula(ladosMoeda[indexAleatorio]))
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, path.resolve(`media/caracoroa/${ladosMoeda[indexAleatorio]}.png`), respostaTexto, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "ppt":
                try{
                    var ppt = ["pedra","papel","tesoura"], indexAleatorio = Math.floor(Math.random() * ppt.length)
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    if(!ppt.includes(args[1].toLowerCase())) return await socket.reply(c, chatId, msgs_texto.diversao.ppt.opcao_erro, id)
                    var escolhaBot = ppt[indexAleatorio], iconeEscolhaBot = null, escolhaUsuario = args[1].toLowerCase(), iconeEscolhaUsuario = null, vitoriaUsuario = null
                    if(escolhaBot == "pedra"){
                        iconeEscolhaBot = "✊"
                        if(escolhaUsuario == "pedra") vitoriaUsuario = null, iconeEscolhaUsuario = "✊"
                        if(escolhaUsuario == "tesoura") vitoriaUsuario = false, iconeEscolhaUsuario = "✌️"
                        if(escolhaUsuario == "papel") vitoriaUsuario = true, iconeEscolhaUsuario = "✋"
                    } else if(escolhaBot == "papel"){
                        iconeEscolhaBot = "✋"
                        if(escolhaUsuario == "pedra") vitoriaUsuario = false, iconeEscolhaUsuario = "✊"
                        if(escolhaUsuario == "tesoura") vitoriaUsuario = true, iconeEscolhaUsuario = "✌️"
                        if(escolhaUsuario == "papel") vitoriaUsuario = null, iconeEscolhaUsuario = "✋"
                    } else  {
                        iconeEscolhaBot = "✌️"
                        if(escolhaUsuario == "pedra") vitoriaUsuario = true, iconeEscolhaUsuario = "✊"
                        if(escolhaUsuario == "tesoura") vitoriaUsuario = null, iconeEscolhaUsuario = "✌️"
                        if(escolhaUsuario == "papel") vitoriaUsuario = false, iconeEscolhaUsuario = "✋"
                    }
                    var textoResultado = ''
                    if(vitoriaUsuario == true) textoResultado = msgs_texto.diversao.ppt.resposta.vitoria
                    else if(vitoriaUsuario == false) textoResultado = msgs_texto.diversao.ppt.resposta.derrota
                    else textoResultado = msgs_texto.diversao.ppt.resposta.empate
                    await socket.reply(c, chatId, criarTexto(textoResultado, iconeEscolhaUsuario, iconeEscolhaBot), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "massacote":
            case 'mascote':
                try{
                    var mascoteFotoURL = "https://i.imgur.com/mVwa7q4.png"
                    await socket.replyFileFromUrl(c, MessageTypes.image,chatId, mascoteFotoURL, 'Whatsapp Jr.', id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break 

            case 'malacos':
                try{
                    const malacosFotoURL = "https://i.imgur.com/7bcn2TK.jpg"
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, malacosFotoURL,'Somos o problema', id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'roletarussa':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    var idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(groupOwner),1)
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(botNumber),1)
                    if(idParticipantesAtuais.length == 0) return await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.sem_membros, id)
                    var indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    var participanteEscolhido = idParticipantesAtuais[indexAleatorio]
                    var respostaTexto = criarTexto(msgs_texto.diversao.roletarussa.resposta, participanteEscolhido.replace("@s.whatsapp.net", ''))
                    await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.espera , id)
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, [participanteEscolhido])
                    await socket.removeParticipant(c, chatId, participanteEscolhido)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'casal':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    var idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    if(idParticipantesAtuais.length < 2) return await socket.reply(c, chatId, msgs_texto.diversao.casal.minimo, id)
                    var indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    var pessoaEscolhida1 = idParticipantesAtuais[indexAleatorio]
                    idParticipantesAtuais.splice(indexAleatorio,1)
                    indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    var pessoaEscolhida2 = idParticipantesAtuais[indexAleatorio]
                    var respostaTexto = criarTexto(msgs_texto.diversao.casal.resposta, pessoaEscolhida1.replace("@s.whatsapp.net", ''), pessoaEscolhida2.replace("@s.whatsapp.net", ''))
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, [pessoaEscolhida1, pessoaEscolhida2])
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'gadometro':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.gadometro.apenas_um , id)
                    var respostas = msgs_texto.diversao.gadometro.respostas 
                    var indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if (mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0].replace("@s.whatsapp.net", '')
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender.replace("@s.whatsapp.net", '')
                    if(ownerNumber == alvo) indexAleatorio = 0
                    var respostaTexto = criarTexto(msgs_texto.diversao.gadometro.resposta, respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)       
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'top5':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var temaRanking = body.slice(6).trim(), idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    if(idParticipantesAtuais.length < 5) return await socket.reply(c, chatId,msgs_texto.diversao.top5.erro_membros, id)
                    var respostaTexto = criarTexto(msgs_texto.diversao.top5.resposta_titulo, temaRanking), mencionarMembros = []
                    for (let i = 0 ; i < 5 ; i++){
                        var medalha = ""
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
                        var indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                        var membroSelecionado = idParticipantesAtuais[indexAleatorio]
                        respostaTexto += criarTexto(msgs_texto.diversao.top5.resposta_itens, medalha, i+1, membroSelecionado.replace("@s.whatsapp.net", ''))
                        mencionarMembros.push(membroSelecionado)
                        idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(membroSelecionado),1)                
                    }
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, mencionarMembros)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'par':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(mentionedJidList.length !== 2) return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    var respostas = msgs_texto.diversao.par.respostas
                    var indexAleatorio = Math.floor(Math.random() * respostas.length)
                    var respostaTexto = criarTexto(msgs_texto.diversao.par.resposta, mentionedJidList[0].replace("@s.whatsapp.net", ''), mentionedJidList[1].replace("@s.whatsapp.net", ''), respostas[indexAleatorio])
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, mentionedJidList)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "fch":
                try{
                    var respostaFrase = await api.obterCartasContraHu()
                    await socket.reply(c, chatId, respostaFrase, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break    
        }
    } catch(err){
        consoleErro(err, "DIVERSÃO")
    }
    
}