//REQUERINDO MODULOS
const fs = require('fs-extra')
const path = require("path")
const db = require('../db-modules/database')
const {botInfoUpdate, botLimitarComando, botInfo, botVerificarExpiracaoLimite,botLimitarMensagensPv} = require("../db-modules/bot")
const {verificarBloqueioGlobal, verificarBloqueioGrupo} = require("./bloqueioComandos")
const { criarTexto, removerNegritoComando, consoleErro} = require('./util')
const msgs_texto = require('./msgs')
const lista_comandos = JSON.parse(fs.readFileSync(path.resolve('comandos/comandos.json')))
const socket = require("../lib-translate/socket-functions")
const socketdb = require("../lib-translate/socket-db-functions")
const {MessageTypes}  = require("../lib-translate/message")

module.exports = checagemMensagem = async (c, messageTranslated) => {
    try {
        const {sender, isGroupMsg, type, caption, id, chatId, body, username} = messageTranslated
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const ownerNumber = process.env.NUMERO_DONO.trim()
        const isOwner = ownerNumber == sender.replace(/@s.whatsapp.net/g, '')
        const groupId = isGroupMsg ? chatId : ''
        const grupoInfo = isGroupMsg ? await socketdb.getGroupInfoFromDb(groupId) : null
        const groupAdmins = isGroupMsg ? grupoInfo.admins : null
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender) : false
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await socket.getBlockedIds(c)
        const isBlocked = blockedNumbers.includes(sender)
        const comandoExiste = (
            lista_comandos.utilidades.includes(command) ||
            lista_comandos.grupo.includes(command) || 
            lista_comandos.diversao.includes(command) ||
            lista_comandos.admin.includes(command) ||
            lista_comandos.info.includes(command) ||
            lista_comandos.figurinhas.includes(command) ||
            lista_comandos.downloads.includes(command)
        )

        //SE O PV DO BOT NÃO ESTIVER LIBERADO
        if(!isGroupMsg && !isOwner && !botInfo().pvliberado) return false

        //SE NÃO FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
        if (!isGroupMsg && isBlocked) return false

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, VERIFICA SE O USUARIO EXISTE NO CONTADOR , REGISTRA ELE E ADICIONA A CONTAGEM
        if(isGroupMsg && grupoInfo.contador.status) {
            await db.existeUsuarioContador(groupId,sender)
            await db.addContagem(groupId,sender,type)
        }

        //SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
        var registrado = await db.verificarRegistro(sender)
        if(!registrado) {
            if(isOwner) {
                await db.verificarDonoAtual(sender)
                await db.registrarDono(sender, username)
            }
            else {
                await db.registrarUsuario(sender, username)
            }
        } else {
            if(isOwner) await db.verificarDonoAtual(sender)       
        }

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //ATUALIZE NOME DO USUÁRIO 
            await db.atualizarNome(sender, username)

            //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
            if (isGroupMsg && isBlocked) return false

            //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
            if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return false

            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfo().limitecomandos.status){
                let usuario = await db.obterUsuario(sender)
                let limiteComando = await botLimitarComando(sender, usuario.tipo,isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await socket.reply(c,chatId, limiteComando.msg, id)
                    return false
                }
            }
            
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await verificarBloqueioGlobal(command) && !isOwner){
                await socket.reply(c, chatId, criarTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, command), id)
                return false
            }
            
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && await verificarBloqueioGrupo(command, groupId) && !isGroupAdmins) {
                await socket.reply(c,chatId,criarTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, command), id)
                return false
            }

            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfo().limite_diario.status){
                if(!lista_comandos.excecoes_contagem.includes(command) && !lista_comandos.admin.includes(command) && !lista_comandos.grupo.includes(command) && !lista_comandos.info.includes(command) && !msgGuia){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender)
                    if(!ultrapassou) {
                        await db.addContagemDiaria(sender) 
                    } else {
                        await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                        return false
                    }   
                } else {
                    await db.addContagemTotal(sender)
                    await botVerificarExpiracaoLimite()
                }
            } else {
                await db.addContagemTotal(sender)
            }
          
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await botInfoUpdate()

        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfo().limitarmensagens.status){
                let u = await db.obterUsuario(sender)
                let tipo_usuario_pv = u ? u.tipo : "bronze"
                let limitarMensagens = await botLimitarMensagensPv(sender, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    await socket.sendText(c, sender, limitarMensagens.msg)
                    await socket.contactBlock(c, sender)
                    return false
                }
            }
        }
        return true
    } catch (err) {
        err.message = `checagemMensagem - ${err.message}`
        throw err
    }
}
