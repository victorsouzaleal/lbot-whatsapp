import { miscLibrary } from "@victorsouzaleal/biblioteca-lbot";
import { colorText, getCurrentBotVersion } from "./util.js";
import getGeneralMessages from "./general-messages.js";
import { BotController } from "../controllers/bot.controller.js";

export async function botUpdater(){
    const currentVersion = getCurrentBotVersion()
    const checkUpdate = await miscLibrary.checkUpdate(currentVersion)
    const generalMessages = getGeneralMessages(new BotController().getBot())
    let hasBotUpdated = false

    if (checkUpdate.latest) {
        console.log("[ATUALIZAÇÃO]", colorText(generalMessages.no_update_available))
    } else if(!checkUpdate.patch_update) {
        console.log("[ATUALIZAÇÃO]", colorText(generalMessages.update_available_manual, '#d63e3e'))
    } else {
        console.log("[ATUALIZAÇÃO]", colorText(generalMessages.update_available, '#e0e031'))
        await miscLibrary.makeUpdate('./')
        console.log("[ATUALIZAÇÃO]", colorText(generalMessages.bot_updated))
        hasBotUpdated = true
    }
    
    return hasBotUpdated
}