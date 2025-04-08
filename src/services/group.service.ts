import { Group } from "../interfaces/group.interface.js";
import { Bot } from "../interfaces/bot.interface.js";
import { CategoryCommand } from "../interfaces/command.interface.js";
import { GroupMetadata } from 'baileys'
import { buildText } from '../utils/general.util.js'
import { commandsGroup } from "../commands/group.list.commands.js";
import { commandExist, getCommandsByCategory } from "../utils/commands.util.js";
import { waLib } from "../libraries/library.js";
import DataStore from "@seald-io/nedb";
import { ParticipantService } from "./participant.service.js";

const db = new DataStore<Group>({filename : './storage/groups.db', autoload: true})

export class GroupService {
    private participantService

    constructor() {
        this.participantService = new ParticipantService()
    }

    // *********************** Registra/Atualiza/Remove grupos ***********************
    public async registerGroup(groupMetadata : GroupMetadata){
        const isRegistered = await this.isRegistered(groupMetadata.id)

        if (isRegistered) {
            return
        }

        const groupData : Group = {
            id: groupMetadata.id,
            name: groupMetadata.subject,
            description: groupMetadata.desc,
            commands_executed: 0,
            owner: groupMetadata.owner,
            restricted: groupMetadata.announce,
            expiration: groupMetadata.ephemeralDuration,
            muted : false,
            welcome : { status: false, msg: '' },
            antifake : { status: false, allowed: [] },
            antilink : false,
            antiflood : { status: false, max_messages: 10, interval: 10},
            autosticker : false,
            block_cmds : [],
            blacklist : [],
            word_filter: []
        }

        const newGroup = await db.insertAsync(groupData) as Group

        for (let participant of groupMetadata.participants) {
            const isAdmin = (participant.admin) ? true : false
            await this.participantService.addParticipant(groupMetadata.id, participant.id, isAdmin)
        }

        return newGroup
    }

    public async rebuildGroupsDatabase() {
        const groups = await this.getAllGroups()

        for (let group of groups) {
            const oldGroupData = group as any
            const updatedGroupData : Group = {
                id: oldGroupData.id,
                name: oldGroupData.name,
                description : oldGroupData.description,
                commands_executed: oldGroupData.commands_executed,
                owner: oldGroupData.owner,
                restricted: oldGroupData.restricted,
                expiration: oldGroupData.expiration,
                muted : oldGroupData.muted ? oldGroupData.muted : false,
                welcome : oldGroupData.welcome ? oldGroupData.welcome : { status: false, msg: '' },
                antifake : oldGroupData.antifake ? oldGroupData.antifake : { status: false, allowed: [] },
                antilink : oldGroupData.antilink ? oldGroupData.antilink : false,
                antiflood : oldGroupData.antiflood ? oldGroupData.antiflood : { status: false, max_messages: 10, interval: 10},
                autosticker : oldGroupData.autosticker ? oldGroupData.autosticker : false,
                block_cmds : oldGroupData.block_cmds ? oldGroupData.block_cmds : [],
                blacklist : oldGroupData.blacklist ? oldGroupData.blacklist : [],
                word_filter: oldGroupData.word_filter ? oldGroupData.word_filter : []
            }

            await db.removeAsync({id: group.id}, {})
            await db.insertAsync(updatedGroupData)
        }
    }

    public async syncGroups(groupsMeta: GroupMetadata[]){
        //Deletando grupos em que o bot não está mais
        const currentGroups = await this.getAllGroups()
        currentGroups.forEach(async (group) => {
            if (!groupsMeta.find(groupMeta => groupMeta.id == group.id)) {
                await this.removeGroup(group.id)
            }
        })
        
        //Atualizando grupos em que o bot está
        for (let groupMeta of groupsMeta) {
            const isRegistered = await this.isRegistered(groupMeta.id)

            if (isRegistered){ // Se o grupo já estiver registrado sincronize os dados do grupo e os participantes.
                await db.updateAsync({ id : groupMeta.id }, { $set: {
                    name: groupMeta.subject,
                    description: groupMeta.desc,
                    owner: groupMeta.owner,
                    restricted: groupMeta.announce,
                    expiration: groupMeta.ephemeralDuration
                }})

                await this.participantService.syncParticipants(groupMeta)
    
            } else { // Se o grupo não estiver registrado, faça o registro.
                await this.registerGroup(groupMeta)
            }
        }
    }

