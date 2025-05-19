import axios, { AxiosRequestConfig } from 'axios'
import {getRandomFilename, showConsoleLibraryError} from './general.util.js'
import format from 'format-duration'
import google from '@victorsouzaleal/googlethis'
import FormData from 'form-data'
import getEmojiMixUrl, { checkSupported } from 'emoji-mixer'
import {ImageUploadService} from 'node-upload-images'
import { AnimeRecognition, ImageSearch } from '../interfaces/library.interface.js'
import botTexts from '../helpers/bot.texts.helper.js'

export async function uploadImage(imageBuffer : Buffer){
    try {
        const service = new ImageUploadService('pixhost.to')
        const { directLink } = await service.uploadFromBinary(imageBuffer, getRandomFilename("png"))

        return directLink
    } catch(err){
        showConsoleLibraryError(err, 'uploadImage')
        throw new Error(botTexts.library_error)
    }
}

export async function checkEmojiMixSupport(emoji1: string, emoji2: string){
    try {
        const emojiSupport = {
            emoji1 : checkSupported(emoji1, true) ? true : false,
            emoji2 : checkSupported(emoji2, true) ? true : false
        }

        return emojiSupport
    } catch(err){
        showConsoleLibraryError(err, 'checkEmojiMixSupport')
        throw new Error(botTexts.library_error)
    }
}

export async function emojiMix(emoji1: string, emoji2: string){
    try {
        const emojiUrl = getEmojiMixUrl(emoji1, emoji2, false, true)

        if(!emojiUrl) {
            return null
        }
        
        const { data : imageBuffer} = await axios.get(emojiUrl, {responseType: 'arraybuffer'})

        return imageBuffer as Buffer
    } catch(err){
        showConsoleLibraryError(err, 'emojiMix')
        throw new Error(botTexts.library_error)
    }
}

export async function removeBackground(imageBuffer: Buffer){
    try {
        const URL_BASE_UPLOAD_IMAGE = 'https://download1.imageonline.co/ajax_upload_file.php'
        const URL_BASE_REMOVE_BG = 'https://download1.imageonline.co/pngmaker.php'
        const uploadFileName = getRandomFilename("png")
        const formDataUpload = new FormData();
        formDataUpload.append('files', imageBuffer, {filename: uploadFileName})
        const configUpload : AxiosRequestConfig = {
            method: 'post',
            maxBodyLength: Infinity,
            url: URL_BASE_UPLOAD_IMAGE,
            headers: { 
                'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0', 
                'Accept': ' */*', 
                'Origin': ' https://imageonline.co', 
                'Connection': ' keep-alive', 
                'Referer': ' https://imageonline.co/', 
                'Sec-Fetch-Dest': ' empty', 
                'Sec-Fetch-Mode': ' cors', 
                'Sec-Fetch-Site': ' same-site',
                ...formDataUpload.getHeaders()
            },
            data : formDataUpload,
            responseType : "json"
        }

        const {data : uploadResponse} = await axios.request(configUpload)

        if(!uploadResponse.isSuccess) {
            throw new Error("Upload failed")
        }

        const formDataRemoveBg = new FormData()
        formDataRemoveBg.append('name', uploadResponse.files[0].name)
        formDataRemoveBg.append('originalname', uploadResponse.files[0].old_name)
        formDataRemoveBg.append('option3', uploadResponse.files[0].extension)
        formDataRemoveBg.append('option4', '1')
        const configRemoveBg = {
            method: 'post',
            maxBodyLength: Infinity,
            url: URL_BASE_REMOVE_BG,
            headers: { 
            'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0', 
            'Accept': ' */*', 
            'Origin': ' https://imageonline.co', 
            'Connection': ' keep-alive', 
            'Referer': ' https://imageonline.co/', 
            'Sec-Fetch-Dest': ' empty', 
            'Sec-Fetch-Mode': ' cors', 
            'Sec-Fetch-Site': ' same-site'
            },
            data : formDataRemoveBg
        }

        const {data : removeBgResponse} = await axios.request(configRemoveBg)
        const pictureUrl = removeBgResponse.match(/https:\/\/download1\.imageonline\.co\/download\.php\?filename=[A-Za-z0-9]+-imageonline\.co-[0-9]+\.png/m)[0]
        const { data : imageBufferRemovedBg } = await axios.get(pictureUrl, {responseType: 'arraybuffer'})

        return imageBufferRemovedBg as Buffer
    } catch(err){
        showConsoleLibraryError(err, 'removeBackground')
        throw new Error(botTexts.library_error)
    }
}

export async function animeRecognition(imageBuffer : Buffer){ 
    try {
        const URL_BASE = 'https://api.trace.moe/search?anilistInfo'
        const requestConfig = {
            method: "POST",
            body: imageBuffer,
            headers: { 
                "Content-type": "image/jpeg" 
            },
        }

        const animesResponse = await fetch(URL_BASE, requestConfig).catch((err)=>{
            if (err.status == 429){
                throw new Error('Too many requests at moment.')
            } else if (err.status == 400){
                return null
            } else {
                throw err
            }
        })

        if(!animesResponse) {
            return null
        }

        const {result : animes} = await animesResponse.json()
        const msInitial = Math.round(animes[0].from * 1000) 
        const msFinal = Math.round(animes[0].to * 1000)
        const animeInfo : AnimeRecognition = {
            initial_time : format(msInitial),
            final_time: format(msFinal),
            episode: animes[0].episode,
            title: animes[0].anilist.title.english || animes[0].anilist.title.romaji,
            similarity: parseInt((animes[0].similarity * 100).toFixed(2)),
            preview_url: animes[0].video
        }

        return animeInfo
    } catch(err){
        showConsoleLibraryError(err, 'animeRecognition')
        throw new Error(botTexts.library_error)
    }
}

export async function imageSearchGoogle(text: string){
    try {
        const images = await google.image(text, { safe: false, additional_params:{hl: 'pt'}})

        if (!images.length) {
            throw new Error("Nenhum resultado foi encontrado para esta pesquisa.")
        }
        
        const imagesResult : ImageSearch[] = images.map(image => image.preview ? image : undefined).filter(image => image !== undefined)

        return imagesResult
    } catch(err){
        showConsoleLibraryError(err, 'imageSearchGoogle')
        throw new Error(botTexts.library_error)
    }
}