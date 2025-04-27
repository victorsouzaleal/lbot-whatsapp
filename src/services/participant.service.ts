import { Participant, Group } from "../interfaces/group.interface.js";
import { MessageTypes } from "../interfaces/message.interface.js";
import { deepMerge, timestampToDate } from '../utils/general.util.js'
import moment from 'moment-timezone'
import DataStore from "@seald-io/nedb";
import { GroupMetadata } from "baileys";

const db = new DataStore<Participant>({filename : './storage/participants.groups.db', autoload: true})

export class ParticipantService {
    private defaultParticipant : Participant = {
        group_id : '',
        user_id: '',
        registered_since: timestampToDate(moment.now()),
        commands: 0,
        admin: false,
        msgs: 0,
        image: 0,
        audio: 0,
        sticker: 0,
        video: 0,
        text: 0,
        other: 0,
        warnings: 0,
        antiflood : {
            expire: 0,
            msgs: 0
        }
    }

    public async syncParticipants(groupMeta: GroupMetadata){
        //Adiciona participantes no banco de dados que entraram enquanto o bot estava off.
        groupMeta.participants.forEach(async (participant) => {
            const isAdmin = (participant.admin) ? true : false
            const isGroupParticipant = await this.isGroupParticipant(groupMeta.id, participant.id)

            if (!isGroupParticipant) {
                await this.addParticipant(groupMeta.id, participant.id, isAdmin)
            } else {
                await db.updateAsync({group_id: groupMeta.id, user_id: participant.id}, { $set: { admin: isAdmin }})
            }
        })

        //Remove participantes do banco de dados que sairam do grupo enquanto o bot estava off.
        const currentParticipants = await this.getParticipantsFromGroup(groupMeta.id)

        currentParticipants.forEach(async (participant) => {
            if(!groupMeta.participants.find(groupMetaParticipant => groupMetaParticipant.id == participant.user_id)) {
                await this.removeParticipant(groupMeta.id, participant.user_id)
            }
        })
    }

    public async addParticipant(groupId: string, userId: string, isAdmin: boolean){
        const isGroupParticipant = await this.isGroupParticipant(groupId, userId)

        if (isGroupParticipant) return
        
        const participant : Participant = {
            ...this.defaultParticipant,
            group_id : groupId,
            user_id: userId,
            admin: isAdmin
        }

        await db.insertAsync(participant)
    }

    public async migrateParticipants() {
        const participants = await this.getAllParticipants()

        for (let participant of participants) {
            const oldParticipantData = participant as any
            const updatedParticipantData : Participant =  deepMerge(this.defaultParticipant, oldParticipantData)
            await db.updateAsync({ group_id: participant.group_id, user_id: participant.user_id }, { $set: updatedParticipantData }, { upsert: true })
        }
    }

    public async removeParticipant(groupId: string, userId: string){
        await db.removeAsync({group_id: groupId, user_id: userId}, {})
    }

    public async removeParticipants(groupId: string){
        await db.removeAsync({group_id: groupId}, {multi: true})
    }

    public async addAdmin(groupId: string, userId: string){
        const isGroupAdmin = await this.isGroupAdmin(groupId, userId)

        if (!isGroupAdmin) {
            await db.updateAsync({group_id : groupId, user_id: userId}, { $set: { admin: true }})
        }
    }

    public async removeAdmin(groupId: string, userId: string){
        const isGroupAdmin = await this.isGroupAdmin(groupId, userId)

        if (isGroupAdmin) {
            await db.updateAsync({group_id : groupId, user_id: userId}, { $set: { admin: false }})
        }
    }

    public async getParticipantFromGroup(groupId: string, userId: string){
        const participant = await db.findOneAsync({group_id: groupId, user_id: userId}) as Participant | null
        return participant
    }

    public async getParticipantsFromGroup(groupId: string){
        const participants = await db.findAsync({group_id: groupId}) as Participant[]
        return participants
    }

    public async getAllParticipants() {
        const participants = await db.findAsync({}) as Participant[]
        return participants
    }

    public async getParticipantsIdsFromGroup(groupId: string){
        const participants = await this.getParticipantsFromGroup(groupId)
        return participants.map(participant => participant.user_id)
    }

    public async getAdminsFromGroup(groupId: string){
        const admins = await db.findAsync({group_id: groupId, admin: true}) as Participant[]
        return admins
    }

    public async getAdminsIdsFromGroup(groupId: string){
        const admins = await db.findAsync({group_id: groupId, admin: true}) as Participant[]
        return admins.map(admin => admin.user_id)
    }

    public async isGroupParticipant(groupId: string, userId: string){
        const participantsIds = await this.getParticipantsIdsFromGroup(groupId)
        return participantsIds.includes(userId)
    }

    public async isGroupAdmin(groupId: string, userId: string){
        const adminsIds = await this.getAdminsIdsFromGroup(groupId)
        return adminsIds.includes(userId)
    }

    public async incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes, isCommand: boolean){
        let incrementedUser : {
            msgs: number,
            commands?: number,
            text?: number,
            image?: number,
            video?: number,
            sticker?: number,
            audio?: number,
            other?: number
        } = { msgs: 1 }

        if (isCommand) incrementedUser.commands = 1
        
        switch (type) {
            case "conversation":
            case "extendedTextMessage":
                incrementedUser.text = 1
                break
            case "imageMessage":
                incrementedUser.image = 1
                break
            case "videoMessage":
                incrementedUser.video = 1
                break
            case "stickerMessage":
                incrementedUser.sticker = 1
                break
            case "audioMessage":
                incrementedUser.audio = 1
                break
            case "documentMessage":
                incrementedUser.other = 1
                break
        }

        await db.updateAsync({group_id : groupId, user_id: userId}, {$inc: incrementedUser})
    }  

    public async getParticipantActivityLowerThan(group: Group, num : number){
        const inactives = await db.findAsync({group_id : group.id, msgs: {$lt: num}}).sort({msgs: -1}) as Participant[]
        return inactives
    }

    public async getParticipantsActivityRanking(group: Group, qty: number){
        let participantsLeaderboard = await db.findAsync({group_id : group.id}).sort({msgs: -1}) as Participant[]
        const qty_leaderboard = (qty > participantsLeaderboard.length) ? participantsLeaderboard.length : qty
        return participantsLeaderboard.splice(0, qty_leaderboard)
    }

    public async addWarning(groupId: string, userId: string){
        await db.updateAsync({group_id: groupId, user_id: userId}, { $inc: { warnings: 1} })
    }

    public async removeWarning(groupId: string, userId: string, currentWarnings: number){
        await db.updateAsync({group_id: groupId, user_id: userId}, { $set: { warnings: --currentWarnings} })
    }

    public async removeParticipantsWarnings(groupId: string){
        await db.updateAsync({group_id: groupId}, { $set: { warnings: 0} })
    }

    public async expireParticipantAntiFlood(groupId: string, userId: string, newExpireTimestamp: number){
        await db.updateAsync({group_id: groupId, user_id: userId}, { $set : { 'antiflood.expire': newExpireTimestamp, 'antiflood.msgs': 1 } })
    }

    public async incrementAntiFloodMessage(groupId: string, userId: string){
        await db.updateAsync({group_id: groupId, user_id: userId}, { $inc : { 'antiflood.msgs': 1 } })
    }
}