    public updatePartialGroup(group: Partial<GroupMetadata>) {
        if (group.id){
            if (group.desc) {
                return this.setDescription(group.id, group.desc)
            } else if (group.subject) {
                return this.setName(group.id, group.subject)
            } else if (group.announce) {
                return this.setRestricted(group.id, group.announce)
            } else if (group.ephemeralDuration) {
                return this.setExpiration(group.id, group.ephemeralDuration)
            }
        }
    }

    public async getGroup(groupId : string){
        const group = await db.findOneAsync({id: groupId}) as Group | null
        return group
    }

    public async removeGroup(groupId: string){
        await this.participantService.removeParticipants(groupId)
        return db.removeAsync({id: groupId}, {multi: true})
    }

    public async getAllGroups(){
        const groups = await db.findAsync({}) as Group[]
        return groups
    }

    public async isRegistered(groupId: string) {
        const group = await this.getGroup(groupId)
        return (group != null)
    }

    public async isRestricted(groupId: string) {
        const group = await this.getGroup(groupId)
        return group?.restricted
    }

    public setName(groupId: string, name: string){
        return db.updateAsync({id: groupId}, { $set : { name } })
    }

    public setRestricted(groupId: string, restricted: boolean){
        return db.updateAsync({id: groupId}, { $set: { restricted } })
    }

    private setExpiration(groupId: string, expiration: number | undefined){
        return db.updateAsync({id: groupId}, { $set: { expiration } })
    }

    public setDescription(groupId: string, description?: string){
        return db.updateAsync({id: groupId}, { $set: { description } })
    }

    public incrementGroupCommands(groupId: string){
        return db.updateAsync({id : groupId}, {$inc: {commands_executed: 1}})
    } 

    public async getOwner(groupId: string){
        const group = await this.getGroup(groupId)
        return group?.owner
    }

    // *********************** RECURSOS DO GRUPO ***********************
    // ***** FILTRO DE PALAVRAS *****
    public addWordFilter(groupId: string, word: string){
        return db.updateAsync({id: groupId}, { $push: { word_filter : word }})
    }

    public removeWordFilter(groupId: string, word: string){
        return db.updateAsync({id: groupId}, { $pull: { word_filter : word }})
    }

    // ***** BEM-VINDO *****
    public setWelcome(groupId: string, status: boolean, msg: string){
        return db.updateAsync({id : groupId}, { $set: { "welcome.status": status, "welcome.msg":msg }})
    }

    // ***** ANTI-FAKE *****
    public setAntifake(groupId: string, status: boolean, allowed: string[]){
        return db.updateAsync({id: groupId}, {$set: { "antifake.status": status, "antifake.allowed": allowed }})
    }

    public isNumberFake(group: Group, userId: string){
        const allowedPrefixes = group.antifake.allowed
        for(let numberPrefix of allowedPrefixes){
            if (userId.startsWith(numberPrefix)) {
                return false
            }
        }
        return true
    }

    // ***** MUTAR GRUPO *****
    public setMuted(groupId: string, status: boolean){
        return db.updateAsync({id: groupId}, {$set: { muted : status}})
    }

    // ***** ANTI-LINK *****
    public setAntilink(groupId: string, status: boolean){
        return db.updateAsync({id : groupId}, { $set: { antilink: status } })
    }

    // ***** AUTO-STICKER *****
    public setAutosticker(groupId: string, status: boolean){
        return db.updateAsync({id: groupId}, { $set: { autosticker: status } })
    }

