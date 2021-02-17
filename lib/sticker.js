const path = require('path')
const fs = require(`fs-extra`)
const {removeBackgroundFromImageBase64} = require('remove.bg')
const {exec} = require('child_process')
const color = require(path.resolve("lib/color.js"))
const {consoleErro} = require("./util")
const axios = require('axios')
const { msgs_texto } = require('./msgs')

module.exports = {
    stickerGif : (mediaData , mimetype )=>{
        return new Promise(async (resolve,reject)=>{
            const filename = `./media/aswu.${mimetype.split('/')[1]}`
            await fs.writeFileSync(filename, mediaData)
            await exec(`gify ${filename} ./media/output.gif --fps=10 --scale=240:240`, async function (error, stdout, stderr) {
                if(error) reject(error)
                const gif = await fs.readFileSync(path.resolve('media/output.gif'), { encoding: "base64" })
                resolve(`data:image/gif;base64,${gif.toString('base64')}`)
            })
        }) 
    },
    stickerSemFundo: async (imageBase64, mimetype)=>{
        try{
            let result = await removeBackgroundFromImageBase64({base64img: imageBase64, apiKey: process.env.API_REMOVE_BG, size: 'auto', type: 'auto'})
            return `data:${mimetype};base64,${result.base64img}`
        } catch(err){
            switch(err[0].code){
                case 'insufficient_credits':
                    consoleErro(msgs_texto.api.removebg, "STICKER - REMOVEBG")
                    throw new Error(msgs_texto.utilidades.sticker.sem_credito)
                case 'auth_failed':
                    consoleErro(msgs_texto.api.removebg, "STICKER - REMOVEBG")
                    throw new Error(msgs_texto.utilidades.sticker.autenticacao)
                default:
                    throw new Error(msgs_texto.utilidades.sticker.erro_remover)
            }
        }
    },
    textoParaSticker: (texto)=>{
        return new Promise(async (resolve,reject)=>{
            axios.get(`https://st4rz.herokuapp.com/api/ttp?kata=${texto}`).then(resp=>{
                resolve(resp.data.result)
            }).catch(()=>{
                reject(msgs_texto.utilidades.tps.erro_conversao)
            })
        })  
    }
}