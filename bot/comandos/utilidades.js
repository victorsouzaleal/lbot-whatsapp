//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import * as api from '../../api/api.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {downloadMediaMessage } from '@whiskeysockets/baileys'
import {obterMensagensTexto} from '../lib/msgs.js'


export const utilidades = async(c, mensagemBaileys, botInfoJSON) => {
    const msgs_texto = obterMensagensTexto(botInfoJSON)
    const {prefixo} = botInfoJSON
    const {textoRecebido, sender, command, isMedia, args, type, id, chatId, mimetype, quotedMsg, quotedMsgObj, quotedMsgObjInfo} = mensagemBaileys
    let cmdSemPrefixo = command.replace(prefixo, "")

    try{
        switch(cmdSemPrefixo){  
            case "filmes":
                try{
                    await api.top20TendenciasDia("filmes").then(async({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.filmes.resposta, resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "series":
                try{
                    await api.top20TendenciasDia("series").then(async({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.series.resposta, resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "gpt":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await api.respostaHercaiTexto(usuarioTexto, sender).then(async ({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.gpt.resposta, resultado), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "criarimg":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(10).trim()
                    await socket.responderTexto(c, chatId, msgs_texto.utilidades.criarimg.espera, id)
                    await api.respostaHercaiImagem(usuarioTexto).then(async ({resultado})=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, chatId, resultado, '', id)     
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "rbg":
                try{
                    if(!isMedia && !quotedMsg) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                    let dadosMensagem = {
                        tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                        mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                        message: (quotedMsg)? quotedMsgObj  : id,
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.rbg.invalido , id)
                    await socket.responderTexto(c, chatId, msgs_texto.utilidades.rbg.espera, id)
                    let bufferImagem = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.removerFundo(bufferImagem).then(async({resultado})=>{
                        await socket.responderArquivoBuffer(c, MessageTypes.image, chatId, resultado, '', id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "tabela":
                try{
                    await api.obterTabelaNick().then(async({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.tabela.resposta, resultado), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "letra":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(7).trim()
                    await api.obterLetraMusica(usuarioTexto).then(async({resultado})=>{
                        await socket.responderArquivoLocal(c, MessageTypes.image, chatId, resultado.imagem, criarTexto(msgs_texto.utilidades.letra.resposta, resultado.titulo, resultado.artista, resultado.letra), id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "ouvir":
                try{
                    if(!quotedMsg || quotedMsgObjInfo?.type != MessageTypes.audio) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    if(quotedMsgObjInfo.seconds > 90) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.ouvir.erro_limite, id)
                    let bufferAudio = await downloadMediaMessage(quotedMsgObj, "buffer")
                    await api.obterTranscricaoAudio(bufferAudio).then(async({resultado})=>{
                        let textoTranscricao = resultado.results.channels[0].alternatives[0].transcript
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.ouvir.sucesso, textoTranscricao), quotedMsgObj)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
                
            case "ddd":
                try{
                    let DDD = null
                    if(quotedMsg){
                        let DDI = quotedMsgObjInfo.sender.slice(0,2)
                        if(DDI != "55") return await socket.responderTexto(c, chatId, msgs_texto.utilidades.ddd.somente_br ,id)
                        DDD = quotedMsgObjInfo.sender.slice(2,4)
                    } else if(args.length > 1){
                        if(args[1].length != 2) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.ddd.nao_encontrado ,id)
                        DDD = args[1]
                    } else return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)

                    await api.obterInfoDDD(DDD).then(async({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.ddd.resposta, resultado.estado, resultado.regiao), id)
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "audio":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = textoRecebido.slice(7).trim()
                    if(!efeitosSuportados.includes(tipoEfeito)) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    if(!quotedMsg || quotedMsgObjInfo.type != MessageTypes.audio) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let bufferAudio = await downloadMediaMessage(quotedMsgObj, "buffer")
                    await api.obterAudioModificado(bufferAudio, tipoEfeito).then(async ({resultado : bufferAudioEditado})=>{
                        await socket.responderArquivoBuffer(c, MessageTypes.audio, chatId, bufferAudioEditado, '', id, "audio/mpeg")
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "qualmusica":
                try{
                    let tipoMensagem = quotedMsg ? quotedMsgObjInfo.type : type
                    if(tipoMensagem != MessageTypes.video && tipoMensagem != MessageTypes.audio) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let dadosMensagem = quotedMsg ? quotedMsgObj : id             
                    let bufferMensagemMidia = await downloadMediaMessage(dadosMensagem, "buffer")
                    await socket.responderTexto(c, chatId, msgs_texto.utilidades.qualmusica.espera, id)
                    await api.obterReconhecimentoMusica(bufferMensagemMidia, tipoMensagem).then(async({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resultado.titulo, resultado.produtora, resultado.duracao, resultado.lancamento, resultado.album, resultado.artistas), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "clima":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command),id)
                    let usuarioTexto = textoRecebido.slice(7).trim()
                    await api.obterClima(usuarioTexto).then(async({resultado})=>{
                        let respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, resultado.texto), respostaClimaFoto = resultado.foto_clima
                        await socket.responderTexto(c, chatId, respostaClimaTexto, id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "moeda":
                try{
                    if(args.length !== 3) return await socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let usuarioMoedaInserida = args[1], usuarioValorInserido = args[2]
                    await api.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido).then(async({resultado})=>{
                        let itens = ''
                        for(let dado of  resultado.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, dado.conversao, dado.valor_convertido_formatado, dado.tipo, dado.atualizacao)
                        let respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, resultado.valor_inserido, resultado.moeda_inserida, itens)
                        await socket.responderTexto(c, chatId, respostaFinal ,id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "pesquisa":
                try{
                    if (args.length === 1) return socket.responderTexto(c, chatId, await erroComandoMsg(command) , id)
                    let usuarioTexto = textoRecebido.slice(10).trim() 
                    await api.obterPesquisaWeb(usuarioTexto).then(async({resultados})=>{
                        let pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                        for(let resultado of resultados){
                            pesquisaResposta += "═════════════════\n"
                            pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                        }
                        await socket.responderTexto(c, chatId, pesquisaResposta, id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'rastreio':
                try{
                    if (args.length === 1) return socket.responderTexto(c, chatId, await erroComandoMsg(command), id)
                    let usuarioCodigoRastreio = textoRecebido.slice(10).trim()
                    if(usuarioCodigoRastreio.length != 13) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.rastreio.codigo_invalido, id)
                    await api.obterRastreioCorreios(usuarioCodigoRastreio).then(async({resultado})=>{   
                        let rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                        for(let dado of resultado){
                            let local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                            rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                            rastreioResposta += "-----------------------------------------\n"
                        }
                        await socket.responderTexto(c, chatId, rastreioResposta, id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "anime":
                try{
                    let dadosMensagem = {
                        tipo: (quotedMsg)? quotedMsgObjInfo.type : type,
                        mimetype: (quotedMsg)? quotedMsgObjInfo.mimetype : mimetype,
                        mensagem: (quotedMsg)? quotedMsgObj : id
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, chatId,await erroComandoMsg(command), id)
                    await socket.responderTexto(c, chatId,msgs_texto.utilidades.anime.espera, id)
                    let bufferImagem = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                    await api.obterAnimeInfo(bufferImagem).then(async ({resultado})=>{
                        if(resultado.similaridade < 87){
                            await socket.responderTexto(c, chatId,msgs_texto.utilidades.anime.similaridade,id)
                        } else {
                            resultado.episodio = resultado.episodio || "---"
                            let respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, resultado.titulo, resultado.episodio, resultado.tempoInicial, resultado.tempoFinal, resultado.similaridade, resultado.link_previa)                          
                            await socket.responderArquivoLocal(c, MessageTypes.video, chatId, resultado.link_previa, respostaAnimeInfo, id, "video/mp4")
                        }
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "traduz":
                try{
                    let usuarioTexto = "", idiomaTraducao = 'pt'
                    if(quotedMsg  && (quotedMsgObjInfo.type == MessageTypes.text || quotedMsgObjInfo.type == MessageTypes.extendedText)){
                        if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) ,id)
                        idiomaTraducao = args[1]
                        usuarioTexto = quotedMsgObjInfo.body || quotedMsgObjInfo.caption
                    } else if(!quotedMsg && (type == MessageTypes.text || type == MessageTypes.extendedText)){
                        if(args.length < 3) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) ,id)
                        idiomaTraducao = args[1]
                        usuarioTexto = args.slice(2).join(" ")
                    } else {
                        return await socket.responderTexto(c, chatId, await erroComandoMsg(command) ,id)
                    }
                    let idiomasSuportados = ["pt", "es", "en", "ja", "it", "ru", "ko"]
                    if(!idiomasSuportados.includes(idiomaTraducao)) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.traduz.nao_suportado, id)
                    await api.obterTraducao(usuarioTexto, idiomaTraducao).then(async ({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.traduz.resposta, usuarioTexto, resultado), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break  
            
            case 'voz':
                try{
                    let usuarioTexto = ''
                    if (args.length === 1) {
                        return await socket.responderTexto(c, chatId, await erroComandoMsg(command) ,id)
                    } else if(quotedMsg  && (quotedMsgObjInfo.type == MessageTypes.extendedText || quotedMsgObjInfo.type == MessageTypes.text)){
                        usuarioTexto = (args.length == 2) ? quotedMsgObjInfo.body || quotedMsgObjInfo.caption : textoRecebido.slice(8).trim()
                    } else {
                        usuarioTexto = textoRecebido.slice(8).trim()
                    }
                    if (!usuarioTexto) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.voz.texto_vazio , id)
                    if (usuarioTexto.length > 200) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.voz.texto_longo, id)
                    let idioma = textoRecebido.slice(5, 7).toLowerCase(), idiomasSuportados = ["pt", 'en', 'ja', 'es', 'it', 'ru', 'ko', 'sv']
                    if(!idiomasSuportados.includes(idioma)) return await socket.responderTexto(c, chatId, msgs_texto.utilidades.voz.nao_suportado, id)
                    await api.textoParaVoz(idioma, usuarioTexto).then(async({resultado})=>{
                        await socket.responderArquivoBuffer(c, MessageTypes.audio, chatId, resultado, '', id, 'audio/mpeg')
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
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
                        await socket.responderTexto(c, chatId, respostaNoticias, id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'calc':
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, await erroComandoMsg(command) ,id)
                    let usuarioExpressaoMatematica = textoRecebido.slice(6).trim()
                    await api.obterCalculo(usuarioExpressaoMatematica).then(async ({resultado})=>{
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.utilidades.calc.resposta, resultado), id)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "UTILIDADES")
    }
    

}