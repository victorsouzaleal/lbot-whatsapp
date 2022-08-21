//REQUERINDO MÓDULOS
const fs = require('fs-extra')
const msgs_texto = require('../lib/msgs')
const {criarTexto, erroComandoMsg, removerNegritoComando} = require("../lib/util")
const api = require("../lib/api")

module.exports = downloads = async(client,message) => {
    try{
        const { type, id, chatId, quotedMsg, body, caption} = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')

        switch(command){      
            case "!play":
                if(args.length === 1) return await client.reply(chatId,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(6).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return await client.reply(chatId, msgs_texto.downloads.play.nao_encontrado, id)
                    if(videoInfo.duration > 300000) return await client.reply(chatId, msgs_texto.downloads.play.limite, id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, videoInfo.title, videoInfo.durationFormatted)
                    await client.reply(chatId, mensagemEspera, id)      
                } catch(err){
                    return await client.reply(chatId,err.message,id)
                }

                try{
                    var saidaAudio = await api.obterYtMp3(videoInfo)
                    client.sendFile(chatId, saidaAudio, `${videoInfo.title}.mp3`,"", id).then(()=>{
                        fs.unlinkSync(saidaAudio)
                    }).catch(()=>{
                        fs.unlinkSync(saidaAudio)
                        client.reply(chatId, msgs_texto.downloads.play.erro_download, id)
                    })
                } catch(err){
                    await client.reply(chatId,err.message,id)
                }
                break
            
            case "!yt":
                if(args.length === 1) return await client.reply(chatId,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(4).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return await client.reply(chatId,msgs_texto.downloads.yt.nao_encontrado,id)
                    if(videoInfo.duration > 300000) return await client.reply(chatId,msgs_texto.downloads.yt.limite,id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, videoInfo.title, videoInfo.durationFormatted)
                    await client.reply(chatId, mensagemEspera, id)
                    var saidaVideoInfo = await api.obterYTMp4URL(videoInfo)
                    await client.sendFile(chatId, saidaVideoInfo.download, `${saidaVideoInfo.title}.mp4`,"", id).catch(()=>{
                        client.reply(chatId,msgs_texto.downloads.yt.erro_download,id)
                    })
                } catch(err){
                    return await client.reply(chatId,err.message,id)
                }
                break

            case "!fb":
                if(args.length === 1) return await client.reply(chatId, erroComandoMsg(command), id)
                try{
                    var usuarioURL = body.slice(4).trim(), resultadosMidia = await api.obterMidiaFacebook(usuarioURL)
                    console.log(resultadosMidia)
                    if(resultadosMidia.video_length > 120) return await client.reply(chatId, msgs_texto.downloads.fb.limite, id)
                    await client.reply(chatId, criarTexto(msgs_texto.downloads.fb.espera, resultadosMidia.video_length+"s"), id)
                    await client.sendFile(chatId, resultadosMidia.download[1].url, `fb-media.mp4`,"", id).catch(()=>{
                        client.reply(chatId, msgs_texto.downloads.fb.erro_download, id)
                    })
                } catch(err){
                    client.reply(chatId,err.message,id)
                } 
                break

            case "!ig":
                if(args.length === 1) return await client.reply(chatId,erroComandoMsg(command),id)
                await client.reply(chatId, msgs_texto.downloads.ig.espera, id)
                try{
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaInstagram(usuarioTexto)
                    if(resultadosMidia.results_number == 0) return await client.reply(chatId, msgs_texto.downloads.ig.nao_encontrado, id)
                    if(resultadosMidia.results_number == 1) {
                        await client.sendFile(chatId, resultadosMidia.url_list[0], `ig-media`,"",id).catch(()=>{
                            client.reply(chatId, msgs_texto.downloads.ig.erro_download, id)
                        })
                    }
                    else {
                        var temErro = false
                        for(let url of resultadosMidia.url_list) await client.sendFile(chatId, url, `ig-media`,"").catch(()=> temErro = true)
                        if(temErro) await client.reply(chatId, msgs_texto.downloads.ig.erro_download, id)
                    } 
                } catch(err){
                    await client.reply(chatId,err.message,id)
                }
                break

            case "!tw":
                if(args.length === 1) return await client.reply(chatId,erroComandoMsg(command),id)
                await client.reply(chatId,msgs_texto.downloads.tw.espera,id)
                try{
                    var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaTwitter(usuarioTexto)
                    if(!resultadosMidia.found) return await client.reply(chatId, msgs_texto.downloads.tw.nao_encontrado, id)
                    if(resultadosMidia.type == "video/gif"){
                        await client.sendFileFromUrl(chatId, resultadosMidia.download[0].url, `twittervid.mp4`,"", id).catch(()=>{
                            client.reply(chatId, msgs_texto.downloads.tw.erro_download, id)
                        })
                    } 
                    else{
                        await client.sendFile(chatId, resultadosMidia.download, `twitterimg.jpg`,"", id).catch(()=>{
                            client.reply(chatId, msgs_texto.downloads.tw.erro_download, id)
                        })
                    }
                } catch(err){
                    await client.reply(chatId,err.message,id)
                }
                break

            case "!tk":
                if(args.length === 1) return await client.reply(chatId,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(4).trim(), resultadoTiktok= await api.obterMidiaTiktok(usuarioTexto)
                    await client.reply(chatId,criarTexto(msgs_texto.downloads.tk.espera, resultadoTiktok.autor_perfil, resultadoTiktok.autor_nome, resultadoTiktok.titulo, resultadoTiktok.duracao) ,id)
                        const headers = {
                            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36",
                            "referer": "https://www.tiktok.com/",
                            "cookie": "tt_webid_v2=689854141086886123"
                        }
                        await client.sendFileFromUrl(chatId, resultadoTiktok.url, `tkvideo.mp4`,"", id, {headers}).catch(()=>{
                            client.reply(chatId, msgs_texto.downloads.tk.erro_download, id)
                        })
                } catch(err){
                    await client.reply(chatId, err.message, id)
                }
                break
            
            case '!img':
                if(quotedMsg || type != "chat") return await client.reply(chatId, erroComandoMsg(command) , id)
                var usuarioQuantidadeFotos = args[1], qtdFotos = 1, textoPesquisa = ""
                if(!isNaN(usuarioQuantidadeFotos)){
                    if(usuarioQuantidadeFotos > 0 && usuarioQuantidadeFotos <= 5) {
                        qtdFotos = usuarioQuantidadeFotos
                        textoPesquisa = args.slice(2).join(" ").trim()
                    } else {
                        return await client.reply(chatId, msgs_texto.downloads.img.qtd_imagem , id)
                    }
                } else {
                    textoPesquisa = body.slice(5).trim()
                }
                if (!textoPesquisa) return await client.reply(chatId, erroComandoMsg(command), id)
                if (textoPesquisa.length > 120) return await client.reply(chatId, msgs_texto.downloads.img.tema_longo , id)
                try{
                    var resultadosImagens = await api.obterImagens(textoPesquisa, qtdFotos)
                    for(let imagem of resultadosImagens){
                        client.sendFileFromUrl(chatId, imagem , "foto.jpg" , "", (qtdFotos == 1) ? id : "").catch(async ()=>{
                            await client.sendText(chatId, msgs_texto.downloads.img.erro_imagem)
                        })
                    }
                } catch(err){
                    await client.reply(chatId, err.message, id)
                }
                break
        }
    } catch(err){
        throw err
    }
    

}