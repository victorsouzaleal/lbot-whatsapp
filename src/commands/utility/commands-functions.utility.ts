import { downloadMediaMessage, WASocket } from "baileys"
import { Bot } from "../../interfaces/bot.interface.js"
import { Group } from "../../interfaces/group.interface.js"
import { Message } from "../../interfaces/message.interface.js"
import * as Whatsapp from '../../lib/whatsapp.lib.js'
import { buildText, messageErrorCommandUsage} from "../../lib/util.lib.js"
import { audioLibrary, utilityLibrary, imageLibrary } from "@victorsouzaleal/biblioteca-lbot"
import { commandsUtility } from "./commands-list.utility.js"

export async function animesCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    const animes = await utilityLibrary.animeReleases()
    let replyText = utilityCommands.animes.msgs.reply_title

    animes.forEach((anime)=>{
        replyText += buildText(utilityCommands.animes.msgs.reply_item, anime.name.trim(), anime.episode, anime.url)
    })

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function mangasCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    const mangas = await utilityLibrary.mangaReleases()
    let replyText = utilityCommands.mangas.msgs.reply_title

    mangas.forEach((manga)=>{
        replyText += buildText(utilityCommands.mangas.msgs.reply_item, manga.name.trim(), manga.chapter, manga.url)
    })

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function brasileiraoCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    let seriesSupported = ['A', 'B']
    let serieSelected : "A" | "B"

    if (!message.args.length){
        serieSelected = 'A'
    } else {
        if (!seriesSupported.includes(message.text_command.toUpperCase())) throw new Error(messageErrorCommandUsage(botInfo, message))
  
        serieSelected = message.text_command.toUpperCase() as "A" | "B"
    }

    const {tabela: table, rodadas: rounds} = await utilityLibrary.brasileiraoTable(serieSelected)

    if (!rounds) return

    const [round] = rounds.filter(round => round.rodada_atual === true)
    const {partidas: matches} = round
    let replyText = buildText(utilityCommands.brasileirao.msgs.reply_title, serieSelected)

    replyText += utilityCommands.brasileirao.msgs.reply_table_title

    table.forEach(team =>{
        replyText += buildText(
            utilityCommands.brasileirao.msgs.reply_table_item,
            team.posicao,
            team.nome,
            team.pontos,
            team.jogos,
            team.vitorias
        )
    })

    replyText += "\n" + utilityCommands.brasileirao.msgs.reply_round_title

    matches.forEach(match =>{
        replyText += buildText(
            utilityCommands.brasileirao.msgs.reply_match_item,
            match.time_casa,
            match.time_fora,
            match.data,
            match.local,
            match.gols_casa ? match.resultado_texto : '---'
        )
    })

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function encurtarCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const url = await utilityLibrary.shortenUrl(message.text_command)
    await Whatsapp.replyText(client, message.chat_id, buildText(utilityCommands.encurtar.msgs.reply, url), message.wa_message, {expiration: message.expiration})
}

export async function upimgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    
    if (message.quotedMessage?.type !== 'imageMessage' && message.type !== 'imageMessage') throw new Error(messageErrorCommandUsage(botInfo, message))
   
    let imageBuffer : Buffer
    if (message.isQuoted && message.quotedMessage?.wa_message){
        imageBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, 'buffer', {})
    } else {
        imageBuffer = await downloadMediaMessage(message.wa_message, 'buffer', {})
    }

    let imageUrl = await imageLibrary.uploadImage(imageBuffer)
    await Whatsapp.replyText(client, message.chat_id, buildText(utilityCommands.upimg.msgs.reply, imageUrl), message.wa_message, {expiration: message.expiration})
}

export async function filmesCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    let movieTrendings = await utilityLibrary.moviedbTrendings("movie")
    await Whatsapp.replyText(client, message.chat_id, buildText(utilityCommands.filmes.msgs.reply, movieTrendings), message.wa_message, {expiration: message.expiration})
}

export async function seriesCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    let movieTrendings = await utilityLibrary.moviedbTrendings("tv")
    await Whatsapp.replyText(client, message.chat_id, buildText(utilityCommands.series.msgs.reply, movieTrendings), message.wa_message, {expiration: message.expiration})
}

export async function rbgCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    if (!message.isMedia && !message.isQuoted) throw new Error(messageErrorCommandUsage(botInfo, message))

    let messageData = {
        type : (message.isMedia) ? message.type : message.quotedMessage?.type,
        wa_message: (message.isQuoted)? message.quotedMessage?.wa_message : message.wa_message
    }

    if (!messageData.type || !messageData.wa_message) throw new Error(utilityCommands.rbg.msgs.error_message)

    if (messageData.type != "imageMessage") throw new Error(utilityCommands.rbg.msgs.error_only_image)

    await Whatsapp.replyText(client, message.chat_id, utilityCommands.rbg.msgs.wait, message.wa_message, {expiration: message.expiration})
    let imageBuffer = await downloadMediaMessage(messageData.wa_message, "buffer", {})
    let replyImageBuffer = await imageLibrary.removeBackground(imageBuffer)
    await Whatsapp.replyFileFromBuffer(client, message.chat_id, 'imageMessage', replyImageBuffer, '', message.wa_message, {expiration: message.expiration})
}

