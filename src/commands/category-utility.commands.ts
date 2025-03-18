import { downloadMediaMessage, WASocket } from "baileys"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message } from "../interfaces/message.interface.js"
import { BaileysController } from "../controllers/baileys.controller.js"
import { buildText, messageErrorCommandUsage} from "../lib/util.js"
import { audioLibrary, generalLibrary, imageLibrary } from "@victorsouzaleal/biblioteca-lbot"
import getCommands from "./list.commands.js"


export async function animesCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const animes = await generalLibrary.animeReleases()
    let replyText = commandsData.utility.animes.msgs.reply_title

    animes.forEach((anime)=>{
        replyText += buildText(commandsData.utility.animes.msgs.reply_item, anime.name.trim(), anime.episode, anime.url)
    })

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function mangasCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const mangas = await generalLibrary.mangaReleases()
    let replyText = commandsData.utility.mangas.msgs.reply_title

    mangas.forEach((manga)=>{
        replyText += buildText(commandsData.utility.mangas.msgs.reply_item, manga.name.trim(), manga.chapter, manga.url)
    })

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function brasileiraoCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    let seriesSupported = ['A', 'B']
    let serieSelected : "A" | "B"

    if (!message.args.length){
        serieSelected = 'A'
    } else {
        if (!seriesSupported.includes(message.text_command.toUpperCase())) throw new Error(messageErrorCommandUsage(botInfo, message))
  
        serieSelected = message.text_command.toUpperCase() as "A" | "B"
    }

    const {tabela: table, rodadas: rounds} = await generalLibrary.brasileiraoTable(serieSelected)

    if (!rounds) return

    const [round] = rounds.filter(round => round.rodada_atual === true)
    const {partidas: matches} = round
    let replyText = buildText(commandsData.utility.brasileirao.msgs.reply_title, serieSelected)

    replyText += commandsData.utility.brasileirao.msgs.reply_table_title

    table.forEach(team =>{
        replyText += buildText(
            commandsData.utility.brasileirao.msgs.reply_table_item,
            team.posicao,
            team.nome,
            team.pontos,
            team.jogos,
            team.vitorias
        )
    })

    replyText += "\n" + commandsData.utility.brasileirao.msgs.reply_round_title

    matches.forEach(match =>{
        replyText += buildText(
            commandsData.utility.brasileirao.msgs.reply_match_item,
            match.time_casa,
            match.time_fora,
            match.data,
            match.local,
            match.gols_casa ? match.resultado_texto : '---'
        )
    })

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function encurtarCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const url = await generalLibrary.shortenUrl(message.text_command)
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.encurtar.msgs.reply, url), message.wa_message)
}

export async function upimgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    
    if (message.quotedMessage?.type !== 'imageMessage' && message.type !== 'imageMessage') throw new Error(messageErrorCommandUsage(botInfo, message))
   
    let imageBuffer : Buffer
    if (message.isQuoted && message.quotedMessage?.wa_message){
        imageBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, 'buffer', {})
    } else {
        imageBuffer = await downloadMediaMessage(message.wa_message, 'buffer', {})
    }

    let imageUrl = await imageLibrary.uploadImage(imageBuffer)
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.upimg.msgs.reply, imageUrl), message.wa_message)
}

export async function filmesCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    let movieTrendings = await generalLibrary.moviedbTrendings("movie")
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.filmes.msgs.reply, movieTrendings), message.wa_message)
}

export async function seriesCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    let movieTrendings = await generalLibrary.moviedbTrendings("tv")
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.series.msgs.reply, movieTrendings), message.wa_message)
}

export async function rbgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.isMedia && !message.isQuoted) throw new Error(messageErrorCommandUsage(botInfo, message))

    let messageData = {
        type : (message.isMedia) ? message.type : message.quotedMessage?.type,
        wa_message: (message.isQuoted)? message.quotedMessage?.wa_message : message.wa_message
    }

    if (!messageData.type || !messageData.wa_message) throw new Error(commandsData.utility.rbg.msgs.error_message)

    if (messageData.type != "imageMessage") throw new Error(commandsData.utility.rbg.msgs.error_only_image)

    await baileysController.replyText(message.chat_id, commandsData.utility.rbg.msgs.wait, message.wa_message)
    let imageBuffer = await downloadMediaMessage(messageData.wa_message, "buffer", {})
    let replyImageBuffer = await imageLibrary.removeBackground(imageBuffer)
    await baileysController.replyFileFromBuffer(message.chat_id, 'imageMessage', replyImageBuffer, '', message.wa_message)
}

export async function tabelaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const replyText = await generalLibrary.symbolsASCI()
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.tabela.msgs.reply, replyText), message.wa_message)
}

export async function letraCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const musicLyrics = await generalLibrary.musicLyrics(message.text_command)
    await baileysController.replyFile(message.chat_id, 'imageMessage', musicLyrics.image, buildText(commandsData.utility.letra.msgs.reply, musicLyrics.title, musicLyrics.artist, musicLyrics.lyrics), message.wa_message)
}

