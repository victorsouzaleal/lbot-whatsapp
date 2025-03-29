import { Participant, Group, ParticipantAntiFlood } from "../interfaces/group.interface.js";
import { Bot } from "../interfaces/bot.interface.js";
import { CategoryCommand } from "../interfaces/command.interface.js";
import { Message, MessageTypes } from "../interfaces/message.interface.js";
import { GroupMetadata, GroupParticipant } from 'baileys'
import { timestampToDate, buildText } from '../utils/general.util.js'
import moment from 'moment-timezone'
import getBotTexts from "../utils/bot.texts.util.js";
import { commandsGroup } from "../commands/group.list.commands.js";
import { commandExist, getCommandsByCategory } from "../utils/commands.util.js";
import { waLib } from "../libraries/library.js";
import DataStore from "@seald-io/nedb";


const db = {
    groups : new DataStore<Group>({filename : './storage/groups.db', autoload: true}),
    participants : new DataStore<Participant>({filename : './storage/participants.groups.db', autoload: true})
}

export class GroupService {
    // *********************** Registra/Atualiza/Remove grupos ***********************
    public async registerGroup(groupMetadata : GroupMetadata){
        const isRegistered = await this.isRegistered(groupMetadata.id)

        if (isRegistered) return

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

        const newGroup = await db.groups.insertAsync(groupData) as Group

        groupMetadata.participants.forEach( async(participant) => {
            const isAdmin = (participant.admin) ? true : false
            await this.addParticipant(newGroup.id, participant.id, isAdmin)
        })
    }

    public async syncGroups(groupsMeta: GroupMetadata[]){
        //Deletando grupos em que o bot não está mais
        const currentGroups = await this.getAllGroups()
        currentGroups.forEach(async (group) => {
            if (!groupsMeta.find(groupMeta => groupMeta.id == group.id)) await this.removeGroup(group.id)
        })
        
        //Atualizando grupos em que o bot está
        for (let groupMeta of groupsMeta) {
            const isRegistered = await this.isRegistered(groupMeta.id)

            if(isRegistered){ // Se o grupo já estiver registrado sincronize os dados do grupo e os participantes.
                await db.groups.updateAsync({ id : groupMeta.id }, { $set: {
                    name: groupMeta.subject,
                    description: groupMeta.desc,
                    owner: groupMeta.owner,
                    restricted: groupMeta.announce,
                    expiration: groupMeta.ephemeralDuration
                }})
    
                //Adiciona participantes no banco de dados que entraram enquanto o bot estava off.
                groupMeta.participants.forEach(async (participant) => {
                    const isAdmin = (participant.admin) ? true : false
                    const isParticipant = await this.isParticipant(groupMeta.id, participant.id)
                    if (!isParticipant) await this.addParticipant(groupMeta.id, participant.id, isAdmin)
                    else await db.participants.updateAsync({group_id: groupMeta.id, user_id: participant.id}, { $set: {admin: isAdmin}})
                })
    
                //Remove participantes do banco de dados que sairam do grupo enquanto o bot estava off.
                const currentParticipants = await this.getParticipants(groupMeta.id)
    
                currentParticipants.forEach(async (participant) => {
                    if(!groupMeta.participants.find(groupMetaParticipant => groupMetaParticipant.id == participant.user_id)) await this.removeParticipant(groupMeta.id, participant.user_id)
                })
            } else { // Se o grupo não estiver registrado, faça o registro.
                await this.registerGroup(groupMeta)
            }
        }
    }

    public updatePartialGroup(group: Partial<GroupMetadata>) {
        if (group.id){
            if (group.desc) return this.setDescription(group.id, group.desc)
            if (group.subject) return this.setName(group.id, group.subject)
            if (group.announce) return this.setRestricted(group.id, group.announce)
            if (group.ephemeralDuration) return this.setExpiration(group.id, group.ephemeralDuration)
        }
    }

    public async getGroup(groupId : string){
        const group = await db.groups.findOneAsync({id: groupId}) as Group | null
        return group
    }

    public async removeGroup(groupId: string){
        return db.groups.removeAsync({id: groupId}, {multi: true})
    }

    public async getAllGroups(){
        const groups = await db.groups.findAsync({}) as Group[]
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
        return db.groups.updateAsync({id: groupId}, { $set : { name } })
    }

