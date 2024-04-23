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
import instagramGetUrl from 'instagram-url-direct'
import Genius from 'genius-lyrics'
import getFbVideoInfo from 'fb-downloader-scrapper'
import Tiktok from '@tobyg74/tiktok-api-dl'
import getTwitterMedia from 'get-twitter-media'
import YTDL from '@yohancolla/ytdl'
import {createClient} from '@deepgram/sdk'
import tts from 'node-gtts'
import qs from 'node:querystring'
import google from 'googlethis'
import FormData from 'form-data'
import { ImageUploadService } from 'node-upload-images'
import { Hercai } from "hercai"
import getEmojiMixUrl, {checkSupported} from 'emoji-mixer'

export const imagemUpload = async (bufferImagem) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            const service = new ImageUploadService('pixhost.to')
            await service.uploadFromBinary(bufferImagem, obterNomeAleatorio(".png")).then(({directLink})=>{
                resposta = {sucesso: true, resultado: directLink}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: `Houve um erro no upload da imagem`}
                reject(resposta)
            })
            return resposta
        } catch(err){
            console.log(`API imagemUpload - ${err.message}`)
            reject({sucesso: false, erro: `Houve um erro no upload da imagem`})
        }
    })
}

export const converterTextoParaImagem = async(texto)=>{

}

export const misturarEmojis = (emoji1, emoji2)=>{
    return new Promise((resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            let suporteEmoji1  = checkSupported(emoji1, true), suporteEmoji2  = checkSupported(emoji2, true)
            if(!suporteEmoji1 || !suporteEmoji2){
                if(!suporteEmoji1) resposta = {sucesso: false, erro: `${emoji1} não é válido para a união.`}
                if(!suporteEmoji2 && suporteEmoji1) resposta = {sucesso: false, erro: `${emoji2} não é válido para a união`}
                if(!suporteEmoji2 && !suporteEmoji1) resposta = {sucesso: false, erro: `${emoji1} e ${emoji2} não são válidos para a união.`}
                reject(resposta)
            } 
            let emojiUrl = getEmojiMixUrl(emoji1, emoji2, false, true)
            if(emojiUrl != undefined) {
                resposta = {sucesso: true, resultado: emojiUrl}
                resolve(resposta)
            } else {
                resposta = {sucesso: false, erro: "Emojis não compatíveis para união"}
                reject(resposta)
            }
        } catch(err){
            console.log(`API misturarEmojis- ${err.message}`)
            reject({sucesso: false, erro: "Emojis não compatíveis"})
        }
    })

}

export const respostaHercaiTexto = async(textoUsuario, usuario)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            const herc = new Hercai()
            await herc.betaQuestion({content: textoUsuario, user: usuario}).then((respostaHercai)=>{
                resposta = {sucesso: true, resultado: respostaHercai.reply}
                resolve(resposta)
            }).catch((err)=>{
                if(err.response?.status == 429) {
                    resposta = {sucesso: false, erro:'Limite de pedidos foi excedido, tente novamente mais tarde'}
                } else{
                    resposta = {sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'}
                }
                reject(resposta)
            })
        } catch(err) {
            console.log(`API respostaHercaiTexto - ${err.message}`)
            reject({sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'})
        }
    })
}

export const respostaHercaiImagem= async(textoUsuario)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const herc = new Hercai()
            let resposta = {sucesso: false}
            let {resultado} = await obterTraducao(textoUsuario, 'en')
            await herc.betaDrawImage({prompt: resultado, width: 256, height:256}).then((respostaHercai)=>{
                if(respostaHercai.status == 404) {
                    resposta = {sucesso: false, erro: 'O texto que você colocou é inválido ou não pode ser criado.'}
                    reject(resposta)
                } else {
                    resposta = {sucesso: true, resultado: respostaHercai.url}
                    resolve(resposta)
                }
            }).catch((err)=>{
                if(err.response?.status == 429) {
                    resposta = {sucesso: false, erro:'Limite de pedidos foi excedido, tente novamente mais tarde'}
                    reject(resposta)
                } else{
                    console.log(err)
                    resposta = {sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'}
                    reject(resposta)
                }
            })
        } catch(err) {
            console.log(`API respostaHercaiImagem - ${err.message}`)
            reject({sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'})
        }
    })
}

