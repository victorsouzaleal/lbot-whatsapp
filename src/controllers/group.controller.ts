import { GroupMetadata, WASocket, ParticipantAction } from "baileys"
import { GroupService } from "../services/group.service.js"
import { Bot } from "../interfaces/bot.interface.js"
import { Group } from "../interfaces/group.interface.js"
import { Message, MessageTypes } from "../interfaces/message.interface.js"

export class GroupController {
    private groupService

    constructor(){
        this.groupService = new GroupService()
    }

    // *********************** Obter dados do grupo ***********************
    getGroup(groupId: string) {
        return this.groupService.getGroup(groupId)
    }

    isRegistered(groupId: string) {
        return this.groupService.isRegistered(groupId)
    }

    getAdmins(groupId: string) {
        return this.groupService.getAdmins(groupId)
    }

    getOwner(groupId: string) {
        return this.groupService.getOwner(groupId)
    }

    isRestricted(groupId: string) {
        return this.groupService.isRestricted(groupId)
    }

    getParticipants(groupId: string) {
        return this.groupService.getParticipants(groupId)
    }

    getAllGroups() {
        return this.groupService.getAllGroups()
    }

    // *********************** Registra/Remove/Atualiza grupos ***********************
    registerGroup(group : GroupMetadata) {
        return this.groupService.registerGroup(group)
    }

    setNameGroup(groupId: string, name: string) {
        return this.groupService.setName(groupId, name)
    }

    setRestrictedGroup(groupId: string, status: boolean) {
        return this.groupService.setRestricted(groupId, status)
    }

    registerGroups(groups: GroupMetadata[]) {
        return this.groupService.registerGroups(groups)
    }

    updateGroup(group: GroupMetadata) {
        return this.groupService.updateGroup(group)
    }

    updateGroups(groups: GroupMetadata[]){
        return this.groupService.updateGroups(groups)
    }

    updatePartialGroup(group: Partial<GroupMetadata>){
        return this.groupService.updatePartialGroup(group)
    }

    removeGroup(groupId: string) {
        return this.groupService.removeGroup(groupId)
    }

    incrementGroupCommands(groupId: string){
        return this.groupService.incrementGroupCommands(groupId)
    }

    // *********************** Adiciona/Atualiza/Remove participantes e admins. ***********************
    isParticipant(groupId: string, userId: string) {
        return this.groupService.isParticipant(groupId, userId)
    }

    addParticipant(groupId: string, userId: string) {
        return this.groupService.addParticipant(groupId, userId)
    }

    addAdmin(groupId: string, userId: string) {
        return this.groupService.addAdmin(groupId, userId)
    }

    removeAdmin(groupId: string, userId: string) {
        return this.groupService.removeAdmin(groupId, userId)
    }

    isAdmin(groupId: string, userId: string) {
        return this.groupService.isAdmin(groupId, userId)
    }

    removeParticipant(groupId: string, userId: string) {
        return this.groupService.removeParticipant(groupId, userId)
    }

    // *********************** Recursos do grupo ***********************

    // ***** Bem Vindo *****
    setWelcome(groupId: string, status: boolean, message = '') {
        return this.groupService.setWelcome(groupId, status, message)
    }

    getWelcomeMessage(group: Group, botInfo: Bot, userId: string){
        return this.groupService.getWelcomeMessage(group, botInfo, userId)
    }

    // ***** Antilink *****
    setAntilink(groupId: string, status = true) {
        return this.groupService.setAntilink(groupId, status)
    }

    isMessageWithLink(message: Message, group: Group, botInfo: Bot){
        return this.groupService.isMessageWithLink(message, group, botInfo)
    }

    // ***** Autosticker *****
    setAutosticker(groupId: string, status = true) {
        return this.groupService.setAutosticker(groupId, status)
    }

    // ***** Antifake *****
    setAntifake(groupId: string, status = true, allowed : string[]) {
        return this.groupService.setAntifake(groupId, status, allowed)
    }

    isNumberFake(group: Group, userId: string){
        return this.groupService.isNumberFake(group, userId)
    }

    // ***** Mutar *****
    setMuted(groupId: string, status = true) {
        return this.groupService.setMuted(groupId, status)
    }

    // ***** Antiflood *****
    setAntiflood(groupId: string, status = true, maxMessages = 10, interval = 10) {
        return this.groupService.setAntiflood(groupId, status, maxMessages, interval)
    }

    isFloodMessage(group: Group, userId: string){
        return this.groupService.isFloodMessage(group, userId)
    }

    // ***** Lista negra *****
    getBlackList(groupId: string) {
        return this.groupService.getBlackList(groupId)
    }

    addBlackList(groupId: string, userId: string) {
        return this.groupService.addBlackList(groupId, userId)
    }

    removeBlackList(groupId: string, userId: string) {
        return this.groupService.removeBlackList(groupId, userId)
    }

    isBlackListed(groupId: string, userId: string){
        return this.groupService.isBlackListed(groupId, userId)
    }

    // ***** Bloquear/Desbloquear comandos *****
    blockCommands(group: Group, commands: string[], botInfo: Bot) {
        return this.groupService.blockCommands(group, commands, botInfo)
    }

    unblockCommands(group: Group, commands: string[], botInfo: Bot) {
        return this.groupService.unblockCommand(group, commands, botInfo)
    }

    isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        return this.groupService.isBlockedCommand(group, command, botInfo)
    }

    // ***** Atividade/Contador *****
    setCounter(groupId: string, status = true) {
        return this.groupService.setCounter(groupId, status)
    }

    removeGroupCounter(groupId: string) {
        return this.groupService.removerGroupCounter(groupId)
    }

    registerParticipantActivity(groupId: string, userId: string){
        return this.groupService.setParticipantActivity(groupId, userId)
    }

    getParticipantActivity(groupId: string, userId: string) {
        return this.groupService.getParticipantActivity(groupId, userId)
    }

    getParticipantsActivityLowerThan(group: Group, num: number) {
        return this.groupService.getParticipantActivityLowerThan(group, num)
    }

    getParticipantsActivityLeadership(group: Group, num: number){
        return this.groupService.getParticipantsActivityLeaderboard(group, num)
    }

    getAllParticipantsActivity(groupId: string) {
        return this.groupService.getAllParticipantsActivity(groupId)
    }

    incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes){
        return this.groupService.incrementParticipantActivity(groupId, userId, type)
    }
}