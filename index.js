const { create, Client } = require('@open-wa/wa-automate')
const {criarArquivosNecessarios, preencherTexto,verificarConfigEnv} = require('./lib/util')
const {atualizarParticipantesInicio} = require("./lib/atualizarParticipantes")
const cadastrarGrupo = require("./lib/cadastrarGrupo")
const color = require('./lib/color')
const options = require('./options')
const msgHandler = require('./msgHndlr')
const {msgs_texto} = require("./lib/msgs")
const {recarregarContagem} = require("./lib/recarregarContagem")
const {botStart} = require('./lib/bot')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const start = async (client = new Client()) => {
        //VERIFICA SE É NECESSÁRIO CRIAR ALGUM TIPO DE ARQUIVO NECESSÁRIO
        let necessitaCriar = await criarArquivosNecessarios()
        if(necessitaCriar){
            console.log(color(msgs_texto.inicio.arquivos_criados))
            setTimeout(()=>{
                return client.kill()
            },10000)
        } else {
            const eventosGrupo = require('./lib/eventosGrupo')
            const antiLink= require('./lib/antilink')
            const {antiFlood} = require('./lib/antiflood')
            const cadastrarGrupo = require('./lib/cadastrarGrupo')

            //Pegando hora de inicialização do BOT
            botStart().then(resp=>{
                console.log(color(resp))
            })

            //Cadastrar grupos
            cadastrarGrupo("","inicio",client).then(resp=>{
                console.log(color(resp))

                //Atualizando a lista de participantes dos grupos
                atualizarParticipantesInicio(client).then(resp=>{
                    console.log(color(resp))

                    //Recarregando contagem enquanto bot estava off
                    recarregarContagem(client).then(resp=>{
                        console.log(color(resp))

                        //Verificando se os campos do .env foram modificados e envia para o console
                        verificarConfigEnv()
                        console.log('[SERVIDOR] Servidor iniciado!')
                        
                        // Forçando para continuar na sessão atual
                        client.onStateChanged((state) => {
                            console.log('[Cliente Status]', state)
                            if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
                        })

                        // Ouvindo mensagens
                        client.onMessage((async (message) => {
                            client.getAmountOfLoadedMessages()
                            .then((msg) => {
                                if (msg >= 3000) {
                                    client.cutMsgCache()
                                }
                            })
                            antiLink(client,message)
                            antiFlood(client,message)
                            msgHandler(client, message)
                        }))

                        client.onGlobalParticipantsChanged((async (ev) => {
                            await eventosGrupo(client, ev)
                        }))
                        
                        client.onAddedToGroup((async (chat) => {
                            await cadastrarGrupo(chat.id, "added", client)
                            let totalMem = chat.groupMetadata.participants.length
                            const minMem = 1
                            if (totalMem < minMem) { 
                                client.sendText(chat.id, preencherTexto(msgs_texto.geral.min_membros, minMem, totalMem)).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
                            } else {
                                client.sendText(chat.groupMetadata.id, preencherTexto(msgs_texto.geral.entrada_grupo, chat.contact.name))
                            }
                        }))

                        // listening on Incoming Call
                        client.onIncomingCall(( async (call) => {
                            await client.sendText(call.peerJid, msgs_texto.geral.sem_ligacoes).then(async ()=>{
                                client.contactBlock(call.peerJid)
                            })
                        }))

                    })
                })
            })
        }
        
    }

create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
