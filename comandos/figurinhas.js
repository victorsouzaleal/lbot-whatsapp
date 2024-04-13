//REQUERINDO MÓDULOS
const msgs_texto = require('../lib/msgs')
const {erroComandoMsg, consoleErro, removerNegritoComando, criarTexto} = require("../lib/util")
const { Sticker, StickerTypes } = require("wa-sticker-formatter")
const socket = require("../lib-translate/socket-functions")
const {MessageTypes}  = require("../lib-translate/message")
const {downloadMediaMessage} = require('@whiskeysockets/baileys')
const fs = require('fs-extra')
const path = require("path")
const {stickerToPng} = require("../lib/conversao")


module.exports = figurinhas = async(c,messageTranslated) => {
    try{
        const { type, id, sender, chatId, caption, isMedia, mimetype, quotedMsg, seconds, messageId, quotedMsgObjInfo, quotedMsgObj, body} = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        switch(command){      
            case '!s':
                try{
                    if(isMedia || quotedMsg){
                        var argSticker = args.length > 1 ? args[1].toLowerCase() : ""
                        var stickerMetadata = {
                            pack: `${process.env.NOME_AUTOR_FIGURINHAS.trim()} Stickers`, 
                            author: process.env.NOME_AUTOR_FIGURINHAS.trim(),
                            type: StickerTypes.CROPPED,
                            quality: 100, 
                            background: '#000000' 
                        }
    
                        if(argSticker == "1"){
                            stickerMetadata.type = StickerTypes.CIRCLE
                        } else if (argSticker == "2"){
                            stickerMetadata.type = StickerTypes.FULL
                        }
    
                        var dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            message: (quotedMsg)? quotedMsgObj  : id,
                            seconds: (quotedMsg)? quotedMsgObjInfo.seconds : seconds
                        }
    
                        if(dadosMensagem.tipo == MessageTypes.image){
                            var bufferMessage = await downloadMediaMessage(dadosMensagem.message, "buffer")
                            const stker = new Sticker(bufferMessage, stickerMetadata)
                            await socket.sendSticker(c,chatId, await stker.toMessage())
                        } else if (dadosMensagem.tipo == MessageTypes.video){
                            if(dadosMensagem.seconds < 11){
                                stickerMetadata.quality = 5
                                var bufferMessage = await downloadMediaMessage(dadosMensagem.message, "buffer")
                                const stker = new Sticker(bufferMessage, stickerMetadata)
                                await socket.sendSticker(c,chatId, await stker.toMessage())
                            } else {
                                return socket.reply(c,chatId, msgs_texto.figurinhas.sticker.video_invalido, id)
                            }
                        } else {
                            return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                        }
                    } else {
                        return await socket.reply(c, chatId, erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case '!simg':
                try{
                    if(quotedMsg && quotedMsgObjInfo.type == MessageTypes.sticker){
                        var mensagemQuoted = quotedMsgObj, imagemSaida
                        mensagemQuoted.message.stickerMessage.url = mensagemQuoted.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemQuoted.message.stickerMessage.directPath}` : mensagemQuoted.message.stickerMessage.url
                        var bufferMensagem = await downloadMediaMessage(mensagemQuoted, "buffer")
                        var conversaoResultado = await stickerToPng(bufferMensagem)
                        imagemSaida = conversaoResultado.saida
                        if(!conversaoResultado.success){
                            fs.unlinkSync(imagemSaida)
                            throw new Error("Erro na conversão")
                        } else{
                            await socket.replyFile(c, MessageTypes.image, chatId, imagemSaida, '', id)
                            fs.unlinkSync(imagemSaida)
                        }
                    } else {
                        await socket.reply(c, chatId, erroComandoMsg(command), id)
                    }
                } catch(err){
                    if(fs.existsSync(imagemSaida)) fs.unlinkSync(imagemSaida)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break      
        }
    } catch(err){
        consoleErro(err, "FIGURINHAS")
    }
    

}