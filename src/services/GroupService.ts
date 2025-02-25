import Datastore from "@seald-io/nedb";
import { AntiFloodMessage, Bot, CommandCategory, CounterUser, Group, Message, MessageTypes } from '../modules/interfaces.js'
import { GroupMetadata, ParticipantAction } from 'baileys'
import { getGroupParticipantsByMetadata, getGroupAdminsByMetadata, timestampToDate, commandExist, buildText } from '../modules/util.js'
import moment from 'moment-timezone'
import botCommands from '../modules/commands/commands.list.js'
import getGeneralMessagesBot from "../modules/bot.general-messages.js";
import { group } from "console";

const db = {
    groups : new Datastore({filename : './storage/groups.db', autoload: true}),
    counter_groups : new Datastore({filename : './storage/counter-groups.db', autoload: true})
}

export class GroupService {
    constructor(){}
    
    // *********************** Register/Remove/Update groups ***********************
    async setGroup(group : GroupMetadata){
        const isRegistered = await this.isRegistered(group.id)
        if(isRegistered) return
        const participants = getGroupParticipantsByMetadata(group)
        const admins = getGroupAdminsByMetadata(group)
        const groupData : Group = {
            id: group.id,
            name: group.subject,
            description: group.desc,
            participants,
            admins,
            owner: group.owner,
            restricted: group.announce,
            muted : false,
            welcome : { status: false, msg: '' },
            antifake : { status: false, allowed: [] },
            antilink : false,
            antiflood : { status: false, max_messages: 10, interval: 10, messages: [] },
            autosticker : false,
            counter : { status: false, started: '' },
            block_cmds : [],
            blacklist : []
        }
        await db.groups.insertAsync(groupData)
    }

    async setGroups(groups: GroupMetadata[]) {
        for (let group of groups) await this.setGroup(group)
    }

