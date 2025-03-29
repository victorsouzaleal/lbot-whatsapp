import {WASocket, GroupMetadata} from 'baileys'
import { buildText, showConsoleError } from '../utils/general.util.js'
import { Bot } from '../interfaces/bot.interface.js'
import { GroupController } from '../controllers/group.controller.js'
import getBotTexts from '../utils/bot.texts.util.js'
import { waLib } from '../libraries/library.js'

export async function addedOnGroup (client: WASocket, groupMetadata: GroupMetadata[], botInfo: Bot){
    try{
        const botTexts = getBotTexts(botInfo)
        await new GroupController().registerGroup(groupMetadata[0])
        const replyText = buildText(botTexts.new_group, groupMetadata[0].subject)
        await waLib.sendText(client, groupMetadata[0].id, replyText, {expiration: groupMetadata[0].ephemeralDuration}).catch(() => {
            //Ignora se não for possível enviar a mensagem para esse grupo
        })
    } catch(err: any){
        showConsoleError(err, "GROUPS-UPSERT")
        client.end(new Error("fatal_error"))
    }
}