export const removerFundo = async(imagemBuffer)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            let nomeArquivo = obterNomeAleatorio(".png")
            let data = new FormData();
            data.append('files', imagemBuffer, {filename: nomeArquivo})
    
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://download1.imageonline.co/ajax_upload_file.php',
                headers: { 
                    'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0', 
                    'Accept': ' */*', 
                    'Origin': ' https://imageonline.co', 
                    'Connection': ' keep-alive', 
                    'Referer': ' https://imageonline.co/', 
                    'Sec-Fetch-Dest': ' empty', 
                    'Sec-Fetch-Mode': ' cors', 
                    'Sec-Fetch-Site': ' same-site', 
                    ...data.getHeaders()
                },
                data : data
            }
    
            let respostaUpload = await axios.request(config).catch(()=>{
                resposta = {sucesso: false, erro: "Erro no servidor de upload"}
                reject(resposta)
            })
    
            let dadosUpload = JSON.parse(JSON.stringify(respostaUpload.data))
    
            if(!dadosUpload.isSuccess){
                resposta = {sucesso: false, erro: "Tamanho da foto excedeu o limite"}
                reject(resposta)
            }
    
            data = qs.stringify({
                'name': dadosUpload.files[0].name,
                'originalname': dadosUpload.files[0].old_name,
                'option3': dadosUpload.files[0].extension,
                'option4': '1' 
            });
            
            config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://download1.imageonline.co/pngmaker.php',
                headers: { 
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0', 
                'Accept': ' */*', 
                'Accept-Language': ' pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3', 
                'Accept-Encoding': ' gzip, deflate, br', 
                'Content-Type': 'application/x-www-form-urlencoded', 
                'Origin': ' https://imageonline.co', 
                'Connection': ' keep-alive', 
                'Referer': ' https://imageonline.co/', 
                'Sec-Fetch-Dest': ' empty', 
                'Sec-Fetch-Mode': ' cors', 
                'Sec-Fetch-Site': ' same-site'
                },
                data : data
            }
    
            let respostaFotoUrl = await axios.request(config).catch(()=>{
                resposta = {sucesso: false, erro: "Erro no servidor de remover o fundo"}
                reject(resposta)
            })

            let fotoUrl = respostaFotoUrl.data.match(/https:\/\/download1\.imageonline\.co\/download\.php\?filename=[A-Za-z0-9]+-imageonline\.co-[0-9]+\.png/m)
            await axios.get(fotoUrl[0], {responseType: 'arraybuffer'}).then((imagemBufferResposta)=>{
                resposta = {sucesso: true, resultado: imagemBufferResposta.data}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: "Erro ao baixar a imagem sem fundo"}
                reject(resposta)
            })
        } catch(err){
            console.log(`API removerFundo - ${err.message}`)
            reject({sucesso: false, erro: "Erro geral ao remover o fundo."})
        }
    })
}

export const textoParaVoz = async (idioma, texto)=>{
    return new Promise((resolve,reject)=>{
        try{
            var caminhoAudio =  path.resolve(`temp/${idioma}-${obterNomeAleatorio(".mp3")}`)
            let resposta = {sucesso: false}   
            tts(idioma).save(caminhoAudio, texto, ()=>{
                resposta = {sucesso: true, resultado: caminhoAudio}
                resolve(resposta)
            })
        } catch(err){
            console.log(`API textoParaVoz - ${err.message}`)
            if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio) 
            reject({sucesso: false, erro: "Erro na conversão de texto para voz."})
        } 
    })
}

