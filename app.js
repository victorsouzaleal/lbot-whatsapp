//REQUERINDO MODULOS
import {makeWASocket, useMultiFileAuthState, makeInMemoryStore} from '@whiskeysockets/baileys'
import {atualizarConexao, receberMensagem, adicionadoEmGrupo, atualizacaoParticipantesGrupo, atualizacaoDadosGrupo, atualizacaoDadosGrupos} from './baileys/acoesEventosSocket.js'
import configSocket from './baileys/configSocket.js'
import moment from "moment-timezone"
import dotenv from 'dotenv'

moment.tz.setDefault('America/Sao_Paulo')
dotenv.config()

async function connectToWhatsApp(){
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const store = makeInMemoryStore({})
    const c = makeWASocket(configSocket(state, store))
    var gruposVerificados = false

    store.bind(c.ev)

    //Status da conexão
    c.ev.on('connection.update', async (update) => {
        let necessarioReconectar = await atualizarConexao(c, update)
        if(necessarioReconectar) connectToWhatsApp()
    })


    // Ao receber novas mensagens
    c.ev.on('messages.upsert', async(m) => {
        if(gruposVerificados){
            await receberMensagem(c, m)
        }
    })

    //Ao haver mudanças nos participantes de um grupo
    c.ev.on('group-participants.update', async (event)=>{
        await atualizacaoParticipantesGrupo(c, event)
    })

    //Ao ser adicionado em novos grupos
    c.ev.on('groups.upsert', async (groupData)=>{
        await adicionadoEmGrupo(c, groupData)
    })

    //Ao atualizar dados do grupo
    c.ev.on('groups.update', async(groupsUpdate)=>{
        if(groupsUpdate.length != 0 && groupsUpdate[0].participants != undefined ){
            gruposVerificados = await atualizacaoDadosGrupos(c, groupsUpdate)
        } else if (groupsUpdate.length == 1 && groupsUpdate[0].participants == undefined){
            await atualizacaoDadosGrupo(c, groupsUpdate)
        }
    })

    // Credenciais
    c.ev.on ('creds.update', saveCreds)
}


// Execução principal
connectToWhatsApp()
