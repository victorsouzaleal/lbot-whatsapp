const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path')
const {getRandomName} = require('./util')

module.exports ={
    convertMp4ToMp3 : (inputFile) => {
        return new Promise((resolve,reject)=>{
            let outputFile = path.resolve(`media/audios/${getRandomName(".mp3")}`)
            ffmpeg(inputFile)
            .on('end', () => {
                resolve(outputFile)
            })
            .on("error", (err)=>{
                reject(err.message)
            })
            .save(outputFile)
        })
    },
}
