//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import api from '@victorsouzaleal/lbot-api-comandos'
import * as socket from '../baileys/socket.js'
import {tiposMensagem} from '../baileys/mensagem.js'
import duration from 'format-duration-time'
import {comandosInfo} from '../comandos/comandos.js'


export const downloads = async(c, mensagemBaileys, botInfo) => {
    //Atribuição de valores
    const comandos_info = comandosInfo(botInfo)
    const {prefixo} = botInfo
    const {
        texto_recebido,
        comando,
        args,
        mensagem,
        id_chat
    } = mensagemBaileys
    const comandoSemPrefixo = comando.replace(prefixo, "")

    //Comandos de downloads
    try{
        switch(comandoSemPrefixo){      
            case "play":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado: resultadoInfoVideo} = await api.Downloads.obterInfoVideoYT(usuarioTexto)
                    if(resultadoInfoVideo.isLiveContent) return await socket.responderTexto(c, id_chat, comandos_info.downloads.play.msgs.erro_live,mensagem)
                    else if (resultadoInfoVideo.lengthSeconds > 300) return await socket.responderTexto(c, id_chat, comandos_info.downloads.play.msgs.limite, mensagem)
                    const mensagemEspera = criarTexto(comandos_info.downloads.play.msgs.espera, resultadoInfoVideo.title, resultadoInfoVideo.durationFormatted)
                    await socket.responderTexto(c, id_chat, mensagemEspera, mensagem)
                    const {resultado : resultadoYTMP3} = await api.Downloads.obterYTMP3(resultadoInfoVideo.videoId)
                    await socket.responderArquivoBuffer(c, tiposMensagem.audio, id_chat, resultadoYTMP3, '', mensagem, 'audio/mpeg')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case "yt":
                try{
                    if(!args.length) return await socket.responderTexto(c,id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado : resultadoInfoVideo} = await api.Downloads.obterInfoVideoYT(usuarioTexto)
                    if(resultadoInfoVideo.isLiveContent) return await socket.responderTexto(c, id_chat, comandos_info.downloads.yt.msgs.erro_live, mensagem)
                    else if(resultadoInfoVideo.lengthSeconds > 300) return await socket.responderTexto(c, id_chat, comandos_info.downloads.yt.msgs.limite, mensagem)
                    const mensagemEspera = criarTexto(comandos_info.downloads.yt.msgs.espera, resultadoInfoVideo.title, resultadoInfoVideo.durationFormatted)
                    await socket.responderTexto(c, id_chat, mensagemEspera, mensagem)
                    const {resultado : resultadoYTMP4} = await api.Downloads.obterYTMP4(resultadoInfoVideo.videoId)
                    await socket.responderArquivoBuffer(c, tiposMensagem.video, id_chat, resultadoYTMP4, '', mensagem, 'video/mp4')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "fb":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioURL = texto_recebido
                    const {resultado: resultadoFB} = await api.Downloads.obterMidiaFacebook(usuarioURL)
                    if(resultadoFB.duration_ms > 180000) return await socket.responderTexto(c, id_chat, comandos_info.downloads.fb.msgs.limite, mensagem)
                    const mensagemEspera = criarTexto(comandos_info.downloads.fb.msgs.espera, resultadoFB.title, duration.default(resultadoFB.duration_ms).format('m:ss'))
                    await socket.responderTexto(c, id_chat, mensagemEspera, mensagem)
                    await socket.responderArquivoUrl(c, tiposMensagem.video, id_chat, resultadoFB.sd, '', mensagem, 'video/mp4')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                } 
                break

            case "ig":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let linkMidia = texto_recebido
                    await socket.responderTexto(c, id_chat, comandos_info.downloads.ig.msgs.espera, mensagem)
                    const {resultado: resultadoIG} = await api.Downloads.obterMidiaInstagram(linkMidia)
                    resultadoIG.forEach(async midia =>{
                        if(midia.tipo == "imagem") await socket.responderArquivoBuffer(c, tiposMensagem.imagem, id_chat, midia.buffer, '', mensagem)
                        if(midia.tipo == "video") await socket.responderArquivoBuffer(c, tiposMensagem.video, id_chat, midia.buffer, '', mensagem, 'video/mp4')
                    })  
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "tw":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    await socket.responderTexto(c, id_chat, comandos_info.downloads.tw.msgs.espera, mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado: resultadoTW} = await api.Downloads.obterMidiaTwitter(usuarioTexto)
                    resultadoTW.midias.forEach(async(midia)=>{
                        if(midia.tipo == "imagem") await socket.responderArquivoUrl(c, tiposMensagem.imagem, id_chat, midia.url, resultadoTW.texto, mensagem)
                        else if(midia.tipo == "video") await socket.responderArquivoUrl(c, tiposMensagem.video, id_chat, midia.url, resultadoTW.texto, mensagem, "video/mp4")
                    })
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "tk":
                try{
                    if(!args.length) return await socket.responderTexto(id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado : resultadoTK} = await api.Downloads.obterMidiaTiktok(usuarioTexto)
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.downloads.tk.msgs.espera, resultadoTK.autor_perfil, resultadoTK.descricao),mensagem)
                    await socket.responderArquivoUrl(c, tiposMensagem.video, id_chat, resultadoTK.url, '', mensagem, "video/mp4")
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case 'img':
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioTexto = texto_recebido, imagensEnviadas = 0
                    let {resultado: resultadoImg} =  await api.Imagens.obterImagens(usuarioTexto)
                    const maxImagem = resultadoImg.length < 5 ? resultadoImg.length : 5
                    for (let i = 0; i < maxImagem; i++){
                        let indexAleatorio = Math.floor(Math.random() * (resultadoImg.length > 30 ? 30 : resultadoImg.length))
                        let imagemEscolhida = resultadoImg[indexAleatorio].url
                        await socket.enviarArquivoUrl(c, tiposMensagem.imagem, id_chat, imagemEscolhida, '').catch(()=>{})
                        resultadoImg.splice(indexAleatorio, 1)
                        imagensEnviadas++
                    }
                    if(!imagensEnviadas) await socket.responderTexto(c, id_chat, comandos_info.downloads.img.msgs.erro_imagem, mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_api, comando, err.erro) , mensagem)
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.erro_comando_codigo, comando), mensagem)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "DOWNLOADS")
    }
}