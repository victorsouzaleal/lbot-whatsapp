//REQUERINDO MÓDULOS
const fs = require('fs-extra')
const msgs_texto = require('../lib/msgs')
const {criarTexto, erroComandoMsg, removerNegritoComando} = require("../lib/util")
const api = require("../lib/api")
const {default: PQueue} = require('p-queue')

//FILAS
const filaPlay = new PQueue({concurrency: 2})
const filaYT = new PQueue({concurrency: 1})
const filaIg = new PQueue({concurrency: 1})
const filaTw = new PQueue({concurrency: 2})
const filaFb = new PQueue({concurrency: 1})
const filaImg = new PQueue({concurrency: 1})


module.exports = downloads = async(client,message) => {
    try{
        const { type, id, from, quotedMsg, body, caption} = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')

        switch(command){      
            case "!play":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(6).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return client.reply(from, msgs_texto.downloads.play.nao_encontrado, id)
                    if(videoInfo.duration > 300000) return client.reply(from, msgs_texto.downloads.play.limite, id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.play.espera, videoInfo.title, videoInfo.durationFormatted)
                    client.reply(from, mensagemEspera, id)      
                } catch(err){
                    return client.reply(from,err.message,id)
                }

                try{
                    await filaPlay.add(async () => {
                        var saidaAudio = await api.obterYTMp3(videoInfo)
                        client.sendFile(from, saidaAudio, "musica.mp3","", id).then(()=>{
                            fs.unlinkSync(saidaAudio)
                        })
                    })
                } catch(err){
                    client.reply(from,err.message,id)
                }
                break
            
            case "!yt":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                try{
                    var usuarioTexto = body.slice(4).trim(), videoInfo = await api.obterInfoVideoYT(usuarioTexto)
                    if(videoInfo == null) return client.reply(from,msgs_texto.downloads.yt.nao_encontrado,id)
                    if(videoInfo.duration > 300000) return client.reply(from,msgs_texto.downloads.yt.limite,id)
                    var mensagemEspera = criarTexto(msgs_texto.downloads.yt.espera, videoInfo.title, videoInfo.durationFormatted)
                    client.reply(from, mensagemEspera, id)
                } catch(err){
                    return client.reply(from,err.message,id)
                }

                await filaYT.add(async ()=>{
                    try{
                        var saidaVideoInfo = await api.obterYTMp4URL(videoInfo)
                        await client.sendFile(from, saidaVideoInfo.download, `${saidaVideoInfo.title}.mp4`,"", id)
                    } catch(err){
                        await client.reply(from,err.message,id)
                    }
                })
                break

            case "!ig":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                await client.reply(from, msgs_texto.downloads.ig.espera, id)
                await filaIg.add(async ()=>{
                    try{
                        var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaInstagram(usuarioTexto)
                        if(resultadosMidia.results_number == 0) return client.reply(from, msgs_texto.downloads.ig.nao_encontrado, id)
                        if(resultadosMidia.results_number == 1){
                            await client.sendFile(from, resultadosMidia.url_list[0], `ig-media`,"",id)
                        } else {
                            for(let url of resultadosMidia.url_list){
                                await client.sendFile(from, url, `ig-media`,"")
                            }
                        }
                    } catch(err){
                        client.reply(from,err.message,id)
                    }
                })
                break

            case "!fb":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                await client.reply(from, msgs_texto.downloads.fb.espera, id)
                await filaFb.add(async ()=>{
                    try{
                        var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaFacebook(usuarioTexto)
                        console.log(resultadosMidia)
                        if(!resultadosMidia.encontrado) return client.reply(from, msgs_texto.downloads.fb.nao_encontrado, id)
                        if(resultadosMidia.duracao > 180) return client.reply(from, msgs_texto.downloads.fb.limite, id)
                        await client.sendFile(from, resultadosMidia.url, `fb-media.mp4`,"",id)
                    } catch(err){
                        client.reply(from,err.message,id)
                    } 
                })
                break

            case "!tw":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                await client.reply(from,msgs_texto.downloads.tw.espera,id)
                await filaTw.add(async ()=>{
                    try{
                        var usuarioTexto = body.slice(4).trim(), resultadosMidia = await api.obterMidiaTwitter(usuarioTexto)
                        if(!resultadosMidia.found) return client.reply(from, msgs_texto.downloads.tw.nao_encontrado, id)
                        if(resultadosMidia.type == "video"){
                            await client.sendFile(from, resultadosMidia.download[0].url, `twittervid.mp4`,"", id)
                        } else {
                            await client.sendFile(from, resultadosMidia.download, `twitterimg.jpg`,"", id)
                        }
                    } catch(err){
                        client.reply(from,err.message,id)
                    }
                })

                break
            
            case '!img':
                if(quotedMsg || type != "chat") return client.reply(from, erroComandoMsg(command) , id)
                var usuarioQuantidadeFotos = args[1], qtdFotos = 1, textoPesquisa = ""
                if(!isNaN(usuarioQuantidadeFotos)){
                    if(usuarioQuantidadeFotos > 0 && usuarioQuantidadeFotos <= 5) {
                        qtdFotos = usuarioQuantidadeFotos
                        textoPesquisa = args.slice(2).join(" ").trim()
                    } else {
                        return client.reply(from, msgs_texto.downloads.img.qtd_imagem , id)
                    }
                } else {
                    textoPesquisa = body.slice(5).trim()
                }
                if (!textoPesquisa) return client.reply(from, erroComandoMsg(command), id)
                if (textoPesquisa.length > 120) return client.reply(from, msgs_texto.downloads.img.tema_longo , id)
                await filaImg.add(async ()=>{
                    try{
                        var resultadosImagens = await api.obterImagens(textoPesquisa, qtdFotos)
                        for(let imagem of resultadosImagens){
                            client.sendFileFromUrl(from, imagem , "foto.jpg" , "", (qtdFotos == 1) ? id : "").catch(()=>{
                                client.sendText(from, msgs_texto.downloads.img.erro_imagem)
                            })
                        }
                    } catch(err){
                        client.reply(from, err.message, id)
                    }
                })
                break
        }
    } catch(err){
        throw err
    }
    

}