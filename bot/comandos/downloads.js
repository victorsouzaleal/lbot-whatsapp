//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import api from '../../api/api.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import axios from 'axios'
import duration from 'format-duration-time'
import {obterMensagensTexto} from '../lib/msgs.js'


export const downloads = async(c, mensagemBaileys, botInfo) => {
    //Atribuição de valores
    const msgs_texto = obterMensagensTexto(botInfo)
    const {prefixo} = botInfo
    const {
        texto_recebido,
        comando,
        args,
        mensagem_completa,
        id_chat
    } = mensagemBaileys
    const comandoSemPrefixo = comando.replace(prefixo, "")

    //Comandos de downloads
    try{
        switch(comandoSemPrefixo){      
            case "play":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(6).trim()
                    await api.Downloads.obterInfoVideoYT(usuarioTexto).then(async({resultado})=>{
                        if(resultado.isLiveContent) await socket.responderTexto(c, id_chat,msgs_texto.downloads.play.erro_live,mensagem_completa)
                        else if (resultado.lengthSeconds > 300) await socket.responderTexto(c, id_chat, msgs_texto.downloads.play.limite, mensagem_completa)
                        else {
                            let mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, resultado.title, resultado.durationFormatted)
                            await socket.responderTexto(c, id_chat, mensagemEspera, mensagem_completa)
                            await api.Downloads.obterYTMP3(resultado.videoId).then(async ({resultado})=>{
                                await socket.responderArquivoBuffer(c, MessageTypes.audio, id_chat, resultado, '', mensagem_completa, 'audio/mpeg')
                            }).catch(async err=>{
                                if(!err.erro) throw err
                                await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                            })
                        }
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case "yt":
                try{
                    if(args.length === 1) return await socket.responderTexto(c,id_chat,erroComandoMsg(comando, botInfo),mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(4).trim()
                    await api.Downloads.obterInfoVideoYT(usuarioTexto).then(async({resultado})=>{
                        if(resultado.isLiveContent) await socket.responderTexto(c, id_chat,msgs_texto.downloads.yt.erro_live,mensagem_completa)
                        else if(resultado.lengthSeconds > 300) await socket.responderTexto(c, id_chat,msgs_texto.downloads.yt.limite,mensagem_completa)
                        else {
                            let mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, resultado.title, resultado.durationFormatted)
                            await socket.responderTexto(c, id_chat, mensagemEspera, mensagem_completa)
                            await api.Downloads.obterYTMP4(resultado.videoId).then(async({resultado})=>{
                                await socket.responderArquivoBuffer(c, MessageTypes.video, id_chat, resultado, '', mensagem_completa, 'video/mp4')
                            }).catch(async err=>{
                                if(!err.erro) throw err
                                await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                            })
                        }
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "fb":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioURL = texto_recebido.slice(4).trim()
                    await api.Downloads.obterMidiaFacebook(usuarioURL).then(async ({resultado})=>{
                        if(resultado.duration_ms > 180000) await socket.responderTexto(c, id_chat, msgs_texto.downloads.fb.limite, mensagem_completa)
                        else {
                            let mensagemEspera = criarTexto(msgs_texto.downloads.fb.espera, resultado.title, duration.default(resultado.duration_ms).format('m:ss'))
                            await socket.responderTexto(c, id_chat, mensagemEspera, mensagem_completa)
                            await socket.responderArquivoUrl(c, MessageTypes.video, id_chat, resultado.sd, '', mensagem_completa, 'video/mp4')
                        }
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                } 
                break

            case "ig":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem_completa)
                    if(args.length > 2 && isNaN(args[2])) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem_completa)
                    await socket.responderTexto(c, id_chat, msgs_texto.downloads.ig.espera, mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(4).trim(), indexEscolhido = 0
                    await api.Downloads.obterMidiaInstagram(usuarioTexto).then(async({resultado})=>{
                        if(args.length > 2) indexEscolhido = args[2] - 1
                        if(resultado.url_list[indexEscolhido] == undefined || resultado.url_list[indexEscolhido].length == 0 ) await socket.responderTexto(c, id_chat, msgs_texto.downloads.ig.nao_encontrado, mensagem_completa)
                        else{
                            let igResponse = await axios.get(resultado.url_list[indexEscolhido],  { responseType: 'arraybuffer' })
                            let bufferIg = Buffer.from(igResponse.data, "utf-8")
                            if(igResponse.headers['content-type'] == "image/jpeg"){
                                await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, bufferIg, '', mensagem_completa)
                            } else if(igResponse.headers['content-type'] == "video/mp4"){
                                await socket.responderArquivoBuffer(c, MessageTypes.video, id_chat, bufferIg, '', mensagem_completa, 'video/mp4')
                            }
                        }
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "tw":
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem_completa)
                    await socket.responderTexto(c, id_chat, msgs_texto.downloads.tw.espera, mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(4).trim()
                    await api.Downloads.obterMidiaTwitter(usuarioTexto).then(async ({resultado})=>{
                        resultado.midias.forEach(async (midia)=>{
                            if(midia.tipo == "imagem") await socket.responderArquivoUrl(c, MessageTypes.image, id_chat, midia.url, resultado.texto, mensagem_completa)
                            else if(midia.tipo == "video") await socket.responderArquivoUrl(c, MessageTypes.video, id_chat, midia.url, resultado.texto, mensagem_completa, "video/mp4")
                        })
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case "tk":
                try{
                    if(args.length === 1) return await socket.responderTexto(id_chat,erroComandoMsg(comando, botInfo),mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(4).trim()
                    await api.Downloads.obterMidiaTiktok(usuarioTexto).then(async ({resultado}) =>{
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.downloads.tk.espera, resultado.autor_perfil, resultado.descricao),mensagem_completa)
                        await socket.responderArquivoUrl(c, MessageTypes.video, id_chat, resultado.url, '', mensagem_completa, "video/mp4")
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'img':
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(5).trim()
                    await api.Imagens.obterImagens(usuarioTexto).then(async ({resultado})=>{
                        let tentativasMax = resultado.length < 3 ? resultado.length : 3, sucessoMensagem = false
                        for (let i = 0; i < tentativasMax; i++){
                            let indexAleatorio = Math.floor(Math.random() * (resultado.length > 30 ? 30 : resultado.length))
                            let imagemEscolhida = resultado[indexAleatorio].url
                            resultado.splice(indexAleatorio, 1)
                            await axios.get(imagemEscolhida, {responseType: 'arraybuffer'}).then(async({data, headers})=>{
                                if (headers['content-type'] == "image/png" || headers['content-type'] == "image/jpeg"){
                                    let bufferImg = Buffer.from(data, "utf-8")
                                    await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, bufferImg, '', mensagem_completa)
                                    sucessoMensagem = true
                                    i = 3
                                }
                            }).catch(()=>{
                                sucessoMensagem = false
                            })
                        }
                        if(!sucessoMensagem) await socket.responderTexto(c, id_chat, msgs_texto.downloads.img.erro_imagem, mensagem_completa)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem_completa)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "DOWNLOADS")
    }
}