import { UserService } from "../services/UserService.js";

export class UserController{
    private userService
    
    constructor(){
        this.userService = new UserService()
    }

    public async registerUser(idUser: string, name?: string|null){
        return await this.userService.setUser(idUser, name)
    }

    async setName(idUser: string, name: string){
        return await this.userService.setName(idUser, name)
    }

    async isUserRegistered(idUser: string){
        return await this.userService.isUserRegistered(idUser)
    }

    async registerOwner(idUser: string){
        return await this.userService.setAdmin(idUser)
    }

    async getUsers(){
        return await this.userService.getUsers()
    }

    async getUser(idUser: string){
        return await this.userService.getUser(idUser)
    }

    async getAdmin(){
        return await this.userService.getAdmin()
    }

    public async getAdminId(){
        return await this.userService.getAdminId()
    }

    async setReceivedWelcome(idUser: string, status = true){
        return await this.userService.setReceivedWelcome(idUser, status)
    }

    async increaseUserCommandsCount(idUser: string){
        return await this.userService.increaseUserCommandsCount(idUser)
    }

}