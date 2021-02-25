const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path')

module.exports ={
    converterMp4Mp3 : (caminho_mp4) => {
        return new Promise((resolve,reject)=>{
            let timestamp = Math.round(new Date().getTime()/1000), nome_arquivo = `audioqualmusica-${timestamp}.mp3`
            ffmpeg(caminho_mp4)
            .save(path.resolve(`media/audios/originais/${nome_arquivo}`))
            .on('end', async () => {
                resolve(path.resolve(`media/audios/originais/${nome_arquivo}`))
            })
            .on("error", (err)=>{
                reject(err.message)
            });
        })
    }
}