export async function ouvirCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!process.env.dg_secret_key?.trim()) throw new Error(commandsData.utility.ouvir.msgs.error_key)

    if (!message.isQuoted || message.quotedMessage?.type != 'audioMessage') throw new Error(messageErrorCommandUsage(botInfo, message))
        
    if (message.quotedMessage?.media?.seconds && message.quotedMessage?.media?.seconds > 90) throw new Error(commandsData.utility.ouvir.msgs.error_audio_limit)

    let audioBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, "buffer", {})
    let replyText = await audioLibrary.audioTranscription(audioBuffer, {deepgram_secret_key : process.env.dg_secret_key?.trim()})
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.ouvir.msgs.reply, replyText), message.quotedMessage.wa_message)
}

export async function audioCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const supportedEffects = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume']

    if (!message.args.length || !supportedEffects.includes(message.text_command.trim().toLowerCase()) || !message.isQuoted || message.quotedMessage?.type != "audioMessage") throw new Error(messageErrorCommandUsage(botInfo, message))

    const effectSelected = message.text_command.trim().toLowerCase() as 'estourar'|'x2'| 'reverso'| 'grave' | 'agudo' |'volume'
    const audioBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, "buffer", {})
    const replyAudioBuffer = await audioLibrary.audioModified(audioBuffer, effectSelected)
    await baileysController.replyFileFromBuffer(message.chat_id, 'audioMessage', replyAudioBuffer, '', message.wa_message, 'audio/mpeg')
}

export async function traduzCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const languageSupported = ["pt", "es", "en", "ja", "it", "ru", "ko"]
    let languageTranslation : string
    let textTranslation : string[] | string

    if (message.isQuoted && (message.quotedMessage?.type == 'conversation' || message.quotedMessage?.type == 'extendedTextMessage')){
        if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))
        languageTranslation = message.args[0]
        textTranslation = message.quotedMessage.body || message.quotedMessage.caption
    } else if (!message.isQuoted && (message.type == 'conversation'|| message.type == 'extendedTextMessage')){
        if (message.args.length < 2) throw new Error(messageErrorCommandUsage(botInfo, message));
        [languageTranslation, ...textTranslation] = message.args
        textTranslation = textTranslation.join(" ")
    } else {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    }

    if (!languageSupported.includes(languageTranslation)){
        await baileysController.replyText(message.chat_id, commandsData.utility.traduz.msgs.error, message.wa_message)
        return
    }

    const replyTranslation = await generalLibrary.translationGoogle(textTranslation as string, languageTranslation as "pt" | "es" | "en" | "ja" | "it" | "ru" | "ko")
    await baileysController.replyText(message.chat_id, buildText(commandsData.utility.traduz.msgs.reply, textTranslation as string, replyTranslation), message.wa_message)
}

export async function vozCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const languageSupported = ["pt", 'en', 'ja', 'es', 'it', 'ru', 'ko', 'sv']
    let languageVoice: string
    let textVoice : string[] | string

    if (!message.args.length) {
        throw new Error(messageErrorCommandUsage(botInfo, message))
    } else if (message.isQuoted  && (message.quotedMessage?.type == 'extendedTextMessage' || message.quotedMessage?.type == 'conversation')){
        languageVoice = message.args[0]
        textVoice = message.quotedMessage.body || message.quotedMessage.caption
    } else {
        [languageVoice, ...textVoice] = message.args
        textVoice = textVoice.join(" ")
    }

    if (!languageSupported.includes(languageVoice)) throw new Error(commandsData.utility.voz.msgs.error_not_supported)

    if (!textVoice) throw new Error(commandsData.utility.voz.msgs.error_text)

    if (textVoice.length > 500) throw new Error(commandsData.utility.voz.msgs.error_text_long)

    const replyAudioBuffer = await audioLibrary.textToVoice(languageVoice as "pt" | "es" | "en" | "ja" | "it" | "ru" | "ko" | "sv", textVoice)
    await baileysController.replyFileFromBuffer(message.chat_id, 'audioMessage', replyAudioBuffer, '', message.wa_message, 'audio/mpeg')
}

