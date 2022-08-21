//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const msgs_texto = require('../lib/msgs')
const {criarTexto, erroComandoMsg, obterNomeAleatorio, removerNegritoComando} = require("../lib/util")
const path = require('path')
const api = require("../lib/api")
const {converterMp4ParaMp3} = require("../lib/conversao")

module.exports = utilidades = async(client,message) => {
    try{
        const { type, id, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, body} = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'

        switch(command){      
            case "!tabela":
                var tabela = await api.obterTabelaNick()
                await client.reply(chatId, criarTexto(msgs_texto.utilidades.tabela.resposta, tabela), id)
                break

            case "!letra":
                if(args.length === 1) return client.reply(chatId, erroComandoMsg(command), id)
                try{
                    var usuarioTexto = body.slice(7).trim(), dadosMusica = await api.obterLetraMusica(usuarioTexto)
                    await client.sendImage(chatId, dadosMusica.imagem, "artista.jpg", criarTexto(msgs_texto.utilidades.letra.resposta, dadosMusica.titulo, dadosMusica.artista, dadosMusica.letra), id)
                } catch(err){
                    await client.reply(chatId, err.message, id)
                }
                break
                
            case "!ddd":
                var DDD = null
                if(quotedMsg){
                    let DDI = quotedMsgObj.author.slice(0,2)
                    if(DDI != "55") return client.reply(chatId, msgs_texto.utilidades.ddd.somente_br ,id)
                    DDD = quotedMsgObj.author.slice(2,4)
                } else if(args.length > 1 && args[1].length == 2){
                    if(args[1].length != 2) return client.reply(chatId, msgs_texto.utilidades.ddd.erro_ddd ,id)
                    DDD = args[1]
                } else {
                    return client.reply(chatId, erroComandoMsg(command), id)
                }
                try{
                    var resposta = await api.obterInfoDDD(DDD)
                    client.reply(chatId,resposta,id)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break

            case "!audio":
                if(args.length === 1) return client.reply(chatId, erroComandoMsg(command), id)
                var efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = body.slice(7).trim()
                if(!efeitosSuportados.includes(tipoEfeito)) return client.reply(chatId, erroComandoMsg(command), id)
                if(quotedMsg && (quotedMsg.type === "ptt" || quotedMsg.type === "audio") ){
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    var audioOriginal = path.resolve(`./media/audios/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(audioOriginal, mediaData, "base64")
                    try{
                        var audioEditado = await api.obterAudioModificado(audioOriginal, tipoEfeito)
                        client.sendFile(chatId, audioEditado, "audio.mp3","", id).then(()=>{
                            fs.unlinkSync(audioEditado)
                            fs.unlinkSync(audioOriginal)
                        })
                    } catch(err){
                        fs.unlinkSync(audioOriginal)
                        client.reply(chatId, err.message, id)
                    }
                } else {
                    client.reply(chatId, erroComandoMsg(command), id)
                }
                break

            case "!qualmusica":
                var dadosMensagem = quotedMsg ? quotedMsg : message
                if(dadosMensagem.mimetype != "video/mp4" && dadosMensagem.type != "audio" && dadosMensagem.type != "ptt") return client.reply(chatId, erroComandoMsg(command), id)
                var caminhoAudio = null, caminhoVideo = null
                var mediaData = await decryptMedia(dadosMensagem, uaOverride)
                await client.reply(chatId, msgs_texto.utilidades.qualmusica.espera, id)
                if(dadosMensagem.mimetype == "video/mp4"){
                    caminhoVideo = path.resolve(`media/videos/${obterNomeAleatorio(".mp4")}`)
                    fs.writeFileSync(caminhoVideo, mediaData, "base64")
                    try{
                        caminhoAudio = await converterMp4ParaMp3(caminhoVideo)
                        fs.unlinkSync(caminhoVideo)
                    }catch(err){
                        fs.unlinkSync(caminhoVideo)
                        client.reply(chatId, msgs_texto.utilidades.qualmusica.erro_conversao, id)
                    }
                }
                if(dadosMensagem.type == "audio" || dadosMensagem.type == "ptt"){
                    caminhoAudio = path.resolve(`media/audios/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(caminhoAudio, mediaData, "base64");
                }
                try{
                    var resp = await api.obterReconhecimentoMusica(caminhoAudio)
                    fs.unlinkSync(caminhoAudio)
                    client.reply(chatId, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resp.titulo, resp.produtora, resp.duracao, resp.lancamento, resp.album, resp.artistas), id)
                }catch(err){
                    client.reply(chatId, err.message, id)
                }
                break

            case "!clima":
                if(args.length === 1) return client.reply(chatId, erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(7).trim(), clima = await api.obterClima(usuarioTexto)
                    var respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, clima.texto), respostaClimaFoto = clima.foto_clima
                    client.sendFileFromUrl(chatId, respostaClimaFoto,`${body.slice(7)}.png`, respostaClimaTexto, id)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break

            case "!moeda":
                if(args.length !== 3) return client.reply(chatId, erroComandoMsg(command), id)
                try{
                    var usuarioMoedaInserida = args[1], usuarioValorInserido = args[2], conversaoMoeda = await api.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido)
                    var itens = ''
                    for(var c of  conversaoMoeda.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, c.conversao, c.valor_convertido_formatado, c.tipo, c.atualizacao)
                    var respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, conversaoMoeda.valor_inserido, conversaoMoeda.moeda_inserida, itens)
                    await client.reply(chatId, respostaFinal ,id)
                } catch(err){
                    await client.reply(chatId, err.message , id)
                }
                break

            case "!pesquisa":
                if (args.length === 1) return client.reply(chatId, erroComandoMsg(command) , id)
                try{
                    var usuarioTexto = body.slice(10).trim(), pesquisaResultados = await api.obterPesquisaWeb(usuarioTexto)
                    var pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                    for(let resultado of pesquisaResultados){
                        pesquisaResposta += "═════════════════\n"
                        pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                    }
                    client.reply(chatId, pesquisaResposta, id)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break

            case '!rastreio':
                if (args.length === 1) return client.reply(chatId, erroComandoMsg(command), id)
                try{
                    var usuarioCodigoRastreio = body.slice(10).trim(), rastreioDados = await api.obterRastreioCorreios(usuarioCodigoRastreio)
                    var rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                    for(let dado of rastreioDados){
                        var local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                        rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                        rastreioResposta += "-----------------------------------------\n"
                    }
                    await client.reply(chatId, rastreioResposta, id)
                } catch(err){
                    await client.reply(chatId, err.message ,id)
                }
                break
            
            case "!anime":
                if(isMedia || quotedMsg){
                    var dadosMensagem = {
                        tipo: (isMedia)? type : quotedMsg.type,
                        mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if(dadosMensagem.tipo === "image"){
                        client.reply(chatId,msgs_texto.utilidades.anime.espera, id)
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var usuarioImgBase64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        try{
                            var animeInfo = await api.obterAnimeInfo(usuarioImgBase64)
                            if(animeInfo.similaridade < 87) return client.reply(chatId,msgs_texto.utilidades.anime.similaridade,id)
                            animeInfo.episodio = animeInfo.episodio || "---"
                            var respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, animeInfo.titulo, animeInfo.episodio, animeInfo.tempoInicial, animeInfo.tempoFinal, animeInfo.similaridade, animeInfo.link_previa)
                            await client.reply(chatId, respostaAnimeInfo, id)
                        } catch(err){
                            client.reply(chatId,err.message,id)
                        }
                    } else {
                        client.reply(chatId,erroComandoMsg(command), id)
                    }
                } else {
                    client.reply(chatId,erroComandoMsg(command), id)
                }
                break

            case "!animelanc":
                try{
                    var resultadosAnimes = await api.obterAnimesLancamentos()
                    var respostaLancamentos = msgs_texto.utilidades.animelanc.resposta_titulo
                    for(let anime of resultadosAnimes){
                        respostaLancamentos += criarTexto(msgs_texto.utilidades.animelanc.resposta_itens, anime.titulo, anime.episodio, anime.url)
                    }
                    client.reply(chatId, respostaLancamentos, id)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break
            
            case "!traduz":
                var usuarioTexto = "", idiomaTraducao = 'pt'
                if(quotedMsg  && quotedMsg.type == "chat"){
                    if(args.length === 1) return client.reply(chatId, erroComandoMsg(command) ,id)
                    idiomaTraducao = args[1]
                    usuarioTexto = quotedMsg.body
                } else if(!quotedMsg && type == "chat" ){
                    if(args.length < 3) return client.reply(chatId, erroComandoMsg(command) ,id)
                    idiomaTraducao = args[1]
                    usuarioTexto = args.slice(2).join(" ")
                } else {
                    return client.reply(chatId, erroComandoMsg(command) ,id)
                }
                try{
                    var respostaTraducao = await api.obterTraducao(usuarioTexto, idiomaTraducao)
                    client.reply(chatId, respostaTraducao, id)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break  
            
            case '!voz':
                var usuarioTexto = '', idMensagem = id
                if (args.length === 1) {
                    return client.reply(chatId, erroComandoMsg(command) ,id)
                } else if(quotedMsg  && quotedMsg.type == 'chat'){
                    usuarioTexto = (args.length == 2) ? quotedMsg.body : body.slice(8).trim()
                } else {
                    usuarioTexto = body.slice(8).trim()
                }
                if (!usuarioTexto) return client.reply(chatId, msgs_texto.utilidades.voz.texto_vazio , id)
                if (usuarioTexto.length > 200) return client.reply(chatId, msgs_texto.utilidades.voz.texto_longo, id)
                if(quotedMsg) idMensagem = quotedMsgObj.id
                var idioma = body.slice(5, 7).toLowerCase()
                try{
                    var respostaAudio = await api.textoParaVoz(idioma, usuarioTexto)
                    client.sendPtt(chatId, respostaAudio, idMensagem)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break

            case '!noticias':
                try{
                    var listaNoticias = await api.obterNoticias()
                    var respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                    for(let noticia of listaNoticias){
                        respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.titulo, noticia.descricao || "Sem descrição", noticia.url)
                    }
                    await client.reply(chatId, respostaNoticias, id)
                } catch(err){
                    await client.reply(chatId, err.message, id)
                }
                break;

            case '!calc':
                if(args.length === 1) return client.reply(chatId, erroComandoMsg(command) ,id)
                var usuarioExpressaoMatematica = body.slice(6).trim()
                try{
                    var resultadoCalculo = await api.obterCalculo(usuarioExpressaoMatematica)
                    var respostaCalc = criarTexto(msgs_texto.utilidades.calc.resposta, resultadoCalculo)
                    client.reply(chatId, respostaCalc, id)
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break
        }
    } catch(err){
        throw err
    }
    

}