//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const msgs_texto = require('../lib/msgs')
const {erroComandoMsg, consoleErro, removerNegritoComando} = require("../lib/util")
const sticker = require("../lib/sticker")

module.exports = figurinhas = async(client,message) => {
    try{
        const { type, id, from, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, body} = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'

        switch(command){      
            case '!s':
                if(isMedia || quotedMsg){
                    var argSticker = args.length > 1 ? args[1].toLowerCase() : ""
                    var stickerMetadata = {
                        author: "LBOT", 
                        pack: "LBOT Stickers", 
                        keepScale: true, 
                        circle: false, 
                        discord: "701084178112053288"
                    }

                    if(argSticker == "1"){
                        stickerMetadata.circle = true
                        stickerMetadata.keepScale = false
                    }

                    var dadosMensagem = {
                        tipo : (isMedia) ? type : quotedMsg.type,
                        mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if(dadosMensagem.tipo === "image"){
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var imagemBase64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        client.sendImageAsSticker(from, imagemBase64, stickerMetadata).catch(err=>{
                            consoleErro(err.message, "STICKER")
                            client.reply(from, msgs_texto.figurinhas.sticker.erro_s,id)
                        })
                    } else {
                        return client.reply(from, erroComandoMsg(command) , id)
                    }
                } else {
                    return client.reply(from, erroComandoMsg(command) , id)
                }
                break
            
            case '!simg':
                if(quotedMsg && quotedMsg.type == "sticker"){
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    var imagemBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendFile(from,imagemBase64,"sticker.jpg","",quotedMsgObj.id)
                } else {
                    client.reply(from, erroComandoMsg(command), id)
                }
                break

            case '!sgif':
                if(isMedia || quotedMsg){
                    var argSticker = args.length > 1 ? args[1].toLowerCase() : ""
                    var stickerMetadata = {
                        author: "LBOT", 
                        pack: "LBOT Sticker Animado", 
                        keepScale: false, 
                        discord: "701084178112053288"
                    }
                    var configConversao = {
                        endTime: "00:00:11.0",
                        crop: true,
                        fps:9,
                        square:240
                    }

                    if(argSticker == "1"){
                        stickerMetadata.keepScale = true
                        configConversao.crop = false
                    } else if (argSticker == "2"){
                        stickerMetadata.circle = true
                    }

                    var dadosMensagem = {
                        mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                        duracao: (isMedia)? message.duration : quotedMsg.duration,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if((dadosMensagem.mimetype === 'video/mp4' || dadosMensagem.mimetype === 'image/gif') && dadosMensagem.duracao < 11){
                        await client.reply(from, msgs_texto.geral.espera , id)
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var base64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        client.sendMp4AsSticker(from, base64, configConversao, stickerMetadata)
                        .catch((err)=>{
                            consoleErro(err.message, "STICKER-GIF")
                            client.reply(from, msgs_texto.figurinhas.sticker.erro_sgif , id)
                        })
                    } else {
                        return client.reply(from, msgs_texto.figurinhas.sticker.video_invalido, id)
                    }
                } else {
                    return client.reply(from, msgs_texto.geral.erro, id)
                }
                break

            case "!tps":
                if(args.length == 1 || type != "chat") return client.reply(from,erroComandoMsg(command),id)
                var usuarioTexto = body.slice(5).trim()
                if(usuarioTexto.length > 40) return client.reply(from,msgs_texto.figurinhas.tps.texto_longo,id)
                await client.reply(from, msgs_texto.figurinhas.tps.espera,id)
                try{
                    var imagemBase64 = await sticker.textoParaFoto(usuarioTexto)
                    client.sendImageAsSticker(from, imagemBase64, {author: "LBOT", pack: "LBOT Sticker Textos", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                        consoleErro(err.message, "STICKER-TPS")
                        client.reply(from, msgs_texto.figurinhas.sticker.erro_s,id)
                    })
                } catch(err){
                    client.reply(from, err.message, id)
                }
                break
            
            case '!ssf':
                if(isMedia || quotedMsg){
                    var dadosMensagem = {
                        tipo: (isMedia)? type : quotedMsg.type,
                        mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if(dadosMensagem.tipo === "image"){
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var usuarioImgBase64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        try{
                            var saidaImgBase64 = await sticker.removerFundoImagem(usuarioImgBase64, dadosMensagem.mimetype)
                            client.sendImageAsSticker(from, saidaImgBase64, {author: "LBOT", pack: "LBOT Sticker Sem Fundo", keepScale: true, discord: "701084178112053288"}).catch(err=>{
                                consoleErro(err.message, "STICKER-SSF")
                                client.reply(from, msgs_texto.figurinhas.sticker.erro_s,id)
                            })
                        } catch(err){
                            client.reply(from, err.message, id)
                        }
                    } else {
                        client.reply(from, msgs_texto.figurinhas.sticker.ssf_imagem, id)
                    }
                } else {
                    client.reply(from, erroComandoMsg(command), id)
                }
                break
        }
    } catch(err){
        throw err
    }
    

}