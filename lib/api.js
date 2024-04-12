//REQUERINDO MODULOS
const axios = require('axios')
const cheerio = require('cheerio');
const path = require('path')
const msgs_texto = require('./msgs')
const {prettyNum} = require('pretty-num')
const  googleIt = require('google-it')
const gis = require("g-i-s")
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs-extra')
const { consoleErro, criarTexto, obterNomeAleatorio, imagemUpload } = require('./util');
const duration = require("format-duration-time").default;
const acrcloud = require("acrcloud");
const { rastrearEncomendas } = require('correios-brasil')
const translate = require('@vitalets/google-translate-api')
const Youtube = require('youtube-sr').default
const ytdl = require("ytdl-core")
const igdl = require("@sasmeee/igdl")
const Genius = require("genius-lyrics");
const Client = new Genius.Client();
const getFBInfo = require("@xaviabot/fb-downloader")
const Tiktok = require("@tobyg74/tiktok-api-dl")
const getTwitterMedia = require('get-twitter-media')
const YTDL = require('@yohancolla/ytdl')


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

            const caminhoAudio =  path.resolve(`temp/${idioma}-${obterNomeAleatorio(".mp3")}`)

            if (idioma == 'pt') {
                ttsPt.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } else if (idioma == 'en') {
                ttsEn.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } else if (idioma == 'jp') {
                ttsJp.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } 
            else if (idioma == 'es') {
                ttsEs.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } else if (idioma == 'it') {
                ttsIt.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } else if (idioma == 'ru') {
                ttsRu.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } else if (idioma == 'ko') {
                ttsKo.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
                })
            } else if (idioma == 'sv') {
                ttsSv.save(caminhoAudio, texto, function () {
                    resolve(caminhoAudio)
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
            let saidaAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
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
            var res = await getTwitterMedia(url, {text: true});
            return res
        } catch(err){
            consoleErro(err.message, "API obterMidiaTwitter")
            throw new Error(msgs_texto.downloads.tw.erro_pesquisa)
        }
    },

    obterNoticias : async ()=>{
        try {
            let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG.trim()}`), resposta = []
            for(var noticia of res.data.articles){
                resposta.push({
                    titulo : noticia.title,
                    descricao : noticia.description,
                    url : noticia.url
                })
            }
            return resposta
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
            let resultados = await googleIt({"disableConsole": true ,'query': pesquisaTexto}), resposta = []
            if(resultados.length == 0) throw new Error(msgs_texto.utilidades.pesquisa.sem_resultados)
            resultados = resultados.slice(0,5)
            for(let resultado of resultados){
                resposta.push({
                    titulo: resultado.title,
                    link: resultado.link,
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
            const climaTextoURL = `http://pt.wttr.in/${local}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            let respostaTexto = await axios.get(climaTextoURL)
            return {
                foto_clima: `http://pt.wttr.in/${local}.png`,
                texto: respostaTexto.data
            }
        } catch(err){
            consoleErro(err.message, "API obterClima")
            throw new Error(msgs_texto.utilidades.clima.erro_resultado)
        }
    },

    obterLetraMusica: async musica =>{
        try{
            var pesquisaMusica = await Client.songs.search(musica), resultadoMusica = pesquisaMusica[0], letraMusica = await resultadoMusica.lyrics()
            var respostaMusica = {
                titulo: resultadoMusica.title,
                artista: resultadoMusica.artist.name,
                imagem : resultadoMusica.artist.image,
                letra: letraMusica
            }
            return respostaMusica
        } catch(err){
            if(err.message == "No result was found") throw new Error(msgs_texto.utilidades.letra.sem_resultados)
            else {
                consoleErro(err.message, "API obterLetraMusica")
                throw new Error(msgs_texto.utilidades.letra.erro_servidor)
            }
        }
    },

    obterConversaoMoeda: async (moeda, valor)=>{
        try {
            const moedasSuportadas = ['dolar','euro', 'real']
            moeda = moeda.toLowerCase()
            valor = valor.toString().replace(",",".")
            if(!moedasSuportadas.includes(moeda)) throw new Error(msgs_texto.utilidades.moeda.nao_suportado)
            if(isNaN(valor)) throw new Error(msgs_texto.utilidades.moeda.valor_invalido)
            if(valor > 1000000000000000) throw new Error (msgs_texto.utilidades.moeda.valor_limite)
            let params = ''
            switch(moeda){
                case 'dolar':
                    moeda = (valor > 1) ? "Dólares" : "Dólar"
                    params = "USD-BRL,USD-EUR,USD-JPY"
                    break
                case 'euro':
                    moeda = (valor > 1) ? "Euros" : "Euro"
                    params = "EUR-BRL,EUR-USD,EUR-JPY"
                    break
                case 'iene':
                    moeda = (valor > 1) ? "Ienes" : "Iene"
                    params= "JPY-BRL,JPY-USD,JPY-EUR"
                    break 
                case 'real':
                    moeda = (valor > 1) ? "Reais" : "Real"
                    params= "BRL-USD,BRL-EUR,BRL-JPY"
                    break                  
            }
            let {data} = await axios.get(`https://economia.awesomeapi.com.br/json/last/${params}`)
            var resposta = {
                valor_inserido : valor,
                moeda_inserida: moeda,
                conversao : []
            }
            for (var conversao in data){
                var nomeMoeda = '', tipoMoeda = '', simbolo = ''
                switch(data[conversao].codein){
                    case "BRL":
                        tipoMoeda = "Real/Reais"
                        nomeMoeda = "real"
                        simbolo = "R$"
                        break
                    case "EUR":
                        tipoMoeda = "Euro/Euros"
                        nomeMoeda = "euro"
                        simbolo = "Є"
                        break
                    case "USD":
                        tipoMoeda = "Dólar/Dólares"
                        nomeMoeda = "dolar"
                        simbolo = "$"
                        break
                    case "JPY":
                        tipoMoeda = "Iene/Ienes"
                        nomeMoeda = 'iene'
                        simbolo = "¥"
                        break
                }
                var dataHoraAtualizacao = data[conversao].create_date.split(" ")
                var dataAtualizacao = dataHoraAtualizacao[0].split("-"), horaAtualizacao = dataHoraAtualizacao[1]
                resposta.conversao.push({
                    tipo: tipoMoeda,
                    conversao : data[conversao].name,
                    valor_convertido : (data[conversao].bid * valor).toFixed(2),
                    valor_convertido_formatado : `${simbolo} ${(data[conversao].bid * valor).toFixed(2)}`,
                    atualizacao: `${dataAtualizacao[2]}/${dataAtualizacao[1]}/${dataAtualizacao[0]} às ${horaAtualizacao}`
                })
            }
            return resposta
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

    obterAnimeInfo : async (path)=>{ 
        try{
            //let linkImagem = await imagemUpload(path)
            //console.log(linkImagem)
            //let res = await axios.get(`https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(linkImagem)}`)           
            let res = await (await fetch(`https://api.trace.moe/search?anilistInfo`,{
                method: "POST",
                body: fs.readFileSync(path),
                headers: { "Content-type": "image/jpeg" },
            })).json()
            let msInicio = Math.round(res.result[0].from * 1000) , msFinal = Math.round(res.result[0].to * 1000)
            let tempoInicial = duration(msInicio).format("h:mm:ss")
            let tempoFinal = duration(msFinal).format("h:mm:ss")
            let episodio = res.result[0].episode
            let titulo =  res.result[0].anilist.title.english || res.result[0].anilist.title.romaji
            let similaridade = res.result[0].similarity * 100
            similaridade = similaridade.toFixed(2)
            let previaLink = res.result[0].video
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

    obterImagens : async (pesquisaTexto)=>{ 
        try {
            let imagens = await new Promise((resolve, reject)=>{
                gis(pesquisaTexto, (err, res)=>{
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(res)
                    }
                })
            })
            if(imagens.length == 0) throw new Error(msgs_texto.downloads.img.nao_encontrado)
            return imagens
        } catch(err) {
            err.message = `API obterImagens - ${err.message}`
            throw err
        }
    },

    obterMidiaTiktok : async(url)=>{
        try{
            var resultado = await Tiktok.Downloader(url, {version: "v1"})
            return {
                autor_perfil: resultado.result.author.username,
                autor_nome: resultado.result.author.nickname,
                autor_descricao: resultado.result.author.signature,
                titulo : resultado.result.description,
                duracao: resultado.result.video.duration,
                url: resultado.result.video.downloadAddr[0]
            }
        } catch(err){
            err.message = `API obterMidiaTiktok - ${err.message}`
            throw err
        }
    },

    obterMidiaFacebook : async(url)=>{
        try {
            var res = await getFBInfo(url)
            return res
        } catch(err) {
            err.message = `API obterMidiaFacebook - ${err.message}`
            throw err
        }
    },

    obterMidiaInstagram: async(url)=>{
        try{
            let res = await igdl(url)
            return res
        } catch(err){
            err.message = `API obterMidiaInstagram - ${err.message}`
            throw err
        }
    },

    obterInfoVideoYT: async(query)=>{ 
        try{
            let res = await Youtube.searchOne(query)
            const video = res
            return video
        } catch(err){
            err.message = `API obterInfoVideoYT - ${err.message}`
            throw err
        }
    },

    obterYTMP3 : async(videoId)=>{
        try{
            return new Promise((resolve, reject)=>{
                var ytdlMp3 = new YTDL({
                    "outputPath": path.resolve("temp/ "),  
                    "queueParallelism": 2,
                    "progressTimeout": 2000,
                })
    
                ytdlMp3.toMp3(`https://www.youtube.com/watch?v=${videoId}`, "highestaudio");
                ytdlMp3.on("finish", function(err, data) {
                    resolve(data.output)
                })
                ytdlMp3.on("error", function(err) {
                    err.message = `API obterYTMP3 - ${err.message}`
                    reject(err)
                })
            })
        } catch(err){
            err.message = `API obterYTMP3 - ${err.message}`
            throw err
        }
    },

    obterYTMP4: async(videoId) =>{
        try{
            return new Promise ((resolve, reject)=>{
                var saidaVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                var videoStream = ytdl(videoId, {filter: format => format.container === 'mp4' && format.qualityLabel === "360p" && format.audioCodec != null})
                videoStream.pipe(fs.createWriteStream(saidaVideo))
                videoStream.on("end", async ()=>{
                    resolve(saidaVideo)
                }).on('error', async (err)=>{
                    err.message = `API obterYTMP4 - ${err.message}`
                    reject(err)
                })
            })
        } catch(err){
            err.message = `API obterYTMP4 - ${err.message}`
            throw err
        }

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
}