export async function tabelaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    const replyText = await utilityLibrary.symbolsASCI()
    await Whatsapp.replyText(client, message.chat_id, buildText(utilityCommands.tabela.msgs.reply, replyText), message.wa_message, {expiration: message.expiration})
}

export async function letraCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    const musicLyrics = await utilityLibrary.musicLyrics(message.text_command)
    const replyText = buildText(utilityCommands.letra.msgs.reply, musicLyrics.title, musicLyrics.artist, musicLyrics.lyrics)
    await Whatsapp.replyFile(client, message.chat_id, 'imageMessage', musicLyrics.image, replyText, message.wa_message, {expiration: message.expiration})
}

export async function ouvirCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    const secret_key = botInfo.api_keys.deepgram.secret_key

    if (!secret_key) throw new Error(utilityCommands.ouvir.msgs.error_key)
    if (!message.isQuoted || message.quotedMessage?.type != 'audioMessage') throw new Error(messageErrorCommandUsage(botInfo, message))
    if (message.quotedMessage?.media?.seconds && message.quotedMessage?.media?.seconds > 90) throw new Error(utilityCommands.ouvir.msgs.error_audio_limit)

    let audioBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, "buffer", {})
    let replyText = await audioLibrary.audioTranscription(audioBuffer, {deepgram_secret_key : secret_key})
    await Whatsapp.replyText(client, message.chat_id, buildText(utilityCommands.ouvir.msgs.reply, replyText), message.quotedMessage.wa_message, {expiration: message.expiration})
}

export async function audioCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const supportedEffects = ['estourar','x2', 'reverso', 'grave', 'agudo', 'volume']

    if (!message.args.length || !supportedEffects.includes(message.text_command.trim().toLowerCase()) || !message.isQuoted || message.quotedMessage?.type != "audioMessage") throw new Error(messageErrorCommandUsage(botInfo, message))

    const effectSelected = message.text_command.trim().toLowerCase() as 'estourar'|'x2'| 'reverso'| 'grave' | 'agudo' |'volume'
    const audioBuffer = await downloadMediaMessage(message.quotedMessage.wa_message, "buffer", {})
    const replyAudioBuffer = await audioLibrary.audioModified(audioBuffer, effectSelected)
    await Whatsapp.replyFileFromBuffer(client, message.chat_id, 'audioMessage', replyAudioBuffer, '', message.wa_message, {expiration: message.expiration, mimetype: 'audio/mpeg'})
}

export async function traduzCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
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
        await Whatsapp.replyText(client, message.chat_id, utilityCommands.traduz.msgs.error, message.wa_message, {expiration: message.expiration})
        return
    }

    const replyTranslation = await utilityLibrary.translationGoogle(textTranslation as string, languageTranslation as "pt" | "es" | "en" | "ja" | "it" | "ru" | "ko")
    const replyText = buildText(utilityCommands.traduz.msgs.reply, textTranslation as string, replyTranslation)
    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function vozCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
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

    if (!languageSupported.includes(languageVoice)) throw new Error(utilityCommands.voz.msgs.error_not_supported)
    if (!textVoice) throw new Error(utilityCommands.voz.msgs.error_text)
    if (textVoice.length > 500) throw new Error(utilityCommands.voz.msgs.error_text_long)

    const replyAudioBuffer = await audioLibrary.textToVoice(languageVoice as "pt" | "es" | "en" | "ja" | "it" | "ru" | "ko" | "sv", textVoice)
    await Whatsapp.replyFileFromBuffer(client, message.chat_id, 'audioMessage', replyAudioBuffer, '', message.wa_message, {expiration: message.expiration, mimetype: 'audio/mpeg'})
}

