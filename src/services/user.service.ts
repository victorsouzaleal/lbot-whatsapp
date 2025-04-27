import DataStore from "@seald-io/nedb";
import { User } from "../interfaces/user.interface.js";
import moment from "moment";
import { Bot } from "../interfaces/bot.interface.js";
import { deepMerge } from "../utils/general.util.js";
const db = new DataStore<User>({filename : './storage/users.db', autoload: true})

export class UserService {
    private defaultUser: User = {
        id: '',
        name: '',
        commands: 0,
        receivedWelcome: false,
        owner: false,
        admin: false,
        command_rate : {
            limited: false,
            expire_limited: 0,
            cmds: 1,
            expire_cmds: Math.round(moment.now()/1000) + 60
        }
    }

    public async registerUser(userId: string, name?: string|null){
        const user = await this.getUser(userId)

        if (user || !userId.endsWith('@s.whatsapp.net')) return 
    
        const userData : User = {
            ...this.defaultUser,
            id: userId,
            name
        }

        await db.insertAsync(userData)
    }

    public async migrateUsers(){
        const users = await this.getUsers()

        for (let user of users) {
            const oldUserData = user as any
            const updatedUserData : User = deepMerge(this.defaultUser, oldUserData)    
            await db.updateAsync({ id: user.id}, { $set: updatedUserData }, { upsert: true })
        }
    }

    public async getUser (userId : string){
        const user  = await db.findOneAsync({id: userId}) as User | null
        return user
    }

    public async getUsers(){
        const users = await db.findAsync({}) as User[]
        return users
    }

    public async setAdmin(userId : string, admin: boolean){
        await db.updateAsync({id : userId}, {$set: {admin}})
    }

    public async getAdmins(){
        const admins = await db.findAsync({admin : true}) as User[]
        return admins
    }

    public async setOwner(userId : string){
        await db.updateAsync({id : userId}, {$set: {owner : true, admin: true}})
    }

    public async getOwner(){
        const owner = await db.findOneAsync({owner : true}) as User | null
        return owner
    }

    public async setName(userId : string, name : string){
        await db.updateAsync({id: userId}, {$set:{name}})
    }

    public async setReceivedWelcome(userId: string, status = true){
        await db.updateAsync({id : userId}, {$set : {receivedWelcome : status}})
    }

    public async increaseUserCommandsCount(userId: string){
        await db.updateAsync({id : userId}, {$inc: {commands: 1}})
    }

    public async expireCommandsRate(userId: string, currentTimestamp: number){
        const expireTimestamp = currentTimestamp + 60
        await db.updateAsync({id: userId}, { $set : { 'command_rate.expire_cmds': expireTimestamp, 'command_rate.cmds': 1 } })
    }

    public async incrementCommandRate(userId: string){
        await db.updateAsync({id: userId}, { $inc : { "command_rate.cmds": 1 } })
    }

    public async setLimitedUser(userId: string, isLimited: boolean, botInfo: Bot, currentTimestamp: number){
        if (isLimited){
            await db.updateAsync({id: userId}, { $set : { 'command_rate.limited': isLimited, 'command_rate.expire_limited': currentTimestamp + botInfo.command_rate.block_time} })
        } else {
            await db.updateAsync({id: userId}, { $set : { 'command_rate.limited': isLimited, 'command_rate.expire_limited': 0, 'command_rate.cmds': 1, 'command_rate.expire_cmds': currentTimestamp + 60} })
        }
    }
}