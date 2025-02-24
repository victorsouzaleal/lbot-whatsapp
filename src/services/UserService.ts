import Datastore from "@seald-io/nedb";
const db = new Datastore({filename : './storage/users.db', autoload: true})
import { UsersType, User } from '../modules/interfaces.js'

export class UserService{

    public async getUser (idUser : string){
        const doc : any  = await db.findOneAsync({id: idUser})
        return doc as User | null
    }

    public async getUsers(){
        const doc : any = await db.findAsync({})
        return doc as User[] | []
    }

    public async setUser(idUser: string, name?: string|null){
        const isRegistered = await this.isUserRegistered(idUser)
        if(isRegistered) return 
        const user : User = {
            id : idUser,
            name,
            commands: 0,
            receivedWelcome: false,
            admin: false
        }
        await db.insertAsync(user)
    }

    public async isUserRegistered(idUser: string){
        const user = await this.getUser(idUser)
        return (user != null)
    }

    public async setAdmin(idUser : string){
        await this.resetAdmins()
        await db.updateAsync({id : idUser}, {$set: {admin : true}})
    }

    public async getAdmin(){
        const doc : any = await db.findOneAsync({admin : true})
        return doc as User | null
    }

    public async getAdminId(){
        const owner = await this.getAdmin()
        return owner?.id
    }

    public async setName(idUser : string, name : string){
        await db.updateAsync({id: idUser}, {$set:{name}})
    }

    private async resetAdmins(){
        await db.updateAsync({admin: true}, {$set: {admin: false}}, {multi: true})
    }

    public async setReceivedWelcome(idUser: string, status = true){
        await db.updateAsync({id : idUser}, {$set : {receivedWelcome : status}})
    }

    public async increaseUserCommandsCount(idUser: string){
        await db.updateAsync({id : idUser}, {$inc: {commands: 1}})
    }
}