export async function noticiasCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    const newsList = await generalLibrary.newsGoogle()
    let replyText = commandsData.utility.noticias.msgs.reply_title

    for(let news of newsList){
        replyText += buildText(commandsData.utility.noticias.msgs.reply_item, news.title, news.author, news.published, news.url)
    }

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function calcCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    const calcResult = await generalLibrary.calcExpression(message.text_command)
    const replyText = buildText(commandsData.utility.calc.msgs.reply, calcResult)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function pesquisaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let webSearchList = await generalLibrary.webSearchGoogle(message.text_command)
    let replyText = buildText(commandsData.utility.pesquisa.msgs.reply_title, message.text_command)

    for(let search of webSearchList){
        replyText += buildText(commandsData.utility.pesquisa.msgs.reply_item, search.title, search.url)
    }

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function moedaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const supportedCurrencies = ["dolar" , "iene" , "euro" , "real"]

    if (message.args.length != 2) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    let [currencySelected, valueSelected] = message.args

    if (!supportedCurrencies.includes(currencySelected)) throw new Error(messageErrorCommandUsage(botInfo, message))

    let convertData = await generalLibrary.convertCurrency(currencySelected as "dolar" | "euro" | "real" | "iene", parseInt(valueSelected))
    let replyText = buildText(commandsData.utility.moeda.msgs.reply_title, convertData.currency, convertData.value)

    for(let convert of  convertData.convertion){
        replyText += buildText(commandsData.utility.moeda.msgs.reply_item, convert.convertion_name, convert.value_converted_formatted, convert.currency, convert.updated)
    } 

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function climaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let wheatherResult = await generalLibrary.wheatherInfo(message.text_command)

    let replyText = buildText(commandsData.utility.clima.msgs.reply,
        message.text_command,
        wheatherResult.location.name,
        wheatherResult.location.region,
        wheatherResult.location.country,
        wheatherResult.location.current_time,
        wheatherResult.current.temp,
        wheatherResult.current.feelslike,
        wheatherResult.current.condition,
        wheatherResult.current.wind,
        wheatherResult.current.humidity,
        wheatherResult.current.cloud
    )

    wheatherResult.forecast.forEach((forecast)=>{
        replyText += buildText(commandsData.utility.clima.msgs.reply_forecast,
            forecast.day,
            forecast.max,
            forecast.min,
            forecast.condition,
            forecast.max_wind,
            forecast.chance_rain,
            forecast.chance_snow,
            forecast.uv
        )
    })

    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function dddCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    let dddSelected : string | undefined

    if (message.isQuoted){
        let internationalCode = message.quotedMessage?.sender.slice(0,2)
        if (internationalCode != "55") throw new Error(commandsData.utility.ddd.msgs.error)
        dddSelected = message.quotedMessage?.sender.slice(2,4)
    } else if (message.args.length){
        dddSelected = message.text_command
    } 
    
    if (!dddSelected) throw new Error(messageErrorCommandUsage(botInfo, message))

    let dddResult = await generalLibrary.infoDDD(dddSelected)
    const replyText = buildText(commandsData.utility.ddd.msgs.reply, dddResult.state, dddResult.region)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function qualmusicaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)
    const acr_host = process.env.acr_host
    const acr_access_key = process.env.acr_access_key
    const acr_access_secret = process.env.acr_access_secret

    if (!acr_host || !acr_access_key || !acr_access_secret) throw new Error(commandsData.utility.qualmusica.msgs.error_key)

    let messageType = message.isQuoted ? message.quotedMessage?.type : message.type

    if (messageType != "videoMessage" && messageType != "audioMessage") throw new Error(messageErrorCommandUsage(botInfo, message))

    let messageData = message.isQuoted ? message.quotedMessage?.wa_message : message.wa_message 
    
    if (!messageData) throw new Error(commandsData.utility.qualmusica.msgs.error_message)

    let messageMediaBuffer = await downloadMediaMessage(messageData, "buffer", {})

    await baileysController.replyText(message.chat_id, commandsData.utility.qualmusica.msgs.wait, message.wa_message)
    const musicResult = await audioLibrary.musicRecognition(messageMediaBuffer, {acr_host, acr_access_key, acr_access_secret})
    const replyText = buildText(commandsData.utility.qualmusica.msgs.reply, musicResult.title, musicResult.producer, musicResult.duration, musicResult.release_date, musicResult.album, musicResult.artists)
    await baileysController.replyText(message.chat_id, replyText, message.wa_message)
}

export async function qualanimeCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const baileysController = new BaileysController(client)
    const commandsData = getCommands(botInfo)

    const messageData = {
        type: (message.isQuoted)? message.quotedMessage?.type : message.type,
        message: (message.isQuoted)? message.quotedMessage?.wa_message : message.wa_message
    }

    if (messageData.type != "imageMessage") throw new Error(messageErrorCommandUsage(botInfo, message))
    
    if (!messageData.message) throw new Error(commandsData.utility.qualanime.msgs.error_message)

    await baileysController.replyText(message.chat_id, commandsData.utility.qualanime.msgs.wait, message.wa_message)
    const imageBuffer = await downloadMediaMessage(messageData.message, "buffer", {})
    const animeInfo = await imageLibrary.animeRecognition(imageBuffer)

    if (animeInfo.similarity < 87) throw new Error(commandsData.utility.qualanime.msgs.error_similarity)

    const replyText = buildText(commandsData.utility.qualanime.msgs.reply, animeInfo.title, animeInfo.episode || "---", animeInfo.initial_time, animeInfo.final_time, animeInfo.similarity, animeInfo.preview_url)
    await baileysController.replyFileFromUrl(message.chat_id, 'videoMessage', animeInfo.preview_url, replyText, message.wa_message, 'video/mp4')
}

