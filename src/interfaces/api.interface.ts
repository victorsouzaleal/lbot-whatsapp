import ytdl from '@distube/ytdl-core'

export interface SearchGame {
    uploader: string
    title: string
    uploadDate: string,
    fileSize: string,
    uris: string[]
}

export interface MusicRecognition {
    producer : string,
    duration: string,
    release_date: string,
    album: string,
    title: string,
    artists: string
}

export interface XMedia {
    text: string,
    media: {
        type: "video" | "image",
        url: string
    }[]
}

export interface TiktokMedia {
    author_profile?: string,
    description?: string,
    type: "video" | "image",
    duration : number | null,
    url: string | string []
}

export interface FacebookMedia {
    url: string,
    duration: number,
    sd: string,
    hd: string,
    title: string,
    thumbnail: string,
}

export interface InstagramMedia {
    author_username: string,
    author_fullname: string,
    caption: string,
    likes: number,
    media: {
        type : "video" | "image",
        url : string
    }[]
}

export interface YTInfo {
    id_video: string,
    title: string,
    description: string,
    duration: number,
    is_live: boolean,
    keywords?: string[],
    id_channel: string,
    duration_formatted: string,
    format: ytdl.videoFormat,
    url: string
    
}


export interface AnimeRelease{
    name: string,
    episode: string,
    url: string
}

export interface MangaRelease {
    name: string,
    chapter: string,
    url: string
}

export interface News {
    title: string,
    published: string,
    author: string,
    url: string
}

export interface WebSearch {
    title: string | null,
    url: string | null,
    description: string | null
}

export interface Wheather{
    location: {
        name: string,
        region: string,
        country: string,
        current_time: string
    },
    current: {
        last_updated: string,
        temp: string,
        feelslike: string,
        condition: string,
        wind: string,
        humidity: string,
        cloud: string
    },
    forecast: {
        day : string,
        max: string,
        min: string,
        avg: string,
        condition: string,
        max_wind: string,
        rain : string,
        chance_rain : string,
        snow: string,
        chance_snow : string,
        uv: number
    }[]
}

export interface MusicLyrics {
    title: string,
    artist: string,
    image: string,
    lyrics: string
}

export interface CurrencyConvert {
    value : number,
    currency: string,
    convertion : {
        currency: string,
        convertion_name : any,
        value_converted : string,
        value_converted_formatted : string,
        updated: string
    }[]
}

export interface AnimeRecognition {
    initial_time : string,
    final_time : string,
    episode : string,
    title : string,
    similarity : number,
    preview_url: string
}

export interface ImageSearch {
    id: string,
    url: string,
    width: number,
    height: number,
    color: number,
    preview: {
        url: string,
        width: number,
        height: number,
    },
    origin: {
        title: string,
        website: {
            name: string,
            domain: string,
            url: string,
        }
    }
}

export type StickerOptions = {
    author: string, 
    pack: string, 
    fps: number, 
    type : StickerType
}

export type AudioModificationType = "estourar" | "reverso" | "grave" | "agudo" | "x2" | "volume"

export type FileExtensions = 'mp3' | 'mp4' | 'webp' | 'png' | 'jpg' | 'gif' | 'zip'

export type StickerType = "resize"|"contain"|"circle"