import pino from 'pino'

export default function configSocket (state, store){
    return {
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        keepAliveIntervalMs: 60000,
        logger: pino({level : "silent"}),
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
        }
    }
}