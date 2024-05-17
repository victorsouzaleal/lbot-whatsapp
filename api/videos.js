import ffmpeg from 'fluent-ffmpeg'
import path from 'node:path'
import fs from 'fs-extra'
import axios from 'axios'
import {obterNomeAleatorio} from '../bot/lib/util.js'

export const converterMp4ParaMp3 = (bufferVideo) => {
    return new Promise((resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            let caminhoVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
            fs.writeFileSync(caminhoVideo, bufferVideo)
            let saidaAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
            ffmpeg(caminhoVideo)
            .outputOptions(['-vn', '-codec:a libmp3lame', '-q:a 3'])
            .save(saidaAudio)
            .on('end', () => {
                let bufferAudio = fs.readFileSync(saidaAudio)
                fs.unlinkSync(caminhoVideo)
                fs.unlinkSync(saidaAudio)
                resposta = {sucesso: true, resultado : bufferAudio}
                resolve(resposta)
            })
            .on("error", (err)=>{
                fs.unlinkSync(caminhoVideo)
                resposta = {sucesso: false, resultado : 'Houve um erro na conversão para MP3.'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API converterMp4ParaMp3 - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro na conversão para MP3."})
        }
    })
}

export const obterThumbnailVideo = async(arquivo, tipoArquivo="file") =>{
    return new Promise(async (resolve,reject)=>{
        try{
            let resposta = {sucesso: false}
            let saidaThumbImagem = path.resolve(`temp/${obterNomeAleatorio(".jpg")}`), inputCaminho = null
            if(tipoArquivo == "file"){
                inputCaminho = arquivo
            } else if(tipoArquivo == "buffer"){
                inputCaminho = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                fs.writeFileSync(inputCaminho, arquivo)
            } else if(tipoArquivo == "url"){
                let urlResponse = await axios.get(arquivo,  { responseType: 'arraybuffer' })
                let bufferUrl = Buffer.from(urlResponse.data, "utf-8")
                inputCaminho = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
                fs.writeFileSync(inputCaminho, bufferUrl)
            }
            ffmpeg(inputCaminho)
            .addOption("-y")
            .inputOptions(["-ss 00:00:00"])
            .outputOptions(["-vf scale=32:-1", "-vframes 1", "-f image2"])
            .save(saidaThumbImagem)
            .on('end', ()=>{
                if(tipoArquivo != 'file') fs.unlinkSync(inputCaminho)
                let thumbBase64 = fs.readFileSync(saidaThumbImagem).toString('base64')
                fs.unlinkSync(saidaThumbImagem)
                resposta = {sucesso: true, resultado : thumbBase64}
                resolve(resposta)
            })
            .on('error', (err)=>{
                resposta = {sucesso: false, resultado : 'Houve um erro ao obter a thumbnail do video.'}
                reject(resposta)
            })
        } catch(err){
            console.log(`API obterThumbnailVideo - ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro ao obter a thumbnail do video."})
        }
        
    })
  }