export const simiResponde = async(textoUsuario)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            let config = {
                url: "https://api.simsimi.vn/v2/simtalk",
                method: "post",
                headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                data : qs.stringify({text: textoUsuario, lc: 'pt'})
            }

            await axios(config).then((simiresposta)=>{
                resposta = {sucesso: true, resultado: simiresposta.data.message}
                resolve(resposta)
            }).catch((err)=>{
                if(err.response?.data?.message){
                    resposta = {sucesso: true, resultado: err.response.data.message}
                    resolve(resposta)
                } else {
                    resposta = {sucesso: false, erro: "Houve um erro no servidor do SimSimi."}
                    reject(resposta)
                }
            })
        } catch(err){
            console.log(`API simiResponde- ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor do SimSimi."})
        }
    })
}

export const obterTranscricaoAudio = async (caminhoAudio)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
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
    
            if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
    
            if(error){
                resposta = {sucesso : false, erro: "Erro no servidor para obter a transcrição do áudio"}
                reject(resposta)
            } else {
                resposta = {sucesso: true, resultado: result}
                resolve(resposta)
            }
        } catch(err){
            if(fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio)
            console.log(`API obterTranscriçãoAudio - ${err.message}`)
            reject({sucesso : false, erro: "Erro no servidor para obter a transcrição do áudio"})
        }
    })
}

export const obterAudioModificado = async (caminhoAudio, tipoEdicao) =>{
    return new Promise((resolve,reject)=>{
        try{
            let resposta = {sucesso : false}
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
                    reject({sucesso: false, erro: `Esse tipo de edição não é suportado`})
            }
            
            ffmpeg(caminhoAudio).outputOptions(ffmpegOpcoes).save(saidaAudio)
            .on('end', async () => {
                resposta = {sucesso: true, resultado: saidaAudio}
                resolve(resposta)
            })
            .on("error", ()=>{
                resposta = {sucesso: false, erro: `Houve um erro na modificação do áudio`}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterAudioModificado - ${err.message}`)
            reject({sucesso: false, erro: `Houve um erro na modificação do áudio`})
        }
    })
}

export const obterReconhecimentoMusica = async caminhoAudio =>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            const acr = new acrcloud({
                host: process.env.acr_host?.trim(),
                access_key: process.env.acr_access_key?.trim(),
                access_secret: process.env.acr_access_secret?.trim()
            })
            await acr.identify(fs.readFileSync(caminhoAudio)).then((resp)=>{
                if(resp.status.code == 1001) {
                    resposta = {sucesso: false, erro: 'Não foi encontrada uma música compatível.'}
                    reject(resposta)
                }
                if(resp.status.code == 3003 || resp.status.code == 3015){
                    resposta = {sucesso: false, erro: 'Você excedeu o limite do ACRCloud, crie uma nova chave no site'}
                    reject(resposta)
                } 
                if(resp.status.code == 3000){
                    resposta = {sucesso: false, erro: 'Houve um erro no servidor do ACRCloud, tente novamente mais tarde"'}
                    reject(resposta)
                }
                let arrayDataLancamento = resp.metadata.music[0].release_date.split("-")
                let artistas = []
                for(let artista of resp.metadata.music[0].artists){
                    artistas.push(artista.name)
                }
                resposta =  {
                    sucesso: true,
                    resultado:{
                        produtora : resp.metadata.music[0].label || "-----",
                        duracao: duration.default(resp.metadata.music[0].duration_ms).format("m:ss"),
                        lancamento: `${arrayDataLancamento[2]}/${arrayDataLancamento[1]}/${arrayDataLancamento[0]}`,
                        album: resp.metadata.music[0].album.name,
                        titulo: resp.metadata.music[0].title,
                        artistas: artistas.toString()
                    }
                }
                resolve(resposta)
            })
        } catch(err){
            console.log(`API obterReconhecimentoMusica - ${err.message}`)
            reject({sucesso: false, erro: 'Erro na conexão com a API ACRCloud ou sua chave ainda não está configurada para usar este comando.'})
        }
    })
}

