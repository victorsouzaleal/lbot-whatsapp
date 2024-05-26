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
        mensagem_completa,
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
                    if(!mensagem_citada || citacao.tipo != MessageTypes.sticker) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let [pack, autor] = texto_recebido.slice(7).trim().split(',')
                    if(!pack || !autor) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let mensagemSticker = citacao.mensagem_citacao
                    mensagemSticker.message.stickerMessage.url = mensagemSticker.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemSticker.message.stickerMessage.directPath}` : mensagemSticker.message.stickerMessage.url
                    let bufferSticker = await downloadMediaMessage(citacao.mensagem_citacao, 'buffer')
                    await api.Stickers.renomearSticker(bufferSticker, pack, autor).then(async ({resultado})=>{
                        await socket.enviarFigurinha(c, id_chat, resultado)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
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
                        tipo : (mensagem_citada) ? citacao.tipo : tipo,
                        mimetype : (mensagem_citada) ? citacao.mimetype : mimetype,
                        message: (mensagem_citada) ? citacao.mensagem_citacao  : mensagem_completa,
                        seconds: (mensagem_citada) ? citacao.segundos : segundos
                    }
                    if(dadosMensagem.tipo != MessageTypes.image && dadosMensagem.tipo != MessageTypes.video) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    if(dadosMensagem.tipo == MessageTypes.video && dadosMensagem.seconds > 9) return socket.responderTexto(c, id_chat, msgs_texto.figurinhas.sticker.video_invalido, mensagem_completa)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Stickers.criarSticker(bufferMidia, {pack: nome_pack?.trim(), autor: nome_bot?.trim(), fps: 9, tipo: tipoFigurinha}).then(async ({resultado})=>{
                        await socket.enviarFigurinha(c, id_chat, resultado)
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break
            
            case 'simg':
                try{
                    if(mensagem_citada && citacao.tipo == MessageTypes.sticker){
                        let mensagemQuoted = citacao.mensagem_citacao, imagemSaida
                        mensagemQuoted.message.stickerMessage.url = mensagemQuoted.message.stickerMessage.url == "https://web.whatsapp.net" ? `https://mmg.whatsapp.net${mensagemQuoted.message.stickerMessage.directPath}` : mensagemQuoted.message.stickerMessage.url
                        let bufferSticker = await downloadMediaMessage(mensagemQuoted, "buffer")
                        await api.Stickers.stickerParaImagem(bufferSticker).then(async ({resultado}) =>{
                            await socket.responderArquivoBuffer(c, MessageTypes.image, id_chat, resultado, '', mensagem_completa , 'image/png')
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                        })
                    } else {
                        await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    }
                } catch(err){
                    throw err
                }
                
                break 
                
            case 'emojimix':
                try{
                    if(args.length === 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(10).trim(), emojis = usuarioTexto.split("+")
                    if(emojis.length == 0 || !emojis[0] || !emojis[1]) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo), mensagem_completa)
                    await api.Imagens.misturarEmojis(emojis[0], emojis[1]).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                        })
                    }).catch( async err =>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
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
                        message: (mensagem_citada) ? citacao.mensagem_citacao  : mensagem_completa,
                        seconds: (mensagem_citada) ? citacao.segundos : segundos
                    }
                    if(dadosMensagem.tipo != MessageTypes.image) return await socket.responderTexto(c, id_chat, msgs_texto.figurinhas.sticker.ssf_imagem , mensagem_completa)
                    await socket.responderTexto(c, id_chat, msgs_texto.figurinhas.sticker.ssf_espera , mensagem_completa)
                    let bufferMidia = await downloadMediaMessage(dadosMensagem.message, "buffer")
                    await api.Imagens.removerFundo(bufferMidia).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                        })
                    }).catch(async(err)=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'tps':
                try{
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(5).trim()
                    await api.Imagens.textoParaImagem(usuarioTexto).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                        })
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch(err){
                    throw err
                }
                break

            case 'atps':
                try{
                    if(args.length == 1) return await socket.responderTexto(c, id_chat, erroComandoMsg(comando, botInfo) , mensagem_completa)
                    let usuarioTexto = texto_recebido.slice(5).trim()
                    await api.Imagens.textoParaImagem(usuarioTexto, true).then(async ({resultado})=>{
                        await api.Stickers.criarSticker(resultado, {pack: nome_pack?.trim(), autor: nome_bot?.trim()}).then(async ({resultado})=>{
                            await socket.enviarFigurinha(c, id_chat, resultado)
                        }).catch(async(err)=>{
                            if(!err.erro) throw err
                            await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                        })
                    }).catch(async err=>{
                        if(!err.erro) throw err
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, comando, err.erro) , mensagem_completa)
                    })
                } catch (err){
                    throw err
                }
                break
        }

    } catch(err){
        err.message = `${comando} - ${err.message}`
        consoleErro(err, "FIGURINHAS")
        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_comando_codigo, comando), mensagem_completa) 
    }
}

export const autoSticker = async(c, mensagemBaileys, botInfo)=>{
    try{
        //Atribuição de valores
        const msgs_texto = obterMensagensTexto(botInfo)
        const {nome_bot, nome_pack} = botInfo
        const {id_chat, tipo, mensagem_completa, midia} = mensagemBaileys
        const {segundos} = {...midia}

        //Verificando se é imagem ou video e fazendo o sticker automaticamente
        if(tipo == MessageTypes.image || tipo == MessageTypes.video){
            if(tipo == MessageTypes.video && segundos > 9) return
            let bufferMidia = await downloadMediaMessage(mensagem_completa, "buffer")
            await api.Stickers.criarSticker(bufferMidia, {pack: nome_pack?.trim(), autor: nome_bot?.trim(), fps: 9}).then(async ({resultado})=>{
                await socket.enviarFigurinha(c, id_chat, resultado)
            }).catch(async(err)=>{
                if(!err.erro) throw err
                await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.erro_api, 'AUTO-STICKER', err.erro) , mensagem_completa)
            })
        }
    } catch(err){
        throw err
    }
}