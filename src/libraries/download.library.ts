import {formatSeconds} from '../utils/general.util.js'
import ytdl from '@distube/ytdl-core'
import {instagramGetUrl} from 'instagram-url-direct'
import { getFbVideoInfo } from 'fb-downloader-scrapper'
import Tiktok from '@tobyg74/tiktok-api-dl'
import axios from 'axios'
import yts from 'yt-search'
import { FacebookMedia, InstagramMedia, TiktokMedia, XMedia, YTInfo } from '../interfaces/library.interface.js'

const yt_agent = ytdl.createAgent([{name: 'cookie1', value: 'GPS=1; YSC=CkypMSpfgiI; VISITOR_INFO1_LIVE=4nF8vxPW1gU; VISITOR_PRIVACY_METADATA=CgJCUhIEGgAgZA%3D%3D; PREF=f6=40000000&tz=America.Sao_Paulo; SID=g.a000lggw9yBHfdDri-OHg79Bkk2t6L2X7cbwK7jv8BYZZa4Q1hDbH4SZC5IHPqi_QBmSiigPHAACgYKAYgSARASFQHGX2Mi3N21zLYOMAku61_CaeccrxoVAUF8yKo3X97N4REFyHP4du4RIo1b0076; __Secure-1PSIDTS=sidts-CjIB3EgAEmNr03Tidygwml9aTrgDf0woi14K6jndMv5Ox5uI22tYDMNEYiaAoEF0KjGYgRAA; __Secure-3PSIDTS=sidts-CjIB3EgAEmNr03Tidygwml9aTrgDf0woi14K6jndMv5Ox5uI22tYDMNEYiaAoEF0KjGYgRAA; __Secure-1PSID=g.a000lggw9yBHfdDri-OHg79Bkk2t6L2X7cbwK7jv8BYZZa4Q1hDbYpnHl6jq9y45aoBaqMd96QACgYKAR4SARASFQHGX2MiqFuOgRtuIS_FKmulaCrckxoVAUF8yKpX5r8ISh5S5eQ4eofBuyCg0076; __Secure-3PSID=g.a000lggw9yBHfdDri-OHg79Bkk2t6L2X7cbwK7jv8BYZZa4Q1hDb_8Q3teG8nn23ceeF8jiOvwACgYKAY0SARASFQHGX2MiwBtnenbu4CRMpjQza-asfhoVAUF8yKoFXx_Zxl4MvxGnWSSsnv1z0076; HSID=AWgIQn3iifuaU_eRW; SSID=AR8Jlj2XTnPAmL5kf; APISID=l6PTqM9Dy8G_2E6P/A-sAusHOyG1pQ3T75; SAPISID=OSmwE6VjdFmB1u5-/A2N-7DiRQUreUSpgT; __Secure-1PAPISID=OSmwE6VjdFmB1u5-/A2N-7DiRQUreUSpgT; __Secure-3PAPISID=OSmwE6VjdFmB1u5-/A2N-7DiRQUreUSpgT; LOGIN_INFO=AFmmF2swRQIgShGx2tfQkQV4F8lyKnh4mwj54yTOPJqEdI44sDTtsrwCIQD870Le1gTMDFpz7rRHS6Fk0HzraG_SxHw_PdyLjUDXxg:QUQ3MjNmeVpqbVhSQlNCMnFFZXBKQkhCTHJxY1NXOVlYcG50SHNNOGxGZGZ3Z2ZobWwyOW95WGJ2LVplelNaZ0RfbGU3Tm1uYktDdHBnVm9fd3N3T0NncVpTN0ZaNlRoTTVETDJHSjV6QkxUWmdYWGx0eVFYeEFqa0gxUGdBYUJKbG5oQ2pBd3RBb0ROWXBwcFQwYkpBRktEQXlWbmZIbHJB; SIDCC=AKEyXzXkXTftuhPOtObUSCLHxp1byOAtlesMkptSGp8hyE3d97Dvy2UHd4-2ePWBpzUbQhV6; __Secure-1PSIDCC=AKEyXzXlrhkCIONPS4jCvhmtFb8nAKr8fEFCCFEFqN8BKyrw8tKHFh3-r8EWjrqjAKH9Z9fq0A; __Secure-3PSIDCC=AKEyXzWLIbNbh8dxdyKhTafkyKIbEBwVKGR4lNRhhYX5u_v1k4vBnu4eAS9lgpP-JK2PgiSDJw'}])

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

export async function youtubeMedia (text : string){
    try {
        const isURLValid = ytdl.validateURL(text)
        let videoId : string | undefined

        if(isURLValid) {
            videoId = ytdl.getVideoID(text)
        } else {
            const {videos} = await yts(text).catch(() => {
                throw new Error('Houve um erro ao obter as informações do video, faça uma pesquisa diferente ou tente novamente mais tarde.')
            })

            videoId = videos[0].videoId
        }

        if(!videoId) throw new Error('Houve um erro ao obter o ID do vídeo.')

        const videoInfo = await ytdl.getInfo(videoId, { playerClients: ["WEB", "WEB_EMBEDDED", "ANDROID", "IOS"], agent: yt_agent }).catch((err) => {
            if(err.message == "Status code: 410") throw new Error ('O video parece ter restrição de idade ou precisa de ter login para assistir.')
            else throw err
        })

        const formats = ytdl.filterFormats(videoInfo.formats, "videoandaudio");
        const format = ytdl.chooseFormat(formats, {quality: 'highest'})
        const ytInfo : YTInfo = {
            id_video : videoInfo.player_response.videoDetails.videoId,
            title:  videoInfo.player_response.videoDetails.title,
            description: videoInfo.player_response.videoDetails.shortDescription,
            duration: parseInt(videoInfo.player_response.videoDetails.lengthSeconds),
            keywords: videoInfo.player_response.videoDetails.keywords,
            id_channel: videoInfo.player_response.videoDetails.channelId,
            is_live: videoInfo.player_response.videoDetails.isLiveContent,
            duration_formatted: formatSeconds(parseInt(videoInfo.player_response.videoDetails.lengthSeconds)),
            format: format,
            url: format.url
        }
        
        return ytInfo
    } catch(err) {
        throw err
    }
}