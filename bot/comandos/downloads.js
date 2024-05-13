//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import * as api from '../../api/api.js'
import * as socket from '../baileys/socket-funcoes.js'
import {MessageTypes} from '../baileys/mensagem.js'
import axios from 'axios'
import duration from 'format-duration-time'


export const downloads = async(c, mensagemInfoCompleta) => {
    const {msgs_texto} = mensagemInfoCompleta
    const {botInfoJSON} = mensagemInfoCompleta.bot
    const {textoRecebido, command, args, type, id, chatId, quotedMsg} = mensagemInfoCompleta.mensagem
    const {prefixo} = botInfoJSON
    let cmdSemPrefixo = command.replace(prefixo, "")

    try{
        switch(cmdSemPrefixo){      
            case "play":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,await erroComandoMsg(command),id)
                    let usuarioTexto = textoRecebido.slice(6).trim()
                    await api.obterInfoVideoYT(usuarioTexto).then(async({resultado})=>{
                        if(resultado.isLiveContent) await socket.reply(c, chatId,msgs_texto.downloads.play.erro_live,id)
                        else if (resultado.lengthSeconds > 300) await socket.reply(c, chatId, msgs_texto.downloads.play.limite, id)
                        else {
                            let mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, resultado.title, resultado.durationFormatted)
                            await socket.reply(c, chatId, mensagemEspera, id)
                            await api.obterYTMP3(resultado.videoId).then(async ({resultado})=>{
                                await socket.replyFileFromBuffer(c, MessageTypes.audio, chatId, resultado, '', id, 'audio/mpeg')
                            }).catch(async err=>{
                                if(!err.erro) throw err
                                await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                            })
                        }
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "yt":
                try{
                    if(args.length === 1) return await socket.reply(c,chatId,await erroComandoMsg(command),id)
                    let usuarioTexto = textoRecebido.slice(4).trim()
                    await api.obterInfoVideoYT(usuarioTexto).then(async({resultado})=>{
                        if(resultado.isLiveContent) await socket.reply(c, chatId,msgs_texto.downloads.yt.erro_live,id)
                        else if(resultado.lengthSeconds > 300) await socket.reply(c, chatId,msgs_texto.downloads.yt.limite,id)
                        else {
                            let mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, resultado.title, resultado.durationFormatted)
                            await socket.reply(c, chatId, mensagemEspera, id)
                            await api.obterYTMP4(resultado.videoId).then(async({resultado})=>{
                                await socket.replyFileFromBuffer(c, MessageTypes.video, chatId, resultado, '', id, 'video/mp4')
                            }).catch(async err=>{
                                if(!err.erro) throw err
                                await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                            })
                        }
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "fb":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuarioURL = textoRecebido.slice(4).trim()
                    await api.obterMidiaFacebook(usuarioURL).then(async ({resultado})=>{
                        if(resultado.duration_ms > 180000) await socket.reply(c, chatId, msgs_texto.downloads.fb.limite, id)
                        else {
                            let mensagemEspera = criarTexto(msgs_texto.downloads.fb.espera, resultado.title, duration.default(resultado.duration_ms).format('m:ss'))
                            await socket.reply(c, chatId, mensagemEspera, id)
                            await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultado.sd, '', id, 'video/mp4')
                        }
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                } 
                break

            case "ig":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,await erroComandoMsg(command),id)
                    if(args.length > 2 && isNaN(args[2])) return await socket.reply(c, chatId,await erroComandoMsg(command),id)
                    await socket.reply(c, chatId, msgs_texto.downloads.ig.espera, id)
                    let usuarioTexto = textoRecebido.slice(4).trim(), indexEscolhido = 0
                    await api.obterMidiaInstagram(usuarioTexto).then(async({resultado})=>{
                        if(args.length > 2) indexEscolhido = args[2] - 1
                        if(resultado.url_list[indexEscolhido] == undefined || resultado.url_list[indexEscolhido].length == 0 ) await socket.reply(c, chatId, msgs_texto.downloads.ig.nao_encontrado, id)
                        else{
                            let igResponse = await axios.get(resultado.url_list[indexEscolhido],  { responseType: 'arraybuffer' })
                            let bufferIg = Buffer.from(igResponse.data, "utf-8")
                            if(igResponse.headers['content-type'] == "image/jpeg"){
                                await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, bufferIg, '', id)
                            } else if(igResponse.headers['content-type'] == "video/mp4"){
                                await socket.replyFileFromBuffer(c, MessageTypes.video, chatId, bufferIg, '', id, 'video/mp4')
                            }
                        }
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "tw":
                try{
                    if(args.length === 1) return await socket.reply(c, chatId,await erroComandoMsg(command),id)
                    await socket.reply(c, chatId, msgs_texto.downloads.tw.espera, id)
                    let usuarioTexto = textoRecebido.slice(4).trim()
                    await api.obterMidiaTwitter(usuarioTexto).then(async ({resultado})=>{
                        if(!resultado.found) return await socket.reply(c, chatId, msgs_texto.downloads.tw.nao_encontrado, id)
                        if(resultado.type == "image") await socket.replyFileFromUrl(c, MessageTypes.image, chatId, resultado.media[0].url, resultado.text, id)
                        else if(resultado.type == "video") await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultado.media[0].url, resultado.text, id, "video/mp4")
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case "tk":
                try{
                    if(args.length === 1) return await socket.reply(chatId,await erroComandoMsg(command),id)
                    let usuarioTexto = textoRecebido.slice(4).trim()
                    await api.obterMidiaTiktok(usuarioTexto).then(async ({resultado}) =>{
                        await socket.reply(c, chatId, criarTexto(msgs_texto.downloads.tk.espera, resultado.autor_perfil, resultado.autor_nome, resultado.titulo, resultado.duracao),id)
                        await socket.replyFileFromUrl(c, MessageTypes.video, chatId, resultado.url, '', id, "video/mp4")
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'img':
                try{
                    if(quotedMsg || (type != MessageTypes.text && type != MessageTypes.extendedText) || args.length === 1) {
                        return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    }
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await api.obterImagens(usuarioTexto).then(async ({resultado})=>{
                        let tentativasMax = resultado.length < 3 ? resultado.length : 3, sucessoMensagem = false
                        for (let i = 0; i < tentativasMax; i++){
                            let indexAleatorio = Math.floor(Math.random() * (resultado.length > 30 ? 30 : resultado.length))
                            let imagemEscolhida = resultado[indexAleatorio].url
                            resultado.splice(indexAleatorio, 1)
                            await axios.get(imagemEscolhida, {responseType: 'arraybuffer'}).then(async({data, headers})=>{
                                if (headers['content-type'] == "image/png" || headers['content-type'] == "image/jpeg"){
                                    let bufferImg = Buffer.from(data, "utf-8")
                                    await socket.replyFileFromBuffer(c, MessageTypes.image, chatId, bufferImg, '', id)
                                    sucessoMensagem = true
                                    i = 3
                                }
                            }).catch(()=>{
                                sucessoMensagem = false
                            })
                        }
                        if(!sucessoMensagem) await socket.reply(c, chatId, msgs_texto.downloads.img.erro_imagem, id)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
        err.message = `${command} - ${err.message}`
        consoleErro(err, "DOWNLOADS")
    }
}