export const obterCalculo = async (expressao) =>{
    return new Promise (async (resolve, reject)=>{
        try{
            let resposta = {sucesso: true}
            expressao = expressao.replace(/[Xx\xD7]/g, "*")
            expressao = expressao.replace(/\xF7/g, "/")
            expressao = expressao.replace(/,/g,".")
            expressao = expressao.replace("em","in")
            await axios.post(`https://api.mathjs.org/v4/`,{expr: expressao}).then((res)=>{
                let resultado = res.data.result
                if(resultado == "NaN" || resultado == "Infinity"){
                    resposta = {sucesso: false, erro: 'Foi feita uma divisão por 0 ou algum outro cálculo inválido.'}
                    reject(resposta)
                }
                resultado = resultado.split(" ")
                resultado[0] = (resultado[0].includes("e")) ? prettyNum(resultado[0]) : resultado[0]
                resposta = {sucesso: true, resultado: resultado.join(" ")}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: 'Houve um erro no servidor de cálculo.'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterCalculo- ${err.message}`)
            reject({sucesso: false, erro: 'Houve um erro no servidor de cálculo.'})
        }
    })
}

export const obterMidiaTwitter = async(url)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false} 
            await getTwitterMedia(url, {text: true}).then(res=>{
                resposta = {sucesso: true, resultado: res}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, resultado: `Houve um erro no servidor de obter mídias do Twitter/X`}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterMidiaTwitter - ${err.message}`)
            reject({sucesso: false, resultado: `Houve um erro no servidor de obter mídias do Twitter/X`})
        }
    })

}

export const obterNoticias = async ()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let resposta = {sucesso:false}
            await google.getTopNews('pt').then((listaNoticias)=>{
                resposta = {sucesso:true, resultado : []}
                for(let noticia of listaNoticias.headline_stories){
                    resposta.resultado.push({
                        titulo : noticia.title,
                        publicadoHa : noticia.published,
                        autor: noticia.by,
                        url : noticia.url
                    })
                }
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso:false, erro: "Houve um erro no servidor de notícias."}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterNoticias - ${err.message}`)
            reject({sucesso:false, erro: "Houve um erro no servidor de notícias."})
        }
    })
}

export const obterTraducao = async (texto, idioma)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let resposta = {sucesso: false}
            await translate(texto , {to: idioma}).then((res)=>{
                resposta = {sucesso: true, resultado: res.text}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: "Houve um erro em processar a tradução."}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterTraducao - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro em processar a tradução."})
        }
    })
}

export const obterRastreioCorreios = async codigoRastreio =>{
    return new Promise(async (resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            await rastrearEncomendas([codigoRastreio]).then((res)=>{
                if(res[0].length < 1){
                    resposta = {sucesso: false, erro: 'Parece que este objeto ainda não foi postado ou não existe'}
                    reject(resposta)
                } else {
                    resposta = {sucesso: true, resultado: res[0]}
                    resolve(resposta)
                }
            })
        } catch(err){
            console.log(`API obterRastreioCorreios - ${err.message}`)
            reject({sucesso: true, erro: "Houve um erro no servidor dos Correios."})
        }  
    })

}

export const obterPesquisaWeb = async (pesquisaTexto) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: true, resultados:[]}
            const options = {
                page: 0, 
                safe: false, // Safe Search
                parse_ads: false, // If set to true sponsored results will be parsed
                additional_params: { 
                    hl: 'pt-br' 
                }
            }
            await google.search(pesquisaTexto, options).then((resultados)=>{
                if(resultados.results.length == 0){
                    resposta = {sucesso: false, erro:" Não foram encontrados resultados para esta pesquisa."}
                    reject(resposta)
                } else {
                    resposta.sucesso = true
                    for(let resultado of resultados.results){
                        resposta.resultados.push({
                            titulo: resultado.title,
                            link: resultado.url,
                            descricao : resultado.description
                        })
                    }
                    resolve(resposta)
                }
            }).catch(()=>{
                resposta = {sucesso: false, erro: "Houve um erro no servidor de pesquisa."}
                reject(resposta)
            })
        } catch(err) {
            console.log(`API obterPesquisaWeb - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor de pesquisa."})
        }
    })
}

export const obterClima = async (local) =>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            local = local.normalize("NFD").replace(/[\u0300-\u036f]/g, '')
            const climaTextoURL = `http://pt.wttr.in/${local}?format=Local%20=%20%l+\nClima atual%20=%20%C+%c+\nTemperatura%20=%20%t+\nUmidade%20=%20%h\nVento%20=%20%w\nLua%20agora%20=%20%m\nNascer%20do%20Sol%20=%20%S\nPor%20do%20Sol%20=%20%s`
            await axios.get(climaTextoURL).then(({data})=>{
                resposta = {sucesso: true, resultado: {foto_clima: `http://pt.wttr.in/${local}.png`, texto: data}}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: "Houve um erro no servidor de pesquisa de clima."}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterClima - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor de pesquisa de clima."})
        }
    })
}

