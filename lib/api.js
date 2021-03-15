//SERVIÇOS E CHAMADA DE API's externas
const axios = require('axios')
const path = require('path')
const msgs_texto = require('./msgs')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs-extra')
const { consoleError, errorCommandMsg, getRandomName } = require('./util');
const {makeText} = require(path.resolve("lib/util.js"));
const duration = require("format-duration-time").default;
const { getVideoDurationInSeconds } = require('get-video-duration')

module.exports = {
    textToSpeech: async (language, text)=>{
        return new Promise((resolve,reject)=>{
            const ttsEn = require('node-gtts')('en')
            const ttsPt = require('node-gtts')('pt')
            const ttsJp = require('node-gtts')('ja')
            const ttsEs = require('node-gtts')('es')
            const ttsIt = require('node-gtts')('it')
            const ttsRu = require('node-gtts')('ru')
            const ttsKo = require('node-gtts')('ko')
            const ttsSv = require('node-gtts')('sv')
            
            if (language == 'pt') {
                ttsPt.save(path.resolve('media/tts/resPt.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resPt.mp3'))
                })
            } else if (language == 'en') {
                ttsEn.save(path.resolve('media/tts/resEn.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resEn.mp3'))
                })
            } else if (language == 'jp') {
                ttsJp.save(path.resolve('media/tts/resJp.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resJp.mp3'))
                })
            } 
            else if (language == 'es') {
                ttsEs.save(path.resolve('media/tts/resEs.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resEs.mp3'))
                })
            } else if (language == 'it') {
                ttsIt.save(path.resolve('media/tts/resIt.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resIt.mp3'))
                })
            } else if (language == 'ru') {
                ttsRu.save(path.resolve('media/tts/resRu.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resRu.mp3'))
                })
            } else if (language == 'ko') {
                ttsKo.save(path.resolve('media/tts/resKo.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resKo.mp3'))
                })
            } else if (language == 'sv') {
                ttsSv.save(path.resolve('media/tts/resSv.mp3'), text, function () {
                    resolve(path.resolve('media/tts/resSv.mp3'))
                })
            } 
            else {
                reject(new Error(msgs_texto.utilidades.voz.nao_suportado))
            }
        }).catch(err =>{
            var errors = [msgs_texto.utilidades.voz.nao_suportado]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API textToSpeech")
                throw new Error(msgs_texto.utilidades.voz.erro_audio)
            } else {
                throw err
            }
        })
    },

    getModifiedAudio: (inputPath, type) =>{
        return new Promise((resolve,reject)=>{
            let outputPath = path.resolve(`media/audios/${getRandomName(".mp3")}`)
            let ffmpegOptions = []
            switch(type){
                case "estourar":
                    ffmpegOptions = ["-y", "-filter_complex", "acrusher=level_in=3:level_out=5:bits=10:mode=log:aa=1"] 
                    break
                case "reverso":
                    ffmpegOptions = ["-y", "-filter_complex", "areverse"]
                    break
                case "grave":
                    ffmpegOptions = ["-y", "-af", "asetrate=44100*0.8"]
                    break
                case "agudo":
                    ffmpegOptions = ["-y", "-af", "asetrate=44100*1.4"]
                    break
                case "x2":
                    ffmpegOptions = ["-y", "-filter:a", "atempo=2.0", "-vn"]
                    break
                case "volume":
                    ffmpegOptions = ["-y", "-filter:a", "volume=4.0"]
                    break
                default:
                    reject()
            }
           
            ffmpeg(inputPath)
            .outputOptions(ffmpegOptions)
            .save(outputPath)
            .on('end', async () => {
                resolve(outputPath)
            })
            .on("error", ()=>{
                reject()
            });
        }).catch(err =>{
            consoleError(err.message, "API getModifiedAudio")
            throw new Error(msgs_texto.utilidades.audio.erro_conversao)
        })
        
    },

    getMusicRecognition : async audioPath =>{
        try{
            const acrcloud = require("acrcloud");
            const acr = new acrcloud({
                host: process.env.acr_host.trim(),
                access_key: process.env.acr_access_key.trim(),
                access_secret: process.env.acr_access_secret.trim()
             });
             let resp = await acr.identify(fs.readFileSync(audioPath))
             if(resp.status.code == 1001) throw new Error(msgs_texto.utilidades.qualmusica.nao_encontrado)
             if(resp.status.code == 3003 || resp.status.code == 3015) throw new Error(msgs_texto.utilidades.qualmusica.limite_excedido)
             if(resp.status.code == 3000) throw new Error(msgs_texto.utilidades.qualmusica.erro_servidor)
             let arrayReleaseDate= resp.metadata.music[0].release_date.split("-")
             let artists = []
             for(let artist of resp.metadata.music[0].artists){
                 artists.push(artist.name)
             }
             return {
                productor : (resp.metadata.music[0].label != undefined) ? resp.metadata.music[0].label : "-----",
                duration: duration(resp.metadata.music[0].duration_ms).format("m:ss"),
                release: `${arrayReleaseDate[2]}/${arrayReleaseDate[1]}/${arrayReleaseDate[0]}`,
                album: resp.metadata.music[0].album.name,
                title: resp.metadata.music[0].title,
                artists: artists.toString()
             }
        } catch(err){
            var errors = [msgs_texto.utilidades.qualmusica.nao_encontrado, msgs_texto.utilidades.qualmusica.limite_excedido, msgs_texto.utilidades.qualmusica.erro_servidor]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getMusicRecognition")
                throw new Error(msgs_texto.utilidades.qualmusica.erro_servidor)
            } else {
                throw err
            }
        }
    },

    getCalc: async mathExpression =>{
        try{
            const {prettyNum} = require('pretty-num');
            mathExpression = mathExpression.replace(/[Xx\xD7]/g, "*")
            mathExpression = mathExpression.replace(/\xF7/g, "/")
            mathExpression = mathExpression.replace(/,/g,".")
            mathExpression = mathExpression.replace("em","in")
            let res = await axios.post(`https://api.mathjs.org/v4/`,{expr: mathExpression, precision: 5})
            let result = res.data.result
            if(result == "NaN" || result == "Infinity") throw new Error(msgs_texto.utilidades.calc.divisao_zero)
            result = result.split(" ")
            result[0] = (result[0].includes("e")) ? prettyNum(result[0]) : result[0]
            return result.join(" ")
        } catch(err){
            var errors = [msgs_texto.utilidades.calc.divisao_zero]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getCalc")
                throw new Error(msgs_texto.utilidades.calc.erro_calculo)
            } else {
                throw err
            }
        }
    },

    getMediaTwitter: async(url)=>{
        try{
            const twitterGetUrl = require("twitter-url-direct")
            let res = await twitterGetUrl(url)
            return res
        } catch(err){
            consoleError(err.message, "API getMediaTwitter")
            throw new Error(msgs_texto.utilidades.tw.erro_pesquisa)
        }
    },

    getNews: async ()=>{
        try {
            let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG.trim()}`)
            let news = res.data.articles
            return news
        } catch(err){
            consoleError(msgs_texto.api.newsapi, "API getNews")
            throw new Error(msgs_texto.utilidades.noticia.indisponivel)
        }
    },

    getTranslation: async text=>{
        try {
            const translate = require('@vitalets/google-translate-api')
            let res = await translate(text , {to: 'pt'})
            return makeText(msgs_texto.utilidades.traduz.resposta, text, res.text)
        } catch(err){
            consoleError(err.message, "API getTranslation")
            throw new Error(msgs_texto.utilidades.traduz.erro_servidor)
        }
    },

    getTrackingCorreios: async trackingCode =>{
        try{
            const { rastrearEncomendas } = require('correios-brasil')
            if(trackingCode.length != 13) throw new Error(msgs_texto.utilidades.rastreio.codigo_invalido)
            let res = await rastrearEncomendas([trackingCode])
            if(res[0].length < 1) throw new Error(msgs_texto.utilidades.rastreio.nao_postado)
            return res[0]
        } catch(err){
            var errors = [err.message != msgs_texto.utilidades.rastreio.codigo_invalido, err.message != msgs_texto.utilidades.rastreio.nao_postado]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getTrackingCorreios")
                throw new Error(msgs_texto.utilidades.rastreio.erro_servidor)
            } else {
                throw err
            }
        }  
    },

    getWebSearch: async query=>{
        try{
            var options = {
                method: 'GET',
                url: 'https://bing-web-search1.p.rapidapi.com/search',
                params: {
                  q: query,
                  mkt: 'pt-br',
                  textFormat: 'Raw',
                  count: '20',
                  safeSearch: 'Off',
                },
                headers: {
                  'x-bingapis-sdk': 'true',
                  'x-search-location': '-22.92134771929199, -43.604844809027114',
                  'x-rapidapi-key': process.env.API_RAPIDAPI.trim(),
                  'x-rapidapi-host': 'bing-web-search1.p.rapidapi.com'
                }
              };
            let results = await axios.request(options), response = []
            if(results.data.webPages == undefined) throw new Error(msgs_texto.utilidades.pesquisa.sem_resultados)
            results = results.data.webPages.value.slice(0,5)
            for(let result of results){
                response.push({
                    title: result.name,
                    link: result.url,
                    description : result.snippet
                })
            }
            return response
        } catch(err) {
            var errors = [msgs_texto.utilidades.pesquisa.sem_resultados]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getWebSearch")
                throw new Error(msgs_texto.utilidades.pesquisa.erro_servidor)
            } else {
                throw err
            }
        }
    },

    getWeather: async locale =>{
        try{
            locale = locale.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            const weatherPicUrl = `http://pt.wttr.in/${locale}.png`
            const weatherTextUrl = `http://pt.wttr.in/${locale}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            let response = await axios.get(weatherTextUrl)
            await axios.get(weatherPicUrl)
            return {
                pic_weather: weatherPicUrl,
                text: response.data
            }
        } catch(err){
            consoleError(err.message, "API getWeather")
            throw new Error(msgs_texto.utilidades.clima.erro_resultado)
        }
    },

    getCurrencyConversion: async (currency,value)=>{
        try {
            const supportedCurrencies = ['dolar','euro','iene']
            currency = currency.toLowerCase()
            value = value.replace(",",".")
            if(!supportedCurrencies.includes(currency)) throw new Error(msgs_texto.utilidades.moeda.nao_suportado)
            if(isNaN(value)) throw new Error(msgs_texto.utilidades.moeda.valor_invalido)
            if(value > 1000000000000000) throw new Error (msgs_texto.utilidades.moeda.valor_limite)
            let res = await axios.get("https://economia.awesomeapi.com.br/json/all")
            let currencyData = {}
            switch(currency){
                case 'dolar':
                    currency = (value > 1) ? "Dólares" : "Dólar"
                    currencyData = res.data.USD
                    break
                case 'euro':
                    currency = (value > 1) ? "Euros" : "Euro"
                    currencyData = res.data.EUR
                    break
                case 'iene':
                    currency = (value > 1) ? "Ienes" : "Iene"
                    currencyData = res.data.JPY
                    break           
            }
            let currencyRealValue = currencyData.ask * value
            currencyRealValue = currencyRealValue.toFixed(2).replace(".",",")
            let dateTimeUpdate = currencyData.create_date.split(" ")
            let dateUpdate = dateTimeUpdate[0].split("-"), timeUpdate = dateTimeUpdate[1]
            return {
                inserted_value: value.replace(".",","),
                currency,
                value_in_real : currencyRealValue,
                updated: `${dateUpdate[2]}/${dateUpdate[1]}/${dateUpdate[0]} às ${timeUpdate}`
            }
        } catch(err){
            var errors = [msgs_texto.utilidades.moeda.nao_suportado, msgs_texto.utilidades.moeda.valor_invalido, msgs_texto.utilidades.moeda.valor_limite]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getCurrencyConversion")
                throw new Error(msgs_texto.utilidades.moeda.erro_servidor)    
            } else {
                throw err
            }
        }
    },

    getAnime: async (inputBase64)=>{ 
        try{
            let res = await axios.post("https://trace.moe/api/search",{image: inputBase64})
            let msStart = Math.round(res.data.docs[0].from * 1000) , msEnd = Math.round(res.data.docs[0].to * 1000)
            let startTime = duration(msStart).format("h:mm:ss")
            let endTime = duration(msEnd).format("h:mm:ss")
            let episode = res.data.docs[0].episode
            let title =  res.data.docs[0].title_english || res.data.docs[0].title_romaji
            let similarity = res.data.docs[0].similarity * 100
            similarity = similarity.toFixed(2)
            let linkPreview = `https://media.trace.moe/video/${res.data.docs[0].anilist_id}/${encodeURIComponent(res.data.docs[0].filename)}?t=${res.data.docs[0].at}&token=${res.data.docs[0].tokenthumb}`
            return {
                startTime,
                endTime,
                episode,
                title,
                similarity,
                link_preview: linkPreview
            }
        } catch(err){
            if(err.status == 429){
                throw new Error(msgs_texto.utilidades.anime.limite_solicitacao)
            } else if(err.status == 400){
                throw new Error(msgs_texto.utilidades.anime.sem_resultado)
            } else {
                consoleError(err.message, "API getAnime")
                throw new Error(msgs_texto.utilidades.anime.erro_servidor)
            } 
        }
    },

    getAnimeReleases: async ()=>{ 
        try {
            const cheerio = require('cheerio');
            let res = await axios.get("https://animeshouse.net/")
            var $ = cheerio.load(res.data), results = []
            $(".item.se.episodes > .data").each((i,element)=>{
                const cheerioElement = $(element)
                const episodeURL = cheerioElement.find("div.data > h3 > a").attr("href") 
                const animeTitle = cheerioElement.find("div.data > h3 > a").text()
                const episodeNum = cheerioElement.find("div.data > center > div").text() 
                results.push({
                    title: animeTitle,
                    episode: episodeNum,
                    url: episodeURL
                })
            })
            return results
        } catch(err){
            consoleError(err.message, "API getAnimeReleases")
            throw new Error(msgs_texto.utilidades.animelanc.erro_pesquisa)
        }
    },

    getImages: async (query, picsNumber = 1)=>{ 
        try {
            let options = {
                method: 'GET',
                url: 'https://bing-image-search1.p.rapidapi.com/images/search',
                params: {q: query, safeSearch: 'off'},
                headers: {
                  'x-rapidapi-key': process.env.API_RAPIDAPI.trim(),
                  'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com'
                }
            };
            let res = await axios.request(options)
            let images = res.data.value, imagesURL = [], randomResults = []
            if(images.length == 0) throw new Error(msgs_texto.utilidades.img.nao_encontrado)
            for(let image of images){
                if(image.hostPageDomainFriendlyName == "Facebook"){
                    imagesURL.push(image.thumbnailUrl)
                } else {
                    imagesURL.push(image.contentUrl)
                }
            }
            for(let i = 0; i < picsNumber; i++){
                let numberMax = (imagesURL.length > 20) ? 20 : imagesURL.length, randomIndex = Math.floor(Math.random() * numberMax)
                randomResults.push(imagesURL[randomIndex])
                imagesURL.splice(randomIndex, 1)
            }
            return randomResults
        } catch(err) {
            var errors = [msgs_texto.utilidades.img.nao_encontrado]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getImages")
                throw new Error(msgs_texto.utilidades.img.erro_api)
            } else {
                throw err
            }
        }
    },

    getMediaFacebook: async(url)=>{
        try {
            let res = await axios.get(`https://docs-jojo.herokuapp.com/api/fb?url=${url}`)
            if(res.data.result.normal != undefined){
                var videoDuration = await getVideoDurationInSeconds(res.data.result.hd || res.data.result.normal)
                return {
                    found : true,
                    duration : videoDuration,
                    url: res.data.result.hd || res.data.result.normal
                }
            }
            return { found : false }
        } catch(err){
            consoleError(err.message, "API getMediaFacebook")
            throw new Error(msgs_texto.utilidades.fb.erro_download)
        }
    },

    getMediaInstagram: async(url)=>{
        try{
            const instagramGetUrl = require("instagram-url-direct")
            let res = await instagramGetUrl(url)
            return res
        } catch(err){
            consoleError(err.message, "API getMediaInstagram")
            throw new Error(msgs_texto.utilidades.ig.erro_download)
        }
    },

    getInfoVideo: async(query)=>{ 
        try{
            const Youtube = require('youtube-sr')
            let res = await Youtube.searchOne(query)
            const video = res
            return video
        } catch(err){
            consoleError(err.message, "API getInfoVideo")
            throw new Error(msgs_texto.utilidades.yt.erro_pesquisa)
        }
    },

    getYtMp4Url: async (videoInfo)=>{ 
        try{
            const ytdl = require("ytdl-core")
            let res = await ytdl.getInfo(videoInfo.id)
            let format = ytdl.chooseFormat(res.formats, {filter: format => format.container === 'mp4'})
            return({
                title: res.title,
                download: format.url
            })
        } catch(err){
            consoleError(err.message, "API getYtMp4Url")
            throw new Error(msgs_texto.utilidades.yt.erro_link)
        }
    },

    getYtMp3: async (videoInfo)=>{ 
        try{
            const DownloadYTFile = require('yt-dl-playlist')
            const downloaderYT = new DownloadYTFile({ 
                outputPath: path.resolve("media/audios"),
                ffmpegPath: ffmpegPath,
                maxParallelDownload: 2,
            })
             var filename = getRandomName(".mp3")
             downloaderYT.on("error", (err)=>{
                downloaderYT.removeAllListeners()
                throw err
            })
             await downloaderYT.download(videoInfo.id, filename)
             downloaderYT.removeAllListeners()
             return path.resolve(`media/audios/${filename}`)
        } catch(err) {
            consoleError(err.message, "API getYtMp3")
            throw new Error(msgs_texto.utilidades.play.erro_download)
        }
    },

    getCardsAgainstHu: async()=>{
        try {
            let github_gist_cards = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/df5eee4e8abedbf1a18f031873d33f1e34ac338a/cartas.json")
            let cards = github_gist_cards.data, randomBlackCard = Math.floor(Math.random() * cards.cartas_pretas.length), chosenBlackCard = cards.cartas_pretas[randomBlackCard], cont_params = 1
            if(chosenBlackCard.indexOf("{p3}" != -1)){cont_params = 3}
            else if(chosenBlackCard.indexOf("{p2}" != -1)) {cont_params = 2}
            else {cont_params = 1}
            for(i = 1; i <= cont_params; i++){
                let randomWhiteCard = Math.floor(Math.random() * cards.cartas_brancas.length)
                let chosenWhiteCard = cards.cartas_brancas[randomWhiteCard]
                chosenBlackCard = chosenBlackCard.replace(`{p${i}}`, `*${chosenWhiteCard}*`)
                cards.cartas_brancas.splice(cards.cartas_brancas.indexOf(chosenWhiteCard, 1))
            }
            let response = makeText(msgs_texto.diversao.fch.resposta, chosenBlackCard)
            return response
        } catch(err){
            consoleError(err.message, "API getCardsAgainstHu")
            throw new Error(msgs_texto.diversao.fch.erro_servidor)
        }
    },

    getDataDDD: async(DDD)=>{
        try {
            const githubGistDDD= await axios.get("https://gist.githubusercontent.com/victorsouzaleal/ea89a42a9f912c988bbc12c1f3c2d110/raw/af37319b023503be780bb1b6a02c92bcba9e50cc/ddd.json")
            const states = githubGistDDD.data.estados
            const findDDD = states.findIndex(state => state.ddd.includes(DDD))
            if(findDDD!= -1){
                let response = makeText(msgs_texto.utilidades.ddd.resposta,states[findDDD].nome,states[findDDD].regiao)
                return response
            } else {
                throw new Error(msgs_texto.utilidades.ddd.nao_encontrado)
            }
        } catch(err){
            var errors = [msgs_texto.utilidades.ddd.nao_encontrado]
            if(!errors.includes(err.message)){
                consoleError(err.message, "API getDataDDD")
                throw new Error(msgs_texto.utilidades.ddd.erro_servidor)
            } else {
                throw err
            }
        }
    }
}
