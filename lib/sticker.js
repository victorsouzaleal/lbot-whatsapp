const {MessageTypes} = require("@open-wa/wa-automate")
const { decryptMedia } = require('@open-wa/wa-decrypt')
const {consoleErro, obterNomeAleatorio} = require("./util")
const fs = require("fs")
var FormData = require('form-data');
const path = require("path")
const axios = require('axios')
const msgs_texto = require('./msgs')

module.exports = {
    removerFundoImagem: async(buffer, mimetype)=>{
        try{
            var imagemEntradaCaminho = path.resolve("media/img/tmp/"+ obterNomeAleatorio(".jpg"))
            fs.writeFileSync(imagemEntradaCaminho, buffer)
            var data = new FormData()
            data.append('file', fs.createReadStream(imagemEntradaCaminho))
            data.append('a', '1')
            var config = {
                method: 'post',
                url: 'https://bg.experte.de/',
                responseType: 'arraybuffer',
                headers: { 
                    'Cookie': '__cfduid=d3b19c3968732fbc23aea58943052fbdc1619231129', 
                    ...data.getHeaders()
                },
                data : data
            }
            var res = await axios(config)
            var base64 = Buffer.from(res.data).toString("base64")
            fs.unlinkSync(imagemEntradaCaminho)
            return `data:${mimetype};base64,${base64}`  
        } catch(err){
            if(fs.existsSync(imagemEntradaCaminho)) fs.unlinkSync(imagemEntradaCaminho)
            if(err.response.status == 500) throw new Error(msgs_texto.figurinhas.sticker.erro_remover)
            else {
                consoleErro(err.message, "STICKER removerFundoImagem")
                throw new Error(msgs_texto.figurinhas.sticker.indisponivel)
            }
        }
    },

    textoParaFoto: async(texto)=>{
        try{
            var res =  await axios.get(encodeURI(`https://api.xteam.xyz/ttp?text=${texto}`))
            return res.data.result
        } catch(err){
            consoleErro(err.message, "STICKER textoParaFoto")
            throw new Error(msgs_texto.figurinhas.tps.erro_conversao)
        }
    },

    textoParaGif: async(texto)=>{
        try{
            var res =  await axios.get(encodeURI(`https://api.xteam.xyz/attp?text=${texto}`))
            return res.data.result.replace("data:image/webp;base64,", "")
        } catch(err){
            consoleErro(err.message, "STICKER textoParaGif")
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