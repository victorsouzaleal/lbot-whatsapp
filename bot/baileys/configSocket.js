import pino from 'pino'
import { MensagemControle } from '../controles/MensagemControle.js'
import {isJidBroadcast, makeCacheableSignalKeyStore} from '@whiskeysockets/baileys'

export default function configSocket (state){
    return {
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({level : "silent"}))
        },
        keepAliveIntervalMs: 30000,
        emitOwnEvents: true,
        logger: pino({level : "silent"}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid.endsWith('@newsletter'),
        syncFullHistory: false,
        getMessage: async (key) => {
            const mensagem = await new MensagemControle().recuperarMensagem(key.remoteJid, key.id)
            return mensagem || undefined
        }
    }
}