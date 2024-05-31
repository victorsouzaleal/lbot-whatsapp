//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import api from '@victorsouzaleal/lbot-api-comandos'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {downloadMediaMessage } from '@whiskeysockets/baileys'
import {obterMensagensTexto} from '../lib/msgs.js'


export const utilidades = async(c, mensagemBaileys, botInfo) => {
    //Atribuição de valores
    const msgs_texto = obterMensagensTexto(botInfo)
    const {prefixo} = botInfo
    const {
        texto_recebido,
        remetente,
        comando,
        mensagem_midia,
        args,
        tipo,
        mensagem,
        id_chat,
        mensagem_citada,
        midia,
        citacao
    } = mensagemBaileys
    const {mimetype} = {...midia}
    const comandoSemPrefixo = comando.replace(prefixo, "")

    //Comandos de utilidades
    try{
        switch(comandoSemPrefixo){  
            case 'upimg':
                try{
                    if (citacao?.tipo != MessageTypes.image && tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let bufferImagem = await downloadMediaMessage(mensagem_citada ? citacao.mensagem : mensagem, 'buffer')
                    let {resultado: resultadoLink} = await api.Imagens.imagemUpload(bufferImagem)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.upimg.resposta, resultadoLink), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case 'encurtar':
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioTexto = texto_recebido
                    let {resultado: resultadoLink} = await api.Gerais.encurtarLink(usuarioTexto)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.encurtar.resposta, resultadoLink), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break    

            case "filmes":
                try{
                    let {resultado: resultadoTexto} = await api.Gerais.top20TendenciasDia("filmes")
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.filmes.resposta, resultadoTexto), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "series":
                try{
                    let {resultado: resultadoTexto} = await api.Gerais.top20TendenciasDia("series")
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.series.resposta, resultadoTexto), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "gpt":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioTexto = texto_recebido
                    let {resultado: resultadoTexto} = await api.IA.obterRespostaIA(usuarioTexto, remetente)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.gpt.resposta, resultadoTexto), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case "criarimg":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioTexto = texto_recebido
                    await socket.responderTexto(c, id_chat, msgs_texto.utilidades.criarimg.espera, mensagem)
                    let {resultado: resultadoImagem} = await api.IA.obterImagemIA(usuarioTexto)
                    await socket.responderArquivoUrl(c, MessageTypes.image, id_chat, resultadoImagem, '', mensagem) 
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "rbg":
                try{
                    if(!mensagem_midia && !mensagem_citada) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem)
                    let dadosMensagem = {
                        tipo : (mensagem_midia) ? tipo : citacao.tipo,
                        mimetype : (mensagem_midia)? mimetype : citacao.mimetype,
                        message: (mensagem_citada)? citacao.mensagem  : mensagem,
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.rbg.invalido , mensagem)
                    await socket.responderTexto(c, id_chat, msgs_texto.utilidades.rbg.espera, mensagem)
                    let bufferImagem = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    let {resultado: resultadoImagem} = await api.Imagens.removerFundo(bufferImagem)
                    await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, resultadoImagem, '', mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case "tabela":
                try{
                    let {resultado: resultadoTexto} = await api.Gerais.obterTabelaNick()
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.tabela.resposta, resultadoTexto), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "letra":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioTexto = texto_recebido
                    let {resultado: resultadoLetra} = await api.Gerais.obterLetraMusica(usuarioTexto)
                    await socket.responderArquivoLocal(c, MessageTypes.image, id_chat, resultadoLetra.imagem, criarTexto(msgs_texto.utilidades.letra.resposta, resultadoLetra.titulo, resultadoLetra.artista, resultadoLetra.letra), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "ouvir":
                try{
                    if(!mensagem_citada || citacao?.tipo != MessageTypes.audio) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    if(citacao.segundos > 90) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.ouvir.erro_limite, mensagem)
                    let bufferAudio = await downloadMediaMessage(citacao.mensagem, "buffer")
                    let {resultado: resultadoTranscricao} = await api.Audios.obterTranscricaoAudio(bufferAudio, {deepgram_secret_key : process.env.dg_secret_key?.trim()})
                    let textoTranscricao = resultadoTranscricao.results.channels[0].alternatives[0].transcript
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.ouvir.sucesso, textoTranscricao), citacao.mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
                
            case "ddd":
                try{
                    let DDD
                    if(mensagem_citada){
                        let DDI = citacao.remetente.slice(0,2)
                        if(DDI != "55") return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.ddd.somente_br ,mensagem)
                        DDD = citacao.remetente.slice(2,4)
                    } else if(args.length){
                        DDD = texto_recebido
                    } else {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    }
                    let {resultado: resultadoDDD} = await api.Gerais.obterInfoDDD(DDD)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.ddd.resposta, resultadoDDD.estado, resultadoDDD.regiao), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "audio":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = texto_recebido
                    if(!efeitosSuportados.includes(tipoEfeito)) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    if(!mensagem_citada || citacao.tipo != MessageTypes.audio) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let bufferAudio = await downloadMediaMessage(citacao.mensagem, "buffer")
                    let {resultado : resultadoAudio} = await api.Audios.obterAudioModificado(bufferAudio, tipoEfeito)
                    await socket.responderArquivoBuffer(c, MessageTypes.audio, id_chat, resultadoAudio, '', mensagem, "audio/mpeg")
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "qualmusica":
                try{
                    let tipoMensagem = mensagem_citada ? citacao.tipo : tipo
                    if(tipoMensagem != MessageTypes.video && tipoMensagem != MessageTypes.audio) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let dadosMensagem = mensagem_citada ? citacao.mensagem : mensagem             
                    let bufferMensagemMidia = await downloadMediaMessage(dadosMensagem, "buffer")
                    await socket.responderTexto(c, id_chat, msgs_texto.utilidades.qualmusica.espera, mensagem)
                    let {resultado: resultadoDadosMusica} = await api.Audios.obterReconhecimentoMusica(bufferMensagemMidia, {
                        acr_host: process.env.acr_host?.trim(),
                        acr_access_key: process.env.acr_access_key?.trim(),
                        acr_access_secret: process.env.acr_access_secret?.trim()
                    })
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resultadoDadosMusica.titulo, resultadoDadosMusica.produtora, resultadoDadosMusica.duracao, resultadoDadosMusica.lancamento, resultadoDadosMusica.album, resultadoDadosMusica.artistas), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "clima":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo),mensagem)
                    let usuarioTexto = texto_recebido
                    let {resultado: resultadoClima} = await api.Gerais.obterClima(usuarioTexto)
                    //Resposta do clima atual
                    let respostaClimaAtual = criarTexto(msgs_texto.utilidades.clima.resposta.clima_atual,
                        resultadoClima.local.nome,
                        resultadoClima.local.estado,
                        resultadoClima.local.pais,
                        resultadoClima.local.horario_atual,
                        resultadoClima.atual.temp,
                        resultadoClima.atual.sensacao,
                        resultadoClima.atual.condicao,
                        resultadoClima.atual.vento,
                        resultadoClima.atual.umidade,
                        resultadoClima.atual.nuvens
                    )

                    //Resposta das previsões
                    let respostaPrevisoes = ''
                    resultadoClima.previsao.forEach((prev)=>{
                        respostaPrevisoes += criarTexto(msgs_texto.utilidades.clima.resposta.previsao,
                            prev.data,
                            prev.max,
                            prev.min,
                            prev.condicao,
                            prev.max_vento,
                            prev.chance_chuva,
                            prev.chance_neve,
                            prev.uv
                        )
                    })

                    //Juntando as duas respostas em uma
                    let respostaFinalClima = respostaClimaAtual + respostaPrevisoes

                    await socket.responderTexto(c, id_chat, respostaFinalClima, mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "moeda":
                try{
                    if(args.length != 2) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let [usuarioMoedaInserida, usuarioValorInserido] = args
                    let {resultado: resultadoConversao} = await api.Gerais.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido)
                    let itens = ''
                    for(let dado of  resultadoConversao.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, dado.conversao, dado.valor_convertido_formatado, dado.tipo, dado.atualizacao)
                    let respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, resultadoConversao.valor_inserido, resultadoConversao.moeda_inserida, itens)
                    await socket.responderTexto(c, id_chat, respostaFinal ,mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "pesquisa":
                try{
                    if (!args.length) return socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem)
                    let usuarioTexto = texto_recebido
                    let {resultado: resultadoPesquisa} = await api.Gerais.obterPesquisaWeb(usuarioTexto)
                    let pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                    for(let resultado of resultadoPesquisa){
                        pesquisaResposta += "═════════════════\n"
                        pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                    }
                    await socket.responderTexto(c, id_chat, pesquisaResposta, mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case 'rastreio':
                try{
                    if (!args.length) return socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioCodigoRastreio = texto_recebido
                    if(usuarioCodigoRastreio.length != 13) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.rastreio.codigo_invalido, mensagem)
                    let {resultado: resultadoRastreio} = await api.Gerais.obterRastreioCorreios(usuarioCodigoRastreio)
                    let rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                    for(let dado of resultadoRastreio){
                        let local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                        rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                        rastreioResposta += "-----------------------------------------\n"
                    }
                    await socket.responderTexto(c, id_chat, rastreioResposta, mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case "anime":
                try{
                    let dadosMensagem = {
                        tipo: (mensagem_citada)? citacao.tipo : tipo,
                        mimetype: (mensagem_citada)? citacao.mimetype : mimetype,
                        mensagem: (mensagem_citada)? citacao.mensagem : mensagem
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo), mensagem)
                    await socket.responderTexto(c, id_chat,msgs_texto.utilidades.anime.espera, mensagem)
                    let bufferImagem = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                    let {resultado: resultadoAnimeInfo} = await api.Imagens.obterAnimeInfo(bufferImagem)
                    if(resultadoAnimeInfo.similaridade < 87) return await socket.responderTexto(c, id_chat,msgs_texto.utilidades.anime.similaridade, mensagem)
                    resultadoAnimeInfo.episodio = resultadoAnimeInfo.episodio || "---"
                    let respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, resultadoAnimeInfo.titulo, resultadoAnimeInfo.episodio, resultadoAnimeInfo.tempoInicial, resultadoAnimeInfo.tempoFinal, resultadoAnimeInfo.similaridade, resultadoAnimeInfo.link_previa)                          
                    await socket.responderArquivoLocal(c, MessageTypes.video, id_chat, resultadoAnimeInfo.link_previa, respostaAnimeInfo, mensagem, "video/mp4")
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case "traduz":
                try{
                    let usuarioTexto , idiomaTraducao, idiomasSuportados = ["pt", "es", "en", "ja", "it", "ru", "ko"]
                    if(mensagem_citada  && (citacao.tipo == MessageTypes.text || citacao.tipo == MessageTypes.extendedText)){
                        if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem);
                        [idiomaTraducao] = args
                        usuarioTexto = citacao.corpo || citacao.legenda
                    } else if(!mensagem_citada && (tipo == MessageTypes.text || tipo == MessageTypes.extendedText)){
                        if(args.length < 2) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem);
                        [idiomaTraducao, ...usuarioTexto] = args
                        usuarioTexto = usuarioTexto.join(" ")
                    } else {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem)
                    }
                    if(!idiomasSuportados.includes(idiomaTraducao)) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.traduz.nao_suportado, mensagem)
                    let {resultado: resultadoTraducao} = await api.Gerais.obterTraducao(usuarioTexto, idiomaTraducao)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.traduz.resposta, usuarioTexto, resultadoTraducao), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break  
            
            case 'voz':
                try{
                    const idiomasSuportados = ["pt", 'en', 'ja', 'es', 'it', 'ru', 'ko', 'sv']
                    let idioma, usuarioTexto
                    if (!args.length) {
                        return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem)
                    } else if(mensagem_citada  && (citacao.tipo == MessageTypes.extendedText || citacao.tipo == MessageTypes.text)){
                        [idioma] = args
                        usuarioTexto = citacao.corpo || citacao.legenda
                    } else {
                        [idioma, ...usuarioTexto] = args
                        usuarioTexto = usuarioTexto.join(" ")
                    }
                    if (!usuarioTexto) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.voz.texto_vazio , mensagem)
                    if (usuarioTexto.length > 200) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.voz.texto_longo, mensagem)
                    if(!idiomasSuportados.includes(idioma)) return await socket.responderTexto(c, id_chat, msgs_texto.utilidades.voz.nao_suportado, mensagem)
                    let {resultado: resultadoAudio} = await api.Audios.textoParaVoz(idioma, usuarioTexto)
                    await socket.responderArquivoBuffer(c, MessageTypes.audio, id_chat, resultadoAudio, '', mensagem, 'audio/mpeg')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case 'noticias':
                try{
                    let {resultado: resultadoNoticias} = await api.Gerais.obterNoticias()
                    let respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                    for(let noticia of resultadoNoticias){
                        respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.titulo, noticia.autor, noticia.publicadoHa, noticia.url)
                    }
                    await socket.responderTexto(c, id_chat, respostaNoticias, mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case 'calc':
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) ,mensagem)
                    let usuarioExpressaoMatematica = texto_recebido
                    let {resultado: resultadoCalculo} = await api.Gerais.obterCalculo(usuarioExpressaoMatematica)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.utilidades.calc.resposta, resultadoCalculo), mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "UTILIDADES")
    }
    

}