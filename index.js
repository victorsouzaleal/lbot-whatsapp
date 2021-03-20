//REQUERINDO MODULOS
const moment = require("moment-timezone")
moment.tz.setDefault('America/Sao_Paulo')
require('dotenv').config()
const { create, Client } = require('@open-wa/wa-automate')
const {criarArquivosNecessarios, criarTexto} = require('./lib/util')
const {verificacaoListaNegraGeral} = require(`./lib/listaNegra`)
const {atualizarParticipantes} = require("./lib/controleParticipantes")
const color = require('./lib/color')
const options = require('./options')
const msgHandler = require('./msgHndlr')
const msgs_texto = require("./lib/msgs")
const recarregarContagem = require("./lib/recarregarContagem")
const schedule = require('node-schedule')
const {botStart} = require('./lib/bot')
const {verificarEnv} = require('./lib/env')

const start = async (client = new Client()) => {
    try{
        //VERIFICA SE É NECESSÁRIO CRIAR ALGUM TIPO DE ARQUIVO NECESSÁRIO
        let necessitaCriar = await criarArquivosNecessarios()
        if(necessitaCriar){
            console.log(color(msgs_texto.inicio.arquivos_criados))
            setTimeout(()=>{
                return client.kill()
            },10000)
        } else {
            const eventosGrupo = require('./lib/eventosGrupo')
            const antiLink = require('./lib/antiLink')
            const antiFlood = require('./lib/antiFlood')
            const cadastrarGrupo = require('./lib/cadastrarGrupo')

            //Pegando hora de inicialização do BOT
            console.log(color(await botStart()))
            //Cadastro de grupos
            console.log(color(await cadastrarGrupo("","inicio",client)))
            //Verificar lista negra dos grupos
            console.log(color(await verificacaoListaNegraGeral(client)))
            //Atualização dos participantes dos grupos
            console.log(color(await atualizarParticipantes(client)))
            //Atualização da contagem de mensagens
            console.log(color(await recarregarContagem(client)))
            //Verificando se os campos do .env foram modificados e envia para o console
            verificarEnv()

            //INICIO DO SERVIDOR
            console.log('[SERVIDOR] Servidor iniciado!')


            //RECARREGA A CADA 1HR PARA POUPAR MEMÓRIA RAM
            schedule.scheduleJob("0 */1 * * *", async()=>{
                await client.refresh()
            })

            // Forçando para continuar na sessão atual
            client.onStateChanged((state) => {
                console.log('[ESTADO CLIENTE]', state)
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
                await antiLink(client,message)
                await antiFlood(client,message)
                await msgHandler(client, message)
            }))

            //Ouvindo entrada/saida de participantes dos grupo
            client.onGlobalParticipantsChanged((async (ev) => {
                await eventosGrupo(client, ev)
            }))
            
            //Ouvindo se a entrada do BOT em grupos
            client.onAddedToGroup((async (chat) => {
                await cadastrarGrupo(chat.id, "added", client)
                let gInfo = await client.getGroupInfo(chat.id)
                client.sendText(chat.id, criarTexto(msgs_texto.geral.entrada_grupo, gInfo.title || ""))
            }))

            // Ouvindo ligações recebidas
            client.onIncomingCall(( async (call) => {
                await client.sendText(call.peerJid, msgs_texto.geral.sem_ligacoes).then(async ()=>{
                    client.contactBlock(call.peerJid)
                })
            }))

        } 
    } catch(err) {
        //Faça algo se der erro em alguma das funções acima
        console.error(color("[ERRO FATAL]","red"), err.message)
        setTimeout(()=>{
            return client.kill()
        },10000)
    }
}

create(options(false, start))
    .then(client => start(client))
    .catch((error) => console.log(error))
