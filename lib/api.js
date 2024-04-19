//REQUERINDO MODULOS
import axios from 'axios'
import path from 'node:path'
import { obterMensagensTexto } from './msgs.js'
import {prettyNum} from 'pretty-num'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import { consoleErro, criarTexto, obterNomeAleatorio} from './util.js'
import duration from 'format-duration-time'
import acrcloud from 'acrcloud'
import { rastrearEncomendas } from 'correios-brasil'
import translate from '@vitalets/google-translate-api'
import Youtube from 'youtube-sr'
import ytdl from 'ytdl-core'
import igdl from '@sasmeee/igdl'
import Genius from 'genius-lyrics'
import getFbVideoInfo from 'fb-downloader-scrapper'
import Tiktok from '@tobyg74/tiktok-api-dl'
import getTwitterMedia from 'get-twitter-media'
import YTDL from '@yohancolla/ytdl'
import {createClient} from '@deepgram/sdk'
import tts from 'node-gtts'
import qs from 'node:querystring'
import google from 'googlethis'


export const textoParaVoz = async (idioma, texto)=>{
    return new Promise((resolve,reject)=>{
        try{
            var msgs_texto = obterMensagensTexto()
            var caminhoAudio =  path.resolve(`temp/${idioma}-${obterNomeAleatorio(".mp3")}`)

            if (idioma == 'pt') {
                tts('pt').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else if (idioma == 'en') {
                tts('en').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else if (idioma == 'jp') {
                tts('ja').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } 
            else if (idioma == 'es') {
                tts('es').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else if (idioma == 'it') {
                tts('it').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else if (idioma == 'ru') {
                tts('ru').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else if (idioma == 'ko') {
                tts('ko').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else if (idioma == 'sv') {
                tts('sv').save(caminhoAudio, texto, function () {
                    resolve({success: true, audio: caminhoAudio})
                })
            } else {
                if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
                resolve({success: false})
            }
        } catch(err){
            reject(err)
        } 
    }).catch(err =>{
        err.message = `API textoParaVoz - ${err.message}`
        throw err
    })
}

export const simiResponde = async(textoUsuario)=>{
    try{
        let config = {
            url: "https://api.simsimi.vn/v2/simtalk",
            method: "post",
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            data : qs.stringify({text: textoUsuario, lc: 'pt'})
        }
        let resposta
    
        await axios(config)
        .then((simiresposta)=>{
            resposta = {sucesso: true, resposta: simiresposta.data.message}
        })
        .catch((err)=>{
            if(err.response?.data?.message) resposta = {sucesso: true, resposta: err.response.data.message}
            else resposta = {sucesso: false}
        })

        return resposta
    } catch(err){
        err.message = `API simiResponde- ${err.message}`
        throw err
    }
}

export const obterTranscricaoAudio = async (caminhoAudio)=>{
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

}

export const obterAudioModificado = (caminhoAudio, tipoEdicao) =>{
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
}

export const obterReconhecimentoMusica = async caminhoAudio =>{
    try{
        var msgs_texto = obterMensagensTexto()
        const acr = new acrcloud({
            host: process.env.acr_host?.trim(),
            access_key: process.env.acr_access_key?.trim(),
            access_secret: process.env.acr_access_secret?.trim()
        })
        let resp = await acr.identify(fs.readFileSync(caminhoAudio)).catch((err)=>{
            throw new Error (msgs_texto.utilidades.qualmusica.erro_chave)
        })
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
            duracao: duration.default(resp.metadata.music[0].duration_ms).format("m:ss"),
            lancamento: `${arrayDataLancamento[2]}/${arrayDataLancamento[1]}/${arrayDataLancamento[0]}`,
            album: resp.metadata.music[0].album.name,
            titulo: resp.metadata.music[0].title,
            artistas: artistas.toString()
        }
    } catch(err){
        err.message = `API obterReconhecimentoMusica - ${err.message}`
        throw err
    }
}

export const obterCalculo = async (expressao) =>{
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
}

export const obterMidiaTwitter = async(url)=>{
    try{ 
        var res = await getTwitterMedia(url, {text: true});
        return res
    } catch(err){
        err.message = `API obterMidiaTwitter - ${err.message}`
        throw err
    }
}

export const obterNoticias = async ()=>{
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
}

export const obterTraducao = async (texto, idioma)=>{
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
}

export const obterRastreioCorreios = async codigoRastreio =>{
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
}

export const obterPesquisaWeb = async (pesquisaTexto) =>{
    try{
        let resposta = {resultados:[]}
        const options = {
            page: 0, 
            safe: false, // Safe Search
            parse_ads: false, // If set to true sponsored results will be parsed
            additional_params: { 
                hl: 'pt-br' 
            }
        }
        const resultados = await google.search(pesquisaTexto, options)
        if(resultados.results.length == 0) return {sucesso: false, erro:"sem_resultados"}
        for(let resultado of resultados.results){
            resposta.resultados.push({
                titulo: resultado.title,
                link: resultado.url,
                descricao : resultado.description
            })
        }
        resposta.sucesso = true
        return resposta
    } catch(err) {
        err.message = `API obterPesquisaWeb - ${err.message}`
        throw err
    }
}

export const obterClima = async (local) =>{
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
}

export const obterLetraMusica = async (musica) =>{
    try{
        try{
            var msgs_texto = obterMensagensTexto()
            const Client = new Genius.Client()
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
}

export const obterConversaoMoeda = async (moeda, valor)=>{
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
}

export const obterAnimeInfo = async (path)=>{ 
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
        let tempoInicial = duration.default(msInicio).format("h:mm:ss")
        let tempoFinal = duration.default(msFinal).format("h:mm:ss")
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
}

export const obterImagens = async (pesquisaTexto)=>{ 
    try {
        let imagens = await google.image(pesquisaTexto, { safe: false})
        let resposta = {sucesso: true, imagens: []}
        if(imagens.length == 0) return {sucesso: false, erro: "sem_resultados"}
        for (let imagem of imagens){
            if(imagem.preview != undefined) resposta.imagens.push(imagem)
        }

        return resposta
    } catch(err) {
        err.message = `API obterImagens - ${err.message}`
        throw err
    }
}

export const obterMidiaTiktok = async(url)=>{
    try{
        let resultado = await Tiktok.Downloader(url, {version: "v1"}), resposta 
        if(resultado.status == "success"){
            resposta = {
                sucesso: true,
                autor_perfil: resultado.result.author?.username,
                autor_nome: resultado.result.author?.nickname,
                autor_descricao: resultado.result.author?.signature,
                titulo : resultado.result.description,
                duracao: ((resultado.result.video.duration)/1000).toFixed(0),
                url: resultado.result.video.downloadAddr[0]
            }
        } else {
            resposta = {
                sucesso: false
            }
        }
        return resposta
    } catch(err){
        err.message = `API obterMidiaTiktok - ${err.message}`
        throw err
    }
}

export const obterMidiaFacebook = async(url)=>{
    try {
        var res = await getFbVideoInfo(url)
        return res
    } catch(err) {
        err.message = `API obterMidiaFacebook - ${err.message}`
        throw err
    }
}

export const obterMidiaInstagram = async(url)=>{
    try{
        let res = await igdl(url)
        return res
    } catch(err){
        err.message = `API obterMidiaInstagram - ${err.message}`
        throw err
    }
}

export const obterInfoVideoYT = async(query)=>{ 
    try{
        var res = null
        let pesquisaVideo = await Youtube.default.searchOne(query)
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
}

export const obterYTMP3 = async(videoId)=>{
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
}

export const obterYTMP4 = async(videoId) =>{
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
}

export const obterCartasContraHu = async()=>{
    try {
        var msgs_texto = obterMensagensTexto()
        let github_gist_cartas = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/df5eee4e8abedbf1a18f031873d33f1e34ac338a/cartas.json").catch((err)=>{
            throw new Error(err.message)
        })
        let cartas = github_gist_cartas.data, cartaPretaAleatoria = Math.floor(Math.random() * cartas.cartas_pretas.length), cartaPretaEscolhida = cartas.cartas_pretas[cartaPretaAleatoria], cont_params = 1
        if(cartaPretaEscolhida.indexOf("{p3}" != -1)){cont_params = 3}
        else if(cartaPretaEscolhida.indexOf("{p2}" != -1)) {cont_params = 2}
        else {cont_params = 1}
        for(let i = 1; i <= cont_params; i++){
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
}

export const obterInfoDDD = async(DDD)=>{
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
}

export const obterTabelaNick = async()=>{
    try{
        const githubGistTabela = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/9a58a572233167587e11683aa3544c8a/raw/aea5d03d251359b61771ec87cb513360d9721b8b/tabela.txt").catch((err)=>{
            throw new Error(err.message)
        })
        return githubGistTabela.data
    } catch(err){
        err.message = `API obterTabelaNick - ${err.message}`
        throw err
    }
    
}

