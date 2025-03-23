import {WASocket, GroupMetadata} from 'baileys'
import { buildText, showConsoleError } from '../../utils/general.utils.js'
import { Bot } from '../../interfaces/bot.interface.js'
import { GroupController } from '../controllers/group.controller.js'
import getGeneralMessages from '../../utils/text.utils.js'
import { sendText } from '../helpers/whatsapp.helper.js'

export async function addedOnGroup (client: WASocket, groupMetadata: GroupMetadata[], botInfo: Bot){
    try{
        const generalMessages = getGeneralMessages(botInfo)
        await new GroupController().registerGroup(groupMetadata[0])
        await sendText(client, groupMetadata[0].id, buildText(generalMessages.new_group, groupMetadata[0].subject), {expiration: groupMetadata[0].ephemeralDuration}).catch()
    } catch(err: any){
        showConsoleError(err, "GROUPS-UPSERT")
        client.end(new Error("fatal_error"))
    }
}
