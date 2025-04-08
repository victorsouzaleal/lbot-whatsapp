import { Bot } from "../interfaces/bot.interface.js";
import { User } from "../interfaces/user.interface.js";
import { UserService } from "../services/user.service.js";

export class UserController{
    private userService
    
    constructor(){
        this.userService = new UserService()
    }

    public registerUser(userId: string, name?: string|null){
        return this.userService.registerUser(userId, name)
    }

    public rebuildUsersDatabase(){
        return this.userService.rebuildUserDatabase()
    }

    public setName(userId: string, name: string){
        return this.userService.setName(userId, name)
    }

    public isUserRegistered(userId: string){
        return this.userService.isUserRegistered(userId)
    }

    public promoteUser(userId: string){
        return this.userService.setAdmin(userId, true)
    }

    public demoteUser(userId: string){
        return this.userService.setAdmin(userId, false)
    }

    public registerOwner(userId: string){
        return this.userService.setOwner(userId)
    }

    public getUsers(){
        return this.userService.getUsers()
    }

    public getUser(userId: string){
        return this.userService.getUser(userId)
    }

    public getOwner(){
        return this.userService.getOwner()
    }

    public getAdmins(){
        return this.userService.getAdmins()
    }

    public setReceivedWelcome(userId: string, status = true){
        return this.userService.setReceivedWelcome(userId, status)
    }

    public increaseUserCommandsCount(userId: string){
        return this.userService.increaseUserCommandsCount(userId)
    }

    public async hasExpiredCommands(user: User, currentTimestamp: number){
        return this.userService.hasExpiredCommands(user, currentTimestamp)
    }

    public async hasExpiredLimited(user: User, botInfo: Bot, currentTimestamp: number){
        return this.userService.hasExpiredLimited(user, botInfo, currentTimestamp)
    }

    public setLimitedUser(userId: string, isLimited: boolean, botInfo: Bot, currentTimestamp: number){
        return this.userService.setLimitedUser(userId, isLimited, botInfo, currentTimestamp)
    }

}