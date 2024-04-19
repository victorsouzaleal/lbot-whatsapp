//REQUERINDO MÓDULOS
import fs from 'fs-extra'
import { obterMensagensTexto } from '../lib/msgs.js' 
import {criarTexto, erroComandoMsg, obterNomeAleatorio, consoleErro} from '../lib/util.js'
import path from 'node:path'
import * as api from '../lib/api.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import { MessageTypes } from '../lib-baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import {converterMp4ParaMp3} from '../lib/conversao.js'
import {botInfo} from '../db-modulos/bot.js'


export const utilidades = async(c,messageTranslated) => {
    try{
        const { type, id, chatId, caption, mimetype, quotedMsg, quotedMsgObj, quotedMsgObjInfo, body} = messageTranslated
        const {prefixo, nome_bot, nome_adm} = botInfo()
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        var cmdSemPrefixo = command.replace(prefixo, "")
        
        const msgs_texto = obterMensagensTexto()

        switch(cmdSemPrefixo){      
            case "tabela":
                try{
                    var tabela = await api.obterTabelaNick()
                    await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.tabela.resposta, tabela), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "letra":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioTexto = body.slice(7).trim(), dadosMusica = await api.obterLetraMusica(usuarioTexto)
                    if(!dadosMusica.success) return await socket.reply(c, chatId, dadosMusica.error_message, id)
                    await socket.replyFile(c, MessageTypes.image, chatId, dadosMusica.imagem, criarTexto(msgs_texto.utilidades.letra.resposta, dadosMusica.titulo, dadosMusica.artista, dadosMusica.letra), id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "ouvir":
                try{
                    if(!quotedMsg || quotedMsgObjInfo?.type != MessageTypes.audio) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    if(quotedMsgObjInfo.seconds > 90) return await socket.reply(c, chatId, msgs_texto.utilidades.ouvir.erro_limite, id)
                    var bufferAudio = await downloadMediaMessage(quotedMsgObj, "buffer"), caminhoAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(caminhoAudio, bufferAudio)
                    var dadosTranscricao = await api.obterTranscricaoAudio(caminhoAudio)
                    if(!dadosTranscricao.success) return await socket.reply(c, chatId, msgs_texto.utilidades.ouvir.erro_transcricao, id)
                    var textoTranscricao = dadosTranscricao.result.results.channels[0].alternatives[0].transcript
                    await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.ouvir.sucesso, textoTranscricao), quotedMsgObj)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                
            case "ddd":
                try{
                    var DDD = null
                    if(quotedMsg){
                        let DDI = quotedMsgObjInfo.sender.slice(0,2)
                        if(DDI != "55") return await socket.reply(c, chatId, msgs_texto.utilidades.ddd.somente_br ,id)
                        DDD = quotedMsgObjInfo.sender.slice(2,4)
                    } else if(args.length > 1 && args[1].length == 2){
                        if(args[1].length != 2) return await socket.reply(c, chatId, msgs_texto.utilidades.ddd.nao_encontrado ,id)
                        DDD = args[1]
                    } else {
                        return socket.reply(c, chatId, erroComandoMsg(command), id)
                    }
                    var resposta = await api.obterInfoDDD(DDD)
                    if(resposta == undefined) return await socket.reply(c, chatId, msgs_texto.utilidades.ddd.nao_encontrado, id)
                    await socket.reply(c, chatId, resposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "audio":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = body.slice(7).trim()
                    if(!efeitosSuportados.includes(tipoEfeito)) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    if(quotedMsg && (quotedMsgObjInfo.type == MessageTypes.audio) ){
                        var bufferQuotedMessage = await downloadMediaMessage(quotedMsgObj, "buffer")
                        var audioOriginal = path.resolve(`./temp/${obterNomeAleatorio(".mp3")}`)
                        fs.writeFileSync(audioOriginal, bufferQuotedMessage)
                        var audioEditado = await api.obterAudioModificado(audioOriginal, tipoEfeito)
                        await socket.replyFile(c, MessageTypes.audio, chatId, audioEditado, '', id, "audio/mpeg").then(()=>{
                            fs.unlinkSync(audioEditado)
                            fs.unlinkSync(audioOriginal)
                        })
                    } else {
                        await socket.reply(c, chatId, erroComandoMsg(command), id)
                    }
                } catch(err){
                    if(fs.existsSync(audioOriginal)) fs.unlinkSync(audioOriginal)
                    if(fs.existsSync(audioEditado)) fs.unlinkSync(audioEditado)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "qualmusica":
                try{
                    var typeMessage = quotedMsg ? quotedMsgObjInfo.type : type
                    if(typeMessage != MessageTypes.video && typeMessage != MessageTypes.audio) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var messageData = quotedMsg ? quotedMsgObj : id             
                    var caminhoAudio, caminhoVideo
                    var bufferMessageData = await downloadMediaMessage(messageData, "buffer")
                    await socket.reply(c, chatId, msgs_texto.utilidades.qualmusica.espera, id)
                    if(typeMessage == MessageTypes.video){
                        var caminhoVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                        fs.writeFileSync(caminhoVideo, bufferMessageData)
                        var caminhoAudio = await converterMp4ParaMp3(caminhoVideo)
                        fs.unlinkSync(caminhoVideo)
                    }
                    if(typeMessage == MessageTypes.audio){
                        var caminhoAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
                        fs.writeFileSync(caminhoAudio, bufferMessageData)
                    }
                    var resp = await api.obterReconhecimentoMusica(caminhoAudio)
                    fs.unlinkSync(caminhoAudio)
                    if(!resp.success) return await socket.reply(c, chatId, resp.error_message, id)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resp.titulo, resp.produtora, resp.duracao, resp.lancamento, resp.album, resp.artistas), id)
                } catch(err){
                    if(fs.existsSync(caminhoVideo)) fs.unlinkSync(caminhoVideo)
                    if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case "clima":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(7).trim(), clima = await api.obterClima(usuarioTexto)
                    var respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, clima.texto), respostaClimaFoto = clima.foto_clima
                    await socket.reply(c, chatId, respostaClimaTexto, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "moeda":
                try{
                    if(args.length !== 3) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioMoedaInserida = args[1], usuarioValorInserido = args[2], conversaoMoeda = await api.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido)
                    if(!conversaoMoeda.success) return await socket.reply(c, chatId, conversaoMoeda.error_message, id)
                    var itens = ''
                    for(var dado of  conversaoMoeda.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, dado.conversao, dado.valor_convertido_formatado, dado.tipo, dado.atualizacao)
                    var respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, conversaoMoeda.valor_inserido, conversaoMoeda.moeda_inserida, itens)
                    await socket.reply(c, chatId, respostaFinal ,id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "pesquisa":
                try{
                    if (args.length === 1) return socket.reply(c, chatId, erroComandoMsg(command) , id)
                    var usuarioTexto = body.slice(10).trim(), pesquisaResultados = await api.obterPesquisaWeb(usuarioTexto)
                    if(!pesquisaResultados.success) return await socket.reply(c, chatId, pesquisaResultados.error_message, id)
                    var pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                    for(let resultado of pesquisaResultados.resultados){
                        pesquisaResposta += "═════════════════\n"
                        pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                    }
                    await socket.reply(c, chatId, pesquisaResposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'rastreio':
                try{
                    if (args.length === 1) return socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioCodigoRastreio = body.slice(10).trim(), rastreioDados = await api.obterRastreioCorreios(usuarioCodigoRastreio)
                    if(!rastreioDados.success) return socket.reply(c, chatId, rastreioDados.error_message, id)
                    var rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                    for(let dado of rastreioDados.rastreio){
                        var local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                        rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                        rastreioResposta += "-----------------------------------------\n"
                    }
                    await socket.reply(c, chatId, rastreioResposta, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "anime":
                try{
                    var dadosMensagem = {
                        tipo: (quotedMsg)? quotedMsgObjInfo.type : type,
                        mimetype: (quotedMsg)? quotedMsgObjInfo.mimetype : mimetype,
                        mensagem: (quotedMsg)? quotedMsgObj : id
                    }
                    if(dadosMensagem.tipo == MessageTypes.image){
                        await socket.reply(c, chatId,msgs_texto.utilidades.anime.espera, id)
                        var bufferImagem = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                        var caminhoImagem = path.resolve(`temp/${obterNomeAleatorio(".jpg")}`)
                        fs.writeFileSync(caminhoImagem, bufferImagem)
                        var animeInfo = await api.obterAnimeInfo(caminhoImagem)
                        fs.unlinkSync(caminhoImagem)
                        if(!animeInfo.success) return await socket.reply(c, chatId, animeInfo.error_message, id)
                        if(animeInfo.similaridade < 87) return await socket.reply(c, chatId,msgs_texto.utilidades.anime.similaridade,id)
                        animeInfo.episodio = animeInfo.episodio || "---"
                        var respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, animeInfo.titulo, animeInfo.episodio, animeInfo.tempoInicial, animeInfo.tempoFinal, animeInfo.similaridade, animeInfo.link_previa)
                        await socket.replyFile(c, MessageTypes.video, chatId, animeInfo.link_previa, respostaAnimeInfo, id, "video/mp4")
                    } else {
                        await socket.reply(c, chatId,erroComandoMsg(command), id)
                    }
                } catch(err){
                    if(fs.existsSync(caminhoImagem)) fs.unlinkSync(caminhoImagem)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "traduz":
                try{
                    var usuarioTexto = "", idiomaTraducao = 'pt'
                    if(quotedMsg  && (quotedMsgObjInfo.type == MessageTypes.text || quotedMsgObjInfo.type == MessageTypes.extendedText)){
                        if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command) ,id)
                        idiomaTraducao = args[1]
                        usuarioTexto = quotedMsgObjInfo.body || quotedMsgObjInfo.caption
                    } else if(!quotedMsg && (type == MessageTypes.text || type == MessageTypes.extendedText)){
                        if(args.length < 3) return await socket.reply(c, chatId, erroComandoMsg(command) ,id)
                        idiomaTraducao = args[1]
                        usuarioTexto = args.slice(2).join(" ")
                    } else {
                        return await socket.reply(c, chatId, erroComandoMsg(command) ,id)
                    }
                    var respostaTraducao = await api.obterTraducao(usuarioTexto, idiomaTraducao)
                    if(!respostaTraducao.success) return await socket.reply(c, chatId, respostaTraducao.error_message, id)
                    await socket.reply(c, chatId, respostaTraducao.traducao, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
            
            case 'voz':
                try{
                    var usuarioTexto = ''
                    if (args.length === 1) {
                        return socket.reply(c, chatId, erroComandoMsg(command) ,id)
                    } else if(quotedMsg  && (quotedMsgObjInfo.type == MessageTypes.extendedText || quotedMsgObjInfo.type == MessageTypes.text)){
                        usuarioTexto = (args.length == 2) ? quotedMsgObjInfo.body || quotedMsgObjInfo.caption : body.slice(8).trim()
                    } else {
                        usuarioTexto = body.slice(8).trim()
                    }
                    if (!usuarioTexto) return socket.reply(c, chatId, msgs_texto.utilidades.voz.texto_vazio , id)
                    if (usuarioTexto.length > 200) return await socket.reply(c, chatId, msgs_texto.utilidades.voz.texto_longo, id)
                    var idioma = body.slice(5, 7).toLowerCase()
                    var respostaAudio = await api.textoParaVoz(idioma, usuarioTexto)
                    if(!respostaAudio.success) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    await socket.replyFile(c, MessageTypes.audio, chatId, respostaAudio.audio, '', id, 'audio/mpeg').then(()=>{
                        fs.unlinkSync(respostaAudio.audio)
                    })
                } catch(err){
                    if(fs.existsSync(respostaAudio.audio)) fs.unlinkSync(respostaAudio.audio)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'noticias':
                try{
                    var listaNoticias = await api.obterNoticias()
                    var respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                    for(let noticia of listaNoticias){
                        respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.titulo, noticia.descricao || "Sem descrição", noticia.url)
                    }
                    await socket.reply(c, chatId, respostaNoticias, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break;

            case 'calc':
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command) ,id)
                    var usuarioExpressaoMatematica = body.slice(6).trim()
                    var resultadoCalculo = await api.obterCalculo(usuarioExpressaoMatematica)
                    if(!resultadoCalculo.success) return await socket.reply(c, chatId, resultadoCalculo.error_message, id)
                    var respostaCalc = criarTexto(msgs_texto.utilidades.calc.resposta, resultadoCalculo.resultado)
                    await socket.reply(c, chatId, respostaCalc, id)
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        }
    } catch(err){
        consoleErro(err, "UTILIDADES")
    }
    

}