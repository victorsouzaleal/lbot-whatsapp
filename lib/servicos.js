//SERVIÇOS E CHAMADA DE API's externas
const axios = require('axios')
const path = require('path')
const msgs_texto = require('./msgs')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs-extra')
const { consoleErro, erroComandoMsg } = require('./util');
const {preencherTexto} = require(path.resolve("lib/util.js"));
const duration = require("format-duration-time").default;

module.exports = {
    textoParaVoz: (idioma,texto)=>{
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
                    reject(new Error(erroComandoMsg("!audio")))
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
            if(err.message != erroComandoMsg("!audio")){
                consoleErro(err.message,"SERVIÇO obterAudioEditado")
                throw new Error(msgs_texto.utilidades.audio.erro_conversao)
            } else {
                throw err
            }
        })
        
    },

    obterReconhecimentoAudio : async caminho =>{
        try{
            const acrcloud = require("acrcloud");
            const acr = new acrcloud({
                host: process.env.acr_host.trim(),
                access_key: process.env.acr_access_key.trim(),
                access_secret: process.env.acr_access_secret.trim()
             });
             let resp = await acr.identify(fs.readFileSync(caminho))
             if(resp.status.code == 1001) throw new Error(msgs_texto.utilidades.qualmusica.nao_encontrado)
             if(resp.status.code == 3003 || resp.status.code == 3015) throw new Error(msgs_texto.utilidades.qualmusica.limite_excedido)
             if(resp.status.code == 3000) throw new Error(msgs_texto.utilidades.qualmusica.erro_servidor)
             let array_data_lancamento = resp.metadata.music[0].release_date.split("-")
             let artistas = []
             for(let artista of resp.metadata.music[0].artists){
                 artistas.push(artista.name)
             }
             return {
                produtora : (resp.metadata.music[0].label != undefined) ? resp.metadata.music[0].label : "-----",
                duracao: duration(resp.metadata.music[0].duration_ms).format("m:ss"),
                lancamento: `${array_data_lancamento[2]}/${array_data_lancamento[1]}/${array_data_lancamento[0]}`,
                album: resp.metadata.music[0].album.name,
                titulo: resp.metadata.music[0].title,
                artistas: artistas.toString()
             }
        } catch(err){
            throw err
        }
    },

    obterCalculo: async expressao=>{
        try{
            const {prettyNum} = require('pretty-num');
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
            const twitterGetUrl = require("twitter-url-direct")
            let response = await twitterGetUrl(url)
            return response
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterMediaTwitter")
            throw new Error(msgs_texto.utilidades.tw.erro_pesquisa)
        }
    },
    obterNoticias: async ()=>{
        try {
            let res = await axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG.trim()}`)
            let noticias = res.data.articles
            return noticias
        } catch(err){
            consoleErro(msgs_texto.api.newsapi, "SERVIÇO obterNoticias")
            throw new Error(msgs_texto.utilidades.noticia.erro_servidor)
        }
    },
    obterTraducao: async texto=>{
        try {
            const translate = require('@vitalets/google-translate-api')
            let res = await translate(texto , {to: 'pt'})
            return preencherTexto(msgs_texto.utilidades.traduz.resposta,texto,res.text)
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterTraducao")
            throw new Error(msgs_texto.utilidades.traduz.erro_servidor)
        }
    },

    obterRastreioCorreios: async codigoRastreio =>{
        try{
            const { rastrearEncomendas } = require('correios-brasil')
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

    obterPesquisa: async pesquisa=>{
        try{
            var options = {
                method: 'GET',
                url: 'https://bing-web-search1.p.rapidapi.com/search',
                params: {
                  q: pesquisa,
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
                    descricao: resultado.snippet
                })
            }
            return resposta
        } catch(err) {
            if(err.message != msgs_texto.utilidades.pesquisa.sem_resultados){
                consoleErro(msgs_texto.api.rapidapi, "SERVIÇO obterPesquisa")
                throw new Error(msgs_texto.utilidades.pesquisa.erro_servidor)
            } else {
                throw err
            }
        }
    },

    obterClima: async local =>{
        try{
            let local_escolhido = local.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            const fotoClimaUrl = `http://pt.wttr.in/${local_escolhido}.png`
            const textoClimaUrl = `http://pt.wttr.in/${local_escolhido}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            let resp = await axios.get(textoClimaUrl)
            await axios.get(fotoClimaUrl)
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
            let ms_inicial = Math.round(resp.data.docs[0].from * 1000) , ms_final = Math.round(resp.data.docs[0].to * 1000)
            let tempo_inicial = duration(ms_inicial).format("h:mm:ss")
            let tempo_final = duration(ms_final).format("h:mm:ss")
            let episodio = resp.data.docs[0].episode
            let titulo =  resp.data.docs[0].title_english || resp.data.docs[0].title_romaji
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
            const cheerio = require('cheerio');
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
            let options = {
                method: 'GET',
                url: 'https://bing-image-search1.p.rapidapi.com/images/search',
                params: {q: pesquisa, safeSearch: 'off'},
                headers: {
                  'x-rapidapi-key': process.env.API_RAPIDAPI.trim(),
                  'x-rapidapi-host': 'bing-image-search1.p.rapidapi.com'
                }
            };
            let resp = await axios.request(options)
            let imagens = resp.data.value, links_imagens =[], resultados_aleatorios=[]
            if(imagens.length == 0) throw new Error(msgs_texto.utilidades.img.nao_encontrado)
            for(let imagem of imagens){
                if(imagem.hostPageDomainFriendlyName == "Facebook"){
                    links_imagens.push(imagem.thumbnailUrl)
                } else {
                    links_imagens.push(imagem.contentUrl)
                }
            }
            for(let i = 0; i < qtd_Img; i++){
                let qtd_imagens = (links_imagens.length > 20) ? 20 : links_imagens.length
                let img_index_aleatorio = Math.floor(Math.random() * qtd_imagens)
                resultados_aleatorios.push(links_imagens[img_index_aleatorio])
                links_imagens.splice(img_index_aleatorio,1)
            }
            return resultados_aleatorios
        } catch(err) {
            if(err.message != msgs_texto.utilidades.img.nao_encontrado){
                consoleErro(msgs_texto.api.rapidapi, "SERVIÇO obterImagens")
                throw new Error(msgs_texto.utilidades.img.erro_api)
            } else {
                throw err
            }
        }
    },

    obterMediaFacebook: async(url_media)=>{
        try {
            let res = await axios.get(`https://docs-jojo.herokuapp.com/api/fb?url=${url_media}`)
            if(res.data.result.normal != undefined){
                return {
                    found : true,
                    url: res.data.result.normal
                }
            }
            return { found : false }
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterMediaFacebook")
            throw new Error(msgs_texto.utilidades.fb.erro_download)
        }
    },

    obterMediaInstagram: async(url_media)=>{
        try{
            const instagramGetUrl = require("instagram-url-direct")
            let res = await instagramGetUrl(url_media)
            return res
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterMediaInstagram")
            throw new Error(msgs_texto.utilidades.ig.erro_download)
        }
    },

    obterInfoVideo: async(pesquisa)=>{ //OBTEM INFORMAÇÕES DE UM VIDEO NO YOUTUBE
        try{
            const Youtube = require('youtube-sr')
            let resp = await Youtube.searchOne(pesquisa)
            const video = resp
            return video
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterInfoVideo")
            throw new Error(msgs_texto.utilidades.yt.erro_pesquisa)
        }
    },

    obterYtMp4Url: async (video)=>{  //OBTEM URL PARA DOWNLOAD DE UM VIDEO NO YOUTUBE(MP4)
        try{
            const ytdl = require("ytdl-core")
            let resp = await ytdl.getInfo(video.id)
            let format = ytdl.chooseFormat(resp.formats, {filter: format => format.container === 'mp4'})
            return({
                titulo: video.title,
                download: format.url
            })
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterYtMp4Url")
            throw new Error(msgs_texto.utilidades.yt.erro_link)
        }
    },

    obterYtMp3: async (video)=>{ //OBTEM UM VIDEO DO YOUTUBE(MP3)
        try{
            const DownloadYTFile = require('yt-dl-playlist')
            const downloaderYT = new DownloadYTFile({ 
                outputPath: path.resolve("media"),
                ffmpegPath: ffmpegPath,
                maxParallelDownload: 2,
            })
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
    },

    obterCartasContraHu: async()=>{
        try {
            let github_gist_cartas = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/df5eee4e8abedbf1a18f031873d33f1e34ac338a/cartas.json")
            let cartas = github_gist_cartas.data, carta_preta_aleatoria = Math.floor(Math.random() * cartas.cartas_pretas.length), carta_preta_escolhida = cartas.cartas_pretas[carta_preta_aleatoria], cont_parametros = 1
            if(carta_preta_escolhida.indexOf("{p3}" != -1)){cont_parametros = 3}
            else if(carta_preta_escolhida.indexOf("{p2}" != -1)) {cont_parametros = 2}
            else {cont_parametros = 1}
            for(i = 1; i <= cont_parametros; i++){
                let carta_branca_aleatoria = Math.floor(Math.random() * cartas.cartas_brancas.length)
                let carta_branca_escolhida = cartas.cartas_brancas[carta_branca_aleatoria]
                carta_preta_escolhida = carta_preta_escolhida.replace(`{p${i}}`, `*${carta_branca_escolhida}*`)
                cartas.cartas_brancas.splice(cartas.cartas_brancas.indexOf(carta_branca_escolhida,1))
            }
            let fch_resposta = preencherTexto(msgs_texto.diversao.fch.resposta, carta_preta_escolhida)
            return fch_resposta
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterCartasContraHu")
            throw new Error(msgs_texto.diversao.fch.erro_servidor)
        }
    },

    obterListaDDD: async(ddd)=>{
        try {
            const github_gist_ddd = await axios.get("https://gist.githubusercontent.com/victorsouzaleal/ea89a42a9f912c988bbc12c1f3c2d110/raw/af37319b023503be780bb1b6a02c92bcba9e50cc/ddd.json")
            const estados = github_gist_ddd.data.estados
            const procurarDdd = estados.findIndex(estado => estado.ddd.includes(ddd))
            if(procurarDdd != -1){
                let ddd_resposta = preencherTexto(msgs_texto.utilidades.ddd.resposta,estados[procurarDdd].nome,estados[procurarDdd].regiao)
                return ddd_resposta
            } else {
                throw new Error()
            }
        } catch(err){
            consoleErro(err.message, "SERVIÇO obterListaDDD")
            throw new Error(msgs_texto.utilidades.ddd.erro_ddd)
        }
    }
}
