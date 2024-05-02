//REQUERINDO MÓDULOS
import {erroComandoMsg, consoleErro, criarTexto, stickerToPng} from '../lib/util.js'
import { Sticker, StickerTypes } from '@victorsouzaleal/wa-sticker-formatter'
import * as socket from '../baileys/socket-funcoes.js'
import {MessageTypes} from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs-extra'
import {misturarEmojis, removerFundo, textoParaImagem} from '../lib/api.js'


export const figurinhas = async(c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {textoRecebido, command, args, type, id, chatId, isMedia, mimetype, quotedMsg, seconds, quotedMsgObjInfo, quotedMsgObj} = mensagemInfoCompleta.mensagem
        const {prefixo, nome_pack, nome_bot } = botInfoJSON
        let cmdSemPrefixo = command.replace(prefixo, "")

        switch(cmdSemPrefixo){      
            case 's':
                try{
                    if(isMedia || quotedMsg){
                        var argSticker = args.length > 1 ? args[1].toLowerCase() : ""
                        var stickerMetadata = {
                            pack: nome_pack?.trim(), 
                            author: nome_bot?.trim(),
                            type: StickerTypes.CROPPED,
                            quality: 100,
                            fps: 6,
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
                                stickerMetadata.quality = 20
                                var bufferMessage = await downloadMediaMessage(dadosMensagem.message, "buffer")
                                const stker = new Sticker(bufferMessage, stickerMetadata)
                                await socket.sendSticker(c,chatId, await stker.toMessage())
                            } else {
                                return socket.reply(c,chatId, msgs_texto.figurinhas.sticker.video_invalido, id)
                            }
                        } else {
                            return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                        }
                    } else {
                        return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break
            
            case 'simg':
                try{
                    if(quotedMsg && quotedMsgObjInfo.type == MessageTypes.sticker){
                        var mensagemQuoted = quotedMsgObj, imagemSaida
                        mensagemQuoted.message.stickerMessage.url = mensagemQuoted.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemQuoted.message.stickerMessage.directPath}` : mensagemQuoted.message.stickerMessage.url
                        var bufferMensagem = await downloadMediaMessage(mensagemQuoted, "buffer")
                        var conversaoResultado = await stickerToPng(bufferMensagem)
                        imagemSaida = conversaoResultado.saida
                        if(!conversaoResultado.success){
                            fs.unlinkSync(imagemSaida)
                            await socket.reply(c, chatId, msgs_texto.figurinhas.sticker.erro_conversao, id)
                        } else{
                            await socket.replyFile(c, MessageTypes.image, chatId, imagemSaida, '', id)
                            fs.unlinkSync(imagemSaida)
                        }
                    } else {
                        await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    }
                } catch(err){
                    if(fs.existsSync(imagemSaida)) fs.unlinkSync(imagemSaida)
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                
                break 
                
            case 'emojimix':
                try{
                    if(args.length === 1) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    let usuarioTexto = textoRecebido.slice(10).trim(), emojis = usuarioTexto.split("+")
                    if(emojis.length == 0 || !emojis[0] || !emojis[1]) return await socket.reply(c, chatId, await erroComandoMsg(command), id)
                    var stickerMetadata = {
                        pack: nome_pack?.trim(), 
                        author: nome_bot?.trim(),
                        type: StickerTypes.CROPPED,
                        quality: 100,
                        background: '#000000' 
                    }
                    await misturarEmojis(emojis[0], emojis[1]).then(async ({resultado})=>{
                        const stker = new Sticker(resultado, stickerMetadata)
                        await socket.sendSticker(c, chatId, await stker.toMessage())
                    }).catch( async err =>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }

                break

            case "ssf":
                try{
                    if(isMedia|| quotedMsg){
                        let argSticker = args.length > 1 ? args[1].toLowerCase() : ""
                        let stickerMetadata = {
                            pack: nome_pack?.trim(), 
                            author: nome_bot?.trim(),
                            type: StickerTypes.CROPPED,
                            quality: 100,
                            fps: 7,
                            background: '#000000' 
                        }
    
                        if(argSticker == "1"){
                            stickerMetadata.type = StickerTypes.CIRCLE
                        } else if (argSticker == "2"){
                            stickerMetadata.type = StickerTypes.FULL
                        }
    
                        let dadosMensagem = {
                            tipo : (isMedia) ? type : quotedMsgObjInfo.type,
                            mimetype : (isMedia)? mimetype : quotedMsgObjInfo.mimetype,
                            message: (quotedMsg)? quotedMsgObj  : id,
                            seconds: (quotedMsg)? quotedMsgObjInfo.seconds : seconds
                        }
    
                        if(dadosMensagem.tipo == MessageTypes.image){
                            await socket.reply(c, chatId, msgs_texto.figurinhas.sticker.ssf_espera , id)
                            let bufferMessage = await downloadMediaMessage(dadosMensagem.message, "buffer")
                            await removerFundo(bufferMessage).then(async ({resultado})=>{
                                const stker = new Sticker(resultado, stickerMetadata)
                                await socket.sendSticker(c, chatId, await stker.toMessage())
                            }).catch(async(err)=>{
                                if(!err.erro) throw err
                                await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                            })
                        } else {
                            return await socket.reply(c, chatId, msgs_texto.figurinhas.sticker.ssf_imagem , id)
                        }
                    } else {
                        return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    }
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'tps':
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    let stickerMetadata = {
                        pack: nome_pack?.trim(), 
                        author: nome_bot?.trim(),
                        type: StickerTypes.FULL,
                        quality: 100
                    }
                    await textoParaImagem(usuarioTexto).then(async ({resultado})=>{
                        const stker = new Sticker(resultado, stickerMetadata)
                        await socket.sendSticker(c, chatId, await stker.toMessage())
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id)
                    err.message = `${command} - ${err.message}`
                    throw err
                }
                break

            case 'atps':
                try{
                    if(args.length == 1) return await socket.reply(c, chatId, await erroComandoMsg(command) , id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    let stickerMetadata = {
                        pack: nome_pack?.trim(), 
                        author: nome_bot?.trim(),
                        type: StickerTypes.FULL,
                        quality: 100,
                        background: '#000000' 
                    }
                    await textoParaImagem(usuarioTexto, true).then(async ({resultado})=>{
                        const stker = new Sticker(resultado, stickerMetadata)
                        await socket.sendSticker(c, chatId, await stker.toMessage())
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.reply(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch (err){
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