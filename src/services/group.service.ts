import Datastore from "@seald-io/nedb";
import { AntiSpamMessage, CounterUser, Group } from "../interfaces/group.interface.js";
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
    counter_groups : new Datastore({filename : './storage/counter-groups.db', autoload: true})
}

export class GroupService {
    constructor(){}
    
    // *********************** Register/Remove/Update groups ***********************
    async registerGroup(group : GroupMetadata){
        const isRegistered = await this.isRegistered(group.id)

        if(isRegistered) return

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
            antispam : { status: false, max_messages: 10, interval: 10, messages: [] },
            autosticker : false,
            counter : { status: false, started: '' },
            block_cmds : [],
            blacklist : []
        }

        return db.groups.insertAsync(groupData)
    }

    async registerGroups(groups: GroupMetadata[]) {
        for (let group of groups) await this.registerGroup(group)
    }

    updateGroup(group : GroupMetadata){
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

    async updateGroups(groups: GroupMetadata[]){
        for (let group of groups) await this.updateGroup(group)
    }

    updatePartialGroup(group: Partial<GroupMetadata>) {
        if(group.id){
            if (group.desc) return this.setDescription(group.id, group.desc)
            if (group.subject) return this.setName(group.id, group.subject)
            if (group.announce) return this.setRestricted(group.id, group.announce)
        }
    }

    async getGroup(groupId : string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        return doc as Group | null
    }

    async removeGroup(groupId: string){
        return db.groups.removeAsync({id: groupId}, {multi: true})
    }

    async getAllGroups(){
        const doc : unknown = await db.groups.findAsync({})
        return doc as Group[]
    }

    async isRegistered(groupId: string) {
        const group = await this.getGroup(groupId)
        return (group != null)
    }

    async isRestricted(groupId: string) {
        const group = await this.getGroup(groupId)
        return group?.restricted
    }

    setName(groupId: string, name: string){
        return db.groups.updateAsync({id: groupId}, { $set : { name } })
    }

    setRestricted(groupId: string, restricted: boolean){
        return db.groups.updateAsync({id: groupId}, { $set: { restricted } })
    }

    setDescription(groupId: string, description?: string){
        return db.groups.updateAsync({id: groupId}, { $set: { description } })
    }

    incrementGroupCommands(groupId: string){
        return db.groups.updateAsync({id : groupId}, {$inc: {commands_executed: 1}})
    } 

    // *********************** Add/Update/Remove participants and admins. ***********************
    async getParticipants(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        const group = doc as Group | null
        return group?.participants ?? []
    }

    async isParticipant(groupId: string, userId: string){
        const participants = await this.getParticipants(groupId)
        return participants.includes(userId)
    }

    async getAdmins(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        const group = doc as Group | null
        return group?.admins ?? []
    }

    async isAdmin(groupId: string, userId: string){
        const admins = await this.getAdmins(groupId)
        return admins.includes(userId)
    }

    async getOwner(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id: groupId})
        const group = doc as Group | null
        return group?.owner
    }

    async addParticipant(groupId: string, userId: string){
        const isParticipant = await this.isParticipant(groupId, userId)
        if(!isParticipant) return db.groups.updateAsync({id : groupId}, { $push: { participants: userId } })
    }

    async removeParticipant(groupId: string, userId: string){
        const isParticipant = await this.isParticipant(groupId, userId)
        if(isParticipant) {
            await db.groups.updateAsync({id : groupId}, { $pull: { participants : userId } })
            return this.removeAdmin(groupId, userId)
        }  
    }

    async addAdmin(groupId: string, userId: string){
        const isAdmin = await this.isAdmin(groupId, userId)
        if(!isAdmin) return db.groups.updateAsync({id : groupId}, { $push: { admins: userId} })
    }

    async removeAdmin(groupId: string, userId: string){
        const isAdmin = await this.isAdmin(groupId, userId)
        if(isAdmin) return db.groups.updateAsync({id : groupId}, { $pull: { admins : userId } })
    }

    // *********************** Turn ON/OFF Group features ***********************
    // ***** Welcome *****
    setWelcome(groupId: string, status: boolean, msg: string){
        return db.groups.updateAsync({id : groupId}, { $set: { "welcome.status": status, "welcome.msg":msg }})
    }

    getWelcomeMessage(group: Group, botInfo: Bot, userId: string){
        const generalMessages = getGeneralMessages(botInfo)
        const custom_message = (group.welcome.msg != "") ? group.welcome.msg + "\n\n" : ""
        const message_welcome = buildText(generalMessages.group_welcome_message, userId.replace("@s.whatsapp.net", ""), group.name, custom_message)
        return message_welcome
    }

    // ***** Antifake *****
    setAntifake(groupId: string, status: boolean, allowed: string[]){
        return db.groups.updateAsync({id: groupId}, {$set: { "antifake.status": status, "antifake.allowed": allowed }})
    }

    isNumberFake(group: Group, userId: string){
        const allowedPrefixes = group.antifake.allowed
        for(let numberPrefix of allowedPrefixes){
            if(userId.startsWith(numberPrefix)) return false
        }
        return true
    }

    // ***** Mute *****
    setMuted(groupId: string, status: boolean){
        return db.groups.updateAsync({id: groupId}, {$set: { muted : status}})
    }

    // ***** Antilink *****
    setAntilink(groupId: string, status: boolean){
        return db.groups.updateAsync({id : groupId}, { $set: { antilink: status } })
    }

    async isMessageWithLink(message: Message, group: Group, botInfo : Bot){
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

    // ***** Autosticker *****
    setAutosticker(groupId: string, status: boolean){
        return db.groups.updateAsync({id: groupId}, { $set: { autosticker: status } })
    }

    // ***** Anti-Spam *****
    setAntiSpam(groupId: string, status: boolean, maxMessages: number, interval: number){
        return db.groups.updateAsync({id : groupId}, { $set:{ 'antispam.status' : status, 'antispam.max_messages' : maxMessages, 'antispam.interval' : interval } })
    }

    setMessagesAntiSpam(groupId: string, antiSpamMessages : AntiSpamMessage[]){
        return db.groups.updateAsync({id : groupId}, { $set: {'antispam.messages': antiSpamMessages} })
    }

    async isSpamMessage(group: Group, userId: string){
        let timestamp = Math.round(moment.now()/1000), resposta = false

        //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
        for (let i = 0; i < group.antispam.messages.length; i++) {
            if (timestamp >= group.antispam.messages[i].expire) group.antispam.messages.splice(i, 1)
        }

        //PESQUISA O INDICE DO USUARIO
        let userIndex = group.antispam.messages.findIndex(user => user.id == userId)

        //SE O USUARIO JÁ ESTIVER NA LISTA
        if (userIndex != -1) {
            //INCREMENTA A CONTAGEM
            group.antispam.messages[userIndex].qty++
            let max_messages = group.antispam.max_messages
            if (group.antispam.messages[userIndex].qty >= max_messages) {
                group.antispam.messages.splice(userIndex, 1)
                resposta = true
            } else {
                resposta = false
            }
        } else {
            //ADICIONA O USUARIO NA LISTA
            const messageAntiSpam : AntiSpamMessage = {
                id : userId,
                expire : timestamp + group.antispam.interval,
                qty: 1
            }
            group.antispam.messages.push(messageAntiSpam)
            resposta = false
        }

        //ATUALIZAÇÃO E RETORNO
        await this.setMessagesAntiSpam(group.id, group.antispam.messages)
        return resposta
    }

    // ***** Blacklist *****
    async getBlackList(groupId: string){
        const doc : unknown = await db.groups.findOneAsync({id : groupId})
        const group = doc as Group | null
        return group?.blacklist || []
    }

    addBlackList(groupId: string, userId: string){
        return db.groups.updateAsync({id: groupId}, { $push: { blacklist: userId } })
    }

    removeBlackList(groupId: string, userId: string){
        return db.groups.updateAsync({id: groupId}, { $pull: { blacklist: userId } } )
    }

    async isBlackListed(groupId: string, userId: string){
        const list = await this.getBlackList(groupId)
        return list.includes(userId)
    }

    // ***** Block/Unblock commands *****
    async blockCommands(group: Group, commands : string[], botInfo: Bot){
        const { prefix } = botInfo
        const commandsData = getCommands(botInfo)
        let blockedCommands : string[] = []
        let blockResponse = commandsData.group.bcmd.msgs.reply_title
        let categories : CategoryCommand[]  = ['sticker', 'utility', 'download', 'fun']

        if(commands[0] == 'diversao') commands[0] = 'fun'
        if(commands[0] == 'utilidade') commands[0] = 'utility'

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

    async unblockCommand(group: Group, commands: string[], botInfo: Bot){
        const commandsData = getCommands(botInfo)
        const { prefix } = botInfo
        let unblockedCommands : string[] = []
        let unblockResponse = commandsData.group.dcmd.msgs.reply_title
        let categories : CategoryCommand[] | string[] = ['all', 'sticker', 'utility', 'download', 'fun']

        if(commands[0] == 'todos') commands[0] = 'all'
        if(commands[0] == 'utilidade') commands[0] = 'utility'
        if(commands[0] == 'diversao') commands[0] = 'fun'

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

    isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        const {prefix} = botInfo
        return group.block_cmds.includes(command.replace(prefix, ''))
    }

    // ***** Activity/Counter *****
    setCounter(groupId: string, status: boolean){
        const dateNow = (status) ? timestampToDate(moment.now()) : ''
        return db.groups.updateAsync({id: groupId}, { $set:{ "counter.status" : status, "counter.started" : dateNow } })
    }

    removerGroupCounter(groupId: string){
        return db.counter_groups.removeAsync({group_id: groupId}, {multi: true})
    }

    async getParticipantActivity(groupId: string, userId: string){
        const doc : unknown = await db.counter_groups.findOneAsync({group_id: groupId, user_id: userId})
        const counter = doc as CounterUser | null
        return counter
    }

    async isParticipantActivityRegistered(groupId: string, userId: string){
        const userCounter = await this.getParticipantActivity(groupId, userId)
        return (userCounter != null)
    }

    async registerParticipantActivity(groupId: string, userId: string){
        const isRegistered = await this.isParticipantActivityRegistered(groupId, userId)

        if(isRegistered) return

        const counterUser : CounterUser = {
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

        return db.counter_groups.insertAsync(counterUser)
    }

    async registerAllParticipantsActivity(groupId: string, participants: string[]){
        participants.forEach(async (participant) =>{
            await this.registerParticipantActivity(groupId, participant)
        })
    }

    async getAllParticipantsActivity(groupId: string){
        const doc : unknown = await db.counter_groups.findAsync({group_id : groupId})
        const counters = doc as CounterUser[]
        return counters
    }

    incrementParticipantActivity(groupId: string, userId: string, type: MessageTypes){
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

        return db.counter_groups.updateAsync({group_id : groupId, user_id: userId}, {$inc: incrementedUser})
    }  

    async getParticipantActivityLowerThan(group: Group, num : number){
        let doc: unknown = await db.counter_groups.findAsync({group_id : group.id, msgs: {$lt: num}}).sort({msgs: -1})
        const inactives = doc as CounterUser[]
        let inactivesOnGroup : CounterUser[] = []
        inactives.forEach((inactive) => {
            if (group.participants.includes(inactive.user_id)) inactivesOnGroup.push(inactive)
        })
        return inactivesOnGroup
    }

    async getParticipantsActivityLeaderboard(group: Group, qty: number){
        const doc : unknown = await db.counter_groups.findAsync({group_id : group.id}).sort({msgs: -1})
        const participantsLeaderbord = doc as CounterUser[]
        const participantsOnGroup : CounterUser[] = []
        const qty_leaderboard = (qty > participantsLeaderbord.length) ? participantsLeaderbord.length : qty
        for (let i = 0; i < qty_leaderboard; i++) {
            if (group.participants.includes(participantsLeaderbord[i].user_id)) participantsOnGroup.push(participantsLeaderbord[i])
        }
        return participantsOnGroup
    }


}