import {DisconnectReason} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import {criarTexto, consoleErro, corTexto} from'../lib/util.js'
import {criarArquivosNecessarios, verificarNumeroDono}  from '../lib/verificacaoInicialArquivos.js'
import { obterMensagensTexto } from '../lib/msgs.js' 
import fs from "fs-extra"
import * as socket from './socket-funcoes.js'
import * as socketdb from './socket-db-funcoes.js'
import {botStart} from '../db-modulos/bot.js'
import {verificarEnv} from '../lib/verificacaoInicialArquivos.js'
import {converterMensagem, tiposPermitidosMensagens}  from './mensagem.js'
import {antiFake} from '../lib/antiFake.js'; import {bemVindo} from '../lib/bemVindo.js'; import {antiLink} from '../lib/antiLink.js'; import {antiFlood} from '../lib/antiFlood.js'
import {checagemMensagem} from '../lib/checagemMensagem.js'
import {chamadaComando} from '../lib/chamadaComando.js'
import {inicioCadastrarGrupo, adicionadoCadastrarGrupo, removerGrupo} from '../lib/cadastrarGrupo.js'
import {verificacaoListaNegraGeral, verificarUsuarioListaNegra} from '../lib/listaNegra.js'
import {adicionarParticipante, removerParticipante, atualizarGrupos, adicionarAdmin, removerAdmin, atualizarDadosGrupo} from '../lib/atualizacaoGrupos.js'
import * as gruposdb from '../db-modulos/grupos.js'
import {recarregarContagem} from '../lib/recarregarContagem.js'

export const atualizarConexao = async (c, conexao)=>{
    const msgs_texto = obterMensagensTexto()
    const { connection, lastDisconnect } = conexao
    var reconectar = false
    if(connection === 'close') {
        const erroCodigo = (new Boom(lastDisconnect.error))?.output?.statusCode
        if(lastDisconnect.error.message == "Comando"){
            consoleErro(msgs_texto.geral.desconectado.comando, "DESCONECTADO")
        } else if(lastDisconnect.error.message == "arquivos"){
            consoleErro(msgs_texto.geral.desconectado.arquivos, "DESCONECTADO")
        } else if( lastDisconnect.error.message == "erro_geral"){
            consoleErro(msgs_texto.geral.desconectado.falha_grave, "DESCONECTADO")
        } else {
            if(erroCodigo == DisconnectReason?.loggedOut){
                fs.rmSync("../auth_info_baileys", {recursive: true, force: true})
                consoleErro(msgs_texto.geral.desconectado.deslogado, "DESCONECTADO")
            } else if(erroCodigo == DisconnectReason?.restartRequired){
                consoleErro(msgs_texto.geral.desconectado.reiniciar, "DESCONECTADO")
            } else {
                consoleErro(criarTexto(msgs_texto.geral.desconectado.conexao, erroCodigo, lastDisconnect.error.message), "DESCONECTADO")
            }
            reconectar = true
        }
    } else if(connection === 'open') {
        try{
            let necessitaCriar = await criarArquivosNecessarios()
            if(necessitaCriar){
                console.log(corTexto(msgs_texto.inicio.arquivos_criados))
                setTimeout(()=>{
                    c.ev.removeAllListeners()
                    return c.end(new Error("arquivos"))
                },3000)
            } else{
                await socket.getAllGroups(c)
                console.log(corTexto(await botStart(c)))
                verificarEnv()
                await verificarNumeroDono()
                console.log(msgs_texto.inicio.servidor_iniciado)
                console.log(msgs_texto.inicio.atualizacao_grupos)
            }
        } catch(err){
            consoleErro(err, "Inicialização")
            c.end(new Error("erro_geral"))
        }
        
    }
    return reconectar
}

export const receberMensagem = async (c, mensagem)=>{
    try{
        switch (mensagem.type) {
            case "notify":
                if(mensagem.messages[0].message == undefined) return
                const mensagemBaileys = await converterMensagem(mensagem)
                if(!tiposPermitidosMensagens.includes(mensagemBaileys.mensagem.type) || mensagemBaileys.mensagem.broadcast) return
                if(!await antiLink(c, mensagemBaileys)) return
                if(!await antiFlood(c, mensagemBaileys)) return
                if(!await checagemMensagem(c, mensagemBaileys)) return
                await chamadaComando(c, mensagemBaileys)
                break
            case "append":
                break
        }
    } catch(err){
        consoleErro(err, "MESSAGES.UPSERT")
        c.end(new Error("erro_geral"))
    }
}

export const adicionadoEmGrupo = async (c, dadosGrupo)=>{
    try{
        const msgs_texto = obterMensagensTexto()
        await adicionadoCadastrarGrupo(dadosGrupo[0])
        await socket.sendText(c, dadosGrupo[0].id, criarTexto(msgs_texto.geral.entrada_grupo, dadosGrupo[0].subject)).catch(()=>{})
    } catch(err){
        consoleErro(err, "GROUPS.UPSERT")
    }
}

export const atualizacaoParticipantesGrupo = async (c, evento)=>{
    try{
        const isBotUpdate = evento.participants[0] == await socketdb.getHostNumberFromBotJSON()
        const g_info = await socketdb.getGroupInfoFromDb(evento.id)
        if (evento.action == 'add') {
            //SE O PARTICIPANTE ESTIVER NA LISTA NEGRA, EXPULSE
            if(!await verificarUsuarioListaNegra(c,evento)) return
            //ANTIFAKE
            if(!await antiFake(c,evento,g_info)) return
            //BEM-VINDO
            await bemVindo(c,evento,g_info)
            //CONTADOR
            if(g_info.contador) await gruposdb.registrarContagem(evento.id, evento.participants[0])
            await adicionarParticipante(evento.id, evento.participants[0])
        } else if(evento.action == "remove"){
            if(isBotUpdate){
                if(g_info?.contador) await gruposdb.removerContagemGrupo(evento.id)
                await removerGrupo(evento.id)
            } else{
                await removerParticipante(evento.id, evento.participants[0])
                if(g_info?.contador) await gruposdb.removerContagem(evento.id, evento.participants[0])
            }
        } else if(evento.action == "promote"){
            await adicionarAdmin(evento.id, evento.participants[0])
        } else if(evento.action == "demote"){
            await removerAdmin(evento.id, evento.participants[0])
        }
    } catch(err){
        consoleErro(err, "GROUP-PARTICIPANTS.UPDATE")
        c.end(new Error("erro_geral"))
    }
}

export const atualizacaoDadosGrupos = async (c, novosDadosGrupo)=>{
    try{
        //Cadastro de grupos
        console.log(corTexto(await inicioCadastrarGrupo(novosDadosGrupo)))
        //Atualização dos participantes dos grupos
        console.log(corTexto(await atualizarGrupos(novosDadosGrupo)))
        //Verificar lista negra dos grupos
        console.log(corTexto(await verificacaoListaNegraGeral(c, novosDadosGrupo)))
        //Atualização da contagem de mensagens
        console.log(corTexto(await recarregarContagem(novosDadosGrupo)))
        return true
    } catch(err){
        consoleErro(err, "GROUPS.UPDATE")
    }
}

export const atualizacaoDadosGrupo = async (novosDadosGrupo)=>{
    try{
        await atualizarDadosGrupo(novosDadosGrupo[0])
    } catch(err){
        consoleErro(err, "GROUPS.UPDATE")
    }
}


