import DataStore from "@seald-io/nedb";
import { User } from "../interfaces/user.interface.js";
import moment from "moment";
import { Bot } from "../interfaces/bot.interface.js";
const db = new DataStore<User>({filename : './storage/users.db', autoload: true})

export class UserService{
    public async getUser (userId : string){
        const user  = await db.findOneAsync({id: userId}) as User | null
        return user
    }

    public async getUsers(){
        const users = await db.findAsync({}) as User[]
        return users
    }

    public async registerUser(userId: string, name?: string|null){
        const isRegistered = await this.isUserRegistered(userId)

        if (isRegistered) {
            return 
        }

        const timestamp = Math.round(moment.now()/1000)

        const user : User = {
            id : userId,
            name,
            commands: 0,
            receivedWelcome: false,
            owner: false,
            admin: false,
            command_rate : {
                limited: false,
                expire_limited: 0,
                cmds: 1,
                expire_cmds: timestamp + 60
            }
        }

        return db.insertAsync(user)
    }

    public async rebuildUsers(){
        const users = await this.getUsers()

        for (let user of users) {
            const timestamp = Math.round(moment.now()/1000)
            const oldUserData = user as any
            const updatedUserData = {
                id: oldUserData.id,
                name: oldUserData.name,
                commands: oldUserData.commands,
                receivedWelcome: oldUserData.receivedWelcome,
                owner: oldUserData.owner,
                admin: oldUserData.admin,
                command_rate: {
                    limited: oldUserData.command_rate.limited ?? false,
                    expire_limited: oldUserData.command_rate.expire_limited ?? 0,
                    cmds: oldUserData.command_rate.cmds ?? 1,
                    expire_cmds: oldUserData.command_rate.expire_cmds ?? timestamp + 60
                }
            }

            await db.removeAsync({id: user.id}, {})
            await db.insertAsync(updatedUserData)
        }
    }

    public async isUserRegistered(userId: string){
        const user = await this.getUser(userId)
        return (user != null)
    }

    public setAdmin(userId : string, admin: boolean){
        return db.updateAsync({id : userId}, {$set: {admin}})
    }

    public async getAdmins(){
        const admins = await db.findAsync({admin : true}) as User[]
        return admins
    }

    public setOwner(userId : string){
        return db.updateAsync({id : userId}, {$set: {owner : true, admin: true}})
    }

    public async getOwner(){
        const owner = await db.findOneAsync({owner : true}) as User | null
        return owner
    }

    public setName(userId : string, name : string){
        return db.updateAsync({id: userId}, {$set:{name}})
    }

    public setReceivedWelcome(userId: string, status = true){
        return db.updateAsync({id : userId}, {$set : {receivedWelcome : status}})
    }

    public increaseUserCommandsCount(userId: string){
        return db.updateAsync({id : userId}, {$inc: {commands: 1}})
    }

    public async hasExpiredCommands(user: User, currentTimestamp: number){
        if (currentTimestamp > user.command_rate.expire_cmds){
            const expireTimestamp = currentTimestamp + 60
            await db.updateAsync({id: user.id}, { $set : { 'command_rate.expire_cmds': expireTimestamp, 'command_rate.cmds': 1 } })
            return true
        } else {
            await db.updateAsync({id: user.id}, { $inc : { "command_rate.cmds": 1 } })
            return false
        }
    }

    public async hasExpiredLimited(user: User, botInfo: Bot, currentTimestamp: number){
        if (currentTimestamp > user.command_rate.expire_limited){
            await this.setLimitedUser(user.id, false, botInfo, currentTimestamp)
            return true
        } else {
            return false
        }
    }

    public setLimitedUser(userId: string, isLimited: boolean, botInfo: Bot, currentTimestamp: number){
        if(isLimited){
            return db.updateAsync({id: userId}, { $set : { 'command_rate.limited': isLimited, 'command_rate.expire_limited': currentTimestamp + botInfo.command_rate.block_time} })
        } else {
            return db.updateAsync({id: userId}, { $set : { 'command_rate.limited': isLimited, 'command_rate.expire_limited': 0, 'command_rate.cmds': 1, 'command_rate.expire_cmds': currentTimestamp + 60} })
        }
    }
}