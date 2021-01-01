
//REQUERINDO MODULOS
require('dotenv').config()
const { decryptMedia } = require('@open-wa/wa-decrypt')
const { rastrearEncomendas } = require('correios-brasil')
const translate = require('@vitalets/google-translate-api')
const fs = require('fs-extra')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const moment = require('moment-timezone')
const get = require('got')
const color = require('./lib/color')
const { spawn, exec } = require('child_process')
const { help } = require('./lib/help')
const { admin } = require('./lib/help')
const { RemoveBgResult, removeBackgroundFromImageBase64, removeBackgroundFromImageFile } = require('remove.bg')
moment.tz.setDefault('America/Sao_Paulo')
const msgs_texto = require('./lib/msgs')
const axios = require('axios')
var Scraper = require('images-scraper');
const google = new Scraper({
  puppeteer: {
    headless: true,
  }
});




//CHAVES API
const api_remove_bg = process.env.API_REMOVE_BG
const api_news = process.env.API_NEWS_ORG


module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')


        const msgs = (message) => {
            if (command.startsWith('!')) {
                if (message.length >= 10){
                    return `${message.substr(0, 15)}`
                }else{
                    return `${message}`
                }
            }
        }

        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot
        const isOwner = ownerNumber.includes(sender.id.replace(/@c.us/g, ''))
        const isBlocked = blockNumber.includes(sender.id)
        const uaOverride = 'WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
        if (!isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname))
        if (isGroupMsg && command.startsWith('!')) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(msgs(command)), 'from', color(pushname), 'in', color(formattedTitle))
        if (isBlocked) return

        //COMANDOS
        switch(command) {
        
        case "!env":
            console.log(`${process.env.NUMERO_DONO.split(',')}, ${process.env.API_REMOVE_BG}, ${process.env.API_NEWS_ORG}`)
            break
            
        case '!rastreio':
            var dataText = '';
            if (args.length === 1) return client.reply(from, msgs_texto.erro.rastreio.cmd_erro, id)
            codigoRastreio = [body.slice(10)]
            if(codigoRastreio[0].length != 13) return client.reply(from, msgs_texto.erro.rastreio.codigo_invalido ,id)
            rastrearEncomendas(codigoRastreio).then((resp) => {
                if(resp[0].length < 1) return client.reply(from, msgs_texto.erro.rastreio.nao_postado ,id)
                let dados_rastreio = "📦📦*RASTREIO*📦📦\n\n"
                resp[0].forEach(dado =>{
                    let dados_local = (dado.local != undefined) ?  `Local : ${dado.local}` : `Origem : ${dado.origem}\nDestino : ${dado.destino}`
                    dados_rastreio +=  `Status : ${dado.status}\nData : ${dado.data}\nHora : ${dado.hora}\n${dados_local}\n`
                    dados_rastreio +=  `-----------------------------------------\n`
                })
                client.reply(from, dados_rastreio ,id)
            });
            break

        case '!malacos':
            const url_malacos_img = "https://instagram.fsdu6-1.fna.fbcdn.net/v/t51.2885-15/e35/123749592_128000845743872_4350553576495440946_n.jpg?_nc_ht=instagram.fsdu6-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=m2UaMTuk_mcAX8qUg__&tp=1&oh=d3cf971a3b695cfe302c494f355922b2&oe=60035949"
            client.sendFileFromUrl(from, url_malacos_img, 'malacos.jpeg', 'Somos o problema', id)
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
                    return client.reply(from, msgs_texto.erro.img.qtd_imagem , id)
                }
            } else {
                data_Img = body.slice(5)
            }

            if (data_Img === '') return client.reply(from, msgs_texto.erro.img.tema_vazio , id)
            if (data_Img.length > 500) return client.reply(from, msgs_texto.erro.img.tema_longo , id)
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
                    console.log("[ERRO] Não foi possível obter esta imagem")
                })
            }
            break       

        case '!mascote':
            //const url_mascote_img = "https://i.imgur.com/mVwa7q4.png"
            const url_mascote_img_natal = "https://i.imgur.com/YTq7Oc7l.png"
            client.sendFileFromUrl(from, url_mascote_img_natal, 'mascote.jpeg', 'Whatsapp Jr. 2021', id)
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
                    client.reply(from, msgs_texto.erro.sticker.link_invalido , id)
                }
            } else {
                    client.reply(from, msgs_texto.erro.sticker.cmd_erro , id)
            }
            break

        case '!sgif':
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10 || mimetype === 'image/gif' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, msgs_texto.espera.geral , id)
                    const filename = `./media/aswu.${mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        try {
                            await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                        } catch (err){
                            client.reply(from, msgs_texto.erro.sticker.video_longo , id)
                        }
                    })
                } else {
                    client.reply(from, msgs_texto.erro.sticker.video_invalido, id)
                }
            } else if (quotedMsg){
                if(quotedMsg.type == 'image' && quotedMsg.duration < 10 || quotedMsg && quotedMsg.type == 'video' && quotedMsg.duration < 10){
                    const mediaData = await decryptMedia(quotedMsg, uaOverride)
                    client.reply(from, msgs_texto.espera.geral, id)
                    const filename = `./media/aswu.${quotedMsg.mimetype.split('/')[1]}`
                    await fs.writeFileSync(filename, mediaData)
                    await exec(`gify ${filename} ./media/output.gif --fps=30 --scale=240:240`, async function (error, stdout, stderr) {
                        const gif = await fs.readFileSync('./media/output.gif', { encoding: "base64" })
                        try {
                            await client.sendImageAsSticker(from, `data:image/gif;base64,${gif.toString('base64')}`)
                        } catch (err){
                            client.reply(from,msgs_texto.erro.sticker.video_longo, id)
                        }
                    })
                } else {
                    client.reply(from, msgs_texto.erro.sticker.video_invalido, id)
                }                 
            } else {
                client.reply(from, msgs_texto.erro.geral, id)
            }          
            break
        
        case '!sgif2':
            if (isMedia) {
                if (mimetype === 'video/mp4' && message.duration < 10) {
                    const mediaData = await decryptMedia(message, uaOverride)
                    client.reply(from, msgs_texto.espera.geral, id)
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
                        client.reply(from, msgs_texto.erro.sticker.video_longo, id)
                    }
                }
                else {
                    client.reply(from, msgs_texto.erro.sticker.video_invalido, id)
                }
            } else if (quotedMsg){
                if (quotedMsg.mimetype === 'video/mp4' && quotedMsg.duration < 10) {
                    const mediaData = await decryptMedia(quotedMsg, uaOverride)
                    client.reply(from,msgs_texto.espera.geral , id)
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
                        client.reply(from, msgs_texto.erro.sticker.video_longo, id)
                    }
                }
                else {
                    client.reply(from,msgs_texto.erro.sticker.video_invalido, id)
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
                        client.reply(from,msgs_texto.erro.sticker.sem_credito,id)
                        break
                    case 'auth_failed':
                        console.log("[ERRO] Erro na chave API Remove.bg, configure no arquivo .env")
                        client.reply(from,msgs_texto.erro.sticker.autenticacao,id)
                        break
                    default:
                        client.reply(from,msgs_texto.erro.sticker.erro_background,id)    
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
                        client.reply(from,msgs_texto.erro.sticker.sem_credito,id)
                        break
                    case 'auth_failed':
                        console.log("[ERRO] Erro na chave API Remove.bg, configure no arquivo .env")
                        client.reply(from,msgs_texto.erro.sticker.autenticacao,id)
                        break
                    default:
                        client.reply(from,msgs_texto.erro.sticker.erro_background,id)    
                }
            }   
        } else {
            client.reply(from, msgs_texto.erro.geral, id)
        }
            break

        
        case "!traduz":
            if(quotedMsg == undefined || quotedMsg.type != "chat") return client.reply(from, msgs_texto.erro.traduz.cmd_erro ,id)
            translate(quotedMsg.body , {to: 'pt'}).then(async(res) => {
                console.log(res.text)
                await client.reply(from, res.text, quotedMsgObj.id);
            }).catch(err => {
                console.error(err);
            });
            break  
        
        case '!voz':
            var dataText = '';
            var id_resp = id
            if (args.length === 1) {
                return client.reply(from, msgs_texto.erro.voz.cmd_erro ,id)
            } else if(quotedMsg !== undefined && quotedMsg.type == 'chat'){
                dataText = (args.length == 2) ? quotedMsg.body : body.slice(8)
            } else {
                dataText = body.slice(8)
            }

            if (dataText === '') return client.reply(from, msgs_texto.erro.voz.texto_vazio , id)
            if (dataText.length > 5000) return client.reply(from, msgs_texto.erro.voz.texto_longo, id)
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
                client.reply(from, msgs_texto.erro.voz.nao_suportado, id)
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
                console.log("[ERRO] Erro na chave API de notícias, configure no arquivo .env")
                client.reply(from,msgs_texto.erro.noticia.autenticacao)
            }
            break;
        
        case '!viadometro' :
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!quotedMsg) return client.reply(from, msgs_texto.erro.grupo.viadometro.cmd_erro, id)
            const medida = [' 0%\n\n - ESSE É MACHO ','██                 20% \n\n - HMMMMM ', '████             40%\n\n - JÁ MAMOU O PRIMO', '██████         60%\n\n - EITA MAMOU O BONDE', '████████     80%\n\n - JÁ SENTOU EM ALGUEM', '██████████ 100%\n\n - BIXONA ALERTA VERMELHO CUIDADO COM SEUS ORGÃOS SEXUAIS']
            let aleatorio = Math.floor(Math.random() * medida.length)
            if(ownerNumber.includes(quotedMsgObj.author.replace(/@c.us/g, ''))) aleatorio = 0
            client.reply(from,`🤖 *VIADÔMETRO* - ${medida[aleatorio]}`, quotedMsgObj.id)
            break
        
        case '!detector' :
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!quotedMsg) return client.reply(from, msgs_texto.erro.grupo.detector.cmd_erro, id)
            await client.sendFile(from, './media/img/detector/calibrando.png', 'detector.png', msgs_texto.espera.detector , id)
            const imgs_detector = ['verdade.png','vaipra.png','mentiroso.png','meengana.png','kao.png','incerteza.png','estresse.png','conversapraboi.png']
            let aleatorio_detector = Math.floor(Math.random() * imgs_detector.length)
            await client.sendFile(from, `./media/img/detector/${imgs_detector[aleatorio_detector]}`, 'detector.png', "", quotedMsgObj.id)
            break

        //COMANDOS PARA GRUPO
        case '!status':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            const isWelcome = JSON.parse(fs.readFileSync('./lib/welcome.json')).includes(groupId)
            const isAntilink = JSON.parse(fs.readFileSync('./lib/antilink.json')).includes(groupId)
            const isAntifake = JSON.parse(fs.readFileSync('./lib/antifake.json')).includes(groupId)
            const antiflood_j = JSON.parse(fs.readFileSync('./lib/antiflood.json'))
            const isAntiflood_on = antiflood_j.grupos.includes(groupId)
            let status_text = `[S T A T U S   D O   G R U P O]\n\n`
            status_text += "- Recurso Boas Vindas : "
            status_text += (isWelcome) ? "✅ Ligado\n" : "❌ Desligado\n"
            status_text += "- Recurso Anti-Link de Grupos : "
            status_text += (isAntilink) ? "✅ Ligado\n" : "❌ Desligado\n"
            status_text += "- Recurso Anti-Fake : "
            status_text += (isAntifake) ? "✅ Ligado\n" : "❌ Desligado\n"
            status_text += "- Recurso Anti-Flood : "
            status_text += (isAntiflood_on) ? `✅ Ligado (Máx: ${antiflood_j.dados[antiflood_j.dados.findIndex(dado => dado.groupId == groupId)].max} mensagens)\n` : "❌ Desligado\n"
            client.sendText(from,status_text)
            break


        case '!bemvindo':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (args.length === 1) return client.reply(from, msgs_texto.erro.grupo.bemvindo.cmd_erro, id)
            const welcome_g = JSON.parse(fs.readFileSync('./lib/welcome.json'))
            if (args[1].toLowerCase() === 'ligado') {
                if(!welcome_g.includes(chat.id)) {
                    welcome_g.push(chat.id)
                    fs.writeFileSync('./lib/welcome.json', JSON.stringify(welcome_g))
                    client.reply(from, msgs_texto.sucesso.grupo.bemvindo.ativado, id)
                } else {
                    client.reply(from, msgs_texto.erro.grupo.bemvindo.ligado , id)

                }
            } else if (args[1].toLowerCase() === 'desligado') {
                if(welcome_g.includes(chat.id)) {
                    welcome_g.splice(welcome_g.indexOf(chat.id), 1)
                    fs.writeFileSync('./lib/welcome.json', JSON.stringify(welcome_g))
                    client.reply(from, msgs_texto.sucesso.grupo.bemvindo.desativado, id)
                } else {
                    client.reply(from, msgs_texto.erro.grupo.bemvindo.desligado , id)
                }
            } else {
                client.reply(from, msgs_texto.erro.grupo.bemvindo.cmd_erro, id)
            }
            break

        case '!antilink':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (args.length === 1) return client.reply(from, msgs_texto.erro.grupo.antilink.cmd_erro, id)
                const antilink_g = JSON.parse(fs.readFileSync('./lib/antilink.json'))
                if (args[1].toLowerCase() === 'ligado') {
                    if(!antilink_g.includes(chat.id)){
                        antilink_g.push(chat.id)
                        fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink_g))
                        client.reply(from, msgs_texto.sucesso.grupo.antilink.ativado, id)
                    } else {
                        client.reply(from, msgs_texto.erro.grupo.antilink.ligado , id)
                    } 
                } else if (args[1].toLowerCase() === 'desligado') {
                    if(antilink_g.includes(chat.id)){
                        antilink_g.splice(antilink_g.indexOf(chat.id), 1)
                        fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink_g))
                        client.reply(from, msgs_texto.sucesso.grupo.antilink.desativado, id)
                    } else {
                        client.reply(from, msgs_texto.erro.grupo.antilink.desligado , id)
                    }
                    
                } else {
                    client.reply(from, msgs_texto.erro.grupo.antilink.cmd_erro, id)
                }
                break

        case '!antifake':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (args.length === 1) return client.reply(from, msgs_texto.erro.grupo.antifake.cmd_erro, id)
            const antifake_g = JSON.parse(fs.readFileSync('./lib/antifake.json'))
            if (args[1].toLowerCase() === 'ligado') {
                if(!antifake_g.includes(chat.id)){
                    antifake_g.push(chat.id)
                    fs.writeFileSync('./lib/antifake.json', JSON.stringify(antifake_g))
                    client.reply(from,  msgs_texto.sucesso.grupo.antifake.ativado, id)
                } else {
                    client.reply(from, msgs_texto.erro.grupo.antifake.ligado , id)
                } 
            } else if (args[1].toLowerCase() === 'desligado') {
                if(antifake_g.includes(chat.id)){
                    antifake_g.splice(antifake_g.indexOf(chat.id), 1)
                    fs.writeFileSync('./lib/antifake.json', JSON.stringify(antifake_g))
                    client.reply(from,  msgs_texto.sucesso.grupo.antifake.desativado, id)
                } else {
                    client.reply(from, msgs_texto.erro.grupo.antifake.desligado , id)
                }
            } else {
                client.reply(from,  msgs_texto.erro.grupo.antifake.cmd_erro , id)
            }
            break
        
        case '!antiflood':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (args.length === 1) return client.reply(from, msgs_texto.erro.grupo.antiflood.cmd_erro, id)
            const antiflood_g = JSON.parse(fs.readFileSync('./lib/antiflood.json'))
            let max_flood = 10
            let estado = ""

            if(!isNaN(args[1])){
                console.log(args[1] + " " + args[2])
                if(args[1]>= 5 && args[1] <= 20){
                    max_flood = args[1]
                    estado = args[2]
                } else {
                    return client.reply(from, msgs_texto.erro.grupo.antiflood.max,id)
                }
            } else {
                estado = args[1]
            }
            
            if (estado.toLowerCase() === 'ligado') {
                if(antiflood_g.grupos.includes(chat.id)) return client.reply(from, msgs_texto.erro.grupo.antiflood.ligado , id)
                antiflood_g.grupos.push(chat.id)
                antiflood_g.dados.push({
                    groupId : chat.id,
                    max: max_flood,
                    msgs : []
                })
                fs.writeFileSync('./lib/antiflood.json', JSON.stringify(antiflood_g))
                client.reply(from,  msgs_texto.sucesso.grupo.antiflood.ativado, id)
            } else if (estado.toLowerCase() === 'desligado') {
                if(!antiflood_g.grupos.includes(chat.id)) return client.reply(from, msgs_texto.erro.grupo.antiflood.desligado , id)
                antiflood_g.grupos.splice(antiflood_g.grupos.indexOf(chat.id),1)
                antiflood_g.dados.splice(antiflood_g.dados.findIndex(dado => dado.groupId == chat.id),1)
                fs.writeFileSync('./lib/antiflood.json', JSON.stringify(antiflood_g))
                client.reply(from,  msgs_texto.sucesso.grupo.antiflood.desativado, id)
            } else {
                client.reply(from, msgs_texto.erro.grupo.antiflood.cmd_erro , id)
            }
            break

        case '!linkgrupo':
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo : *${name}*`)
            } else {
            	client.reply(from, msgs_texto.permissao.grupo , id)
            }
            break

        case '!listaradmins':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            let mimin = ''
            console.log(groupAdmins)
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break

        case "!donogrupo":
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `🤖 O Dono do grupo é : @${Owner_}`)
            break

        case "!dono":
            await client.sendTextWithMentions(from, `🤖 O Dono do Bot é : @${ownerNumber[0]}`)
            break

        case '!marcartodos':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe = '╔══✪〘🤖 Marcando Todos 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 Lealzin BOT 〙'
            await client.sendTextWithMentions(from, hehe)
            break

        case '!banirtodos':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_grupo, id)           
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (!groupAdmins.includes(allMem[i].id)) await client.removeParticipant(groupId, allMem[i].id)
            }
            client.reply(from, msgs_texto.sucesso.grupo.banirtodos, id)
            break  
        
        case '!add':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (args.length === 1) return client.reply(from, msgs_texto.erro.grupo.add.cmd_erro, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            const add_number = body.slice(5).replace(/\W+/g,"")
            console.log(add_number)
            try {
                await client.addParticipant(from,`${add_number}@c.us`)
            } catch (err) {
                client.reply(from, msgs_texto.erro.grupo.add.add_erro, id)
            }
            break

        case '!banir':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto.erro.grupo.banir.cmd_erro, id)
                if (groupAdmins.includes(quotedMsgObj.author)) return client.reply(from, msgs_texto.erro.grupo.banir.banir_admin, id)
                await client.removeParticipant(groupId, quotedMsgObj.author)
                await client.sendText(from, msgs_texto.sucesso.grupo.banir)
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, msgs_texto.erro.grupo.banir.banir_admin, id)
                    await client.removeParticipant(groupId, mentionedJidList[i])
                    await client.sendText(from, msgs_texto.sucesso.grupo.banir)
                }
            }        
            break

        case '!promover':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo , id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (mentionedJidList.length === 0) return client.reply(from, msgs_texto.erro.grupo.promover.cmd_erro, id)
            if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto.erro.grupo.promover.limite_membro, id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto.erro.grupo.promover.admin, id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sucesso! O membro @${mentionedJidList[0]} virou ADMINISTRADOR.`)
            break

        case '!rebaixar':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (mentionedJidList.length === 0) return client.reply(from, msgs_texto.erro.grupo.rebaixar.cmd_erro, id)
            if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto.erro.grupo.rebaixar.limite_membro, id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto.erro.grupo.rebaixar.admin, id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sucesso! O membro @${mentionedJidList[0]} foi rebaixado para MEMBRO.`)
            break
        case '!apagar':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!quotedMsg) return client.reply(from, msgs_texto.erro.grupo.apagar.cmd_erro, id)
            if (!quotedMsgObj.fromMe) return client.reply(from, msgs_texto.erro.grupo.apagar.minha_msg, id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case '!fechar':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)   
            if(args.length === 1) return client.reply(from, msgs_texto.erro.grupo.fechar.cmd_erro, id)
            client.setGroupToAdminsOnly(groupId,(args[1] == "on") ? true : false)
            break
         

        //COMANDOS DO DONO
        case "!admin":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            client.sendText(from, admin)
            break
            
        case '!entrargrupo':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if (args.length < 2) return client.reply(from, msgs_texto.erro.grupo.entrar_grupo.cmd_erro, id)
            const link = args[1]
            const tGr = await client.getAllGroups()
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, msgs_texto.erro.grupo.entrar_grupo.link_invalido, id)
            if (tGr.length > 10) return client.reply(from, msgs_texto.erro.grupo.entrar_grupo.maximo_grupos, id)
            if (check.size < 5) return client.reply(from, msgs_texto.erro.grupo.entrar_grupo.minimo_membros, id)
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => client.reply(from, msgs_texto.sucesso.grupo.entrargrupo,id))
            } else {
                client.reply(from, msgs_texto.erro.grupo.entrar_grupo.link_invalido, id)
            }
            break

        case '!sair':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot , id)
            await client.sendText(from, msgs_texto.sucesso.grupo.sair).then(() => client.leaveGroup(groupId))
            break

        case '!listablock':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let msg_block = `🤖 Esse é o total de pessoas bloqueadas \nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                msg_block += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, msg_block, id)
            break

        case '!limpartudo':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, msgs_texto.sucesso.grupo.limpartudo, id)
            break

        case '!limpar':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            const all_chats = await client.getAllChats()
            for (let dchat of all_chats) {
                if(dchat.id.match(/@c.us/g) && dchat.id != sender.id) await client.deleteChat(dchat.id)
            }
            client.reply(from, msgs_texto.sucesso.grupo.limpartudo, id)
            break    

        case '!sairgrupos':
        if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `🤖 Estou saindo dos grupos, total de grupos : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, msgs_texto.sucesso.grupo.sairtodos, id)
            break

        case "!bloquear":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let usuarios_bloq = []
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto.admin.bloquear.cmd_erro, id)
                usuarios_bloq.push(quotedMsgObj.author)
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    usuarios_bloq.push(mentionedJidList[i])
                }
            }

            for (let user_b of usuarios_bloq){
                if(ownerNumber.includes(user_b.replace(/@c.us/g, ''))){
                    await client.sendTextWithMentions(from, `[❗] O Usuário @${user_b.replace(/@c.us/g, '')} é dono do BOT, não foi possivel bloquear.`)
                } else {
                    if(blockNumber.includes(user_b)) {
                        await client.sendTextWithMentions(from, `[❗] O Usuário @${user_b.replace(/@c.us/g, '')} já está *bloqueado*.`)
                    } else {
                        await client.contactBlock(user_b)
                        await client.sendTextWithMentions(from, `✅ O Usuário @${user_b.replace(/@c.us/g, '')} foi *bloqueado* com sucesso`)
                    }
                }
                
            }
            break      

        case "!desbloquear":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let usuarios_desbloq = []
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto.admin.desbloquear.cmd_erro, id)
                usuarios_desbloq.push(quotedMsgObj.author)
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    usuarios_desbloq.push(mentionedJidList[i])
                }
            }

            for (let user_d of usuarios_desbloq){
                if(!blockNumber.includes(user_d)) {
                    await client.sendTextWithMentions(from, `[❗] O Usuário @${user_d.replace(/@c.us/g,'')} já está *desbloqueado*.`)
                } else {
                    await client.contactUnblock(user_d)
                    await client.sendTextWithMentions(from, `✅ O Usuário @${user_d.replace(/@c.us/g,'')} foi *desbloqueado* com sucesso`)
                }
            }
            break

            case '!bc':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, msgs_texto.erro.grupo.bc.cmd_erro, id)
                let msg_bc = body.slice(4)
                const chats_bc = await client.getAllChatIds()
                for (let id_chat of chats_bc) {
                    var chat_bc_info = await client.getChatById(id_chat)
                    if (!chat_bc_info.isReadOnly) await client.sendText(id_chat, `[🤖 LEALZIN BOT ANÚNCIA]\n\n${msg_bc}`)
                }
                client.reply(from, 'Anúncio feito com sucesso', id)
                break
            
            case '!bcgrupos':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, msgs_texto.erro.grupo.bcgrupos.cmd_erro, id)
                let msg_bcgrupos = body.slice(10)
                const chats_bcgrupos = await client.getAllChatIds()
                for (let id_chat of chats_bcgrupos) {
                    if(id_chat.match(/@g.us/g)){
                        var chat_bcgrupos_info = await client.getChatById(id_chat)
                        if (!chat_bcgrupos_info.isReadOnly) await client.sendText(id_chat, `[🤖LEALZIN BOT ANÚNCIA]\n\n${msg_bcgrupos}`)
                    }
                }
                client.reply(from, 'Anúncio feito com sucesso', id)
                break

            case '!estado':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length != 2)  return client.reply(from,msgs_texto.admin.estado.cmd_erro,id)
                switch(args[1]){
                    case 'online':
                        client.setMyStatus("🟢🤖 Bot online - Digite !ajuda")
                        break
                    case 'offline':
                        client.setMyStatus("🔴🤖 Bot offline - Dormindo")
                        break    
                    case 'manutencao':
                        client.setMyStatus("🟡🤖 Bot em manutenção")
                        break
                    default:
                        client.reply(from,msgs_texto.admin.estado.cmd_erro,id)
                }
            break
        }
    } catch (err) {
        console.log(color('[ERRO]', 'red'), err)
        //client.kill().then(a => console.log(a))
    }
}
