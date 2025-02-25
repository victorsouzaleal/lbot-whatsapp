import {WASocket, BaileysEvent} from 'baileys'
import NodeCache from 'node-cache'

export async function executeEventQueue(client: WASocket, eventsCache: NodeCache){
    const eventsQueue = eventsCache.get("events") as {event: BaileysEvent, data: any}[]
    for (let ev of eventsQueue) {
        client.ev.emit(ev.event, ev.data)
    }
    eventsCache.set("events", [])
}

export async function queueEvent(eventsCache: NodeCache, eventName: BaileysEvent, eventData: unknown){
    let queueArray = eventsCache.get("events") as {event: BaileysEvent, data: any}[]
    queueArray.push({event: eventName, data: eventData})
    eventsCache.set("events", queueArray)
}
