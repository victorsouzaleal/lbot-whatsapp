import pino from 'pino'
import {recuperarMensagem} from './mensagem.js'

export default function configSocket (state){
    return {
        printQRInTerminal: true,
        auth: state,
        emitOwnEvents: false,
        keepAliveIntervalMs: 60000,
        logger: pino({level : "silent"}),
        getMessage: async (key) => {
            const {message} = await recuperarMensagem(key.remoteJid, key.id)
            return message || undefined
        }
    }
}