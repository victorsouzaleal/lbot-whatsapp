import { Group } from "../interfaces/group.interface.js";
import { GroupMetadata } from 'baileys'
import { waLib } from "../libraries/library.js";
import DataStore from "@seald-io/nedb";
import { ParticipantService } from "./participant.service.js";

const db = new DataStore<Group>({filename : './storage/groups.db', autoload: true})

export class GroupService {
    private participantService

    constructor() {
        this.participantService = new ParticipantService()
    }

    public async registerGroup(groupMetadata : GroupMetadata){
        const group = await this.getGroup(groupMetadata.id)

        if (group) return

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
            antilink : { status: false, exceptions: []},
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

    public async rebuildGroups() {
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
                muted : oldGroupData.muted ?? false,
                welcome : { 
                    status: oldGroupData.welcome?.status ?? false,
                    msg: oldGroupData.welcome?.msg ?? '' 
                },
                antifake : { 
                    status:  oldGroupData.antifake?.status ?? false, 
                    allowed: oldGroupData.antifake?.allowed ?? [] 
                },
                antilink : {
                    status: oldGroupData.antilink?.status ?? false,
                    exceptions: oldGroupData.antilink?.exceptions ?? []
                },
                antiflood : { 
                    status: oldGroupData.antiflood?.status ?? false, 
                    max_messages: oldGroupData.antiflood?.max_messages ?? 10, 
                    interval: oldGroupData.antiflood?.interval ?? 10
                },
                autosticker : oldGroupData.autosticker ?? false,
                block_cmds : oldGroupData.block_cmds ?? [],
                blacklist : oldGroupData.blacklist ?? [],
                word_filter: oldGroupData.word_filter ?? []
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
            const group = await this.getGroup(groupMeta.id)

            if (group){ // Se o grupo já estiver registrado sincronize os dados do grupo e os participantes.
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

    public async updatePartialGroup(group: Partial<GroupMetadata>) {
        if (group.id){
            if (group.desc) await this.setDescription(group.id, group.desc)
            else if (group.subject) await this.setName(group.id, group.subject)
            else if (group.announce) await this.setRestricted(group.id, group.announce)
            else if (group.ephemeralDuration) await this.setExpiration(group.id, group.ephemeralDuration)
        }
    }

    public async getGroup(groupId : string){
        const group = await db.findOneAsync({id: groupId}) as Group | null
        return group
    }

    public async getAllGroups(){
        const groups = await db.findAsync({}) as Group[]
        return groups
    }

    public async removeGroup(groupId: string){
        await this.participantService.removeParticipants(groupId)
        await db.removeAsync({id: groupId}, {multi: true})
    }

    public async setName(groupId: string, name: string){
        await db.updateAsync({id: groupId}, { $set : { name } })
    }

    public async setRestricted(groupId: string, restricted: boolean){
        await db.updateAsync({id: groupId}, { $set: { restricted } })
    }

    private async setExpiration(groupId: string, expiration: number | undefined){
        await db.updateAsync({id: groupId}, { $set: { expiration } })
    }

    public async setDescription(groupId: string, description?: string){
        await db.updateAsync({id: groupId}, { $set: { description } })
    }

    public async incrementGroupCommands(groupId: string){
        await db.updateAsync({id : groupId}, {$inc: {commands_executed: 1}})
    } 

    public async addWordFilter(groupId: string, word: string){
        await db.updateAsync({id: groupId}, { $push: { word_filter : word }})
    }

    public async removeWordFilter(groupId: string, word: string){
        await db.updateAsync({id: groupId}, { $pull: { word_filter : word }})
    }

    public async setWelcome(groupId: string, status: boolean, msg: string){
        await db.updateAsync({id : groupId}, { $set: { "welcome.status": status, "welcome.msg":msg }})
    }

    public async setAntifake(groupId: string, status: boolean, allowed: string[]){
        await db.updateAsync({id: groupId}, {$set: { "antifake.status": status, "antifake.allowed": allowed }})
    }

    public async setMuted(groupId: string, status: boolean){
        await db.updateAsync({id: groupId}, {$set: { muted : status}})
    }

    public async setAntilink(groupId: string, status: boolean, exceptions?: string[]){
        await db.updateAsync({id : groupId}, { $set: { 'antilink.status': status, 'antilink.exceptions': exceptions ?? []} })
    }

    public async setAutosticker(groupId: string, status: boolean){
        await db.updateAsync({id: groupId}, { $set: { autosticker: status } })
    }

    public async setAntiFlood(groupId: string, status: boolean, maxMessages: number, interval: number){
        await db.updateAsync({id : groupId}, { $set: { 'antiflood.status' : status, 'antiflood.max_messages' : maxMessages, 'antiflood.interval' : interval } })
    }

    public async addBlackList(groupId: string, userId: string){
        await db.updateAsync({id: groupId}, { $push: { blacklist: userId } })
    }

    public async removeBlackList(groupId: string, userId: string){
        await db.updateAsync({id: groupId}, { $pull: { blacklist: userId } } )
    }

    public async blockCommands(groupId: string, prefix: string, commands: string[]) {
        const group = await this.getGroup(groupId)
        const commandsWithoutPrefix = commands.map(command => waLib.removePrefix(prefix, command))
        const blockCommands = commandsWithoutPrefix.filter(command => !group?.block_cmds.includes(command))
        await db.updateAsync({id: groupId}, { $push: { block_cmds: { $each: blockCommands } } })
        return blockCommands.map(command => prefix+command)
    }

    public async unblockCommands(groupId: string, prefix: string, commands: string[]) {
        const group = await this.getGroup(groupId)
        const commandsWithoutPrefix = commands.map(command => waLib.removePrefix(prefix, command))
        const unblockCommands = commandsWithoutPrefix.filter(command => group?.block_cmds.includes(command))
        await db.updateAsync({id: groupId}, { $pull: { block_cmds: { $in: unblockCommands }} })
        return unblockCommands.map(command => prefix+command)
    }
}