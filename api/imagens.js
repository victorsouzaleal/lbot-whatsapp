import axios from 'axios'
import {obterNomeAleatorio} from '../bot/lib/util.js'
import duration from 'format-duration-time'
import google from '@victorsouzaleal/googlethis'
import FormData from 'form-data'
import getEmojiMixUrl, {checkSupported} from 'emoji-mixer'
import qs from 'node:querystring'
import {ImageUploadService} from 'node-upload-images'
import fs from 'fs-extra'

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

export const textoParaImagem = async(texto, animado = false)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            let apiUrl = animado ? `https://api.erdwpe.com/api/maker/attp?text=${encodeURIComponent(texto)}` : `https://api.erdwpe.com/api/maker/ttp?text=${encodeURIComponent(texto)}`
            await axios.get(apiUrl, {responseType: 'arraybuffer'}).then(({data})=>{
                resposta = {sucesso: true, resultado: data}
                resolve(resposta)
            }).catch(() =>{
                resposta = {sucesso: false, erro: "Houve um erro no servidor para transformar texto em imagem/gif."}
                reject(resposta)
            })
        } catch(err){
            console.log(`API textoParaImagem- ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor para transformar texto em imagem."})
        }
    })

}

export const misturarEmojis = async (emoji1, emoji2)=>{
    return new Promise(async (resolve, reject)=>{
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
                await axios.get(emojiUrl, {responseType: 'arraybuffer'}).then(({data})=>{
                    resposta = {sucesso: true, resultado: data}
                    resolve(resposta)
                }).catch(()=>{
                    resposta = {sucesso: false, erro: "Houve um erro no download do emoji"}
                    reject(resposta)
                }) 
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

export const obterAnimeInfo = async (bufferImagem)=>{ 
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: true}
            await fetch(`https://api.trace.moe/search?anilistInfo`,{
                    method: "POST",
                    body: bufferImagem,
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