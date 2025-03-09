import { UserService } from "../services/user.service.js";

export class UserController{
    private userService
    
    constructor(){
        this.userService = new UserService()
    }

    registerUser(userId: string, name?: string|null){
        return this.userService.registerUser(userId, name)
    }

    setName(userId: string, name: string){
        return this.userService.setName(userId, name)
    }

    isUserRegistered(userId: string){
        return this.userService.isUserRegistered(userId)
    }

    registerAdmin(userId: string){
        return this.userService.setAdmin(userId)
    }

    getUsers(){
        return this.userService.getUsers()
    }

    getUser(userId: string){
        return this.userService.getUser(userId)
    }

    getAdmins(){
        return this.userService.getAdmins()
    }

    setReceivedWelcome(userId: string, status = true){
        return this.userService.setReceivedWelcome(userId, status)
    }

    increaseUserCommandsCount(userId: string){
        return this.userService.increaseUserCommandsCount(userId)
    }

}