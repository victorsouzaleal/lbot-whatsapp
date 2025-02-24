import {getContentType, WASocket, WAMessage, MessageUpsertType} from 'baileys'
import { showConsoleError} from './util.js'
import { MessageController } from '../controllers/MessageController.js'
import { Bot} from './interfaces.js'
import NodeCache from 'node-cache'
import { UserController } from '../controllers/UserController.js'
import { checkMessage } from './check-message.js'

export async function messageReceived (client: WASocket, messages : {messages: WAMessage[], requestId?: string, type: MessageUpsertType}, botInfo : Bot, messageCache: NodeCache){
    try{
        if(!messages.messages[0].message) return
        const contentType = getContentType(messages.messages[0].message)
        if(!contentType) return
        if(messages.messages[0].key.fromMe) await new MessageController().storeMessage(messages.messages[0], messageCache)
        switch(messages.type){
            case 'notify':
                const userController = new UserController()
                const idAdmin = await userController.getAdminId()
                const idHost = botInfo.host_number
                if(idHost) {
                    let message = await new MessageController().formatWAMessage(messages.messages[0], idHost, idAdmin)
                    if(message){
                        await userController.registerUser(message.sender, message.pushname)
                        if(!await checkMessage(client, botInfo, message)) return false
                    }
                }
                break
        }

    } catch(err: any){
        showConsoleError(err.message, "MESSAGES.UPSERT")
    }
}
