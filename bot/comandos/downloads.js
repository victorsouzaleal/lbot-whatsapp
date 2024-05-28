//REQUERINDO MÓDULOS
import {criarTexto, erroComandoMsg, consoleErro} from '../lib/util.js'
import api from '../../api/api.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
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
                    if(resultadoInfoVideo.isLiveContent) return await socket.responderTexto(c, id_chat,msgs_texto.downloads.play.erro_live,mensagem)
                    else if (resultadoInfoVideo.lengthSeconds > 300) return await socket.responderTexto(c, id_chat, msgs_texto.downloads.play.limite, mensagem)
                    const mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, resultadoInfoVideo.title, resultadoInfoVideo.durationFormatted)
                    await socket.responderTexto(c, id_chat, mensagemEspera, mensagem)
                    const {resultado : resultadoYTMP3} = await api.Downloads.obterYTMP3(resultadoInfoVideo.videoId)
                    await socket.responderArquivoBuffer(c, MessageTypes.audio, id_chat, resultadoYTMP3, '', mensagem, 'audio/mpeg')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
            
            case "yt":
                try{
                    if(!args.length) return await socket.responderTexto(c,id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado : resultadoInfoVideo} = await api.Downloads.obterInfoVideoYT(usuarioTexto)
                    if(resultadoInfoVideo.isLiveContent) return await socket.responderTexto(c, id_chat,msgs_texto.downloads.yt.erro_live,mensagem)
                    else if(resultadoInfoVideo.lengthSeconds > 300) return await socket.responderTexto(c, id_chat,msgs_texto.downloads.yt.limite,mensagem)
                    const mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, resultadoInfoVideo.title, resultadoInfoVideo.durationFormatted)
                    await socket.responderTexto(c, id_chat, mensagemEspera, mensagem)
                    const {resultado : resultadoYTMP4} = await api.Downloads.obterYTMP4(resultadoInfoVideo.videoId)
                    await socket.responderArquivoBuffer(c, MessageTypes.video, id_chat, resultadoYTMP4, '', mensagem, 'video/mp4')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "fb":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let usuarioURL = texto_recebido
                    const {resultado: resultadoFB} = await api.Downloads.obterMidiaFacebook(usuarioURL)
                    if(resultadoFB.duration_ms > 180000) return await socket.responderTexto(c, id_chat, msgs_texto.downloads.fb.limite, mensagem)
                    const mensagemEspera = criarTexto(msgs_texto.downloads.fb.espera, resultadoFB.title, duration.default(resultadoFB.duration_ms).format('m:ss'))
                    await socket.responderTexto(c, id_chat, mensagemEspera, mensagem)
                    await socket.responderArquivoUrl(c, MessageTypes.video, id_chat, resultadoFB.sd, '', mensagem, 'video/mp4')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                } 
                break

            case "ig":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let [linkMidia, selecaoMidia] = args
                    if(args.length > 1 && isNaN(selecaoMidia)) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    await socket.responderTexto(c, id_chat, msgs_texto.downloads.ig.espera, mensagem)
                    const {resultado: resultadoIG} = await api.Downloads.obterMidiaInstagram(linkMidia, selecaoMidia)
                    if(resultadoIG.tipo == "imagem") await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, resultadoIG.buffer, '', mensagem)
                    if(resultadoIG.tipo == "video") await socket.responderArquivoBuffer(c, MessageTypes.video, id_chat, resultadoIG.buffer, '', mensagem, 'video/mp4')
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "tw":
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    await socket.responderTexto(c, id_chat, msgs_texto.downloads.tw.espera, mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado: resultadoTW} = await api.Downloads.obterMidiaTwitter(usuarioTexto)
                    resultadoTW.midias.forEach(async(midia)=>{
                        if(midia.tipo == "imagem") await socket.responderArquivoUrl(c, MessageTypes.image, id_chat, midia.url, resultadoTW.texto, mensagem)
                        else if(midia.tipo == "video") await socket.responderArquivoUrl(c, MessageTypes.video, id_chat, midia.url, resultadoTW.texto, mensagem, "video/mp4")
                    })
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break

            case "tk":
                try{
                    if(!args.length) return await socket.responderTexto(id_chat,erroComandoMsg(comando, botInfo),mensagem)
                    let usuarioTexto = texto_recebido
                    const {resultado : resultadoTK} = await api.Downloads.obterMidiaTiktok(usuarioTexto)
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.downloads.tk.espera, resultadoTK.autor_perfil, resultadoTK.descricao),mensagem)
                    await socket.responderArquivoUrl(c, MessageTypes.video, id_chat, resultadoTK.url, '', mensagem, "video/mp4")
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
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
                        await socket.enviarArquivoUrl(c, MessageTypes.image, id_chat, imagemEscolhida, '').catch(()=>{})
                        resultadoImg.splice(indexAleatorio, 1)
                        imagensEnviadas++
                    }
                    if(!imagensEnviadas) await socket.responderTexto(c, id_chat, msgs_texto.downloads.img.erro_imagem, mensagem)
                } catch(err){
                    if(!err.erro) throw err
                    await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                }
                break
        }
    } catch(err){
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem)
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "DOWNLOADS")
    }
}