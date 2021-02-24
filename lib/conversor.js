const ffmpeg = require('fluent-ffmpeg')

function converterMp4Mp3(caminho_mp4){
    return new Promise((resolve,reject)=>{
        let timestamp = Math.round(new Date().getTime()/1000), nome_arquivo = `audioconvertidomp4-${timestamp}.mp3`
        ffmpeg(caminho_mp4)
        .outputOptions(["-i"])
        .save(`./media/audios/editados/${nome_arquivo}`)
        .on('end', async () => {
            resolve(path.resolve(`media/audios/editados/${nome_arquivo}`))
        })
        .on("error", (err)=>{
            reject(err.message)
        });
    })
}

exports.converterMp4Mp3 = converterMp4Mp3