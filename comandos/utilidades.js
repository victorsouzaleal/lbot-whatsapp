//REQUERINDO MÓDULOS
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
        let msg_info = "*Criador do Bot* : Leal\n"
        msg_info += "*Criado em* : 21/12/2020\n"
        msg_info += "*Nome do bot* : LBot v2.0\n"
        msg_info += "*Contato do criador* : wa.me/5521995612287\n"
        await client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",msg_info,id)
        break
    
    case "!ddd":
        let ddd_selecionado = ""
        if(quotedMsg){
            let codigo_brasileiro = quotedMsgObj.author.slice(0,2)
            if(codigo_brasileiro != "55") return client.reply("[ERRO] Esse comando só é aceito com números brasileiros.",id)
            ddd_selecionado = quotedMsgObj.author.slice(2,4)
        } else if(args.length > 1 && args[1].length == 2){
            ddd_selecionado = args[1]
        } else {
            return client.reply(from,"[ERRO] Você deve responder alguém com *!ddd* ou colocar o ddd após o comando", id)
        }
        const estados = JSON.parse(fs.readFileSync('./lib/ddd.json')).estados
        estados.forEach(async (estado) =>{
            if(estado.ddd.includes(ddd_selecionado)) return client.reply(from,`📱 Estado : *${estado.nome}* / Região : *${estado.regiao}*`,id)
        })
        break

    case "!clima":
        if(args.length === 1) return client.reply(from, "[ERRO] Você deve digitar !clima [cidade] [estado]",id)
        let local_escolhido = body.slice(7)
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
            client.reply(from,"[ERRO] Local não encontrado ou houve um erro na API.",id)
        }
        
        break

    case "!moeda":
        if(args.length !== 3) return client.reply(from, "[ERRO] Digite o tipo de moeda e quantidade para converter para Real Brasileiro", id)
        const moedas_suportadas = ['dolar','euro','iene']
        args[1] = args[1].toLowerCase()
        args[2] = args[2].replace(",",".")
        if(!moedas_suportadas.includes(args[1])) return client.reply(from, "[ERRO] Atualmente é suportado : dolar|euro|iene", id)
        if(isNaN(args[2])) return client.reply(from, "[ERRO] O valor não é um número válido", id)
        if(args[2] > 1000000000000000) return client.reply(from, "[ERRO] Quantidade muito alta, você provavelmente não tem todo esse dinheiro.", id)
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
        if (args.length === 1) return client.reply(from, "[ERRO] Digite o que você quer pesquisar", id)
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

    case '!calc':
        if(args.length === 1) return client.reply(from, "[ERRO] Você deve digitar ex: !calc [2+2]",id)
        let expressao = body.slice(6)
        if(expressao.match(/[a-zA-Z]+/g)) return client.reply(from, "[ERRO] Sua expressão matemática tem caracteres inválidos",id)
        expressao = expressao.replace(",",".")
        try {
            resultado = eval(expressao)
            if(isNaN(resultado)) return client.reply(from, `🧮 Para de ficar tentando dividir por 0 , seu mongol. `,id)
            client.reply(from, `🧮 O resultado é *${resultado}* `,id)
        } catch {
            client.reply(from, "[ERRO] Houve um erro no cálculo dessa expressão.",id)
        }
        break
    }

}