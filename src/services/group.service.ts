import { Group } from "../interfaces/group.interface.js";
import { GroupMetadata } from 'baileys'
import { waLib } from "../libraries/library.js";
import DataStore from "@seald-io/nedb";
import { ParticipantService } from "./participant.service.js";
import { deepMerge } from "../utils/general.util.js";

const db = new DataStore<Group>({filename : './storage/groups.db', autoload: true})

export class GroupService {
    private participantService

    private defaultGroup: Group = {
        id: '',
        name: '',
        description: undefined,
        commands_executed: 0,
        owner: undefined,
        restricted: false,
        expiration: undefined,
        muted: false,
        welcome: { 
            status: false, 
            msg: '' 
        },
        antifake: { 
            status: false, 
            exceptions: {
                prefixes: ['55'],
                numbers: []
            }
        },
        antilink: { 
            status: false, 
            exceptions: [] 
        },
        antiflood: { 
            status: false, 
            max_messages: 10, 
            interval: 10 
        },
        auto_reply: {
            status: false,
            config: [],
        },
        autosticker: false,
        block_cmds: [],
        blacklist: [],
        word_filter: []
    }

    constructor() {
        this.participantService = new ParticipantService()
    }

    public async registerGroup(groupMetadata : GroupMetadata){
        const group = await this.getGroup(groupMetadata.id)

        if (group) return

        const groupData : Group = {
            ...this.defaultGroup,
            id: groupMetadata.id,
            name: groupMetadata.subject,
            description: groupMetadata.desc,
            owner: groupMetadata.owner,
            restricted: groupMetadata.announce,
            expiration: groupMetadata.ephemeralDuration
        }

        const newGroup = await db.insertAsync(groupData) as Group

        for (let participant of groupMetadata.participants) {
            const isAdmin = (participant.admin) ? true : false
            await this.participantService.addParticipant(groupMetadata.id, participant.id, isAdmin)
        }

        return newGroup
    }

    public async migrateGroups() {
        const groups = await this.getAllGroups()

        for (const group of groups) {
            const oldGroupData = group as any
            const updatedGroupData: Group = deepMerge(this.defaultGroup, oldGroupData)
            await db.updateAsync({ id: group.id }, { $set: updatedGroupData }, { upsert: true })
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

    public setAutoReply(groupdId: string, status: boolean){
        return db.updateAsync({id: groupdId}, {$set: { "auto_reply.status": status}})
    }

    public addReply(groupdId: string, word: string, reply: string){
        return db.updateAsync({id: groupdId}, { $push: { "auto_reply.config" : { word, reply } }})
    }

    public removeReply(groupdId: string, word: string, reply: string){
        return db.updateAsync({id: groupdId}, { $pull: { "auto_reply.config" : { word, reply } }})
    }

    public setAntifake(groupId: string, status: boolean){
        return db.updateAsync({id: groupId}, {$set: { "antifake.status": status}})
    }

    public addFakePrefixException(groupId: string, numberPrefix: string){
        return db.updateAsync({id: groupId}, { $push: { "antifake.exceptions.prefixes" : numberPrefix }})
    }

    public addFakeNumberException(groupId: string, userNumber: string){
        return db.updateAsync({id: groupId}, { $push: { "antifake.exceptions.numbers" : userNumber }})
    }

    public removeFakePrefixException(groupId: string, numberPrefix: string){
        return db.updateAsync({id: groupId}, { $pull: { "antifake.exceptions.prefixes" : numberPrefix }})
    }

    public removeFakeNumberException(groupId: string, userNumber: string){
        return db.updateAsync({id: groupId}, { $pull: { "antifake.exceptions.numbers" : userNumber }})
    }

    public async setMuted(groupId: string, status: boolean){
        await db.updateAsync({id: groupId}, {$set: { muted : status}})
    }

    public setAntilink(groupId: string, status: boolean){
        return db.updateAsync({id: groupId}, { $set: { 'antilink.status': status} })
    }

    public addLinkException(groupId: string, exception: string){
        return db.updateAsync({id: groupId}, { $push: { "antilink.exceptions" : exception }})
    }

    public removeLinkException(groupId: string, exception: string){
        return db.updateAsync({id: groupId}, { $pull: { "antilink.exceptions" : exception }})
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