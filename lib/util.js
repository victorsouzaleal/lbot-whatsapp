import moment from "moment-timezone"
import {obterMensagensTexto} from './msgs.js'
import {obterGuias} from './guias.js'
import chalk from 'chalk'
import * as bot from '../controle/botControle.js'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
import path from 'node:path'
import fs from 'fs-extra'
import axios from 'axios'
import WebP from "node-webpmux"
import crypto from 'node:crypto'
import jimp from 'jimp'


export const erroComandoMsg = async (comando) =>{
  let msgs_texto = await obterMensagensTexto()
  return criarTexto(msgs_texto.geral.cmd_erro, comando, comando)
}

export const corTexto = (texto, cor)=>{
    return !cor ? chalk.green(texto) : chalk.hex(cor)(texto)
}

export const guiaComandoMsg = async (tipo,comando)=>{
  let guias = await obterGuias(), {prefixo, nome_bot, nome_adm} = await bot.obterInformacoesBot()
  comando = comando.replace(prefixo, "")
  return guias[tipo][comando]
}

export const criarTexto = (texto, ...params)=>{
  for(let i = 0; i < params.length; i++){
      texto = texto.replace(`{p${i+1}}`, params[i])
  }
  return texto
}

export const timestampParaData = (timestampMsg)=>{
    return moment(timestampMsg).format('DD/MM HH:mm:ss')
}

export const dataHoraAtual = ()=>{
  return moment(Date.now()).format('DD/MM HH:mm:ss')
}

export const obterTempoRespostaSeg = (timestampMensagem) => {
    let tResposta = moment.now() - timestampMensagem
    return (tResposta/1000).toFixed(2)
}

export const consoleComando = (isGroup, categoria, comando, hex, timestampMsg, nomeUsuario, nomeChat)=>{
    let tMensagem = timestampParaData(timestampMsg)
    let tResposta = obterTempoRespostaSeg(timestampMsg)
    if(isGroup){
      console.log('\x1b[1;31m~\x1b[1;37m>', corTexto(`[GRUPO - ${categoria}]`, hex), tMensagem, corTexto(comando), 'de', corTexto(nomeUsuario), 'em', corTexto(nomeChat), `(${corTexto(`${tResposta}s`)})`)
    } else {
      console.log('\x1b[1;31m~\x1b[1;37m>', corTexto(`[PRIVADO - ${categoria}]`, hex), tMensagem, corTexto(comando), 'de', corTexto(nomeUsuario), `(${corTexto(`${tResposta}s`)})`)
    }
}

export const primeiraLetraMaiuscula = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const removerNegritoComando = (comando)=>{
    return comando.replace(/\*/gm, "").trim()
}

