const socket = require('../lib-baileys/socket-funcoes')
const {MessageTypes} = require("../lib-baileys/mensagem")
const { Sticker, StickerTypes } = require("@victorsouzaleal/wa-sticker-formatter")
const {downloadMediaMessage} = require("@whiskeysockets/baileys")
const obterBotVariaveis = require("../db-modulos/dados-bot-variaveis")

module.exports = {
    autoSticker: async(c, messageTranslated)=>{
        try{
            const {chatId, mimetype, type, id, seconds} = messageTranslated
            const {nome_bot, nome_sticker} = obterBotVariaveis()
            var stickerMetadata = {
                pack: nome_sticker?.trim(), 
                author: nome_bot?.trim(),
                type: StickerTypes.FULL,
                quality: 100,
                fps: 7, 
                background: '#000000' 
            }

            if(type == MessageTypes.image){
                var bufferMessage = await downloadMediaMessage(id, "buffer")
                const stker = new Sticker(bufferMessage, stickerMetadata)
                await socket.sendSticker(c, chatId, await stker.toMessage())
            }
    
            if(type == MessageTypes.video){
                stickerMetadata.quality = 25
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