    // ***** ANTI-FLOOD *****
    public async setAntiFlood(groupId: string, status: boolean, maxMessages: number, interval: number){
        return db.updateAsync({id : groupId}, { $set: { 'antiflood.status' : status, 'antiflood.max_messages' : maxMessages, 'antiflood.interval' : interval } })
    }

    // ***** LISTA-NEGRA *****
    public async getBlackList(groupId: string){
        const group = await this.getGroup(groupId)
        return group?.blacklist || []
    }

    public addBlackList(groupId: string, userId: string){
        return db.updateAsync({id: groupId}, { $push: { blacklist: userId } })
    }

    public removeBlackList(groupId: string, userId: string){
        return db.updateAsync({id: groupId}, { $pull: { blacklist: userId } } )
    }

    public async isBlackListed(groupId: string, userId: string){
        const list = await this.getBlackList(groupId)
        return list.includes(userId)
    }

    // ***** BLOQUEAR/DESBLOQUEAR COMANDOS *****
    public async blockCommands(group: Group, commands : string[], botInfo: Bot){
        const { prefix } = botInfo
        const groupCommands = commandsGroup(botInfo)
        let blockedCommands : string[] = []
        let blockResponse = groupCommands.bcmd.msgs.reply_title
        let categories : CategoryCommand[]  = ['sticker', 'utility', 'download', 'misc']

        if (commands[0] == 'variado') {
            commands[0] = 'misc'
        } else if (commands[0] == 'utilidade') {
            commands[0] = 'utility'
        } 
        
        if (categories.includes(commands[0] as CategoryCommand)) {
            commands = getCommandsByCategory(botInfo, commands[0] as CategoryCommand)
        }

        for (let command of commands) {
            if (commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'misc') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')) {
                if (group.block_cmds.includes(waLib.removePrefix(prefix, command))) {
                    blockResponse += buildText(groupCommands.bcmd.msgs.reply_item_already_blocked, command)
                } else {
                    blockedCommands.push(waLib.removePrefix(prefix, command))
                    blockResponse += buildText(groupCommands.bcmd.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info')) {
                blockResponse += buildText(groupCommands.bcmd.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(groupCommands.bcmd.msgs.reply_item_not_exist, command)
            }
        }

        if (blockedCommands.length != 0) {
            await db.updateAsync({id : group.id}, { $push: { block_cmds: { $each: blockedCommands } } })
        }

        return blockResponse
    }

    public async unblockCommand(group: Group, commands: string[], botInfo: Bot){
        const groupCommands = commandsGroup(botInfo)
        const { prefix } = botInfo
        let unblockedCommands : string[] = []
        let unblockResponse = groupCommands.dcmd.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'misc']

        if (commands[0] == 'todos') {
            commands[0] = 'all'
        } else if (commands[0] == 'utilidade') {
            commands[0] = 'utility'
        } else if (commands[0] == 'variado') {
            commands[0] = 'misc'
        } 
        
        if (categories.includes(commands[0])) {
            if (commands[0] === 'all') {
                commands = group.block_cmds.map(command => prefix + command)
            } else {
                commands = getCommandsByCategory(botInfo, commands[0] as CategoryCommand)
            }
        }

        for (let command of commands) {
            if (group.block_cmds.includes(waLib.removePrefix(prefix, command))) {
                unblockedCommands.push(waLib.removePrefix(prefix, command))
                unblockResponse += buildText(groupCommands.dcmd.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(groupCommands.dcmd.msgs.reply_item_not_blocked, command)
            }
        }

        if (unblockedCommands.length != 0) {
            await db.updateAsync({id : group.id}, { $pull: { block_cmds: { $in: unblockedCommands }} })
        }

        return unblockResponse
    }

    public isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        const {prefix} = botInfo
        return group.block_cmds.includes(waLib.removePrefix(prefix, command))
    }


}