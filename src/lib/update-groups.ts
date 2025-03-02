import { WASocket, GroupMetadata } from 'baileys'
import { BotController } from '../controllers/bot.controller.js'
import { BaileysController } from '../controllers/baileys.controller.js'
import { buildText, showConsoleError, colorText, getGroupParticipantsByMetadata, getGroupAdminsByMetadata } from './util.js'
import { GroupController } from '../controllers/group.controller.js'
import getGeneralMessages from './general-messages.js'

export async function updateGroupsOnStart(client: WASocket){
    try{
        //Obtendo dados dos grupos
        let baileysController = new BaileysController(client)
        let allGroups = await baileysController.getAllGroups()
        let botInfo = new BotController().getBot()
        //Se não houver grupos retorne
        if(allGroups.length){
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
        if(isBotAdmin){
            for (let participant of participants){
                const isUserBlacklisted = await groupController.isBlackListed(group.id, participant)
                if(isUserBlacklisted){
                    const generalMessages = getGeneralMessages(botInfo)
                    const baileysController = new BaileysController(client)
                    await baileysController.removeParticipant(group.id, participant)
                    await baileysController.sendTextWithMentions(group.id, buildText(generalMessages.blacklist_ban_message, participant.replace("@s.whatsapp.net", ""), botInfo.name), [participant])
                }
            }
        }
    }
}