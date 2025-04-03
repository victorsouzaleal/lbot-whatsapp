import moment from "moment-timezone"
moment.tz.setDefault('America/Sao_Paulo')
import { botUpdater } from './helpers/bot.updater.helper.js'
import connect from './socket.js'
import ffmpeg from "fluent-ffmpeg"
import('@ffmpeg-installer/ffmpeg').then((ffmpegInstaller)=>{
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
}).catch(()=>{})

async function init(){
    let hasBotUpdated = await botUpdater()
    
    if(!hasBotUpdated) {
        connect()
    }
}

// Execução principal
init()





