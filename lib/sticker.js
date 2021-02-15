const path = require('path')
const fs = require(`fs-extra`)
const {removeBackgroundFromImageBase64} = require('remove.bg')
const {exec} = require('child_process')
const color = require(path.resolve("lib/color.js"))
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
    stickerSemFundo:(imageBase64, mimetype)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                let result = await removeBackgroundFromImageBase64({base64img: imageBase64, apiKey: process.env.API_REMOVE_BG , size: 'auto', type: 'auto'})
                resolve(`data:${mimetype};base64,${result.base64img}`)
            } catch(err) {
                console.log('\x1b[1;31m~\x1b[1;37m>', color("[API]","red"), msgs_texto.api.removebg)
                if(err[0].code) reject(err[0].code)
            }
        })
    },
    textoParaSticker: (texto)=>{
        return new Promise(async (resolve,reject)=>{
            axios.get(`https://st4rz.herokuapp.com/api/ttp?kata=${texto}`).then(resp=>{
                resolve(resp.data.result)
            }).catch(()=>{
                reject(msgs_texto.utilidades.tps.erro_conversao)
            })
            /*
            const textToPicture = require('text-to-picture-kazari')
            try{
                const tps_resultado = await textToPicture.convert({
                    text: texto.toUpperCase(),
                    source:{
                        width:550,
                        height:550,
                        background: "black"
                    },
                    color: "white",
                    quality: 90
                })
                const tpsBase64 = await tps_resultado.getBase64()
                resolve(tpsBase64)
            } catch{
                reject()
            }*/
        })  
    }
}