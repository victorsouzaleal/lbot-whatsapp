//SERVIÇOS E CHAMADA DE API's externas
const { rastrearEncomendas } = require('correios-brasil')
const translate = require('@vitalets/google-translate-api')
const axios = require('axios')
const serp = require('serp')
const cheerio = require('cheerio');
const path = require('path')
const {msgs_texto} = require('./msgs')
const {segParaHora} = require(path.resolve("lib/util.js"))
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
// @ts-ignore
const {prettyNum} = require('pretty-num')
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
                reject(msgs_texto.utilidades.voz.nao_suportado)
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
                    return reject(msgs_texto.utilidades.audio.cmd_erro)
            }
           
            try{
                ffmpeg(mp3_path)
                .outputOptions(ffmpeg_opcoes)
                .save(`./media/audios/editados/${nome_arquivo}`)
                .on('end', async () => {
                    resolve(path.resolve(`media/audios/editados/${nome_arquivo}`))
                });
            }catch{
                reject(msgs_texto.utilidades.audio.erro_conversao)
            }
        })
        
    },
    obterCalculo: expressao=>{
        return new Promise((resolve,reject)=>{
            expressao = expressao.replace(/[Xx\xD7]/g, "*")
            expressao = expressao.replace(/\xF7/g, "/")
            expressao = expressao.replace(/,/g,".")
            expressao = expressao.replace("em","in")
            //if(expressao.match(/[a-zA-Z]+/g)) return reject(msgs_texto.utilidades.calc.carac_invalidos)
            axios.post(`https://api.mathjs.org/v4/`,{ 
                expr: expressao,
                precision: 5
              }).then(res=>{
                let resultado = res.data.result
                if(resultado == "NaN" || resultado== "Infinity") return reject(msgs_texto.utilidades.calc.divisao_zero)
                resultado = resultado.split(" ")
                resultado[0] = (resultado[0].includes("e")) ? prettyNum(resultado[0]) : resultado[0]
                resolve(resultado.join(" "))
            }).catch(()=>{
                reject(msgs_texto.utilidades.calc.erro_calculo)
            })
        })
    },
    obterNoticias: ()=>{
        return new Promise((resolve,reject)=>{
            axios.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${process.env.API_NEWS_ORG}`).then(res=>{
                let noticias = res.data.articles
                resolve(noticias)
            }).catch(()=>{
                reject(msgs_texto.utilidades.noticia.erro_servidor)
            })
        })
        
    },
    obterTraducao: texto=>{
        return new Promise((resolve,reject)=>{
            translate(texto , {to: 'pt'}).then(res => {
                resolve(preencherTexto(msgs_texto.utilidades.traduz.resposta,texto,res.text))
            }).catch(() => {
                reject(msgs_texto.utilidades.traduz.erro_servidor)
            })
        })
    },
    obterRastreioCorreios: codigoRastreio =>{
        return new Promise((resolve,reject)=>{
            if(codigoRastreio.length != 13) return reject(msgs_texto.utilidades.rastreio.codigo_invalido)
            rastrearEncomendas([codigoRastreio]).then((resp) => {
                if(resp[0].length < 1) return reject(msgs_texto.utilidades.rastreio.nao_postado)
                let resultado = resp[0]
                resolve(resultado)
            }).catch(()=>{
                reject(msgs_texto.utilidades.rastreio.erro_servidor)
            })
        })    
    },

    obterPesquisaGoogle: pesquisa=>{
        return new Promise(async (resolve,reject)=>{
            try{
                const config_google = {
                    host : "google.com.br",
                    qs : {
                      q : pesquisa,
                      filter : 0,
                      pws : 0
                    },
                    num : 3
                }
                const resultados = await serp.search(config_google)
                resolve(resultados)
            } catch {
                reject(msgs_texto.utilidades.google.erro_servidor)
            }
        })
    },

    obterClima: local =>{
        return new Promise((resolve,reject)=>{
            let local_escolhido = local.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            const fotoClimaUrl = `http://pt.wttr.in/${local_escolhido}.png`
            const textoClimaUrl = `http://pt.wttr.in/${local_escolhido}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            axios.get(textoClimaUrl).then(resp =>{
                resolve({
                    foto_url: fotoClimaUrl,
                    msg: resp.data
                })
            }).catch(()=>{
                reject(msgs_texto.utilidades.clima.erro_resultado)
            })
        })
    },
    obterConversaoMoeda: (moeda,valor)=>{
        return new Promise((resolve,reject)=>{
            const moedas_suportadas = ['dolar','euro','iene']
            moeda = moeda.toLowerCase()
            valor = valor.replace(",",".")
            if(!moedas_suportadas.includes(moeda)) return reject(msgs_texto.utilidades.moeda.nao_suportado)
            if(isNaN(valor)) return reject(msgs_texto.utilidades.moeda.valor_invalido)
            if(valor > 1000000000000000) return reject(msgs_texto.utilidades.moeda.valor_limite)
            axios.get("https://economia.awesomeapi.com.br/json/all").then(async (resp)=>{
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
                resolve({
                    valor_inserido: valor.replace(".",","),
                    moeda,
                    valor_reais,
                    data_atualizacao: `${d_atualizacao[2]}/${d_atualizacao[1]}/${d_atualizacao[0]} às ${h_atualizacao}`
                })
            })
        })
    },
    obterAnime: (imageBase64)=>{ //TRACE MOE - API DE PESQUISA DE ANIMES
        return new Promise((resolve,reject)=>{
            axios.post("https://trace.moe/api/search",{
            image: imageBase64
            }).then((resp)=>{
                let tempo_inicial = segParaHora(resp.data.docs[0].from)
                let tempo_final = segParaHora(resp.data.docs[0].to)
                let episodio = resp.data.docs[0].episode
                let titulo = resp.data.docs[0].title_english
                let similaridade = resp.data.docs[0].similarity * 100
                similaridade = similaridade.toFixed(2)
                let link_preview = `https://media.trace.moe/video/${resp.data.docs[0].anilist_id}/${encodeURIComponent(resp.data.docs[0].filename)}?t=${resp.data.docs[0].at}&token=${resp.data.docs[0].tokenthumb}`
               resolve({
                   tempo_inicial,
                   tempo_final,
                   episodio,
                   titulo,
                   similaridade,
                   link_preview
               })
            }).catch((err)=>{
                reject({
                    status: err.status
                })
            })
        })
    },

    obterAnimesLancamentos: ()=>{ //USA RASPAGEM DE DADOS NO SITE ANIMESHOUSE.NET
        return new Promise((resolve,reject)=>{
            axios.get("https://animeshouse.net/").then(resp =>{
                var $ = cheerio.load(resp.data), resultados = [], msg = ""
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
                resolve(resultados)
            }).catch(()=>{
                reject()
            })
        })
    },

    obterImagens: (pesquisa,qtd_Img = 1)=>{ //USA API DO QWANT PARA OBTER IMAGENS
        return new Promise(async (resolve,reject)=>{
            axios.get(`https://api.scaleserp.com/search?api_key=${process.env.API_SCALE_SERP}&q=${pesquisa}&include_html=false&google_domain=google.com.br&gl=br&hl=pt&search_type=images&output=json`).then(resp=>{
                let imagens = resp.data.image_results, resultados_validos =[], resultados_aleatorios=[]
                if(imagens == undefined) return reject(msgs_texto.utilidades.img.nao_encontrado)
                imagens.forEach(imagem=>{
                    if(imagem.brand != "Facebook" && imagem.image != undefined) resultados_validos.push(imagem)
                })
                for(let i = 0; i < qtd_Img; i++){
                    let qtd_imagens = (resultados_validos.length > 20) ? 20 : resultados_validos.length
                    let img_index_aleatorio = Math.floor(Math.random() * qtd_imagens)
                    resultados_aleatorios.push(resultados_validos[img_index_aleatorio].image)
                    resultados_validos.splice(img_index_aleatorio,1)
                }
                resolve(resultados_aleatorios)
            }).catch(()=>{
                console.log("Houve um erro na API de imagens, confira se o limite gratuito da chave excedeu.")
                reject(msgs_texto.utilidades.img.erro_api)
            })
        })
    },

    obterInfoVideo:(pesquisa)=>{ //OBTEM INFORMAÇÕES DE UM VIDEO NO YOUTUBE
        return new Promise((resolve,reject)=>{
            Youtube.searchOne(pesquisa).then(resp=>{
                const video = resp
                resolve(video)
            }).catch(()=>{
                reject(msgs_texto.utilidades.yt.erro_pesquisa)
            })
        })
    },

    obterYtMp4Url:(video)=>{  //OBTEM URL PARA DOWNLOAD DE UM VIDEO NO YOUTUBE(MP4)
        return new Promise((resolve,reject)=>{
            if(video.duration > 300000){
                return reject(msgs_texto.utilidades.yt.limite)
            }
            let options_yt = ["-f" ,"best[height < 720]"]
            youtubedl.getInfo(`http://www.youtube.com/watch?v=${video.id}`,options_yt, (error, info) => {
                if (error) {
                    reject(msgs_texto.utilidades.yt.erro_link)
                } else {
                    resolve({
                        titulo: info.title,
                        download: info.url
                    })
                }
            });
        })
    },

    obterYtMp3:(video)=>{ //OBTEM UM VIDEO DO YOUTUBE(MP3)
        return new Promise((resolve,reject)=>{
            //GERANDO NOME ARQUIVO
            let letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
            let nome_arquivo = ""
            for(let i = 0; i < 6; i++){
                let letra_aleatoria = Math.floor(Math.random() * letras.length)
                nome_arquivo += letras[letra_aleatoria]
            }
            downloaderYT.download(video.id,nome_arquivo+".mp3").then(async ()=>{
                resolve(path.resolve(`media/${nome_arquivo}.mp3`))
            })
            .catch(()=>{
                reject(msgs_texto.utilidades.play.erro_download)
            })
        })
    }
}
