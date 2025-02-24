import { GroupMetadata, WASocket, ParticipantAction } from "baileys"
import { GroupService } from "../services/GroupService.js"
import { Bot, Group, Message, MessageTypes } from "../modules/interfaces.js"

export class GroupController {
    private groupService

    constructor(){
        this.groupService = new GroupService()
    }

    // *********************** Get group data ***********************

    public async getGroup(idGroup: string) {
        return await this.groupService.getGroup(idGroup)
    }

    async isRegistered(idGroup: string) {
        return await this.groupService.isRegistered(idGroup)
    }

    async getAdmins(idGroup: string) {
        return await this.groupService.getAdmins(idGroup)
    }

    async getOwner(idGroup: string) {
        return await this.groupService.getOwner(idGroup)
    }

    async isRestricted(idGroup: string) {
        return await this.groupService.isRestricted(idGroup)
    }

    async getParticipants(idGroup: string) {
        return await this.groupService.getParticipants(idGroup)
    }

    async getAllGroups() {
        return await this.groupService.getAllGroups()
    }

    // *********************** Register/Remove/Update groups ***********************
    async registerGroup(group : GroupMetadata) {
        return await this.groupService.setGroup(group)
    }

    async setNameGroup(idGroup: string, name: string) {
        return await this.groupService.setName(idGroup, name)
    }

    async setRestrictedGroup(idGroup: string, status: boolean) {
        return await this.groupService.setRestricted(idGroup, status)
    }

    async registerGroups(groups: GroupMetadata[]) {
        return await this.groupService.setGroups(groups)
    }

    async updateGroup(group: GroupMetadata) {
        return await this.groupService.updateGroup(group)
    }

    async updateGroups(groups: GroupMetadata[]){
        return await this.groupService.updateGroups(groups)
    }

    async updatePartialGroup(group: Partial<GroupMetadata>){
        return await this.groupService.updatePartialGroup(group)
    }

    async removeGroup(idGroup: string) {
        return await this.groupService.removeGroup(idGroup)
    }

    // *********************** Add/Update/Remove participants and admins. ***********************
    async isParticipant(idGroup: string, idUser: string) {
        return await this.groupService.isParticipant(idGroup, idUser)
    }

    async addParticipant(idGroup: string, idUser: string) {
        return await this.groupService.addParticipant(idGroup, idUser)
    }

    async addAdmin(idGroup: string, idUser: string) {
        return await this.groupService.addAdmin(idGroup, idUser)
    }

    async removeAdmin(idGroup: string, idUser: string) {
        await this.groupService.removeAdmin(idGroup, idUser)
    }

    async isAdmin(idGroup: string, idUser: string) {
        return this.groupService.isAdmin(idGroup, idUser)
    }

    async removeParticipant(idGroup: string, idUser: string) {
        return this.groupService.removeParticipant(idGroup, idUser)
    }

    // *********************** Group features ***********************

    // ***** Welcome *****
    async setWelcome(idGroup: string, status: boolean, message = '') {
        return await this.groupService.setWelcome(idGroup, status, message)
    }

    async getWelcomeMessage(group: Group, botInfo: Bot, idUser: string){
        return await this.groupService.getWelcomeMessage(group, botInfo, idUser)
    }

    // ***** Antilink *****
    async setAntilink(idGroup: string, status = true) {
        return await this.groupService.setAntilink(idGroup, status)
    }

    async isMessageWithLink(message: Message, group: Group, botInfo: Bot){
        return await this.groupService.isMessageWithLink(message, group, botInfo)
    }

    // ***** Autosticker *****
    async setAutosticker(idGroup: string, status = true) {
        return await this.groupService.setAutosticker(idGroup, status)
    }

    // ***** Antifake *****
    async setAntifake(idGroup: string, status = true, allowed : string[]) {
        return await this.groupService.setAntifake(idGroup, status, allowed)
    }

    async isNumberFake(group: Group, idUser: string){
        return await this.groupService.isNumberFake(group, idUser)
    }

    // ***** Mute *****
    async setMuted(idGroup: string, status = true) {
        return await this.groupService.setMuted(idGroup, status)
    }

    // ***** Antiflood *****
    async setAntiflood(idGroup: string, status = true, maxMessages = 10, interval = 10) {
        return await this.groupService.setAntiflood(idGroup, status, maxMessages, interval)
    }

    async isFloodMessage(group: Group, idUser: string){
        return await this.groupService.isFloodMessage(group, idUser)
    }

    // ***** Blacklist *****
    async getBlackList(idGroup: string) {
        return await this.groupService.getBlackList(idGroup)
    }

    async addBlackList(idGroup: string, idUser: string) {
        return await this.groupService.addBlackList(idGroup, idUser)
    }

    async removeBlackList(idGroup: string, idUser: string) {
        return await this.groupService.removeBlackList(idGroup, idUser)
    }

    async isBlackListed(idGroup: string, idUser: string){
        return await this.groupService.isBlackListed(idGroup, idUser)
    }

    // ***** Block/Unblock Commands *****
    async blockCommands(group: Group, commands: string[], botInfo: Bot) {
        return await this.groupService.blockCommands(group, commands, botInfo)
    }

    async unblockCommands(group: Group, commands: string[], botInfo: Bot) {
        return await this.groupService.unblockCommand(group, commands, botInfo)
    }

    async isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        return await this.groupService.isBlockedCommand(group, command, botInfo)
    }

    // ***** Activity/Counter *****
    async setCounter(idGroup: string, status = true) {
        return await this.groupService.setCounter(idGroup, status)
    }

    async removeGroupCounter(idGroup: string) {
        return await this.groupService.removerGroupCounter(idGroup)
    }

    async registerParticipantActivity(idGroup: string, idUser: string){
        return await this.groupService.setParticipantActivity(idGroup, idUser)
    }

    async getParticipantActivity(idGroup: string, idUser: string) {
        return await this.groupService.getParticipantActivity(idGroup, idUser)
    }

    async getParticipantsActivityLowerThan(group: Group, num: number) {
        return await this.groupService.getParticipantActivityLowerThan(group, num)
    }

    async getParticipantsActivityLeadership(group: Group, num: number){
        return await this.groupService.getParticipantsActivityLeaderboard(group, num)
    }

    async getAllParticipantsActivity(idGroup: string) {
        return await this.groupService.getAllParticipantsActivity(idGroup)
    }

    async incrementParticipantActivity(idGroup: string, idUser: string, type: MessageTypes){
        return await this.groupService.incrementParticipantActivity(idGroup, idUser, type)
    }
}