import fs from 'fs-extra'
import path from 'path'
import {obterNomeAleatorio} from '../bot/lib/util.js'
import {converterMp4ParaMp3} from './videos.js'
import Youtube from 'youtube-sr'; import ytdl from 'ytdl-core'
import instagramGetUrl from 'instagram-url-direct'
import getFbVideoInfo from 'fb-downloader-scrapper'
import Tiktok from '@tobyg74/tiktok-api-dl'
import {TwitterDL} from 'twitter-downloader';


export const obterMidiaTwitter = async(url)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false} 
            await TwitterDL(url).then(res=>{
                if(res.status != 'success') {
                    resposta = {sucesso: false, resultado: `Houve um erro ao baixar essa mídia, provavelmente é um conteúdo sensivel.`}
                    reject(resposta)
                }

                let resultado = {
                    texto: res.result.description,
                    midias:[]
                }

                res.result.media.forEach((midia)=>{
                    if(midia.type == 'video'){
                        resultado.midias.push({
                            tipo : 'video',
                            url : midia.videos.length > 1 ? midia.videos[1].url : midia.videos[0].url
                        })
                    } else if(midia.type == 'photo'){
                        resultado.midias.push({
                            tipo : 'imagem',
                            url : midia.image
                        })
                    }
                })
                
                resposta = {sucesso: true, resultado}
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

export const obterMidiaTiktok = async(url)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            await Tiktok.Downloader(url, {version: "v2"}).then((resultado)=>{
                if(resultado.status == "success"){
                    resposta = {
                        sucesso: true,
                        resultado: {
                            autor_perfil: resultado.result?.author.nickname,
                            descricao : resultado.result?.desc,
                            //duracao: ((resultado.result.video.duration)/1000).toFixed(0),
                            url: resultado.result?.video || resultado.result?.images[0]
                        }
                    }
                    resolve(resposta)
                } else {
                    console.log(resultado)
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
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            let {resultado} = await obterYTMP4(videoId)
            let bufferAudio = (await converterMp4ParaMp3(resultado)).resultado
            resposta = {sucesso: true, resultado: bufferAudio}
            resolve(resposta)
        } catch(err){
            console.log(`API obterYTMP3 - ${err.message}`)
            reject({sucesso: false, erro: "Erro na conversão para o obter o MP3 do Youtube"})
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
                let bufferVideo = fs.readFileSync(saidaVideo)
                fs.unlinkSync(saidaVideo)
                resposta = {sucesso: true, resultado: bufferVideo}
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