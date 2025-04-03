import { GroupMetadata } from "baileys"
import { GroupService } from "../services/group.service.js"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message, MessageTypes } from "../interfaces/message.interface.js"

export class GroupController {
    private groupService

    constructor(){
        this.groupService = new GroupService()
    }

    // *********************** OBTER DADOS DO GRUPO ***********************
    public getGroup(groupId: string) {
        return this.groupService.getGroup(groupId)
    }

    public isRegistered(groupId: string) {
        return this.groupService.isRegistered(groupId)
    }

    public getOwner(groupId: string) {
        return this.groupService.getOwner(groupId)
    }

    public isRestricted(groupId: string) {
        return this.groupService.isRestricted(groupId)
    }

    public getAllGroups() {
        return this.groupService.getAllGroups()
    }

    // *********************** REGISTRA/REMOVE/ATUALIZA GRUPOS ***********************
    public registerGroup(group : GroupMetadata) {
        return this.groupService.registerGroup(group)
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

    // *********************** PARTICIPANTES/ADMINS ***********************
    public getParticipant(groupId: string, userId: string){
        return this.groupService.getParticipant(groupId, userId)
    }

    public getParticipants(groupId: string){
        return this.groupService.getParticipants(groupId)
    }

    public getParticipantsIds(groupId: string){
        return this.groupService.getParticipantsIds(groupId)
    }

    public getAdmins(groupId: string) {
        return this.groupService.getAdmins(groupId)
    }

    public getAdminsIds(groupId: string) {
        return this.groupService.getAdminsIds(groupId)
    }
    
    public isParticipant(groupId: string, userId: string) {
        return this.groupService.isParticipant(groupId, userId)
    }

    public addParticipant(groupId: string, userId: string, isAdmin = false) {
        return this.groupService.addParticipant(groupId, userId, isAdmin)
    }

    public addAdmin(groupId: string, userId: string) {
        return this.groupService.addAdmin(groupId, userId)
    }

    public removeAdmin(groupId: string, userId: string) {
        return this.groupService.removeAdmin(groupId, userId)
    }

    public isAdmin(groupId: string, userId: string) {
        return this.groupService.isAdmin(groupId, userId)
    }

    public removeParticipant(groupId: string, userId: string) {
        return this.groupService.removeParticipant(groupId, userId)
    }

    public getParticipantsActivityLowerThan(group: Group, num: number) {
        return this.groupService.getParticipantActivityLowerThan(group, num)
    }

    public getParticipantsActivityRanking(group: Group, num: number){
        return this.groupService.getParticipantsActivityRanking(group, num)
    }

    public incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes, isCommand: boolean){
        return this.groupService.incrementParticipantActivity(groupId, userId, type, isCommand)
    }

    public addWarning(groupId: string, userId: string){
        return this.groupService.addWarning(groupId, userId)
    }

    public removeWarning(groupId: string, userId: string, currentWarnings: number){
        return this.groupService.removeWarning(groupId, userId, currentWarnings)
    }

    public removeParticipantsWarnings(groupId: string){
        return this.groupService.removeParticipantsWarnings(groupId)
    }

    // *********************** Recursos do grupo ***********************

    // ***** FILTRO DE PALAVRAS *****
    public addWordFilter(groupId: string, word: string){
        return this.groupService.addWordFilter(groupId, word)
    }

    public removeWordFilter(groupId: string, word: string){
        return this.groupService.removeWordFilter(groupId, word)
    }

    // ***** BEM VINDO *****
    public setWelcome(groupId: string, status: boolean, message = '') {
        return this.groupService.setWelcome(groupId, status, message)
    }

    public getWelcomeMessage(group: Group, botInfo: Bot, userId: string){
        return this.groupService.getWelcomeMessage(group, botInfo, userId)
    }

    // ***** ANTI-LINK *****
    public setAntiLink(groupId: string, status = true) {
        return this.groupService.setAntilink(groupId, status)
    }

    // ***** AUTO-STICKER *****
    public setAutoSticker(groupId: string, status = true) {
        return this.groupService.setAutosticker(groupId, status)
    }

    // ***** ANTI-FAKE *****
    public setAntiFake(groupId: string, status = true, allowed : string[]) {
        return this.groupService.setAntifake(groupId, status, allowed)
    }

    public isNumberFake(group: Group, userId: string){
        return this.groupService.isNumberFake(group, userId)
    }

    // ***** MUTAR GRUPO *****
    public setMuted(groupId: string, status = true) {
        return this.groupService.setMuted(groupId, status)
    }

    // ***** ANTI-FLOOD *****
    public setAntiFlood(groupId: string, status = true, maxMessages = 10, interval = 10) {
        return this.groupService.setAntiFlood(groupId, status, maxMessages, interval)
    }

    public isFlood(group: Group, userId: string, isGroupAdmin: boolean){
        return this.groupService.isFlood(group, userId, isGroupAdmin)
    }

    // ***** LISTA-NEGRA *****
    public getBlackList(groupId: string) {
        return this.groupService.getBlackList(groupId)
    }

    public addBlackList(groupId: string, userId: string) {
        return this.groupService.addBlackList(groupId, userId)
    }

    public removeBlackList(groupId: string, userId: string) {
        return this.groupService.removeBlackList(groupId, userId)
    }

    public isBlackListed(groupId: string, userId: string){
        return this.groupService.isBlackListed(groupId, userId)
    }

    // ***** BLOQUEAR/DESBLOQUEAR COMANDOS *****
    public blockCommands(group: Group, commands: string[], botInfo: Bot) {
        return this.groupService.blockCommands(group, commands, botInfo)
    }

    public unblockCommands(group: Group, commands: string[], botInfo: Bot) {
        return this.groupService.unblockCommand(group, commands, botInfo)
    }

    public isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        return this.groupService.isBlockedCommand(group, command, botInfo)
    }
}