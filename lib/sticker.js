const socket = require('../lib-translate/socket-functions')
const {MessageTypes} = require("../lib-translate/message")
const { Sticker, StickerTypes } = require("wa-sticker-formatter")
const {downloadMediaMessage} = require("@whiskeysockets/baileys")


module.exports = {
    autoSticker: async(c, messageTranslated)=>{
        try{
            const {chatId, mimetype, type, id, seconds} = messageTranslated 
            var stickerMetadata = {
                pack: `${process.env.NOME_AUTOR_FIGURINHAS.trim()} Stickers`, 
                author: process.env.NOME_AUTOR_FIGURINHAS.trim(),
                type: StickerTypes.FULL,
                quality: 100, 
                background: '#000000' 
            }

            if(type == MessageTypes.image){
                var bufferMessage = await downloadMediaMessage(id, "buffer")
                const stker = new Sticker(bufferMessage, stickerMetadata)
                await socket.sendSticker(c, chatId, await stker.toMessage())
            }
    
            if(type == MessageTypes.video){
                stickerMetadata.quality = 6
                if(seconds > 10) return
                var bufferMessage = await downloadMediaMessage(id, "buffer")
                const stker = new Sticker(bufferMessage, stickerMetadata)
                await socket.sendSticker(c, chatId, await stker.toMessage())
            }
        } catch(err){
            throw err
        }
    }

}