//REQUERINDO MODULOS
import {criarTexto, primeiraLetraMaiuscula, erroComandoMsg, consoleErro, timestampParaData} from '../lib/util.js'
import path from 'node:path'
import * as api from '../lib/api.js'
import * as socket from '../baileys/socket-funcoes.js'
import { MessageTypes } from '../baileys/mensagem.js'


export const diversao = async(c, mensagemInfoCompleta) => {
    const {msgs_texto, ownerNumber} = mensagemInfoCompleta
    const {botNumber, botInfoJSON} = mensagemInfoCompleta.bot
    const {groupId, groupOwner, isGroupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
    const {command, sender, textoRecebido, args, id, chatId, isGroupMsg, quotedMsg, quotedMsgObj, quotedMsgObjInfo, mentionedJidList} = mensagemInfoCompleta.mensagem
    const {prefixo} = botInfoJSON
    let cmdSemPrefixo = command.replace(prefixo, "")

    try {
        switch(cmdSemPrefixo){
            case 'detector' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let imgsDetector = ['verdade','vaipra','mentiroso','meengana','kao','incerteza','estresse','conversapraboi']
                    let indexAleatorio = Math.floor(Math.random() * imgsDetector.length)
                    await socket.replyFile(c,MessageTypes.image, chatId, './midia/detector/calibrando.png', msgs_texto.diversao.detector.espera, id)
                    await socket.replyFile(c,MessageTypes.image, chatId, `./midia/detector/${imgsDetector[indexAleatorio]}.png`, '', quotedMsgObj)
                } catch(err){
                    throw err
                }
                break

            case 'simi':
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let perguntaSimi = textoRecebido.slice(6).trim()
                    await api.simiResponde(perguntaSimi).then(async ({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.simi.resposta, timestampParaData(Date.now()), resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'viadometro' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.viadometro.apenas_um, id)
                    let respostas = msgs_texto.diversao.viadometro.respostas
                    let indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender
                    if(ownerNumber == alvo) indexAleatorio = 0
                    let respostaTexto = criarTexto(msgs_texto.diversao.viadometro.resposta,respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)
                } catch(err){
                    throw err
                }
                break
            
            case 'bafometro' :
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if (mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.bafometro.apenas_um, id)
                    let respostas = msgs_texto.diversao.bafometro.respostas
                    let indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if(mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender
                    if(ownerNumber == alvo) indexAleatorio = 0
                    let respostaTexto = criarTexto(msgs_texto.diversao.bafometro.resposta, respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)
                } catch(err){
                    throw err
                }
                break

            case 'chance' :
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let num = Math.floor(Math.random() * 100), temaChance = textoRecebido.slice(8).trim()
                    if(quotedMsg){ 
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.chance.resposta, num, temaChance), quotedMsgObj)
                    } else {
                        await socket.reply(c, chatId, criarTexto(msgs_texto.diversao.chance.resposta, num, temaChance), id)
                    }
                } catch(err){
                    throw err
                }
                break

            case "caracoroa":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let ladosMoeda = ["cara","coroa"]
                    let textoUsuario = textoRecebido.slice(11).toLowerCase().trim()
                    if(!ladosMoeda.includes(textoUsuario)) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    await socket.reply(c, chatId, msgs_texto.diversao.caracoroa.espera, id)
                    let indexAleatorio = Math.floor(Math.random() * ladosMoeda.length)
                    let vitoriaUsuario = ladosMoeda[indexAleatorio] == textoUsuario
                    let textoResultado
                    if(vitoriaUsuario){
                        textoResultado = criarTexto(msgs_texto.diversao.caracoroa.resposta.vitoria, primeiraLetraMaiuscula(ladosMoeda[indexAleatorio]))
                    } else {
                        textoResultado = criarTexto(msgs_texto.diversao.caracoroa.resposta.derrota, primeiraLetraMaiuscula(ladosMoeda[indexAleatorio]))
                    }
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, path.resolve(`midia/caracoroa/${ladosMoeda[indexAleatorio]}.png`), textoResultado, id)
                } catch(err){
                    throw err
                }
                break

            case "ppt":
                try{
                    let ppt = ["pedra","papel","tesoura"], indexAleatorio = Math.floor(Math.random() * ppt.length)
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if(!ppt.includes(args[1].toLowerCase())) return await socket.reply(c, chatId, msgs_texto.diversao.ppt.opcao_erro, id)
                    let escolhaBot = ppt[indexAleatorio], iconeEscolhaBot = null, escolhaUsuario = args[1].toLowerCase(), iconeEscolhaUsuario = null, vitoriaUsuario = null
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
                    let textoResultado = ''
                    if(vitoriaUsuario == true) {
                        textoResultado = criarTexto(msgs_texto.diversao.ppt.resposta.vitoria, iconeEscolhaUsuario, iconeEscolhaBot)
                    }else if(vitoriaUsuario == false){
                        textoResultado = criarTexto(msgs_texto.diversao.ppt.resposta.derrota, iconeEscolhaUsuario, iconeEscolhaBot)
                    } else {
                        textoResultado = criarTexto(msgs_texto.diversao.ppt.resposta.empate, iconeEscolhaUsuario, iconeEscolhaBot)
                    }
                    await socket.reply(c, chatId, textoResultado, id)
                } catch(err){
                    throw err
                }
                break

            case "massacote":
            case 'mascote':
                try{
                    const mascoteFotoURL = "https://i.imgur.com/mVwa7q4.png"
                    await socket.replyFileFromUrl(c, MessageTypes.image,chatId, mascoteFotoURL, 'Whatsapp Jr.', id)
                } catch(err){
                    throw err
                }
                break 

            case 'malacos':
                try{
                    const malacosFotoURL = "https://i.imgur.com/7bcn2TK.jpg"
                    await socket.replyFileFromUrl(c, MessageTypes.image, chatId, malacosFotoURL,'Somos o problema', id)
                } catch(err){
                    throw err
                }
                break

            case 'roletarussa':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if (!isGroupAdmins) return await socket.reply(c, chatId, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return await socket.reply(c, chatId,msgs_texto.permissao.bot_admin, id)
                    let idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(groupOwner),1)
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(botNumber),1)
                    if(idParticipantesAtuais.length == 0) return await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.sem_membros, id)
                    let indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    let participanteEscolhido = idParticipantesAtuais[indexAleatorio]
                    let respostaTexto = criarTexto(msgs_texto.diversao.roletarussa.resposta, participanteEscolhido.replace("@s.whatsapp.net", ''))
                    await socket.reply(c, chatId, msgs_texto.diversao.roletarussa.espera , id)
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, [participanteEscolhido])
                    await socket.removeParticipant(c, chatId, participanteEscolhido)
                } catch(err){
                    throw err
                }
                break
            
            case 'casal':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    let idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    if(idParticipantesAtuais.length < 2) return await socket.reply(c, chatId, msgs_texto.diversao.casal.minimo, id)
                    let indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    let pessoaEscolhida1 = idParticipantesAtuais[indexAleatorio]
                    idParticipantesAtuais.splice(indexAleatorio,1)
                    indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    let pessoaEscolhida2 = idParticipantesAtuais[indexAleatorio]
                    let respostaTexto = criarTexto(msgs_texto.diversao.casal.resposta, pessoaEscolhida1.replace("@s.whatsapp.net", ''), pessoaEscolhida2.replace("@s.whatsapp.net", ''))
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, [pessoaEscolhida1, pessoaEscolhida2])
                } catch(err){
                    throw err
                }
                break

            case 'gadometro':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(!quotedMsg && mentionedJidList.length == 0) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    if(mentionedJidList.length > 1) return await socket.reply(c, chatId, msgs_texto.diversao.gadometro.apenas_um , id)
                    let respostas = msgs_texto.diversao.gadometro.respostas 
                    let indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                    if (mentionedJidList.length == 1) idResposta = id, alvo = mentionedJidList[0]
                    else idResposta = quotedMsgObj, alvo = quotedMsgObjInfo.sender
                    if(ownerNumber == alvo) indexAleatorio = 0
                    let respostaTexto = criarTexto(msgs_texto.diversao.gadometro.resposta, respostas[indexAleatorio])
                    await socket.reply(c, chatId, respostaTexto, idResposta)       
                } catch(err){
                    throw err
                }
                break

            case 'top5':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let temaRanking = textoRecebido.slice(6).trim(), idParticipantesAtuais = await socket.getGroupMembersId(c, groupId)
                    if(idParticipantesAtuais.length < 5) return await socket.reply(c, chatId,msgs_texto.diversao.top5.erro_membros, id)
                    let respostaTexto = criarTexto(msgs_texto.diversao.top5.resposta_titulo, temaRanking), mencionarMembros = []
                    for (let i = 0 ; i < 5 ; i++){
                        let medalha = ""
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
                        let indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                        let membroSelecionado = idParticipantesAtuais[indexAleatorio]
                        respostaTexto += criarTexto(msgs_texto.diversao.top5.resposta_itens, medalha, i+1, membroSelecionado.replace("@s.whatsapp.net", ''))
                        mencionarMembros.push(membroSelecionado)
                        idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(membroSelecionado),1)                
                    }
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, mencionarMembros)
                } catch(err){
                    throw err
                }
                break

            case 'par':
                try{
                    if (!isGroupMsg) return await socket.reply(c, chatId, msgs_texto.permissao.grupo, id)
                    if(mentionedJidList.length !== 2) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let respostas = msgs_texto.diversao.par.respostas
                    let indexAleatorio = Math.floor(Math.random() * respostas.length)
                    let respostaTexto = criarTexto(msgs_texto.diversao.par.resposta, mentionedJidList[0].replace("@s.whatsapp.net", ''), mentionedJidList[1].replace("@s.whatsapp.net", ''), respostas[indexAleatorio])
                    await socket.sendTextWithMentions(c, chatId, respostaTexto, mentionedJidList)
                } catch(err){
                    throw err
                }
                break

            case "fch":
                try{
                    await api.obterCartasContraHu().then(async({resultado})=>{
                        await socket.reply(c, chatId, resultado, id)
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break    
        }
    } catch(err){
        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "DIVERSÃO")
    }
    
}