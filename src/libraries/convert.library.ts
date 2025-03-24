import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import axios from 'axios'
import {getTempPath} from '../utils/general.util.js'

export async function convertMp4ToMp3 (sourceType: 'buffer' | 'url',  video: Buffer | string){
    try {
        const inputVideoPath = getTempPath('mp4')
        const outputAudioPath = getTempPath('mp3')

        if(sourceType == 'buffer'){
            if(!Buffer.isBuffer(video)) throw new Error("O tipo selecionado da mídia foi Buffer mas a mídia não é um Buffer.")
                
            fs.writeFileSync(inputVideoPath, video)
        } else if (sourceType == 'url'){
            if(typeof video != 'string') throw new Error("O tipo selecionado da mídia foi URL mas a mídia não é uma URL.")

            const {data : mediaResponse} = await axios.get(video, {responseType: 'arraybuffer'}).catch(() => {
                throw new Error("Houve um erro ao fazer download do vídeo para converter para MP3.")
            })

            const videoBuffer = Buffer.from(mediaResponse)
            fs.writeFileSync(inputVideoPath, videoBuffer)
        } else {
            throw new Error("Tipo de mídia não suportada.")
        }
        
        await new Promise <void> ((resolve, reject)=>{
            ffmpeg(inputVideoPath)
            .outputOptions(['-vn', '-codec:a libmp3lame', '-q:a 3'])
            .save(outputAudioPath)
            .on('end', () => resolve())
            .on("error", () => reject())
        }).catch(() =>{
            fs.unlinkSync(inputVideoPath)
            throw new Error("Houve um erro ao converter de MP4 para MP3, use outro vídeo ou tente novamente mais tarde.")
        })

        const audioBuffer = fs.readFileSync(outputAudioPath)
        fs.unlinkSync(inputVideoPath)
        fs.unlinkSync(outputAudioPath)

        return audioBuffer
    } catch(err){
        throw err
    }
}

export async function convertVideoToThumbnail(sourceType : "file"|"buffer"|"url", video : Buffer | string){
    try{
        let inputPath : string | undefined
        const outputThumbnailPath = getTempPath('jpg')

        if(sourceType == "file"){
            if(typeof video !== 'string') throw new Error('O tipo de operação está definido como FILE mas a mídia enviada não é um caminho de arquivo válido.')
        
            inputPath = video
        } else if(sourceType == "buffer"){
            if(!Buffer.isBuffer(video)) throw new Error('O tipo de operação está definido como BUFFER mas a mídia enviada não é um buffer válido.')
            
            inputPath = getTempPath('mp4')
            fs.writeFileSync(inputPath, video)
        } else if(sourceType == "url"){
            if(typeof video !== 'string') throw new Error('O tipo de operação está definido como URL mas a mídia enviada não é uma url válida.')

            const responseUrlBuffer = await axios.get(video,  { responseType: 'arraybuffer' }).catch(()=>{
                throw new Error("Houve um erro ao fazer download da mídia para a thumbnail, tente novamente mais tarde.")
            })

            const bufferUrl = Buffer.from(responseUrlBuffer.data, "utf-8")
            inputPath = getTempPath('mp4')
            fs.writeFileSync(inputPath, bufferUrl)
        }

        await new Promise <void> (async (resolve, reject)=>{
            ffmpeg(inputPath)
            .addOption("-y")
            .inputOptions(["-ss 00:00:00"])
            .outputOptions(["-vf scale=32:-1", "-vframes 1", "-f image2"])
            .save(outputThumbnailPath)
            .on('end', () => resolve())
            .on('error', () => reject())
        }).catch(()=>{
            throw new Error("Houve um erro ao conversão a mídia para thumbnail, tente novamente mais tarde.")
        })

        if(sourceType != 'file' && inputPath) fs.unlinkSync(inputPath)

        const thumbBase64 : Base64URLString = fs.readFileSync(outputThumbnailPath).toString('base64')
        fs.unlinkSync(outputThumbnailPath)
        
        return thumbBase64
    } catch(err){
        throw err
    }
}