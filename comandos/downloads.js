//REQUERINDO MÓDULOS
import fs from 'fs-extra'
import { obterMensagensTexto } from '../lib/msgs.js' 
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import * as api from '../lib/api.js'
import * as socket from '../lib-baileys/socket-funcoes.js'
import {MessageTypes} from '../lib-baileys/mensagem.js'
import axios from 'axios'
import {botInfo} from '../db-modulos/bot.js'
import duration from 'format-duration-time'


export const downloads = async(c,messageTranslated) => {
    try{
        const { type, id, chatId, quotedMsg, body, caption} = messageTranslated
        const {prefixo, nome_bot, nome_adm} = botInfo()
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        var cmdSemPrefixo = command.replace(prefixo, "")

        const msgs_texto = obterMensagensTexto()

        switch(cmdSemPrefixo){      
            case "play":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(6).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(!videoInfo) return await socket.reply(c, chatId, msgs_texto.downloads.play.erro_pesquisa, id)
                    if(videoInfo.isLiveContent) return await socket.reply(c, chatId,msgs_texto.downloads.play.erro_live,id)
                    if(videoInfo.lengthSeconds > 300) return await socket.reply(c, chatId, msgs_texto.downloads.play.limite, id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, videoInfo.title, videoInfo.durationFormatted)
                    await socket.reply(c, chatId, mensagemEspera, id)
                    var caminhoAudio = await api.obterYTMP3(videoInfo.videoId)
                    await socket.replyFile(c, MessageTypes.audio, chatId, caminhoAudio, '', id, 'audio/mpeg')
                    fs.unlinkSync(caminhoAudio)
                } catch(err){
                    if (fs.existsSync(caminhoAudio)) fs.unlinkSync(caminhoAudio) 
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case "yt":
                try{
                    if(args.length === 1) return await socket.reply(c,chatId,erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(4).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(!videoInfo) return await socket.reply(c, chatId,msgs_texto.downloads.yt.erro_pesquisa,id)
                    if(videoInfo.isLiveContent) return await socket.reply(c, chatId,msgs_texto.downloads.yt.erro_live,id)
                    if(videoInfo.lengthSeconds > 300) return await socket.reply(c, chatId,msgs_texto.downloads.yt.limite,id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, videoInfo.title, videoInfo.durationFormatted)
                    await socket.reply(c, chatId, mensagemEspera, id)
                    var caminhoVideo = await api.obterYTMP4(videoInfo.videoId)
                    await socket.replyFile(c, MessageTypes.video, chatId, caminhoVideo, '', id, 'video/mp4')
                    fs.unlinkSync(caminhoVideo)
                } catch(err){
                    if (fs.existsSync(caminhoVideo)) fs.unlinkSync(caminhoVideo)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "fb":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    var usuarioURL = body.slice(4).trim(), resultadosMidia = await api.obterMidiaFacebook(usuarioURL)
                    if(resultadosMidia.duration_ms > 180000) return await socket.reply(c, chatId, msgs_texto.downloads.fb.limite, id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.fb.espera, resultadosMidia.title, duration.default(resultadosMidia.duration_ms).format('m:ss'))
                    await socket.reply(c, chatId, mensagemEspera, id)
                    await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultadosMidia.sd, '', id, 'video/mp4')
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                } 
                break

            case "ig":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                    await socket.reply(c, chatId, msgs_texto.downloads.ig.espera, id)
                    var usuarioTexto = body.slice(4).trim(), indexEscolhido = 0, resultadosMidia = await api.obterMidiaInstagram(usuarioTexto)
                    if(args.length > 2) {
                        indexEscolhido = args[2]
                        if(isNaN(indexEscolhido)) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                        indexEscolhido = indexEscolhido - 1
                        if(resultadosMidia[indexEscolhido] == undefined) return await socket.reply(c, chatId, msgs_texto.downloads.ig.nao_encontrado, id)
                    }
                    var igResponse = await axios.get(resultadosMidia[indexEscolhido].download_link,  { responseType: 'arraybuffer' })
                    var bufferIg = Buffer.from(igResponse.data, "utf-8")
                    if(igResponse.headers['content-type'] == "image/jpeg"){
                        await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, bufferIg, '', id)
                    } else if(igResponse.headers['content-type'] == "video/mp4"){
                        await socket.replyFileFromBuffer(c, MessageTypes.video, chatId, bufferIg, '', id, 'video/mp4')
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "tw":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,erroComandoMsg(command),id)
                    await socket.reply(c, chatId,msgs_texto.downloads.tw.espera,id)
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaTwitter(usuarioTexto)
                    if(!resultadosMidia.found) return await socket.reply(c, chatId, msgs_texto.downloads.tw.nao_encontrado, id)
                    if(resultadosMidia.type == "image"){
                        await socket.replyFileFromUrl(c, MessageTypes.image, chatId, resultadosMidia.media[0].url, resultadosMidia.text, id)
                    } else if(resultadosMidia.type == "video"){
                        await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultadosMidia.media[0].url, resultadosMidia.text, id, "video/mp4")
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case "tk":
                try{
                    if(args.length === 1) return await socket.reply(chatId,erroComandoMsg(command),id)
                    var usuarioTexto = body.slice(4).trim(), resultadoTiktok= await api.obterMidiaTiktok(usuarioTexto)
                    if(!resultadoTiktok.sucesso) return await socket.reply(chatId, msgs_texto.downloads.tk.erro_download ,id)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.downloads.tk.espera, resultadoTiktok.autor_perfil, resultadoTiktok.autor_nome, resultadoTiktok.titulo, resultadoTiktok.duracao),id)                
                    var tkResponse = await axios.get(resultadoTiktok.url,  { responseType: 'arraybuffer' })
                    var bufferTk = Buffer.from(tkResponse.data, "utf-8")
                    await socket.replyFileFromBuffer(c, MessageTypes.video, chatId, bufferTk, '', id, "video/mp4")
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'img':
                try{
                    if(quotedMsg || (type != MessageTypes.text && type != MessageTypes.extendedText) || args.length === 1) {
                        return await socket.reply(c, chatId, erroComandoMsg(command), id)
                    }
                    let usuarioTexto = body.slice(5).trim(), imagensUrl = await api.obterImagens(usuarioTexto)
                    if(!imagensUrl.sucesso) return await socket.reply(c, chatId, msgs_texto.downloads.img.nao_encontrado, id)
                    let tentativasMax = imagensUrl.imagens.length < 3 ? imagensUrl.imagens.length : 3, sucessoMensagem = false
                    for (let i = 0; i < tentativasMax; i++){
                        try{
                            let indexAleatorio = Math.floor(Math.random() * (imagensUrl.imagens.length > 50 ? 50 : imagensUrl.imagens.length))
                            let imagemEscolhida = imagensUrl.imagens[indexAleatorio].url
                            imagensUrl.imagens.splice(indexAleatorio, 1)
                            let {data, headers} = await axios.get(imagemEscolhida, {responseType: 'arraybuffer'})
                            if (headers['content-type'] == "image/png" || headers['content-type'] == "image/jpeg"){
                                let bufferImg = Buffer.from(data, "utf-8")
                                await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, bufferImg, '', id)
                                sucessoMensagem = true
                                i = 3
                            }
                        } catch{
                            sucessoMensagem = false
                        }
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
        }
    } catch(err){
        consoleErro(err, "DOWNLOADS")
    }
}