import pino from 'pino'
import {recuperarMensagem} from './mensagem.js'
import {isJidBroadcast } from '@whiskeysockets/baileys'

export default function configSocket (state){
    return {
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        keepAliveIntervalMs: 20000,
        logger: pino({level : "silent"}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid.endsWith('@newsletter'),
        getMessage: async (key) => {
            const {message} = await recuperarMensagem(key.remoteJid, key.id)
            return message || undefined
        }
    }
}