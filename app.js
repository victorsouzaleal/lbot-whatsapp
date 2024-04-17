//REQUERINDO MODULOS
import {makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore} from '@whiskeysockets/baileys'
import {messageData}  from './lib-baileys/mensagem.js'
import { Boom } from '@hapi/boom'
import moment from "moment-timezone"
import dotenv from 'dotenv'
import {criarArquivosNecessarios, criarTexto, consoleErro, corTexto} from'./lib/util.js'
import {verificacaoListaNegraGeral, verificarUsuarioListaNegra} from './lib/listaNegra.js'
import {adicionarParticipante, removerParticipante, atualizarGrupos, adicionarAdmin, removerAdmin, atualizacaoDadosGrupo} from './lib/atualizacaoGrupos.js'
import {inicioCadastrarGrupo, adicionadoCadastrarGrupo, removerGrupo} from './lib/cadastrarGrupo.js'
import * as db from './db-modulos/database.js'
import {checagemMensagem} from './lib/checagemMensagem.js'
import {chamadaComando} from './lib/chamadaComando.js'
import {recarregarContagem} from './lib/recarregarContagem.js'
import { obterMensagensTexto } from './lib/msgs.js' 
import {botStart} from './db-modulos/bot.js'
import {verificarEnv} from './lib/env.js'
import * as socket from './lib-baileys/socket-funcoes.js'
import * as socketdb from './lib-baileys/socket-db-funcoes.js'
import {antiFake} from './lib/antiFake.js'; import {bemVindo} from './lib/bemVindo.js'; import {antiLink} from './lib/antiLink.js'; import {antiFlood} from './lib/antiFlood.js'
import pino from 'pino'
import fs from 'fs-extra'

moment.tz.setDefault('America/Sao_Paulo')
dotenv.config()

