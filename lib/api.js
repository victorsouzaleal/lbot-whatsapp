//REQUERINDO MODULOS
const axios = require('axios')
const cheerio = require('cheerio');
const path = require('path')
const obterMensagensTexto = require('./msgs')
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
const {createClient} = require('@deepgram/sdk')


module.exports = {
    textoParaVoz: async (idioma, texto)=>{
        return new Promise((resolve,reject)=>{
            try{
                var msgs_texto = obterMensagensTexto()
                const ttsEn = require('node-gtts')('en')
                const ttsPt = require('node-gtts')('pt')
                const ttsJp = require('node-gtts')('ja')
                const ttsEs = require('node-gtts')('es')
                const ttsIt = require('node-gtts')('it')
                const ttsRu = require('node-gtts')('ru')
                const ttsKo = require('node-gtts')('ko')
                const ttsSv = require('node-gtts')('sv')
    
                var caminhoAudio =  path.resolve(`temp/${idioma}-${obterNomeAleatorio(".mp3")}`)
    
                if (idioma == 'pt') {
                    ttsPt.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else if (idioma == 'en') {
                    ttsEn.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else if (idioma == 'jp') {
                    ttsJp.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } 
                else if (idioma == 'es') {
                    ttsEs.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else if (idioma == 'it') {
                    ttsIt.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else if (idioma == 'ru') {
                    ttsRu.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else if (idioma == 'ko') {
                    ttsKo.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else if (idioma == 'sv') {
                    ttsSv.save(caminhoAudio, texto, function () {
                        resolve({success: true, audio: caminhoAudio})
                    })
                } else {
                    if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
                    resolve({success: false, error_message: msgs_texto.utilidades.voz.nao_suportado})
                }
            } catch(err){
                reject(err)
            } 
        }).catch(err =>{
            err.message = `API textoParaVoz - ${err.message}`
            throw err
        })
    },

    obterTranscricaoAudio: async (caminhoAudio)=>{
        try{
            let resposta_api = {}
            const deepgramApiKey = process.env.dg_secret_key?.trim()
            const deepgram = createClient(deepgramApiKey)
            const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
                fs.readFileSync(caminhoAudio),
                {
                  model: 'nova-2',
                  language: 'pt-BR',
                  smart_format: true, 
                },
            )
            if(error){
                resposta_api = {success : false, error_message: error.message}
            } else {
                resposta_api = {success: true, result}
            }

            if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
            return resposta_api
        } catch(err){
            if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
            err.message = `API obterTranscriçãoAudio - ${err.message}`
            throw err
        }

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
            .on("error", (err)=>{
                reject(err)
            })
        }).catch(err =>{
            err.message = `API obterAudioModificado - ${err.message}`
            throw err
        })
    },

    obterReconhecimentoMusica : async caminhoAudio =>{
        try{
            var msgs_texto = obterMensagensTexto()
            const acr = new acrcloud({
                host: process.env.acr_host?.trim(),
                access_key: process.env.acr_access_key?.trim(),
                access_secret: process.env.acr_access_secret?.trim()
             })
             let resp = await acr.identify(fs.readFileSync(caminhoAudio))
             if(resp.status.code == 1001) return {success: false, error_message: msgs_texto.utilidades.qualmusica.nao_encontrado}
             if(resp.status.code == 3003 || resp.status.code == 3015) return {success: false, error_message: msgs_texto.utilidades.qualmusica.limite_excedido}
             if(resp.status.code == 3000) return {success: false, error_message: msgs_texto.utilidades.qualmusica.erro_servidor}
             let arrayDataLancamento = resp.metadata.music[0].release_date.split("-")
             let artistas = []
             for(let artista of resp.metadata.music[0].artists){
                 artistas.push(artista.name)
             }
             return {
                success: true,
                produtora : resp.metadata.music[0].label || "-----",
                duracao: duration(resp.metadata.music[0].duration_ms).format("m:ss"),
                lancamento: `${arrayDataLancamento[2]}/${arrayDataLancamento[1]}/${arrayDataLancamento[0]}`,
                album: resp.metadata.music[0].album.name,
                titulo: resp.metadata.music[0].title,
                artistas: artistas.toString()
             }
        } catch(err){
            err.message = `API obterReconhecimentoMusica - ${err.message}`
            throw err
        }
    },

    obterCalculo : async expressao =>{
        try{
            var msgs_texto = obterMensagensTexto()
            expressao = expressao.replace(/[Xx\xD7]/g, "*")
            expressao = expressao.replace(/\xF7/g, "/")
            expressao = expressao.replace(/,/g,".")
            expressao = expressao.replace("em","in")
            let res = await axios.post(`https://api.mathjs.org/v4/`,{expr: expressao}).catch((err)=>{
                throw new Error(err.message)
            })
            let resultado = res.data.result
            if(resultado == "NaN" || resultado == "Infinity") return {success: false, error_message: msgs_texto.utilidades.calc.divisao_zero}
            resultado = resultado.split(" ")
            resultado[0] = (resultado[0].includes("e")) ? prettyNum(resultado[0]) : resultado[0]
            return {
                success: true,
                resultado: resultado.join(" ")
            }
        } catch(err){
            err.message = `API obterCalculo- ${err.message}`
            throw err
        }
    },

    obterMidiaTwitter : async(url)=>{
        try{ 
            var res = await getTwitterMedia(url, {text: true});
            return res
        } catch(err){
            err.message = `API obterMidiaTwitter - ${err.message}`
            throw err
        }
    },

    obterNoticias : async ()=>{
        try {
            let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG?.trim()}`).catch((err)=>{
                throw new Error("Erro na requisição do NewsAPI, verifique se sua chave API_NEWS_ORG está configurada no .env")
            })
            let resposta = []
            for(var noticia of res.data.articles){
                resposta.push({
                    titulo : noticia.title,
                    descricao : noticia.description,
                    url : noticia.url
                })
            }
            return resposta
        } catch(err){
            err.message = `API obterNoticias - ${err.message}`
            throw err
        }
    },

    obterTraducao : async (texto, idioma)=>{
        try {
            var msgs_texto = obterMensagensTexto()
            var idiomasSuportados = ["pt", "es", "en", "ja", "it", "ru", "ko"]
            if(!idiomasSuportados.includes(idioma)) return {success: false, error_message: msgs_texto.utilidades.traduz.nao_suportado}
            let res = await translate(texto , {to: idioma})
            return {
                success: true,
                traducao: criarTexto(msgs_texto.utilidades.traduz.resposta, texto, res.text)
            }
        } catch(err){
            err.message = `API obterTraducao - ${err.message}`
            throw err
        }
    },

    obterRastreioCorreios : async codigoRastreio =>{
        try{
            var msgs_texto = obterMensagensTexto()
            if(codigoRastreio.length != 13) return {success: false, error_message: msgs_texto.utilidades.rastreio.codigo_invalido}
            let res = await rastrearEncomendas([codigoRastreio])
            if(res[0].length < 1) return {success: false, error_message: msgs_texto.utilidades.rastreio.nao_postado}
            return {success: true, rastreio: res[0]}
        } catch(err){
            err.message = `API obterRastreioCorreios - ${err.message}`
            throw err
        }  
    },

    obterPesquisaWeb : async pesquisaTexto =>{
        try{
            var msgs_texto = obterMensagensTexto()
            let resultados = await googleIt({"disableConsole": true ,'query': pesquisaTexto}), resposta = {}
            if(resultados.length == 0) return {success: false, error_message: msgs_texto.utilidades.pesquisa.sem_resultados}
            resultados = resultados.slice(0,5)
            resposta.resultados = []
            for(let resultado of resultados){
                resposta.resultados.push({
                    titulo: resultado.title,
                    link: resultado.link,
                    descricao : resultado.snippet
                })
            }
            resposta.success = true
            return resposta
        } catch(err) {
            err.message = `API obterPesquisaWeb - ${err.message}`
            throw err
        }
    },

    obterClima: async local =>{
        try{
            local = local.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            const climaTextoURL = `http://pt.wttr.in/${local}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            let respostaTexto = await axios.get(climaTextoURL).catch((err)=>{
                throw new Error(err.message)
            })
            return {
                foto_clima: `http://pt.wttr.in/${local}.png`,
                texto: respostaTexto.data
            }
        } catch(err){
            err.message = `API obterClima - ${err.message}`
            throw err
        }
    },

    obterLetraMusica: async musica =>{
        try{
            try{
                var msgs_texto = obterMensagensTexto()
                var pesquisaMusica = await Client.songs.search(musica)
                if(pesquisaMusica.length == 0) throw new Error("No result was found")
                var letraMusica = await pesquisaMusica[0].lyrics()
            } catch(err){
                if(err.message == "No result was found"){
                    return {success:false, error_message: msgs_texto.utilidades.letra.sem_resultados}
                } else {
                    throw err
                }
            }
            return {
                success: true,
                titulo: pesquisaMusica[0].title,
                artista: pesquisaMusica[0].artist.name,
                imagem : pesquisaMusica[0].artist.image,
                letra: letraMusica
            }
        } catch(err){
            err.message = `API obterLetraMusica - ${err.message}`
            throw err
        }
    },

    obterConversaoMoeda: async (moeda, valor)=>{
        try {
            var msgs_texto = obterMensagensTexto()
            const moedasSuportadas = ['dolar','euro', 'real']
            moeda = moeda.toLowerCase()
            valor = valor.toString().replace(",",".")
            if(!moedasSuportadas.includes(moeda)) return {success: false, error_message: msgs_texto.utilidades.moeda.nao_suportado}
            if(isNaN(valor)) return {success: false, error_message: msgs_texto.utilidades.moeda.valor_invalido}
            if(valor > 1000000000000000) return {success: false, error_message: msgs_texto.utilidades.moeda.valor_limite} 
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
            let {data} = await axios.get(`https://economia.awesomeapi.com.br/json/last/${params}`).catch((err)=>{
                throw new Error(err.message)
            })
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
            resposta.success = true
            return resposta
        } catch(err){
            err.message = `API obterConversaoMoeda - ${err.message}`
            throw err
        }
    },

    obterAnimeInfo : async (path)=>{ 
        try{
            try{
                var msgs_texto = obterMensagensTexto()
                var res = await (await fetch(`https://api.trace.moe/search?anilistInfo`,{
                    method: "POST",
                    body: fs.readFileSync(path),
                    headers: { "Content-type": "image/jpeg" },
                })).json()
            } catch(err){
                if(err.status == 429){
                    return {
                        success : false,
                        error_message : msgs_texto.utilidades.anime.limite_solicitacao
                    }
                } else if(err.status == 400){
                    return {
                        success : false,
                        error_message : msgs_texto.utilidades.anime.sem_resultado
                    }
                } else {
                    throw err
                } 
            }         

            let msInicio = Math.round(res.result[0].from * 1000) , msFinal = Math.round(res.result[0].to * 1000)
            let tempoInicial = duration(msInicio).format("h:mm:ss")
            let tempoFinal = duration(msFinal).format("h:mm:ss")
            let episodio = res.result[0].episode
            let titulo =  res.result[0].anilist.title.english || res.result[0].anilist.title.romaji
            let similaridade = res.result[0].similarity * 100
            similaridade = similaridade.toFixed(2)
            let previaLink = res.result[0].video
            return {
                success: true,
                tempoInicial,
                tempoFinal,
                episodio,
                titulo,
                similaridade,
                link_previa: previaLink
            }
        } catch(err){
            err.message = `API obterAnimeInfo - ${err.message}`
            throw err
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
            var res = null
            let pesquisaVideo = await Youtube.searchOne(query)
            if(pesquisaVideo?.id) {
                let infovideo = await ytdl.getBasicInfo(pesquisaVideo.id).catch((err)=>{
                    if(err.message != "Status code: 410") throw err
                })
                if(infovideo){
                    res = infovideo.player_response.videoDetails
                    res.durationFormatted = pesquisaVideo.durationFormatted
                }
            }
            return res
        } catch(err){
            err.message = `API obterInfoVideoYT - ${err.message}`
            throw err
        }
    },

    obterYTMP3 : async(videoId)=>{
        return new Promise((resolve, reject)=>{
            try{
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
                    reject(err)
                })
            } catch(err){
                reject(err)
            }
        }).catch((err)=>{
            err.message = `API obterYTMP3 - ${err.message}`
            throw err
        })
    },

    obterYTMP4: async(videoId) =>{
        return new Promise ((resolve, reject)=>{
            try{
                var saidaVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                var videoStream = ytdl(videoId, {quality: "highest", filter:"videoandaudio"})
                videoStream.pipe(fs.createWriteStream(saidaVideo))
                videoStream.on("end", async ()=>{
                    resolve(saidaVideo)
                }).on('error', async (err)=>{
                    reject(err)
                })
            } catch(err){
                reject(err)
            }    
        }).catch((err)=>{
            err.message = `API obterYTMP4 - ${err.message}`
            throw err
        })
    },

    obterCartasContraHu : async()=>{
        try {
            var msgs_texto = obterMensagensTexto()
            let github_gist_cartas = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/df5eee4e8abedbf1a18f031873d33f1e34ac338a/cartas.json").catch((err)=>{
                throw new Error(err.message)
            })
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
            err.message = `API obterCartasContraHu- ${err.message}`
            throw err
        }
    },

    obterInfoDDD: async(DDD)=>{
        try {
            var msgs_texto = obterMensagensTexto()
            const githubGistDDD= await axios.get("https://gist.githubusercontent.com/victorsouzaleal/ea89a42a9f912c988bbc12c1f3c2d110/raw/af37319b023503be780bb1b6a02c92bcba9e50cc/ddd.json").catch((err)=>{
                throw new Error(err.message)
            })
            const estados = githubGistDDD.data.estados
            const indexDDD = estados.findIndex(estado => estado.ddd.includes(DDD))
            if(indexDDD != -1){
                var resposta = criarTexto(msgs_texto.utilidades.ddd.resposta, estados[indexDDD].nome, estados[indexDDD].regiao)
                return resposta
            } else {
                return undefined
            }
        } catch(err){
            err.message = `API obterInfoDDD - ${err.message}`
            throw err
        }
    },

    obterTabelaNick: async()=>{
        try{
            const githubGistTabela = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/9a58a572233167587e11683aa3544c8a/raw/aea5d03d251359b61771ec87cb513360d9721b8b/tabela.txt").catch((err)=>{
                throw new Error(err.message)
            })
            return githubGistTabela.data
        } catch(err){
            err.message = `API obterTabelaNick - ${err.message}`
            throw err
        }
        
    },
}
