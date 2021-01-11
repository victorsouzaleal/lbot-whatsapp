//REQUERINDO MÓDULOS
process.setMaxListeners(0)
const {segParaHora} = require('../lib/functions')
const { decryptMedia } = require('@open-wa/wa-decrypt')
const { rastrearEncomendas } = require('correios-brasil')
const translate = require('@vitalets/google-translate-api')
const fs = require('fs-extra')
const { help} = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const get = require('got')
const {exec} = require('child_process')
const axios = require('axios')
const {removeBackgroundFromImageBase64} = require('remove.bg')
var Scraper = require('images-scraper')
const google = new Scraper({
  puppeteer: {
    headless: true,
  }
});
const serp = require('serp')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Youtube = require('youtube-sr')
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { artifactregistry } = require('googleapis/build/src/apis/artifactregistry')
const msgs = require('../lib/msgs')
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath,               // FFmpeg binary location
    "outputPath": "./media",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 1,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});


module.exports = utilidades = async(client,message) => {
    const api_remove_bg = process.env.API_REMOVE_BG
    const api_news = process.env.API_NEWS_ORG
    const { type, id, from, sender, caption, isMedia, mimetype, quotedMsg, quotedMsgObj} = message
    let { body } = message
    let { pushname, verifiedName } = sender
    pushname = pushname || verifiedName
    const commands = caption || body || ''
    const command = commands.toLowerCase().split(' ')[0] || ''
    const args =  commands.split(' ')
    const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
    const botNumber = await client.getHostNumber()

    switch(command){

     //################## UTILIDADES ########################
     case "!info":
        const foto_bot_url = await client.getProfilePicFromServer(botNumber+'@c.us')
        let numero_dono = process.env.NUMERO_DONO.split(",")
        let msg_info = "*Criador do Bot* : Leal\n"
        msg_info += "*Criado em* : 21/12/2020\n"
        msg_info += "*Nome do bot* : LBot v2.0\n"
        msg_info += `*Contato do criador* : wa.me/${numero_dono[0]}\n`
        await client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",msg_info,id)
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
        const estados = JSON.parse(fs.readFileSync('./lib/ddd.json')).estados
        estados.forEach(async (estado) =>{
            if(estado.ddd.includes(ddd_selecionado)) return client.reply(from,`📱 Estado : *${estado.nome}* / Região : *${estado.regiao}*`,id)
        })
        break

    case "!clima":
        if(args.length === 1) return client.reply(from, msgs_texto.utilidades.clima.cmd_erro ,id)
        let local_escolhido = body.slice(7).normalize("NFD").replace(/[\u0300-\u036f]/g, '');
        const apiClima3Dias = encodeURI(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_CLIMA}&q=${local_escolhido}&days=3&lang=pt`)
        try{
            await axios.get(apiClima3Dias).then(resp =>{
                let regiao = resp.data.location.region !== undefined ? `${resp.data.location.region}, ` : ""
                let msg_clima = `☀️ CONSULTA DE CLIMA ☀️\n\n`
                msg_clima += `*Local encontrado :* ${resp.data.location.name} - ${regiao} ${resp.data.location.country}\n`
                msg_clima += `*${resp.data.current.condition.text}* - *${resp.data.current.temp_c}C°* Atualmente\n\n`
                msg_clima += `═════════════════\n`
                msg_clima += `Previsão 3 dias 👇 : \n`
                resp.data.forecast.forecastday.forEach(dia =>{
                    data_array = dia.date.split("-")
                    data_formatada = `${data_array[2]}/${data_array[1]}/${data_array[0]}`
                    msg_clima += `*Dia ${data_formatada}* - Máx: *${dia.day.maxtemp_c}C°* / Min: *${dia.day.mintemp_c}C°* / Média: *${dia.day.avgtemp_c}C°* \n`
                })
                client.reply(from,msg_clima,id)
            })
        } catch {
            client.reply(from,msgs_texto.utilidades.clima.erro_resultado,id)
        }
        
        break

    case "!moeda":
        if(args.length !== 3) return client.reply(from, msgs_texto.utilidades.moeda.cmd_erro, id)
        const moedas_suportadas = ['dolar','euro','iene']
        args[1] = args[1].toLowerCase()
        args[2] = args[2].replace(",",".")
        if(!moedas_suportadas.includes(args[1])) return client.reply(from, msgs_texto.utilidades.moeda.nao_suportado, id)
        if(isNaN(args[2])) return client.reply(from, msgs_texto.utilidades.moeda.valor_invalido , id)
        if(args[2] > 1000000000000000) return client.reply(from, msgs_texto.utilidades.moeda.valor_limite, id)
        axios.get("https://economia.awesomeapi.com.br/json/all").then(async (resp)=>{
            let dados_moeda_selecionada = {}
            switch(args[1]){
                case 'dolar':
                    args[1] = (args[2] > 1) ? "Dólares" : "Dólar"
                    dados_moeda_selecionada = resp.data.USD
                    break
                case 'euro':
                    args[1] = (args[2] > 1) ? "Euros" : "Euro"
                    dados_moeda_selecionada = resp.data.EUR
                    break
                case 'iene':
                    args[1] = (args[2] > 1) ? "Ienes" : "Iene"
                    dados_moeda_selecionada = resp.data.JPY
                    break           
            }
            let valor_reais = dados_moeda_selecionada.ask * args[2]
            valor_reais = valor_reais.toFixed(2).replace(".",",")
            let dh_atualizacao = dados_moeda_selecionada.create_date.split(" ")
            let d_atualizacao = dh_atualizacao[0].split("-")
            let h_atualizacao = dh_atualizacao[1]
            await client.reply(from, `💵 Atualmente *${args[2]} ${args[1]}* está valendo *R$ ${valor_reais}*\n\nInformação atualizada : *${d_atualizacao[2]}/${d_atualizacao[1]}/${d_atualizacao[0]} às ${h_atualizacao}*`,id)
        })
        break
    case "!google":
        if (args.length === 1) return client.reply(from, msgs_texto.utilidades.google.cmd_erro , id)
        let q_search = body.slice(8)
        const config_google = {
            host : "google.com.br",
            qs : {
              q : q_search,
              filter : 0,
              pws : 0
            },
            num : 3
        }
        const resultados_p = await serp.search(config_google)
        let msg_resultado = `🔎 Resultados da pesquisa de : *${q_search}*🔎\n\n` 
        resultados_p.forEach((resultado)=>{
            msg_resultado += `═════════════════\n`
            msg_resultado += `🔎 ${resultado.title}\n`
            msg_resultado += `*Link* : ${resultado.url}\n\n`
        })
        await client.reply(from,msg_resultado,id)
        break

     case '!rastreio':
        var dataText = '';
        if (args.length === 1) return client.reply(from, msgs_texto.utilidades.rastreio.cmd_erro, id)
        codigoRastreio = [body.slice(10)]
        if(codigoRastreio[0].length != 13) return client.reply(from, msgs_texto.utilidades.rastreio.codigo_invalido ,id)
        rastrearEncomendas(codigoRastreio).then((resp) => {
            if(resp[0].length < 1) return client.reply(from, msgs_texto.utilidades.rastreio.nao_postado ,id)
            let dados_rastreio = "📦📦*RASTREIO*📦📦\n\n"
            resp[0].forEach(dado =>{
                let dados_local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                dados_rastreio +=  `Status : ${dado.status}\nData : ${dado.data}\nHora : ${dado.hora}\n${dados_local}\n`
                dados_rastreio +=  `-----------------------------------------\n`
            })
            client.reply(from, dados_rastreio ,id)
        });
        break
    
    case "!play":
        if(args.length === 1) return client.reply(from,msgs_texto.utilidades.play.cmd_erro,id)
        let youtube_pesquisa = body.slice(6)
        Youtube.searchOne(youtube_pesquisa).then(resp=>{
            const video = resp
            if(video.duration > 300000) return client.reply(from,msgs_texto.utilidades.play.limite,id)
            client.reply(from,`[AGUARDE] 🎧 Sua música está sendo baixada e processada.\n\nTitulo: *${video.title}*\nDuração: *${video.durationFormatted}*`,id)
            //GERANDO NOME ARQUIVO
            let letras = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
            let nome_arquivo = ""
            for(let i = 0; i < 6; i++){
                let letra_aleatoria = Math.floor(Math.random() * letras.length)
                nome_arquivo += letras[letra_aleatoria]
            }
            //BAIXANDO MUSICA
            YD.download(video.id, nome_arquivo+".mp3");
            YD.on("finished", async () =>{
                try{
                    await client.sendAudio(from, `./media/${nome_arquivo}.mp3`, id).then(async ()=>{
                        await fs.unlinkSync(`./media/${nome_arquivo}.mp3`)
                    })
                } catch {}
            })
            YD.on("error", ()=>{
                client.reply(from,msgs_texto.utilidades.play.erro_download,id)
            })
        })
        .catch(()=>{
            client.reply(from,msgs_texto.utilidades.play.erro_pesquisa,id)
        })

        break
        
    case '!img':
        let qtd_Img = 1;
        let data_Img = ""
        let imgs_validas = []

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
        const results = await google.scrape(data_Img, 30);
        results.forEach(result=>{
            if(!result.url.includes('lookaside')) imgs_validas.push({url: result.url, description: result.description})
        })

        for(let i = 0; i < qtd_Img ; i++){
            let img_index_aleatorio = Math.floor(Math.random() * imgs_validas.length)
            axios.get(imgs_validas[img_index_aleatorio].url).then(()=> {
                client.sendFileFromUrl(from, imgs_validas[img_index_aleatorio].url , imgs_validas[img_index_aleatorio].description, "", (qtd_Img == 1) ? id : "")
                imgs_validas.splice(img_index_aleatorio,1)
            }).catch(()=>{
                client.sendText(from, msgs_texto.utilidades.img.erro_imagem)
            })
        }
        break       

    case '!ajuda': //Menu principal
        client.sendText(from, help)
        break

    case '!s':
        if (isMedia && type === 'image') {
            const mediaData = await decryptMedia(message, uaOverride)
            const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64)
        } else if (quotedMsg && quotedMsg.type == 'image') {
            const mediaData = await decryptMedia(quotedMsg, uaOverride)
            const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
            await client.sendImageAsSticker(from, imageBase64)
        } else if (args.length === 2) {
            const url = args[1]
            if (url.match(isUrl)) {
                await client.sendStickerfromUrl(from, url, { method: 'get' })
                    .catch(err => console.log('ERRO : ', err))
            } else {
                client.reply(from, msgs_texto.utilidades.sticker.link_invalido , id)
            }
        } else {
                client.reply(from, msgs_texto.utilidades.sticker.cmd_erro , id)
        }
        break

    case '!sgif':
        if (isMedia) {
            if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                const mediaData = await decryptMedia(message, uaOverride)
                client.reply(from, msgs_texto.geral.espera , id)
                const filename = `./media/aswu.${mimetype.split('/')[1]}`
                await fs.writeFileSync(filename, mediaData)
                await exec(`gify ${filename} ./media/output.gif --fps=10 --scale=240:240`, async function (error, stdout, stderr) {
                    const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                    try {
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    } catch (err){
                        client.reply(from, msgs_texto.utilidades.sticker.video_longo , id)
                    }
                })
            } else {
                client.reply(from, msgs_texto.utilidades.sticker.video_invalido, id)
            }
        } else if (quotedMsg){
            if(quotedMsg.type == 'image' && quotedMsg.duration < 10 || quotedMsg && quotedMsg.type == 'video' && quotedMsg.duration < 10){
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                client.reply(from, msgs_texto.geral.espera, id)
                const filename = `./media/aswu.${quotedMsg.mimetype.split('/')[1]}`
                await fs.writeFileSync(filename, mediaData)
                await exec(`gify ${filename} ./media/output.gif --fps=10 --scale=240:240`, async function (error, stdout, stderr) {
                    const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                    try {
                        await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                    } catch (err){
                        client.reply(from,msgs_texto.utilidades.sticker.video_longo, id)
                    }
                })
            } else {
                client.reply(from, msgs_texto.utilidades.sticker.video_invalido, id)
            }                 
        } else {
            client.reply(from, msgs_texto.geral.erro, id)
        }          
        break
    
    case '!sgif2':
        if (isMedia) {
            if (mimetype === 'video/mp4' && message.duration < 10) {
                const mediaData = await decryptMedia(message, uaOverride)
                client.reply(from, msgs_texto.geral.espera, id)
                const filename = `./media/aswu.${mimetype.split('/')[1]}`
                await fs.writeFileSync(filename, mediaData)
                try{
                    client.sendMp4AsSticker(from, filename, {
                        fps: 6,
                        startTime: `00:00:00.0`,
                        endTime :  `00:00:${message.duration}.0`,
                        loop: 0
                    })
                } catch(err){
                    client.reply(from, msgs_texto.utilidades.sticker.video_longo, id)
                }
            }
            else {
                client.reply(from, msgs_texto.utilidades.sticker.video_invalido, id)
            }
        } else if (quotedMsg){
            if (quotedMsg.mimetype === 'video/mp4' && quotedMsg.duration < 10) {
                const mediaData = await decryptMedia(quotedMsg, uaOverride)
                client.reply(from,msgs_texto.geral.espera , id)
                const filename = `./media/aswu.${quotedMsg.mimetype.split('/')[1]}`
                await fs.writeFileSync(filename, mediaData)
                try{
                    client.sendMp4AsSticker(from, filename, {
                        fps: 6,
                        startTime: `00:00:00.0`,
                        endTime :  `00:00:${quotedMsg.duration}.0`,
                        loop: 0
                    })
                } catch(err){
                    client.reply(from, msgs_texto.utilidades.sticker.video_longo, id)
                }
            }
            else {
                client.reply(from,msgs_texto.utilidades.sticker.video_invalido, id)
            }
        }   
        break

    case '!ssf':
    if (isMedia) {
        try {
            var mediaData = await decryptMedia(message, uaOverride)
            var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
            var base64img = imageBase64
            var outFile = './media/img/noBg.png'
            // Obtenha a api no site remove.bg
            var result = await removeBackgroundFromImageBase64({ base64img, apiKey: api_remove_bg, size: 'auto', type: 'auto', outFile })
            await fs.writeFile(outFile, result.base64img)
            await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
        } catch(err) {
            switch(err[0].code){
                case 'insufficient_credits':
                    client.reply(from,msgs_texto.utilidades.sticker.sem_credito,id)
                    break
                case 'auth_failed':
                    console.log("[ERRO] Erro na chave API Remove.bg, configure no arquivo .env")
                    client.reply(from,msgs_texto.utilidades.sticker.autenticacao,id)
                    break
                default:
                    client.reply(from,msgs_texto.utilidades.sticker.erro_background,id)    
            }
        }
    } else if (quotedMsg) {
        try {
            var mediaData = await decryptMedia(quotedMsg, uaOverride)
            var imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
            var base64img = imageBase64
            var outFile = './media/img/noBg.png'
            // Obtenha a api no site remove.bg
            var result = await removeBackgroundFromImageBase64({ base64img, apiKey: api_remove_bg, size: 'auto', type: 'auto', outFile })
            await fs.writeFile(outFile, result.base64img)
            await client.sendImageAsSticker(from, `data:${quotedMsg.mimetype};base64,${result.base64img}`)
        } catch(err) {
            switch(err[0].code){
                case 'insufficient_credits':
                    client.reply(from,msgs_texto.utilidades.sticker.sem_credito,id)
                    break
                case 'auth_failed':
                    console.log("[ERRO] Erro na chave API Remove.bg, configure no arquivo .env")
                    client.reply(from,msgs_texto.utilidades.sticker.autenticacao,id)
                    break
                default:
                    client.reply(from,msgs_texto.utilidades.sticker.erro_background,id)    
            }
        }   
    } else {
        client.reply(from, msgs_texto.geral.erro, id)
    }
        break

    case "!anime":
        if (isMedia && type === 'image') {
            client.reply(from,"[AGUARDE] Estou processando a imagem e pesquisando o anime.",id)
            try {
                var mediaData = await decryptMedia(message, uaOverride)
                var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                axios.post("https://trace.moe/api/search",{
                    image: imageBase64
                }).then((resp)=>{
                    let tempo_inicial = segParaHora(resp.data.docs[0].from)
                    let tempo_final = segParaHora(resp.data.docs[0].to)
                    let episodio = resp.data.docs[0].episode
                    let titulo = resp.data.docs[0].title_english
                    let similaridade = resp.data.docs[0].similarity * 100
                    similaridade = similaridade.toFixed(2)
                    if(similaridade < 87) return client.reply(from,"[ERRO] Nível de similaridade é muito baixo, certifique se enviar uma cena válida de anime.",id)
                    is_ep = (episodio != "") ? `Episódio : *${episodio}*\n` : ''
                    client.sendFileFromUrl(from,`https://media.trace.moe/video/${resp.data.docs[0].anilist_id}/${encodeURIComponent(resp.data.docs[0].filename)}?t=${resp.data.docs[0].at}&token=${resp.data.docs[0].tokenthumb}`,
                    resp.data.docs[0].filename, `〘 Pesquisa de anime 〙\n\nTítulo: *${titulo}*\n${is_ep}Tempo da cena: *${tempo_inicial} - ${tempo_final}*\nSimilaridade: *${similaridade}%*`, id)
                }).catch((resp)=>{
                    if(resp.status == 429) return client.reply(from,"[ERRO] Muitas solicitações sendo feitas, tente novamente mais tarde.",id)
                    if(resp.status == 400) return client.reply(from,"[ERRO] Não foi possível achar resultados para esta imagem",id)
                    if(resp.status == 500 || resp.status == 503) return client.reply(from,"[ERRO] Houve um erro no servidor de pesquisa de imagem.",id)
                })
            } catch(err) {
                client.reply(from,"[ERRO] Houve um erro no processamento da imagem",id)
            }
        } else if (quotedMsg && quotedMsg.type === 'image') {
            client.reply(from,"[AGUARDE] Estou processando a imagem e pesquisando o anime.",id)
            try {
                var mediaData = await decryptMedia(quotedMsg, uaOverride)
                var imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                axios.post("https://trace.moe/api/search",{
                    image: imageBase64
                }).then((resp)=>{
                    let tempo_inicial = segParaHora(resp.data.docs[0].from)
                    let tempo_final = segParaHora(resp.data.docs[0].to)
                    let episodio = resp.data.docs[0].episode
                    let titulo = resp.data.docs[0].title_english
                    let similaridade = resp.data.docs[0].similarity * 100
                    similaridade = similaridade.toFixed(2)
                    if(similaridade < 87) return client.reply(from,"[ERRO] Nível de similaridade é muito baixo, certifique se enviar uma cena válida de anime.",id)
                    is_ep = (episodio != "") ? `Episódio : *${episodio}*\n` : ''
                    client.sendFileFromUrl(from,`https://media.trace.moe/video/${resp.data.docs[0].anilist_id}/${encodeURIComponent(resp.data.docs[0].filename)}?t=${resp.data.docs[0].at}&token=${resp.data.docs[0].tokenthumb}`,
                    resp.data.docs[0].filename, `〘 Pesquisa de anime 〙\n\nTítulo: *${titulo}*\n${is_ep}Tempo da cena: *${tempo_inicial} - ${tempo_final}*\nSimilaridade: *${similaridade}%*`, id)
                }).catch((resp)=>{
                    console.log(resp)
                    if(resp.status == 429) return client.reply(from,"[ERRO] Muitas solicitações sendo feitas, tente novamente mais tarde.",id)
                    if(resp.status == 400) return client.reply(from,"[ERRO] Não foi possível achar resultados para esta imagem",id)
                    if(resp.status == 500 || resp.status == 503) return client.reply(from,"[ERRO] Houve um erro no servidor de pesquisa de imagem.",id)
                })
            } catch(err) {
                client.reply(from,"[ERRO] Houve um erro no processamento da imagem",id)
            }   
        } else {
            client.reply(from,"[ERRO] Você deve postar uma imagem com *!anime* ou responder outra imagem com *!anime*", id)
        }
    break
    
    case "!traduz":
        if(quotedMsg == undefined || quotedMsg.type != "chat") return client.reply(from, msgs_texto.utilidades.traduz.cmd_erro ,id)
        translate(quotedMsg.body , {to: 'pt'}).then(async(res) => {
            console.log(res.text)
            await client.reply(from, res.text, quotedMsgObj.id);
        }).catch(() => {
            client.reply(from, msgs_texto.utilidades.traduz.erro_servidor, id)
        });
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
        const ttsEn = require('node-gtts')('en')
        const ttsPt = require('node-gtts')('pt')
        const ttsJp = require('node-gtts')('ja')
        const ttsEs = require('node-gtts')('es')
        const ttsIt = require('node-gtts')('it')
        
        var dataBhs = body.slice(5, 7).toLowerCase()
        if (dataBhs == 'pt') {
            ttsPt.save('./media/tts/resPt.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resPt.mp3', id_resp)
            })
        } else if (dataBhs == 'en') {
            ttsEn.save('./media/tts/resEn.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resEn.mp3', id_resp)
            })
        } else if (dataBhs == 'jp') {
            ttsJp.save('./media/tts/resJp.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resJp.mp3', id_resp)
            })
        } 
          else if (dataBhs == 'es') {
            ttsEs.save('./media/tts/resEs.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resEs.mp3', id_resp)
            })
        } else if (dataBhs == 'it') {
            ttsIt.save('./media/tts/resIt.mp3', dataText, function () {
                client.sendPtt(from, './media/tts/resIt.mp3', id_resp)
            })
        } 
          else {
            client.reply(from, msgs_texto.utilidades.voz.nao_suportado, id)
        }
        break

    case '!noticias':
        try {
            const resp = await  get.get(`http://newsapi.org/v2/top-headlines?country=br&apiKey=${api_news}`).json()
            const noticias = resp.articles;
            let noticias_msg = "╔══✪〘 NOTICIAS 〙✪══\n╠\n"
            noticias.forEach(async(noticia) =>{
                noticias_msg += `╠➥ 📰🗞️ *${noticia.title}* \n╠\n`
            })
            noticias_msg += '╚═〘 Patrocínio : Malas Boa Viagem 〙'
            client.reply(from, noticias_msg, id)
        } catch {
            client.reply(from,msgs_texto.utilidades.noticia.autenticacao)
        }
        break;

    case '!calc':
        if(args.length === 1) return client.reply(from, msgs_texto.utilidades.calc.cmd_erro ,id)
        let expressao = body.slice(6)
        if(expressao.match(/[a-zA-Z]+/g)) return client.reply(from, msgs_texto.utilidades.calc.carac_invalidos,id)
        expressao = expressao.replace(",",".")
        try {
            resultado = eval(expressao)
            if(isNaN(resultado)) return client.reply(from, msgs_texto.utilidades.calc.divisao_zero,id)
            client.reply(from, `🧮 O resultado é *${resultado}* `,id)
        } catch {
            client.reply(from, msgs_texto.utilidades.calc.erro_calculo,id)
        }
        break
    }

}