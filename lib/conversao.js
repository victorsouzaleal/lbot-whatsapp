const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath)
const path = require('path')
const {obterNomeAleatorio} = require('./util')

module.exports ={
    converterMp4ParaMp3 : (caminhoVideo) => {
        return new Promise((resolve,reject)=>{
            let saidaAudio = path.resolve(`media/audios/${obterNomeAleatorio(".mp3")}`)
            ffmpeg(caminhoVideo)
            .on('end', () => {
                resolve(saidaAudio)
            })
            .on("error", (err)=>{
                reject(err.message)
            })
            .save(saidaAudio)
        })
    },

    converterM4aParaMp3 : (caminhoAudio)=>{
        return new Promise((resolve,reject)=>{
            let saidaAudio = path.resolve(`media/audios/${obterNomeAleatorio(".mp3")}`)
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
}
