//REQUERINDO MÓDULOS
import fs from 'fs-extra'
import {criarTexto, erroComandoMsg, obterNomeAleatorio, consoleErro, converterMp4ParaMp3} from '../lib/util.js'
import path from 'node:path'
import * as api from '../lib/api.js'
import * as socket from '../baileys/socket-funcoes.js'
import { MessageTypes } from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'


export const utilidades = async(c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {textoRecebido, sender, command, isMedia, args, type, id, chatId, mimetype, quotedMsg, quotedMsgObj, quotedMsgObjInfo} = mensagemInfoCompleta.mensagem
        const {prefixo} = botInfoJSON
        let cmdSemPrefixo = command.replace(prefixo, "")
        
        switch(cmdSemPrefixo){  
            case "filmes":
                try{
                    await api.top20TendenciasDia("filmes").then(async({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.filmes.resposta, resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "series":
                try{
                    await api.top20TendenciasDia("series").then(async({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.series.resposta, resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "gpt":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await api.respostaHercaiTexto(usuarioTexto, sender).then(async ({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.gpt.resposta, resultado), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "criarimg":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(10).trim()
                    await socket.reply(c, chatId, msgs_texto.utilidades.criarimg.espera, id)
                    await api.respostaHercaiImagem(usuarioTexto).then(async ({resultado})=>{
                        await socket.replyFileFromUrl(c, MessageTypes.image, chatId, resultado, '', id)     
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "rbg":
                try{
                    if(isMedia|| quotedMsg){
                        var dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            message: (quotedMsg)? quotedMsgObj  : id,
                        }
                        if(dadosMensagem.tipo == MessageTypes.image){
                            await socket.reply(c, chatId, msgs_texto.utilidades.rbg.espera, id)
                            var bufferMessage = await downloadMediaMessage(dadosMensagem.message, "buffer")
                            await api.removerFundo(bufferMessage).then(async({resultado})=>{
                                await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, resultado, '', id)
                            }).catch(async(err)=>{
                                if(!err.erro) throw err
                                await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                            })
                        } else {
                            return await socket.reply(c, chatId, msgs_texto.utilidades.rbg.invalido , id)
                        }
                    } else {
                        return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "tabela":
                try{
                    await api.obterTabelaNick().then(async({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.tabela.resposta, resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "letra":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var usuarioTexto = textoRecebido.slice(7).trim()
                    await api.obterLetraMusica(usuarioTexto).then(async({resultado})=>{
                        await socket.replyFile(c, MessageTypes.image, chatId, resultado.imagem, criarTexto(msgs_texto.utilidades.letra.resposta, resultado.titulo, resultado.artista, resultado.letra), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "ouvir":
                try{
                    if(!quotedMsg || quotedMsgObjInfo?.type != MessageTypes.audio) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if(quotedMsgObjInfo.seconds > 90) return await socket.reply(c, chatId, msgs_texto.utilidades.ouvir.erro_limite, id)
                    let bufferAudio = await downloadMediaMessage(quotedMsgObj, "buffer"), caminhoAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(caminhoAudio, bufferAudio)
                    await api.obterTranscricaoAudio(caminhoAudio).then(async({resultado})=>{
                        let textoTranscricao = resultado.results.channels[0].alternatives[0].transcript
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.ouvir.sucesso, textoTranscricao), quotedMsgObj)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
                
            case "ddd":
                try{
                    let DDD = null
                    if(quotedMsg){
                        let DDI = quotedMsgObjInfo.sender.slice(0,2)
                        if(DDI != "55") return await socket.reply(c, chatId, msgs_texto.utilidades.ddd.somente_br ,id)
                        DDD = quotedMsgObjInfo.sender.slice(2,4)
                    } else if(args.length > 1){
                        if(args[1].length != 2) return await socket.reply(c, chatId, msgs_texto.utilidades.ddd.nao_encontrado ,id)
                        DDD = args[1]
                    } else return await socket.reply(c, chatId, await erroComandoMsg(command), id)

                    await api.obterInfoDDD(DDD).then(async({resultado})=>{
                        await socket.reply(c, chatId, resultado, id)
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "audio":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = textoRecebido.slice(7).trim()
                    if(!efeitosSuportados.includes(tipoEfeito)) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    if(!quotedMsg || quotedMsgObjInfo.type != MessageTypes.audio) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let bufferQuotedMessage = await downloadMediaMessage(quotedMsgObj, "buffer")
                    let audioOriginal = path.resolve(`./temp/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(audioOriginal, bufferQuotedMessage)
                    await api.obterAudioModificado(audioOriginal, tipoEfeito).then(async ({resultado})=>{
                        let audioEditado = resultado
                        await socket.replyFile(c, MessageTypes.audio, chatId, audioEditado, '', id, "audio/mpeg").then(()=>{
                            fs.unlinkSync(audioEditado)
                            fs.unlinkSync(audioOriginal)
                        })
                    }).catch(async (err)=>{
                        fs.unlinkSync(audioOriginal)
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "qualmusica":
                try{
                    var typeMessage = quotedMsg ? quotedMsgObjInfo.type : type
                    if(typeMessage != MessageTypes.video && typeMessage != MessageTypes.audio) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var messageData = quotedMsg ? quotedMsgObj : id             
                    var caminhoAudio, caminhoVideo
                    var bufferMessageData = await downloadMediaMessage(messageData, "buffer")
                    await socket.reply(c, chatId, msgs_texto.utilidades.qualmusica.espera, id)
                    if(typeMessage == MessageTypes.video){
                        caminhoVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                        fs.writeFileSync(caminhoVideo, bufferMessageData)
                        caminhoAudio = await converterMp4ParaMp3(caminhoVideo)
                        fs.unlinkSync(caminhoVideo)
                    }
                    if(typeMessage == MessageTypes.audio){
                        caminhoAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
                        fs.writeFileSync(caminhoAudio, bufferMessageData)
                    }
                    await api.obterReconhecimentoMusica(caminhoAudio).then(async({resultado})=>{
                        fs.unlinkSync(caminhoAudio)
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resultado.titulo, resultado.produtora, resultado.duracao, resultado.lancamento, resultado.album, resultado.artistas), id)
                    }).catch(async (err)=>{
                        if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "clima":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command),id)
                    var usuarioTexto = textoRecebido.slice(7).trim()
                    await api.obterClima(usuarioTexto).then(async({resultado})=>{
                        let respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, resultado.texto), respostaClimaFoto = resultado.foto_clima
                        await socket.reply(c, chatId, respostaClimaTexto, id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "moeda":
                try{
                    if(args.length !== 3) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var usuarioMoedaInserida = args[1], usuarioValorInserido = args[2]
                    await api.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido).then(async({resultado})=>{
                        let itens = ''
                        for(var dado of  resultado.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, dado.conversao, dado.valor_convertido_formatado, dado.tipo, dado.atualizacao)
                        let respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, resultado.valor_inserido, resultado.moeda_inserida, itens)
                        await socket.reply(c, chatId, respostaFinal ,id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "pesquisa":
                try{
                    if (args.length === 1) return socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    var usuarioTexto = textoRecebido.slice(10).trim() 
                    await api.obterPesquisaWeb(usuarioTexto).then(async({resultados})=>{
                        let pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                        for(let resultado of resultados){
                            pesquisaResposta += "═════════════════\n"
                            pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                        }
                        await socket.reply(c, chatId, pesquisaResposta, id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'rastreio':
                try{
                    if (args.length === 1) return socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuarioCodigoRastreio = textoRecebido.slice(10).trim()
                    if(usuarioCodigoRastreio.length != 13) return await socket.reply(c, chatId, msgs_texto.utilidades.rastreio.codigo_invalido, id)
                    await api.obterRastreioCorreios(usuarioCodigoRastreio).then(async({resultado})=>{   
                        let rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                        for(let dado of resultado){
                            var local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                            rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                            rastreioResposta += "-----------------------------------------\n"
                        }
                        await socket.reply(c, chatId, rastreioResposta, id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
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
                        let bufferImagem = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                        var caminhoImagem = path.resolve(`temp/${obterNomeAleatorio(".jpg")}`)
                        fs.writeFileSync(caminhoImagem, bufferImagem)
                        await api.obterAnimeInfo(caminhoImagem).then(async ({resultado})=>{
                            fs.unlinkSync(caminhoImagem)
                            if(resultado.similaridade < 87){
                                await socket.reply(c, chatId,msgs_texto.utilidades.anime.similaridade,id)
                            } else {
                                resultado.episodio = resultado.episodio || "---"
                                let respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, resultado.titulo, resultado.episodio, resultado.tempoInicial, resultado.tempoFinal, resultado.similaridade, resultado.link_previa)                          
                                await socket.replyFile(c, MessageTypes.video, chatId, resultado.link_previa, respostaAnimeInfo, id, "video/mp4")
                            }
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                        })
                    } else {
                        await socket.reply(c, chatId,await erroComandoMsg(command), id)
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
                        if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                        idiomaTraducao = args[1]
                        usuarioTexto = quotedMsgObjInfo.body || quotedMsgObjInfo.caption
                    } else if(!quotedMsg && (type == MessageTypes.text || type == MessageTypes.extendedText)){
                        if(args.length < 3) return await socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                        idiomaTraducao = args[1]
                        usuarioTexto = args.slice(2).join(" ")
                    } else {
                        return await socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                    }
                    let idiomasSuportados = ["pt", "es", "en", "ja", "it", "ru", "ko"]
                    if(!idiomasSuportados.includes(idiomaTraducao)) return await socket.reply(c, chatId, msgs_texto.utilidades.traduz.nao_suportado, id)
                    await api.obterTraducao(usuarioTexto, idiomaTraducao).then(async ({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.traduz.resposta, usuarioTexto, resultado), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
            
            case 'voz':
                try{
                    let usuarioTexto = ''
                    if (args.length === 1) {
                        return socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                    } else if(quotedMsg  && (quotedMsgObjInfo.type == MessageTypes.extendedText || quotedMsgObjInfo.type == MessageTypes.text)){
                        usuarioTexto = (args.length == 2) ? quotedMsgObjInfo.body || quotedMsgObjInfo.caption : textoRecebido.slice(8).trim()
                    } else {
                        usuarioTexto = textoRecebido.slice(8).trim()
                    }
                    if (!usuarioTexto) return socket.reply(c, chatId, msgs_texto.utilidades.voz.texto_vazio , id)
                    if (usuarioTexto.length > 200) return await socket.reply(c, chatId, msgs_texto.utilidades.voz.texto_longo, id)
                    let idioma = textoRecebido.slice(5, 7).toLowerCase(), idiomasSuportados = ["pt", 'en', 'ja', 'es', 'it', 'ru', 'ko', 'sv']
                    if(!idiomasSuportados.includes(idioma)) return await socket.reply(c, chatId, msgs_texto.utilidades.voz.nao_suportado, id)
                    await api.textoParaVoz(idioma, usuarioTexto).then(async({resultado})=>{
                        await socket.replyFile(c, MessageTypes.audio, chatId, resultado, '', id, 'audio/mpeg').then(()=>{
                            fs.unlinkSync(resultado)
                        })
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'noticias':
                try{
                    await api.obterNoticias().then(async({resultado})=>{
                        let respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                        for(let noticia of resultado){
                            respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.titulo, noticia.autor, noticia.publicadoHa, noticia.url)
                        }
                        await socket.reply(c, chatId, respostaNoticias, id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'calc':
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command) ,id)
                    var usuarioExpressaoMatematica = textoRecebido.slice(6).trim()
                    await api.obterCalculo(usuarioExpressaoMatematica).then(async ({resultado})=>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.utilidades.calc.resposta, resultado), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
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