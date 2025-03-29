import { WASocket, GroupMetadata } from 'baileys'
import { BotController } from '../controllers/bot.controller.js'
import { buildText, showConsoleError, colorText } from '../utils/general.util.js'
import { GroupController } from '../controllers/group.controller.js'
import getBotTexts from '../utils/bot.texts.util.js'
import { waLib } from '../libraries/library.js'

export async function syncGroupsOnStart(client: WASocket){
    try{
        const groupsMetadata = await waLib.getAllGroups(client)
        const botInfo = new BotController().getBot()
        const botTexts = getBotTexts(botInfo)

        if (groupsMetadata.length){
            let groupController = new GroupController()
            await groupController.syncGroups(groupsMetadata)
            await syncBlacklist(client)
            console.log('[GRUPOS]', colorText(botTexts.groups_loaded))
        }

        console.log('[SERVIDOR]', colorText(botTexts.server_started))
        return true
    } catch(err: any){
        showConsoleError(err, "GROUPS-START-UPDATE")
        client.end(new Error("fatal_error"))
    }
    return true
}

async function syncBlacklist(client: WASocket){
    const groupController = new GroupController()
    const currentGroups = await groupController.getAllGroups()
    const botInfo = new BotController().getBot()

    for (let group of currentGroups){
        const participants = await groupController.getParticipants(group.id)
        const isBotAdmin = botInfo.host_number ? await groupController.isAdmin(group.id, botInfo.host_number) : false

        if (isBotAdmin){
            for (let participant of participants){
                const isUserBlacklisted = await groupController.isBlackListed(group.id, participant.user_id)
                if (isUserBlacklisted){
                    const botTexts = getBotTexts(botInfo)
                    const replyText = buildText(botTexts.blacklist_ban_message, waLib.removeWhatsappSuffix(participant.user_id), botInfo.name)
                    await waLib.removeParticipant(client, group.id, participant.user_id)
                    await waLib.sendTextWithMentions(client, group.id, replyText, [participant.user_id], {expiration: group.expiration})
                }
            }
        }
    }
}