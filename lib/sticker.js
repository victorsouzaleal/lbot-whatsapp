const {removeBackgroundFromImageBase64} = require('remove.bg')
const {MessageTypes} = require("@open-wa/wa-automate")
const { decryptMedia } = require('@open-wa/wa-decrypt')
const {consoleErro} = require("./util")
const axios = require('axios')
const msgs_texto = require('./msgs')

module.exports = {
    removerFundoImagem : async (imagemBase64, mimetype)=>{
        try{
            let result = await removeBackgroundFromImageBase64({base64img: imagemBase64, apiKey: process.env.API_REMOVE_BG.trim(), size: 'auto', type: 'auto'})
            return `data:${mimetype};base64,${result.base64img}`
        } catch(err){
            switch(err[0].code){
                case 'insufficient_credits':
                    consoleErro(msgs_texto.api.removebg.sem_creditos, "STICKER removerFundoImagem")
                    throw new Error(msgs_texto.figurinhas.sticker.indisponivel)
                case 'auth_failed':
                    consoleErro(msgs_texto.api.removebg.autenticacao_falha, "STICKER removerFundoImagem")
                    throw new Error(msgs_texto.figurinhas.sticker.indisponivel)
                case 'unknown_foreground':
                    throw new Error(msgs_texto.figurinhas.sticker.erro_remover)
                default:
                    consoleErro(err, "STICKER removerFundoImagem")
                    throw new Error(msgs_texto.figurinhas.sticker.indisponivel)
            }
        }
    },

    textoParaFoto: async(texto)=>{
        try{
            try{
                var res =  await axios.get(encodeURI(`https://st4rz.herokuapp.com/api/ttp?kata=${texto}`))
                return res.data.result
            } catch {
                var res =  await axios.get(encodeURI(`https://api.xteam.xyz/ttp?text=${texto}`))
                return res.data.result
            }
        } catch(err){
            consoleErro(err.message, "STICKER textoParaFoto")
            throw new Error(msgs_texto.figurinhas.tps.erro_conversao)
        }
    },

    autoSticker: async(client, message)=>{
        try{
            const {from, mimetype} = message 
            const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    
            if(message.type == MessageTypes.IMAGE){
                var stickerMetadata = {
                    author: "LBOT", 
                    pack: "LBOT Stickers", 
                    keepScale: true, 
                    circle: false, 
                    discord: "701084178112053288"
                }
    
                var mediaData = await decryptMedia(message, uaOverride)
                var imagemBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendImageAsSticker(from, imagemBase64, stickerMetadata)
            }
    
            if(message.type == MessageTypes.VIDEO){
                var stickerMetadata = {
                    author: "LBOT", 
                    pack: "LBOT Sticker Animado", 
                    keepScale: false, 
                    discord: "701084178112053288"
                }
                var configConversao = {
                    endTime: "00:00:11.0",
                    crop: true,
                    fps:9,
                    square:240
                }
                if(message.duration > 11) return
                var mediaData = await decryptMedia(message, uaOverride)
                var base64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                await client.sendMp4AsSticker(from, base64, configConversao, stickerMetadata)
            }
        } catch(err){
            throw err
        }
    }

}