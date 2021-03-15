//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const {helpMenu} = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const {makeText, errorCommandMsg, consoleError, getRandomName} = require("../lib/util")
const path = require('path')
const db = require('../lib/database')
const sticker = require("../lib/sticker")
const api = require("../lib/api")
const {convertMp4ToMp3} = require("../lib/conversion")
const {botInfo} = require(path.resolve("lib/bot.js"))

module.exports = utilidades = async(client,message) => {
    try{
        const { type, id, from, sender, chat, isGroupMsg, caption, isMedia, mimetype, quotedMsg, quotedMsgObj} = message
        let { body } = message
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const ownerNumber = process.env.NUMERO_DONO.trim()
        switch(command){
            
        //################## UTILIDADES ########################
        case "!info":
            const botPictureUrl = await client.getProfilePicFromServer(botNumber+'@c.us')
            var infoBot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
            var response = makeText(msgs_texto.utilidades.info.resposta,infoBot.criador,infoBot.criado_em,infoBot.nome,infoBot.iniciado,infoBot.cmds_executados,ownerNumber,process.env.npm_package_version)
            if(botPictureUrl != undefined){
                client.sendFileFromUrl(from, botPictureUrl, "botpicture.jpg", response, id)
            } else {
                client.reply(from, response, id)
            }
            break
        
        case "!reportar":
            if(args.length == 1) return client.reply(from, errorCommandMsg(command) ,id)
            var userInputText = body.slice(10).trim(), response = makeText(msgs_texto.utilidades.reportar.resposta,pushname,sender.id.replace("@c.us",""), userInputText)
            client.sendText(ownerNumber+"@c.us", response)
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
                return client.reply(from, errorCommandMsg(command), id)
            }
            try{
                var resp = await api.getDataDDD(DDD)
                client.reply(from,resp,id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break

        case "!audio":
            if(args.length === 1) return client.reply(from, errorCommandMsg(command), id)
            var supportedEffects = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume'], typeEffect = body.slice(7).trim()
            if(!supportedEffects.includes(typeEffect)) return client.reply(from, errorCommandMsg(command), id)
            if(quotedMsg && (quotedMsg.type === "ptt" || quotedMsg.type === "audio") ){
                var mediaData = await decryptMedia(quotedMsg, uaOverride)
                let inputAudioPath = path.resolve(`./media/audios/${getRandomName(".mp3")}`)
                fs.writeFileSync(inputAudioPath, mediaData, "base64")
                try{
                    var outputAudioPath = await api.getModifiedAudio(inputAudioPath, typeEffect)
                    client.sendFile(from, outputAudioPath, "audio.mp3","", id).then(()=>{
                        fs.unlinkSync(outputAudioPath)
                        fs.unlinkSync(inputAudioPath)
                    })
                } catch(err){
                    fs.unlinkSync(inputAudioPath)
                    client.reply(from, err.message, id)
                }
            } else {
                client.reply(from, errorCommandMsg(command), id)
            }
            break

        case "!qualmusica":
            var messageData = quotedMsg ? quotedMsg : message
            if(messageData.mimetype != "video/mp4" && messageData.type != "audio" && messageData.type != "ptt") return client.reply(from, errorCommandMsg(command), id)
            var audioPath = null, videoPath = null
            var mediaData = await decryptMedia(messageData, uaOverride)
            await client.reply(from, msgs_texto.utilidades.qualmusica.espera, id)
            if(messageData.mimetype == "video/mp4"){
                videoPath = path.resolve(`media/videos/${getRandomName(".mp4")}`)
                fs.writeFileSync(videoPath, mediaData, "base64")
                try{
                    audioPath = await convertMp4ToMp3(videoPath)
                    fs.unlinkSync(videoPath)
                }catch(err){
                    fs.unlinkSync(videoPath)
                    client.reply(from, msgs_texto.utilidades.qualmusica.erro_conversao, id)
                }
            }
            if(messageData.type == "audio" || messageData.type == "ptt"){
                audioPath = path.resolve(`media/audios/${getRandomName(".mp3")}`)
                fs.writeFileSync(audioPath, mediaData, "base64");
            }
            try{
                var resp = await api.getMusicRecognition(audioPath)
                fs.unlinkSync(audioPath)
                client.reply(from, makeText(msgs_texto.utilidades.qualmusica.resposta, resp.title, resp.productor, resp.duration, resp.release, resp.album, resp.artists), id)
            }catch(err){
                client.reply(from, err.message, id)
            }
            break

        case "!clima":
            if(args.length === 1) return client.reply(from, errorCommandMsg(command),id)
            try{
                var userInputQuery = body.slice(7).trim(), weather = await api.getWeather(userInputQuery)
                var weatherText = makeText(msgs_texto.utilidades.clima.resposta, weather.text)
                client.sendFileFromUrl(from,weather.pic_weather,`${body.slice(7)}.png`, weatherText, id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break

        case "!moeda":
            if(args.length !== 3) return client.reply(from, errorCommandMsg(command), id)
            try{
                var userInputCurrency = args[1], userInputValue = args[2], currencyConversion = await api.getCurrencyConversion(userInputCurrency, userInputValue)
                var currencyResponse = makeText(msgs_texto.utilidades.moeda.resposta, currencyConversion.inserted_value, currencyConversion.currency, currencyConversion.value_in_real, currencyConversion.updated)
                client.reply(from, currencyResponse ,id)
            } catch(err){
                client.reply(from, err.message , id)
            }
            break

        case "!pesquisa":
            if (args.length === 1) return client.reply(from, errorCommandMsg(command) , id)
            try{
                var userInputQuery = body.slice(10).trim(), searchResults = await api.getWebSearch(userInputQuery)
                var searchResponse = makeText(msgs_texto.utilidades.pesquisa.resposta_titulo, userInputQuery)
                for(let result of searchResults){
                    searchResponse += "═════════════════\n"
                    searchResponse += makeText(msgs_texto.utilidades.pesquisa.resposta_itens, result.title, result.link, result.description)
                }
                client.reply(from, searchResponse, id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break

        case '!rastreio':
            if (args.length === 1) return client.reply(from, errorCommandMsg(command), id)
            try{
                var inputUserCode = body.slice(10).trim(), trackingData = await api.getTrackingCorreios(inputUserCode)
                var trackingResponse = msgs_texto.utilidades.rastreio.resposta_titulo
                for(let data of trackingData){
                    var localeData = (data.local != undefined) ?  `Local : ${data.local}` : `Origem : ${data.origem}\nDestino : ${data.destino}`
                    trackingResponse += makeText(msgs_texto.utilidades.rastreio.resposta_itens, data.status, data.data, data.hora, localeData)
                    trackingResponse += "-----------------------------------------\n"
                }
                client.reply(from, trackingResponse, id)
            } catch(err){
                client.reply(from, err.message ,id)
            }
            break
        
        case "!play":
            if(args.length === 1) return client.reply(from,errorCommandMsg(command),id)
            try{
                var userInput = body.slice(6).trim(), videoInfo = await api.getInfoVideo(userInput)
                if(videoInfo == null) return client.reply(from, msgs_texto.utilidades.play.nao_encontrado, id)
                if(videoInfo.duration > 300000) return client.reply(from, msgs_texto.utilidades.play.limite, id)
                var waitMessage = makeText(msgs_texto.utilidades.play.espera, videoInfo.title, videoInfo.durationFormatted)
                client.reply(from, waitMessage, id)      
            } catch(err){
                return client.reply(from,err.message,id)
            }

            try{
                var outputAudio = await api.getYtMp3(videoInfo)
                client.sendFile(from, outputAudio, "music.mp3","", id).then(()=>{
                    fs.unlinkSync(outputAudio)
                })
            } catch(err){
                client.reply(from,err.message,id)
            }
            break
        
        case "!yt":
            if(args.length === 1) return client.reply(from,errorCommandMsg(command),id)
            try{
                var userInput = body.slice(4).trim(), videoInfo = await api.getInfoVideo(userInput)
                if(videoInfo == null) return client.reply(from,msgs_texto.utilidades.yt.nao_encontrado,id)
                if(videoInfo.duration > 300000) return client.reply(from,msgs_texto.utilidades.yt.limite,id)
                var waitMessage = makeText(msgs_texto.utilidades.yt.espera, videoInfo.title, videoInfo.durationFormatted)
                client.reply(from, waitMessage, id)
            } catch(err){
                return client.reply(from,err.message,id)
            }

            try{
                var outputVideo = await api.getYtMp4Url(videoInfo)
                client.sendFile(from, outputVideo.download, `${outputVideo.title}.mp4`,"", id)
            } catch(err){
                client.reply(from,err.message,id)
            }
            break

        case "!ig":
            if(args.length === 1) return client.reply(from,errorCommandMsg(command),id)
            await client.reply(from, msgs_texto.utilidades.ig.espera, id)
            try{
                var userInputURL = body.slice(4).trim(), mediaResults = await api.getMediaInstagram(userInputURL)
                if(mediaResults.results_number == 0) return client.reply(from, msgs_texto.utilidades.ig.nao_encontrado, id)
                if(mediaResults.results_number == 1){
                    await client.sendFile(from, mediaResults.url_list[0], `ig-media`,"",id)
                } else {
                    for(let url of mediaResults.url_list){
                        await client.sendFile(from, url, `ig-media`,"")
                    }
                }
            } catch(err){
                client.reply(from,err.message,id)
            }
            break

        case "!fb":
            if(args.length === 1) return client.reply(from,errorCommandMsg(command),id)
            await client.reply(from, msgs_texto.utilidades.fb.espera, id)
            try{
                var userInputURL = body.slice(4).trim(), mediaResults = await api.getMediaFacebook(userInputURL)
                if(!mediaResults.found) return client.reply(from, msgs_texto.utilidades.fb.nao_encontrado, id)
                if(mediaResults.duration > 180) return client.reply(from, msgs_texto.utilidades.fb.limite, id)
                await client.sendFile(from, mediaResults.url, `fb-media.mp4`,"",id)
            } catch(err){
                client.reply(from,err.message,id)
            }    
            break

        case "!tw":
            if(args.length === 1) return client.reply(from,errorCommandMsg(command),id)
            await client.reply(from,msgs_texto.utilidades.tw.espera,id)
            try{
                var userInputURL = body.slice(4).trim(), mediaResults = await api.getMediaTwitter(userInputURL)
                if(!mediaResults.found) return client.reply(from, msgs_texto.utilidades.tw.nao_encontrado, id)
                if(mediaResults.type == "video"){
                    client.sendFile(from, mediaResults.download[0].url, `twittervid.mp4`,"", id)
                } else {
                    client.sendFile(from, mediaResults.download, `twitterimg.jpg`,"", id)
                }
            } catch(err){
                client.reply(from,err.message,id)
            }
            break
        
        case '!img':
            if(quotedMsg || type != "chat") return client.reply(from, errorCommandMsg(command) , id)
            var userInputPicsNumber = args[1], picsNumber = 1, querySearch = ""
            if(!isNaN(userInputPicsNumber)){
                if(userInputPicsNumber > 0 && userInputPicsNumber <= 5) {
                    picsNumber = userInputPicsNumber
                    querySearch = args.slice(2).join(" ").trim()
                } else {
                    return client.reply(from, msgs_texto.utilidades.img.qtd_imagem , id)
                }
            } else {
                querySearch = body.slice(5).trim()
            }
            if (!querySearch) return client.reply(from, errorCommandMsg(command), id)
            if (querySearch.length > 120) return client.reply(from, msgs_texto.utilidades.img.tema_longo , id)
            try{
                var imageResults = await api.getImages(querySearch, picsNumber)
                for(let image of imageResults){
                    client.sendFileFromUrl(from, image , "picture.jpg" , "", (picsNumber == 1) ? id : "").catch(()=>{
                        client.sendText(from, msgs_texto.utilidades.img.erro_imagem)
                    })
                }
            } catch(err){
                client.reply(from, err.message, id)
            }
            break
        
        case '!meusdados':
            var userData = await db.obterUsuario(sender.id), typeUser = userData.tipo, maxCommandsDay = userData.max_comandos_dia ||  "Sem limite" 
            switch(typeUser) {
                case "dono":
                    typeUser = "🤖 Dono"
                    break
                case "vip":
                    typeUser = "⭐ VIP"
                    break
                case "comum":
                    typeUser = "👤 Comum"
                    break    
            }
            var username = pushname || `Ainda não obtido`, response = makeText(msgs_texto.utilidades.meusdados.resposta_geral, typeUser, username, userData.comandos_total)
            if(botInfo().limite_diario.status) response += makeText(msgs_texto.utilidades.meusdados.resposta_limite_diario, userData.comandos_dia, maxCommandsDay, maxCommandsDay)
            if(isGroupMsg){
                var groupData = await db.obterGrupo(groupId)
                if(groupData.contador.status){
                    var userGroupActivity = await db.obterAtividade(groupId,sender.id)
                    response += makeText(msgs_texto.utilidades.meusdados.resposta_grupo, userGroupActivity.msg)
                }   
            }
            client.reply(from, response, id)
            break

        case "!help": case "!menu": case ".menu": case ".help":
        case '!ajuda': 
            var userData = await db.obterUsuario(sender.id), typeUser = userData.tipo, maxCommandsDay = userData.max_comandos_dia || "Sem limite" 
            switch(typeUser) {
                case "dono":
                    typeUser = "🤖 Dono"
                    break
                case "vip":
                    typeUser = "⭐ VIP"
                    break
                case "comum":
                    typeUser= "👤 Comum"
                    break     
            }
            var responseData = '', username = pushname || "Ainda não obtido"
            if(botInfo().limite_diario.status){
                responseData = makeText(msgs_texto.utilidades.ajuda.resposta_limite_diario, username, userData.comandos_dia, maxCommandsDay, typeUser)
            } else {
                responseData = makeText(msgs_texto.utilidades.ajuda.resposta_comum, username, typeUser)
            }
            responseData += `═════════════════\n`
            var responseMenu = helpMenu(isGroupAdmins,isGroupMsg)
            client.sendText(from, responseData+responseMenu)
            break

        case '!s':
            if(isMedia || quotedMsg){
                var messageData = {
                    type : (isMedia) ? type : quotedMsg.type,
                    mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                    message: (isMedia)? message : quotedMsg
                }
                if(messageData.type === "image"){
                    var mediaData = await decryptMedia(messageData.message, uaOverride)
                    var imageBase64 = `data:${messageData.mimetype};base64,${mediaData.toString('base64')}`
                    client.sendImageAsSticker(from, imageBase64,{author: "LBOT", pack: "LBOT Stickers", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                        consoleError(err.message, "STICKER")
                        client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                    })
                } else {
                    return client.reply(from, errorCommandMsg(command) , id)
                }
            } else {
                return client.reply(from, errorCommandMsg(command) , id)
            }
            break
        
        case '!simg':
            if(quotedMsg && quotedMsg.type == "sticker"){
                var mediaData = await decryptMedia(quotedMsg, uaOverride)
                var imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendFile(from,imageBase64,"sticker.jpg","",quotedMsgObj.id)
            } else {
                client.reply(from, errorCommandMsg(command), id)
            }
            break

        case '!sgif':
            if(isMedia || quotedMsg){
                var messageData = {
                    mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                    duration: (isMedia)? message.duration : quotedMsg.duration,
                    message: (isMedia)? message : quotedMsg
                }
                if((messageData.mimetype === 'video/mp4' || messageData.mimetype === 'image/gif') && messageData.duration < 10){
                    client.reply(from, msgs_texto.geral.espera , id)
                    var mediaData = await decryptMedia(messageData.message, uaOverride)
                    var base64 = `data:${messageData.mimetype};base64,${mediaData.toString('base64')}`
                    client.sendMp4AsSticker(from, base64, {endTime: "00:00:10.0", fps:9, square:300}, {author: "LBOT", pack: "LBOT Sticker Animado", keepScale: false, discord: "701084178112053288"})
                    .catch((err)=>{
                        consoleError(err.message, "STICKER-GIF")
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
            if(args.length == 1 || type != "chat") return client.reply(from,errorCommandMsg(command),id)
            var userInputText = body.slice(5).trim()
            if(userInputText.length > 40) return client.reply(from,msgs_texto.utilidades.tps.texto_longo,id)
            await client.reply(from, msgs_texto.utilidades.tps.espera,id)
            try{
                var imageBase64 = await sticker.textToPicture(userInputText)
                client.sendImageAsSticker(from, imageBase64, {author: "LBOT", pack: "LBOT Sticker Textos", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                    consoleError(err.message, "STICKER-TPS")
                    client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                })
            } catch(err){
                client.reply(from, err.message, id)
            }
            break
        
        case '!ssf':
            if(isMedia || quotedMsg){
                var messageData = {
                    type: (isMedia)? type : quotedMsg.type,
                    mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                    message: (isMedia)? message : quotedMsg
                }
                if(messageData.type === "image"){
                    var mediaData = await decryptMedia(msgDataSsf.mensagem, uaOverride)
                    var inputImageBase64 = `data:${messageData.mimetype};base64,${mediaData.toString('base64')}`
                    try{
                        var outputImageBase64 = await sticker.imageRemoveBackground(inputImageBase64, messageData.type)
                        client.sendImageAsSticker(from, outputImageBase64, {author: "LBOT", pack: "LBOT Sticker Sem Fundo", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                            consoleError(err.message, "STICKER-SSF")
                            client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                        })
                    } catch(err){
                        client.reply(from, err.message, id)
                    }
                } else {
                    client.reply(from, msgs_texto.utilidades.sticker.ssf_imagem, id)
                }
            } else {
                client.reply(from, errorCommandMsg(command), id)
            }
            break

        case "!anime":
            if(isMedia || quotedMsg){
                var messageData = {
                    type: (isMedia)? type : quotedMsg.type,
                    mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                    message: (isMedia)? message : quotedMsg
                }
                if(messageData.type === "image"){
                    client.reply(from,msgs_texto.utilidades.anime.espera, id)
                    var mediaData = await decryptMedia(messageData.message, uaOverride)
                    var inputImageBase64 = `data:${messageData.mimetype};base64,${mediaData.toString('base64')}`
                    try{
                        var animeInfo = await api.getAnime(inputImageBase64)
                        if(animeInfo.similarity < 87) return client.reply(from,msgs_texto.utilidades.anime.similaridade,id)
                        animeInfo.episode = animeInfo.episode || "---"
                        var animeResponse = makeText(msgs_texto.utilidades.anime.resposta, animeInfo.title, animeInfo.episode, animeInfo.startTime, animeInfo.endTime, animeInfo.similarity)
                        client.sendFileFromUrl(from, animeInfo.link_preview, "anime.mp4", animeResponse, id)
                    } catch(err){
                        client.reply(from,err.message,id)
                    }
                } else {
                    client.reply(from,errorCommandMsg(command), id)
                }
            } else {
                client.reply(from,errorCommandMsg(command), id)
            }
            break

        case "!animelanc":
            try{
                var animeResults = await api.getAnimeReleases()
                var responseReleases = msgs_texto.utilidades.animelanc.resposta_titulo
                for(let anime of animeResults){
                    responseReleases += makeText(msgs_texto.utilidades.animelanc.resposta_itens, anime.title, anime.episode, anime.url)
                }
                client.reply(from, responseReleases, id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break
        
        case "!traduz":
            var inputText = ""
            if(quotedMsg != undefined && quotedMsg.type == "chat"){
                inputText = quotedMsg.body
            } else if(quotedMsg == undefined && type == "chat" ){
                if(args.length === 1) return client.reply(from, errorCommandMsg(command) ,id)
                inputText = body.slice(8).trim()
            } else {
                return client.reply(from, errorCommandMsg(command) ,id)
            }

            try{
                var translationResponse = await api.getTranslation(inputText)
                client.reply(from, translationResponse, id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break  
        
        case '!voz':
            var inputText = '', idMessage = id
            if (args.length === 1) {
                return client.reply(from, errorCommandMsg(command) ,id)
            } else if(quotedMsg  && quotedMsg.type == 'chat'){
                inputText = (args.length == 2) ? quotedMsg.body : body.slice(8).trim()
            } else {
                inputText = body.slice(8).trim()
            }
            if (!inputText) return client.reply(from, msgs_texto.utilidades.voz.texto_vazio , id)
            if (inputText.length > 200) return client.reply(from, msgs_texto.utilidades.voz.texto_longo, id)
            if(quotedMsg) idMessage = quotedMsgObj.id
            var language = body.slice(5, 7).toLowerCase()
            try{
                var audioResponse = await api.textToSpeech(language, inputText)
                client.sendPtt(from, audioResponse, idMessage)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break

        case '!noticias':
            try{
                var newsResponse = await api.getNews()
                var response = msgs_texto.utilidades.noticia.resposta_titulo
                for(let n of newsResponse){
                    response += makeText(msgs_texto.utilidades.noticia.resposta_itens, n.title)
                }
                client.reply(from, response, id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break;

        case '!calc':
            if(args.length === 1) return client.reply(from, errorCommandMsg(command) ,id)
            var inputMathExpression = body.slice(6).trim()
            try{
                var calcResponse = await api.getCalc(inputMathExpression)
                var response = makeText(msgs_texto.utilidades.calc.resposta, calcResponse)
                client.reply(from, response, id)
            } catch(err){
                client.reply(from, err.message, id)
            }
            break
        }
    } catch(err){
        throw err
    }
    

}