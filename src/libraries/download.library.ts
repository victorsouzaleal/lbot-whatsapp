import {formatSeconds} from '../utils/general.util.js'
import ytdl from '@distube/ytdl-core'
import {instagramGetUrl} from 'instagram-url-direct'
import { getFbVideoInfo } from 'fb-downloader-scrapper'
import Tiktok from '@tobyg74/tiktok-api-dl'
import axios from 'axios'
import yts from 'yt-search'
import { ytmp3, ytmp4 } from '@vreden/youtube_scraper'
import { FacebookMedia, InstagramMedia, TiktokMedia, XMedia, YTInfo } from '../interfaces/library.interface.js'

export async function xMedia (url: string){
    try {
        url = url.replace(/twitter\.com|x\.com/g, 'api.vxtwitter.com')

        const {data : xResponse} = await axios.get(url).catch(() => {
            throw new Error('Houve um erro ao tentar obter os dados do X, verifique o link ou tente mais tarde.')
        })

        let xMedia : XMedia  = {
            text : xResponse.text,
            media : []
        }

        xResponse.media_extended.forEach((media : {type: string, url: string})=>{
            xMedia.media.push({
                type: (media.type === 'video') ? 'video' : 'image',
                url: media.url
            })
        })

        return xMedia
    } catch(err) {
        throw err
    }
}

export async function tiktokMedia (url : string){
    try {
        const tiktokResponse = await Tiktok.Downloader(url, {version: "v1"}).catch(() => {
            throw new Error("Houve um erro ao tentar obter os dados do Tiktok, verifique o link ou tente mais tarde.")
        })

        if(tiktokResponse.status === 'error') throw new Error("Houve um erro ao obter as mídias desse link, verifique o link ou tente mais tarde.")

        const tiktokMedia : TiktokMedia = {
            author_profile: tiktokResponse.result?.author.nickname,
            description : tiktokResponse.result?.description,
            type: (tiktokResponse.result?.type === "video") ? "video" : "image",
            duration: tiktokResponse.result?.type == "video" ? parseInt(((tiktokResponse.result?.video?.duration as number)/1000).toFixed(0)) : null,
            url: tiktokResponse.result?.type == "video" ? tiktokResponse.result?.video?.playAddr[0] as string : tiktokResponse.result?.images as string[]
        }

        return tiktokMedia
    } catch(err) {
        throw err
    }
}

export async function facebookMedia(url : string) {
    try {
        const facebookResponse = await getFbVideoInfo(url).catch(() => {
            throw new Error("Houve um erro ao tentar obter os dados do Facebook, verifique o link ou tente mais tarde.")
        })

        const facebookMedia : FacebookMedia = {
            url: facebookResponse.url,
            duration: parseInt((facebookResponse.duration_ms/1000).toFixed(0)),
            sd: facebookResponse.sd,
            hd: facebookResponse.hd,
            title: facebookResponse.title,
            thumbnail: facebookResponse.thumbnail
        }

        return facebookMedia
    } catch(err) {
        throw err
    }
}

export async function instagramMedia (url: string){
    try {
        const instagramResponse = await instagramGetUrl(url).catch(() => {
            throw new Error("Houve um erro ao tentar obter os dados do Instagram, verifique o link ou tente mais tarde.")
        })

        let instagramMedia : InstagramMedia = {
            author_username : instagramResponse.post_info.owner_username,
            author_fullname: instagramResponse.post_info.owner_fullname,
            caption: instagramResponse.post_info.caption,
            likes: instagramResponse.post_info.likes,
            media : []
        }

        for (const url of instagramResponse.url_list) {
            const {headers} = await axios.head(url)
            const type = headers['content-type'] === 'video/mp4' ? 'video' : 'image'
            instagramMedia.media.push({type, url})                  
        }

        return instagramMedia
    } catch(err) {
        throw err
    }
}

export async function youtubeMedia (text : string, type: 'mp3' | 'mp4'){
    try {
        const isURLValid = ytdl.validateURL(text)
        let videoId : string | undefined

        if(isURLValid) {
            videoId = ytdl.getVideoID(text)
        } else {
            const {videos} = await yts(text).catch(() => {
                throw new Error('Houve um erro ao obter as informações da mídia, faça uma pesquisa diferente ou tente novamente mais tarde.')
            })

            videoId = videos[0].videoId
        }

        if(!videoId) throw new Error('Houve um erro ao obter o ID do vídeo.')
        
        let ytResponse : any

        if(type == 'mp4'){
            ytResponse = await ytmp4(`https://www.youtube.com/watch?v=${videoId}`, '480').catch(() => {
                throw new Error ('Houve um erro ao obter as informações do vídeo')
            })
        } else {
            ytResponse = await ytmp3(`https://www.youtube.com/watch?v=${videoId}`, '128').catch(() => {
                throw new Error ('Houve um erro ao obter as informações do áudio')
            })
        }

        const ytInfo : YTInfo = {
            id_video : ytResponse.metadata.videoId,
            title:  ytResponse.metadata.title,
            description: ytResponse.metadata.description,
            duration: ytResponse.metadata.seconds,
            channel: ytResponse.metadata.author.name,
            is_live: ytResponse.metadata.author.type == 'live',
            duration_formatted: ytResponse.metadata.timestamp,
            url: ytResponse.download.url
        }
        
        return ytInfo
    } catch(err) {
        throw err
    }
}