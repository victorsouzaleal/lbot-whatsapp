
import {makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, WASocket} from 'baileys'
import NodeCache from 'node-cache'
import configSocket from './config.js'
import { BotController } from './controllers/bot.controller.js'
import { connectionClose, connectionOpen, connectionQr } from './events/connection.event.js'
import { messageReceived } from './events/message-received.event.js'
import { addedOnGroup } from './events/group-added.event.js'
import { groupParticipantsUpdated } from './events/group-participants-updated.event.js'
import { partialGroupUpdate } from './events/group-partial-update.event.js'
import { syncGroupsOnStart } from './helpers/groups.sync.helper.js'
import { executeEventQueue, queueEvent } from './helpers/events.queue.helper.js'
import getBotTexts from './helpers/bot.texts.helper.js'
import { colorText } from './utils/general.util.js'

//Cache de tentativa de envios
const retryCache = new NodeCache()
//Cache de eventos na fila até o bot inicializar
const eventsCache = new NodeCache()
//Cache de mensagens para serem reenviadas em caso de falha
const messagesCache = new NodeCache({stdTTL: 5*60, useClones: false})

export default async function connect(){
    const { state, saveCreds } = await useMultiFileAuthState('session')
    const {version} = await fetchLatestBaileysVersion()
    const client : WASocket = makeWASocket(configSocket(state, retryCache, version, messagesCache))
    let isBotReady = false
    eventsCache.set("events", [])

    //Eventos
    client.ev.process(async(events)=>{
        const botInfo = new BotController().getBot()

        //Status da conexão
        if (events['connection.update']){
            const connectionState = events['connection.update']
            const { connection, qr } = connectionState
            let needReconnect = false

            if (qr) {
                connectionQr(client, connectionState) 
            } else if (connection === 'open'){
                connectionOpen(client)
                isBotReady = await syncGroupsOnStart(client)
                await executeEventQueue(client, eventsCache)
                console.log(colorText(getBotTexts(botInfo).server_started))
            } else if (connection === 'close'){
                needReconnect = connectionClose(connectionState)
            }
                
            if (needReconnect) {
                connect()
            }
        }

        // Credenciais
        if (events['creds.update']){
            await saveCreds()
        }

        // Receber mensagem
        if (events['messages.upsert']){
            const message = events['messages.upsert']

            if (isBotReady) {
                await messageReceived(client, message, botInfo, messagesCache)
            } else {
                queueEvent(eventsCache, "messages.upsert", message)
            }   
        }

        // Atualização de participantes no grupo
        if (events['group-participants.update']){
            const participantsUpdate = events['group-participants.update']

            if (isBotReady) {
                await groupParticipantsUpdated(client, participantsUpdate, botInfo)
            } else {
                queueEvent(eventsCache, "group-participants.update", participantsUpdate)
            }     
        }
        
        // Novo grupo
        if (events['groups.upsert']){
            const groups = events['groups.upsert']

            if (isBotReady) {
                await addedOnGroup(client, groups, botInfo)
            } else {
                queueEvent(eventsCache, "groups.upsert", groups)
            }       
        }

        // Atualização parcial de dados do grupo
        if (events['groups.update']){
            const groups = events['groups.update']

            if (groups.length == 1 && groups[0].participants == undefined){
                if (isBotReady) {
                    await partialGroupUpdate(groups[0])
                } else {
                    queueEvent(eventsCache, "groups.update", groups)
                }
            }
        }
    })
}