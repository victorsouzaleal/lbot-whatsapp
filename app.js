//REQUERINDO MODULOS
import {makeWASocket, useMultiFileAuthState} from '@whiskeysockets/baileys'
import {conexaoAberta, conexaoEncerrada, receberMensagem, adicionadoEmGrupo, atualizacaoParticipantesGrupo, atualizacaoDadosGrupo, atualizacaoDadosGrupos, realizarEventosEspera} from './bot/baileys/acoesEventosSocket.js'
import {BotControle} from './bot/controles/BotControle.js'
import configSocket from './bot/baileys/configSocket.js'
import moment from "moment-timezone"
moment.tz.setDefault('America/Sao_Paulo')
import ffmpeg from 'fluent-ffmpeg'
import('@ffmpeg-installer/ffmpeg').then((ffmpegInstaller)=>{
    ffmpeg.setFfmpegPath(ffmpegInstaller.path)
}).catch(()=>{})

async function connectToWhatsApp(){
    let inicializacaoCompleta = false, eventosEsperando = []
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const c = makeWASocket(configSocket(state))
    const bot = new BotControle()

    c.ev.process(async(events)=>{
        //Obtendo dados do bot
        const botInfo  = await bot.obterInformacoesBot()

        //Atualização na conexão
        if(events['connection.update']){
            const update = events['connection.update']
            const { connection } = update
            let necessarioReconectar = false
            if(connection == 'open'){
                await conexaoAberta(c, botInfo)
            } else if (connection == 'close'){
                necessarioReconectar = await conexaoEncerrada(update, botInfo)
            }
            if(necessarioReconectar) connectToWhatsApp()
        }

        // Atualização nas credenciais
        if(events['creds.update']){
            await saveCreds()
        }

        // Ao receber novas mensagens
        if(events['messages.upsert']){
            const m = events['messages.upsert']
            if(inicializacaoCompleta) await receberMensagem(c, m, botInfo)
            else eventosEsperando.push({evento: 'messages.upsert', dados: m})
        }

        //Ao haver mudanças nos participantes de um grupo
        if(events['group-participants.update']){
            const atualizacao = events['group-participants.update']
            if(inicializacaoCompleta) await atualizacaoParticipantesGrupo(c, atualizacao, botInfo)
            else eventosEsperando.push({evento: 'group-participants.update', dados: atualizacao})
        }

        //Ao ser adicionado em novos grupos
        if(events['groups.upsert']){
            const grupo = events['groups.upsert']
            if(inicializacaoCompleta) await adicionadoEmGrupo(c, grupo, botInfo)
            else eventosEsperando.push({evento: 'groups.upsert', dados: grupo})
        }

        //Ao atualizar dados do grupo
        if(events['groups.update']){
            const grupos = events['groups.update']
            if(!grupos.length) inicializacaoCompleta = true
            if(grupos.length != 0 && grupos[0].participants != undefined ){
                inicializacaoCompleta = await atualizacaoDadosGrupos(c, grupos, botInfo)
                await realizarEventosEspera(c, eventosEsperando)
            } else if (grupos.length == 1 && grupos[0].participants == undefined){
                if(inicializacaoCompleta) await atualizacaoDadosGrupo(grupos[0])
                else eventosEsperando.push({evento: 'groups.update', dados: grupos})
            }
        }

    })
}

// Execução principal
connectToWhatsApp()
