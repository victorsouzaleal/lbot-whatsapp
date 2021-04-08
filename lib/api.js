//REQUERINDO MODULOS
const axios = require('axios')
const cheerio = require('cheerio');
const path = require('path')
const msgs_texto = require('./msgs')
const {prettyNum} = require('pretty-num')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs-extra')
const { consoleErro, obterNomeAleatorio } = require('./util');
const {criarTexto} = require("./util");
const duration = require("format-duration-time").default;
const acrcloud = require("acrcloud");
const { rastrearEncomendas } = require('correios-brasil')
const translate = require('@vitalets/google-translate-api')
const Youtube = require('youtube-sr')
const ytdl = require("ytdl-core")
const {converterM4aParaMp3} = require("./conversao")
const twitterGetUrl = require("twitter-url-direct")
const instagramGetUrl = require("instagram-url-direct")
const fbdl = require('fbdl-core')

module.exports = {
    textoParaVoz: async (idioma, texto)=>{
        return new Promise((resolve,reject)=>{
            const ttsEn = require('node-gtts')('en')
            const ttsPt = require('node-gtts')('pt')
            const ttsJp = require('node-gtts')('ja')
            const ttsEs = require('node-gtts')('es')
            const ttsIt = require('node-gtts')('it')
            const ttsRu = require('node-gtts')('ru')
            const ttsKo = require('node-gtts')('ko')
            const ttsSv = require('node-gtts')('sv')
            
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
            } else if (idioma == 'ru') {
                ttsRu.save(path.resolve('media/tts/resRu.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resRu.mp3'))
                })
            } else if (idioma == 'ko') {
                ttsKo.save(path.resolve('media/tts/resKo.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resKo.mp3'))
                })
            } else if (idioma == 'sv') {
                ttsSv.save(path.resolve('media/tts/resSv.mp3'), texto, function () {
                    resolve(path.resolve('media/tts/resSv.mp3'))
                })
            } 
            else {
                reject(new Error(msgs_texto.utilidades.voz.nao_suportado))
            }
        }).catch(err =>{
            var errors = [msgs_texto.utilidades.voz.nao_suportado]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API textoParaVoz")
                throw new Error(msgs_texto.utilidades.voz.erro_audio)
            } else {
                throw err
            }
        })
    },

    obterAudioModificado: (caminhoAudio, tipoEdicao) =>{
        return new Promise((resolve,reject)=>{
            let saidaAudio = path.resolve(`media/audios/${obterNomeAleatorio(".mp3")}`)
            let ffmpegOpcoes = []
            switch(tipoEdicao){
                case "estourar":
                    ffmpegOpcoes = ["-y", "-filter_complex", "acrusher=level_in=3:level_out=5:bits=10:mode=log:aa=1"] 
                    break
                case "reverso":
                    ffmpegOpcoes = ["-y", "-filter_complex", "areverse"]
                    break
                case "grave":
                    ffmpegOpcoes = ["-y", "-af", "asetrate=44100*0.8"]
                    break
                case "agudo":
                    ffmpegOpcoes = ["-y", "-af", "asetrate=44100*1.4"]
                    break
                case "x2":
                    ffmpegOpcoes = ["-y", "-filter:a", "atempo=2.0", "-vn"]
                    break
                case "volume":
                    ffmpegOpcoes = ["-y", "-filter:a", "volume=4.0"]
                    break
                default:
                    reject()
            }
           
            ffmpeg(caminhoAudio)
            .outputOptions(ffmpegOpcoes)
            .save(saidaAudio)
            .on('end', async () => {
                resolve(saidaAudio)
            })
            .on("error", ()=>{
                reject()
            });
        }).catch(err =>{
            consoleErro(err.message, "API obterAudioModificado")
            throw new Error(msgs_texto.utilidades.audio.erro_conversao)
        })
        
    },

    obterReconhecimentoMusica : async caminhoAudio =>{
        try{
            const acr = new acrcloud({
                host: process.env.acr_host.trim(),
                access_key: process.env.acr_access_key.trim(),
                access_secret: process.env.acr_access_secret.trim()
             })
             let resp = await acr.identify(fs.readFileSync(caminhoAudio))
             if(resp.status.code == 1001) throw new Error(msgs_texto.utilidades.qualmusica.nao_encontrado)
             if(resp.status.code == 3003 || resp.status.code == 3015) throw new Error(msgs_texto.utilidades.qualmusica.limite_excedido)
             if(resp.status.code == 3000) throw new Error(msgs_texto.utilidades.qualmusica.erro_servidor)
             let arrayDataLancamento = resp.metadata.music[0].release_date.split("-")
             let artistas = []
             for(let artista of resp.metadata.music[0].artists){
                 artistas.push(artista.name)
             }
             return {
                produtora : resp.metadata.music[0].label || "-----",
                duracao: duration(resp.metadata.music[0].duration_ms).format("m:ss"),
                lancamento: `${arrayDataLancamento[2]}/${arrayDataLancamento[1]}/${arrayDataLancamento[0]}`,
                album: resp.metadata.music[0].album.name,
                titulo: resp.metadata.music[0].title,
                artistas: artistas.toString()
             }
        } catch(err){
            var errors = [msgs_texto.utilidades.qualmusica.nao_encontrado, msgs_texto.utilidades.qualmusica.limite_excedido, msgs_texto.utilidades.qualmusica.erro_servidor]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterReconhecimentoMusica")
                throw new Error(msgs_texto.utilidades.qualmusica.erro_servidor)
            } else {
                throw err
            }
        }
    },

    obterCalculo : async expressao =>{
        try{
            expressao = expressao.replace(/[Xx\xD7]/g, "*")
            expressao = expressao.replace(/\xF7/g, "/")
            expressao = expressao.replace(/,/g,".")
            expressao = expressao.replace("em","in")
            let res = await axios.post(`https://api.mathjs.org/v4/`,{expr: expressao})
            let resultado = res.data.result
            if(resultado == "NaN" || resultado == "Infinity") throw new Error(msgs_texto.utilidades.calc.divisao_zero)
            resultado = resultado.split(" ")
            resultado[0] = (resultado[0].includes("e")) ? prettyNum(resultado[0]) : resultado[0]
            return resultado.join(" ")
        } catch(err){
            var errors = [msgs_texto.utilidades.calc.divisao_zero]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterCalculo")
                throw new Error(msgs_texto.utilidades.calc.erro_calculo)
            } else {
                throw err
            }
        }
    },

    obterMidiaTwitter : async(url)=>{
        try{
            let res = await twitterGetUrl(url)
            return res
        } catch(err){
            consoleErro(err.message, "API obterMidiaTwitter")
            throw new Error(msgs_texto.downloads.tw.erro_pesquisa)
        }
    },

    obterNoticias : async ()=>{
        try {
            let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG.trim()}`)
            let noticias = res.data.articles
            return noticias
        } catch(err){
            consoleErro(msgs_texto.api.newsapi, "API obterNoticias")
            throw new Error(msgs_texto.utilidades.noticia.indisponivel)
        }
    },

    obterTraducao : async (texto, idioma)=>{
        try {
            var idiomasSuportados = ["pt", "es", "en", "ja", "it", "ru", "ko"]
            if(!idiomasSuportados.includes(idioma)) throw new Error(msgs_texto.utilidades.traduz.nao_suportado)
            let res = await translate(texto , {to: idioma})
            return criarTexto(msgs_texto.utilidades.traduz.resposta, texto, res.text)
        } catch(err){
            var errors = [msgs_texto.utilidades.traduz.nao_suportado]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterTraducao")
                throw new Error(msgs_texto.utilidades.traduz.erro_servidor)
            } else {
                throw err
            }
        }
    },

    obterRastreioCorreios : async codigoRastreio =>{
        try{
            if(codigoRastreio.length != 13) throw new Error(msgs_texto.utilidades.rastreio.codigo_invalido)
            let res = await rastrearEncomendas([codigoRastreio])
            if(res[0].length < 1) throw new Error(msgs_texto.utilidades.rastreio.nao_postado)
            return res[0]
        } catch(err){
            var errors = [msgs_texto.utilidades.rastreio.codigo_invalido, msgs_texto.utilidades.rastreio.nao_postado]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterRastreioCorreios")
                throw new Error(msgs_texto.utilidades.rastreio.erro_servidor)
            } else {
                throw err
            }
        }  
    },

    obterPesquisaWeb : async pesquisaTexto =>{
        try{
            var options = {
                method: 'GET',
                url: 'https://bing-web-search1.p.rapidapi.com/search',
                params: {
                  q: pesquisaTexto,
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
            let resultados = await axios.request(options), resposta = []
            if(resultados.data.webPages == undefined) throw new Error(msgs_texto.utilidades.pesquisa.sem_resultados)
            resultados = resultados.data.webPages.value.slice(0,5)
            for(let resultado of resultados){
                resposta.push({
                    titulo: resultado.name,
                    link: resultado.url,
                    descricao : resultado.snippet
                })
            }
            return resposta
        } catch(err) {
            var errors = [msgs_texto.utilidades.pesquisa.sem_resultados]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterPesquisaWeb")
                throw new Error(msgs_texto.utilidades.pesquisa.erro_servidor)
            } else {
                throw err
            }
        }
    },

    obterClima: async local =>{
        try{
            local = local.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            const climaFotoURL = `http://pt.wttr.in/${local}.png`
            const climaTextoURL = `http://pt.wttr.in/${local}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            let respostaTexto = await axios.get(climaTextoURL)
            await axios.get(climaFotoURL)
            return {
                foto_clima: climaFotoURL,
                texto: respostaTexto.data
            }
        } catch(err){
            consoleErro(err.message, "API obterClima")
            throw new Error(msgs_texto.utilidades.clima.erro_resultado)
        }
    },

    obterConversaoMoeda: async (moeda, valor)=>{
        try {
            const moedasSuportadas = ['dolar','euro','iene']
            moeda = moeda.toLowerCase()
            valor = valor.replace(",",".")
            if(!moedasSuportadas.includes(moeda)) throw new Error(msgs_texto.utilidades.moeda.nao_suportado)
            if(isNaN(valor)) throw new Error(msgs_texto.utilidades.moeda.valor_invalido)
            if(valor > 1000000000000000) throw new Error (msgs_texto.utilidades.moeda.valor_limite)
            let res = await axios.get("https://economia.awesomeapi.com.br/json/all")
            let dadosMoeda = {}
            switch(moeda){
                case 'dolar':
                    moeda = (valor > 1) ? "Dólares" : "Dólar"
                    dadosMoeda = res.data.USD
                    break
                case 'euro':
                    moeda = (valor > 1) ? "Euros" : "Euro"
                    dadosMoeda = res.data.EUR
                    break
                case 'iene':
                    moeda = (valor > 1) ? "Ienes" : "Iene"
                    dadosMoeda = res.data.JPY
                    break           
            }
            let moedaValorEmReal = dadosMoeda.ask * valor
            moedaValorEmReal = moedaValorEmReal.toFixed(2).replace(".",",")
            let dataHoraAtualizacao = dadosMoeda.create_date.split(" ")
            let dataAtualizacao = dataHoraAtualizacao[0].split("-"), horaAtualizacao = dataHoraAtualizacao[1]
            return {
                valor_inserido : valor.replace(".",","),
                moeda,
                valor_em_real: moedaValorEmReal,
                atualizado: `${dataAtualizacao[2]}/${dataAtualizacao[1]}/${dataAtualizacao[0]} às ${horaAtualizacao}`
            }
        } catch(err){
            var errors = [msgs_texto.utilidades.moeda.nao_suportado, msgs_texto.utilidades.moeda.valor_invalido, msgs_texto.utilidades.moeda.valor_limite]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterConversaoMoeda")
                throw new Error(msgs_texto.utilidades.moeda.erro_servidor)    
            } else {
                throw err
            }
        }
    },

    obterAnimeInfo : async (imagemBase64)=>{ 
        try{
            let res = await axios.post("https://trace.moe/api/search",{image: imagemBase64})
            let msInicio = Math.round(res.data.docs[0].from * 1000) , msFinal = Math.round(res.data.docs[0].to * 1000)
            let tempoInicial = duration(msInicio).format("h:mm:ss")
            let tempoFinal = duration(msFinal).format("h:mm:ss")
            let episodio = res.data.docs[0].episode
            let titulo =  res.data.docs[0].title_english || res.data.docs[0].title_romaji
            let similaridade = res.data.docs[0].similarity * 100
            similaridade = similaridade.toFixed(2)
            let previaLink = `https://media.trace.moe/video/${res.data.docs[0].anilist_id}/${encodeURIComponent(res.data.docs[0].filename)}?t=${res.data.docs[0].at}&token=${res.data.docs[0].tokenthumb}`
            return {
                tempoInicial,
                tempoFinal,
                episodio,
                titulo,
                similaridade,
                link_previa: previaLink
            }
        } catch(err){
            if(err.status == 429){
                throw new Error(msgs_texto.utilidades.anime.limite_solicitacao)
            } else if(err.status == 400){
                throw new Error(msgs_texto.utilidades.anime.sem_resultado)
            } else {
                consoleErro(err.message, "API obterAnimeInfo")
                throw new Error(msgs_texto.utilidades.anime.erro_servidor)
            } 
        }
    },

    obterAnimesLancamentos: async ()=>{ 
        try {
            let res = await axios.get("https://animeshouse.net/")
            var $ = cheerio.load(res.data), resultados = []
            $(".item.se.episodes > .data").each((i,element)=>{
                const cheerioElement = $(element)
                const url = cheerioElement.find("div.data > h3 > a").attr("href") 
                const titulo = cheerioElement.find("div.data > h3 > a").text()
                const episodio = cheerioElement.find("div.data > center > div").text() 
                resultados.push({
                    titulo,
                    episodio,
                    url
                })
            })
            return resultados
        } catch(err){
            consoleErro(err.message, "API obterAnimesLancamentos")
            throw new Error(msgs_texto.utilidades.animelanc.erro_pesquisa)
        }
    },

    obterImagens : async (pesquisaTexto, qtdFotos = 1)=>{ 
        try {
            let options = {
                method: 'GET',
                url: 'https://bing-image-search1.p.rapidapi.com/images/search',
                params: {q: pesquisaTexto, safeSearch: 'off'},
                headers: {
                  'x-rapidapi-key': process.env.API_RAPIDAPI.trim(),
                  'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com'
                }
            };
            let res = await axios.request(options)
            let imagens = res.data.value, imagensURL = [], resultadosAleatorios = []
            if(imagens.length == 0) throw new Error(msgs_texto.downloads.img.nao_encontrado)
            for(let imagem of imagens){
                if(imagem.hostPageDomainFriendlyName == "Facebook"){
                    imagensURL.push(imagem.thumbnailUrl)
                } else {
                    imagensURL.push(imagem.contentUrl)
                }
            }
            for(let i = 0; i < qtdFotos; i++){
                let maxFotos = (imagensURL.length > 20) ? 20 : imagensURL.length, indexAleatorio = Math.floor(Math.random() * maxFotos)
                try{
                    await axios.get(imagensURL[indexAleatorio])
                    resultadosAleatorios.push(imagensURL[indexAleatorio])
                    imagensURL.splice(indexAleatorio, 1)
                } catch{
                    imagensURL.splice(indexAleatorio, 1)
                    i--
                }
            }
            if(resultadosAleatorios.length == 0) throw new Error(msgs_texto.downloads.img.nao_encontrado)
            return resultadosAleatorios
        } catch(err) {
            var errors = [msgs_texto.downloads.img.nao_encontrado]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterImagens")
                throw new Error(msgs_texto.downloads.img.erro_api)
            } else {
                throw err
            }
        }
    },

    obterMidiaFacebook : async(url)=>{
        try {
            var res = await fbdl.getInfo(url)
            if(!res) throw new Error(msgs_texto.downloads.fb.nao_encontrado)
            return res
        } catch(err){
            var errors = [msgs_texto.downloads.fb.nao_encontrado]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterMidiaFacebook")
                throw new Error(msgs_texto.downloads.fb.erro_download)
            } else {
                throw err
            }
        }
    },

    obterMidiaInstagram: async(url)=>{
        try{
            let res = await instagramGetUrl(url)
            return res
        } catch(err){
            consoleErro(err.message, "API obterMidiaInstagram")
            throw new Error(msgs_texto.downloads.ig.erro_download)
        }
    },

    obterInfoVideoYT: async(query)=>{ 
        try{
            let res = await Youtube.searchOne(query)
            const video = res
            return video
        } catch(err){
            consoleErro(err.message, "API obterInfoVideoYT")
            throw new Error(msgs_texto.downloads.yt.erro_pesquisa)
        }
    },

    obterYTMp4URL: async (videoInfo)=>{ 
        try{
            let res = await ytdl.getInfo(videoInfo.id)
            let format = ytdl.chooseFormat(res.formats, {filter: format => format.container === 'mp4'})
            return({
                titulo: res.title,
                download: format.url
            })
        } catch(err){
            consoleErro(err.message, "API obterYTMp4URL")
            throw new Error(msgs_texto.downloads.yt.erro_link)
        }
    },

    obterYtMp3: async(videoInfo) =>{
        var res = await ytdl.getInfo(videoInfo.id)
        var audioFormats = ytdl.filterFormats(res.formats, 'audioonly');
        var format = ytdl.chooseFormat(audioFormats, {filter: format => format.container === 'mp4'})
        const response = await axios({
          url: format.url,
          method: 'GET',
          responseType: 'stream'
        })
        var saidaAudio = await converterM4aParaMp3(response.data)
        return saidaAudio
    },

    obterCartasContraHu : async()=>{
        try {
            let github_gist_cartas = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/df5eee4e8abedbf1a18f031873d33f1e34ac338a/cartas.json")
            let cartas = github_gist_cartas.data, cartaPretaAleatoria = Math.floor(Math.random() * cartas.cartas_pretas.length), cartaPretaEscolhida = cartas.cartas_pretas[cartaPretaAleatoria], cont_params = 1
            if(cartaPretaEscolhida.indexOf("{p3}" != -1)){cont_params = 3}
            else if(cartaPretaEscolhida.indexOf("{p2}" != -1)) {cont_params = 2}
            else {cont_params = 1}
            for(i = 1; i <= cont_params; i++){
                let cartaBrancaAleatoria = Math.floor(Math.random() * cartas.cartas_brancas.length)
                let cartaBrancaEscolhida = cartas.cartas_brancas[cartaBrancaAleatoria]
                cartaPretaEscolhida = cartaPretaEscolhida.replace(`{p${i}}`, `*${cartaBrancaEscolhida}*`)
                cartas.cartas_brancas.splice(cartas.cartas_brancas.indexOf(cartaBrancaEscolhida, 1))
            }
            let frasePronta = cartaPretaEscolhida, resposta = criarTexto(msgs_texto.diversao.fch.resposta, frasePronta)
            return resposta
        } catch(err){
            consoleErro(err.message, "API obterCartasContraHu")
            throw new Error(msgs_texto.diversao.fch.erro_servidor)
        }
    },

    obterInfoDDD: async(DDD)=>{
        try {
            const githubGistDDD= await axios.get("https://gist.githubusercontent.com/victorsouzaleal/ea89a42a9f912c988bbc12c1f3c2d110/raw/af37319b023503be780bb1b6a02c92bcba9e50cc/ddd.json")
            const estados = githubGistDDD.data.estados
            const indexDDD = estados.findIndex(estado => estado.ddd.includes(DDD))
            if(indexDDD != -1){
                var resposta = criarTexto(msgs_texto.utilidades.ddd.resposta, estados[indexDDD].nome, estados[indexDDD].regiao)
                return resposta
            } else {
                throw new Error(msgs_texto.utilidades.ddd.nao_encontrado)
            }
        } catch(err){
            var errors = [msgs_texto.utilidades.ddd.nao_encontrado]
            if(!errors.includes(err.message)){
                consoleErro(err.message, "API obterInfoDDD")
                throw new Error(msgs_texto.utilidades.ddd.erro_servidor)
            } else {
                throw err
            }
        }
    },

    obterTabelaNick: async()=>{
        const githubGistTabela = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/9a58a572233167587e11683aa3544c8a/raw/aea5d03d251359b61771ec87cb513360d9721b8b/tabela.txt")
        return githubGistTabela.data
    },

    obterDestravas: async()=>{
        const githubGistDestravas = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/f9bf13e3bdbd8f8462f0b4beed5282a4/raw/b8dc72df964beecca35df6afbc429dbd28b71dba/destravas.txt")
        return githubGistDestravas.data.split(",")
    }
}
