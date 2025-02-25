import {getContentType, WASocket, WAMessage, MessageUpsertType} from 'baileys'
import { showConsoleError} from './util.js'
import { MessageController } from '../controllers/MessageController.js'
import { Bot} from './interfaces.js'
import NodeCache from 'node-cache'
import { UserController } from '../controllers/UserController.js'
import { handleGroupMessage, handlePrivateMessage } from './message.handler.js'
import { GroupController } from '../controllers/GroupController.js'

export async function messageReceived (client: WASocket, messages : {messages: WAMessage[], requestId?: string, type: MessageUpsertType}, botInfo : Bot, messageCache: NodeCache){
    try{
        if(!messages.messages[0].message) return
        const contentType = getContentType(messages.messages[0].message)
        if(!contentType) return
        if(messages.messages[0].key.fromMe) await new MessageController().storeMessage(messages.messages[0], messageCache)
        switch(messages.type){
            case 'notify':
                const userController = new UserController()
                const groupController = new GroupController()
                const idAdmin = await userController.getAdminId()
                const idChat = messages.messages[0].key.remoteJid
                const isGroupMsg = idChat?.includes("@g.us")
                const group = (isGroupMsg && idChat) ? await groupController.getGroup(idChat) : null
                let message = await new MessageController().formatWAMessage(messages.messages[0], group, botInfo.host_number, idAdmin)
                if(message){
                    await userController.registerUser(message.sender, message.pushname)
                    if(!isGroupMsg) 
                        await handlePrivateMessage(client, botInfo, message)
                    else 
                        await handleGroupMessage(client, group, botInfo, message)
                }
                break
        }

    } catch(err: any){
        showConsoleError(err.message, "MESSAGES.UPSERT")
    }
}
