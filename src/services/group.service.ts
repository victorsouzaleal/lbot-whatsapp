import Datastore from "@seald-io/nedb";
import { ParticipantCounter, Group, ParticipantAntiFlood } from "../interfaces/group.interface.js";
import { Bot } from "../interfaces/bot.interface.js";
import { CategoryCommand } from "../interfaces/command.interface.js";
import { Message, MessageTypes } from "../interfaces/message.interface.js";
import { GroupMetadata } from 'baileys'
import { getGroupParticipantsByMetadata, getGroupAdminsByMetadata, timestampToDate, commandExist, buildText } from '../lib/util.js'
import moment from 'moment-timezone'
import getCommands from '../commands/list.commands.js'
import getGeneralMessages from "../lib/general-messages.js";

const db = {
    groups : new Datastore({filename : './storage/groups.db', autoload: true}),
    group_antiflood : new Datastore({filename : './storage/group.antiflood.db', autoload: true}),
    group_counter : new Datastore({filename : './storage/group.counter.db', autoload: true})
}

export class GroupService {
    constructor(){}
    
    // *********************** Register/Remove/Update groups ***********************
    public async registerGroup(group : GroupMetadata){
        const isRegistered = await this.isRegistered(group.id)

        if (isRegistered) return

        const participants = getGroupParticipantsByMetadata(group)
        const admins = getGroupAdminsByMetadata(group)
        const groupData : Group = {
            id: group.id,
            name: group.subject,
            description: group.desc,
            commands_executed: 0,
            participants,
            admins,
            owner: group.owner,
            restricted: group.announce,
            muted : false,
            welcome : { status: false, msg: '' },
            antifake : { status: false, allowed: [] },
            antilink : false,
            antiflood : { status: false, max_messages: 10, interval: 10},
            autosticker : false,
            counter : { status: false, started: '' },
            block_cmds : [],
            blacklist : []
        }

        return db.groups.insertAsync(groupData)
    }

    public async registerGroups(groups: GroupMetadata[]) {
        for (let group of groups) await this.registerGroup(group)
    }

    public updateGroup(group : GroupMetadata){
        const participants = getGroupParticipantsByMetadata(group)
        const admins = getGroupAdminsByMetadata(group)
        return db.groups.updateAsync({ id : group.id }, { $set: {
            name: group.subject,
            description: group.desc,
            participants,
            admins,
            owner: group.owner,
            restricted: group.announce
        }})
    }

    public async updateGroups(groups: GroupMetadata[]){
        for (let group of groups) await this.updateGroup(group)
    }

    public updatePartialGroup(group: Partial<GroupMetadata>) {
        if (group.id){
            if (group.desc) return this.setDescription(group.id, group.desc)
            if (group.subject) return this.setName(group.id, group.subject)
            if (group.announce) return this.setRestricted(group.id, group.announce)
        }
    }

    public async getGroup(groupId : string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        return doc as Group | null
    }

    public async removeGroup(groupId: string){
        return db.groups.removeAsync({id: groupId}, {multi: true})
    }

    public async getAllGroups(){
        const doc : unknown = await db.groups.findAsync({})
        return doc as Group[]
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
        return db.groups.updateAsync({id: groupId}, { $set : { name } })
    }

    public setRestricted(groupId: string, restricted: boolean){
        return db.groups.updateAsync({id: groupId}, { $set: { restricted } })
    }

    public setDescription(groupId: string, description?: string){
        return db.groups.updateAsync({id: groupId}, { $set: { description } })
    }

    public incrementGroupCommands(groupId: string){
        return db.groups.updateAsync({id : groupId}, {$inc: {commands_executed: 1}})
    } 

    // *********************** Add/Update/Remove participants and admins. ***********************
    public async getParticipants(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        const group = doc as Group | null
        return group?.participants ?? []
    }

    public async isParticipant(groupId: string, userId: string){
        const participants = await this.getParticipants(groupId)
        return participants.includes(userId)
    }

    public async getAdmins(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        const group = doc as Group | null
        return group?.admins ?? []
    }

    public async isAdmin(groupId: string, userId: string){
        const admins = await this.getAdmins(groupId)
        return admins.includes(userId)
    }