async function connectToWhatsApp(){
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const store = makeInMemoryStore({})
    const c = makeWASocket({
        printQRInTerminal: true,
        auth:state,
        emitOwnEvents: false,
        keepAliveIntervalMs: 60000,
        logger: pino({level : "silent"}),
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
        }
    })
    const msgs_texto = obterMensagensTexto()

    store.bind(c.ev)

    //INICIO DO SERVIDOR
    c.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const erroCodigo = (new Boom(lastDisconnect.error))?.output?.statusCode
            if(lastDisconnect.error.message == "Comando"){
                consoleErro('A conexão com o WhatsApp foi encerrada pelo comando do Administrador.', "DESCONECTADO")
            } else if(lastDisconnect.error.message == "arquivos"){
                consoleErro('O bot foi encerrado para criação de arquivos necessários, inicie novamente.', "DESCONECTADO")
            } else if( lastDisconnect.error.message == "erro_geral"){
                consoleErro('A conexão com o WhatsApp foi encerrada devido a uma falha grave no código.', "DESCONECTADO")
            } else {
                if(erroCodigo == DisconnectReason?.loggedOut){
                    fs.rmSync("./auth_info_baileys", {recursive: true, force: true})
                    consoleErro('A sua sessão com o WhatsApp foi deslogada, leia o código QR novamente.', "DESCONECTADO")
                } else if(erroCodigo == DisconnectReason?.restartRequired){
                    consoleErro('A sua conexão com o WhatsApp precisa ser reiniciada, tentando reconectar...', "DESCONECTADO")
                } else {
                    consoleErro(`A sua conexão com o WhatsApp foi encerrada, tentando reconectar... Motivo : ${erroCodigo} - ${lastDisconnect.error.message}`, "DESCONECTADO")
                }
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            //VERIFICA SE É NECESSÁRIO CRIAR ALGUM TIPO DE ARQUIVO NECESSÁRIO
            let necessitaCriar = await criarArquivosNecessarios()
            if(necessitaCriar){
                console.log(corTexto(msgs_texto.inicio.arquivos_criados))
                setTimeout(()=>{
                    c.ev.removeAllListeners()
                    return c.end(new Error("arquivos"))
                },3000)
            } else {
                try{
                    await socket.getAllGroups(c)
                    //Pegando hora de inicialização do BOT e o número do telefone.
                    console.log(corTexto(await botStart(c)))
                    //Verificando se os campos do .env foram modificados e envia para o console
                    verificarEnv()
                    console.log('[SERVIDOR] Servidor iniciado!')
                    console.log('[ATUALIZAÇÃO] Atualizando e verificando os dados dos grupos.')
                } catch(err){
                    consoleErro(err, "Inicialização")
                    c.end(new Error("erro_geral"))
                }

            }
        }
    })

    // Ao receber novas mensagens
    c.ev.on('messages.upsert', async(m) => {
        try{
            switch (m.type) {
                case "notify":
                    if(m.messages[0].message == undefined) return
                    const messageTranslated = await messageData(m)
                    const {broadcast} = messageTranslated
                    if(broadcast) return
                    if(!await antiLink(c, messageTranslated)) return
                    if(!await antiFlood(c, messageTranslated)) return
                    if(!await checagemMensagem(c, messageTranslated)) return
                    await chamadaComando(c, messageTranslated)
                    break
                case "append":
                    break
            }
        } catch(err){
            consoleErro(err, "MESSAGES.UPSERT")
            c.end(new Error("erro_geral"))
        }
    })

    //Ao haver mudanças nos participantes de um grupo
    c.ev.on('group-participants.update', async (event)=>{
        try{
            const isBotUpdate = event.participants[0] == await socketdb.getHostNumberFromBotJSON()
            const g_info = await socketdb.getGroupInfoFromDb(event.id)
            if (event.action == 'add') {
                //SE O PARTICIPANTE ESTIVER NA LISTA NEGRA, EXPULSE
                if(!await verificarUsuarioListaNegra(c,event)) return
                //ANTIFAKE
                if(!await antiFake(c,event,g_info)) return
                //BEM-VINDO
                await bemVindo(c,event,g_info)
                //CONTADOR
                if(g_info.contador) await db.registrarContagem(event.id, event.participants[0])
                await adicionarParticipante(event.id, event.participants[0])
            } else if(event.action == "remove"){
                if(isBotUpdate){
                    if(g_info?.contador) await db.removerContagemGrupo(event.id)
                    await removerGrupo(event.id)
                } else{
                    await removerParticipante(event.id, event.participants[0])
                    if(g_info?.contador) await db.removerContagem(event.id, event.participants[0])
                }
            } else if(event.action == "promote"){
                await adicionarAdmin(event.id, event.participants[0])
            } else if(event.action == "demote"){
                await removerAdmin(event.id, event.participants[0])
            }
        } catch(err){
            consoleErro(err, "GROUP-PARTICIPANTS.UPDATE")
            c.end(new Error("erro_geral"))
        }
    })

    //Ao ser adicionado em novos grupos
    c.ev.on('groups.upsert', async (groupData)=>{
        try{
            await adicionadoCadastrarGrupo(groupData[0])
            await socket.sendText(c, groupData[0].id, criarTexto(msgs_texto.geral.entrada_grupo, groupData[0].subject)).catch(()=>{})
        } catch(err){
            consoleErro(err, "GROUPS.UPSERT")
        }
    })

    
    c.ev.on('groups.update', async(groupsUpdate)=>{
        try{
            if(groupsUpdate.length != 0 && groupsUpdate[0].participants != undefined ){
                //Cadastro de grupos
                console.log(corTexto(await inicioCadastrarGrupo(groupsUpdate)))
                //Atualização dos participantes dos grupos
                console.log(corTexto(await atualizarGrupos(groupsUpdate)))
                //Verificar lista negra dos grupos
                console.log(corTexto(await verificacaoListaNegraGeral(c, groupsUpdate)))
                //Atualização da contagem de mensagens
                console.log(corTexto(await recarregarContagem(groupsUpdate)))
            } else if (groupsUpdate.length == 1 && groupsUpdate[0].participants == undefined){
                await atualizacaoDadosGrupo(groupsUpdate[0])
            }
        } catch(err){
            consoleErro(err, "GROUPS.UPDATE")
        }
    })

    // Credenciais
    c.ev.on ('creds.update', saveCreds)
}


// Execução principal
connectToWhatsApp()
