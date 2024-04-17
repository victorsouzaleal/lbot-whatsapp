import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import path from 'node:path'
import fs from 'fs-extra'
import {obterNomeAleatorio} from './util.js'
import axios from 'axios'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)


export const converterMp4ParaMp3 = (caminhoVideo) => {
    return new Promise((resolve,reject)=>{
        let saidaAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
        ffmpeg(caminhoVideo)
        .on('end', () => {
            resolve(saidaAudio)
        })
        .on("error", (err)=>{
            reject(err.message)
        })
        .save(saidaAudio)
    })
}

export const getVideoThumbnail = async(arquivo, tipoArquivo="file") =>{
    return new Promise(async (resolve,reject)=>{
        let saidaThumbImagem = path.resolve(`temp/${obterNomeAleatorio(".jpg")}`), inputCaminho = null
        if(tipoArquivo == "file"){
            inputCaminho = arquivo
        } else if(tipoArquivo == "buffer"){
            inputCaminho = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
            fs.writeFileSync(inputCaminho, arquivo)
        } else if(tipoArquivo == "url"){
            var urlResponse = await axios.get(arquivo,  { responseType: 'arraybuffer' })
            var bufferUrl = Buffer.from(urlResponse.data, "utf-8")
            inputCaminho = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
            fs.writeFileSync(inputCaminho, bufferUrl)
        }
        ffmpeg(inputCaminho)
        .addOption("-y")
        .inputOptions(["-ss 00:00:00"])
        .outputOptions(["-vf scale=32:-1", "-vframes 1", "-f image2"])
        .save(saidaThumbImagem)
        .on('end', ()=>{
            var thumbBase64 = fs.readFileSync(saidaThumbImagem).toString('base64')
            if(tipoArquivo != "file") fs.unlinkSync(inputCaminho)
            fs.unlinkSync(saidaThumbImagem)
            resolve(thumbBase64)
        })
        .on('error', (err)=>{
            reject(err.message)
        })
    })
}

export const stickerToPng = (stickerBuffer)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let entradaWebp = path.resolve(`temp/${obterNomeAleatorio(".webp")}`)
            let saidaPng = path.resolve(`temp/${obterNomeAleatorio(".png")}`)
            fs.writeFileSync(entradaWebp, stickerBuffer)
            ffmpeg(entradaWebp)
            .on('end', ()=>{
                fs.unlinkSync(entradaWebp)
                resolve({
                    success: true,
                    saida: saidaPng
                })
            })
            .on('error', ()=>{
                resolve({
                    success: false,
                    saida: entradaWebp
                })
            })
            .save(saidaPng)
        } catch(err){
            reject(err)
        }
    })
}

export const converterM4aParaMp3 = (caminhoAudio)=>{
    return new Promise((resolve,reject)=>{
        let saidaAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
        ffmpeg(caminhoAudio)
        .on('end', () => {
            resolve(saidaAudio)
        })
        .on("error", (err)=>{
            reject(err.message)
        })
        .audioBitrate('128k')
        .audioCodec("libmp3lame")
        .save(saidaAudio)
    })
}

