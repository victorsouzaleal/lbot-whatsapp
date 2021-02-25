const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

function converterMp4Mp3(caminho_mp4){
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

exports.converterMp4Mp3 = converterMp4Mp3