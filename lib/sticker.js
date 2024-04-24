import * as socket from '../baileys/socket-funcoes.js'
import {MessageTypes} from '../baileys/mensagem.js'
import { Sticker, StickerTypes } from '@victorsouzaleal/wa-sticker-formatter'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import {botInfo} from '../database/bot.js'


export const autoSticker = async(c, mensagemInfoCompleta)=>{
    try{
        const {chatId, mimetype, type, id, seconds} = mensagemInfoCompleta.mensagem
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {nome_bot, nome_pack} = botInfoJSON
        var stickerMetadata = {
            pack: nome_pack?.trim(), 
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
