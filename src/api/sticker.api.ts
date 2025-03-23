import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs-extra'
import crypto from 'node:crypto'
import webp from "node-webpmux"
import {getTempPath} from '../utils/general.utils.js'
import {fileTypeFromBuffer} from 'file-type'
import jimp from 'jimp'
import { StickerOptions, StickerType } from "../interfaces/api.interface.js"

export async function createSticker(mediaBuffer : Buffer, {pack = 'LBOT', author = 'LBOT Stickers', fps = 9, type = 'resize'}: StickerOptions){
    try {
        const bufferSticker = await stickerCreation(mediaBuffer, {pack, author, fps, type}).catch(()=>{
            throw new Error("Houve um erro ao criar o sticker, use outra foto/video ou tente novamente mais tarde.")
        })

        return bufferSticker
    } catch(err){
        throw err
    }
}

export async function renameSticker(stickerBuffer: Buffer, pack: string, author: string){
    try {
        const stickerBufferModified = await addExif(stickerBuffer, pack, author).catch(()=>{
            throw new Error('Houve um erro ao renomear o sticker, use outro sticker ou tente novamente mais tarde.')
        })

        return stickerBufferModified
    } catch(err){
        throw err
    }
}

export async function stickerToImage(stickerBuffer: Buffer){
    try {
        const inputWebpPath = getTempPath('webp')
        const outputPngPath = getTempPath('png')
        fs.writeFileSync(inputWebpPath, stickerBuffer)

        await new Promise <void>((resolve, reject) => {
            ffmpeg(inputWebpPath)
            .save(outputPngPath)
            .on('end', () => resolve())
            .on('error', () => reject())
        }).catch(()=>{
            throw new Error('Houve um erro ao converter o sticker para imagem, use outro sticker ou tente novamente mais tarde.')
        })

        const imageBuffer = fs.readFileSync(outputPngPath)
        fs.unlinkSync(inputWebpPath)
        fs.unlinkSync(outputPngPath)

        return imageBuffer
    } catch(err){
        throw err
    }
}

async function stickerCreation(mediaBuffer : Buffer, {author, pack, fps, type} : StickerOptions){
    try{
        const bufferData = await fileTypeFromBuffer(mediaBuffer)

        if(!bufferData) throw new Error("Não foi possível obter os dados do mídia enviada.")

        const mime = bufferData.mime
        const isAnimated = mime.startsWith('video') || mime.includes('gif') 
        const webpBuffer = await webpConvertion(mediaBuffer, isAnimated, fps, type)
        const stickerBuffer = await addExif(webpBuffer, pack, author)

        return stickerBuffer
    } catch(err){
        throw err
    }   
}

async function addExif(buffer: Buffer, pack: string, author: string){
    try{
        const img = new webp.Image()
        const stickerPackId = crypto.randomBytes(32).toString('hex')
        const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': pack, 'sticker-pack-publisher': author}
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
        const exif = Buffer.concat([exifAttr, jsonBuffer])
        exif.writeUIntLE(jsonBuffer.length, 14, 4)
        await img.load(buffer)
        img.exif = exif
        const stickerBuffer : Buffer = await img.save(null)

        return stickerBuffer
    } catch(err){
        throw err
    }
}

async function webpConvertion(mediaBuffer : Buffer, isAnimated: boolean, fps: number, type : StickerType){
    try {
        let inputMediaPath
        let options
        let outputMediaPath = getTempPath('webp')

        if(isAnimated){
            inputMediaPath = getTempPath('mp4')
            options = [
                "-vcodec libwebp",
                "-filter:v",
                `fps=fps=${fps}`,
                "-lossless 0",
                "-compression_level 4",
                "-q:v 10",
                "-loop 1",
                "-preset picture",
                "-an",
                "-vsync 0",
                "-s 512:512"
            ]
        } else{
            inputMediaPath = getTempPath('png')
            mediaBuffer = await editImage(mediaBuffer, type)
            options = [
                "-vcodec libwebp",
                "-loop 0",
                "-lossless 1",
                "-q:v 100"
            ]
        }

        fs.writeFileSync(inputMediaPath, mediaBuffer)

        await new Promise <void>((resolve, reject) => {
            ffmpeg(inputMediaPath)
            .outputOptions(options)
            .save(outputMediaPath)
            .on('end', () => resolve())
            .on('error', (err) => reject(err))
        }).catch((err)=>{
            fs.unlinkSync(inputMediaPath)
            throw err
        })

        const webpBuffer = fs.readFileSync(outputMediaPath)
        fs.unlinkSync(outputMediaPath)
        fs.unlinkSync(inputMediaPath)

        return webpBuffer
    } catch(err){
        throw err
    }
}

async function editImage(imageBuffer: Buffer, type: StickerType){
    const image = await jimp.read(imageBuffer)
    
    if(type === 'resize') image['resize'](512,512)
    else if (type === 'contain') image['contain'](512,512)
    else if(type === 'circle'){
        image['resize'](512,512)
        image.circle()
    }

    return image.getBufferAsync('image/png')
}