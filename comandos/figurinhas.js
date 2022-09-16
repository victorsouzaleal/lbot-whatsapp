//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const msgs_texto = require('../lib/msgs')
const {erroComandoMsg, consoleErro, removerNegritoComando} = require("../lib/util")
const sticker = require("../lib/sticker")

module.exports = figurinhas = async(client,message) => {
    try{
        const { type, id, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, body} = message
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
                        author: process.env.NOME_AUTOR_FIGURINHAS.trim(), 
                        pack: `${process.env.NOME_AUTOR_FIGURINHAS.trim()}`, 
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
                        client.sendImageAsSticker(chatId, imagemBase64, stickerMetadata).catch(err=>{
                            consoleErro(err.message, "STICKER")
                            client.reply(chatId, msgs_texto.figurinhas.sticker.erro_s,id)
                        })
                    } else {
                        return client.reply(chatId, erroComandoMsg(command) , id)
                    }
                } else {
                    return client.reply(chatId, erroComandoMsg(command) , id)
                }
                break
            
            case '!simg':
                if(quotedMsg && quotedMsg.type == "sticker"){
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                    var imagemBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendFile(chatId,imagemBase64,"sticker.jpg","",quotedMsgObj.id)
                } else {
                    client.reply(chatId, erroComandoMsg(command), id)
                }
                break

            case '!sgif':
                if(isMedia || quotedMsg){
                    var argSticker = args.length > 1 ? args[1].toLowerCase() : ""
                    var stickerMetadata = {
                        author: process.env.NOME_AUTOR_FIGURINHAS.trim(), 
                        pack: `${process.env.NOME_AUTOR_FIGURINHAS.trim()}`, 
                        keepScale: true, 
                        discord: "701084178112053288"
                    }
                    var configConversao = {
                        endTime: "00:00:11.0",
                        crop: false,
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
                        await client.reply(chatId, msgs_texto.geral.espera , id)
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        var base64 = `data:${dadosMensagem.mimetype};base64,${mediaData.toString('base64')}`
                        client.sendMp4AsSticker(chatId, base64, configConversao, stickerMetadata)
                        .catch((err)=>{
                            consoleErro(err.message, "STICKER-GIF")
                            client.reply(chatId, msgs_texto.figurinhas.sticker.erro_sgif , id)
                        })
                    } else {
                        return client.reply(chatId, msgs_texto.figurinhas.sticker.video_invalido, id)
                    }
                } else {
                    return client.reply(chatId, erroComandoMsg(command), id)
                }
                break

            case "!tps":
                if(args.length == 1 || type != "chat") return client.reply(chatId, erroComandoMsg(command), id)
                var stickerMetadata = {
                    author: process.env.NOME_AUTOR_FIGURINHAS.trim(), 
                    pack: `${process.env.NOME_AUTOR_FIGURINHAS.trim()}`, 
                    keepScale: true, 
                    discord: "701084178112053288"
                }
                var usuarioTexto = body.slice(5).trim()
                if(usuarioTexto.length > 40) return client.reply(chatId,msgs_texto.figurinhas.tps.texto_longo,id)
                await client.reply(chatId, msgs_texto.figurinhas.tps.espera,id)
                try{
                    var imagemBase64 = await sticker.textoParaFoto(usuarioTexto)
                    client.sendImageAsSticker(chatId, imagemBase64, stickerMetadata).catch(err=>{
                        consoleErro(err.message, "STICKER-TPS")
                        client.reply(chatId, msgs_texto.figurinhas.sticker.erro_s,id)
                    })
                } catch(err){
                    client.reply(chatId, err.message, id)
                }
                break

            case "!atps":
                if(args.length == 1 || type != "chat") return client.reply(chatId,erroComandoMsg(command),id)
                var usuarioTexto = body.slice(5).trim()
                if(usuarioTexto.length > 40) return client.reply(chatId,msgs_texto.figurinhas.atps.texto_longo,id)
                await client.reply(chatId, msgs_texto.figurinhas.atps.espera,id)
                try{
                    var webpBase64 = await sticker.textoParaGif(usuarioTexto)
                    await client.sendRawWebpAsSticker(chatId, webpBase64, true)
                } catch(err){
                    await client.reply(chatId, err.message, id)
                }
                break
            
            case '!ssf':
                if(isMedia || quotedMsg){
                    var stickerMetadata = {
                        author: process.env.NOME_AUTOR_FIGURINHAS.trim(), 
                        pack: `${process.env.NOME_AUTOR_FIGURINHAS.trim()}`, 
                        keepScale: true, 
                        discord: "701084178112053288"
                    }
                    var dadosMensagem = {
                        tipo: (isMedia)? type : quotedMsg.type,
                        mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                        mensagem: (isMedia)? message : quotedMsg
                    }
                    if(dadosMensagem.tipo === "image"){
                        var mediaData = await decryptMedia(dadosMensagem.mensagem, uaOverride)
                        try{
                            var saidaImgBase64 = await sticker.removerFundoImagem(mediaData, dadosMensagem.mimetype)
                            client.sendImageAsSticker(chatId, saidaImgBase64, stickerMetadata).catch(err=>{
                                consoleErro(err.message, "STICKER-SSF")
                                client.reply(chatId, msgs_texto.figurinhas.sticker.erro_s,id)
                            })
                        } catch(err){
                            client.reply(chatId, err.message, id)
                        }
                    } else {
                        client.reply(chatId, msgs_texto.figurinhas.sticker.ssf_imagem, id)
                    }
                } else {
                    client.reply(chatId, erroComandoMsg(command), id)
                }
                break
        }
    } catch(err){
        throw err
    }
    

}