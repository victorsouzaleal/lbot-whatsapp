import {WASocket, ParticipantAction} from 'baileys'
import { buildText, showConsoleError} from '../utils/general.util.js'
import { Bot } from '../interfaces/bot.interface.js'
import { Group } from '../interfaces/group.interface.js'
import { GroupController } from '../controllers/group.controller.js'
import getBotTexts from '../utils/bot.texts.util.js'
import { waLib } from '../libraries/library.js'

export async function groupParticipantsUpdated (client: WASocket, event: {id: string, author: string, participants: string[], action: ParticipantAction}, botInfo: Bot){
    try{
        const groupController = new GroupController()
        const isBotUpdate = event.participants[0] == botInfo.host_number
        const group = await groupController.getGroup(event.id)

        if (!group) {
            return
        }

        if (event.action === 'add') {
            const isParticipant = await groupController.isParticipant(group.id, event.participants[0])

            if (isParticipant) {
                return
            } else if (await isParticipantBlacklisted(client, botInfo, group, event.participants[0])){
                return
            } else if (await isParticipantFake(client, botInfo, group, event.participants[0])) {
                return
            }

            await sendWelcome(client, group, botInfo, event.participants[0])
            await groupController.addParticipant(group.id, event.participants[0])

        } else if (event.action === "remove"){
            const isParticipant = await groupController.isParticipant(group.id, event.participants[0])

            if (!isParticipant) {
                return
            } else if (isBotUpdate){
                await groupController.removeGroup(event.id)
            } else {
                await groupController.removeParticipant(group.id, event.participants[0])
            }

        } else if (event.action === "promote"){
            const isAdmin = await groupController.isAdmin(group.id, event.participants[0])

            if (isAdmin) {
                return
            }

            await groupController.addAdmin(event.id, event.participants[0])

        } else if (event.action === "demote"){
            const isAdmin = await groupController.isAdmin(group.id, event.participants[0])

            if (!isAdmin) {
                return
            }
            
            await groupController.removeAdmin(event.id, event.participants[0])

        }
    } catch(err: any){
        showConsoleError(err, "GROUP-PARTICIPANTS-UPDATE")
        client.end(new Error("fatal_error"))
    }
}

async function isParticipantBlacklisted(client: WASocket, botInfo: Bot, group: Group, userId: string){
    const groupController = new GroupController()
    const isUserBlacklisted = await groupController.isBlackListed(group.id, userId)
    const botTexts = getBotTexts(botInfo)
    const isBotAdmin = botInfo.host_number ? await groupController.isAdmin(group.id, botInfo.host_number) : false

    if (isBotAdmin && isUserBlacklisted) {
        const replyText = buildText(botTexts.blacklist_ban_message, waLib.removeWhatsappSuffix(userId), botInfo.name)
        await waLib.removeParticipant(client, group.id, userId)
        await waLib.sendTextWithMentions(client, group.id, replyText, [userId], {expiration: group.expiration})
        return true
    }

    return false
}

async function isParticipantFake(client: WASocket, botInfo: Bot, group: Group, userId: string){
    if (group.antifake.status){
        const groupController = new GroupController()
        const isBotAdmin = botInfo.host_number ? await groupController.isAdmin(group.id, botInfo.host_number) : false
        const isGroupAdmin = await groupController.isAdmin(group.id, userId)
        const isBotNumber = userId == botInfo.host_number
        
        if (isBotAdmin){
            const isFake = groupController.isNumberFake(group, userId)

            if (isFake && !isBotNumber && !isGroupAdmin){
                const botTexts = getBotTexts(botInfo)
                const replyText = buildText(botTexts.antifake_ban_message, waLib.removeWhatsappSuffix(userId), botInfo.name)
                await waLib.sendTextWithMentions(client, group.id, replyText , [userId], {expiration: group.expiration})
                await waLib.removeParticipant(client, group.id, userId)
                return true
            }
        } else {
            await groupController.setAntiFake(group.id, false, [])
        }
    }

    return false
}

async function sendWelcome(client: WASocket, group: Group, botInfo: Bot, userId: string){
    if (group.welcome.status) {
        const groupController = new GroupController()
        const messageWelcome = groupController.getWelcomeMessage(group, botInfo, userId)
        await waLib.sendTextWithMentions(client, group.id, messageWelcome, [userId], {expiration: group.expiration})
    }
}