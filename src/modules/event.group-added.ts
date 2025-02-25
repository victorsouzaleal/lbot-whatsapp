import {WASocket, GroupMetadata} from 'baileys'
import { BaileysController } from '../controllers/BaileysController.js'
import { buildText, showConsoleError } from './util.js'
import { Bot } from '../interfaces/bot.interface.js'
import { GroupController } from '../controllers/GroupController.js'
import getGeneralMessagesBot from './bot.general-messages.js'


export async function addedOnGroup (client: WASocket, groupMetadata: GroupMetadata[], botInfo: Bot){
    try{
        const generalMessages = getGeneralMessagesBot(botInfo)
        await new GroupController().registerGroup(groupMetadata[0])
        await new BaileysController(client).sendText(groupMetadata[0].id, buildText(generalMessages.new_group, groupMetadata[0].subject)).catch(()=>{})
    } catch(err: any){
        showConsoleError(err.message, "GROUPS-UPSERT")
        client.end(new Error("fatal_error"))
    }
}
