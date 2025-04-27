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

    public addWordFilter(groupId: string, word: string){
        return this.groupService.addWordFilter(groupId, word)
    }

    public removeWordFilter(groupId: string, word: string){
        return this.groupService.removeWordFilter(groupId, word)
    }

    public setWelcome(groupId: string, status: boolean, message = '') {
        return this.groupService.setWelcome(groupId, status, message)
    }

    public setAntiLink(groupId: string, status: boolean, exceptions?: string[]) {
        return this.groupService.setAntilink(groupId, status, exceptions)
    }

    public setAutoSticker(groupId: string, status = true) {
        return this.groupService.setAutosticker(groupId, status)
    }

    public setAntiFake(groupId: string, status = true, allowed : string[]) {
        return this.groupService.setAntifake(groupId, status, allowed)
    }

    public setMuted(groupId: string, status = true) {
        return this.groupService.setMuted(groupId, status)
    }

    public setAntiFlood(groupId: string, status = true, maxMessages = 10, interval = 10) {
        return this.groupService.setAntiFlood(groupId, status, maxMessages, interval)
    }

    public addBlackList(groupId: string, userId: string) {
        return this.groupService.addBlackList(groupId, userId)
    }

    public removeBlackList(groupId: string, userId: string) {
        return this.groupService.removeBlackList(groupId, userId)
    }

    public blockCommands(groupId: string, prefix: string, commands: string[]) {
        return this.groupService.blockCommands(groupId, prefix, commands)
    }

    public unblockCommands(groupId: string, prefix: string, commands: string[]) {
        return this.groupService.unblockCommands(groupId, prefix, commands)
    }

    // ***** Participantes *****
    public addParticipant(groupId: string, userId: string, isAdmin = false) {
        return this.participantService.addParticipant(groupId, userId, isAdmin)
    }

    public removeParticipant(groupId: string, userId: string) {
        return this.participantService.removeParticipant(groupId, userId)
    }

    public addAdmin(groupId: string, userId: string) {
        return this.participantService.addAdmin(groupId, userId)
    }

    public removeAdmin(groupId: string, userId: string) {
        return this.participantService.removeAdmin(groupId, userId)
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