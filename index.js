const { create, Client } = require('@open-wa/wa-automate')
const {criarArquivosJson} = require('./lib/functions')
const options = require('./options')
const msgHandler = require('./msgHndlr')

const start = async (client = new Client()) => {
        console.log('[SERVIDOR] Servidor iniciado!')
        await criarArquivosJson()
        const welcome = require('./lib/welcome')
        const anti_link = require('./lib/antilink')
        const anti_flood = require('./lib/antiflood')
        
        // Force it to keep the current session
        client.onStateChanged((state) => {
            console.log('[Cliente Status]', state)
            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
        })
        // listening on message
        client.onMessage((async (message) => {
            client.getAmountOfLoadedMessages()
            .then((msg) => {
                if (msg >= 3000) {
                    client.cutMsgCache()
                }
            })

            anti_link(client,message)
            anti_flood(client,message)
            msgHandler(client, message)
        }))

        client.onGlobalParicipantsChanged((async (ev) => {
            await welcome(client, ev)
        }))
        
        client.onAddedToGroup(((chat) => {
            let totalMem = chat.groupMetadata.participants.length
            const minMem = 1
            if (totalMem < minMem) { 
            	client.sendText(chat.id, `O grupo precisa de no mínimo ${minMem} para o bot ser convidado(Atualmente tem ${totalMem})`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            } else {
                client.sendText(chat.groupMetadata.id, `Saudações *${chat.contact.name}* se tiverem alguma dúvida só digitar !ajuda*`)
            }
        }))

        // listening on Incoming Call
        client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Não posso receber ligações.')
            .then(() => client.contactBlock(call.peerJid))
        }))
    }

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
