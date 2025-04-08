import { updaterLib } from "../libraries/library.js";
import { colorText, getCurrentBotVersion } from "../utils/general.util.js";
import getBotTexts from "../helpers/bot.texts.helper.js";
import { BotController } from "../controllers/bot.controller.js";
import fs from 'fs-extra'
import databaseRebuilder from "./database.rebuilder.helper.js";

export async function botUpdater(){
    const botTexts = getBotTexts(new BotController().getBot())
    let hasBotUpdated = false
    
    try{
        const currentVersion = getCurrentBotVersion()
        const checkUpdate = await updaterLib.checkUpdate(currentVersion)

        if (checkUpdate.latest) {
            console.log("[ATUALIZAÇÃO]", colorText(botTexts.no_update_available))
        } else {
            console.log("[ATUALIZAÇÃO]", colorText(botTexts.update_available, '#e0e031'))
            fs.removeSync('./dist')
            await updaterLib.makeUpdate('./')
            await databaseRebuilder()
            console.log("[ATUALIZAÇÃO]", colorText(botTexts.bot_updated))
            hasBotUpdated = true
        }
        
        return hasBotUpdated
    } catch(err){
        console.log("[ATUALIZAÇÃO]", colorText(botTexts.error_check_update, '#e0e031'))
        return hasBotUpdated
    }
}