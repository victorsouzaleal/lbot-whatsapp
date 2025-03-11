import {WASocket, ParticipantAction} from 'baileys'
import { BaileysController } from '../controllers/baileys.controller.js'
import { buildText, showConsoleError} from '../lib/util.js'
import { Bot } from '../interfaces/bot.interface.js'
import { Group } from '../interfaces/group.interface.js'
import { GroupController } from '../controllers/group.controller.js'
import getGeneralMessages from '../lib/general-messages.js'

export async function groupParticipantsUpdated (client: WASocket, event: {id: string, author: string, participants: string[], action: ParticipantAction}, botInfo: Bot){
    try{
        const groupController = new GroupController()
        const isBotUpdate = event.participants[0] == botInfo.host_number
        const group = await groupController.getGroup(event.id)

        if(!group) return

        if (event.action === 'add') {
            //Filtro de LISTA-NEGRA
            if(!await filterUserBlacklist(client, botInfo, group, event.participants[0])) return

            //Filtro de ANTI-FAKE
            if(!await filterUserAntifake(client, botInfo, group, event.participants[0])) return
            
            //Mensagem de boas vindas
            await sendWelcome(client, group, botInfo, event.participants[0])
            //Inclusão no banco de dados
            await groupController.addParticipant(event.id, event.participants[0])
        } else if(event.action === "remove"){
            if(isBotUpdate){
                //Se o bot for removido do grupo, remova o contador e o grupo do banco de dados. 
                if(group?.counter.status) await groupController.removeGroupCounter(event.id)
                await groupController.removeGroup(event.id)
            } else {
                //Se um participante for removido, somente remova ele do banco de dados do grupo.
                await groupController.removeParticipant(event.id, event.participants[0])
            }
        } else if(event.action === "promote"){
            //Se um participante for promovido
            await groupController.addAdmin(event.id, event.participants[0])
        } else if(event.action === "demote"){
            //Se um participant for rebaixado
            await groupController.removeAdmin(event.id, event.participants[0])
        }
    } catch(err: any){
        showConsoleError(err, "GROUP-PARTICIPANTS-UPDATE")
        client.end(new Error("fatal_error"))
    }
}

async function filterUserBlacklist(client: WASocket, botInfo: Bot, group: Group, userId: string){
    const groupAdmins = group.admins
    const isUserBlacklisted = await new GroupController().isBlackListed(group.id, userId)
    const generalMessages = getGeneralMessages(botInfo)
    const isBotAdmin = botInfo.host_number ? groupAdmins.includes(botInfo.host_number) : false
    if (isBotAdmin && isUserBlacklisted) {
        const baileysController = new BaileysController(client)
        await baileysController.removeParticipant(group.id, userId)
        await baileysController.sendTextWithMentions(group.id, buildText(generalMessages.blacklist_ban_message, userId.replace("@s.whatsapp.net", ""), botInfo.name), [userId])
        return false
    }
    return true
}

async function filterUserAntifake(client: WASocket, botInfo: Bot, group: Group, userId: string){
    if(group.antifake.status){
        const groupAdmins = group.admins
        const isBotAdmin = botInfo.host_number ? groupAdmins.includes(botInfo.host_number) : false
        const groupController = new GroupController()
        if(isBotAdmin){
            const isFake = groupController.isNumberFake(group, userId)
            if(isFake){
                const baileysController = new BaileysController(client)
                const generalMessages = getGeneralMessages(botInfo)
                await baileysController.sendTextWithMentions(group.id, buildText(generalMessages.antifake_ban_message, userId.replace("@s.whatsapp.net", ""), botInfo.name), [userId])
                await baileysController.removeParticipant(group.id, userId)
                return false
            }
        } else {
            await groupController.setAntifake(group.id, false, [])
        }
    }

    return true
}

async function sendWelcome(client: WASocket, group: Group, botInfo: Bot, userId: string){
    if (group.welcome.status) {
        const groupController = new GroupController()
        const baileysController = new BaileysController(client)
        const messageWelcome = groupController.getWelcomeMessage(group, botInfo, userId)
        await baileysController.sendTextWithMentions(group.id, messageWelcome, [userId])
    }
}

