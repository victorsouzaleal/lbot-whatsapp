import { WASocket } from "baileys";
import { Bot, Message } from "./interfaces.js";
import { BaileysController } from "../controllers/BaileysController.js";

export async function checkMessage(client: WASocket, botInfo: Bot, message: Message){
    const baileysController = new BaileysController(client)

    //SE O USUARIO ESTIVER BLOQUEADO RETORNE
    if(await isUserBlocked(baileysController, message.sender)) return false

    console.log(message)
    return true

}

async function isUserBlocked(baileysController: BaileysController, idUser: string){
    const blockedContacts = await baileysController.getBlockedContacts()
    return blockedContacts.includes(idUser)
}