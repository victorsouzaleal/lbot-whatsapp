import axios, { AxiosRequestConfig } from 'axios'
import {getRandomFilename} from '../lib/util.lib.js'
import duration from 'format-duration-time'
import google from '@victorsouzaleal/googlethis'
import FormData from 'form-data'
import getEmojiMixUrl, {checkSupported} from 'emoji-mixer'
import {ImageUploadService} from 'node-upload-images'
import { AnimeRecognition, ImageSearch } from '../interfaces/api.interface.js'

export async function uploadImage(imageBuffer : Buffer){
    try {
        const service = new ImageUploadService('pixhost.to')
        const { directLink } = await service.uploadFromBinary(imageBuffer, getRandomFilename("png")).catch(() =>{
            throw new Error("Houve um erro ao fazer o upload de imagem, tente novamente mais tarde.")
        })

        return directLink
    } catch(err){
        throw err
    }
}

export async function emojiMix(emoji1: string, emoji2: string){
    try {
        const isSupportedEmoji1  = checkSupported(emoji1, true)
        const isSupportedEmoji2  = checkSupported(emoji2, true)

        if(!isSupportedEmoji1 && !isSupportedEmoji2 ) throw new Error(`${emoji1} e ${emoji2} não são válidos para a união.`)
        else if(!isSupportedEmoji1) throw new Error(`${emoji1} não é válido para a união.`)
        else if (!isSupportedEmoji2) throw new Error(`${emoji2} não é válido para a união`)

        const emojiUrl = getEmojiMixUrl(emoji1, emoji2, false, true)

        if(!emojiUrl) throw new Error("Emojis não compatíveis para união")
        
        const { data : imageBuffer} = await axios.get(emojiUrl, {responseType: 'arraybuffer'}).catch(() => {
            throw new Error("Houve um erro ao realizar o download de emojis, tente novamente mais tarde.")
        })

        return imageBuffer as Buffer
    } catch(err){
        throw err
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

        const {data : uploadResponse} = await axios.request(configUpload).catch(()=>{
            throw new Error("Houve um erro ao realizar o upload da imagem, tente novamente mais tarde.")
        })

        if(!uploadResponse.isSuccess) throw new Error("Tamanho da foto excedeu o limite")

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

        const {data : removeBgResponse} = await axios.request(configRemoveBg).catch(()=>{
            throw new Error("Houve um erro ao remover o fundo da imagem, tente novamente mais tarde.")
        })

        const pictureUrl = removeBgResponse.match(/https:\/\/download1\.imageonline\.co\/download\.php\?filename=[A-Za-z0-9]+-imageonline\.co-[0-9]+\.png/m)[0]
        
        const { data : imageBufferRemovedBg } = await axios.get(pictureUrl, {responseType: 'arraybuffer'}).catch(()=>{
            throw new Error("Houve um erro ao fazer o download da imagem sem fundo, tente novamente mais tarde.")
        })

        return imageBufferRemovedBg as Buffer
    } catch(err){
        throw err
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
            if(err.status == 429) throw new Error('Muitas solicitações sendo feitas, tente novamente mais tarde.')
            else if(err.status == 400) throw new Error('Não foi possível achar resultados para esta imagem')
            else throw new Error('Houve um erro ao obter reconhecimento do anime, tente novamente mais tarde.')
        })

        const {result : animes} = await animesResponse.json()
        const msInitial = Math.round(animes[0].from * 1000) 
        const msFinal = Math.round(animes[0].to * 1000)
        const animeInfo : AnimeRecognition = {
            initial_time : duration.default(msInitial).format("h:mm:ss"),
            final_time: duration.default(msFinal).format("h:mm:ss"),
            episode: animes[0].episode,
            title: animes[0].anilist.title.english || animes[0].anilist.title.romaji,
            similarity: parseInt((animes[0].similarity * 100).toFixed(2)),
            preview_url: animes[0].video
        }

        return animeInfo
    } catch(err){
        throw err
    }
}

export async function imageSearchGoogle(text: string){
    try {
        let imagesResult : ImageSearch[] = []

        const images = await google.image(text, { safe: false, additional_params:{hl: 'pt'}}).catch(()=>{
            throw new Error("Houve um erro ao obter imagens, tente novamente mais tarde.")
        })

        if(!images.length) throw new Error("Nenhum resultado foi encontrado para esta pesquisa.")
        
        for (let image of images){
            if(image.preview) imagesResult.push(image)
        }

        return imagesResult
    } catch(err){
        throw err
    }
}