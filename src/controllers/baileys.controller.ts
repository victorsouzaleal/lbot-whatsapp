import { WASocket, WAMessage} from 'baileys'
import { BaileysService } from '../services/baileys.service.js'
import { MessageTypes, MimeTypes } from '../interfaces/message.interface.js'

export class BaileysController {
    private baileysService
    private client

    constructor(client : WASocket){
        this.client = client
        this.baileysService = new BaileysService(this.client)
    }
    
    deleteMessage (message : WAMessage, deleteQuoted : boolean){
        return this.baileysService.deleteMessage(message, deleteQuoted)
    }

    readMessage(chatId: string, sender: string, messageId: string){
        return this.baileysService.readMessage(chatId, sender, messageId)
    }

    updateProfilePic(chatId: string, image : Buffer){
        return this.baileysService.updateProfilePic(chatId, image)
    }

    updateProfileStatus(text: string){
        return this.baileysService.updateProfileStatus(text)
    }

    shutdownBot(){
        return this.baileysService.shutdownBot()
    }
    
    getProfilePicUrl(chatId: string){
        return this.baileysService.getProfilePicUrl(chatId)
    }
    
    blockContact(userId: string){
        return this.baileysService.blockContact(userId)
    }
    
    unblockContact(userId: string){
        return this.baileysService.unblockContact(userId)
    }
    
    getHostNumber(){ 
        return this.baileysService.getHostNumber()
    }
    
    getBlockedContacts(){ 
        return this.baileysService.getBlockedContacts()
    }

    sendText (chatId: string, text: string, expiration?: number | null){
        return this.baileysService.sendText(chatId, text, expiration || undefined)
    }
    
    sendLinkWithPreview (chatId: string, text: string, expiration?: number | null) {
        return this.baileysService.sendLinkWithPreview(chatId, text, expiration || undefined)
    }
    
    sendTextWithMentions(chatId: string, text: string, mentions: string[], expiration?: number | null) { 
        return this.baileysService.sendTextWithMentions(chatId, text, mentions, expiration || undefined)
    }

    sendSticker (chatId: string, sticker: Buffer, expiration?: number | null){ 
        return this.baileysService.sendSticker(chatId, sticker, expiration || undefined)
    }

    sendFileFromUrl (chatId: string, type: MessageTypes, url: string, caption: string, expiration?: number | null){ 
        return this.baileysService.sendFileFromUrl(chatId, type, url, caption, expiration || undefined)
    }

    replyText (chatId: string, text: string, quoted: WAMessage, expiration: number | null){ 
        return this.baileysService.replyText(chatId, text, quoted, expiration || undefined)
    }

    replyFile (chatId: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, expiration: number | null, mimetype?: MimeTypes){ 
        return this.baileysService.replyFile(chatId, type, url, caption, quoted, expiration || undefined, mimetype)
    }

    replyFileFromUrl (chatId: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, expiration: number | null , mimetype?: MimeTypes){ 
        return this.baileysService.replyFileFromUrl(chatId, type, url, caption, quoted, expiration || undefined, mimetype)
    }

    replyFileFromBuffer (chatId: string, type: MessageTypes, buffer: Buffer, caption: string, quoted: WAMessage, expiration: number | null, mimetype?: MimeTypes){ 
        return this.baileysService.replyFileFromBuffer(chatId, type, buffer, caption, quoted, expiration || undefined, mimetype)
    }

    replyWithMentions (chatId: string, text: string, mentions: string[], quoted: WAMessage, expiration: number | null){ 
        return this.baileysService.replyWithMentions(chatId, text, mentions, quoted, expiration || undefined)
    }
    
    joinGroupInviteLink (linkGroup : string){
        return this.baileysService.joinGroupInviteLink(linkGroup)
    }
    
    revokeGroupInvite (groupId: string){
        return this.baileysService.revokeGroupInvite(groupId)
    }
    
    getGroupInviteLink (groupId: string){
        return this.baileysService.getGroupInviteLink(groupId)
    }
    
    leaveGroup (groupId: string){
        return this.baileysService.leaveGroup(groupId)
    }
    
    getGroupInviteInfo (linkGroup: string){
        return this.baileysService.getGroupInviteInfo(linkGroup)
    }
    
    updateGroupRestriction(groupId: string, status: boolean){
        return this.baileysService.updateGroupRestriction(groupId, status)
    }
       
    getAllGroups(){ 
        return this.baileysService.getAllGroups()
    }
    
    removeParticipant(groupId: string, participant: string){
        return this.baileysService.removeParticipant(groupId, participant)
    }
    
    addParticipant(groupId: string, participant: string){
        return this.baileysService.addParticipant(groupId, participant)
    }
    
    promoteParticipant(groupId: string, participant: string){
        return this.baileysService.promoteParticipant(groupId, participant)
    }
    
    demoteParticipant(groupId: string, participant: string){
        return this.baileysService.demoteParticipant(groupId, participant)
    }

}