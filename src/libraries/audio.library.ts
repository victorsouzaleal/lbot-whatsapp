import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import {getTempPath, showConsoleLibraryError} from '../utils/general.util.js'
import tts from 'node-gtts'
import { AudioModificationType } from '../interfaces/library.interface.js'
import getBotTexts from '../helpers/bot.texts.helper.js'

export async function textToVoice (lang: "pt" | 'en' | 'ja' | 'es' | 'it' | 'ru' | 'ko' | 'sv', text: string){
    try {
        const audioPath = getTempPath("mp3")

        await new Promise <void>((resolve) =>{
            tts(lang).save(audioPath, text, () => resolve())
        })

        const audioBuffer = fs.readFileSync(audioPath)
        fs.unlinkSync(audioPath)

        return audioBuffer
    } catch(err){
        showConsoleLibraryError(err, 'textToVoice')
        throw new Error(getBotTexts().library_error)
    }
}

export async function audioModified (audioBuffer: Buffer, type: AudioModificationType){
    try {
        const inputAudioPath = getTempPath('mp3')
        const outputAudioPath = getTempPath('mp3')
        let options : string[] = []
        fs.writeFileSync(inputAudioPath, audioBuffer)

        switch(type){
            case "estourar":
                options = ["-y", "-filter_complex", "acrusher=level_in=3:level_out=5:bits=10:mode=log:aa=1"] 
                break
            case "reverso":
                options = ["-y", "-filter_complex", "areverse"]
                break
            case "grave":
                options = ["-y", "-af", "asetrate=44100*0.8"]
                break
            case "agudo":
                options = ["-y", "-af", "asetrate=44100*1.4"]
                break
            case "x2":
                options = ["-y", "-filter:a", "atempo=2.0", "-vn"]
                break
            case "volume":
                options = ["-y", "-filter:a", "volume=4.0"]
                break
            default:
                fs.unlinkSync(inputAudioPath)
                throw new Error(`This type of editing is not supported`)
        }
        
        await new Promise <void>((resolve, reject) => {
            ffmpeg(inputAudioPath)
            .outputOptions(options)
            .save(outputAudioPath)
            .on('end', () => resolve())
            .on("error", (err) => reject(err))
        }).catch((err)=>{
            fs.unlinkSync(inputAudioPath)
            throw err
        })

        const bufferModifiedAudio = fs.readFileSync(outputAudioPath)
        fs.unlinkSync(inputAudioPath)
        fs.unlinkSync(outputAudioPath)
        
        return bufferModifiedAudio
    } catch(err){
        showConsoleLibraryError(err, 'audioTranscription')
        throw new Error(getBotTexts().library_error)
    }
}