export async function noticiasCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    const newsList = await utilityLibrary.newsGoogle()
    let replyText = utilityCommands.noticias.msgs.reply_title

    for(let news of newsList){
        replyText += buildText(utilityCommands.noticias.msgs.reply_item, news.title, news.author, news.published, news.url)
    }

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function calcCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    const calcResult = await utilityLibrary.calcExpression(message.text_command)
    const replyText = buildText(utilityCommands.calc.msgs.reply, calcResult)
    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function pesquisaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let webSearchList = await utilityLibrary.webSearchGoogle(message.text_command)
    let replyText = buildText(utilityCommands.pesquisa.msgs.reply_title, message.text_command)

    for(let search of webSearchList){
        replyText += buildText(utilityCommands.pesquisa.msgs.reply_item, search.title, search.url)
    }

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function moedaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    const supportedCurrencies = ["dolar" , "iene" , "euro" , "real"]

    if (message.args.length != 2) throw new Error(messageErrorCommandUsage(botInfo, message))
    
    let [currencySelected, valueSelected] = message.args

    if (!supportedCurrencies.includes(currencySelected)) throw new Error(messageErrorCommandUsage(botInfo, message))

    let convertData = await utilityLibrary.convertCurrency(currencySelected as "dolar" | "euro" | "real" | "iene", parseInt(valueSelected))
    let replyText = buildText(utilityCommands.moeda.msgs.reply_title, convertData.currency, convertData.value)

    for(let convert of  convertData.convertion){
        replyText += buildText(utilityCommands.moeda.msgs.reply_item, convert.convertion_name, convert.value_converted_formatted, convert.currency, convert.updated)
    } 

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function climaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    if (!message.args.length) throw new Error(messageErrorCommandUsage(botInfo, message))

    let wheatherResult = await utilityLibrary.wheatherInfo(message.text_command)

    let replyText = buildText(utilityCommands.clima.msgs.reply,
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
        replyText += buildText(utilityCommands.clima.msgs.reply_forecast,
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

    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function dddCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    let dddSelected : string | undefined

    if (message.isQuoted){
        let internationalCode = message.quotedMessage?.sender.slice(0,2)
        if (internationalCode != "55") throw new Error(utilityCommands.ddd.msgs.error)
        dddSelected = message.quotedMessage?.sender.slice(2,4)
    } else if (message.args.length){
        dddSelected = message.text_command
    } 
    
    if (!dddSelected) throw new Error(messageErrorCommandUsage(botInfo, message))

    let dddResult = await utilityLibrary.infoDDD(dddSelected)
    const replyText = buildText(utilityCommands.ddd.msgs.reply, dddResult.state, dddResult.region)
    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function qualmusicaCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)
    const host = botInfo.api_keys.acrcloud.host
    const access_key = botInfo.api_keys.acrcloud.access_key
    const secret_key = botInfo.api_keys.acrcloud.secret_key

    if (!host || !access_key || !secret_key) throw new Error(utilityCommands.qualmusica.msgs.error_key)

    let messageType = message.isQuoted ? message.quotedMessage?.type : message.type

    if (messageType != "videoMessage" && messageType != "audioMessage") throw new Error(messageErrorCommandUsage(botInfo, message))

    let messageData = message.isQuoted ? message.quotedMessage?.wa_message : message.wa_message 
    
    if (!messageData) throw new Error(utilityCommands.qualmusica.msgs.error_message)

    let messageMediaBuffer = await downloadMediaMessage(messageData, "buffer", {})

    await Whatsapp.replyText(client, message.chat_id, utilityCommands.qualmusica.msgs.wait, message.wa_message, {expiration: message.expiration})
    const musicResult = await audioLibrary.musicRecognition(messageMediaBuffer, {acr_host: host, acr_access_key: access_key, acr_access_secret: secret_key})
    const replyText = buildText(utilityCommands.qualmusica.msgs.reply, musicResult.title, musicResult.producer, musicResult.duration, musicResult.release_date, musicResult.album, musicResult.artists)
    await Whatsapp.replyText(client, message.chat_id, replyText, message.wa_message, {expiration: message.expiration})
}

export async function qualanimeCommand(client: WASocket, botInfo: Bot, message: Message, group? : Group){
    const utilityCommands = commandsUtility(botInfo)

    const messageData = {
        type: (message.isQuoted)? message.quotedMessage?.type : message.type,
        message: (message.isQuoted)? message.quotedMessage?.wa_message : message.wa_message
    }

    if (messageData.type != "imageMessage") throw new Error(messageErrorCommandUsage(botInfo, message))
    if (!messageData.message) throw new Error(utilityCommands.qualanime.msgs.error_message)

    await Whatsapp.replyText(client, message.chat_id, utilityCommands.qualanime.msgs.wait, message.wa_message, {expiration: message.expiration})
    const imageBuffer = await downloadMediaMessage(messageData.message, "buffer", {})
    const animeInfo = await imageLibrary.animeRecognition(imageBuffer)

    if (animeInfo.similarity < 87) throw new Error(utilityCommands.qualanime.msgs.error_similarity)

    const replyText = buildText(utilityCommands.qualanime.msgs.reply, animeInfo.title, animeInfo.episode || "---", animeInfo.initial_time, animeInfo.final_time, animeInfo.similarity, animeInfo.preview_url)
    await Whatsapp.replyFileFromUrl(client, message.chat_id, 'videoMessage', animeInfo.preview_url, replyText, message.wa_message, {expiration: message.expiration, mimetype: 'video/mp4'})
}

