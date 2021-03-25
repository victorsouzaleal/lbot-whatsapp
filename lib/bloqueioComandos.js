const path = require('path')
const fs = require('fs-extra')
const listaComandos = JSON.parse(fs.readFileSync(path.resolve('comandos/comandos.json')))
const msgs_texto = require('./msgs')
const {criarTexto} = require("./util")
const db = require('./database')
const {botInfo, botBloquearComando, botDesbloquearComando} = require('../lib/bot')

module.exports = {
    bloquearComandosGrupo: async (usuarioComandos, idGrupo)=>{
        var comandosBloqueados = [], grupoInfo = await db.obterGrupo(idGrupo), respostaBloqueio = msgs_texto.grupo.bcmd.resposta_titulo
        for(var comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(grupoInfo.block_cmds.includes(comando)){
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando)
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando)){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.nao_existe, comando)
            }
        }
        if(comandosBloqueados.length != 0) await db.addBlockedCmd(idGrupo, comandosBloqueados)
        return respostaBloqueio
    },

    desbloquearComandosGrupo: async (usuarioComandos, idGrupo)=>{
        var comandosDesbloqueados = [], grupoInfo = await db.obterGrupo(idGrupo), respostaDesbloqueio = msgs_texto.grupo.dcmd.resposta_titulo
        for(var comando of usuarioComandos){
            if(grupoInfo.block_cmds.includes(comando)) {
                comandosDesbloqueados.push(comando)
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }
        if(comandosDesbloqueados.length != 0) await db.removeBlockedCmd(idGrupo, comandosDesbloqueados)
        return respostaDesbloqueio
    },

    verificarBloqueioGrupo: async (comando, idGrupo)=>{
        var grupoInfo = await db.obterGrupo(idGrupo)
        return grupoInfo.block_cmds.includes(comando)
    },

    verificarMenuBloqueadoGrupo: ()=>{

    },

    bloquearComandosGlobal: async (usuarioComandos)=>{
        var comandosBloqueados = [], respostaBloqueio = msgs_texto.admin.bcmdglobal.resposta_titulo
        for(let comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(botInfo().bloqueio_cmds.includes(comando)){
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando)
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando) ){
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.nao_existe, comando)
            }
        }
        if(comandosBloqueados.length != 0) botBloquearComando(comandosBloqueados)
        return respostaBloqueio
    },

    desbloquearComandosGlobal: async (usuarioComandos)=>{
        var comandosDesbloqueados = [], respostaDesbloqueio = msgs_texto.admin.dcmdglobal.resposta_titulo
        for(let comando of usuarioComandos){
            if(botInfo().bloqueio_cmds.includes(comando)) {
                comandosDesbloqueados.push(comando)
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
            }
        }
        if(comandosDesbloqueados.length != 0)  botDesbloquearComando(comandosDesbloqueados)
        return respostaDesbloqueio
    },

    verificarBloqueioGlobal: async (comando)=>{
        return botInfo().bloqueio_cmds.includes(comando)
    },

    verificarMenuBloqueadoGlobal: ()=>{

    },
}