export const obterLetraMusica = async (musica) =>{
    return new Promise(async (resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            const Client = new Genius.Client()
            await Client.songs.search(musica).then(async (pesquisaMusica)=>{
                if(pesquisaMusica.length == 0) {
                    resposta = {sucesso: false, erro: "A letra da música não foi encontrada"}
                    reject(resposta)
                } else {
                    let letraMusica = await pesquisaMusica[0].lyrics()
                    resposta = {sucesso:true, resultado: {
                        titulo: pesquisaMusica[0].title,
                        artista: pesquisaMusica[0].artist.name,
                        imagem : pesquisaMusica[0].artist.image,
                        letra: letraMusica
                    }}
                    resolve(resposta)
                }
            }).catch((err)=>{
                if(err.message == "No result was found"){
                    resposta = {sucesso: false, erro: "A letra da música não foi encontrada"}
                    reject(resposta)
                } else {
                    resposta = {sucesso: false, erro: "Houve um erro no servidor para obter a letra da música."}
                    reject(resposta)
                    throw err
                }
            })
        } catch(err){
            console.log(`API obterLetraMusica - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor para obter a letra da música."})
        }
    })

}

export const obterConversaoMoeda = async (moeda, valor)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let resposta = {sucesso: false}
            const moedasSuportadas = ['dolar','euro', 'real']
            moeda = moeda.toLowerCase()
            valor = valor.toString().replace(",",".")

            if(!moedasSuportadas.includes(moeda)){
                resposta = {sucesso: false, erro: 'Moeda não suportada, atualmente existe suporte para : real|dolar|euro'}
                reject(resposta)
            }
            if(isNaN(valor)){
                resposta = {sucesso: false, erro: 'O valor não é um número válido'}
                reject(resposta)
            } 
            if(valor > 1000000000000000){
                resposta = {sucesso: false, erro: 'Quantidade muito alta, você provavelmente não tem todo esse dinheiro.'}
                reject(resposta)
            } 

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
            await axios.get(`https://economia.awesomeapi.com.br/json/last/${params}`).then(({data})=>{
                resposta = {
                    sucesso: true,
                    resultado : {
                        valor_inserido : valor,
                        moeda_inserida: moeda,
                        conversao : []
                    }
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
                    resposta.resultado.conversao.push({
                        tipo: tipoMoeda,
                        conversao : data[conversao].name,
                        valor_convertido : (data[conversao].bid * valor).toFixed(2),
                        valor_convertido_formatado : `${simbolo} ${(data[conversao].bid * valor).toFixed(2)}`,
                        atualizacao: `${dataAtualizacao[2]}/${dataAtualizacao[1]}/${dataAtualizacao[0]} às ${horaAtualizacao}`
                    })
                    resolve(resposta)
                }
            }).catch((err)=>{
                resposta = {sucesso: false, erro: 'Houve um erro no servidor de conversão de moedas'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterConversaoMoeda - ${err.message}`)
            reject({sucesso: false, erro: 'Houve um erro no servidor de conversão de moedas'})
        }
    })

}

export const obterAnimeInfo = async (path)=>{ 
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: true}
            await fetch(`https://api.trace.moe/search?anilistInfo`,{
                    method: "POST",
                    body: fs.readFileSync(path),
                    headers: { "Content-type": "image/jpeg" },
            }).then(async (res)=>{
                res = await res.json()
                let msInicio = Math.round(res.result[0].from * 1000) , msFinal = Math.round(res.result[0].to * 1000)
                let tempoInicial = duration.default(msInicio).format("h:mm:ss")
                let tempoFinal = duration.default(msFinal).format("h:mm:ss")
                let episodio = res.result[0].episode
                let titulo =  res.result[0].anilist.title.english || res.result[0].anilist.title.romaji
                let similaridade = res.result[0].similarity * 100
                similaridade = similaridade.toFixed(2)
                let previaLink = res.result[0].video
                resposta = {
                    success: true,
                    resultado : {
                        tempoInicial,
                        tempoFinal,
                        episodio,
                        titulo,
                        similaridade,
                        link_previa: previaLink
                    }
                }
                resolve(resposta)
            }).catch(err=>{
                if(err.status == 429){
                    resposta = {sucesso: false, erro: 'Muitas solicitações sendo feitas, tente novamente mais tarde.'}
                    reject(resposta)
                } else if(err.status == 400){
                    resposta = {sucesso: false, erro: 'Não foi possível achar resultados para esta imagem'}
                    reject(resposta)
                } else {
                    resposta = {sucesso: false, erro: 'Houve um erro no servidor de pesquisa de anime.'}
                    reject(resposta)
                } 
            })
        } catch(err){
            console.log(`API obterAnimeInfo - ${err.message}`)
            reject({sucesso: false, erro: 'Houve um erro no servidor de pesquisa de anime.'})
        }
    })
}

