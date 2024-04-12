//REQUERINDO MÓDULOS
const fs = require('fs-extra')
const msgs_texto = require('../lib/msgs')
const {criarTexto, erroComandoMsg, obterNomeAleatorio, removerNegritoComando, consoleErro} = require("../lib/util")
const path = require('path')
const api = require("../lib/api")
const client = require("../lib-translate/baileys")
const { MessageTypes } = require('../lib-translate/msgtypes')
const { downloadMediaMessage } = require('@whiskeysockets/baileys')
const {converterMp4ParaMp3} = require("../lib/conversao")


module.exports = utilidades = async(c,messageTranslated) => {
    try{
        const { type, id, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, quotedMsgObjInfo, body} = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')

        switch(command){      
            case "!tabela":
                var tabela = await api.obterTabelaNick()
                await client.reply(c, chatId, criarTexto(msgs_texto.utilidades.tabela.resposta, tabela), id)
                break

            case "!letra":
                if(args.length === 1) return client.reply(c, chatId, erroComandoMsg(command), id)
                try{
                    var usuarioTexto = body.slice(7).trim(), dadosMusica = await api.obterLetraMusica(usuarioTexto)
                    console.log(dadosMusica)
                    await client.replyFile(c, MessageTypes.image, chatId, dadosMusica.imagem, criarTexto(msgs_texto.utilidades.letra.resposta, dadosMusica.titulo, dadosMusica.artista, dadosMusica.letra), id)
                } catch(err){
                    await client.reply(c, chatId, err.message, id)
                }
                break
                
            case "!ddd":
                var DDD = null
                if(quotedMsg){
                    let DDI = quotedMsgObjInfo.sender.slice(0,2)
                    if(DDI != "55") return client.reply(c, chatId, msgs_texto.utilidades.ddd.somente_br ,id)
                    DDD = quotedMsgObjInfo.sender.slice(2,4)
                } else if(args.length > 1 && args[1].length == 2){
                    if(args[1].length != 2) return client.reply(c, chatId, msgs_texto.utilidades.ddd.erro_ddd ,id)
                    DDD = args[1]
                } else {
                    return client.reply(c, chatId, erroComandoMsg(command), id)
                }
                try{
                    var resposta = await api.obterInfoDDD(DDD)
                    client.reply(c, chatId,resposta,id)
                } catch(err){
                    client.reply(c, chatId, err.message, id)
                }
                break

            case "!audio":
                if(args.length === 1) return client.reply(c, chatId, erroComandoMsg(command), id)
                var efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = body.slice(7).trim()
                if(!efeitosSuportados.includes(tipoEfeito)) return client.reply(c, chatId, erroComandoMsg(command), id)
                if(quotedMsg && (quotedMsgObjInfo.type == MessageTypes.audio) ){
                    var bufferQuotedMessage = await downloadMediaMessage(quotedMsgObj, "buffer")
                    var audioOriginal = path.resolve(`./temp/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(audioOriginal, bufferQuotedMessage)
                    try{
                        var audioEditado = await api.obterAudioModificado(audioOriginal, tipoEfeito)
                        client.replyFile(c, MessageTypes.audio, chatId, audioEditado, '', id, "audio/mpeg").then(()=>{
                            fs.unlinkSync(audioEditado)
                            fs.unlinkSync(audioOriginal)
                        })
                    } catch(err){
                        fs.unlinkSync(audioOriginal)
                        client.reply(c, chatId, err.message, id)
                    }
                } else {
                    client.reply(c, chatId, erroComandoMsg(command), id)
                }
                break

            case "!qualmusica":
                var typeMessage = quotedMsg ? quotedMsgObjInfo.type : type
                if(typeMessage != MessageTypes.video && typeMessage != MessageTypes.audio) return client.reply(c, chatId, erroComandoMsg(command), id)
                var messageData = quotedMsg ? quotedMsgObj : id             
                var caminhoAudio = null, caminhoVideo = null
                var bufferMessageData = await downloadMediaMessage(messageData, "buffer")
                await client.reply(c, chatId, msgs_texto.utilidades.qualmusica.espera, id)

                if(typeMessage == MessageTypes.video){
                    caminhoVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                    fs.writeFileSync(caminhoVideo, bufferMessageData)
                    try{
                        caminhoAudio = await converterMp4ParaMp3(caminhoVideo)
                        fs.unlinkSync(caminhoVideo)
                    } catch(err){
                        fs.unlinkSync(caminhoVideo)
                        client.reply(c, chatId, msgs_texto.utilidades.qualmusica.erro_conversao, id)
                        return
                    }
                }

                if(typeMessage == MessageTypes.audio){
                    caminhoAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(caminhoAudio, bufferMessageData)
                }

                try{
                    var resp = await api.obterReconhecimentoMusica(caminhoAudio)
                    fs.unlinkSync(caminhoAudio)
                    client.reply(c, chatId, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resp.titulo, resp.produtora, resp.duracao, resp.lancamento, resp.album, resp.artistas), id)
                }catch(err){
                    client.reply(c, chatId, err.message, id)
                }
                break

            case "!clima":
                if(args.length === 1) return client.reply(c, chatId, erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(7).trim(), clima = await api.obterClima(usuarioTexto)
                    var respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, clima.texto), respostaClimaFoto = clima.foto_clima
                    client.reply(c, chatId, respostaClimaTexto, id)
                } catch(err){
                    client.reply(c, chatId, err.message, id)
                }
                break

            case "!moeda":
                if(args.length !== 3) return client.reply(c, chatId, erroComandoMsg(command), id)
                try{
                    var usuarioMoedaInserida = args[1], usuarioValorInserido = args[2], conversaoMoeda = await api.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido)
                    var itens = ''
                    for(var dado of  conversaoMoeda.conversao) itens += criarTexto(msgs_texto.utilidades.moeda.resposta_item, dado.conversao, dado.valor_convertido_formatado, dado.tipo, dado.atualizacao)
                    var respostaFinal = criarTexto(msgs_texto.utilidades.moeda.resposta_completa, conversaoMoeda.valor_inserido, conversaoMoeda.moeda_inserida, itens)
                    await client.reply(c, chatId, respostaFinal ,id)
                } catch(err){
                    await client.reply(c, chatId, err.message , id)
                }
                break

            case "!pesquisa":
                if (args.length === 1) return client.reply(c, chatId, erroComandoMsg(command) , id)
                try{
                    var usuarioTexto = body.slice(10).trim(), pesquisaResultados = await api.obterPesquisaWeb(usuarioTexto)
                    var pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                    for(let resultado of pesquisaResultados){
                        pesquisaResposta += "═════════════════\n"
                        pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                    }
                    client.reply(c, chatId, pesquisaResposta, id)
                } catch(err){
                    client.reply(c, chatId, err.message, id)
                }
                break

            case '!rastreio':
                if (args.length === 1) return client.reply(c, chatId, erroComandoMsg(command), id)
                try{
                    var usuarioCodigoRastreio = body.slice(10).trim(), rastreioDados = await api.obterRastreioCorreios(usuarioCodigoRastreio)
                    var rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                    for(let dado of rastreioDados){
                        var local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                        rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                        rastreioResposta += "-----------------------------------------\n"
                    }
                    await client.reply(c, chatId, rastreioResposta, id)
                } catch(err){
                    await client.reply(c, chatId, err.message ,id)
                }
                break
            
            case "!anime":
                var dadosMensagem = {
                    tipo: (quotedMsg)? quotedMsgObjInfo.type : type,
                    mimetype: (quotedMsg)? quotedMsgObjInfo.mimetype : mimetype,
                    mensagem: (quotedMsg)? quotedMsgObj : id
                }
                if(dadosMensagem.tipo == MessageTypes.image){
                    client.reply(c, chatId,msgs_texto.utilidades.anime.espera, id)
                    var bufferImagem = await downloadMediaMessage(dadosMensagem.mensagem, "buffer")
                    var caminhoImagem = path.resolve(`temp/${obterNomeAleatorio(".jpg")}`)
                    fs.writeFileSync(caminhoImagem, bufferImagem)
                    try{
                        var animeInfo = await api.obterAnimeInfo(caminhoImagem)
                        if(animeInfo.similaridade < 87) return client.reply(c, chatId,msgs_texto.utilidades.anime.similaridade,id)
                        animeInfo.episodio = animeInfo.episodio || "---"
                        var respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, animeInfo.titulo, animeInfo.episodio, animeInfo.tempoInicial, animeInfo.tempoFinal, animeInfo.similaridade, animeInfo.link_previa)
                        await client.replyFile(c, MessageTypes.video, chatId, animeInfo.link_previa, respostaAnimeInfo, id, "video/mp4")
                        fs.unlinkSync(caminhoImagem)
                    } catch(err){
                        fs.unlinkSync(caminhoImagem)
                        client.reply(c, chatId,err.message,id)
                    }
                } else {
                    client.reply(c, chatId,erroComandoMsg(command), id)
                }

                break
            
            case "!traduz":
                var usuarioTexto = "", idiomaTraducao = 'pt'
                if(quotedMsg  && quotedMsgObjInfo.type == MessageTypes.text){
                    if(args.length === 1) return client.reply(c, chatId, erroComandoMsg(command) ,id)
                    idiomaTraducao = args[1]
                    usuarioTexto = quotedMsgObjInfo.body || quotedMsgObjInfo.caption
                } else if(!quotedMsg && type == MessageTypes.text ){
                    if(args.length < 3) return client.reply(c, chatId, erroComandoMsg(command) ,id)
                    idiomaTraducao = args[1]
                    usuarioTexto = args.slice(2).join(" ")
                } else {
                    return client.reply(c, chatId, erroComandoMsg(command) ,id)
                }
                try{
                    var respostaTraducao = await api.obterTraducao(usuarioTexto, idiomaTraducao)
                    client.reply(c, chatId, respostaTraducao, id)
                } catch(err){
                    client.reply(c, chatId, err.message, id)
                }
                break  
            
            case '!voz':
                var usuarioTexto = ''
                if (args.length === 1) {
                    return client.reply(c, chatId, erroComandoMsg(command) ,id)
                } else if(quotedMsg  && (quotedMsgObjInfo.type == MessageTypes.extendedText || quotedMsgObjInfo.type == MessageTypes.text)){
                    usuarioTexto = (args.length == 2) ? quotedMsgObjInfo.body || quotedMsgObjInfo.caption : body.slice(8).trim()
                } else {
                    usuarioTexto = body.slice(8).trim()
                }
                if (!usuarioTexto) return client.reply(c, chatId, msgs_texto.utilidades.voz.texto_vazio , id)
                if (usuarioTexto.length > 200) return client.reply(c, chatId, msgs_texto.utilidades.voz.texto_longo, id)
                var idioma = body.slice(5, 7).toLowerCase()
                try{
                    var respostaAudio = await api.textoParaVoz(idioma, usuarioTexto)
                    client.replyFile(c, MessageTypes.audio, chatId, respostaAudio, '', id, 'audio/mpeg').then(()=>{
                        fs.unlinkSync(respostaAudio)
                    })
                } catch(err){
                    fs.unlinkSync(caminhoAudio)
                    client.reply(c, chatId, err.message, id)
                }
                break

            case '!noticias':
                try{
                    var listaNoticias = await api.obterNoticias()
                    var respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                    for(let noticia of listaNoticias){
                        respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.titulo, noticia.descricao || "Sem descrição", noticia.url)
                    }
                    await client.reply(c, chatId, respostaNoticias, id)
                } catch(err){
                    await client.reply(c, chatId, err.message, id)
                }
                break;

            case '!calc':
                if(args.length === 1) return client.reply(c, chatId, erroComandoMsg(command) ,id)
                var usuarioExpressaoMatematica = body.slice(6).trim()
                try{
                    var resultadoCalculo = await api.obterCalculo(usuarioExpressaoMatematica)
                    var respostaCalc = criarTexto(msgs_texto.utilidades.calc.resposta, resultadoCalculo)
                    client.reply(c, chatId, respostaCalc, id)
                } catch(err){
                    client.reply(c, chatId, err.message, id)
                }
                break
        }
    } catch(err){
        consoleErro(err, "UTILIDADES")
    }
    

}