const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath)
const ffprobe = require('ffprobe')
const ffprobePath = require('@ffprobe-installer/ffprobe').path
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

    obterDuracaoVideo: async (url)=>{
        var info = await ffprobe(url, {path: ffprobePath})
        return parseInt(info.streams[0].duration)
    }
}
