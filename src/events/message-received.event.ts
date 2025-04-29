import {getContentType, WASocket, WAMessage, MessageUpsertType} from 'baileys'
import { showConsoleError} from '../utils/general.util.js'
import { Bot } from '../interfaces/bot.interface.js'
import NodeCache from 'node-cache'
import { UserController } from '../controllers/user.controller.js'
import { handleGroupMessage, handlePrivateMessage } from '../helpers/message.handler.helper.js'
import { GroupController } from '../controllers/group.controller.js'
import { storeMessageOnCache, formatWAMessage } from '../utils/whatsapp.util.js'
import { commandInvoker } from '../helpers/command.invoker.helper.js'

export async function messageReceived (client: WASocket, messages : {messages: WAMessage[], requestId?: string, type: MessageUpsertType}, botInfo : Bot, messageCache: NodeCache){
    try{
        if (messages.messages[0].key.fromMe) {
            storeMessageOnCache(messages.messages[0], messageCache)
        }
    
        switch (messages.type){
            case 'notify':
                const userController = new UserController()
                const groupController = new GroupController()
                const idChat = messages.messages[0].key.remoteJid
                const isGroupMsg = idChat?.includes("@g.us")
                const group = (isGroupMsg && idChat) ? await groupController.getGroup(idChat) : null
                let message = await formatWAMessage(messages.messages[0], group, botInfo.host_number)

                if (message) {
                    await userController.registerUser(message.sender, message.pushname)
        
                    if (!isGroupMsg) {
                        const needCallCommand = await handlePrivateMessage(client, botInfo, message)
                        if (needCallCommand) {
                            await commandInvoker(client, botInfo, message, null)
                        }
                    } else if (group) {
                        const needCallCommand = await handleGroupMessage(client, group, botInfo, message)
                        if (needCallCommand) {
                            await commandInvoker(client, botInfo, message, group)
                        }
                    }
                }

                break
        }
    } catch(err: any){
        showConsoleError(err, "MESSAGES.UPSERT")
    }
}
