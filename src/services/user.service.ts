import DataStore from "@seald-io/nedb";
import { User } from "../interfaces/user.interface.js";
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

        if (isRegistered) return 

        const user : User = {
            id : userId,
            name,
            commands: 0,
            receivedWelcome: false,
            owner: false,
            admin: false
        }

        return db.insertAsync(user)
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
}