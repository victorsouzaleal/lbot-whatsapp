import NodeCache from "node-cache"
import { MessageService } from "../services/message.service.js"
import {WAMessage, proto} from 'baileys'
import { Group } from "../interfaces/group.interface.js"

export class MessageController{
    private messageService

    constructor(){
        this.messageService = new MessageService()
    }

    storeMessage(message : proto.IWebMessageInfo, messageCache : NodeCache){
        return this.messageService.storeMessageCache(message, messageCache)
    }

    getMessage(messageId: string, messageCache: NodeCache){
        return this.messageService.getMessageCache(messageId, messageCache)
    }

    formatWAMessage(message: WAMessage, group: Group|null, hostId: string, adminId?: string){
        return this.messageService.formatWAMessage(message, group, hostId, adminId)
    }
}