export const obterNomeAleatorio =(ext = '')=>{
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

export const delayAleatorio = (minDelayMs, maxDelayMs)=>{
   return new Promise((resolve, reject)=>{
      let delayAleatorioMs = Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs
      setTimeout(async ()=>{
          resolve()
      }, delayAleatorioMs)
   })
}

export const consoleErro = (msg, tipo_erro = "API")=>{
  console.error(corTexto(`[${tipo_erro}]`,"#d63e3e"), msg)
}

export const converterMp4ParaMp3 = (bufferVideo) => {
  return new Promise((resolve,reject)=>{
      let caminhoVideo = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
      fs.writeFileSync(caminhoVideo, bufferVideo)
      let saidaAudio = path.resolve(`temp/${obterNomeAleatorio(".mp3")}`)
      ffmpeg(caminhoVideo)
      .save(saidaAudio)
      .on('end', () => {
          let bufferAudio = fs.readFileSync(saidaAudio)
          fs.unlinkSync(caminhoVideo)
          fs.unlinkSync(saidaAudio)
          resolve(bufferAudio)
      })
      .on("error", (err)=>{
          fs.unlinkSync(caminhoVideo)
          reject(err.message)
      })
  })
}

export const getVideoThumbnail = async(arquivo, tipoArquivo="file") =>{
  return new Promise(async (resolve,reject)=>{
      let saidaThumbImagem = path.resolve(`temp/${obterNomeAleatorio(".jpg")}`), inputCaminho = null
      if(tipoArquivo == "file"){
          inputCaminho = arquivo
      } else if(tipoArquivo == "buffer"){
          inputCaminho = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
          fs.writeFileSync(inputCaminho, arquivo)
      } else if(tipoArquivo == "url"){
          let urlResponse = await axios.get(arquivo,  { responseType: 'arraybuffer' })
          let bufferUrl = Buffer.from(urlResponse.data, "utf-8")
          inputCaminho = path.resolve(`temp/${obterNomeAleatorio(".mp4")}`)
          fs.writeFileSync(inputCaminho, bufferUrl)
      }
      ffmpeg(inputCaminho)
      .addOption("-y")
      .inputOptions(["-ss 00:00:00"])
      .outputOptions(["-vf scale=32:-1", "-vframes 1", "-f image2"])
      .save(saidaThumbImagem)
      .on('end', ()=>{
          let thumbBase64 = fs.readFileSync(saidaThumbImagem).toString('base64')
          if(tipoArquivo != "file") fs.unlinkSync(inputCaminho)
          fs.unlinkSync(saidaThumbImagem)
          resolve(thumbBase64)
      })
      .on('error', (err)=>{
          reject(err.message)
      })
  })
}

export const stickerToPng = (stickerBuffer)=>{
  return new Promise(async (resolve, reject)=>{
      try{
          let entradaWebp = path.resolve(`temp/${obterNomeAleatorio(".webp")}`)
          let saidaPng = path.resolve(`temp/${obterNomeAleatorio(".png")}`)
          fs.writeFileSync(entradaWebp, stickerBuffer)
          ffmpeg(entradaWebp)
          .on('end', ()=>{
              fs.unlinkSync(entradaWebp)
              resolve({
                  success: true,
                  saida: saidaPng
              })
          })
          .on('error', ()=>{
              resolve({
                  success: false,
                  saida: entradaWebp
              })
          })
          .save(saidaPng)
      } catch(err){
          reject(err)
      }
  })
}

export const criarSticker = (midiaBuffer, mimetype, pack, autor)=>{
  return new Promise(async (resolve, reject)=>{
    let midiaCaminho, webpCaminho = path.resolve(`temp/${obterNomeAleatorio('.webp')}`), opcoesFfmpeg 
    if(mimetype.startsWith(`video`)){
       midiaCaminho = path.resolve(`temp/${obterNomeAleatorio('.mp4')}`)
       opcoesFfmpeg = [
        "-vcodec libwebp",
        "-filter:v",
        "fps=fps=9",
        "-lossless 0",
        "-compression_level 4",
        "-q:v 10",
        "-loop 1",
        "-preset picture",
        "-an",
        "-vsync 0",
        "-s 512:512"
       ]
    } else {
      midiaCaminho = path.resolve(`temp/${obterNomeAleatorio('.png')}`)
      opcoesFfmpeg = [
      "-vcodec libwebp",
      "-loop 0",
      "-lossless 1",
      "-q:v 100",
      "-s 512:512"
      ]
    }

    fs.writeFileSync(midiaCaminho, midiaBuffer)
    
    ffmpeg(midiaCaminho).outputOptions(opcoesFfmpeg).save(webpCaminho).on('end', async ()=>{
      let stickerBuffer = await adicionarExifSticker(fs.readFileSync(webpCaminho), pack, autor)
      fs.unlinkSync(midiaCaminho)
      fs.unlinkSync(webpCaminho)
      resolve(stickerBuffer)
    }).on('error', (err)=>{
      fs.unlinkSync(midiaCaminho)
      reject(err)
    })
  })
}

const mudarFormaSticker = async(midiaBuffer, formato = 'circulo') =>{
  if(formato == 'circulo'){
    let img = await jimp.read(midiaBuffer)
    img.circle()
    let bufferImagem = await img.getBufferAsync('image/png')
    return bufferImagem
  }  
}

const adicionarExifSticker = async (stickerBuffer, pack, autor, categorias = [''], extra = {})=>{
  const img = new WebP.Image()
  const stickerPackId = crypto.randomBytes(32).toString('hex')
  const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': pack, 'sticker-pack-publisher': autor, 'emojis': categorias, ...extra }
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
  let exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  await img.load(stickerBuffer)
  img.exif = exif
  return await img.save(null)
}

