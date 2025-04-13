import moment from "moment-timezone"
moment.tz.setDefault('America/Sao_Paulo')
import { botUpdater } from './helpers/bot.updater.helper.js'
import connect from './socket.js'
import ffmpeg from "fluent-ffmpeg"
import { buildText, getCurrentBotVersion } from "./utils/general.util.js"
import botTexts from "./helpers/bot.texts.helper.js"
import('@ffmpeg-installer/ffmpeg').then((ffmpegInstaller)=>{
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
}).catch(()=>{})

async function init(){
    console.log(buildText(botTexts.starting, getCurrentBotVersion()))
    let hasBotUpdated = await botUpdater()
    
    if (!hasBotUpdated) {
        connect()
    }
}

// Execução principal
init()





