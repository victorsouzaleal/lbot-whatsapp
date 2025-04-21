import {pino} from 'pino'
import {isJidBroadcast, AuthenticationState, WAVersion, UserFacingSocketConfig, makeCacheableSignalKeyStore} from 'baileys'
import NodeCache from 'node-cache'
import { waLib } from './libraries/library.js'

export default function configSocket (state : AuthenticationState, retryCache : NodeCache, version: WAVersion, messageCache: NodeCache){
    const config : UserFacingSocketConfig =  {
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
            const message = (key.id) ? waLib.getMessageFromCache(key.id, messageCache) : undefined
            return message
        }
    }

    return config
}