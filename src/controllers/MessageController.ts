import NodeCache from "node-cache"
import { MessageService } from "../services/MessageService.js"
import {WAMessage, proto} from 'baileys'

export class MessageController{
    private messageService

    constructor(){
        this.messageService = new MessageService()
    }

    public async storeMessage(message : proto.IWebMessageInfo, messageCache : NodeCache){
        return await this.messageService.store(message, messageCache)
    }

    public async getMessage(idMessage: string, messageCache: NodeCache){
        return await this.messageService.get(idMessage, messageCache)
    }

    public async formatWAMessage(message: WAMessage, idHost: string, idAdmin?: string){
        return await this.messageService.formatWAMessage(message, idHost, idAdmin)
    }
}