    async updateGroup(group : GroupMetadata){
        const participants = getGroupParticipantsByMetadata(group)
        const admins = getGroupAdminsByMetadata(group)
        await db.groups.updateAsync({ id : group.id }, { $set: {
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

    async updatePartialGroup(group: Partial<GroupMetadata>) {
        if(group.id){
            if (group.subject) await this.setName(group.id, group.subject)
            if (group.announce) await this.setRestricted(group.id, group.announce)
        }
    }

    async getGroup(idGroup : string){
        const doc : unknown = await db.groups.findOneAsync({id: idGroup})
        return doc as Group | null
    }

    async removeGroup(idGroup: string){
        const isRegistered = await this.isRegistered(idGroup)
        if(isRegistered) await db.groups.removeAsync({id: idGroup}, {multi: true})
    }

    async getAllGroups(){
        const doc : unknown = await db.groups.findAsync({})
        return doc as Group[]
    }

    async isRegistered(idGroup: string) {
        const group = await this.getGroup(idGroup)
        return (group != null)
    }

    async isRestricted(idGroup: string) {
        const group = await this.getGroup(idGroup)
        return group?.restricted
    }

    async setName(idGroup: string, name: string){
        await db.groups.updateAsync({id: idGroup}, { $set : { name } })
    }

    async setRestricted(idGroup: string, restricted: boolean){
        await db.groups.updateAsync({id: idGroup}, { $set: { restricted } })
    }

    // *********************** Add/Update/Remove participants and admins. ***********************
    async getParticipants(idGroup: string){
        const doc : unknown = await db.groups.findOneAsync({id: idGroup})
        const group = doc as Group | null
        return group?.participants ?? []
    }

    async isParticipant(idGroup: string, idUser: string){
        const participants = await this.getParticipants(idGroup)
        return participants.includes(idUser)
    }

    async getAdmins(idGroup: string){
        const doc : unknown = await db.groups.findOneAsync({id: idGroup})
        const group = doc as Group | null
        return group?.admins ?? []
    }

    async isAdmin(idGroup: string, idUser: string){
        const admins = await this.getAdmins(idGroup)
        return admins.includes(idUser)
    }

    async getOwner(idGroup: string){
        const doc : unknown = await db.groups.findOneAsync({id: idGroup})
        const group = doc as Group | null
        return group?.owner
    }

    async addParticipant(idGroup: string, idUser: string){
        const isParticipant = await this.isParticipant(idGroup, idUser)
        if(!isParticipant) await db.groups.updateAsync({id : idGroup}, { $push: { participants: idUser } })
    }

    async removeParticipant(idGroup: string, idUser: string){
        const isParticipant = await this.isParticipant(idGroup, idUser)
        if(isParticipant) {
            await db.groups.updateAsync({id : idGroup}, { $pull: { participants : idUser } })
            await this.removeAdmin(idGroup, idUser)
        }  
    }

    async addAdmin(idGroup: string, idUser: string){
        const isAdmin = await this.isAdmin(idGroup, idUser)
        if(!isAdmin) await db.groups.updateAsync({id : idGroup}, { $push: { admins: idUser} })
    }

    async removeAdmin(idGroup: string, idUser: string){
        const isAdmin = await this.isAdmin(idGroup, idUser)
        if(isAdmin) await db.groups.updateAsync({id : idGroup}, { $pull: { admins : idUser } })
    }

    // *********************** Turn ON/OFF Group features ***********************
    // ***** Welcome *****
    async setWelcome(idGroup: string, status: boolean, msg: string){
        return await db.groups.updateAsync({id : idGroup}, { $set: { "welcome.status": status, "welcome.msg":msg }})
    }

    async getWelcomeMessage(group: Group, botInfo: Bot, idUser: string){
        const generalMessages = getGeneralMessagesBot(botInfo)
        const custom_message = (group.welcome.msg != "") ? group.welcome.msg + "\n\n" : ""
        const message_welcome = buildText(generalMessages.group_welcome_message, idUser.replace("@s.whatsapp.net", ""), group.name, custom_message)
        return message_welcome
    }

    // ***** Antifake *****
    async setAntifake(idGroup: string, status: boolean, allowed: string[]){
        return await db.groups.updateAsync({id: idGroup}, {$set: { "antifake.status": status, "antifake.allowed": allowed }})
    }

    async isNumberFake(group: Group, idUser: string){
        const allowedPrefixes = group.antifake.allowed
        for(let numberPrefix of allowedPrefixes){
            if(idUser.startsWith(numberPrefix)) return false
        }
        return true
    }

    // ***** Mute *****
    async setMuted(idGroup: string, status: boolean){
        return await db.groups.updateAsync({id: idGroup}, {$set: { muted : status}})
    }

    // ***** Antilink *****
    async setAntilink(idGroup: string, status: boolean){
        return await db.groups.updateAsync({id : idGroup}, { $set: { antilink: status } })
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
    async setAutosticker(idGroup: string, status: boolean){
        return await db.groups.updateAsync({id: idGroup}, { $set: { autosticker: status } })
    }

    // ***** Antiflood *****
    async setAntiflood(idGroup: string, status: boolean, maxMessages: number, interval: number){
        return await db.groups.updateAsync({id : idGroup}, { $set:{ 'antiflood.status' : status, 'antiflood.max_messages' : maxMessages, 'antiflood.interval' : interval } })
    }

    async setMessagesAntiFlood(idGroup: string, antiFloodMessages : AntiFloodMessage[]){
        return await db.groups.updateAsync({id : idGroup}, { $set: {'antiflood.messages': antiFloodMessages} })
    }

    async isFloodMessage(group: Group, idUser: string){
        let timestamp = Math.round(moment.now()/1000), resposta = false
        //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
        for (let i = 0; i < group.antiflood.messages.length; i++) {
            if (timestamp >= group.antiflood.messages[i].expire) group.antiflood.messages.splice(i, 1)
        }
        //PESQUISA O INDICE DO USUARIO
        let userIndex = group.antiflood.messages.findIndex(user => user.id == idUser)
        //SE O USUARIO JÁ ESTIVER NA LISTA
        if (userIndex != -1) {
            //INCREMENTA A CONTAGEM
            group.antiflood.messages[userIndex].qty++
            let max_messages = group.antiflood.max_messages
            if (group.antiflood.messages[userIndex].qty >= max_messages) {
                group.antiflood.messages.splice(userIndex, 1)
                resposta = true
            } else {
                resposta = false
            }
        } else {
            //ADICIONA O USUARIO NA LISTA
            const messageAntiflood : AntiFloodMessage = {
                id : idUser,
                expire : timestamp + group.antiflood.interval,
                qty: 1
            }
            group.antiflood.messages.push(messageAntiflood)
            resposta = false
        }

        //ATUALIZAÇÃO E RETORNO
        await this.setMessagesAntiFlood(group.id, group.antiflood.messages)
        return resposta
    }

    // ***** Blacklist *****
    async getBlackList(idGroup: string){
        const doc : unknown = await db.groups.findOneAsync({id : idGroup})
        const group = doc as Group | null
        return group?.blacklist || []
    }

    async addBlackList(idGroup: string, idUser: string){
        return await db.groups.updateAsync({id: idGroup}, { $push: { blacklist: idUser } })
    }

    async removeBlackList(idGroup: string, idUser: string){
        return await db.groups.updateAsync({id: idGroup}, { $pull: { blacklist: idUser } } )
    }

    async isBlackListed(idGroup: string, idUser: string){
        const list = await this.getBlackList(idGroup)
        return list.includes(idUser)
    }

    // ***** Block/Unblock commands *****
    async blockCommands(group: Group, commands : string[], botInfo: Bot){
        const { prefix } = botInfo
        const commands_data = botCommands(botInfo)
        let blockedCommands : string[] = []
        let blockResponse = commands_data.group.bcmd.msgs.reply_title
        let categories : CommandCategory[]  = ['sticker', 'utility', 'download', 'fun']
        if (categories.includes(commands[0] as CommandCategory)) commands = Object.keys(commands_data[commands[0] as CommandCategory]).map(command => prefix + command)

        for (let command of commands) {
            if (commandExist(botInfo, command, 'utility') || commandExist(botInfo, command, 'fun') || commandExist(botInfo, command, 'sticker') || commandExist(botInfo, command, 'download')) {
                if (group.block_cmds.includes(command.replace(prefix, ''))) {
                    blockResponse += buildText(commands_data.group.bcmd.msgs.reply_item_already_blocked, command)
                } else {
                    blockedCommands.push(command.replace(prefix, ''))
                    blockResponse += buildText(commands_data.group.bcmd.msgs.reply_item_blocked, command)
                }
            } else if (commandExist(botInfo, command, 'group') || commandExist(botInfo, command, 'admin') || commandExist(botInfo, command, 'info')) {
                blockResponse += buildText(commands_data.group.bcmd.msgs.reply_item_error, command)
            } else {
                blockResponse += buildText(commands_data.group.bcmd.msgs.reply_item_not_exist, command)
            }
        }

        if (blockedCommands.length != 0) await db.groups.updateAsync({id : group.id}, { $push: { block_cmds: { $each: blockedCommands } } })
        return blockResponse
    }

    async unblockCommand(group: Group, commands: string[], botInfo: Bot){
        const commands_data = botCommands(botInfo)
        const { prefix } = botInfo
        let unblockedCommands : string[] = []
        let unblockResponse = commands_data.group.dcmd.msgs.reply_title
        let categories : CommandCategory[] | string[] = ['all', 'sticker', 'utility', 'download', 'fun']

        if (categories.includes(commands[0])) {
            if (commands[0] === 'all') commands = group.block_cmds.map(command => prefix + command)
            else commands = Object.keys(commands_data[commands[0] as CommandCategory]).map(command => prefix + command)
        }

        for (let command of commands) {
            if (group.block_cmds.includes(command.replace(prefix, ''))) {
                unblockedCommands.push(command.replace(prefix, ''))
                unblockResponse += buildText(commands_data.group.dcmd.msgs.reply_item_unblocked, command)
            } else {
                unblockResponse += buildText(commands_data.group.dcmd.msgs.reply_item_not_blocked, command)
            }
        }

        if (unblockedCommands.length != 0) await db.groups.updateAsync({id : group.id}, { $pull: { block_cmds: { $in: unblockedCommands }} })
        return unblockResponse
    }

    async isBlockedCommand(group: Group, command: string, botInfo: Bot) {
        const {prefix} = botInfo
        return group.block_cmds.includes(command.replace(prefix, ''))
    }

    // ***** Activity/Counter *****
    async setCounter(idGroup: string, status: boolean){
        const dateNow = (status) ? timestampToDate(moment.now()) : ''
        return await db.groups.updateAsync({id: idGroup}, { $set:{ "counter.status" : status, "counter.started" : dateNow } })
    }

    async removerGroupCounter(idGroup: string){
        await db.counter_groups.removeAsync({group_id: idGroup}, {multi: true})
    }

    async getParticipantActivity(idGroup: string, idUser: string){
        const doc : unknown = await db.counter_groups.findOneAsync({group_id: idGroup, user_id: idUser})
        const counter = doc as CounterUser | null
        return counter
    }

    async isParticipantActivityRegistered(idGroup: string, idUser: string){
        const userCounter = await this.getParticipantActivity(idGroup, idUser)
        return (userCounter != null)
    }

    async setParticipantActivity(idGroup: string, idUser: string){
        const isRegistered = await this.isParticipantActivityRegistered(idGroup, idUser)
        if(isRegistered) return
        const counterUser : CounterUser = {
            group_id : idGroup,
            user_id: idUser,
            msgs: 0,
            image: 0,
            audio: 0,
            sticker: 0,
            video: 0,
            text: 0,
            other: 0
        }
        await db.counter_groups.insertAsync(counterUser)
    }

    async getAllParticipantsActivity(idGroup: string){
        const doc : unknown = await db.counter_groups.findAsync({group_id : idGroup})
        const counters = doc as CounterUser[]
        return counters
    }

    async incrementParticipantActivity(idGroup: string, idUser: string, type: MessageTypes){
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
        await db.counter_groups.updateAsync({group_id : idGroup, user_id: idUser}, {$inc: incrementedUser})
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