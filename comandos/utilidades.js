//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const {msg_admin_grupo, msg_comum, msg_comum_grupo} = require('../lib/menu')
const {msgs_texto} = require('../lib/msgs')
const {preencherTexto} = require("../lib/util")
const path = require('path')
const db = require('../database/database')
const sticker = require("../lib/sticker")
const servicos = require("../lib/servicos")
const {botInfo} = require(path.resolve("lib/bot.js"))

module.exports = utilidades = async(client,message) => {
    const { type, id, from, sender, chat, isGroupMsg, caption, isMedia, mimetype, quotedMsg, quotedMsgObj} = message
    let { body } = message
    let { pushname, verifiedName } = sender
    pushname = pushname || verifiedName
    const commands = caption || body || ''
    const command = commands.toLowerCase().split(' ')[0] || ''
    const args =  commands.split(' ')
    const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
    const numero_dono = process.env.NUMERO_DONO.split(",")
    switch(command){

     //################## UTILIDADES ########################
     case "!info":
        const foto_bot_url = await client.getProfilePicFromServer(botNumber+'@c.us')
        let info_bot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        let info_resposta = preencherTexto(msgs_texto.utilidades.info.resposta,info_bot.criador,info_bot.criado_em,info_bot.nome,info_bot.iniciado,info_bot.cmds_executados,numero_dono[0])
        client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",info_resposta,id)
        break
    
    case "!reportar":
        if(args.length == 1) return client.reply(from,msgs_texto.utilidades.reportar.cmd_erro ,id)
        let reportar_resposta = preencherTexto(msgs_texto.utilidades.reportar.resposta,pushname,sender.id.replace("@c.us",""),body.slice(10))
        client.sendText(numero_dono[0]+"@c.us",reportar_resposta)
        client.reply(from,msgs_texto.utilidades.reportar.sucesso,id)
        break
    
    case "!ddd":
        let ddd_selecionado = ""
        if(quotedMsg){
            let codigo_brasileiro = quotedMsgObj.author.slice(0,2)
            if(codigo_brasileiro != "55") return client.reply(from, msgs_texto.utilidades.ddd.somente_br ,id)
            ddd_selecionado = quotedMsgObj.author.slice(2,4)
        } else if(args.length > 1 && args[1].length == 2){
            ddd_selecionado = args[1]
        } else {
            return client.reply(from, msgs_texto.utilidades.ddd.cmd_erro, id)
        }
        const estados = JSON.parse(fs.readFileSync('./database/json/ddd.json')).estados
        estados.forEach(async (estado) =>{
            let ddd_resposta = preencherTexto(msgs_texto.utilidades.ddd.resposta,estado.nome,estado.regiao)
            if(estado.ddd.includes(ddd_selecionado)) return client.reply(from,ddd_resposta,id)
        })
        break

    case "!audio":
        if(args.length === 1) return client.reply(from, msgs_texto.utilidades.audio.cmd_erro, id)
        if(quotedMsg && (quotedMsg.type === "ptt" || quotedMsg.type === "audio") ){
            const mediaData = await decryptMedia(quotedMsg, uaOverride)
            let timestamp = Math.round(new Date().getTime()/1000)
            fs.writeFileSync(`./media/audios/originais/audio-${timestamp}.mp3`,mediaData, "base64")
            let caminho = path.resolve(`./media/audios/originais/audio-${timestamp}.mp3`)
            servicos.obterAudioEditado(caminho, args[1]).then(audio_caminho=>{
                client.sendFile(from, audio_caminho, "audio.mp3","", id).then(()=>{
                    fs.unlinkSync(audio_caminho)
                    fs.unlinkSync(caminho)
                })
            }).catch(msg=>{
                fs.unlinkSync(caminho)
                client.reply(from, msg, id)
            })
        } else {
            client.reply(from, msgs_texto.utilidades.audio.cmd_erro, id)
        }
        break

    case "!clima":
        if(args.length === 1) return client.reply(from, msgs_texto.utilidades.clima.cmd_erro ,id)
        servicos.obterClima(body.slice(7)).then(clima=>{
            let clima_resposta = preencherTexto(msgs_texto.utilidades.clima.resposta,clima.msg)
            client.sendFileFromUrl(from,clima.foto_url,`${body.slice(7)}.png`, clima_resposta, id)
        }).catch(msg=>{
            client.reply(from,msg,id)
        })
        break

    case "!moeda":
        if(args.length !== 3) return client.reply(from, msgs_texto.utilidades.moeda.cmd_erro, id)
        servicos.obterConversaoMoeda(args[1],args[2]).then(res=>{
            let moeda_resposta = preencherTexto(msgs_texto.utilidades.moeda.resposta,res.valor_inserido,res.moeda,res.valor_reais,res.data_atualizacao)
            client.reply(from, moeda_resposta ,id)
        }).catch(msg=>{
            client.reply(from, msg , id)
        })
        break

    case "!google":
        if (args.length === 1) return client.reply(from, msgs_texto.utilidades.google.cmd_erro , id)
        servicos.obterPesquisaGoogle(body.slice(8)).then(resultados=>{
            let google_resposta = preencherTexto(msgs_texto.utilidades.google.resposta_titulo,body.slice(8))
            resultados.forEach(resultado =>{
                google_resposta += "═════════════════\n"
                google_resposta += preencherTexto(msgs_texto.utilidades.google.resposta_itens,resultado.title,resultado.url)
            })
            client.reply(from,google_resposta,id)
        }).catch(msg=>{
            client.reply(from,msg,id)
        })
        break

     case '!rastreio':
        if (args.length === 1) return client.reply(from, msgs_texto.utilidades.rastreio.cmd_erro, id)
        servicos.obterRastreioCorreios(body.slice(10)).then(dados=>{
            let rastreio_resposta = msgs_texto.utilidades.rastreio.resposta_titulo
            dados.forEach(dado =>{
                let dados_local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                rastreio_resposta += preencherTexto(msgs_texto.utilidades.rastreio.resposta_itens,dado.status,dado.data,dado.hora,dados_local)
                rastreio_resposta += "-----------------------------------------\n"
            })
            client.reply(from, rastreio_resposta ,id)
        }).catch(msg=>{
            client.reply(from, msg ,id)
        })
        break
    
    case "!play":
        if(args.length === 1) return client.reply(from,msgs_texto.utilidades.play.cmd_erro,id)
        let play_video = await servicos.obterInfoVideo(body.slice(6))
        if(play_video == null) return client.reply(from,msgs_texto.utilidades.play.nao_encontrado,id)
        if(play_video.duration > 300000) return client.reply(from,msgs_texto.utilidades.play.limite,id)
        let play_espera = preencherTexto(msgs_texto.utilidades.play.espera,play_video.title,play_video.durationFormatted)
        client.reply(from,play_espera,id)
        servicos.obterYtMp3(play_video).then(mp3_path =>{
            client.sendFile(from, mp3_path, "musica.mp3","", id).then(()=>{
                fs.unlinkSync(mp3_path)
            })
        }).catch((msg)=>{
            client.reply(from,msg,id)
        })
        break
    
    case "!yt":
        if(args.length === 1) return client.reply(from,msgs_texto.utilidades.yt.cmd_erro,id)
        let yt_video = await servicos.obterInfoVideo(body.slice(6))
        if(yt_video == null) return client.reply(from,msgs_texto.utilidades.yt.nao_encontrado,id)
        if(yt_video.duration > 300000) return client.reply(from,msgs_texto.utilidades.yt.limite,id)
        let yt_espera = preencherTexto(msgs_texto.utilidades.yt.espera,yt_video.title,yt_video.durationFormatted)
        client.reply(from,yt_espera,id)
        servicos.obterYtMp4Url(yt_video).then(video =>{
            client.sendFile(from, video.download, `${video.titulo}.mp4`,"", id)
        }).catch(msg=>{
            client.reply(from,msg,id)
        })
        break
    
    case '!img':
        if(quotedMsg || type != "chat") return client.reply(from, msgs_texto.utilidades.img.cmd_erro , id)
        let qtd_Img = 1;
        let data_Img = ""
        if(!isNaN(args[1])){
            if(args[1] > 0 && args[1] <= 5) {
                qtd_Img = args[1]
                for(var i = 2; i < args.length; i++){
                    data_Img += `${args[i]} `
                }
            } else {
                return client.reply(from, msgs_texto.utilidades.img.qtd_imagem , id)
            }
        } else {
            data_Img = body.slice(5)
        }
        if (data_Img === '') return client.reply(from, msgs_texto.utilidades.img.tema_vazio , id)
        if (data_Img.length > 500) return client.reply(from, msgs_texto.utilidades.img.tema_longo , id)
        servicos.obterImagens(data_Img,qtd_Img).then(imagens=>{
            imagens.forEach(imagem =>{
                client.sendFileFromUrl(from, imagem , "foto.jpg" , "", (qtd_Img == 1) ? id : "").catch(()=>{
                    client.sendText(from, msgs_texto.utilidades.img.erro_imagem)
                })
            })
        }).catch(msg=>{
            client.sendText(from, msg)
        })
        break
    
    case '!meusdados':
        let meusdados = await db.obterUsuario(sender.id)
        let tipo_usuario_dados = "Comum"
        let max_comandos_md = (meusdados.max_comandos_dia == null) ? "Sem limite" : meusdados.max_comandos_dia
        switch(meusdados.tipo) {
            case "dono":
                tipo_usuario_dados = "🤖 Dono"
                break
            case "vip":
                tipo_usuario_dados = "⭐ VIP"
                break
            case "comum":
                tipo_usuario_dados = "👤 Comum"
                break    
        }
        let nome_usuario = (pushname != undefined) ? pushname : `Não obtido`
        let meusdados_resposta = preencherTexto(msgs_texto.utilidades.meusdados.resposta_geral,tipo_usuario_dados,nome_usuario,meusdados.comandos_total)
        
        if(botInfo().limite_diario.status) {
            meusdados_resposta += preencherTexto(msgs_texto.utilidades.meusdados.resposta_limite_diario,meusdados.comandos_dia,max_comandos_md,max_comandos_md)
        }

        if(isGroupMsg){
            let g_meusdados = await db.obterGrupo(groupId)
            if(g_meusdados.contador.status){
                let c_meusdados = await db.obterAtividade(groupId,sender.id)
                meusdados_resposta += preencherTexto(msgs_texto.utilidades.meusdados.resposta_grupo,c_meusdados.msg)
            }   
        }
        client.reply(from, meusdados_resposta, id)
        break

    case "!help": case "!menu": case ".menu": case ".help":
    case '!ajuda': //Menu principal
        let dados_user = await db.obterUsuario(sender.id)
        let max_comm = (dados_user.max_comandos_dia == null) ? "Sem limite" : dados_user.max_comandos_dia
        let tipo_usuario = "Comum"
        switch(dados_user.tipo) {
            case "dono":
                tipo_usuario = "🤖 Dono"
                break
            case "vip":
                tipo_usuario = "⭐ VIP"
                break
            case "comum":
                tipo_usuario = "👤 Comum"
                break     
        }

        let msgs_dados = ""
        let ajuda_usuario = (pushname != undefined) ? pushname : "Sem Nome"
        if(botInfo().limite_diario.status){
            msgs_dados = preencherTexto(msgs_texto.utilidades.ajuda.resposta_limite_diario,ajuda_usuario,dados_user.comandos_dia,max_comm,tipo_usuario)
        } else {
            msgs_dados = preencherTexto(msgs_texto.utilidades.ajuda.resposta_comum,ajuda_usuario,tipo_usuario)
        }
        msgs_dados += `═════════════════\n`
        let menu = ""
        if(isGroupMsg){
            if(isGroupAdmins){
                menu = msg_admin_grupo
            } else {
                menu = msg_comum_grupo
            }
        } else {
            menu = msg_comum
        }
        client.sendText(from, msgs_dados+menu)
        break

    case '!s':
        if(isMedia || quotedMsg){
            let dados_s = {}
            dados_s = {
                tipo : (isMedia)? type : quotedMsg.type,
                mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                mensagem: (isMedia)? message : quotedMsg
            }
            if(dados_s.tipo === "image"){
                const mediaData = await decryptMedia(dados_s.mensagem, uaOverride)
                const imageBase64 = `data:${dados_s.mimetype};base64,${mediaData.toString('base64')}`
                client.sendImageAsSticker(from, imageBase64,{author: "LBOT", pack: "LBOT Stickers", keepScale: true})
            } else {
                return client.reply(from, msgs_texto.utilidades.sticker.cmd_erro , id)
            }
        } else {
            return client.reply(from, msgs_texto.utilidades.sticker.cmd_erro , id)
        }
        break
    
    case '!simg':
        if(quotedMsg && quotedMsg.type == "sticker"){
            const mediaData = await decryptMedia(quotedMsg, uaOverride)
            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
            await client.sendFile(from,imageBase64,"sticker.jpg","",quotedMsgObj.id)
        } else {
            client.reply(from, msgs_texto.utilidades.simg.cmd_erro, id)
        }
        break

    case '!sgif':
        if(isMedia || quotedMsg){
            let dados_sgif = {}
            dados_sgif = {
                mimetype : (isMedia)? mimetype : quotedMsg.mimetype,
                duracao: (isMedia)? message.duration : quotedMsg.duration,
                mensagem: (isMedia)? message : quotedMsg
            }
            if((dados_sgif.mimetype === 'video/mp4' || dados_sgif.mimetype === 'image/gif') && dados_sgif.duracao < 10){
                const mediaData = await decryptMedia(dados_sgif.mensagem, uaOverride)
                client.reply(from, msgs_texto.geral.espera , id)
                sticker.stickerGif(mediaData,dados_sgif.mimetype).then((gifB64)=>{
                    client.sendImageAsSticker(from, gifB64,{author: "LBOT", pack: "LBOT Sticker Animado", keepScale: true})
                }).catch(()=>{
                    client.reply(from, msgs_texto.utilidades.sticker.video_longo , id)
                })
            }else {
                return client.reply(from, msgs_texto.utilidades.sticker.video_invalido, id)
            }
        } else {
            return client.reply(from, msgs_texto.geral.erro, id)
        }
        break

    case "!tps":
        if(args.length == 1 || quotedMsg || type != "chat") return client.reply(from,msgs_texto.utilidades.tps.cmd_erro,id)
        if(body.slice(5).length > 40) return client.reply(from,msgs_texto.utilidades.tps.texto_longo,id)
        await client.reply(from, msgs_texto.utilidades.tps.espera,id)
        sticker.textoParaSticker(body.slice(5)).then((base64)=>{
            client.sendImageAsSticker(from, base64,{author: "LBOT", pack: "LBOT Sticker Textos", keepScale: true})
        }).catch(msg=>{
            client.reply(from,msg,id)
        })
        break
    
    case '!ssf':
        if(isMedia || quotedMsg){
            let msgDataSsf = {
                tipo: (isMedia)? type : quotedMsg.type,
                mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                mensagem: (isMedia)? message : quotedMsg
            }
            if(msgDataSsf.tipo === "image"){
                var mediaData = await decryptMedia(msgDataSsf.mensagem, uaOverride)
                var imageBase64 = `data:${msgDataSsf.mimetype};base64,${mediaData.toString('base64')}`
                sticker.stickerSemFundo(imageBase64,msgDataSsf.mimetype).then(base64 =>{
                    client.sendImageAsSticker(from, base64,{author: "LBOT", pack: "LBOT Sticker Sem Fundo", keepScale: true})
                }).catch(err =>{
                    switch(err){
                        case 'insufficient_credits':
                            client.reply(from,msgs_texto.utilidades.sticker.sem_credito,id)
                            break
                        case 'auth_failed':
                            client.reply(from,msgs_texto.utilidades.sticker.autenticacao,id)
                            break
                        default:
                            client.reply(from,msgs_texto.utilidades.sticker.erro_remover,id)    
                    }
                })
            } else {
                client.reply(from, msgs_texto.utilidades.sticker.ssf_imagem, id)
            }
        } else {
            client.reply(from, msgs_texto.geral.erro, id)
        }
        break

    case "!anime":
        if(isMedia || quotedMsg){
            let msgDataAnime = {}
            msgDataAnime = {
                tipo: (isMedia)? type : quotedMsg.type,
                mimetype: (isMedia)? mimetype : quotedMsg.mimetype,
                mensagem: (isMedia)? message : quotedMsg
            }
            if(msgDataAnime.tipo === "image"){
                client.reply(from,msgs_texto.utilidades.anime.espera, id)
                var mediaData = await decryptMedia(msgDataAnime.mensagem, uaOverride)
                var imageBase64 = `data:${msgDataAnime.mimetype};base64,${mediaData.toString('base64')}`
                servicos.obterAnime(imageBase64).then((anime)=>{
                    if(anime.similaridade < 87) return client.reply(from,msgs_texto.utilidades.anime.similaridade,id)
                    anime.episodio =  (anime.episodio != "") ? anime.episodio : "---"
                    anime_resp = preencherTexto(msgs_texto.utilidades.anime.resposta,anime.titulo,anime.episodio,anime.tempo_inicial,anime.tempo_final,anime.similaridade)
                    client.sendFileFromUrl(from,anime.link_preview, "anime.mp4", anime_resp, id)
                }).catch((err)=>{
                    if(err.status == 429) return client.reply(from,msgs_texto.utilidades.anime.limite_solicitacao,id)
                    if(err.status == 400) return client.reply(from,msgs_texto.utilidades.anime.sem_resultado,id)
                    if(err.status == 500 || err.status == 503) return client.reply(from,msgs_texto.utilidades.anime.erro_servidor,id)
                })
            } else {
                client.reply(from,msgs_texto.utilidades.anime.cmd_erro, id)
            }
        } else {
            client.reply(from,msgs_texto.utilidades.anime.cmd_erro, id)
        }
        break

    case "!animelanc":
        servicos.obterAnimesLancamentos().then((animes)=>{
            let animelanc_resposta = msgs_texto.utilidades.animelanc.resposta_titulo
            animes.forEach(anime =>{
                animelanc_resposta += preencherTexto(msgs_texto.utilidades.animelanc.resposta_itens,anime.nome,anime.episodio,anime.link)
            })
            client.reply(from,animelanc_resposta,id)
        }).catch(()=>{
            client.reply(from,msgs_texto.utilidades.animelanc.erro_pesquisa,id)
        })
        break
    
    case "!traduz":
        let texto_traducao = ""
        if(quotedMsg != undefined && quotedMsg.type == "chat"){
            texto_traducao = quotedMsg.body
        } else if(quotedMsg == undefined && type == "chat" ){
            if(args.length === 1) return client.reply(from, msgs_texto.utilidades.traduz.cmd_erro ,id)
            texto_traducao = body.slice(8)
        } else {
            return client.reply(from, msgs_texto.utilidades.traduz.cmd_erro ,id)
        }
        servicos.obterTraducao(texto_traducao).then(traducao=>{
            client.reply(from, traducao, id);
        }).catch(msg=>{
            client.reply(from, msg, id)
        })
        break  
    
    case '!voz':
        var dataText = '';
        var id_resp = id
        if (args.length === 1) {
            return client.reply(from, msgs_texto.utilidades.voz.cmd_erro ,id)
        } else if(quotedMsg !== undefined && quotedMsg.type == 'chat'){
            dataText = (args.length == 2) ? quotedMsg.body : body.slice(8)
        } else {
            dataText = body.slice(8)
        }
        if (dataText === '') return client.reply(from, msgs_texto.utilidades.voz.texto_vazio , id)
        if (dataText.length > 5000) return client.reply(from, msgs_texto.utilidades.voz.texto_longo, id)
        if(quotedMsg !== undefined) id_resp = quotedMsgObj.id
        var idioma = body.slice(5, 7).toLowerCase()
        servicos.textoParaVoz(idioma,dataText).then(audio_path=>{
            client.sendPtt(from, audio_path, id_resp)
        }).catch(msg=>{
            client.reply(from, msg, id)
        })
        break

    case '!noticias':
        servicos.obterNoticias().then(noticias=>{
            let noticias_resposta = msgs_texto.utilidades.noticia.resposta_titulo
            noticias.forEach(async(noticia) =>{
                noticias_resposta += preencherTexto(msgs_texto.utilidades.noticia.resposta_itens,noticia.title)
            })
            client.reply(from,noticias_resposta, id)
        }).catch(msg=>{
            client.reply(from,msg,id)
        })
        break;

    case '!calc':
        if(args.length === 1) return client.reply(from, msgs_texto.utilidades.calc.cmd_erro ,id)
        let expressao = body.slice(6)
        servicos.obterCalculo(expressao).then(resultado=>{
            let calc_resposta = preencherTexto(msgs_texto.utilidades.calc.resposta,resultado)
            client.reply(from,calc_resposta,id)
        }).catch(msg=>{
            client.reply(from, msg,id)
        })
        break
    }

}