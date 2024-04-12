//REQUERINDO MÓDULOS
const msgs_texto = require('../lib/msgs')
const {erroComandoMsg, consoleErro, removerNegritoComando} = require("../lib/util")
const sticker = require("../lib/sticker")
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter")
const client = require("../lib-translate/baileys")
const {MessageTypes}  = require("../lib-translate/msgtypes")
const {downloadMediaMessage} = require('@whiskeysockets/baileys')
const { duration } = require('moment-timezone')


module.exports = figurinhas = async(c,messageTranslated) => {
    try{
        const { type, id, sender, chatId, caption, isMedia, mimetype, quotedMsg, seconds, messageId, quotedMsgObjInfo, quotedMsgObj, body} = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        switch(command){      
            case '!s': 
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
                        await client.sendSticker(c,chatId, await stker.toMessage())
                    } else if (dadosMensagem.tipo == MessageTypes.video){
                        if(dadosMensagem.seconds < 11){
                            stickerMetadata.quality = 5
                            var bufferMessage = await downloadMediaMessage(dadosMensagem.message, "buffer")
                            const stker = new Sticker(bufferMessage, stickerMetadata)
                            await client.sendSticker(c,chatId, await stker.toMessage())
                        } else {
                            return client.reply(c,chatId, msgs_texto.figurinhas.sticker.video_invalido, id)
                        }
                    } else {
                        return await client.reply(c, chatId, erroComandoMsg(command) , id)
                    }
                } else {
                    return await client.reply(c, chatId, erroComandoMsg(command) , id)
                }
                break
            
            case '!simg':
                if(quotedMsg && quotedMsgObjInfo.type == MessageTypes.sticker){
                    var quotedMessage = await client.getFakeQuotedMessage(messageId, sender, quotedMsgObj)
                    var bufferMessage = await downloadMediaMessage(quotedMessage, "buffer")
                    await c.sendMessage(chatId, {image: bufferMessage}).catch(()=>{
                        client.reply(c, chatId, erroComandoMsg(command), id)
                    })
                } else {
                    client.reply(c, chatId, erroComandoMsg(command), id)
                }
                break      
        }
    } catch(err){
        throw err
    }
    

}