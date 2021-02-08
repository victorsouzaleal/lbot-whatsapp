const { create, Client } = require('@open-wa/wa-automate')
const {criarArquivosNecessarios} = require('./lib/util')
const options = require('./options')
const msgHandler = require('./msgHndlr')
const {recarregarContagem} = require("./lib/recarregarContagem")
const {botStart} = require('./lib/bot')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const start = async (client = new Client()) => {
        console.log('[SERVIDOR] Servidor iniciado!')

        //VERIFICA SE É NECESSÁRIO CRIAR ALGUM TIPO DE ARQUIVO NECESSÁRIO
        let necessitaCriar = await criarArquivosNecessarios()
        if(necessitaCriar){
            console.log("Seus arquivos necessários foram criados, configure seu .env e inicie o aplicativo novamente.")
            return client.kill()
        }
        const eventosGrupo = require('./lib/eventosGrupo')
        const antiLink= require('./lib/antilink')
        const {antiFlood} = require('./lib/antiflood')
        const cadastrarGrupo = require('./lib/cadastrarGrupo')

        //Pegando hora de inicialização do BOT
        await botStart()
        
        //Recarregando contagem enquanto bot estava off
        recarregarContagem(client)

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
            await cadastrarGrupo(message)
            antiLink(client,message)
            antiFlood(client,message)
            msgHandler(client, message)
        }))

        client.onGlobalParticipantsChanged((async (ev) => {
            await cadastrarGrupo(ev,"add")
            await eventosGrupo(client, ev)
        }))
        
        client.onAddedToGroup((async (chat) => {
            await cadastrarGrupo(chat.id, "added")
            let totalMem = chat.groupMetadata.participants.length
            const minMem = 1
            if (totalMem < minMem) { 
            	client.sendText(chat.id, `O grupo precisa de no mínimo ${minMem} para o bot ser convidado(Atualmente tem ${totalMem})`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
            } else {
                client.sendText(chat.groupMetadata.id, `Saudações *${chat.contact.name}* se tiverem alguma dúvida só digitar *!ajuda*`)
            }
        }))

        // listening on Incoming Call
        client.onIncomingCall(( async (call) => {
            await client.sendText(call.peerJid, 'Não posso receber ligações, você sera bloqueado.').then(async ()=>{
                client.contactBlock(call.peerJid)
            })
        }))
    }

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
