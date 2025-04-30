import { GroupMetadata } from "baileys"
import { GroupService } from "../services/group.service.js"
import { Group } from "../interfaces/group.interface.js"
import { MessageTypes } from "../interfaces/message.interface.js"
import { ParticipantService } from "../services/participant.service.js"

export class GroupController {
    private groupService
    private participantService

    constructor(){
        this.groupService = new GroupService()
        this.participantService = new ParticipantService()
    }

    // ***** Grupo *****
    public registerGroup(group : GroupMetadata) {
        return this.groupService.registerGroup(group)
    }

    public migrateGroups() {
        return this.groupService.migrateGroups()
    }

    public getGroup(groupId: string) {
        return this.groupService.getGroup(groupId)
    }

    public getAllGroups() {
        return this.groupService.getAllGroups()
    }

    public setNameGroup(groupId: string, name: string) {
        return this.groupService.setName(groupId, name)
    }

    public setRestrictedGroup(groupId: string, status: boolean) {
        return this.groupService.setRestricted(groupId, status)
    }

    public syncGroups(groups: GroupMetadata[]){
        return this.groupService.syncGroups(groups)
    }

    public updatePartialGroup(group: Partial<GroupMetadata>){
        return this.groupService.updatePartialGroup(group)
    }

    public removeGroup(groupId: string) {
        return this.groupService.removeGroup(groupId)
    }

    public incrementGroupCommands(groupId: string){
        return this.groupService.incrementGroupCommands(groupId)
    }

    public async setWordFilter(groupId: string, word: string, operation: 'add' | 'remove'){
        return this.groupService.setWordFilter(groupId, word, operation)
    }

    public setWelcome(groupId: string, status: boolean, message = '') {
        return this.groupService.setWelcome(groupId, status, message)
    }

    public setAutoReply(groupId: string, status: boolean){
        return this.groupService.setAutoReply(groupId, status)
    }

    public async setReplyConfig(groupId: string, word: string, reply: string, operation: 'add' | 'remove') {
        return this.groupService.setReplyConfig(groupId, word, reply, operation)
    }

    public setAntiLink(groupId: string, status: boolean) {
        return this.groupService.setAntilink(groupId, status)
    }

    public async setLinkException(groupId: string, exception: string, operation: 'add' | 'remove'){
        return this.groupService.setLinkException(groupId, exception, operation)
    }

    public setAutoSticker(groupId: string, status = true) {
        return this.groupService.setAutosticker(groupId, status)
    }

    public setAntiFake(groupId: string, status: boolean) {
        return this.groupService.setAntifake(groupId, status)
    }

    public async setFakePrefixException(groupId: string, numberPrefix: string, operation: 'add' | 'remove'){
        return this.groupService.setFakePrefixException(groupId, numberPrefix, operation)
    }

    public async setFakeNumberException(groupId: string, userNumber: string, operation: 'add' | 'remove'){
        return this.groupService.setFakeNumberException(groupId, userNumber, operation)
    }

    public setMuted(groupId: string, status = true) {
        return this.groupService.setMuted(groupId, status)
    }

    public setAntiFlood(groupId: string, status = true, maxMessages = 10, interval = 10) {
        return this.groupService.setAntiFlood(groupId, status, maxMessages, interval)
    }

    public async setBlacklist(groupId: string, userId: string, operation: 'add' | 'remove'){
        return this.groupService.setBlacklist(groupId, userId, operation)
    }

    public async setBlockedCommands(groupId: string, prefix: string, commands: string[], operation: 'add' | 'remove'){
        return this.groupService.setBlockedCommands(groupId, prefix, commands, operation)
    }

    // ***** Participantes *****
    public addParticipant(groupId: string, userId: string, isAdmin = false) {
        return this.participantService.addParticipant(groupId, userId, isAdmin)
    }

    public removeParticipant(groupId: string, userId: string) {
        return this.participantService.removeParticipant(groupId, userId)
    }

    public async setAdmin(groupId: string, userId: string, status: boolean){
        return this.participantService.setAdmin(groupId, userId, status)
    }

    public migrateParticipants(){
        return this.participantService.migrateParticipants()
    }

    public getParticipant(groupId: string, userId: string){
        return this.participantService.getParticipantFromGroup(groupId, userId)
    }

    public getParticipants(groupId: string){
        return this.participantService.getParticipantsFromGroup(groupId)
    }

    public getParticipantsIds(groupId: string){
        return this.participantService.getParticipantsIdsFromGroup(groupId)
    }

    public getAdmins(groupId: string) {
        return this.participantService.getAdminsFromGroup(groupId)
    }

    public getAdminsIds(groupId: string) {
        return this.participantService.getAdminsIdsFromGroup(groupId)
    }
    
    public isParticipant(groupId: string, userId: string) {
        return this.participantService.isGroupParticipant(groupId, userId)
    }

    public isParticipantAdmin(groupId: string, userId: string) {
        return this.participantService.isGroupAdmin(groupId, userId)
    }

    public getParticipantsActivityLowerThan(group: Group, num: number) {
        return this.participantService.getParticipantActivityLowerThan(group, num)
    }

    public getParticipantsActivityRanking(group: Group, num: number){
        return this.participantService.getParticipantsActivityRanking(group, num)
    }

    public incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes, isCommand: boolean){
        return this.participantService.incrementParticipantActivity(groupId, userId, type, isCommand)
    }

    public addParticipantWarning(groupId: string, userId: string){
        return this.participantService.addWarning(groupId, userId)
    }

    public removeParticipantWarning(groupId: string, userId: string, currentWarnings: number){
        return this.participantService.removeWarning(groupId, userId, currentWarnings)
    }

    public removeParticipantsWarnings(groupId: string){
        return this.participantService.removeParticipantsWarnings(groupId)
    }

    public async expireParticipantAntiFlood(groupId: string, userId: string, newExpireTimestamp: number){
        return this.participantService.expireParticipantAntiFlood(groupId, userId, newExpireTimestamp)
    }

    public async incrementAntiFloodMessage(groupId: string, userId: string){
        return this.participantService.incrementAntiFloodMessage(groupId, userId)
    }
}