export const obterImagens = async (pesquisaTexto)=>{ 
    return new Promise(async(resolve,reject)=>{
        try {
            let resposta = {sucesso: false}
            await google.image(pesquisaTexto, { safe: false, additional_params:{hl: 'pt'}}).then((imagens)=>{
                if(imagens.length == 0) {
                    resposta = {sucesso: false, erro: "Não foi encontrado resultado para esta pesquisa."}
                    reject(resposta)
                } else {
                    resposta = {sucesso: true, resultado: []}
                    for (let imagem of imagens){
                        if(imagem.preview != undefined) resposta.resultado.push(imagem)
                    }
                    resolve(resposta)
                }
            }).catch(()=>{
                resposta = {sucesso: false, erro: "Houve um erro no servidor de pesquisa de imagens, ou não há resultados para essa pesquisa."}
                reject(resposta)
            })
        } catch(err) {
            console.log(`API obterImagens - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor de pesquisa de imagens."})
        }
    })
}

export const obterMidiaTiktok = async(url)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            await Tiktok.Downloader(url, {version: "v1"}).then((resultado)=>{
                if(resultado.status == "success"){
                    resposta = {
                        sucesso: true,
                        resultado: {
                            autor_perfil: resultado.result.author?.username,
                            autor_nome: resultado.result.author?.nickname,
                            autor_descricao: resultado.result.author?.signature,
                            titulo : resultado.result.description,
                            duracao: ((resultado.result.video.duration)/1000).toFixed(0),
                            url: resultado.result.video.downloadAddr[0]
                        }
                    }
                    resolve(resposta)
                } else {
                    resposta = {sucesso: false, erro: 'Não foi encontrado resultado para este link, verifique o link.'}
                    reject(resposta)
                }
            }).catch(()=>{
                resposta = {sucesso: false, erro: 'Houve um erro no servidor de download do TikTok.'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterMidiaTiktok - ${err.message}`)
            reject({sucesso: false, erro: 'Houve um erro no servidor de download do TikTok.'})
        }
    })
}

export const obterMidiaFacebook = async(url)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            let resposta = {sucesso: false}
            await getFbVideoInfo(url).then(res=>{
                resposta = {sucesso:true, resultado: res}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso:false, erro: "Erro ao obter o video, verifique o link ou tente mais tarde."}
                reject(resposta)
            })
        } catch(err) {
            console.log(`API obterMidiaFacebook - ${err.message}`)
            reject({sucesso:false, erro: "Houve um erro no servidor de download do Facebook."})
        }
    })

}

export const obterMidiaInstagram = async(url)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            await instagramGetUrl(url).then(res=>{
                resposta = {sucesso: true, resultado: res}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso:false, erro: "Erro ao obter o video, verifique o link ou tente mais tarde."}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterMidiaInstagram - ${err.message}`)
            reject({sucesso:false, erro: "Houve um erro no servidor de download do Instagram"})
        }
    })

}

export const obterInfoVideoYT = async(query)=>{ 
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            await Youtube.default.searchOne(query).then(async pesquisaVideo =>{
                await ytdl.getBasicInfo(pesquisaVideo.id).then(infovideo=>{
                    resposta = {sucesso: true, resultado: infovideo.player_response.videoDetails}
                    resposta.resultado.durationFormatted = pesquisaVideo.durationFormatted
                    resolve(resposta)                       
                }).catch((err)=>{
                    if(err.message == "Status code: 410") resposta = {sucesso: false, erro:'O video parece ter restrição de idade ou precisa de ter login para assistir.'}  
                    else resposta = {sucesso: false, erro:'Houve um erro ao obter as informações do video.'}  
                    reject(resposta)
                })
            }).catch(()=>{
                resposta = {sucesso: false, erro:'Houve um erro ao obter as informações do video.'}
                reject(resposta) 
            })
        } catch(err){
            console.log(`API obterInfoVideoYT - ${err.message}`)
            reject({sucesso: false, erro:'Houve um erro no servidor de pesquisas do Youtube.'})
        }
    })
}

export const obterYTMP3 = async(videoId)=>{
    return new Promise((resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            let ytdlMp3 = new YTDL({
                "outputPath": path.resolve("temp/ "),  
                "queueParallelism": 2,
                "progressTimeout": 2000,
            })

            ytdlMp3.toMp3(`https://www.youtube.com/watch?v=${videoId}`, "highestaudio")
            ytdlMp3.on("finish", (err, data) => {
                resposta = {sucesso: true, resultado: data.output}
                resolve(resposta)
            })
            ytdlMp3.on("error", (err) => {
                resposta = {sucesso: false, erro: "Erro no servidor para o obter o MP3 do Youtube"}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterYTMP3 - ${err.message}`)
            reject({sucesso: false, erro: "Erro no servidor para o obter o MP3 do Youtube"})
        }
    })
}

export const obterYTMP4 = async(videoId) =>{
    return new Promise ((resolve, reject)=>{
        try{
            let resposta = {sucesso: true}
            let saidaVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
            let videoStream = ytdl(videoId, {quality: "highest", filter:"videoandaudio"})
            videoStream.pipe(fs.createWriteStream(saidaVideo))
            videoStream.on("end", ()=>{
                resposta = {sucesso: true, resultado: saidaVideo}
                resolve(resposta)
            }).on('error', ()=>{
                resposta = {sucesso: false, erro: "Erro no servidor para o obter o video do Youtube"}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterYTMP4 - ${err.message}`)
            reject({sucesso: false, erro: "Erro no servidor para o obter o video do Youtube"})
        }    
    })
}