    public async getOwner(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        const group = doc as Group | null
        return group?.owner
    }

    public async addParticipant(groupId: string, userId: string){
        const isParticipant = await this.isParticipant(groupId, userId)
        if (!isParticipant) return db.groups.updateAsync({id : groupId}, { $push: { participants: userId } })
    }

    public async removeParticipant(groupId: string, userId: string){
        const isParticipant = await this.isParticipant(groupId, userId)
        if (isParticipant) {
            await db.groups.updateAsync({id : groupId}, { $pull: { participants : userId } })
            return this.removeAdmin(groupId, userId)
        }  
    }

    public async addAdmin(groupId: string, userId: string){
        const isAdmin = await this.isAdmin(groupId, userId)
        if (!isAdmin) return db.groups.updateAsync({id : groupId}, { $push: { admins: userId} })
    }

    public async removeAdmin(groupId: string, userId: string){
        const isAdmin = await this.isAdmin(groupId, userId)
        if (isAdmin) return db.groups.updateAsync({id : groupId}, { $pull: { admins : userId } })
    }

    // *********************** RECURSOS DO GRUPO ***********************

    // ***** BEM-VINDO *****
    public setWelcome(groupId: string, status: boolean, msg: string){
        return db.groups.updateAsync({id : groupId}, { $set: { "welcome.status": status, "welcome.msg":msg }})
    }

    public getWelcomeMessage(group: Group, botInfo: Bot, userId: string){
        const generalMessages = getGeneralMessages(botInfo)
        const custom_message = (group.welcome.msg != "") ? group.welcome.msg + "\n\n" : ""
        const message_welcome = buildText(generalMessages.group_welcome_message, userId.replace("@s.whatsapp.net", ""), group.name, custom_message)
        return message_welcome
    }

    // ***** ANTI-FAKE *****
    public setAntifake(groupId: string, status: boolean, allowed: string[]){
        return db.groups.updateAsync({id: groupId}, {$set: { "antifake.status": status, "antifake.allowed": allowed }})
    }

    public isNumberFake(group: Group, userId: string){
        const allowedPrefixes = group.antifake.allowed
        for(let numberPrefix of allowedPrefixes){
            if (userId.startsWith(numberPrefix)) return false
        }
        return true
    }

    // ***** MUTAR GRUPO *****
    public setMuted(groupId: string, status: boolean){
        return db.groups.updateAsync({id: groupId}, {$set: { muted : status}})
    }

    // ***** ANTI-LINK *****
    public setAntilink(groupId: string, status: boolean){
        return db.groups.updateAsync({id : groupId}, { $set: { antilink: status } })
    }

    public async isMessageWithLink(message: Message, group: Group, botInfo : Bot){
        const { body, caption, isGroupAdmin} = message
        const userText = body || caption
        const { id, admins } = group
        const isBotAdmin = admins.includes(botInfo.host_number)

        if (!group?.antilink) return false

        if (!isBotAdmin) {
            await this.setAntilink(id, false)
        } else {
            if (userText) {
                const isUrl = userText.match(new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img))
                if (isUrl && !isGroupAdmin) return true
            }
        }

