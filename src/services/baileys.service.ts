import { WASocket, WAMessage, GroupMetadata, WAPresence } from 'baileys'
import { randomDelay } from '../lib/util.js'
import {MessageTypes, MimeTypes } from '../interfaces/message.interface.js'
import { convertLibrary } from '@victorsouzaleal/biblioteca-lbot'

export class BaileysService{
    private client

    constructor(client: WASocket){
        this.client = client
    }

    private async updatePresence(chatId: string, presence: WAPresence){
        await this.client.presenceSubscribe(chatId)
        await randomDelay(200, 400)
        await this.client.sendPresenceUpdate(presence, chatId)
        await randomDelay(300, 1000)
        await this.client.sendPresenceUpdate('paused', chatId)
    }

    deleteMessage(message : WAMessage, deleteQuoted : boolean){
        let deletedMessage
        let chatId = message.key.remoteJid

        if(!chatId) return

        if(deleteQuoted){
            deletedMessage = {
                remoteJid: message.key.remoteJid,
                fromMe: message.key.participant === message?.message?.extendedTextMessage?.contextInfo?.participant,
                id: message.message?.extendedTextMessage?.contextInfo?.stanzaId,
                participant: message?.message?.extendedTextMessage?.contextInfo?.participant
            }
        } else{
            deletedMessage = message.key
        }

        return this.client.sendMessage(chatId, {delete: deletedMessage})
    }

    readMessage(chatId: string, sender: string, messageId: string){
        return this.client.sendReceipt(chatId, sender, [messageId], 'read')
    }

    updateProfilePic(chatId: string , image: Buffer){
        return this.client.updateProfilePicture(chatId, image)
    }

    updateProfileStatus(text: string){
        return this.client.updateProfileStatus(text)
    }

    shutdownBot(){
        return this.client.end(new Error("admin_command"))
    }

    getProfilePicUrl(chatId: string){
        return this.client.profilePictureUrl(chatId, "image")
    }

    blockContact(userId: string){
        return this.client.updateBlockStatus(userId, "block")
    }

    unblockContact(userId: string){
        return this.client.updateBlockStatus(userId, "unblock")
    }

    getHostNumber(){
        let id = this.client.user?.id.replace(/:[0-9]+/ism, '')
        return id || ''
    }

    getBlockedContacts(){
        return this.client.fetchBlocklist()
    }

    async sendText(chatId: string, text: string){
        await this.updatePresence(chatId, "composing")
        return this.client.sendMessage(chatId, {text, linkPreview: null})
    }

    createPoll(chatId: string, pollName: string, pollValues: string[]){
        return this.client.sendMessage(chatId, {poll : {name: pollName, values: pollValues, selectableCount: 1}})
    }

    sendLinkWithPreview(chatId: string, text: string){
        return this.client.sendMessage(chatId, {text})
    }

    async sendTextWithMentions(chatId: string, text: string, mentions: string[]) {
        await this.updatePresence(chatId, "composing")
        return this.client.sendMessage(chatId, {text , mentions})
    }
   
    sendSticker(chatId: string, sticker: Buffer){
        return this.client.sendMessage(chatId, {sticker})
    }

    async sendFileFromUrl(chatId: string, type: MessageTypes, url: string, caption: string, mimetype?: MimeTypes){
        if(type === "imageMessage") {
            return this.client.sendMessage(chatId, {image: {url}, caption})
        }else if(type === 'videoMessage'){
            const base64Thumb = await convertLibrary.convertVideoToThumbnail('url', url)
            return this.client.sendMessage(chatId, {video: {url}, mimetype, caption, jpegThumbnail: base64Thumb})
        } else if(type === 'audioMessage'){
            return this.client.sendMessage(chatId, {audio: {url}, mimetype})
        }
    }

    async replyText (chatId: string, text: string, quoted: WAMessage){ 
        await this.updatePresence(chatId, "composing")
        return this.client.sendMessage(chatId, {text, linkPreview: null}, {quoted})
    }

    async replyFile (chatId: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, mimetype? : MimeTypes){ 
        if(type == "imageMessage"){
            return this.client.sendMessage(chatId, {image: {url}, caption}, {quoted})
        } else if (type == "videoMessage"){
            const base64Thumb = await convertLibrary.convertVideoToThumbnail('file', url)
            return this.client.sendMessage(chatId, {video: {url}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted})
        } else if (type == "audioMessage"){
            return this.client.sendMessage(chatId, {audio: {url}, mimetype}, {quoted})
        }
    }

    async replyFileFromUrl (chatId: string, type: MessageTypes, url: string, caption: string, quoted: WAMessage, mimetype?: MimeTypes){ 
        if(type == "imageMessage"){
            return this.client.sendMessage(chatId, {image: {url}, caption}, {quoted})
        } else if (type == "videoMessage"){
            const base64Thumb = await convertLibrary.convertVideoToThumbnail('url', url)
            return this.client.sendMessage(chatId, {video: {url}, mimetype, caption, jpegThumbnail: base64Thumb}, {quoted})
        } else if (type == "audioMessage"){
            return this.client.sendMessage(chatId, {audio: {url}, mimetype}, {quoted})
        }
    }

    async replyFileFromBuffer (chatId: string, type: MessageTypes, buffer: Buffer, caption: string, quoted: WAMessage, mimetype? : MimeTypes){ 
        if(type == "videoMessage"){
            const base64Thumb = await convertLibrary.convertVideoToThumbnail('buffer', buffer)
            return this.client.sendMessage(chatId, {video: buffer, caption, mimetype, jpegThumbnail: base64Thumb}, {quoted})
        } else if(type == "imageMessage"){
            return this.client.sendMessage(chatId, {image: buffer, caption}, {quoted})
        } else if (type == "audioMessage"){
            return this.client.sendMessage(chatId, {audio: buffer, mimetype}, {quoted})
        }
    }

    async replyWithMentions (chatId: string, text: string, mentions: string[], quoted: WAMessage){ 
        await this.updatePresence(chatId, "composing")
        return this.client.sendMessage(chatId, {text , mentions}, {quoted})
    }

    joinGroupInviteLink (linkGroup : string){
        return this.client.groupAcceptInvite(linkGroup)
    }

    revokeGroupInvite (groupId: string){
        return this.client.groupRevokeInvite(groupId)
    }

    async getGroupInviteLink (groupId: string){
        let inviteCode = await this.client.groupInviteCode(groupId)
        return inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : undefined
    }

    leaveGroup (groupId: string){
        return this.client.groupLeave(groupId)
    }

    getGroupInviteInfo (linkGroup: string){
        return this.client.groupGetInviteInfo(linkGroup)
    }

    updateGroupRestriction(groupId: string, status: boolean){
        let config : "announcement" | "not_announcement" = status ? "announcement" : "not_announcement"
        return this.client.groupSettingUpdate(groupId, config)
    }

    async getAllGroups(){ 
        let groups = await this.client.groupFetchAllParticipating()
        let groupsInfo : GroupMetadata[] = []

        for (let [key, value] of Object.entries(groups)) {
            groupsInfo.push(value)
        }
        
        return groupsInfo
    }

    async removeParticipant(groupId: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(groupId, [participant], "remove")
        return response
    }

    async addParticipant(groupId: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(groupId, [participant], "add")
        return response
    }

    async promoteParticipant(groupId: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(groupId, [participant], "promote")
        return response
    }

    async demoteParticipant(groupId: string, participant: string){
        const [response] = await this.client.groupParticipantsUpdate(groupId, [participant], "demote")
        return response
    }
}