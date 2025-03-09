import {DisconnectReason, ConnectionState, WASocket} from 'baileys'
import { Boom } from '@hapi/boom'
import fs from "fs-extra"
import dotenv from 'dotenv'
import { BotController } from '../controllers/bot.controller.js'
import { BaileysController } from '../controllers/baileys.controller.js'
import { buildText, showConsoleError, getCurrentBotVersion, colorText } from '../lib/util.js'
import getGeneralMessages from '../lib/general-messages.js'
import { UserController } from '../controllers/user.controller.js'

export async function connectionOpen(client: WASocket){
    try{
        const generalMessages = getGeneralMessages()
        const botController = new BotController()
        const baileysController = new BaileysController(client)
        console.log(buildText(generalMessages.starting, getCurrentBotVersion()))
        dotenv.config()
        botController.startBot(baileysController.getHostNumber())
        console.log("[BOT]", colorText(generalMessages.bot_data))
        await checkAdminNumber()
    } catch(err: any) {
        showConsoleError(err.message, "CONNECTION")
        client.end(new Error("fatal_error"))
    }
}

export function connectionClose(connectionState : Partial<ConnectionState>){
    try{
        const generalMessages = getGeneralMessages()
        const { lastDisconnect } = connectionState
        let needReconnect = false
        const errorCode = (new Boom(lastDisconnect?.error)).output.statusCode

        if(lastDisconnect?.error?.message == "admin_command"){
            showConsoleError(generalMessages.disconnected.command, 'CONNECTION')
        } else if(lastDisconnect?.error?.message == "fatal_error"){
            showConsoleError(generalMessages.disconnected.fatal_error, 'CONNECTION')
        } else {
            needReconnect = true
            if(errorCode == DisconnectReason?.loggedOut){
                fs.rmSync("session", {recursive: true, force: true})
                showConsoleError(generalMessages.disconnected.logout, 'CONNECTION')
            } else if(errorCode == DisconnectReason?.restartRequired){
                showConsoleError(generalMessages.disconnected.restart, 'CONNECTION')
            } else {
                showConsoleError(buildText(generalMessages.disconnected.bad_connection, errorCode.toString(), lastDisconnect?.error?.message), 'CONNECTION')
            }
        }

        return needReconnect
    } catch{
        return false
    }
}

 async function checkAdminNumber(){
    const admins = await new UserController().getAdmins()
    
    if(!admins.length){
        console.log("[ADMIN]", colorText("O número do ADMIN ainda não foi configurado, digite !admin para cadastrar seu número como administrador.", "#d63e3e"))
    } else {
        console.log("[ADMIN]", colorText("✓ Número do ADMIN configurado."))
    }
}