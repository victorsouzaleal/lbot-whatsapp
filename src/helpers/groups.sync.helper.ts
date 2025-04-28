import { WASocket, GroupMetadata } from 'baileys'
import { BotController } from '../controllers/bot.controller.js'
import { buildText, showConsoleError, colorText } from '../utils/general.util.js'
import { GroupController } from '../controllers/group.controller.js'
import botTexts from '../helpers/bot.texts.helper.js'
import { waLib } from '../libraries/library.js'

export async function syncGroupsOnStart(client: WASocket){
    try{
        const groupsMetadata = await waLib.getAllGroups(client)

        if (groupsMetadata.length){
            let groupController = new GroupController()
            await groupController.syncGroups(groupsMetadata)
            await syncResources(client)
            console.log(colorText(botTexts.groups_loaded))
        }

        return true
    } catch(err: any){
        showConsoleError(err, "GROUPS-START-UPDATE")
        client.end(new Error("fatal_error"))
    }
    return true
}

async function syncResources(client: WASocket){
    const groupController = new GroupController()
    const currentGroups = await groupController.getAllGroups()
    const botInfo = new BotController().getBot()

    for (let group of currentGroups){
        const participants = await groupController.getParticipants(group.id)
        const isBotAdmin = botInfo.host_number ? await groupController.isParticipantAdmin(group.id, botInfo.host_number) : false
        let bannedByBlackList = 0
        let bannedByAntiFake = 0

        if (isBotAdmin){
            for (let participant of participants){
                const isUserBlacklisted = group.blacklist.includes(participant.user_id)
                const isBotNumber = participant.user_id == botInfo.host_number

                //Sync LISTA-NEGRA
                if (isUserBlacklisted){
                    await waLib.removeParticipant(client, group.id, participant.user_id)
                    bannedByBlackList++
                    continue
                }

                //Sync ANTI-FAKE
                if(group.antifake.status){
                    const allowedPrefixes = group.antifake.exceptions.prefixes
                    const allowedNumbers = group.antifake.exceptions.numbers
                    const isAllowedPrefix = allowedPrefixes.filter(numberPrefix => participant.user_id.startsWith(numberPrefix)).length ? true : false
                    const isAllowedNumber = allowedNumbers.filter(userNumber => waLib.addWhatsappSuffix(userNumber) == participant.user_id).length ? true : false
                    if (!isAllowedPrefix && !isAllowedNumber && group.antifake.status && !participant.admin && !isBotNumber) {
                        await waLib.removeParticipant(client, group.id, participant.user_id)
                        bannedByAntiFake++
                        continue
                    }
                }
                
            }

            if (bannedByBlackList) {
                const replyText = buildText(botTexts.sync_blacklist, bannedByBlackList)
                await waLib.sendText(client, group.id, replyText, { expiration: group.expiration })
            }

            if (bannedByAntiFake) {
                const replyText = buildText(botTexts.sync_antifake, bannedByAntiFake)
                await waLib.sendText(client, group.id, replyText, { expiration: group.expiration })
            }
        } else {
            if (group.antifake.status) {
                await groupController.setAntiFake(group.id, false)
            }
        }
    }
}