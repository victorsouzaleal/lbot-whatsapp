import { WASocket, GroupMetadata } from 'baileys'
import { BotController } from '../controllers/bot.controller.js'
import { buildText, showConsoleError, colorText } from '../utils/general.util.js'
import { GroupController } from '../controllers/group.controller.js'
import getBotTexts from '../utils/bot.texts.util.js'
import { waLib } from '../libraries/library.js'

export async function updateGroupsOnStart(client: WASocket){
    try{
        //Obtendo dados dos grupos
        let allGroups = await waLib.getAllGroups(client)
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
            console.log('[GRUPOS]', colorText(getBotTexts(botInfo).groups_loaded))
        }

        // Log : Servidor iniciado
        console.log('[SERVIDOR]', colorText(getBotTexts(botInfo).server_started))
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
        const participants = waLib.getGroupParticipantsByMetadata(group)
        const groupAdmins = waLib.getGroupAdminsByMetadata(group)
        const isBotAdmin = botInfo.host_number ? groupAdmins.includes(botInfo.host_number) : false
        if (isBotAdmin){
            for (let participant of participants){
                const isUserBlacklisted = await groupController.isBlackListed(group.id, participant)
                if (isUserBlacklisted){
                    const botTexts = getBotTexts(botInfo)
                    const replyText = buildText(botTexts.blacklist_ban_message, waLib.removeWhatsappSuffix(participant), botInfo.name)
                    await waLib.removeParticipant(client, group.id, participant)
                    await waLib.sendTextWithMentions(client, group.id, replyText, [participant], {expiration: group.ephemeralDuration})
                }
            }
        }
    }
}