import { WASocket, WAMessage, GroupMetadata, WAPresence } from 'baileys'
import { randomDelay } from '../modules/util.js'
import { DeletedMessage, MessageTypes, MimeTypes } from '../modules/interfaces.js'
import api from '@victorsouzaleal/biblioteca-lbot'

export class BaileysService{

    private client

    constructor(client: WASocket){
        this.client = client
    }

    public async deleteMessage(message : WAMessage, isQuoted = false){
        let deletedMessage : DeletedMessage
        let idChat = message.key.remoteJid
        if(!idChat) return false
        if(isQuoted){
            deletedMessage = {
                remoteJid: message.key.remoteJid,
                fromMe: false,
                id: message.message?.extendedTextMessage?.contextInfo?.stanzaId,
                participant: message?.message?.extendedTextMessage?.contextInfo?.participant
            }
        } else{
            deletedMessage = message.key
        }

        return await this.client.sendMessage(idChat, {delete: deletedMessage})
    }

    public async readMessage(idChat: string, sender: string, idMessage: string){
        await this.client.sendReceipt(idChat, sender, [idMessage], 'read')
    }

    private async updatePresence(idChat: string, presence: WAPresence){
        await this.client.presenceSubscribe(idChat)
        await randomDelay(200, 400)
        await this.client.sendPresenceUpdate(presence, idChat)
        await randomDelay(300, 1000)
        await this.client.sendPresenceUpdate('paused', idChat)
    }

    public async updateProfilePic(idChat: string , image: Buffer){
        await this.client.updateProfilePicture(idChat, image)
    }

    public async updateProfileStatus(text: string){
        await this.client.updateProfileStatus(text)
    }

    public shutdown(){
        this.client.end(new Error("admin_command"))
    }

    public async getProfilePicUrl(idChat: string){
        return await this.client.profilePictureUrl(idChat, "image")
    }

    public async blockContact(idUser: string){
        await this.client.updateBlockStatus(idUser, "block")
    }

    public async unblockContact(idUser: string){
        await this.client.updateBlockStatus(idUser, "unblock")
    }

    public getHostNumber(){
        let id = this.client.user?.id.replace(/:[0-9]+/ism, '')
        return id || ''
    }

    public async getBlockedContacts(){
        return await this.client.fetchBlocklist()
    }

    public async sendText(idChat: string, text: string){
        await this.updatePresence(idChat, "composing")
        return await this.client.sendMessage(idChat, {text, linkPreview: null})
    }

    public async createPoll(idChat: string, pollName: string, pollValues: string[]){
        return await this.client.sendMessage(idChat, {poll : {name: pollName, values: pollValues, selectableCount: 1}})
    }

    public async sendLinkWithPreview(idChat: string, text: string){
        return await this.client.sendMessage(idChat, {text})
    }

    public async sendTextWithMentions(idChat: string, text: string, mentions: string[]) {
        await this.updatePresence(idChat, "composing")
        return await this.client.sendMessage(idChat, {text , mentions})
    }
   
    public async sendSticker(idChat: string, sticker: Buffer){
        return await this.client.sendMessage(idChat, {sticker})
    }

    public async sendFileFromUrl(type: MessageTypes, idChat: string, url: string, caption: string){
        if(type == "imageMessage"){
            return await this.client.sendMessage(idChat, {image: {url}, caption})
        }
    }

    public async replyText (idChat: string, text: string, quoted: WAMessage){ 
        await this.updatePresence(idChat, "composing")
        return await this.client.sendMessage(idChat, {text, linkPreview: null}, {quoted})
    }

    public async replyFile (idChat: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, mimetype? : MimeTypes){ 
        if(type == "imageMessage"){
            return await this.client.sendMessage(idChat, {image: {url}, caption}, {quoted})
        } else if (type == "videoMessage"){
            const base64Thumb = (await api.Videos.obterThumbnailVideo(url)).resultado
            return await this.client.sendMessage(idChat, {video: {url}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted})
        } else if (type == "audioMessage"){
            return await this.client.sendMessage(idChat, {audio: {url}, mimetype}, {quoted})
        }
    }

    public async replyFileFromUrl (idChat: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, mimetype?: MimeTypes){ 
        if(type == "imageMessage"){
            return await this.client.sendMessage(idChat, {image: {url}, caption}, {quoted})
        } else if (type == "videoMessage"){
            const base64Thumb = (await api.Videos.obterThumbnailVideo(url)).resultado
            return await this.client.sendMessage(idChat, {video: {url}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted})
        } else if (type == "audioMessage"){
            return await this.client.sendMessage(idChat, {audio: {url}, mimetype}, {quoted})
        }
    }

    public async replyFileFromBuffer (idChat: string, type: MessageTypes, buffer: Buffer, caption: string, quoted: WAMessage, mimetype? : MimeTypes){ 
        if(type == "videoMessage"){
            const base64Thumb = (await api.Videos.obterThumbnailVideo(buffer, "buffer")).resultado
            return await this.client.sendMessage(idChat, {video: buffer, caption, mimetype, jpegThumbnail: base64Thumb}, {quoted})
        } else if(type == "imageMessage"){
            return await this.client.sendMessage(idChat, {image: buffer, caption}, {quoted})
        } else if (type == "audioMessage"){
            return await this.client.sendMessage(idChat, {audio: buffer, mimetype}, {quoted})
        }
    }

    public async replyWithMentions (idChat: string, text: string, mentions: string[], quoted: WAMessage){ 
        await this.updatePresence(idChat, "composing")
        return await this.client.sendMessage(idChat, {text , mentions}, {quoted})
    }

    public async joinGroupInviteLink (linkGroup : string){
        return await this.client.groupAcceptInvite(linkGroup)
    }

    public async revokeGroupInvite (idGroup: string){
        return await this.client.groupRevokeInvite(idGroup)
    }

    public async getGroupInviteLink (idGroup: string){
        let inviteCode = await this.client.groupInviteCode(idGroup)
        return inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : undefined
    }

    public async leaveGroup (idGroup: string){
        return await this.client.groupLeave(idGroup)
    }

    public async getGroupInviteInfo (linkGroup: string){
        return await this.client.groupGetInviteInfo(linkGroup)
    }

    public async updateGroupRestriction(idGroup: string, status: boolean){
        let config : "announcement" | "not_announcement" = status ? "announcement" : "not_announcement"
        return await this.client.groupSettingUpdate(idGroup, config)
    }

    public async getAllGroups(){ 
        let groups = await this.client.groupFetchAllParticipating()
        let groupsInfo : GroupMetadata[] = []
        for (let [key, value] of Object.entries(groups)) {
            groupsInfo.push(value)
        }
        return groupsInfo
    }

    public async removeParticipant(idGroup: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(idGroup, [participant], "remove")
        return response
    }

    public async addParticipant(idGroup: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(idGroup, [participant], "add")
        return response
    }

    public async promoteParticipant(idGroup: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(idGroup, [participant], "promote")
        return response
    }

    public async demoteParticipant(idGroup: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(idGroup, [participant], "demote")
        return response
    }
}