//REQUERINDO MODULOS
import {criarTexto, guiaComandoMsg, consoleComando} from './util.js'
import * as socket from '../baileys/socket.js'
import {MessageTypes} from '../baileys/mensagem.js'
import moment from "moment-timezone"
import {grupo} from '../comandos/grupo.js'; import {utilidades} from '../comandos/utilidades.js'; import {diversao} from '../comandos/diversao.js'; import {admin} from '../comandos/admin.js';
import {info} from '../comandos/info.js'; import {figurinhas, autoSticker} from '../comandos/figurinhas.js'; import {downloads} from '../comandos/downloads.js'
import {obterMensagensTexto} from './msgs.js'
import {listarComandos} from '../comandos/comandos.js'
import PQueue from 'p-queue';
const queueMensagem = new PQueue({concurrency: 6, timeout: 60000})

export const chamadaComando = async (c, mensagemBaileys, botInfo) => {
    try {
        const {prefixo} = botInfo
        const msgs_texto = obterMensagensTexto(botInfo), lista_comandos = listarComandos(prefixo)
        const {comando, args, mensagem_grupo, tipo, mensagem_completa, id_chat, nome_usuario, grupo} = mensagemBaileys
        const {nome : nome_grupo} = grupo ?? {}
        const t = moment.now()
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const queueMensagemEspera = queueMensagem.size > 10

        //Auto-Sticker
        const autoStickerPv = (!mensagem_grupo && (tipo == MessageTypes.image || tipo == MessageTypes.video) && botInfo.autosticker)
        const autoStickerGrupo = (mensagem_grupo && (tipo == MessageTypes.image || tipo == MessageTypes.video) && grupo?.autosticker)

        if(queueMensagemEspera) await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.geral.fila_comando, queueMensagem.size), mensagem_completa)
        if(lista_comandos.utilidades.includes(comando)){
            //UTILIDADES
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c,id_chat, guiaComandoMsg("utilidade", comando, prefixo), mensagem_completa)
                await utilidades(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "UTILIDADES", comando, "#de9a07", t, nome_usuario, nome_grupo)
            }, {priority: 1})
        }  else if(lista_comandos.figurinhas.includes(comando)){
            //FIGURINHAS
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c,id_chat, guiaComandoMsg("figurinhas", comando, prefixo), mensagem_completa)
                await figurinhas(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "FIGURINHAS", comando, "#ae45d1", t, nome_usuario, nome_grupo)
            }, {priority: 2})
        } else if(lista_comandos.downloads.includes(comando)){
            //DOWNLOADS
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, guiaComandoMsg("downloads", comando, prefixo), mensagem_completa)
                await downloads(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "DOWNLOADS", comando, "#2195cf", t, nome_usuario, nome_grupo)
            }, {priority: 1})
        } else if (lista_comandos.grupo.includes(comando)){
            //GRUPO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, guiaComandoMsg("grupo", comando, prefixo), mensagem_completa)
                //await grupo(c, mensagemBaileys, botInfo)
                if(mensagem_grupo) consoleComando(mensagem_grupo, "ADMINISTRAÇÃO", comando, "#e0e031", t, nome_usuario, nome_grupo)
            }, {priority: 3})
        } else if(lista_comandos.diversao.includes(comando)){
            //DIVERSÃO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, guiaComandoMsg("diversao", comando, prefixo), mensagem_completa)
                //await diversao(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "DIVERSÃO", comando, "#22e3dd", t, nome_usuario, nome_grupo)
            }, {priority: 2})
        } else if(lista_comandos.admin.includes(comando)){
            //ADMIN
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, guiaComandoMsg("admin", comando, prefixo), mensagem_completa)
                //await admin(c, mensagemBaileys, botInfo)
                consoleComando(mensagem_grupo, "DONO", comando, "#d1d1d1", t, nome_usuario, nome_grupo)
            }, {priority: 4})
        } else if(lista_comandos.info.includes(comando)){
            //INFO
            queueMensagem.add(async()=>{
                if(msgGuia) return await socket.responderTexto(c, id_chat, guiaComandoMsg("info", comando, prefixo), mensagem_completa)
                //await info(c, mensagemBaileys, botInfo)
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
