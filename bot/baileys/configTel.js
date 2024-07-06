import pino from 'pino'
import { MensagemControle } from '../controles/MensagemControle.js'
import {isJidBroadcast, makeCacheableSignalKeyStore} from '@whiskeysockets/baileys'

export default function configSocket (state, cacheTentativasEnvio, versaoWaWeb){
    return {
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({level : "silent"}))
        },
        version : versaoWaWeb,
        msgRetryCounterCache : cacheTentativasEnvio,
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: true,
        logger: pino({level : "silent"}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid?.endsWith('@newsletter'),
        getMessage: async (key) => {
            const mensagem = await new MensagemControle().recuperarMensagem(key.remoteJid, key.id)
            return mensagem
        }
    }
}
