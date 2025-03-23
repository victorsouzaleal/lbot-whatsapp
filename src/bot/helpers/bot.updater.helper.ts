import  * as updaterAPI from "../../api/updater.api.js"
import { colorText, getCurrentBotVersion } from "../../utils/general.utils.js";
import getGeneralMessages from "../../utils/text.utils.js";
import { BotController } from "../controllers/bot.controller.js";
import fs from 'fs-extra'

export async function botUpdater(){
    const generalMessages = getGeneralMessages(new BotController().getBot())
    let hasBotUpdated = false
    try{
        const currentVersion = getCurrentBotVersion()
        const checkUpdate = await updaterAPI.checkUpdate(currentVersion).catch()
        
        if (checkUpdate.latest) {
            console.log("[ATUALIZAÇÃO]", colorText(generalMessages.no_update_available))
        } else if(!checkUpdate.patch_update) {
            console.log("[ATUALIZAÇÃO]", colorText(generalMessages.update_available_manual, '#d63e3e'))
        } else {
            console.log("[ATUALIZAÇÃO]", colorText(generalMessages.update_available, '#e0e031'))
            fs.removeSync('./dist')
            await updaterAPI.makeUpdate('./')
            console.log("[ATUALIZAÇÃO]", colorText(generalMessages.bot_updated))
            hasBotUpdated = true
        }
        
        return hasBotUpdated
    } catch(err){
        console.log("[ATUALIZAÇÃO]", colorText(generalMessages.error_check_update, '#e0e031'))
        return hasBotUpdated
    }
}