        return false
    }

    // ***** AUTO-STICKER *****
    public setAutosticker(groupId: string, status: boolean){
        return db.groups.updateAsync({id: groupId}, { $set: { autosticker: status } })
    }

    // ***** ANTI-FLOOD *****
    public async setAntiFlood(groupId: string, status: boolean, maxMessages: number, interval: number){
        if (!status) await this.removeGroupAntiFlood(groupId)
        return db.groups.updateAsync({id : groupId}, { $set:{ 'antiflood.status' : status, 'antiflood.max_messages' : maxMessages, 'antiflood.interval' : interval } })
    }

    public async isFlood(group: Group, userId: string){
        const currentTimestamp = Math.round(moment.now()/1000)
        const participantAntiFlood = await this.getParticipantAntiFlood(group.id, userId)
        let isFlood = false

        if (participantAntiFlood){
            const hasExpiredMessages = await this.hasExpiredMessages(group, participantAntiFlood, currentTimestamp)

            if (!hasExpiredMessages && participantAntiFlood.msgs >= group.antiflood.max_messages) {
                if (group.admins.includes(userId)) isFlood = false
                else isFlood = true
            } else {
                isFlood = false
            }
        } else {
            await this.registerParticipantAntiFlood(group, userId)
        }
    
        return isFlood
    }

    private removeGroupAntiFlood(groupId: string){
        return db.group_antiflood.removeAsync({group_id: groupId}, {multi: true})
    }

    private async registerParticipantAntiFlood(group: Group, userId: string){
        const isRegistered = (await this.getParticipantAntiFlood(group.id, userId)) ? true : false

        if (isRegistered) return 

        const timestamp = Math.round(moment.now()/1000)

        const participantAntiFlood : ParticipantAntiFlood = {
            user_id: userId,
            group_id: group.id,
            expire: timestamp + group.antiflood.interval,
            msgs: 1
        }

        return db.group_antiflood.insertAsync(participantAntiFlood)
    }

    private async getParticipantAntiFlood(groupId: string, userId: string){
        const doc : unknown = await db.group_antiflood.findOneAsync({group_id: groupId, user_id: userId})
        const participantAntiFlood = doc as ParticipantAntiFlood | null
        return participantAntiFlood
    }

    private async hasExpiredMessages(group: Group, participantAntiFlood: ParticipantAntiFlood, currentTimestamp: number){
        if (group && currentTimestamp > participantAntiFlood.expire){
            const expireTimestamp = currentTimestamp + group?.antiflood.interval
            await db.group_antiflood.updateAsync({group_id: participantAntiFlood.group_id, user_id: participantAntiFlood.user_id}, { $set : { expire: expireTimestamp, msgs: 1 } })
            return true
        } else {
            await db.group_antiflood.updateAsync({group_id: participantAntiFlood.group_id, user_id: participantAntiFlood.user_id}, { $inc : { msgs: 1 } })
            return false
        }
    }

    // ***** LISTA-NEGRA *****
    public async getBlackList(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id : groupId})
        const group = doc as Group | null
        return group?.blacklist || []
    }

    public addBlackList(groupId: string, userId: string){
        return db.groups.updateAsync({id: groupId}, { $push: { blacklist: userId } })
    }

    public removeBlackList(groupId: string, userId: string){
        return db.groups.updateAsync({id: groupId}, { $pull: { blacklist: userId } } )
    }

    public async isBlackListed(groupId: string, userId: string){
        const list = await this.getBlackList(groupId)
        return list.includes(userId)
    }

    // ***** BLOQUEAR/DESBLOQUEAR COMANDOS *****
    public async blockCommands(group: Group, commands : string[], botInfo: Bot){
        const { prefix } = botInfo
        const commandsData = getCommands(botInfo)
        let blockedCommands : string[] = []
        let blockResponse = commandsData.group.bcmd.msgs.reply_title
        let categories : CategoryCommand[]  = ['sticker', 'utility', 'download', 'fun']

        if (commands[0] == 'diversao') commands[0] = 'fun'
        if (commands[0] == 'utilidade') commands[0] = 'utility'

        if (categories.includes(commands[0] as CategoryCommand)) commands = Object.keys(commandsData[commands[0] as CategoryCommand]).map(command => prefix + command)

        for (let command of commands) {
            if (commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'fun') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')) {
                if (group.block_cmds.includes(command.replace(prefix, ''))) {
                    blockResponse += buildText(commandsData.group.bcmd.msgs.reply_item_already_blocked, command)
                } else {
                    blockedCommands.push(command.replace(prefix, ''))
                    blockResponse += buildText(commandsData.group.bcmd.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info')) {
                blockResponse += buildText(commandsData.group.bcmd.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(commandsData.group.bcmd.msgs.reply_item_not_exist, command)
            }
        }

        if (blockedCommands.length != 0) await db.groups.updateAsync({id : group.id}, { $push: { block_cmds: { $each: blockedCommands } } })

        return blockResponse
    }

    public async unblockCommand(group: Group, commands: string[], botInfo: Bot){
        const commandsData = getCommands(botInfo)
        const { prefix } = botInfo
        let unblockedCommands : string[] = []
        let unblockResponse = commandsData.group.dcmd.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'fun']

        if (commands[0] == 'todos') commands[0] = 'all'
        if (commands[0] == 'utilidade') commands[0] = 'utility'
        if (commands[0] == 'diversao') commands[0] = 'fun'

        if (categories.includes(commands[0])) {
            if (commands[0] === 'all') commands = group.block_cmds.map(command => prefix + command)
            else commands = Object.keys(commandsData[commands[0] as CategoryCommand]).map(command => prefix + command)
        }

        for (let command of commands) {
            if (group.block_cmds.includes(command.replace(prefix, ''))) {
                unblockedCommands.push(command.replace(prefix, ''))
                unblockResponse += buildText(commandsData.group.dcmd.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(commandsData.group.dcmd.msgs.reply_item_not_blocked, command)
            }
        }

        if (unblockedCommands.length != 0) await db.groups.updateAsync({id : group.id}, { $pull: { block_cmds: { $in: unblockedCommands }} })

        return unblockResponse
    }

    public isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        const {prefix} = botInfo
        return group.block_cmds.includes(command.replace(prefix, ''))
    }

    // ***** Activity/Counter *****
    public setCounter(groupId: string, status: boolean){
        const dateNow = (status) ? timestampToDate(moment.now()) : ''
        return db.groups.updateAsync({id: groupId}, { $set:{ "counter.status" : status, "counter.started" : dateNow } })
    }

    public removerGroupCounter(groupId: string){
        return db.group_counter.removeAsync({group_id: groupId}, {multi: true})
    }

    public async getParticipantActivity(groupId: string, userId: string){
        const doc : unknown = await db.group_counter.findOneAsync({group_id: groupId, user_id: userId})
        const counter = doc as ParticipantCounter | null
        return counter
    }

    private async isParticipantActivityRegistered(groupId: string, userId: string){
        const userCounter = await this.getParticipantActivity(groupId, userId)
        return (userCounter != null)
    }

    public async registerParticipantActivity(groupId: string, userId: string){
        const isRegistered = await this.isParticipantActivityRegistered(groupId, userId)

        if (isRegistered) return

        const participantCounter : ParticipantCounter = {
            group_id : groupId,
            user_id: userId,
            msgs: 0,
            image: 0,
            audio: 0,
            sticker: 0,
            video: 0,
            text: 0,
            other: 0
        }

        return db.group_counter.insertAsync(participantCounter)
    }

    public async registerAllParticipantsActivity(groupId: string, participants: string[]){
        participants.forEach(async (participant) =>{
            await this.registerParticipantActivity(groupId, participant)
        })
    }

    public async getAllParticipantsActivity(groupId: string){
        const doc : unknown = await db.group_counter.findAsync({group_id : groupId})
        const counters = doc as ParticipantCounter[]
        return counters
    }

    public incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes){
        let incrementedUser : {msgs: number, text?: number, image?: number, video?: number, sticker?: number,  audio?: number, other?: number} = { msgs: 1 }

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

        return db.group_counter.updateAsync({group_id : groupId, user_id: userId}, {$inc: incrementedUser})
    }  

    public async getParticipantActivityLowerThan(group: Group, num : number){
        let doc: unknown = await db.group_counter.findAsync({group_id : group.id, msgs: {$lt: num}}).sort({msgs: -1})
        const inactives = doc as ParticipantCounter[]
        let inactivesOnGroup : ParticipantCounter[] = []
        inactives.forEach((inactive) => {
            if (group.participants.includes(inactive.user_id)) inactivesOnGroup.push(inactive)
        })
        return inactivesOnGroup
    }

    public async getParticipantsActivityRanking(group: Group, qty: number){
        const doc : unknown = await db.group_counter.findAsync({group_id : group.id}).sort({msgs: -1})
        const participantsLeaderbord = doc as ParticipantCounter[]
        const participantsOnGroup : ParticipantCounter[] = []
        const qty_leaderboard = (qty > participantsLeaderbord.length) ? participantsLeaderbord.length : qty
        for (let i = 0; i < qty_leaderboard; i++) {
            if (group.participants.includes(participantsLeaderbord[i].user_id)) participantsOnGroup.push(participantsLeaderbord[i])
        }
        return participantsOnGroup
    }


}