//REQUERINDO MÓDULOS
import {erroComandoMsg, consoleErro, criarTexto} from '../lib/util.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import api from '../../api/api.js'
import {obterMensagensTexto} from '../lib/msgs.js'


export const figurinhas = async(c, mensagemBaileys, botInfo) => {
    //Atribuição de valores
    const msgs_texto = obterMensagensTexto(botInfo)
    const {prefixo, nome_pack, nome_bot } = botInfo
    const {
        texto_recebido,
        comando,
        args,
        tipo,
        mensagem,
        id_chat,
        mensagem_citada,
        midia,
        citacao
    } = mensagemBaileys
    const {mimetype, segundos} = {...midia}
    const comandoSemPrefixo = comando.replace(prefixo, "")
    
    //Comandos de figurinhas
    try{
        switch(comandoSemPrefixo){
            case 'snome':
                try{
                    if(!mensagem_citada || citacao.tipo != MessageTypes.sticker) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let [pack, autor] = texto_recebido.split(',')
                    if(!pack || !autor) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let mensagemSticker = citacao.mensagem
                    mensagemSticker.message.stickerMessage.url = mensagemSticker.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemSticker.message.stickerMessage.directPath}` : mensagemSticker.message.stickerMessage.url
                    let bufferSticker = await downloadMediaMessage(citacao.mensagem, 'buffer')
                    await api.Stickers.renomearSticker(bufferSticker, pack, autor).then(async ({resultado})=>{
                        await socket.enviarFigurinha(c, id_chat, resultado)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                    })  
                } catch(err){
                    throw err
                }
                break 

            case 's':
                try{
                    let tipoFigurinha = texto_recebido === '1' ? 'circle' : 'default' 
                    let dadosMensagem = {
                        tipo : (mensagem_citada) ? citacao.tipo : tipo,
                        mimetype : (mensagem_citada) ? citacao.mimetype : mimetype,
                        message: (mensagem_citada) ? citacao.mensagem  : mensagem,
                        seconds: (mensagem_citada) ? citacao.segundos : segundos
                    }
                    if(dadosMensagem.tipo != MessageTypes.image && dadosMensagem.tipo != MessageTypes.video) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem)
                    if(dadosMensagem.tipo == MessageTypes.video && dadosMensagem.seconds > 9) return socket.responderTexto(c, id_chat, msgs_texto.figurinhas.sticker.video_invalido, mensagem)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Stickers.criarSticker(bufferMidia, {pack: nome_pack?.trim(), autor: nome_bot?.trim(), fps: 9, tipo: tipoFigurinha}).then(async ({resultado})=>{
                        await socket.enviarFigurinha(c, id_chat, resultado)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'simg':
                try{
                    if(mensagem_citada && citacao.tipo == MessageTypes.sticker){
                        let mensagemQuoted = citacao.mensagem, imagemSaida
                        mensagemQuoted.message.stickerMessage.url = mensagemQuoted.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemQuoted.message.stickerMessage.directPath}` : mensagemQuoted.message.stickerMessage.url
                        let bufferSticker = await downloadMediaMessage(mensagemQuoted, "buffer")
                        await api.Stickers.stickerParaImagem(bufferSticker).then(async ({resultado}) =>{
                            await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, resultado, '', mensagem , 'image/png')
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                        })
                    } else {
                        await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    }
                } catch(err){
                    throw err
                }
                
                break 
                
            case 'emojimix':
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    let [emoji1, emoji2] = texto_recebido.split("+")
                    if(!emoji1 || !emoji2) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem)
                    await api.Imagens.misturarEmojis(emoji1, emoji2).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                        })
                    }).catch( async err =>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                    })
                } catch(err){
                    throw err
                }

                break

            case "ssf":
                try{
                    let dadosMensagem = {
                        tipo : (mensagem_citada) ? citacao.tipo : tipo,
                        mimetype : (mensagem_citada) ? citacao.mimetype : mimetype,
                        message: (mensagem_citada) ? citacao.mensagem  : mensagem,
                        seconds: (mensagem_citada) ? citacao.segundos : segundos
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat, msgs_texto.figurinhas.sticker.ssf_imagem , mensagem)
                    await socket.responderTexto(c, id_chat, msgs_texto.figurinhas.sticker.ssf_espera , mensagem)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Imagens.removerFundo(bufferMidia).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                        })
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'tps':
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem)
                    let usuarioTexto = texto_recebido
                    await api.Imagens.textoParaImagem(usuarioTexto).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                        })
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'atps':
                try{
                    if(!args.length) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem)
                    let usuarioTexto = texto_recebido
                    await api.Imagens.textoParaImagem(usuarioTexto, true).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                        })
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem)
                    })
                } catch (err){
                    throw err
                }
                break
        }

    } catch(err){
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "FIGURINHAS")
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem) 
    }
}

export const autoSticker = async(c, mensagemBaileys, botInfo)=>{
    try{
        //Atribuição de valores
        const msgs_texto = obterMensagensTexto(botInfo)
        const {nome_bot, nome_pack} = botInfo
        const {id_chat, tipo, mensagem, midia} = mensagemBaileys
        const {segundos} = {...midia}

        //Verificando se é imagem ou video e fazendo o sticker automaticamente
        if(tipo == MessageTypes.image || tipo == MessageTypes.video){
            if(tipo == MessageTypes.video && segundos > 9) return
            let bufferMidia = await downloadMediaMessage(mensagem, "buffer")
            await api.Stickers.criarSticker(bufferMidia, {pack: nome_pack?.trim(), autor: nome_bot?.trim(), fps: 9}).then(async ({resultado})=>{
                await socket.enviarFigurinha(c, id_chat, resultado)
            }).catch(async(err)=>{
                if(!err.erro) throw err
                await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, 'AUTO-STICKER', err.erro) , mensagem)
            })
        }
    } catch(err){
        throw err
    }
}