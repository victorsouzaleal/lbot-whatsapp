//REQUERINDO MÓDULOS
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const {ajuda} = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const {preencherTexto, erroComandoMsg, consoleErro} = require("../lib/util")
const path = require('path')
const db = require('../database/database')
const sticker = require("../lib/sticker")
const servicos = require("../lib/servicos")
const {converterMp4Mp3} = require("../lib/conversor")
const {botInfo} = require(path.resolve("lib/bot.js"))

module.exports = utilidades = async(client,message) => {
    try{
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
        const ownerNumber = process.env.NUMERO_DONO.trim()
        switch(command){

        //################## UTILIDADES ########################
        case "!info":
            const foto_bot_url = await client.getProfilePicFromServer(botNumber+'@c.us')
            let info_bot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
            let info_resposta = preencherTexto(msgs_texto.utilidades.info.resposta,info_bot.criador,info_bot.criado_em,info_bot.nome,info_bot.iniciado,info_bot.cmds_executados,ownerNumber,process.env.npm_package_version)
            if(foto_bot_url != undefined){
                client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",info_resposta,id)
            } else {
                client.reply(from, info_resposta, id)
            }
            break
        
        case "!reportar":
            if(args.length == 1) return client.reply(from, erroComandoMsg(command) ,id)
            let reportar_resposta = preencherTexto(msgs_texto.utilidades.reportar.resposta,pushname,sender.id.replace("@c.us",""),body.slice(10))
            client.sendText(ownerNumber+"@c.us",reportar_resposta)
            client.reply(from,msgs_texto.utilidades.reportar.sucesso,id)
            break
        
        case "!ddd":
            let ddd_selecionado = ""
            if(quotedMsg){
                let codigo_brasileiro = quotedMsgObj.author.slice(0,2)
                if(codigo_brasileiro != "55") return client.reply(from, msgs_texto.utilidades.ddd.somente_br ,id)
                ddd_selecionado = quotedMsgObj.author.slice(2,4)
            } else if(args.length > 1 && args[1].length == 2){
                if(args[1].length != 2) return client.reply(from, msgs_texto.utilidades.ddd.erro_ddd ,id)
                ddd_selecionado = args[1]
            } else {
                return client.reply(from, erroComandoMsg(command), id)
            }
            const estados = JSON.parse(fs.readFileSync('./database/json/ddd.json')).estados
            const procurarDdd = estados.findIndex(estado => estado.ddd.includes(ddd_selecionado))
            if(procurarDdd != -1){
                let ddd_resposta = preencherTexto(msgs_texto.utilidades.ddd.resposta,estados[procurarDdd].nome,estados[procurarDdd].regiao)
                client.reply(from,ddd_resposta,id)
            } else {
                client.reply(from, msgs_texto.utilidades.ddd.erro_ddd ,id)
            }
            break

        case "!audio":
            if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
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
                }).catch(err=>{
                    fs.unlinkSync(caminho)
                    client.reply(from, err.message, id)
                })
            } else {
                client.reply(from, erroComandoMsg(command), id)
            }
            break

        case "!qualmusica":
            let qualmusica_msg = ""
            if(quotedMsg){
                qualmusica_msg = quotedMsg
            } else {
                qualmusica_msg = message
            }

            let timestamp = Math.round(new Date().getTime()/1000), caminho_musica = null, caminho_video = null

            if(qualmusica_msg.type == "audio" || qualmusica_msg.type == "ptt"){
              client.reply(from, msgs_texto.utilidades.qualmusica.espera, id)
              const mediaData = await decryptMedia(qualmusica_msg, uaOverride)
              caminho_musica = path.resolve(`media/audios/originais/audioqualmusica-${timestamp}.mp3`)
              fs.writeFileSync(caminho_musica, mediaData, "base64");
              servicos.obterReconhecimentoAudio(caminho_musica).then(resp=>{
                fs.unlinkSync(caminho_musica)
                client.reply(from, preencherTexto(msgs_texto.utilidades.qualmusica.resposta, resp.titulo, resp.produtora, resp.duracao, resp.lancamento, resp.album, resp.artistas), id)
              }).catch(err=>{
                fs.unlinkSync(caminho_musica)
                client.reply(from, err.message, id)
              })
            } else if(qualmusica_msg.mimetype == "video/mp4"){
              client.reply(from, msgs_texto.utilidades.qualmusica.espera, id)
              const mediaData = await decryptMedia(qualmusica_msg, uaOverride)
              caminho_video = path.resolve(`media/videos/videoqualmusica-${timestamp}.mp4`)
              fs.writeFileSync(caminho_video, mediaData, "base64")
              //CONVERTER O VIDEO MP4 PARA AUDIO MP3
              converterMp4Mp3(caminho_video).then(async caminho =>{
                fs.unlinkSync(caminho_video)
                caminho_musica = caminho
                servicos.obterReconhecimentoAudio(caminho_musica).then(resp=>{
                    fs.unlinkSync(caminho_musica)
                    client.reply(from, preencherTexto(msgs_texto.utilidades.qualmusica.resposta, resp.titulo, resp.produtora, resp.duracao, resp.lancamento, resp.album, resp.artistas), id)
                }).catch(err=>{
                    fs.unlinkSync(caminho_musica)
                    client.reply(from, err.message, id)
                })
              }).catch(()=>{
                 fs.unlinkSync(caminho_video)
                 client.reply(from, msgs_texto.utilidades.qualmusica.erro_conversao, id)
              })
            } else {
                client.reply(from, erroComandoMsg(command), id)
            }
        
            break

        case "!clima":
            if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
            servicos.obterClima(body.slice(7)).then(clima=>{
                let clima_resposta = preencherTexto(msgs_texto.utilidades.clima.resposta,clima.msg)
                client.sendFileFromUrl(from,clima.foto_url,`${body.slice(7)}.png`, clima_resposta, id)
            }).catch(err =>{
                client.reply(from,err.message,id)
            })
            break

        case "!moeda":
            if(args.length !== 3) return client.reply(from, erroComandoMsg(command), id)
            servicos.obterConversaoMoeda(args[1],args[2]).then(res=>{
                let moeda_resposta = preencherTexto(msgs_texto.utilidades.moeda.resposta,res.valor_inserido,res.moeda,res.valor_reais,res.data_atualizacao)
                client.reply(from, moeda_resposta ,id)
            }).catch(err =>{
                client.reply(from, err.message , id)
            })
            break

        case "!pesquisa":
            if (args.length === 1) return client.reply(from, erroComandoMsg(command) , id)
            servicos.obterPesquisa(body.slice(10)).then(resultados=>{
                let google_resposta = preencherTexto(msgs_texto.utilidades.pesquisa.resposta_titulo,body.slice(10))
                for(let resultado of resultados){
                    google_resposta += "═════════════════\n"
                    google_resposta += preencherTexto(msgs_texto.utilidades.pesquisa.resposta_itens,resultado.titulo,resultado.link,resultado.descricao)
                }
                client.reply(from,google_resposta,id)
            }).catch(err =>{
                client.reply(from,err.message,id)
            })
            break

        case '!rastreio':
            if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
            servicos.obterRastreioCorreios(body.slice(10)).then(dados=>{
                let rastreio_resposta = msgs_texto.utilidades.rastreio.resposta_titulo
                for(let dado of dados){
                    let dados_local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                    rastreio_resposta += preencherTexto(msgs_texto.utilidades.rastreio.resposta_itens,dado.status,dado.data,dado.hora,dados_local)
                    rastreio_resposta += "-----------------------------------------\n"
                }
                client.reply(from, rastreio_resposta ,id)
            }).catch(err =>{
                client.reply(from, err.message ,id)
            })
            break
        
        case "!play":
            if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
            servicos.obterInfoVideo(body.slice(6)).then(play_video =>{
                if(play_video == null) return client.reply(from,msgs_texto.utilidades.play.nao_encontrado,id)
                if(play_video.duration > 300000) return client.reply(from,msgs_texto.utilidades.play.limite,id)
                let play_espera = preencherTexto(msgs_texto.utilidades.play.espera,play_video.title,play_video.durationFormatted)
                client.reply(from,play_espera,id)
                servicos.obterYtMp3(play_video).then(mp3_path =>{
                    client.sendFile(from, mp3_path, "musica.mp3","", id).then(()=>{
                        fs.unlinkSync(mp3_path)
                    })
                }).catch(err=>{
                    client.reply(from,err.message,id)
                })
            }).catch(err=>{
                client.reply(from,err.message,id)
            })
            break
        
        case "!yt":
            if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)    
            servicos.obterInfoVideo(body.slice(4)).then(yt_video => {
                if(yt_video == null) return client.reply(from,msgs_texto.utilidades.yt.nao_encontrado,id)
                if(yt_video.duration > 300000) return client.reply(from,msgs_texto.utilidades.yt.limite,id)
                let yt_espera = preencherTexto(msgs_texto.utilidades.yt.espera,yt_video.title,yt_video.durationFormatted)
                client.reply(from,yt_espera,id)
                servicos.obterYtMp4Url(yt_video).then(video =>{
                    client.sendFile(from, video.download, `${video.titulo}.mp4`,"", id)
                }).catch(err=>{
                    client.reply(from,err.message,id)
                })
            }).catch(err=>{
                client.reply(from,err.message,id)
            })
            break

        case "!ig":
            if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
            await client.reply(from, msgs_texto.utilidades.ig.espera, id)    
            servicos.obterMediaInstagram(body.slice(4)).then(async resp =>{
                if(resp.results_number == 0) return client.reply(from, msgs_texto.utilidades.ig.nao_encontrado, id)
                if(resp.results_number == 1){
                    await client.sendFile(from, resp.url_list[0], `ig-media`,"",id)
                } else {
                    for(let url of resp.url_list){
                        await client.sendFile(from, url, `ig-media`,"")
                    }
                }
            }).catch(err=>{
                client.reply(from,err,id)
            })
            break

        case "!tw":
            if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
            client.reply(from,msgs_texto.utilidades.tw.espera,id)
            servicos.obterMediaTwitter(args[1]).then(link=>{
                client.sendFile(from, link, `twittervid.mp4`,"", id)
            }).catch(err =>{
                client.reply(from,err.message,id)
            })
            break
        
        case '!img':
            if(quotedMsg || type != "chat") return client.reply(from, erroComandoMsg(command) , id)
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
            if (data_Img === '') return client.reply(from, erroComandoMsg(command), id)
            if (data_Img.length > 500) return client.reply(from, msgs_texto.utilidades.img.tema_longo , id)
            servicos.obterImagens(data_Img,qtd_Img).then(imagens=>{
                for(let imagem of imagens){
                    client.sendFileFromUrl(from, imagem , "foto.jpg" , "", (qtd_Img == 1) ? id : "").catch(()=>{
                        client.sendText(from, msgs_texto.utilidades.img.erro_imagem)
                    })
                }
            }).catch(err=>{
                client.sendText(from, err.message)
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
            let nome_usuario = (pushname != undefined) ? pushname : `Ainda não obtido`
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
            let ajuda_usuario = (pushname != undefined) ? pushname : "Ainda não obtido"
            if(botInfo().limite_diario.status){
                msgs_dados = preencherTexto(msgs_texto.utilidades.ajuda.resposta_limite_diario,ajuda_usuario,dados_user.comandos_dia,max_comm,tipo_usuario)
            } else {
                msgs_dados = preencherTexto(msgs_texto.utilidades.ajuda.resposta_comum,ajuda_usuario,tipo_usuario)
            }
            msgs_dados += `═════════════════\n`
            let menu = ajuda(isGroupAdmins,isGroupMsg)
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
                    client.sendImageAsSticker(from, imageBase64,{author: "LBOT", pack: "LBOT Stickers", keepScale: true}).catch(err=>{
                        consoleErro(err.message, "STICKER")
                        client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                    })
                } else {
                    return client.reply(from, erroComandoMsg(command) , id)
                }
            } else {
                return client.reply(from, erroComandoMsg(command) , id)
            }
            break
        
        case '!simg':
            if(quotedMsg && quotedMsg.type == "sticker"){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                await client.sendFile(from,imageBase64,"sticker.jpg","",quotedMsgObj.id)
            } else {
                client.reply(from, erroComandoMsg(command), id)
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
                    const sgifB64 = `data:${dados_sgif.mimetype};base64,${mediaData.toString('base64')}`
                    client.reply(from, msgs_texto.geral.espera , id)
                    client.sendMp4AsSticker(from, sgifB64, {endTime: "00:00:10.0", fps:9}, {author: "LBOT", pack: "LBOT Sticker Animado", keepScale: false}).catch((err)=>{
                        consoleErro(err.message, "STICKER-GIF")
                        client.reply(from, msgs_texto.utilidades.sticker.erro_sgif , id)
                    })
                }else {
                    return client.reply(from, msgs_texto.utilidades.sticker.video_invalido, id)
                }
            } else {
                return client.reply(from, msgs_texto.geral.erro, id)
            }
            break

        case "!tps":
            if(args.length == 1 || type != "chat") return client.reply(from,erroComandoMsg(command),id)
            if(body.slice(5).length > 40) return client.reply(from,msgs_texto.utilidades.tps.texto_longo,id)
            await client.reply(from, msgs_texto.utilidades.tps.espera,id)
            sticker.textoParaSticker(body.slice(5)).then((base64)=>{
                client.sendImageAsSticker(from, base64,{author: "LBOT", pack: "LBOT Sticker Textos", keepScale: true}).catch(err=>{
                    consoleErro(err.message, "STICKER-TPS")
                    client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                })
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
                        client.sendImageAsSticker(from, base64,{author: "LBOT", pack: "LBOT Sticker Sem Fundo", keepScale: true}).catch(err=>{
                            consoleErro(err.message, "STICKER-SSF")
                            client.reply(from, msgs_texto.utilidades.sticker.erro_s,id)
                        })
                    }).catch(err =>{
                        client.reply(from, err.message, id)
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
                        client.reply(from,err.message,id)
                    })
                } else {
                    client.reply(from,erroComandoMsg(command), id)
                }
            } else {
                client.reply(from,erroComandoMsg(command), id)
            }
            break

        case "!animelanc":
            servicos.obterAnimesLancamentos().then((animes)=>{
                let animelanc_resposta = msgs_texto.utilidades.animelanc.resposta_titulo
                for(let anime of animes){
                    animelanc_resposta += preencherTexto(msgs_texto.utilidades.animelanc.resposta_itens,anime.nome,anime.episodio,anime.link)
                }
                client.reply(from,animelanc_resposta,id)
            }).catch(err =>{
                client.reply(from, err.message, id)
            })
            break
        
        case "!traduz":
            let texto_traducao = ""
            if(quotedMsg != undefined && quotedMsg.type == "chat"){
                texto_traducao = quotedMsg.body
            } else if(quotedMsg == undefined && type == "chat" ){
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                texto_traducao = body.slice(8)
            } else {
                return client.reply(from, erroComandoMsg(command) ,id)
            }
            servicos.obterTraducao(texto_traducao).then(traducao=>{
                client.reply(from, traducao, id);
            }).catch(err =>{
                client.reply(from, err.message, id)
            })
            break  
        
        case '!voz':
            var dataText = '';
            var id_resp = id
            if (args.length === 1) {
                return client.reply(from, erroComandoMsg(command) ,id)
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
            }).catch(err =>{
                client.reply(from, err.message, id)
            })
            break

        case '!noticias':
            servicos.obterNoticias().then(noticias=>{
                let noticias_resposta = msgs_texto.utilidades.noticia.resposta_titulo
                for(let noticia of noticias){
                    noticias_resposta += preencherTexto(msgs_texto.utilidades.noticia.resposta_itens,noticia.title)

                }
                client.reply(from,noticias_resposta, id)
            }).catch(err =>{
                client.reply(from, err.message, id)
            })
            break;

        case '!calc':
            if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
            let expressao = body.slice(6)
            servicos.obterCalculo(expressao).then(resultado=>{
                let calc_resposta = preencherTexto(msgs_texto.utilidades.calc.resposta,resultado)
                client.reply(from,calc_resposta,id)
            }).catch(err =>{
                client.reply(from, err.message, id)
            })
            break
        }
    } catch(err){
        throw err
    }
    

}