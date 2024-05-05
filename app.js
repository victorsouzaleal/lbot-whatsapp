//REQUERINDO MODULOS
import {makeWASocket, useMultiFileAuthState} from '@whiskeysockets/baileys'
import {atualizarConexao, receberMensagem, adicionadoEmGrupo, atualizacaoParticipantesGrupo, atualizacaoDadosGrupo, atualizacaoDadosGrupos, realizarEventosEspera} from './baileys/acoesEventosSocket.js'
import configSocket from './baileys/configSocket.js'
import moment from "moment-timezone"
import dotenv from 'dotenv'

moment.tz.setDefault('America/Sao_Paulo')
dotenv.config()

async function connectToWhatsApp(){
    let inicializacaoCompleta = false, eventosEsperando = []
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const c = makeWASocket(configSocket(state))

    //Status da conexão
    c.ev.on('connection.update', async (update) => {
        let necessarioReconectar = await atualizarConexao(c, update)
        if(necessarioReconectar) connectToWhatsApp()
    })

    // Ao receber novas mensagens
    c.ev.on('messages.upsert', async(m) => {
        if(inicializacaoCompleta) await receberMensagem(c, m)
        else eventosEsperando.push({evento: 'messages.upsert', dados: m})
    })

    //Ao haver mudanças nos participantes de um grupo
    c.ev.on('group-participants.update', async (event)=>{
        if(inicializacaoCompleta) await atualizacaoParticipantesGrupo(c, event)
        else eventosEsperando.push({evento: 'group-participants.update', dados: event})
    })

    //Ao ser adicionado em novos grupos
    c.ev.on('groups.upsert', async (groupData)=>{
        if(inicializacaoCompleta) await adicionadoEmGrupo(c, groupData)
        else eventosEsperando.push({evento: 'groups.upsert', dados: groupData})
    })

    //Ao atualizar dados do grupo
    c.ev.on('groups.update', async(groupsUpdate)=>{
        if(!groupsUpdate.length) inicializacaoCompleta = true
        if(groupsUpdate.length != 0 && groupsUpdate[0].participants != undefined ){
            inicializacaoCompleta = await atualizacaoDadosGrupos(c, groupsUpdate)
            await realizarEventosEspera(c, eventosEsperando)
        } else if (groupsUpdate.length == 1 && groupsUpdate[0].participants == undefined){
            if(inicializacaoCompleta) await atualizacaoDadosGrupo(groupsUpdate[0])
            else eventosEsperando.push({evento: 'groups.update', dados: groupsUpdate})
        }
    })

    // Credenciais
    c.ev.on ('creds.update', saveCreds)
}


// Execução principal
connectToWhatsApp()
