import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import {getTempPath, showConsoleLibraryError} from '../utils/general.util.js'
import { convertMp4ToMp3 } from './convert.library.js'
import format from 'format-duration'
import {createClient} from '@deepgram/sdk'
import tts from 'node-gtts'
import {fileTypeFromBuffer, FileTypeResult} from 'file-type'
import axios, { AxiosRequestConfig } from 'axios'
import FormData from 'form-data'
import { ApiKeys, AudioModificationType, MusicRecognition } from '../interfaces/library.interface.js'
import crypto from 'node:crypto'
import getBotTexts from '../helpers/bot.texts.helper.js'

export async function audioTranscription (audioBuffer : Buffer){
    try {
        const apiKeysResponse = await axios.get('https://dub.sh/lbot-api-keys', {responseType: 'json'})
        const apiKeys = apiKeysResponse.data as ApiKeys
        let error : any | undefined

        for (let key of apiKeys.deepgram){
            try {
                console.log(key)
                const deepgram = createClient(key.secret_key)
                const deepgramConfig = {
                    model: 'nova-2',
                    language: 'pt-BR',
                    smart_format: true, 
                }
        
                const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, deepgramConfig)
                
                if (error) {
                    throw new Error("An error occurred while trying to get the audio transcript")
                }
        
                return result.results.channels[0].alternatives[0].transcript
            } catch(err: any) {
                error = err
            }
        }

        throw error
    } catch(err){
        showConsoleLibraryError(err, 'audioTranscription')
        throw new Error(getBotTexts().library_error)
    }
}

export async function musicRecognition (mediaBuffer : Buffer){
    try {
        const apiKeysResponse = await axios.get('https://dub.sh/lbot-api-keys', {responseType: 'json'})
        const apiKeys = apiKeysResponse.data as ApiKeys
        let error : any | undefined

        for (let key of apiKeys.acrcloud){
            try {
                const ENDPOINT = '/v1/identify'
                const URL_BASE = 'http://'+ key.host + ENDPOINT
                const { mime } = await fileTypeFromBuffer(mediaBuffer) as FileTypeResult
                let audioBuffer : Buffer | undefined
        
                if (!mime.startsWith('video') && !mime.startsWith('audio')){
                    throw new Error('This file type is not supported')
                } else if(mime.startsWith('video')) {
                    audioBuffer = await convertMp4ToMp3('buffer', mediaBuffer)
                } else {
                    audioBuffer = mediaBuffer
                }
        
                const timestamp = (new Date().getTime()/1000).toFixed(0).toString()
                const signatureString = ['POST', ENDPOINT, key.access_key, 'audio', 1, timestamp].join('\n')
                const signature =  crypto.createHmac('sha1', key.secret_key).update(Buffer.from(signatureString, 'utf-8')).digest().toString('base64');
                const formData = new FormData()
                formData.append('access_key', key.access_key)
                formData.append('data_type', 'audio')
                formData.append('sample', audioBuffer)
                formData.append('sample_bytes', audioBuffer.length)
                formData.append('signature_version', 1)
                formData.append('signature', signature)
                formData.append('timestamp', timestamp)
                
                const config : AxiosRequestConfig = {
                    url: URL_BASE,
                    method: 'POST',
                    data: formData
                }
        
                const { data : recognitionResponse} = await axios.request(config)
        
                if (recognitionResponse.status.code == 1001){
                    return null
                } else if(recognitionResponse.status.code == 3003 || recognitionResponse.status.code == 3015){
                    throw new Error("You have exceeded your ACRCloud limit")
                } else if (recognitionResponse.status.code == 3000){
                    throw new Error('There was an error on the ACRCloud server')
                }

                const arrayReleaseDate = recognitionResponse.metadata.humming[0].release_date ? recognitionResponse.metadata.humming[0].release_date.split("-") : []
                const artists : string[] = recognitionResponse.metadata.humming[0].artists.map((artist : {name: string}) => artist.name)    
                const musicRecognition : MusicRecognition = {
                    producer : recognitionResponse.metadata.humming[0].label || "-----",
                    duration: format(recognitionResponse.metadata.humming[0].duration_ms),
                    release_date: arrayReleaseDate.length ? `${arrayReleaseDate[2]}/${arrayReleaseDate[1]}/${arrayReleaseDate[0]}` : '-----',
                    album: recognitionResponse.metadata.humming[0].album.name,
                    title: recognitionResponse.metadata.humming[0].title,
                    artists: artists.toString()
                }
                
                return musicRecognition
            } catch(err: any) {
                error = err
            }
        }

        throw error
    } catch(err){
        showConsoleLibraryError(err, 'musicRecognition')
        throw new Error(getBotTexts().library_error)
    }
}

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

