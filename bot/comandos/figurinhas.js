//REQUERINDO MÓDULOS
import {erroComandoMsg, consoleErro, criarTexto} from '../lib/util.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import api from '../../api/api.js'
import {obterMensagensTexto} from '../lib/msgs.js'


export const figurinhas = async(c, mensagemBaileys, botInfo) => {
    const msgs_texto = obterMensagensTexto(botInfo)
    const {prefixo, nome_pack, nome_bot } = botInfo
    const {textoRecebido, command, args, type, id, chatId, mimetype, quotedMsg, seconds, quotedMsgObjInfo, quotedMsgObj} = mensagemBaileys
    let cmdSemPrefixo = command.replace(prefixo, "")
    
    try{
        switch(cmdSemPrefixo){
            case 'snome':
                try{
                    if(!quotedMsg || quotedMsgObjInfo.type != MessageTypes.sticker) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo), id)
                    let [pack, autor] = textoRecebido.slice(7).trim().split(',')
                    if(!pack || !autor) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo), id)
                    let mensagemSticker = quotedMsgObj
                    mensagemSticker.message.stickerMessage.url = mensagemSticker.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemSticker.message.stickerMessage.directPath}` : mensagemSticker.message.stickerMessage.url
                    let bufferSticker = await downloadMediaMessage(quotedMsgObj, 'buffer')
                    await api.Stickers.renomearSticker(bufferSticker, pack, autor).then(async ({resultado})=>{
                        await socket.enviarFigurinha(c, chatId, resultado)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })  
                } catch(err){
                    throw err
                }
                break 

            case 's':
                try{
                    let stickerArg, tipoFigurinha
                    if(args.length > 1) stickerArg = args[1]
                    let argSuportado = ['1', '2'].includes(stickerArg)
                    if(!argSuportado) tipoFigurinha = 'default'
                    if(argSuportado){
                        if(stickerArg == 1) tipoFigurinha = 'circle'
                    }
                    let dadosMensagem = {
                        tipo : (quotedMsg) ? quotedMsgObjInfo.type : type,
                        mimetype : (quotedMsg) ? quotedMsgObjInfo.mimetype : mimetype,
                        message: (quotedMsg) ? quotedMsgObj  : id,
                        seconds: (quotedMsg) ? quotedMsgObjInfo.seconds : seconds
                    }
                    if(dadosMensagem.tipo != MessageTypes.image && dadosMensagem.tipo != MessageTypes.video) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo) , id)
                    if(dadosMensagem.tipo == MessageTypes.video && dadosMensagem.seconds > 9) return socket.responderTexto(c, chatId, msgs_texto.figurinhas.sticker.video_invalido, id)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Stickers.criarSticker(bufferMidia, {pack: nome_pack?.trim(), autor: nome_bot?.trim(), fps: 9, tipo: tipoFigurinha}).then(async ({resultado})=>{
                        await socket.enviarFigurinha(c, chatId, resultado)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'simg':
                try{
                    if(quotedMsg && quotedMsgObjInfo.type == MessageTypes.sticker){
                        let mensagemQuoted = quotedMsgObj, imagemSaida
                        mensagemQuoted.message.stickerMessage.url = mensagemQuoted.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemQuoted.message.stickerMessage.directPath}` : mensagemQuoted.message.stickerMessage.url
                        let bufferSticker = await downloadMediaMessage(mensagemQuoted, "buffer")
                        await api.Stickers.stickerParaImagem(bufferSticker).then(async ({resultado}) =>{
                            await socket.responderArquivoBuffer(c, MessageTypes.image, chatId, resultado, '', id , 'image/png')
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                        })
                    } else {
                        await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo), id)
                    }
                } catch(err){
                    throw err
                }
                
                break 
                
            case 'emojimix':
                try{
                    if(args.length === 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo), id)
                    let usuarioTexto = textoRecebido.slice(10).trim(), emojis = usuarioTexto.split("+")
                    if(emojis.length == 0 || !emojis[0] || !emojis[1]) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo), id)
                    await api.Imagens.misturarEmojis(emojis[0], emojis[1]).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, chatId, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                        })
                    }).catch( async err =>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }

                break

            case "ssf":
                try{
                    let dadosMensagem = {
                        tipo : (quotedMsg) ? quotedMsgObjInfo.type : type,
                        mimetype : (quotedMsg) ? quotedMsgObjInfo.mimetype : mimetype,
                        message: (quotedMsg) ? quotedMsgObj  : id,
                        seconds: (quotedMsg) ? quotedMsgObjInfo.seconds : seconds
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, chatId, msgs_texto.figurinhas.sticker.ssf_imagem , id)
                    await socket.responderTexto(c, chatId, msgs_texto.figurinhas.sticker.ssf_espera , id)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Imagens.removerFundo(bufferMidia).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, chatId, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                        })
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'tps':
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo) , id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await api.Imagens.textoParaImagem(usuarioTexto).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, chatId, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                        })
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'atps':
                try{
                    if(args.length == 1) return await socket.responderTexto(c, chatId, erroComandoMsg(command, botInfo) , id)
                    let usuarioTexto = textoRecebido.slice(5).trim()
                    await api.Imagens.textoParaImagem(usuarioTexto, true).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, chatId, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                        })
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, command, err.erro) , id)
                    })
                } catch (err){
                    throw err
                }
                break
        }

    } catch(err){
        err.message = `${command} - ${err.message}`
        consoleErro(err, "FIGURINHAS")
        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_comando_codigo, command), id) 
    }
}

export const autoSticker = async(c, mensagemBaileys, botInfo)=>{
    try{
        const msgs_texto = obterMensagensTexto(botInfo)
        const {nome_bot, nome_pack} = botInfo
        const {chatId, type, id, seconds} = mensagemBaileys

        if(type == MessageTypes.image || type == MessageTypes.video){
            if(type == MessageTypes.video && seconds > 9) return
            let bufferMidia = await downloadMediaMessage(id, "buffer")
            await api.Stickers.criarSticker(bufferMidia, {pack: nome_pack?.trim(), autor: nome_bot?.trim(), fps: 9}).then(async ({resultado})=>{
                await socket.enviarFigurinha(c, chatId, resultado)
            }).catch(async(err)=>{
                if(!err.erro) throw err
                await socket.responderTexto(c, chatId, criarTexto(msgs_texto.geral.erro_api, 'AUTO-STICKER', err.erro) , id)
            })
        }
    } catch(err){
        throw err
    }
}