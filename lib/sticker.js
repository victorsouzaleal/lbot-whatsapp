const {removeBackgroundFromImageBase64} = require('remove.bg')
const {consoleError} = require("./util")
const axios = require('axios')
const msgs_texto = require('./msgs')

module.exports = {
    imageRemoveBackground : async (imageBase64, mimetype)=>{
        try{
            let result = await removeBackgroundFromImageBase64({base64img: imageBase64, apiKey: process.env.API_REMOVE_BG.trim(), size: 'auto', type: 'auto'})
            return `data:${mimetype};base64,${result.base64img}`
        } catch(err){
            switch(err[0].code){
                case 'insufficient_credits':
                    consoleError(msgs_texto.api.removebg.sem_creditos, "STICKER imageRemoveBackground")
                    throw new Error(msgs_texto.utilidades.sticker.indisponivel)
                case 'auth_failed':
                    consoleError(msgs_texto.api.removebg.autenticacao_falha, "STICKER imageRemoveBackground")
                    throw new Error(msgs_texto.utilidades.sticker.indisponivel)
                case 'unknown_foreground':
                    throw new Error(msgs_texto.utilidades.sticker.erro_remover)
                default:
                    consoleError(err, "STICKER imageRemoveBackground")
                    throw new Error(msgs_texto.utilidades.sticker.indisponivel)
            }
        }
    },
    textToPicture: async(text)=>{
        try{
            let res =  await axios.get(`https://st4rz.herokuapp.com/api/ttp?kata=${text}`)
            return res.data.result
        } catch(err){
            consoleError(err.message, "STICKER textToPicture")
            throw new Error(msgs_texto.utilidades.tps.erro_conversao)
        }
    }
}