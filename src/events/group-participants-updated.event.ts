import {WASocket, ParticipantAction} from 'baileys'
import { buildText, showConsoleError} from '../utils/general.util.js'
import { Bot } from '../interfaces/bot.interface.js'
import { Group } from '../interfaces/group.interface.js'
import { GroupController } from '../controllers/group.controller.js'
import botTexts from '../helpers/bot.texts.helper.js'
import { removeParticipant, sendTextWithMentions, removeWhatsappSuffix, addWhatsappSuffix } from '../utils/whatsapp.util.js'

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

            if (isParticipant) return

            if (await isParticipantBlacklisted(client, botInfo, group, event.participants[0])) return
            else if (await isParticipantFake(client, botInfo, group, event.participants[0])) return
            
            await sendWelcome(client, group, botInfo, event.participants[0])
            await groupController.addParticipant(group.id, event.participants[0])
        } else if (event.action === "remove"){
            const isParticipant = await groupController.isParticipant(group.id, event.participants[0])

            if (!isParticipant) return
            
            if (isBotUpdate) await groupController.removeGroup(event.id)
            else await groupController.removeParticipant(group.id, event.participants[0])
        } else if (event.action === "promote"){
            const isAdmin = await groupController.isParticipantAdmin(group.id, event.participants[0])

            if (isAdmin) return
        
            await groupController.addAdmin(event.id, event.participants[0])
        } else if (event.action === "demote"){
            const isAdmin = await groupController.isParticipantAdmin(group.id, event.participants[0])

            if (!isAdmin) return
            
            await groupController.removeAdmin(event.id, event.participants[0])
        }
    } catch(err: any){
        showConsoleError(err, "GROUP-PARTICIPANTS-UPDATE")
        client.end(new Error("fatal_error"))
    }
}

async function isParticipantBlacklisted(client: WASocket, botInfo: Bot, group: Group, userId: string){
    const groupController = new GroupController()
    const isUserBlacklisted = group.blacklist.includes(userId)
    const isBotAdmin = botInfo.host_number ? await groupController.isParticipantAdmin(group.id, botInfo.host_number) : false

    if (isBotAdmin && isUserBlacklisted) {
        const replyText = buildText(botTexts.blacklist_ban_message, removeWhatsappSuffix(userId), botInfo.name)
        await removeParticipant(client, group.id, userId)
        await sendTextWithMentions(client, group.id, replyText, [userId], {expiration: group.expiration})
        return true
    }

    return false
}

async function isParticipantFake(client: WASocket, botInfo: Bot, group: Group, userId: string){
    if (group.antifake.status){
        const groupController = new GroupController()
        const isBotAdmin = botInfo.host_number ? await groupController.isParticipantAdmin(group.id, botInfo.host_number) : false
        const isGroupAdmin = await groupController.isParticipantAdmin(group.id, userId)
        const isBotNumber = userId == botInfo.host_number
        
        if (isBotAdmin){
            const allowedPrefixes = group.antifake.exceptions.prefixes
            const allowedNumbers = group.antifake.exceptions.numbers
            const isAllowedPrefix = allowedPrefixes.filter(numberPrefix => userId.startsWith(numberPrefix)).length ? true : false
            const isAllowedNumber = allowedNumbers.filter(userNumber => addWhatsappSuffix(userNumber) == userId).length ? true : false

            if (!isAllowedPrefix && !isAllowedNumber && !isBotNumber && !isGroupAdmin){
                const replyText = buildText(botTexts.antifake_ban_message, removeWhatsappSuffix(userId), botInfo.name)
                await sendTextWithMentions(client, group.id, replyText , [userId], {expiration: group.expiration})
                await removeParticipant(client, group.id, userId)
                return true
            }
        } else {
            await groupController.setAntiFake(group.id, false)
        }
    }

    return false
}

async function sendWelcome(client: WASocket, group: Group, botInfo: Bot, userId: string){
    if (group.welcome.status) {
        const customMessage = group.welcome.msg ?  group.welcome.msg + "\n\n" : ""
        const welcomeMessage = buildText(botTexts.group_welcome_message, removeWhatsappSuffix(userId), group.name, customMessage)
        await sendTextWithMentions(client, group.id, welcomeMessage, [userId], {expiration: group.expiration})
    }
}