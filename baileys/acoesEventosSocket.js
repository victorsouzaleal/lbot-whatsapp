import {DisconnectReason} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import {criarTexto, consoleErro, corTexto} from'../lib/util.js'
import {criarArquivosNecessarios, verificarNumeroDono}  from '../lib/verificacaoInicialArquivos.js'
import { obterMensagensTexto } from '../lib/msgs.js' 
import fs from "fs-extra"
import * as socket from './socket-funcoes.js'
import {verificarEnv} from '../lib/verificacaoInicialArquivos.js'
import {converterMensagem, tiposPermitidosMensagens}  from './mensagem.js'
import {checagemMensagem} from '../lib/checagemMensagem.js'
import {chamadaComando} from '../lib/chamadaComando.js'
import * as bot from '../controle/botControle.js'
import * as grupos from '../controle/gruposControle.js'

export const atualizarConexao = async (c, conexao)=>{
    const msgs_texto = await obterMensagensTexto()
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
                await bot.inicializarBot(c)
                await verificarEnv()
                await verificarNumeroDono()
                console.log(msgs_texto.inicio.servidor_iniciado)
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
                if(!await grupos.filtroAntiLink(c, mensagemBaileys)) return
                if(!await grupos.filtroAntiFlood(c, mensagemBaileys)) return
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
        await grupos.registrarGrupoAoSerAdicionado(dadosGrupo[0])
        await socket.sendText(c, dadosGrupo[0].id, criarTexto(msgs_texto.geral.entrada_grupo, dadosGrupo[0].subject)).catch(()=>{})
    } catch(err){
        consoleErro(err, "GROUPS.UPSERT")
    }
}

export const atualizacaoParticipantesGrupo = async (c, evento)=>{
    try{
        const isBotUpdate = evento.participants[0] == await bot.obterNumeroBot()
        const g_info = await grupos.obterGrupoInfo(evento.id)
        if (evento.action == 'add') {
            //SE O PARTICIPANTE ESTIVER NA LISTA NEGRA, EXPULSE
            if(!await grupos.verificarListaNegraUsuario(c,evento)) return
            //ANTIFAKE
            if(!await grupos.filtroAntiFake(c,evento,g_info)) return
            //BEM-VINDO
            await grupos.mensagemBemVindo(c,evento,g_info)
            //CONTADOR
            if(g_info.contador) await grupos.registrarContagemParticipante(evento.id, evento.participants[0])
            await grupos.adicionarParticipante(evento.id, evento.participants[0])
        } else if(evento.action == "remove"){
            if(isBotUpdate){
                if(g_info?.contador) await grupos.removerContagemGrupo(evento.id)
                await grupos.removerGrupo(evento.id)
            } else{
                await grupos.removerParticipante(evento.id, evento.participants[0])
                if(g_info?.contador) await grupos.removerContagemParticipante(evento.id, evento.participants[0])
            }
        } else if(evento.action == "promote"){
            await grupos.adicionarAdmin(evento.id, evento.participants[0])
        } else if(evento.action == "demote"){
            await grupos.removerAdmin(evento.id, evento.participants[0])
        }
    } catch(err){
        consoleErro(err, "GROUP-PARTICIPANTS.UPDATE")
        c.end(new Error("erro_geral"))
    }
}

export const atualizacaoDadosGrupos = async (c, novosDadosGrupo)=>{
    try{
        //Cadastro de grupos
        console.log(corTexto(await grupos.registrarGruposAoIniciar(novosDadosGrupo)))
        //Atualização dos participantes dos grupos
        console.log(corTexto(await grupos.atualizarDadosGruposInicio(novosDadosGrupo)))
        //Verificar lista negra dos grupos
        console.log(corTexto(await grupos.verificarListaNegraGeral(c, novosDadosGrupo)))
        //Atualização da contagem de mensagens
        console.log(corTexto(await grupos.atualizarContagemGrupos(novosDadosGrupo)))
        return true
    } catch(err){
        consoleErro(err, "GROUPS.UPDATE")
    }
}

export const realizarEventosEspera = async(c, eventosEsperando)=>{
    for(let ev of eventosEsperando) c.ev.emit(ev.evento, ev.dados)
}

export const atualizacaoDadosGrupo = async (dadosGrupo)=>{
    try{
        await grupos.atualizarDadosGrupoParcial(dadosGrupo)
    } catch(err){
        consoleErro(err, "GROUPS.UPDATE")
    }
}


