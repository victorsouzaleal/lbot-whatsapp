//REQUERINDO MODULOS
import {criarTexto, consoleComando} from './util.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import moment from "moment-timezone"
import {grupo as grupoComandos} from '../comandos/grupo.js'
import {utilidades as utilidadesComandos} from '../comandos/utilidades.js'
import {diversao as diversaoComandos} from '../comandos/diversao.js'
import {admin as adminComandos} from '../comandos/admin.js'
import {info as infoComandos} from '../comandos/info.js'
import {figurinhas as figurinhasComandos, autoSticker} from '../comandos/figurinhas.js'
import {downloads as downloadsComandos} from '../comandos/downloads.js'
import {comandosInfo, verificarComandoExiste, obterGuiaComando} from '../comandos/comandos.js'
import PQueue from 'p-queue';
const queueMensagem = new PQueue({concurrency: 6, timeout: 60000})

export const chamadaComando = async (c, mensagemBaileys, botInfo) => {
    try {
        //Atribuição de valores
        const comandos_info = comandosInfo(botInfo)
        const {
            comando,
            args,
            mensagem_grupo,
            tipo,
            mensagem,
            id_chat,
            nome_usuario,
            grupo
        } = mensagemBaileys
        const {nome : nome_grupo} = {...grupo}
        const t = moment.now()
        const msgGuia = (!args.length) ? false : args[0] === "guia"
        const queueMensagemEspera = queueMensagem.size > 10

        //Verificação do Auto-Sticker
        const autoStickerPv = (!mensagem_grupo && (tipo == MessageTypes.image || tipo == MessageTypes.video) && botInfo.autosticker)
        const autoStickerGrupo = (mensagem_grupo && (tipo == MessageTypes.image || tipo == MessageTypes.video) && grupo?.autosticker)

        //Verificação se há mensagens em espera na fila
        if(queueMensagemEspera) await socket.responderTexto(c, id_chat, criarTexto(comandos_info.outros.fila_comando, queueMensagem.size), mensagem)
        
        //Chamadas de comandos
        if(verificarComandoExiste(botInfo, comando, 'utilidades')){
            //UTILIDADES
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c,id_chat, obterGuiaComando("utilidades", comando, botInfo), mensagem)
                await utilidadesComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "UTILIDADES", comando, "#de9a07", t, nome_usuario, nome_grupo)
            }, {priority: 1})
        }  else if(verificarComandoExiste(botInfo, comando, 'figurinhas')){
            //FIGURINHAS
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c,id_chat, obterGuiaComando("figurinhas", comando, botInfo), mensagem)
                await figurinhasComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "FIGURINHAS", comando, "#ae45d1", t, nome_usuario, nome_grupo)
            }, {priority: 2})
        } else if(verificarComandoExiste(botInfo, comando, 'downloads')){
            //DOWNLOADS
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, obterGuiaComando("downloads", comando, botInfo), mensagem)
                await downloadsComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "DOWNLOADS", comando, "#2195cf", t, nome_usuario, nome_grupo)
            }, {priority: 1})
        } else if (verificarComandoExiste(botInfo, comando, 'grupo')){
            //GRUPO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, obterGuiaComando("grupo", comando, botInfo), mensagem)
                await grupoComandos(c, mensagemBaileys, botInfo)
                if(mensagem_grupo) consoleComando(mensagem_grupo, "ADMINISTRAÇÃO", comando, "#e0e031", t, nome_usuario, nome_grupo)
            }, {priority: 3})
        } else if(verificarComandoExiste(botInfo, comando, 'diversao')){
            //DIVERSÃO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, obterGuiaComando("diversao", comando, botInfo), mensagem)
                await diversaoComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "DIVERSÃO", comando, "#22e3dd", t, nome_usuario, nome_grupo)
            }, {priority: 2})
        } else if(verificarComandoExiste(botInfo, comando, 'admin')){
            //ADMIN
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, obterGuiaComando("admin", comando, botInfo), mensagem)
                await adminComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "DONO", comando, "#d1d1d1", t, nome_usuario, nome_grupo)
            }, {priority: 4})
        } else if(verificarComandoExiste(botInfo, comando, 'info')){
            //INFO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, obterGuiaComando("info", comando, botInfo), mensagem)
                await infoComandos(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "INFO", comando, "#8ac46e", t, nome_usuario, nome_grupo)
            }, {priority: 3})
        } else if(autoStickerPv || autoStickerGrupo){
            //AUTO-STICKER PV OU GRUPO
            queueMensagem.add(async()=>{
                await autoSticker(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, nome_usuario, nome_grupo)
            }, {priority: 2})
        }

    } catch (err) {
        err.message = `chamadaComando - ${err.message}`
        throw err
    }
}
