import { WASocket, WAMessage,proto} from 'baileys'
import { BaileysService } from '../services/BaileysService.js'
import { MessageTypes, MimeTypes } from '../interfaces/message.interface.js'

export class BaileysController {
    private baileysService
    private client

    constructor(client : WASocket){
        this.client = client
        this.baileysService = new BaileysService(this.client)
    }
    
    public async deleteMessage (message : WAMessage, isQuoted = false){
        return await this.baileysService.deleteMessage(message, isQuoted)
    }

    public async readMessage(idChat: string, sender: string, idMessage: string){
        return await this.baileysService.readMessage(idChat, sender, idMessage)
    }

    public async updateProfilePic(idChat: string, image : Buffer){
        return await this.baileysService.updateProfilePic(idChat, image)
    }

    public async updateProfileStatus(text: string){
        return await this.baileysService.updateProfileStatus(text)
    }

    public shutdownBot(){
        return this.baileysService.shutdown()
    }
    
    public async getProfilePicUrl(idChat: string){
        return await this.baileysService.getProfilePicUrl(idChat)
    }
    
    public async blockContact(idUser: string){
        return await this.baileysService.blockContact(idUser)
    }
    
    public async unblockContact(idUser: string){
        return await this.baileysService.unblockContact(idUser)
    }
    
    public getHostNumber(){ 
        return this.baileysService.getHostNumber()
    }
    
    public async getBlockedContacts(){ 
        return await this.baileysService.getBlockedContacts()
    }

    public async sendText (idChat: string, text: string){
        return await this.baileysService.sendText(idChat, text)
    }

    public async createPoll(idChat: string, pollName: string, pollValues: string[]){
        return await this.baileysService.createPoll(idChat, pollName, pollValues)
    }
    
    public async sendLinkWithPreview (idChat: string, text: string) {
        return await this.baileysService.sendLinkWithPreview(idChat, text)
    }
    
    public async sendTextWithMentions(idChat: string, text: string, mentions: string[]) { 
        return await this.baileysService.sendTextWithMentions(idChat, text, mentions)
    }

    public async sendSticker (idChat: string, sticker: Buffer){ 
        return await this.baileysService.sendSticker(idChat, sticker)
    }

    public async sendFileFromUrl (type: MessageTypes, idChat: string, url: string, caption: string){ 
        return await this.baileysService.sendFileFromUrl(type, idChat, url, caption)
    }

    public async replyText (idChat: string, text: string, quoted: WAMessage){ 
        return await this.baileysService.replyText(idChat, text, quoted)
    }

    public async replyFile (idChat: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, mimetype? : MimeTypes){ 
        return await this.baileysService.replyFile(idChat, type, url, caption, quoted, mimetype)
    }

    public async replyFileFromUrl (idChat: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, mimetype?: MimeTypes){ 
        return await this.baileysService.replyFileFromUrl(idChat, type, url, caption, quoted, mimetype)
    }

    public async replyFileFromBuffer (idChat: string, type: MessageTypes, buffer: Buffer, caption: string, quoted: WAMessage, mimetype? : MimeTypes){ 
        return await this.baileysService.replyFileFromBuffer(idChat, type, buffer, caption, quoted, mimetype)
    }

    public async replyWithMentions (idChat: string, text: string, mentions: string[], quoted: WAMessage){ 
        return await this.baileysService.replyWithMentions(idChat, text, mentions, quoted)
    }
    
    public async joinGroupInviteLink (linkGroup : string){
        return await this.baileysService.joinGroupInviteLink(linkGroup)
    }
    
    public async revokeGroupInvite (idGroup: string){
        return await this.baileysService.revokeGroupInvite(idGroup)
    }
    
    public async getGroupInviteLink (idGroup: string){
        return await this.baileysService.getGroupInviteLink(idGroup)
    }
    
    public async leaveGroup (idGroup: string){
        return await this.baileysService.leaveGroup(idGroup)
    }
    
    public async getGroupInviteInfo (linkGroup: string){
        return await this.baileysService.getGroupInviteInfo(linkGroup)
    }
    
    public async updateGroupRestriction(idGroup: string, status: boolean){
        return await this.baileysService.updateGroupRestriction(idGroup, status)
    }
       
    public async getAllGroups(){ 
        return await this.baileysService.getAllGroups()
    }
    
    public async removeParticipant(idGroup: string, participant: string){
        return await this.baileysService.removeParticipant(idGroup, participant)
    }
    
    public async addParticipant(idGroup: string, participant: string){
        return await this.baileysService.addParticipant(idGroup, participant)
    }
    
    public async promoteParticipant(idGroup: string, participant: string){
        return await this.baileysService.promoteParticipant(idGroup, participant)
    }
    
    public async demoteParticipant(idGroup: string, participant: string){
        return await this.baileysService.demoteParticipant(idGroup, participant)
    }

}