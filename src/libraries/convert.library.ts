import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import axios from 'axios'
import {getTempPath, showConsoleLibraryError} from '../utils/general.util.js'
import getBotTexts from '../helpers/bot.texts.helper.js'

export async function convertMp4ToMp3 (sourceType: 'buffer' | 'url',  video: Buffer | string){
    try {
        const inputVideoPath = getTempPath('mp4')
        const outputAudioPath = getTempPath('mp3')

        if(sourceType == 'buffer'){
            if(!Buffer.isBuffer(video)) {
                throw new Error("The media type is Buffer, but the video parameter is not a Buffer.")
            }
                
            fs.writeFileSync(inputVideoPath, video)
        } else if (sourceType == 'url'){
            if(typeof video != 'string') {
                throw new Error("The media type is URL, but the video parameter is not a String.")
            }

            const {data : mediaResponse} = await axios.get(video, {responseType: 'arraybuffer'})
            const videoBuffer = Buffer.from(mediaResponse)
            fs.writeFileSync(inputVideoPath, videoBuffer)
        } else {
            throw new Error("Unsupported media type.")
        }
        
        await new Promise <void> ((resolve, reject)=>{
            ffmpeg(inputVideoPath)
            .outputOptions(['-vn', '-codec:a libmp3lame', '-q:a 3'])
            .save(outputAudioPath)
            .on('end', () => resolve())
            .on("error", (err) => reject(err))
        }).catch((err) =>{
            fs.unlinkSync(inputVideoPath)
            throw err
        })

        const audioBuffer = fs.readFileSync(outputAudioPath)
        fs.unlinkSync(inputVideoPath)
        fs.unlinkSync(outputAudioPath)

        return audioBuffer
    } catch(err){
        showConsoleLibraryError(err, 'convertMp4ToMp3')
        throw new Error(getBotTexts().library_error)
    }
}

export async function convertVideoToWhatsApp(sourceType: 'buffer' | 'url',  video: Buffer | string){
    try {
        const inputVideoPath = getTempPath('mp4')
        const outputVideoPath = getTempPath('mp4')

        if(sourceType == 'buffer'){
            if (!Buffer.isBuffer(video)) {
                throw new Error('The media type is Buffer, but the video parameter is not a Buffer.')
            }
                
            fs.writeFileSync(inputVideoPath, video)
        } else if (sourceType == 'url'){
            if (typeof video != 'string') {
                throw new Error('The media type is URL, but the video parameter is not a String.')
            } 

            const {data : mediaResponse} = await axios.get(video, {responseType: 'arraybuffer'})
            const videoBuffer = Buffer.from(mediaResponse)
            fs.writeFileSync(inputVideoPath, videoBuffer)
        } else {
            throw new Error('Unsupported media type.')
        }
        
        await new Promise <void> ((resolve, reject)=>{
            ffmpeg(inputVideoPath)
            .outputOptions([
                '-c:v libx264',
                '-profile:v baseline',
                '-level 3.0',
                '-pix_fmt yuv420p',
                '-movflags faststart',
                '-crf 23', 
                '-preset fast',
                '-c:a aac',
                '-b:a 128k',
                '-ar 44100',
                '-f mp4'
            ])
            .save(outputVideoPath)
            .on('end', () => resolve())
            .on("error", (err) => reject(err))
        }).catch((err) =>{
            fs.unlinkSync(inputVideoPath)
            throw err
        })

        const videoBuffer = fs.readFileSync(outputVideoPath)
        fs.unlinkSync(inputVideoPath)
        fs.unlinkSync(outputVideoPath)

        return videoBuffer
    } catch(err){
        showConsoleLibraryError(err, 'convertVideoToWhatsApp')
        throw new Error(getBotTexts().library_error)
    }
}

export async function convertVideoToThumbnail(sourceType : "file"|"buffer"|"url", video : Buffer | string){
    try{
        let inputPath : string | undefined
        const outputThumbnailPath = getTempPath('jpg')

        if(sourceType == "file"){
            if (typeof video !== 'string') {
                throw new Error('The media type is File, but the video parameter is not a String.')
            }
        
            inputPath = video
        } else if(sourceType == "buffer"){
            if (!Buffer.isBuffer(video)) {
                throw new Error('The media type is Buffer, but the video parameter is not a Buffer.')
            } 
            
            inputPath = getTempPath('mp4')
            fs.writeFileSync(inputPath, video)
        } else if(sourceType == "url"){
            if (typeof video !== 'string'){
                throw new Error('The media type is URL, but the video parameter is not a String.')
            } 

            const responseUrlBuffer = await axios.get(video,  { responseType: 'arraybuffer' })
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
            .on('error', (err) => reject(err))
        }).catch((err)=>{
            if (sourceType != 'file' && inputPath) {
                fs.unlinkSync(inputPath)
            }

            throw err
        })

        if (sourceType != 'file' && inputPath){
            fs.unlinkSync(inputPath)
        }

        const thumbBase64 : Base64URLString = fs.readFileSync(outputThumbnailPath).toString('base64')
        fs.unlinkSync(outputThumbnailPath)
        
        return thumbBase64
    } catch(err){
        showConsoleLibraryError(err, 'convertVideoToThumbnail')
        throw new Error(getBotTexts().library_error)
    }
}