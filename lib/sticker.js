const {removeBackgroundFromImageBase64} = require('remove.bg')
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
                    throw new Error(msgs_texto.utilidades.sticker.indisponivel)
                case 'auth_failed':
                    consoleErro(msgs_texto.api.removebg.autenticacao_falha, "STICKER removerFundoImagem")
                    throw new Error(msgs_texto.utilidades.sticker.indisponivel)
                case 'unknown_foreground':
                    throw new Error(msgs_texto.utilidades.sticker.erro_remover)
                default:
                    consoleErro(err, "STICKER removerFundoImagem")
                    throw new Error(msgs_texto.utilidades.sticker.indisponivel)
            }
        }
    },
    textoParaFoto: async(texto)=>{
        try{
            let res =  await axios.get(`https://st4rz.herokuapp.com/api/ttp?kata=${texto}`)
            return res.data.result
        } catch(err){
            consoleErro(err.message, "STICKER textoParaFoto")
            throw new Error(msgs_texto.utilidades.tps.erro_conversao)
        }
    }
}