    public setRestricted(groupId: string, restricted: boolean){
        return db.groups.updateAsync({id: groupId}, { $set: { restricted } })
    }

    private setExpiration(groupId: string, expiration: number | undefined){
        return db.groups.updateAsync({id: groupId}, { $set: { expiration } })
    }

    public setDescription(groupId: string, description?: string){
        return db.groups.updateAsync({id: groupId}, { $set: { description } })
    }

    public incrementGroupCommands(groupId: string){
        return db.groups.updateAsync({id : groupId}, {$inc: {commands_executed: 1}})
    } 

    public async getOwner(groupId: string){
        const group = await this.getGroup(groupId)
        return group?.owner
    }

    // ***** Participantes *****
    public async addParticipant(groupId: string,  userId: string, isAdmin = false){
        const isParticipant = await this.isParticipant(groupId, userId)

        if (isParticipant) return

        const participant : Participant = {
            group_id : groupId,
            user_id: userId,
            registered_since: timestampToDate(moment.now()),
            commands: 0,
            admin: isAdmin,
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

        return db.participants.insertAsync(participant)
    }

    public async removeParticipant(groupId: string, userId: string){
        return db.participants.removeAsync({group_id: groupId, user_id: userId}, {})
    }

    public async addAdmin(groupId: string, userId: string){
        const isAdmin = await this.isAdmin(groupId, userId)
        if (!isAdmin) return db.participants.updateAsync({group_id : groupId, user_id: userId}, { $set: { admin: true }})
    }

    public async removeAdmin(groupId: string, userId: string){
        const isAdmin = await this.isAdmin(groupId, userId)
        if (isAdmin) return db.groups.updateAsync({group_id : groupId, user_id: userId}, { $set: { admin: false }})
    }

    public async getParticipant(groupId: string, userId: string){
        const participant = await db.participants.findOneAsync({group_id: groupId, user_id: userId}) as Participant | null
        return participant
    }

    public async getParticipants(groupId: string){
        const participants = await db.participants.findAsync({group_id: groupId}) as Participant[]
        return participants
    }

    public async getParticipantsIds(groupId: string){
        const participants = await this.getParticipants(groupId)
        return participants.map(participant => participant.user_id)
    }

    public async getAdmins(groupId: string){
        const admins = await db.participants.findAsync({group_id: groupId, admin: true}) as Participant[]
        return admins
    }

    public async getAdminsIds(groupId: string){
        const admins = await db.participants.findAsync({group_id: groupId, admin: true}) as Participant[]
        return admins.map(admin => admin.user_id)
    }

    public async isParticipant(groupId: string, userId: string){
        const participantsIds = await this.getParticipantsIds(groupId)
        return participantsIds.includes(userId)
    }

    public async isAdmin(groupId: string, userId: string){
        const adminsIds = await this.getAdminsIds(groupId)
        return adminsIds.includes(userId)
    }

    public incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes, isCommand: boolean){
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

        if(isCommand) incrementedUser.commands = 1

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

        return db.participants.updateAsync({group_id : groupId, user_id: userId}, {$inc: incrementedUser})
    }  

    public async getParticipantActivityLowerThan(group: Group, num : number){
        const inactives = await db.participants.findAsync({group_id : group.id, msgs: {$lt: num}}).sort({msgs: -1}) as Participant[]
        return inactives
    }

    public async getParticipantsActivityRanking(group: Group, qty: number){
        let participantsLeaderboard = await db.participants.findAsync({group_id : group.id}).sort({msgs: -1}) as Participant[]
        const qty_leaderboard = (qty > participantsLeaderboard.length) ? participantsLeaderboard.length : qty
        return participantsLeaderboard.splice(0, qty_leaderboard)
    }

    public async addWarning(groupId: string, userId: string){
        return db.participants.updateAsync({group_id: groupId, user_id: userId}, { $inc: { warnings: 1} })
    }

    // *********************** RECURSOS DO GRUPO ***********************

    // ***** BEM-VINDO *****
    public setWelcome(groupId: string, status: boolean, msg: string){
        return db.groups.updateAsync({id : groupId}, { $set: { "welcome.status": status, "welcome.msg":msg }})
    }

