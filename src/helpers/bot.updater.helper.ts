import { updaterLib } from "../libraries/library.js";
import { colorText, getCurrentBotVersion } from "../utils/general.util.js";
import botTexts from "../helpers/bot.texts.helper.js";
import { BotController } from "../controllers/bot.controller.js";
import fs from 'fs-extra'
import databaseMigration from "./database.migrate.helper.js";

export async function botUpdater(){
    const botController = new BotController()
    const botInfo = botController.getBot()
    let hasBotUpdated = false

    try{
        if (!botInfo.db_migrated || process.env.migrate) {
            await databaseMigration()
            botController.setDbMigrated(true)
            console.log(colorText(botTexts.migrating_database, '#e0e031'))
        }

        const currentVersion = getCurrentBotVersion()
        const checkUpdate = await updaterLib.checkUpdate(currentVersion)

        if (checkUpdate.latest) {
            console.log(colorText(botTexts.no_update_available))
        } else {
            console.log(colorText(botTexts.update_available, '#e0e031'))
            fs.removeSync('./dist')
            await updaterLib.makeUpdate('./')
            botController.setDbMigrated(false)
            console.log(colorText(botTexts.bot_updated))
            hasBotUpdated = true
        }
        
        return hasBotUpdated
    } catch(err){
        console.log("[botUpdater]", colorText(botTexts.error_check_update, "#d63e3e"))
        return hasBotUpdated
    }
}