import pino from 'pino'
import { MensagemControle } from '../controles/MensagemControle.js'
import {isJidBroadcast} from '@whiskeysockets/baileys'

export default function configSocket (state){
    return {
        printQRInTerminal: true,
        auth: state,
        keepAliveIntervalMs: 20000,
        emitOwnEvents: true,
        logger: pino({level : "silent"}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid.endsWith('@newsletter'),
        getMessage: async (key) => {
            const mensagem = await new MensagemControle().recuperarMensagem(key.remoteJid, key.id)
            return mensagem || undefined
        }
    }
}