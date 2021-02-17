//SERVIÇOS E CHAMADA DE API's externas
const { rastrearEncomendas } = require('correios-brasil')
const translate = require('@vitalets/google-translate-api')
const axios = require('axios')
const cheerio = require('cheerio');
const path = require('path')
const {msgs_texto} = require('./msgs')
const {segParaHora} = require(path.resolve("lib/util.js"))
const color = require(path.resolve('lib/color.js'))
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const Youtube = require('youtube-sr')
const youtubedl = require("youtube-dl")
const DownloadYTFile = require('yt-dl-playlist')
const downloaderYT = new DownloadYTFile({ 
    outputPath: path.resolve("media"),
    ffmpegPath: ffmpegPath,
    maxParallelDownload: 2,
})
const Twit = require("twit")
const {prettyNum} = require('pretty-num');
const { consoleErro } = require('./util');
const {preencherTexto} = require(path.resolve("lib/util.js"))

module.exports = {
    textoParaVoz: (idioma,texto)=>{
        return new Promise((resolve,reject)=>{
            const ttsEn = require('node-gtts')('en')
            const ttsPt = require('node-gtts')('pt')
            const ttsJp = require('node-gtts')('ja')
            const ttsEs = require('node-gtts')('es')
            const ttsIt = require('node-gtts')('it')
            
            if (idioma == 'pt') {
                ttsPt.save(path.resolve('media/tts/resPt.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resPt.mp3'))
                })
            } else if (idioma == 'en') {
                ttsEn.save(path.resolve('media/tts/resEn.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resEn.mp3'))
                })
            } else if (idioma == 'jp') {
                ttsJp.save(path.resolve('media/tts/resJp.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resJp.mp3'))
                })
            } 
            else if (idioma == 'es') {
                ttsEs.save(path.resolve('media/tts/resEs.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resEs.mp3'))
                })
            } else if (idioma == 'it') {
                ttsIt.save(path.resolve('media/tts/resIt.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resIt.mp3'))
                })
            } 
            else {
                reject(new Error(msgs_texto.utilidades.voz.nao_suportado))
            }
        }).catch(err =>{
            if(err.message != msgs_texto.utilidades.voz.nao_suportado){
                consoleErro(err.message,"SERVIÇO textoParaVoz")
                throw new Error(msgs_texto.utilidades.voz.erro_audio)
            } else {
                throw err
            }
        })
    },

    obterAudioEditado: (mp3_path, tipo_edicao) =>{
        return new Promise((resolve,reject)=>{
            let timestamp = Math.round(new Date().getTime()/1000)
            let nome_arquivo = ``
            let ffmpeg_opcoes = []
            switch(tipo_edicao){
                case "estourar":
                    nome_arquivo = `audioestourado-${timestamp}.mp3`
                    ffmpeg_opcoes = ["-y", "-filter_complex", "acrusher=level_in=3:level_out=5:bits=10:mode=log:aa=1"] 
                    break
                case "reverso":
                    nome_arquivo = `audioreverso-${timestamp}.mp3`
                    ffmpeg_opcoes = ["-y", "-filter_complex", "areverse"]
                    break
                case "grave":
                    nome_arquivo = `audiograve-${timestamp}.mp3`
                    ffmpeg_opcoes = ["-y", "-af", "asetrate=44100*0.8"]
                    break
                case "agudo":
                    nome_arquivo = `audioagudo-${timestamp}.mp3`
                    ffmpeg_opcoes = ["-y", "-af", "asetrate=44100*1.4"]
                    break
                case "x2":
                    nome_arquivo = `audiorapido-${timestamp}.mp3`
                    ffmpeg_opcoes = ["-y", "-filter:a", "atempo=2.0", "-vn"]
                    break
                case "volume":
                    nome_arquivo = `audiovolume-${timestamp}.mp3`
                    ffmpeg_opcoes = ["-y", "-filter:a", "volume=4.0"]
                    break
                default:
                    reject(new Error(msgs_texto.utilidades.audio.cmd_erro))
            }
           
            ffmpeg(mp3_path)
            .outputOptions(ffmpeg_opcoes)
            .save(`./media/audios/editados/${nome_arquivo}`)
            .on('end', async () => {
                resolve(path.resolve(`media/audios/editados/${nome_arquivo}`))
            })
            .on("error", ()=>{
                reject(msgs_texto.utilidades.audio.erro_conversao)
            });

        }).catch(err =>{
            if(err.message != msgs_texto.utilidades.audio.cmd_erro){
                consoleErro(err.message,"SERVIÇO obterAudioEditado")
                throw new Error(msgs_texto.utilidades.audio.erro_conversao)
            } else {
                throw err
            }
        })
        
    },
    obterCalculo: async expressao=>{
        try{
            expressao = expressao.replace(/[Xx\xD7]/g, "*")
            expressao = expressao.replace(/\xF7/g, "/")
            expressao = expressao.replace(/,/g,".")
            expressao = expressao.replace("em","in")
            let res = await axios.post(`https://api.mathjs.org/v4/`,{expr: expressao, precision: 5})
            let resultado = res.data.result
            if(resultado == "NaN" || resultado== "Infinity") throw new Error(msgs_texto.utilidades.calc.divisao_zero)
            resultado = resultado.split(" ")
            resultado[0] = (resultado[0].includes("e")) ? prettyNum(resultado[0]) : resultado[0]
            return resultado.join(" ")
        } catch(err){
            if(err.message != msgs_texto.utilidades.calc.divisao_zero){
                consoleErro(err.message)
                throw new Error(msgs_texto.utilidades.calc.erro_calculo)
            } else {
                throw err
            }
        }
    },
    obterMediaTwitter: async(url)=>{
        try{
            var T = new Twit({
                consumer_key: process.env.twitter_consumer_key,
                consumer_secret: process.env.twitter_consumer_secret,
                access_token: process.env.twitter_access_token,
                access_token_secret: process.env.twitter_access_token_secret,
                timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
                strictSSL: true,     // optional - requires SSL certificates to be valid.
            });
            let partes_url = url.split("/"), id_url = partes_url[5]
            let resp = await T.get(`statuses/show.json?id=${id_url}`)
            if(resp.data.extended_entities.media[0].type != "video") throw new Error(msgs_texto.utilidades.tw.nao_encontrado)
            if(resp.data.extended_entities.media[0].video_info.duration_millis > 300000) throw new Error(msgs_texto.utilidades.tw.limite)
            let videoMp4 = resp.data.extended_entities.media[0].video_info.variants.find(video => video.content_type == "video/mp4")
            return videoMp4.url
        } catch(err){
            if(err.message != msgs_texto.utilidades.tw.nao_encontrado && err.message != msgs_texto.utilidades.tw.limite){
                consoleErro(msgs_texto.api.twitter, "SERVIÇO obterMediaTwitter")
                throw new Error(msgs_texto.utilidades.tw.erro_pesquisa)
            } else {
                throw err
            }
        }
    },
    obterNoticias: async ()=>{
        try {
            let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG}`)
            let noticias = res.data.articles
            return noticias
        } catch(err){
            consoleErro(msgs_texto.api.newsapi, "SERVIÇO obterNoticias")
            throw new Error(msgs_texto.utilidades.noticia.erro_servidor)
        }
    },
    obterTraducao: async texto=>{
        try {
            let res = await translate(texto , {to: 'pt'})
            return preencherTexto(msgs_texto.utilidades.traduz.resposta,texto,res.text)
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterTraducao")
            throw new Error(msgs_texto.utilidades.traduz.erro_servidor)
        }
    },

    obterRastreioCorreios: async codigoRastreio =>{
        try{
            if(codigoRastreio.length != 13) throw new Error(msgs_texto.utilidades.rastreio.codigo_invalido)
            let resp = await rastrearEncomendas([codigoRastreio])
            if(resp[0].length < 1) throw new Error(msgs_texto.utilidades.rastreio.nao_postado)
            let resultado = resp[0]
            return resultado
        } catch(err){
            if(err.message != msgs_texto.utilidades.rastreio.codigo_invalido && err.message != msgs_texto.utilidades.rastreio.nao_postado){
                consoleErro(err.message, "SERVIÇO obterRastreioCorreios")
                throw new Error(msgs_texto.utilidades.rastreio.erro_servidor)
            } else {
                throw err
            }
        }  
    },

    obterPesquisaGoogle: async pesquisa=>{
        try{
            const params = {
                api_key: process.env.API_SCALE_SERP,
                q: pesquisa,
                num: "20",
                gl: "br",
                hl: "pt",
                google_domain: "google.com.br"
                }
            const resultados = await axios.get('https://api.scaleserp.com/search', { params })
            return resultados.data1.organic_results.slice(0,5)
        } catch(err) {
            consoleErro(msgs_texto.api.scaleserp2, "SERVIÇO obterPesquisaGoogle")
            throw new Error(msgs_texto.utilidades.google.erro_servidor)
        }
    },

    obterClima: async local =>{
        try{
            let local_escolhido = local.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            const fotoClimaUrl = `http://pt.wttr.in/${local_escolhido}.png`
            const textoClimaUrl = `http://pt.wttr.in/${local_escolhido}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            let resp = await axios.get(textoClimaUrl)
            return {
                foto_url: fotoClimaUrl,
                msg: resp.data
            }
        } catch(err){
            consoleErro(err.message,"SERVIÇO obterClima")
            throw new Error(msgs_texto.utilidades.clima.erro_resultado)
        }
    },
    obterConversaoMoeda: async (moeda,valor)=>{
        try {
            const moedas_suportadas = ['dolar','euro','iene']
            moeda = moeda.toLowerCase()
            valor = valor.replace(",",".")
            if(!moedas_suportadas.includes(moeda)) throw new Error(msgs_texto.utilidades.moeda.nao_suportado)
            if(isNaN(valor)) throw new Error(msgs_texto.utilidades.moeda.valor_invalido)
            if(valor > 1000000000000000) throw new Error (msgs_texto.utilidades.moeda.valor_limite)
            let resp = await axios.get("https://economia.awesomeapi.com.br/json/all")
            let dados_moeda_selecionada = {}
            switch(moeda){
                case 'dolar':
                    moeda = (valor > 1) ? "Dólares" : "Dólar"
                    dados_moeda_selecionada = resp.data.USD
                    break
                case 'euro':
                    moeda = (valor > 1) ? "Euros" : "Euro"
                    dados_moeda_selecionada = resp.data.EUR
                    break
                case 'iene':
                    moeda = (valor > 1) ? "Ienes" : "Iene"
                    dados_moeda_selecionada = resp.data.JPY
                    break           
            }
            let valor_reais = dados_moeda_selecionada.ask * valor
            valor_reais = valor_reais.toFixed(2).replace(".",",")
            let dh_atualizacao = dados_moeda_selecionada.create_date.split(" ")
            let d_atualizacao = dh_atualizacao[0].split("-")
            let h_atualizacao = dh_atualizacao[1]
            return {
                valor_inserido: valor.replace(".",","),
                moeda,
                valor_reais,
                data_atualizacao: `${d_atualizacao[2]}/${d_atualizacao[1]}/${d_atualizacao[0]} às ${h_atualizacao}`
            }
        } catch(err){
            if( err.message != msgs_texto.utilidades.moeda.nao_suportado &&
                err.message != msgs_texto.utilidades.moeda.valor_invalido &&
                err.message != msgs_texto.utilidades.moeda.valor_limite){
                consoleErro(err.message, "SERVIÇO obterConversaoMoeda")
                throw new Error(msgs_texto.utilidades.moeda.erro_servidor)    
            } else {
                throw err
            }
        }
    },
    obterAnime: async (imageBase64)=>{ //TRACE MOE - API DE PESQUISA DE ANIMES
        try{
            let resp = await axios.post("https://trace.moe/api/search",{image: imageBase64})
            let tempo_inicial = segParaHora(resp.data.docs[0].from)
            let tempo_final = segParaHora(resp.data.docs[0].to)
            let episodio = resp.data.docs[0].episode
            let titulo = resp.data.docs[0].title_english
            let similaridade = resp.data.docs[0].similarity * 100
            similaridade = similaridade.toFixed(2)
            let link_preview = `https://media.trace.moe/video/${resp.data.docs[0].anilist_id}/${encodeURIComponent(resp.data.docs[0].filename)}?t=${resp.data.docs[0].at}&token=${resp.data.docs[0].tokenthumb}`
            return {
                tempo_inicial,
                tempo_final,
                episodio,
                titulo,
                similaridade,
                link_preview
            }
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterAnime")
            if(err.status == 429) throw new Error(msgs_texto.utilidades.anime.limite_solicitacao)
            if(err.status == 400) throw new Error(msgs_texto.utilidades.anime.sem_resultado)
            if(err.status != 429 || err.status != 400) throw new Error(msgs_texto.utilidades.anime.erro_servidor)
        }
    },

    obterAnimesLancamentos: async ()=>{ //USA RASPAGEM DE DADOS NO SITE ANIMESHOUSE.NET
        try {
            let resp = await axios.get("https://animeshouse.net/")
            var $ = cheerio.load(resp.data), resultados = []
            $(".item.se.episodes > .data").each((i,element)=>{
                const cheerioElement = $(element)
                const linkEp = cheerioElement.find("div.data > h3 > a").attr("href") 
                const nomeAnime = cheerioElement.find("div.data > h3 > a").text()
                const numEp = cheerioElement.find("div.data > center > div").text() 
                resultados.push({
                    nome: nomeAnime,
                    episodio: numEp,
                    link: linkEp
                })
            })
            return resultados
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterAnimesLancamentos")
            throw new Error(msgs_texto.utilidades.animelanc.erro_pesquisa)
        }
    },

    obterImagens: async (pesquisa,qtd_Img = 1)=>{ //USA API DO SCALESERP PARA OBTER IMAGENS
        try {
            let resp = await axios.get(`https://api.scaleserp.com/search?api_key=${process.env.API_SCALE_SERP}&q=${pesquisa}&include_html=false&google_domain=google.com.br&gl=br&hl=pt&search_type=images&output=json`)
            let imagens = resp.data.image_results, resultados_validos =[], resultados_aleatorios=[]
            if(imagens == undefined) throw new Error(msgs_texto.utilidades.img.nao_encontrado)
            for(let imagem of imagens){
                if(imagem.brand != "Facebook" && imagem.image != undefined) resultados_validos.push(imagem)
            }
            for(let i = 0; i < qtd_Img; i++){
                let qtd_imagens = (resultados_validos.length > 20) ? 20 : resultados_validos.length
                let img_index_aleatorio = Math.floor(Math.random() * qtd_imagens)
                resultados_aleatorios.push(resultados_validos[img_index_aleatorio].image)
                resultados_validos.splice(img_index_aleatorio,1)
            }
            return resultados_aleatorios
        } catch(err) {
            if(err.message != msgs_texto.utilidades.img.nao_encontrado){
                consoleErro(msgs_texto.api.scaleserp, "SERVIÇO obterImagens")
                throw new Error(msgs_texto.utilidades.img.erro_api)
            } else {
                throw err
            }
        }
    },

    obterInfoVideo: async(pesquisa)=>{ //OBTEM INFORMAÇÕES DE UM VIDEO NO YOUTUBE
        try{
            let resp = await Youtube.searchOne(pesquisa)
            const video = resp
            return video
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterInfoVideo")
            throw new Error(msgs_texto.utilidades.yt.erro_pesquisa)
        }
    },

    obterYtMp4Url: (video)=>{  //OBTEM URL PARA DOWNLOAD DE UM VIDEO NO YOUTUBE(MP4)
        return new Promise((resolve,reject)=>{
            let options_yt = ["-f" ,"best[height < 720]"]
            youtubedl.getInfo(`http://www.youtube.com/watch?v=${video.id}`,options_yt, (error, info) => {
                if (error) {
                    reject(new Error(msgs_texto.utilidades.yt.erro_link))
                } else {
                    resolve({
                        titulo: info.title,
                        download: info.url
                    })
                }
            });
        }).catch(err=>{
            if(err.message != msgs_texto.utilidades.yt.erro_link){
                consoleErro(err.message, "SERVIÇO obterYtMp4Url")
                throw new Error(msgs_texto.utilidades.yt.erro_link)
            } else {
                throw err
            }
        })
    },

    obterYtMp3: async (video)=>{ //OBTEM UM VIDEO DO YOUTUBE(MP3)
        try{
             //GERANDO NOME ARQUIVO
             let letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
             let nome_arquivo = ""
             for(let i = 0; i < 6; i++){
                 let letra_aleatoria = Math.floor(Math.random() * letras.length)
                 nome_arquivo += letras[letra_aleatoria]
             }

             downloaderYT.on("error", (err)=>{
                downloaderYT.removeAllListeners()
                throw err
            })

             await downloaderYT.download(video.id,nome_arquivo+".mp3")
             downloaderYT.removeAllListeners()
             return path.resolve(`media/${nome_arquivo}.mp3`)
             
        } catch(err) {
            consoleErro(err.message, "SERVIÇO obterYtMp3")
            throw new Error(msgs_texto.utilidades.play.erro_download)
        }
    }
}
