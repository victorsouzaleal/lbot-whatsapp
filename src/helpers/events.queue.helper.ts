import {WASocket, BaileysEvent} from 'baileys'
import NodeCache from 'node-cache'

export async function executeEventQueue(client: WASocket, eventsCache: NodeCache){
    const eventsQueue = eventsCache.get("events") as {event: BaileysEvent, data: any}[]

    for (let ev of eventsQueue) {
        client.ev.emit(ev.event, ev.data)
    }
    
    eventsCache.set("events", [])
}

export async function queueEvent(eventsCache: NodeCache, eventName: BaileysEvent, eventData: any){
    let queueArray = eventsCache.get("events") as {event: BaileysEvent, data: any}[]

    if (eventName == 'group-participants.update'){
        queueArray.forEach((queue) => {
            if (queue.event == 'group-participants.update' && queue.data.participants[0] == eventData.participants[0] && queue.data.id == eventData.id) {
                queueArray.splice(queueArray.indexOf(queue), 1)
            }
        })
    }

    if (eventName == 'groups.upsert'){
        queueArray.forEach((queue) => {
            if (queue.event == 'groups.upsert' && queue.data[0].id == eventData[0].id) {
                queueArray.splice(queueArray.indexOf(queue), 1)
            }
        })
    }

    queueArray.push({event: eventName, data: eventData})
    eventsCache.set("events", queueArray)
}
