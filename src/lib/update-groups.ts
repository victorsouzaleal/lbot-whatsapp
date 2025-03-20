import { WASocket, GroupMetadata } from 'baileys'
import { BotController } from '../controllers/bot.controller.js'
import { buildText, showConsoleError, colorText, getGroupParticipantsByMetadata, getGroupAdminsByMetadata, removeWhatsappSuffix } from './util.js'
import { GroupController } from '../controllers/group.controller.js'
import getGeneralMessages from './general-messages.js'
import { getAllGroups, removeParticipant, sendTextWithMentions } from './whatsapp.js'

export async function updateGroupsOnStart(client: WASocket){
    try{
        //Obtendo dados dos grupos
        let allGroups = await getAllGroups(client)
        let botInfo = new BotController().getBot()
        //Se não houver grupos retorne
        if (allGroups.length){
            let groupController = new GroupController()
            //Cadastro de grupos
            await groupController.registerGroups(allGroups)
            //Atualização dos participantes dos grupos
            await groupController.updateGroups(allGroups)
            //Verificar lista negra dos grupos
            await filterGroupsBlacklist(client, allGroups)
            // Log : Grupos carregados e atualizados
            console.log('[GRUPOS]', colorText(getGeneralMessages(botInfo).groups_loaded))
        }

        // Log : Servidor iniciado
        console.log('[SERVIDOR]', colorText(getGeneralMessages(botInfo).server_started))
        return true
    } catch(err: any){
        showConsoleError(err, "GROUPS-START-UPDATE")
        client.end(new Error("fatal_error"))
    }
    return true
}

async function filterGroupsBlacklist(client: WASocket, groups: GroupMetadata[]){
    const groupController = new GroupController()
    const botInfo = new BotController().getBot()

    for (let group of groups){
        const participants = getGroupParticipantsByMetadata(group)
        const groupAdmins = getGroupAdminsByMetadata(group)
        const isBotAdmin = botInfo.host_number ? groupAdmins.includes(botInfo.host_number) : false
        if (isBotAdmin){
            for (let participant of participants){
                const isUserBlacklisted = await groupController.isBlackListed(group.id, participant)
                if (isUserBlacklisted){
                    const generalMessages = getGeneralMessages(botInfo)
                    await removeParticipant(client, group.id, participant)
                    await sendTextWithMentions(client, group.id, buildText(generalMessages.blacklist_ban_message, removeWhatsappSuffix(participant), botInfo.name), [participant], {expiration: group.ephemeralDuration})
                }
            }
        }
    }
}