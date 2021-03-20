//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const menu = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const { version } = require('../package.json');
const {criarTexto, erroComandoMsg, consoleErro, obterNomeAleatorio, removerNegritoComando} = require("../lib/util")
const path = require('path')
const db = require('../lib/database')
const sticker = require("../lib/sticker")
const api = require("../lib/api")
const {converterMp4ParaMp3} = require("../lib/conversao")
const {botInfo} = require(path.resolve("lib/bot.js"))

module.exports = utilidades = async(client,message) => {
    try{
        const { type, id, from, sender, chat, isGroupMsg, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, body} = message
        const { pushname, verifiedName, formattedName } = sender, username = pushname || verifiedName || formattedName
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const ownerNumber = process.env.NUMERO_DONO.trim()

        switch(command){
            case "!info":
                const botFotoURL = await client.getProfilePicFromServer(botNumber+'@c.us')
                var infoBot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
                var resposta = criarTexto(msgs_texto.utilidades.info.resposta,infoBot.criador,infoBot.criado_em,infoBot.nome,infoBot.iniciado,infoBot.cmds_executados,ownerNumber, version)
                if(botFotoURL != undefined){
                    client.sendFileFromUrl(from, botFotoURL, "botfoto.jpg", resposta, id)
                } else {
                    client.reply(from, resposta, id)
                }
                break
            
            case "!reportar":
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) ,id)
                var usuarioMensagem = body.slice(10).trim(), resposta = criarTexto(msgs_texto.utilidades.reportar.resposta, username, sender.id.replace("@c.us",""), usuarioMensagem)
                client.sendText(ownerNumber+"@c.us", resposta)
                client.reply(from,msgs_texto.utilidades.reportar.sucesso,id)
                break
            
            case "!ddd":
                var DDD = null
                if(quotedMsg){
                    let DDI = quotedMsgObj.author.slice(0,2)
                    if(DDI != "55") return client.reply(from, msgs_texto.utilidades.ddd.somente_br ,id)
                    DDD = quotedMsgObj.author.slice(2,4)
                } else if(args.length > 1 && args[1].length == 2){
                    if(args[1].length != 2) return client.reply(from, msgs_texto.utilidades.ddd.erro_ddd ,id)
                    DDD = args[1]
                } else {
                    return client.reply(from, erroComandoMsg(command), id)
                }
                try{
                    var resposta = await api.obterInfoDDD(DDD)
                    client.reply(from,resposta,id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break

            case "!audio":
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                var efeitosSuportados = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], tipoEfeito = body.slice(7).trim()
                if(!efeitosSuportados.includes(tipoEfeito)) return client.reply(from, erroComandoMsg(command), id)
                if(quotedMsg && (quotedMsg.type === "ptt" || quotedMsg.type === "audio") ){
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    var audioOriginal = path.resolve(`./media/audios/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(audioOriginal, mediaData, "base64")
                    try{
                        var audioEditado = await api.obterAudioModificado(audioOriginal, tipoEfeito)
                        client.sendFile(from, audioEditado, "audio.mp3","", id).then(()=>{
                            fs.unlinkSync(audioEditado)
                            fs.unlinkSync(audioOriginal)
                        })
                    } catch(err){
                        fs.unlinkSync(audioOriginal)
                        client.reply(from, err.message, id)
                    }
                } else {
                    client.reply(from, erroComandoMsg(command), id)
                }
                break

            case "!qualmusica":
                var dadosMensagem = quotedMsg ? quotedMsg : message
                if(dadosMensagem.mimetype != "video/mp4" && dadosMensagem.type != "audio" && dadosMensagem.type != "ptt") return client.reply(from, erroComandoMsg(command), id)
                var caminhoAudio = null, caminhoVideo = null
                var mediaData = await decryptMedia(dadosMensagem, uaOverride)
                await client.reply(from, msgs_texto.utilidades.qualmusica.espera, id)
                if(dadosMensagem.mimetype == "video/mp4"){
                    caminhoVideo = path.resolve(`media/videos/${obterNomeAleatorio(".mp4")}`)
                    fs.writeFileSync(caminhoVideo, mediaData, "base64")
                    try{
                        caminhoAudio = await converterMp4ParaMp3(caminhoVideo)
                        fs.unlinkSync(caminhoVideo)
                    }catch(err){
                        fs.unlinkSync(caminhoVideo)
                        client.reply(from, msgs_texto.utilidades.qualmusica.erro_conversao, id)
                    }
                }
                if(dadosMensagem.type == "audio" || dadosMensagem.type == "ptt"){
                    caminhoAudio = path.resolve(`media/audios/${obterNomeAleatorio(".mp3")}`)
                    fs.writeFileSync(caminhoAudio, mediaData, "base64");
                }
                try{
                    var resp = await api.obterReconhecimentoMusica(caminhoAudio)
                    fs.unlinkSync(caminhoAudio)
                    client.reply(from, criarTexto(msgs_texto.utilidades.qualmusica.resposta, resp.titulo, resp.produtora, resp.duracao, resp.lancamento, resp.album, resp.artistas), id)
                }catch(err){
                    client.reply(from, err.message, id)
                }
                break

            case "!clima":
                if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(7).trim(), clima = await api.obterClima(usuarioTexto)
                    var respostaClimaTexto = criarTexto(msgs_texto.utilidades.clima.resposta, clima.texto), respostaClimaFoto = clima.foto_clima
                    client.sendFileFromUrl(from, respostaClimaFoto,`${body.slice(7)}.png`, respostaClimaTexto, id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break

            case "!moeda":
                if(args.length !== 3) return client.reply(from, erroComandoMsg(command), id)
                try{
                    var usuarioMoedaInserida = args[1], usuarioValorInserido = args[2], conversaoMoeda = await api.obterConversaoMoeda(usuarioMoedaInserida, usuarioValorInserido)
                    var respostaConversao = criarTexto(msgs_texto.utilidades.moeda.resposta, conversaoMoeda.valor_inserido, conversaoMoeda.moeda, conversaoMoeda.valor_em_real, conversaoMoeda.atualizado)
                    client.reply(from, respostaConversao ,id)
                } catch(err){
                    client.reply(from, err.message , id)
                }
                break

            case "!pesquisa":
                if (args.length === 1) return client.reply(from, erroComandoMsg(command) , id)
                try{
                    var usuarioTexto = body.slice(10).trim(), pesquisaResultados = await api.obterPesquisaWeb(usuarioTexto)
                    var pesquisaResposta = criarTexto(msgs_texto.utilidades.pesquisa.resposta_titulo, usuarioTexto)
                    for(let resultado of pesquisaResultados){
                        pesquisaResposta += "═════════════════\n"
                        pesquisaResposta += criarTexto(msgs_texto.utilidades.pesquisa.resposta_itens, resultado.titulo, resultado.link, resultado.descricao)
                    }
                    client.reply(from, pesquisaResposta, id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break

            case '!rastreio':
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                try{
                    var usuarioCodigoRastreio = body.slice(10).trim(), rastreioDados = await api.obterRastreioCorreios(usuarioCodigoRastreio)
                    var rastreioResposta = msgs_texto.utilidades.rastreio.resposta_titulo
                    for(let dado of rastreioResposta){
                        var local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                        rastreioResposta += criarTexto(msgs_texto.utilidades.rastreio.resposta_itens, dado.status, dado.data, dado.hora, local)
                        rastreioResposta += "-----------------------------------------\n"
                    }
                    client.reply(from, rastreioResposta, id)
                } catch(err){
                    client.reply(from, err.message ,id)
                }
                break
            
            case "!play":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(6).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return client.reply(from, msgs_texto.utilidades.play.nao_encontrado, id)
                    if(videoInfo.duration > 300000) return client.reply(from, msgs_texto.utilidades.play.limite, id)
                    var mensagemEspera = criarTexto(msgs_texto.utilidades.play.espera, videoInfo.title, videoInfo.durationFormatted)
                    client.reply(from, mensagemEspera, id)      
                } catch(err){
                    return client.reply(from,err.message,id)
                }

                try{
                    var saidaAudio = await api.obterYTMp3(videoInfo)
                    client.sendFile(from, saidaAudio, "musica.mp3","", id).then(()=>{
                        fs.unlinkSync(saidaAudio)
                    })
                } catch(err){
                    client.reply(from,err.message,id)
                }
                break
            
            case "!yt":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(4).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return client.reply(from,msgs_texto.utilidades.yt.nao_encontrado,id)
                    if(videoInfo.duration > 300000) return client.reply(from,msgs_texto.utilidades.yt.limite,id)
                    var mensagemEspera = criarTexto(msgs_texto.utilidades.yt.espera, videoInfo.title, videoInfo.durationFormatted)
                    client.reply(from, mensagemEspera, id)
                } catch(err){
                    return client.reply(from,err.message,id)
                }

                try{
                    var saidaVideoInfo = await api.obterYTMp4URL(videoInfo)
                    client.sendFile(from, saidaVideoInfo.download, `${saidaVideoInfo.title}.mp4`,"", id)
                } catch(err){
                    client.reply(from,err.message,id)
                }
                break

            case "!ig":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                await client.reply(from, msgs_texto.utilidades.ig.espera, id)
                try{
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaInstagram(usuarioTexto)
                    if(resultadosMidia.results_number == 0) return client.reply(from, msgs_texto.utilidades.ig.nao_encontrado, id)
                    if(resultadosMidia.results_number == 1){
                        await client.sendFile(from, resultadosMidia.url_list[0], `ig-media`,"",id)
                    } else {
                        for(let url of resultadosMidia.url_list){
                            await client.sendFile(from, url, `ig-media`,"")
                        }
                    }
                } catch(err){
                    client.reply(from,err.message,id)
                }
                break

            case "!fb":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                await client.reply(from, msgs_texto.utilidades.fb.espera, id)
                try{
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaFacebook(usuarioTexto)
                    if(!resultadosMidia.encontrado) return client.reply(from, msgs_texto.utilidades.fb.nao_encontrado, id)
                    if(resultadosMidia.duracao > 180) return client.reply(from, msgs_texto.utilidades.fb.limite, id)
                    await client.sendFile(from, resultadosMidia.url, `fb-media.mp4`,"",id)
                } catch(err){
                    client.reply(from,err.message,id)
                }    
                break

            case "!tw":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                await client.reply(from,msgs_texto.utilidades.tw.espera,id)
                try{
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaTwitter(usuarioTexto)
                    if(!resultadosMidia.found) return client.reply(from, msgs_texto.utilidades.tw.nao_encontrado, id)
                    if(resultadosMidia.type == "video"){
                        client.sendFile(from, resultadosMidia.download[0].url, `twittervid.mp4`,"", id)
                    } else {
                        client.sendFile(from, resultadosMidia.download, `twitterimg.jpg`,"", id)
                    }
                } catch(err){
                    client.reply(from,err.message,id)
                }
                break
            
            case '!img':
                if(quotedMsg || type != "chat") return client.reply(from, erroComandoMsg(command) , id)
                var usuarioQuantidadeFotos = args[1], qtdFotos = 1, textoPesquisa = ""
                if(!isNaN(usuarioQuantidadeFotos)){
                    if(usuarioQuantidadeFotos > 0 && usuarioQuantidadeFotos <= 5) {
                        qtdFotos = usuarioQuantidadeFotos
                        textoPesquisa = args.slice(2).join(" ").trim()
                    } else {
                        return client.reply(from, msgs_texto.utilidades.img.qtd_imagem , id)
                    }
                } else {
                    textoPesquisa = body.slice(5).trim()
                }
                if (!textoPesquisa) return client.reply(from, erroComandoMsg(command), id)
                if (textoPesquisa.length > 120) return client.reply(from, msgs_texto.utilidades.img.tema_longo , id)
                try{
                    var resultadosImagens = await api.obterImagens(textoPesquisa, qtdFotos)
                    for(let imagem of resultadosImagens){
                        client.sendFileFromUrl(from, imagem , "foto.jpg" , "", (qtdFotos == 1) ? id : "").catch(()=>{
                            client.sendText(from, msgs_texto.utilidades.img.erro_imagem)
                        })
                    }
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break
            
            case '!meusdados':
                var dadosUsuario = await db.obterUsuario(sender.id), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia ||  "Sem limite" 
                switch(tipoUsuario) {
                    case "dono":
                        tipoUsuario = "🤖 Dono"
                        break
                    case "vip":
                        tipoUsuario = "⭐ VIP"
                        break
                    case "comum":
                        tipoUsuario = "👤 Comum"
                        break    
                }
                var nomeUsuario = username , resposta = criarTexto(msgs_texto.utilidades.meusdados.resposta_geral, tipoUsuario, nomeUsuario, dadosUsuario.comandos_total)
                if(botInfo().limite_diario.status) resposta += criarTexto(msgs_texto.utilidades.meusdados.resposta_limite_diario, dadosUsuario.comandos_dia, maxComandosDia, maxComandosDia)
                if(isGroupMsg){
                    var dadosGrupo = await db.obterGrupo(groupId)
                    if(dadosGrupo.contador.status){
                        var usuarioAtividade = await db.obterAtividade(groupId,sender.id)
                        resposta += criarTexto(msgs_texto.utilidades.meusdados.resposta_grupo, usuarioAtividade.msg)
                    }   
                }
                client.reply(from, resposta, id)
                break
            
            case '!menu':
            case '!ajuda': 
                var dadosUsuario = await db.obterUsuario(sender.id), tipoUsuario = dadosUsuario.tipo, maxComandosDia = dadosUsuario.max_comandos_dia || "Sem limite" 
                switch(tipoUsuario) {
                    case "dono":
                        tipoUsuario = "🤖 Dono"
                        break
                    case "vip":
                        tipoUsuario = "⭐ VIP"
                        break
                    case "comum":
                        tipoUsuario= "👤 Comum"
                        break     
                }
                var dadosResposta = '', nomeUsuario = username
                if(botInfo().limite_diario.status){
                    dadosResposta = criarTexto(msgs_texto.utilidades.ajuda.resposta_limite_diario, nomeUsuario, dadosUsuario.comandos_dia, maxComandosDia, tipoUsuario)
                } else {
                    dadosResposta = criarTexto(msgs_texto.utilidades.ajuda.resposta_comum, nomeUsuario, tipoUsuario)
                }
                dadosResposta += `═════════════════\n`

                if(args.length == 1){
                    var menuResposta = menu.menuPrincipal()
                    client.sendText(from, dadosResposta+menuResposta)
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
                            else return client.reply(from, msgs_texto.permissao.grupo, id)
                            break
                        case "5":
                            menuResposta = menu.menuDiversao(isGroupMsg)
                            break
                        case "6":
                            menuResposta = menu.menuCreditos()
                            break
                    }
                    client.sendText(from, dadosResposta+menuResposta)
                }
                break

            case '!s':
                if(isMedia || quotedMsg){
                    var dadosMensagem = {
                        tipo : (isMedia) ? type : quotedMsg.type,
                        mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if(dadosMensagem.tipo === "image"){
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var imagemBase64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        client.sendImageAsSticker(from, imagemBase64,{author: "LBOT", pack: "LBOT Stickers", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                            consoleErro(err.message, "STICKER")
                            client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                        })
                    } else {
                        return client.reply(from, erroComandoMsg(command) , id)
                    }
                } else {
                    return client.reply(from, erroComandoMsg(command) , id)
                }
                break
            
            case '!simg':
                if(quotedMsg && quotedMsg.type == "sticker"){
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    var imagemBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendFile(from,imagemBase64,"sticker.jpg","",quotedMsgObj.id)
                } else {
                    client.reply(from, erroComandoMsg(command), id)
                }
                break

            case '!sgif':
                if(isMedia || quotedMsg){
                    var dadosMensagem = {
                        mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                        duracao: (isMedia)? message.duration : quotedMsg.duration,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if((dadosMensagem.mimetype === 'video/mp4' || dadosMensagem.mimetype === 'image/gif') && dadosMensagem.duracao < 11){
                        client.reply(from, msgs_texto.geral.espera , id)
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var base64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        client.sendMp4AsSticker(from, base64, {endTime: "00:00:11.0", fps:9, square:240}, {author: "LBOT", pack: "LBOT Sticker Animado", keepScale: false, discord: "701084178112053288"})
                        .catch((err)=>{
                            consoleErro(err.message, "STICKER-GIF")
                            client.reply(from, msgs_texto.utilidades.sticker.erro_sgif , id)
                        })
                    } else {
                        return client.reply(from, msgs_texto.utilidades.sticker.video_invalido, id)
                    }
                } else {
                    return client.reply(from, msgs_texto.geral.erro, id)
                }
                break

            case "!tps":
                if(args.length == 1 || type != "chat") return client.reply(from,erroComandoMsg(command),id)
                var usuarioTexto = body.slice(5).trim()
                if(usuarioTexto.length > 40) return client.reply(from,msgs_texto.utilidades.tps.texto_longo,id)
                await client.reply(from, msgs_texto.utilidades.tps.espera,id)
                try{
                    var imagemBase64 = await sticker.textoParaFoto(usuarioTexto)
                    client.sendImageAsSticker(from, imagemBase64, {author: "LBOT", pack: "LBOT Sticker Textos", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                        consoleErro(err.message, "STICKER-TPS")
                        client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                    })
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break
            
            case '!ssf':
                if(isMedia || quotedMsg){
                    var dadosMensagem = {
                        tipo: (isMedia)? type : quotedMsg.type,
                        mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if(dadosMensagem.tipo === "image"){
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var usuarioImgBase64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        try{
                            var saidaImgBase64 = await sticker.removerFundoImagem(usuarioImgBase64, dadosMensagem.mimetype)
                            client.sendImageAsSticker(from, saidaImgBase64, {author: "LBOT", pack: "LBOT Sticker Sem Fundo", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                                consoleErro(err.message, "STICKER-SSF")
                                client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                            })
                        } catch(err){
                            client.reply(from, err.message, id)
                        }
                    } else {
                        client.reply(from, msgs_texto.utilidades.sticker.ssf_imagem, id)
                    }
                } else {
                    client.reply(from, erroComandoMsg(command), id)
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
                        client.reply(from,msgs_texto.utilidades.anime.espera, id)
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var usuarioImgBase64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        try{
                            var animeInfo = await api.obterAnimeInfo(usuarioImgBase64)
                            if(animeInfo.similaridade < 87) return client.reply(from,msgs_texto.utilidades.anime.similaridade,id)
                            animeInfo.episodio = animeInfo.episodio || "---"
                            var respostaAnimeInfo = criarTexto(msgs_texto.utilidades.anime.resposta, animeInfo.titulo, animeInfo.episodio, animeInfo.tempoInicial, animeInfo.tempoFinal, animeInfo.similaridade)
                            client.sendFileFromUrl(from, animeInfo.link_previa, "anime.mp4", respostaAnimeInfo, id)
                        } catch(err){
                            client.reply(from,err.message,id)
                        }
                    } else {
                        client.reply(from,erroComandoMsg(command), id)
                    }
                } else {
                    client.reply(from,erroComandoMsg(command), id)
                }
                break

            case "!animelanc":
                try{
                    var resultadosAnimes = await api.obterAnimesLancamentos()
                    var respostaLancamentos = msgs_texto.utilidades.animelanc.resposta_titulo
                    for(let anime of resultadosAnimes){
                        respostaLancamentos += criarTexto(msgs_texto.utilidades.animelanc.resposta_itens, anime.titulo, anime.episodio, anime.url)
                    }
                    client.reply(from, respostaLancamentos, id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break
            
            case "!traduz":
                var usuarioTexto = ""
                if(quotedMsg  && quotedMsg.type == "chat"){
                    usuarioTexto = quotedMsg.body
                } else if(!quotedMsg && type == "chat" ){
                    if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                    usuarioTexto = body.slice(8).trim()
                } else {
                    return client.reply(from, erroComandoMsg(command) ,id)
                }

                try{
                    var respostaTraducao = await api.obterTraducao(usuarioTexto)
                    client.reply(from, respostaTraducao, id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break  
            
            case '!voz':
                var usuarioTexto = '', idMensagem = id
                if (args.length === 1) {
                    return client.reply(from, erroComandoMsg(command) ,id)
                } else if(quotedMsg  && quotedMsg.type == 'chat'){
                    usuarioTexto = (args.length == 2) ? quotedMsg.body : body.slice(8).trim()
                } else {
                    usuarioTexto = body.slice(8).trim()
                }
                if (!usuarioTexto) return client.reply(from, msgs_texto.utilidades.voz.texto_vazio , id)
                if (usuarioTexto.length > 200) return client.reply(from, msgs_texto.utilidades.voz.texto_longo, id)
                if(quotedMsg) idMensagem = quotedMsgObj.id
                var idioma = body.slice(5, 7).toLowerCase()
                try{
                    var respostaAudio = await api.textoParaVoz(idioma, usuarioTexto)
                    client.sendPtt(from, respostaAudio, idMensagem)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break

            case '!noticias':
                try{
                    var listaNoticias = await api.obterNoticias()
                    var respostaNoticias = msgs_texto.utilidades.noticia.resposta_titulo
                    for(let noticia of listaNoticias){
                        respostaNoticias += criarTexto(msgs_texto.utilidades.noticia.resposta_itens, noticia.title)
                    }
                    client.reply(from, respostaNoticias, id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break;

            case '!calc':
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                var usuarioExpressaoMatematica = body.slice(6).trim()
                try{
                    var resultadoCalculo = await api.obterCalculo(usuarioExpressaoMatematica)
                    var respostaCalc = criarTexto(msgs_texto.utilidades.calc.resposta, resultadoCalculo)
                    client.reply(from, respostaCalc, id)
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break
        }
    } catch(err){
        throw err
    }
    

}