    public getWelcomeMessage(group: Group, botInfo: Bot, userId: string){
        const botTexts = getBotTexts(botInfo)
        const custom_message = (group.welcome.msg != "") ? group.welcome.msg + "\n\n" : ""
        const message_welcome = buildText(botTexts.group_welcome_message, waLib.removeWhatsappSuffix(userId), group.name, custom_message)
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
        const groupAdmins = await this.getAdminsIds(group.id)
        const isBotAdmin = groupAdmins.includes(botInfo.host_number)

        if (!group?.antilink) return false

        if (!isBotAdmin) {
            await this.setAntilink(group.id, false)
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
        return db.groups.updateAsync({id : groupId}, { $set: { 'antiflood.status' : status, 'antiflood.max_messages' : maxMessages, 'antiflood.interval' : interval } })
    }

    private async hasExpiredMessages(group: Group, participant: Participant, currentTimestamp: number){
        if (group && currentTimestamp > participant.antiflood.expire){
            const expireTimestamp = currentTimestamp + group?.antiflood.interval
            await db.participants.updateAsync({group_id: group.id, user_id: participant.user_id}, { $set : { 'antiflood.expire': expireTimestamp, 'antiflood.msgs': 1 } })
            return true
        } else {
            await db.participants.updateAsync({group_id: group.id, user_id: participant.user_id}, { $inc : { 'antiflood.msgs': 1 } })
            return false
        }
    }

    public async isFlood(group: Group, userId: string, isGroupAdmin: boolean){
        const currentTimestamp = Math.round(moment.now()/1000)
        const participant = await this.getParticipant(group.id, userId)
        let isFlood = false

        if(!participant || isGroupAdmin) return false

        const hasExpiredMessages = await this.hasExpiredMessages(group, participant, currentTimestamp)

        if (!hasExpiredMessages && participant.antiflood.msgs >= group.antiflood.max_messages) {
            isFlood = true
        } else {
            isFlood = false
        }
        
        return isFlood
    }

    // ***** LISTA-NEGRA *****
    public async getBlackList(groupId: string){
        const group = await this.getGroup(groupId)
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
        const groupCommands = commandsGroup(botInfo)
        let blockedCommands : string[] = []
        let blockResponse = groupCommands.bcmd.msgs.reply_title
        let categories : CategoryCommand[]  = ['sticker', 'utility', 'download', 'misc']

        if (commands[0] == 'variado') commands[0] = 'misc'
        if (commands[0] == 'utilidade') commands[0] = 'utility'

        if (categories.includes(commands[0] as CategoryCommand)) commands = getCommandsByCategory(botInfo, commands[0] as CategoryCommand)

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

        if (blockedCommands.length != 0) await db.groups.updateAsync({id : group.id}, { $push: { block_cmds: { $each: blockedCommands } } })

        return blockResponse
    }

    public async unblockCommand(group: Group, commands: string[], botInfo: Bot){
        const groupCommands = commandsGroup(botInfo)
        const { prefix } = botInfo
        let unblockedCommands : string[] = []
        let unblockResponse = groupCommands.dcmd.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'misc']

        if (commands[0] == 'todos') commands[0] = 'all'
        if (commands[0] == 'utilidade') commands[0] = 'utility'
        if (commands[0] == 'variado') commands[0] = 'misc'

        if (categories.includes(commands[0])) {
            if (commands[0] === 'all') commands = group.block_cmds.map(command => prefix + command)
            else commands = getCommandsByCategory(botInfo, commands[0] as CategoryCommand)
        }

        for (let command of commands) {
            if (group.block_cmds.includes(waLib.removePrefix(prefix, command))) {
                unblockedCommands.push(waLib.removePrefix(prefix, command))
                unblockResponse += buildText(groupCommands.dcmd.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(groupCommands.dcmd.msgs.reply_item_not_blocked, command)
            }
        }

        if (unblockedCommands.length != 0) await db.groups.updateAsync({id : group.id}, { $pull: { block_cmds: { $in: unblockedCommands }} })

        return unblockResponse
    }

    public isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        const {prefix} = botInfo
        return group.block_cmds.includes(waLib.removePrefix(prefix, command))
    }


}