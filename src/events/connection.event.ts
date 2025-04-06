import {DisconnectReason, ConnectionState, WASocket} from 'baileys'
import { Boom } from '@hapi/boom'
import fs from "fs-extra"
import dotenv from 'dotenv'
import { BotController } from '../controllers/bot.controller.js'
import { buildText, showConsoleError, getCurrentBotVersion, colorText } from '../utils/general.util.js'
import getBotTexts from '../helpers/bot.texts.helper.js'
import { UserController } from '../controllers/user.controller.js'
import { waLib } from '../libraries/library.js'
import qrcode from 'qrcode-terminal'
import readline from 'readline/promises'

export async function connectionQr(client: WASocket, connectionState : Partial<ConnectionState>){
    const botTexts = getBotTexts()
    const { qr } = connectionState
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const answerMethod = await rl.question(botTexts.input_connection_method)

    if (answerMethod == '2') {
        const answerNumber = await rl.question(botTexts.input_phone_number)
        const code = await client.requestPairingCode(answerNumber.replace(/\W+/g,""))
        console.log('[CÓDIGO DE PAREAMENTO]', colorText(buildText(botTexts.show_pairing_code, code)))
    } else {
        if (qr) {
            await new Promise<void>(resolve => {
                qrcode.generate(qr, {small: true}, (qrcode) => {
                    console.log(qrcode)
                    resolve()
                })
            })
        }
    }
}

export async function connectionOpen(client: WASocket){
    try{
        const botTexts = getBotTexts()
        const botController = new BotController()
        console.log(buildText(botTexts.starting, getCurrentBotVersion()))
        dotenv.config()
        botController.startBot(waLib.getHostNumber(client))
        console.log("[BOT]", colorText(botTexts.bot_data))
        await checkOwnerRegister()
    } catch(err: any) {
        showConsoleError(err, "CONNECTION")
        client.end(new Error("fatal_error"))
    }
}

export function connectionClose(connectionState : Partial<ConnectionState>){
    try{
        const botTexts = getBotTexts()
        const { lastDisconnect } = connectionState
        let needReconnect = false
        const errorCode = (new Boom(lastDisconnect?.error)).output.statusCode

        if (lastDisconnect?.error?.message == "admin_command"){
            showConsoleError(new Error(botTexts.disconnected.command), 'CONNECTION')
        } else if (lastDisconnect?.error?.message == "fatal_error"){
            showConsoleError(new Error(botTexts.disconnected.fatal_error), 'CONNECTION')
        } else {
            needReconnect = true
            if (errorCode == DisconnectReason?.loggedOut){
                fs.rmSync("session", {recursive: true, force: true})
                showConsoleError(new Error(botTexts.disconnected.logout), 'CONNECTION')
            } else if (errorCode == 405) {
                fs.rmSync("session", {recursive: true, force: true})
            } else if (errorCode == DisconnectReason?.restartRequired){
                showConsoleError(new Error(botTexts.disconnected.restart), 'CONNECTION')
            } else {
                showConsoleError(new Error(buildText(botTexts.disconnected.bad_connection, errorCode.toString(), lastDisconnect?.error?.message)), 'CONNECTION')
            }
        }

        return needReconnect
    } catch{
        return false
    }
}

 async function checkOwnerRegister(){
    const owner = await new UserController().getOwner()
    if (!owner){
        console.log("[DONO]", colorText("O número do DONO ainda não foi configurado, digite !admin para cadastrar seu número como dono do bot.", "#d63e3e"))
    } else {
        console.log("[DONO]", colorText("✓ Número do DONO configurado."))
    }
}