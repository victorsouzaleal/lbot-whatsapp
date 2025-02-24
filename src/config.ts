import {pino} from 'pino'
import {isJidBroadcast, makeCacheableSignalKeyStore, AuthenticationState, WAVersion, UserFacingSocketConfig} from 'baileys'
import NodeCache from 'node-cache'
import { MessageController } from './controllers/MessageController.js'

export default function configSocket (state : AuthenticationState, retryCache : NodeCache, version: WAVersion, messageCache: NodeCache){
    const config : UserFacingSocketConfig =  {
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({level : "silent"}))
        },
        version,
        msgRetryCounterCache : retryCache,
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: false,
        logger: pino({level : "silent"}),
        shouldIgnoreJid: jid => isJidBroadcast(jid) || jid?.endsWith('@newsletter'),
        getMessage: async (key) => {
            return (key.id) ? await new MessageController().getMessage(key.id, messageCache) : undefined
        }
    }
    return config
}