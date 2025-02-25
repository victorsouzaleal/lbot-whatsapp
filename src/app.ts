//REQUERINDO MODULOS
import {makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, WASocket} from 'baileys'
import moment from "moment-timezone"
import NodeCache from 'node-cache'
import configSocket from './config.js'
moment.tz.setDefault('America/Sao_Paulo')
import { BotController } from './controllers/BotController.js'
import { connectionClose, connectionOpen } from './modules/event.connection.js'
import { messageReceived } from './modules/event.message-received.js'
import { addedOnGroup } from './modules/event.group-added.js'
import { groupParticipantsUpdated } from './modules/event.group-participants-updated.js'
import { partialGroupUpdate } from './modules/event.group-partial-update.js'
import { updateGroupsOnStart } from './modules/event.groups-update-start.js'
import { executeEventQueue, queueEvent } from './modules/event.events-queue.js'


//Cache de tentativa de envios
const retryCache = new NodeCache()
//Cache de eventos na fila até o bot inicializar
const eventsCache = new NodeCache()
//Cache de mensagens para serem reenviadas em caso de falha
const messagesCache = new NodeCache({stdTTL: 5*60, useClones: false})


async function connect(){
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const {version} = await fetchLatestBaileysVersion()
    const client : WASocket = makeWASocket(configSocket(state, retryCache, version, messagesCache))
    eventsCache.set("events", [])
    let isBotReady  = false

    //Eventos
    client.ev.process(async(events)=>{

        //Informações atualizadas do bot : prefixo atual, nome, nome do admin...
        const botInfo = new BotController().getBot()

        //Status da conexão
        if(events['connection.update']){
            const connectionState = events['connection.update']
            const { connection } = connectionState
            let needReconnect = false
            if(connection == 'open'){
                connectionOpen(client)
                isBotReady = await updateGroupsOnStart(client)
                await executeEventQueue(client, eventsCache)
            } else if (connection == 'close'){
                needReconnect = connectionClose(connectionState)
            }
            if(needReconnect) connect()
        }

        // Credenciais
        if(events['creds.update']){
            await saveCreds()
        }

        // Receber mensagem
        if(events['messages.upsert']){
            const message = events['messages.upsert']
            if(isBotReady) await messageReceived(client, message, botInfo, messagesCache)
            else queueEvent(eventsCache, "messages.upsert", message)
        }

        // Atualização de participantes no grupo
        if(events['group-participants.update']){
            const participantsUpdate = events['group-participants.update']
            if(isBotReady) await groupParticipantsUpdated(client, participantsUpdate, botInfo)
            else queueEvent(eventsCache, "group-participants.update", participantsUpdate)
        }

        // Novo grupo
        if(events['groups.upsert']){
            const groups = events['groups.upsert']
            if(isBotReady) await addedOnGroup(client, groups, botInfo)
            else queueEvent(eventsCache, "groups.upsert", groups)
        }

        // Atualização parcial de dados do grupo
        if(events['groups.update']){
            const groups = events['groups.update']
            if (groups.length == 1 && groups[0].participants == undefined){
                if(isBotReady) await partialGroupUpdate(groups[0])
                else queueEvent(eventsCache, "groups.update", groups)
            }
        }

    })
}

// Execução principal
connect()
