import { botUpdater } from './lib/bot-updater.lib.js'
import connect from './socket.js'
import ffmpeg from "fluent-ffmpeg"
import('@ffmpeg-installer/ffmpeg').then((ffmpegInstaller)=>{
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
}).catch(()=>{})

async function init(){
    let hasBotUpdated = await botUpdater()

    if(!hasBotUpdated) connect()
}

// Execução principal
init()





