//REQUERINDO MODULOS
const {makeWASocket, useMultiFileAuthState, DisconnectReason} = require('@whiskeysockets/baileys')
const { Boom } = require('@hapi/boom')
const moment = require("moment-timezone")
moment.tz.setDefault('America/Sao_Paulo')
require('dotenv').config()
const {criarArquivosNecessarios, criarTexto, consoleErro, corTexto} = require('./lib/util')
const {verificacaoListaNegraGeral, verificarUsuarioListaNegra} = require(`./lib/listaNegra`)
const {atualizarParticipantes, adicionarParticipante, removerParticipante} = require("./lib/controleParticipantes")
const db = require('./lib/database')
const checagemMensagem = require("./lib/checagemMensagem")
const chamadaComando = require("./lib/chamadaComando")
const msgs_texto = require("./lib/msgs")
const recarregarContagem = require("./lib/recarregarContagem")
const {botStart} = require('./lib/bot')
const {verificarEnv} = require('./lib/env')
const client = require("./lib-translate/baileys")
const antiFake = require("./lib/antiFake"), bemVindo = require("./lib/bemVindo"), antiLink = require('./lib/antiLink'), antiFlood = require('./lib/antiFlood')
const pino  = require("pino")
const fs = require('fs-extra')
const cadastrarGrupo = require('./lib/cadastrarGrupo')

async function connectToWhatsApp(){
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys') 
    const c = makeWASocket({printQRInTerminal: true,auth:state,emitOwnEvents: false, defaultQueryTimeoutMs: undefined, logger: pino({level : "silent"})})//
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
                        return c.end(new Error("arquivos"))
                    },5000)
                } else {
                    try{
                        //Obtem os dados atualizados dos grupos
                        const groupsInfo = await client.getAllGroups(c)
                        //Cadastro de grupos
                        console.log(corTexto(await cadastrarGrupo(c,"inicio", undefined, groupsInfo)))
                        //Verificar lista negra dos grupos
                        console.log(corTexto(await verificacaoListaNegraGeral(c, groupsInfo)))
                        //Atualização dos participantes dos grupos
                        console.log(corTexto(await atualizarParticipantes(c, groupsInfo)))
                        //Atualização da contagem de mensagens
                        console.log(corTexto(await recarregarContagem(c, groupsInfo)))
                        //Pegando hora de inicialização do BOT
                        console.log(corTexto(await botStart()))
                        //Verificando se os campos do .env foram modificados e envia para o console
                        verificarEnv()
                        console.log('[SERVIDOR] Servidor iniciado!')
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
                        const messageTranslated = await client.messageData(c,m)
                        const {broadcast} = messageTranslated
                        if(broadcast) return
                        if(!await antiLink(c, messageTranslated)) return
                        if(!await antiFlood(c,m, messageTranslated)) return
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
                if(event.participants[0] == await client.getHostNumber(c)) return
                const g_info = await db.obterGrupo(event.id)
                if (event.action == 'add') {
                    //SE O PARTICIPANTE ESTIVER NA LISTA NEGRA, EXPULSE
                    if(!await verificarUsuarioListaNegra(c,event)) return
                    //ANTIFAKE
                    if(!await antiFake(c,event,g_info)) return
                    //BEM-VINDO
                    await bemVindo(c,event,g_info)
                    //CONTADOR
                    if(g_info.contador) await db.registrarContagem(event.id, event.participants[0])
                    //ATUALIZA A LISTA DE PARTICIPANTES NO BANDO DE DADOS
                    await adicionarParticipante(event.id, event.participants[0])
                } else if(event.action == "remove"){
                    //ATUALIZA A LISTA DE PARTICIPANTES NO BANDO DE DADOS
                    await removerParticipante(event.id, event.participants[0])
                    if(g_info.contador) await db.removerContagem(event.id, event.participants[0])
                }
            } catch(err){
                consoleErro(err, "GROUP-PARTICIPANTS.UPDATE")
                c.end(new Error("erro_geral"))
            }
        })

        //Ao ser adicionado em novos grupos
        c.ev.on('groups.upsert', async (groupData)=>{
            try{
                await cadastrarGrupo(c, "added", groupData[0])
                await client.sendText(c, groupData[0].id, criarTexto(msgs_texto.geral.entrada_grupo, groupData[0].subject))
            } catch(err){
                consoleErro(err, "GROUPS.UPSERT")
            }
        })

        // Credenciais
        c.ev.on ('creds.update', saveCreds)
}


// Execução principal
connectToWhatsApp()