export const obterCartasContraHu = async()=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let resposta = {sucesso: false}
            await axios.get("https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/df5eee4e8abedbf1a18f031873d33f1e34ac338a/cartas.json").then((github_gist_cartas)=>{
                let cartas = github_gist_cartas.data, cartaPretaAleatoria = Math.floor(Math.random() * cartas.cartas_pretas.length), cartaPretaEscolhida = cartas.cartas_pretas[cartaPretaAleatoria], cont_params = 1
                if(cartaPretaEscolhida.indexOf("{p3}" != -1)) cont_params = 3
                else if(cartaPretaEscolhida.indexOf("{p2}" != -1)) cont_params = 2
                else cont_params = 1
                for(let i = 1; i <= cont_params; i++){
                    let cartaBrancaAleatoria = Math.floor(Math.random() * cartas.cartas_brancas.length)
                    let cartaBrancaEscolhida = cartas.cartas_brancas[cartaBrancaAleatoria]
                    cartaPretaEscolhida = cartaPretaEscolhida.replace(`{p${i}}`, `*${cartaBrancaEscolhida}*`)
                    cartas.cartas_brancas.splice(cartas.cartas_brancas.indexOf(cartaBrancaEscolhida, 1))
                }
                let frasePronta = criarTexto(obterMensagensTexto().diversao.fch.resposta, cartaPretaEscolhida)
                resposta = {sucesso: true, resultado: frasePronta}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: "Houve um erro no servidor para obter as cartas."}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterCartasContraHu- ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor para obter as cartas."})
        }
    })

}

export const obterInfoDDD = async(DDD)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let resposta = {sucesso: false}
            await axios.get("https://gist.githubusercontent.com/victorsouzaleal/ea89a42a9f912c988bbc12c1f3c2d110/raw/af37319b023503be780bb1b6a02c92bcba9e50cc/ddd.json").then(githubGistDDD=>{
                let estados = githubGistDDD.data.estados
                let indexDDD = estados.findIndex(estado => estado.ddd.includes(DDD))
                if(indexDDD != -1){
                    resposta = {sucesso:true, resultado: criarTexto(obterMensagensTexto().utilidades.ddd.resposta, estados[indexDDD].nome, estados[indexDDD].regiao)}
                    resolve(resposta)
                } else {
                    resposta = {sucesso: false, erro: 'Este DDD não foi encontrado, certifique-se que ele é válido.'}
                    reject(resposta)
                }
            }).catch(()=>{
                resposta = {sucesso: false, erro: 'Houve um erro para obter dados sobre este DDD, tente novamente mais tarde.'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterInfoDDD - ${err.message}`)
            reject({sucesso: false, erro: 'Houve um erro para obter dados sobre este DDD, tente novamente mais tarde.'})
        }
    })
}

export const obterTabelaNick = async()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            await axios.get("https://gist.githubusercontent.com/victorsouzaleal/9a58a572233167587e11683aa3544c8a/raw/aea5d03d251359b61771ec87cb513360d9721b8b/tabela.txt").then((githubGistTabela)=>{
                resposta = {sucesso: true, resultado: githubGistTabela.data}
                resolve(resposta)
            }).catch(()=>{
                resposta = {sucesso: false, erro: 'Houve um erro para obter os dados, tente novamente mais tarde.'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterTabelaNick - ${err.message}`)
            reject({sucesso: false, erro: 'Houve um erro para obter os dados, tente novamente mais tarde.'})
        }
    })
}

