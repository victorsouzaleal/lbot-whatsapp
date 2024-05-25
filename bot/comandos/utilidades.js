//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import api from '../../api/api.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {downloadMediaMessage } from '@whiskeysockets/baileys'
import {obterMensagensTexto} from '../lib/msgs.js'


export const utilidades = async(c, mensagemBaileys, botInfo) => {
    const msgs_texto = obterMensagensTexto(botInfo)
    const {prefixo} = botInfo
    const {texto_recebido, remetente, comando, mensagem_midia, args, tipo, mensagem_completa, id_chat, mensagem_citada, midia, citacao} = mensagemBaileys
    const {mimetype} = midia ?? {}
    let cmdSemPrefixo = comando.replace(prefixo, "")

    try{
        switch(cmdSemPrefixo){  
            case 'upimg':
                if (citacao?.tipo != MessageTypes.image && tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                let bufferImagem = await downloadMediaMessage(mensagem_citada ? citacao.mensagem_citacao : mensagem_completa, 'buffer')
                await api.Imagens.imagemUpload(bufferImagem).then(async ({resultado})=>{
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.upimg.resposta, resultado), mensagem_completa)
                }).catch(async(err)=>{
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                })
                break

            case 'encurtar':
                if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                let usuarioTexto = texto_recebido.slice(10).trim()
                await api.Gerais.encurtarLink(usuarioTexto).then(async({resultado})=>{
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.encurtar.resposta, resultado), mensagem_completa)
                }).catch(async(err)=>{
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                })
                break    

            case "filmes":
                try{
                    await api.Gerais.top20TendenciasDia("filmes").then(async({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.filmes.resposta, resultado), mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "series":
                try{
                    await api.Gerais.top20TendenciasDia("series").then(async({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.series.resposta, resultado), mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "gpt":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(5).trim()
                    await api.IA.respostaHercaiTexto(usuarioTexto, remetente).then(async ({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.gpt.resposta, resultado), mensagem_completa)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "criarimg":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(10).trim()
                    await socket.responderTexto(c, id_chat, msgs_texto.utilidades.criarimg.espera, mensagem_completa)
                    await api.IA.respostaHercaiImagem(usuarioTexto).then(async ({resultado})=>{
                        await socket.responderArquivoUrl(c, MessageTypes.image, id_chat, resultado, '', mensagem_completa)     
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "rbg":
                try{
                    if(!mensagem_midia && !mensagem_citada) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let dadosMensagem = {
                        tipo : (mensagem_midia) ? tipo : citacao.tipo,
                        mimetype : (mensagem_midia)? mimetype : citacao.mimetype,
                        message: (mensagem_citada)? citacao.mensagem_citacao  : mensagem_completa,
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.rbg.invalido , mensagem_completa)
                    await socket.responderTexto(c, id_chat, msgs_texto.utilidades.rbg.espera, mensagem_completa)
                    let bufferImagem = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Imagens.removerFundo(bufferImagem).then(async({resultado})=>{
                        await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, resultado, '', mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "tabela":
                try{
                    await api.Gerais.obterTabelaNick().then(async({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.tabela.resposta, resultado), mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "letra":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(7).trim()
                    await api.Gerais.obterLetraMusica(usuarioTexto).then(async({resultado})=>{
                        await socket.responderArquivoLocal(c, MessageTypes.image, id_chat, resultado.imagem, criarTexto(msgs_texto.utilidades.letra.resposta, resultado.titulo, resultado.artista, resultado.letra), mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "ouvir":
                try{
                    if(!mensagem_citada || citacao?.tipo != MessageTypes.audio) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    if(citacao.segundos > 90) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.ouvir.erro_limite, mensagem_completa)
                    let bufferAudio = await downloadMediaMessage(citacao.mensagem_citacao, "buffer")
                    await api.Audios.obterTranscricaoAudio(bufferAudio).then(async({resultado})=>{
                        let textoTranscricao = resultado.results.channels[0].alternatives[0].transcript
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.ouvir.sucesso, textoTranscricao), citacao.mensagem_citacao)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
                
            case "ddd":
                try{
                    let DDD = null
                    if(mensagem_citada){
                        let DDI = citacao.remetente.slice(0,2)
                        if(DDI != "55") return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.ddd.somente_br ,mensagem_completa)
                        DDD = citacao.remetente.slice(2,4)
                    } else if(args.length > 1){
                        if(args[1].length != 2) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.ddd.nao_encontrado ,mensagem_completa)
                        DDD = args[1]
                    } else return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)

                    await api.Gerais.obterInfoDDD(DDD).then(async({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.ddd.resposta, resultado.estado, resultado.regiao), mensagem_completa)
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "audio":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = texto_recebido.slice(7).trim()
                    if(!efeitosSuportados.includes(tipoEfeito)) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    if(!mensagem_citada || citacao.tipo != MessageTypes.audio) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let bufferAudio = await downloadMediaMessage(citacao.mensagem_citacao, "buffer")
                    await api.Audios.obterAudioModificado(bufferAudio, tipoEfeito).then(async ({resultado : bufferAudioEditado})=>{
                        await socket.responderArquivoBuffer(c, MessageTypes.audio, id_chat, bufferAudioEditado, '', mensagem_completa, "audio/mpeg")
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "qualmusica":
                try{
                    let tipoMensagem = mensagem_citada ? citacao.tipo : tipo
                    if(tipoMensagem != MessageTypes.video && tipoMensagem != MessageTypes.audio) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let dadosMensagem = mensagem_citada ? citacao.mensagem_citacao : mensagem_completa             
                    let bufferMensagemMidia = await downloadMediaMessage(dadosMensagem, "buffer")
                    await socket.responderTexto(c, id_chat, msgs_texto.utilidades.qualmusica.espera, mensagem_completa)
                    await api.Audios.obterReconhecimentoMusica(bufferMensagemMidia, tipoMensagem).then(async({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resultado.titulo, resultado.produtora, resultado.duracao, resultado.lancamento, resultado.album, resultado.artistas), mensagem_completa)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "clima":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo),mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(7).trim()
                    await api.Gerais.obterClima(usuarioTexto).then(async({resultado})=>{
                        let respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, resultado.texto), respostaClimaFoto = resultado.foto_clima
                        await socket.responderTexto(c, id_chat, respostaClimaTexto, mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "moeda":
                try{
                    if(args.length !== 3) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioMoedaInserida = args[1], usuarioValorInserido = args[2]
                    await api.Gerais.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido).then(async({resultado})=>{
                        let itens = ''
                        for(let dado of  resultado.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, dado.conversao, dado.valor_convertido_formatado, dado.tipo, dado.atualizacao)
                        let respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, resultado.valor_inserido, resultado.moeda_inserida, itens)
                        await socket.responderTexto(c, id_chat, respostaFinal ,mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "pesquisa":
                try{
                    if (args.length === 1) return socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(10).trim() 
                    await api.Gerais.obterPesquisaWeb(usuarioTexto).then(async({resultados})=>{
                        let pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                        for(let resultado of resultados){
                            pesquisaResposta += "═════════════════\n"
                            pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                        }
                        await socket.responderTexto(c, id_chat, pesquisaResposta, mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'rastreio':
                try{
                    if (args.length === 1) return socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioCodigoRastreio = texto_recebido.slice(10).trim()
                    if(usuarioCodigoRastreio.length != 13) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.rastreio.codigo_invalido, mensagem_completa)
                    await api.Gerais.obterRastreioCorreios(usuarioCodigoRastreio).then(async({resultado})=>{   
                        let rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                        for(let dado of resultado){
                            let local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                            rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                            rastreioResposta += "-----------------------------------------\n"
                        }
                        await socket.responderTexto(c, id_chat, rastreioResposta, mensagem_completa)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "anime":
                try{
                    let dadosMensagem = {
                        tipo: (mensagem_citada)? citacao.tipo : tipo,
                        mimetype: (mensagem_citada)? citacao.mimetype : mimetype,
                        mensagem: (mensagem_citada)? citacao.mensagem_citacao : mensagem_completa
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo), mensagem_completa)
                    await socket.responderTexto(c, id_chat,msgs_texto.utilidades.anime.espera, mensagem_completa)
                    let bufferImagem = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                    await api.Imagens.obterAnimeInfo(bufferImagem).then(async ({resultado})=>{
                        if(resultado.similaridade < 87){
                            await socket.responderTexto(c, id_chat,msgs_texto.utilidades.anime.similaridade,mensagem_completa)
                        } else {
                            resultado.episodio = resultado.episodio || "---"
                            let respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, resultado.titulo, resultado.episodio, resultado.tempoInicial, resultado.tempoFinal, resultado.similaridade, resultado.link_previa)                          
                            await socket.responderArquivoLocal(c, MessageTypes.video, id_chat, resultado.link_previa, respostaAnimeInfo, mensagem_completa, "video/mp4")
                        }
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "traduz":
                try{
                    let usuarioTexto = "", idiomaTraducao = 'pt'
                    if(mensagem_citada  && (citacao.tipo == MessageTypes.text || citacao.tipo == MessageTypes.extendedText)){
                        if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                        idiomaTraducao = args[1]
                        usuarioTexto = citacao.corpo || citacao.legenda
                    } else if(!mensagem_citada && (tipo == MessageTypes.text || tipo == MessageTypes.extendedText)){
                        if(args.length < 3) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                        idiomaTraducao = args[1]
                        usuarioTexto = args.slice(2).join(" ")
                    } else {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                    }
                    let idiomasSuportados = ["pt", "es", "en", "ja", "it", "ru", "ko"]
                    if(!idiomasSuportados.includes(idiomaTraducao)) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.traduz.nao_suportado, mensagem_completa)
                    await api.Gerais.obterTraducao(usuarioTexto, idiomaTraducao).then(async ({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.traduz.resposta, usuarioTexto, resultado), mensagem_completa)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem_completa)
                    err.message = `${comando} - ${err.message}`
                    throw err
                }
                break  
            
            case 'voz':
                try{
                    let usuarioTexto = ''
                    if (args.length === 1) {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                    } else if(mensagem_citada  && (citacao.tipo == MessageTypes.extendedText || citacao.tipo == MessageTypes.text)){
                        usuarioTexto = (args.length == 2) ? citacao.corpo || citacao.legenda : texto_recebido.slice(8).trim()
                    } else {
                        usuarioTexto = texto_recebido.slice(8).trim()
                    }
                    if (!usuarioTexto) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.voz.texto_vazio , mensagem_completa)
                    if (usuarioTexto.length > 200) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.voz.texto_longo, mensagem_completa)
                    let idioma = texto_recebido.slice(5, 7).toLowerCase(), idiomasSuportados = ["pt", 'en', 'ja', 'es', 'it', 'ru', 'ko', 'sv']
                    if(!idiomasSuportados.includes(idioma)) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.voz.nao_suportado, mensagem_completa)
                    await api.Audios.textoParaVoz(idioma, usuarioTexto).then(async({resultado})=>{
                        await socket.responderArquivoBuffer(c, MessageTypes.audio, id_chat, resultado, '', mensagem_completa, 'audio/mpeg')
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'noticias':
                try{
                    await api.Gerais.obterNoticias().then(async({resultado})=>{
                        let respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                        for(let noticia of resultado){
                            respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.titulo, noticia.autor, noticia.publicadoHa, noticia.url)
                        }
                        await socket.responderTexto(c, id_chat, respostaNoticias, mensagem_completa)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'calc':
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem_completa)
                    let usuarioExpressaoMatematica = texto_recebido.slice(6).trim()
                    await api.Gerais.obterCalculo(usuarioExpressaoMatematica).then(async ({resultado})=>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.calc.resposta, resultado), mensagem_completa)
                    }).catch(async (err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem_completa)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "UTILIDADES")
    }
    

}