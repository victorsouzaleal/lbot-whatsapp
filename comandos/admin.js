//REQUERINDO MODULOS
const menu = require('../lib/menu')
const moment = require("moment-timezone")
const { version } = require('../package.json');
const msgs_texto = require('../lib/msgs')
const {criarTexto,erroComandoMsg, removerNegritoComando, timestampParaData} = require('../lib/util')
const {desbloquearComandosGlobal, bloquearComandosGlobal} = require("../lib/bloqueioComandos")
const db = require('../lib/database')
const fs = require("fs-extra")
const path = require("path")
const {botAlterarLimitador, botInfo, botAlterarLimiteDiario, botQtdLimiteDiario, botAlterarLimitarMensagensPv} = require('../lib/bot')

module.exports = admin = async(client,message) => {
    try{
        const {id, from, sender, isGroupMsg, t, chat, caption, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const ownerNumber = process.env.NUMERO_DONO.trim()
        const isOwner = ownerNumber == sender.id.replace(/@c.us/g, '')
        if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)

        switch(command){
            case "!admin":
                await client.sendText(from, menu.menuAdmin())
                break

            case "!infocompleta":
                const foto_bot_url = await client.getProfilePicFromServer(botNumber+'@c.us')
                var info_bot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
                var limitediario_expiracao = timestampParaData(info_bot.limite_diario.expiracao * 1000)
                var botInicializacaoData = timestampParaData(info_bot.iniciado)
                var infocompleta_resposta = criarTexto(msgs_texto.admin.infocompleta.resposta_superior, info_bot.criador, info_bot.nome, botInicializacaoData, version)
                infocompleta_resposta += (info_bot.limite_diario.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.on,  limitediario_expiracao) : msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.off
                infocompleta_resposta += (info_bot.limitecomandos.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.on, info_bot.limitecomandos.cmds_minuto_max, info_bot.limitecomandos.tempo_bloqueio) : msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.off
                infocompleta_resposta += (info_bot.limitarmensagens.status) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.on, info_bot.limitarmensagens.max, info_bot.limitarmensagens.intervalo) : msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.off
                infocompleta_resposta += (info_bot.bloqueio_cmds.length != 0) ? criarTexto(msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.on, info_bot.bloqueio_cmds.toString()) : msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.off
                infocompleta_resposta += criarTexto(msgs_texto.admin.infocompleta.resposta_inferior, blockNumber.length, info_bot.cmds_executados, ownerNumber)
                if(foto_bot_url != undefined) await client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",infocompleta_resposta,id)
                else await client.reply(from, infocompleta_resposta, id)
                break
                
            case '!entrargrupo':
                if (args.length < 2) return client.reply(from, erroComandoMsg(command), id)
                var linkGrupo = args[1]
                var totalGrupos = await client.getAllGroups()
                var linkValido = linkGrupo.match(/(https:\/\/chat.whatsapp.com)/gi)
                var conviteInfo = await client.inviteInfo(linkGrupo)
                if (!linkValido) return client.reply(from, msgs_texto.admin.entrar_grupo.link_invalido, id)
                if (totalGrupos.length > 10) return client.reply(from, msgs_texto.admin.entrar_grupo.maximo_grupos, id)
                if (conviteInfo.size < 5) return client.reply(from, msgs_texto.admin.entrar_grupo.minimo_membros, id)
                if (conviteInfo.status === 200) {
                    await client.joinGroupViaLink(linkGrupo).then(() => client.reply(from, msgs_texto.admin.entrar_grupo.entrar_sucesso,id))
                } else {
                    await client.reply(from, msgs_texto.admin.entrar_grupo.link_invalido, id)
                }
                break

            case '!sair':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                await client.sendText(from, msgs_texto.admin.sair.sair_sucesso).then(async () =>{
                    await client.leaveGroup(groupId)
                }) 
                break

            case '!listablock':
                var listablock_resposta = criarTexto(msgs_texto.admin.listablock.resposta_titulo, blockNumber.length)
                for (let i of blockNumber) {
                    listablock_resposta += criarTexto(msgs_texto.admin.listablock.resposta_itens, i.replace(/@c.us/g,''))
                }
                await client.sendTextWithMentions(from, listablock_resposta, id)
                break

            case '!limpartudo':
                var chats = await client.getAllChats()
                for (var ch of chats) {
                    await client.deleteChat(ch.id)
                }
                await client.sendText(ownerNumber+"@c.us", msgs_texto.admin.limpar.limpar_sucesso)
                break
            
            case "!bcmdglobal":
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                var usuarioComandos = body.slice(12).split(" "), respostaBloqueio = await bloquearComandosGlobal(usuarioComandos)
                await client.reply(from, respostaBloqueio, id)
                break
            
            case "!dcmdglobal":
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                var usuarioComandos = body.slice(12).split(" "), respostaDesbloqueio = await desbloquearComandosGlobal(usuarioComandos)
                await client.reply(from, respostaDesbloqueio, id)
                break

            case '!limpar':
                var chats = await client.getAllChats()
                for (var ch of chats) {
                    if(ch.id.match(/@c.us/g) && ch.id != sender.id) await client.deleteChat(ch.id)
                }
                await client.sendText(ownerNumber+"@c.us", msgs_texto.admin.limpar.limpar_sucesso)
                break
                
            case '!rconfig':
                await db.resetarGrupos()
                await client.reply(from,msgs_texto.admin.rconfig.reset_sucesso,id)
                break

            case '!sairgrupos':
                var grupos = await client.getAllGroups()
                for (var grupo of grupos) await client.leaveGroup(grupo.contact.id)
                var resposta = criarTexto(msgs_texto.admin.sairtodos.resposta, grupos.length)
                await client.sendText(ownerNumber+"@c.us", resposta, id)
                break

            case "!bloquear":
                var usuarios_bloq = []
                if(quotedMsg){
                    usuarios_bloq.push(quotedMsgObj.author)
                } else if(mentionedJidList.length > 1) {
                    usuarios_bloq = mentionedJidList
                } else {
                    var numeroInserido = body.slice(10).trim()
                    if(numeroInserido.length == 0) return client.reply(from, erroComandoMsg(command), id)
                    usuarios_bloq.push(numeroInserido.replace(/\W+/g,"")+"@c.us")
                }
                for (let user_b of usuarios_bloq){
                    if(await client.getContact(user_b)){
                        if(ownerNumber == user_b.replace(/@c.us/g, '')){
                            await client.sendTextWithMentions(from, criarTexto(msgs_texto.admin.bloquear.erro_dono, user_b.replace(/@c.us/g, '')))
                        } else {
                            if(blockNumber.includes(user_b)) {
                                await client.sendTextWithMentions(from, criarTexto(msgs_texto.admin.bloquear.ja_bloqueado, user_b.replace(/@c.us/g, '')))
                            } else {
                                await client.contactBlock(user_b)
                                await client.sendTextWithMentions(from, criarTexto(msgs_texto.admin.bloquear.sucesso, user_b.replace(/@c.us/g, '')))
                            }
                        }
                    } else {
                        await client.reply(from, criarTexto(msgs_texto.admin.bloquear.erro, user_b.replace("@c.us","")), id)
                    }
                }
                break      

            case "!desbloquear":
                let usuarios_desbloq = []
                if(quotedMsg){
                    usuarios_desbloq.push(quotedMsgObj.author)
                } else if(mentionedJidList.length > 1) {
                    usuarios_desbloq = mentionedJidList
                } else {
                    var numeroInserido = body.slice(13).trim()
                    if(numeroInserido.length == 0) return client.reply(from, erroComandoMsg(command), id)
                    usuarios_desbloq.push(numeroInserido.replace(/\W+/g,"")+"@c.us")
                }
                for (let user_d of usuarios_desbloq){
                    if(!blockNumber.includes(user_d)) {
                        await client.sendTextWithMentions(from, criarTexto(msgs_texto.admin.desbloquear.ja_desbloqueado, user_d.replace(/@c.us/g,'')))
                    } else {
                        await client.contactUnblock(user_d)
                        await client.sendTextWithMentions(from, criarTexto(msgs_texto.admin.desbloquear.sucesso, user_d.replace(/@c.us/g,'')))
                    }
                }
                break

            case "!limitediario":
                var novoEstado = !botInfo().limite_diario.status
                if(novoEstado){
                    botAlterarLimiteDiario(true)
                    await client.reply(from, msgs_texto.admin.limitediario.ativado,id)
                } else {
                    botAlterarLimiteDiario(false)
                    await client.reply(from, msgs_texto.admin.limitediario.desativado,id)
                } 
                break

            case "!taxalimite":
                var novoEstado = !botInfo().limitecomandos.status
                if(novoEstado){
                    if(args.length !== 3) return client.reply(from,erroComandoMsg(command),id)
                    let qtd_max_minuto = args[1], tempo_bloqueio = args[2]
                    if(isNaN(qtd_max_minuto) || qtd_max_minuto < 3) return client.reply(from,msgs_texto.admin.limitecomandos.qtd_invalida,id)
                    if(isNaN(tempo_bloqueio) || tempo_bloqueio < 10) return client.reply(from,msgs_texto.admin.limitecomandos.tempo_invalido,id)
                    botAlterarLimitador(true,parseInt(qtd_max_minuto),parseInt(tempo_bloqueio))
                    await client.reply(from, msgs_texto.admin.limitecomandos.ativado,id)
                } else {
                    botAlterarLimitador(false)
                    await client.reply(from, msgs_texto.admin.limitecomandos.desativado,id)
                }
                break
            
            case "!limitarmsgs":
                var novoEstado = !botInfo().limitarmensagens.status
                if(novoEstado){
                    if(args.length !== 3) return client.reply(from,erroComandoMsg(command),id)
                    let max_msg = args[1], msgs_intervalo = args[2]
                    if(isNaN(max_msg) || max_msg < 3) return client.reply(from,msgs_texto.admin.limitarmsgs.qtd_invalida,id)
                    if(isNaN(msgs_intervalo) || msgs_intervalo < 10) return client.reply(from,msgs_texto.admin.limitarmsgs.tempo_invalido,id)
                    botAlterarLimitarMensagensPv(true,parseInt(max_msg),parseInt(msgs_intervalo))
                    await client.reply(from, msgs_texto.admin.limitarmsgs.ativado,id)
                } else {
                    botAlterarLimitarMensagensPv(false)
                    await client.reply(from, msgs_texto.admin.limitarmsgs.desativado,id)
                }
                break
            
            case "!mudarlimite":
                if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto.admin.mudarlimite.erro_limite_diario,id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
                var tipo = args[1].toLowerCase(), qtd = args[2]
                if(qtd != -1) if(isNaN(qtd) || qtd < 5) return client.reply(from, msgs_texto.admin.mudarlimite.invalido,id)
                var alterou = await botQtdLimiteDiario(tipo, parseInt(qtd))
                if(!alterou) return client.reply(from, msgs_texto.admin.mudarlimite.tipo_invalido,id)
                await client.reply(from, criarTexto(msgs_texto.admin.mudarlimite.sucesso, tipo.toUpperCase(), qtd == -1 ? "∞" : qtd), id)
                break
            
            case "!usuarios":
                if(args.length === 1) return await client.reply(from, erroComandoMsg(command), id)
                var tipo = args[1].toLowerCase()
                var usuarios = await db.obterUsuariosTipo(tipo)
                if(usuarios.length == 0) return await client.reply(from, msgs_texto.admin.usuarios.nao_encontrado, id)
                var respostaItens = ''
                for (var usuario of usuarios){
                    respostaItens += criarTexto(msgs_texto.admin.usuarios.resposta_item, usuario.nome, usuario.id_usuario.replace("@c.us", ""), usuario.comandos_total)
                }
                var resposta = criarTexto(msgs_texto.admin.usuarios.resposta_titulo, tipo.toUpperCase(), usuarios.length, respostaItens)
                await client.sendTextWithMentions(from, resposta)
                break

            case "!limpartipo":
                if(args.length === 1) return await client.reply(from, erroComandoMsg(command), id)
                var tipo = args[1].toLowerCase()
                var limpou = await db.limparTipo(tipo)
                if(!limpou) return await client.reply(from, msgs_texto.admin.limpartipo.erro, id)
                await client.reply(from, criarTexto(msgs_texto.admin.limpartipo.sucesso, tipo.toUpperCase()), id)
                break

            case "!alterartipo":
                if(args.length === 1) return await client.reply(from, erroComandoMsg(command), id)
                let usuario_tipo = ""
                if(quotedMsg){
                    usuario_tipo = quotedMsgObj.author
                } else if(mentionedJidList.length === 1){
                    usuario_tipo = mentionedJidList[0]
                } else if(args.length > 2){
                    usuario_tipo = args.slice(2).join("").replace(/\W+/g,"")+"@c.us"
                } else {
                    return await client.reply(from, erroComandoMsg(command),id)
                }

                if(ownerNumber == usuario_tipo.replace("@c.us","")) return await client.reply(from, msgs_texto.admin.alterartipo.tipo_dono,id)
                let c_registrado = await db.verificarRegistro(usuario_tipo)
                if(c_registrado){
                    var alterou = await db.alterarTipoUsuario(usuario_tipo, args[1])
                    if(!alterou) return await client.reply(msgs_texto.admin.alterartipo.tipo_invalido, id)
                    await client.reply(from, criarTexto(msgs_texto.admin.alterartipo.sucesso, args[1].toUpperCase()),id)
                } else {
                    await client.reply(from, msgs_texto.admin.alterartipo.nao_registrado,id)
                }
                break
        
            case "!tipos":
                var tipos = botInfo().limite_diario.limite_tipos, respostaTipos = ''
                for (var tipo in tipos){
                    respostaTipos += criarTexto(msgs_texto.admin.tipos.item_tipo, msgs_texto.tipos[tipo], tipos[tipo] || "∞")
                }
                await client.reply(from, criarTexto(msgs_texto.admin.tipos.resposta, respostaTipos), id)
                break
            
            case "!rtodos":
                if(!botInfo().limite_diario.status) return await client.reply(from, msgs_texto.admin.rtodos.erro_limite_diario,id)
                db.resetarComandosDia().then(async()=>{
                    await client.reply(from, msgs_texto.admin.rtodos.sucesso,id)
                })
                break

            case "!r":
                if(!botInfo().limite_diario.status) return await client.reply(from, msgs_texto.admin.r.erro_limite_diario,id)
                if(quotedMsg){
                    let r_registrado = await db.verificarRegistro(quotedMsgObj.author)
                    if(r_registrado){
                        await db.resetarComandosDiaUsuario(quotedMsgObj.author)
                        await client.reply(from, msgs_texto.admin.r.sucesso,id)
                    } else {
                        return await client.reply(from, msgs_texto.admin.r.nao_registrado,id)
                    }
                } else if (mentionedJidList.length === 1){
                    let r_registrado = await db.verificarRegistro(mentionedJidList[0])
                    if(r_registrado){
                        await db.resetarComandosDiaUsuario(mentionedJidList[0])
                        await client.reply(from, msgs_texto.admin.r.sucesso,id)
                    } else {
                        return await client.reply(from, msgs_texto.admin.r.nao_registrado,id)
                    }
                } else if(args.length >= 1){
                    let r_numero_usuario = ""
                    for (let i = 1; i < args.length; i++){
                        r_numero_usuario += args[i]
                    }
                    r_numero_usuario = r_numero_usuario.replace(/\W+/g,"")
                    let r_registrado = await db.verificarRegistro(r_numero_usuario+"@c.us")
                    if(r_registrado){
                        await db.resetarComandosDiaUsuario(r_numero_usuario+"@c.us")
                        await client.reply(from, msgs_texto.admin.r.sucesso,id)
                    } else {
                        return await client.reply(from, msgs_texto.admin.r.nao_registrado,id)
                    }
                } else {
                    return await client.reply(from, erroComandoMsg(command),id)
                }
                break  
                
            case "!verdados":
                let vd_usuario_consultado = "", vd_usuario = {}
                if(quotedMsg){
                    vd_usuario_consultado = quotedMsgObj.author
                } else if(mentionedJidList.length === 1){
                    vd_usuario_consultado = mentionedJidList[0]
                } else if(args.length >= 1){
                    vd_usuario_consultado =  args.slice(1).join("").replace(/\W+/g,"")+"@c.us"
                } else {
                    return client.reply(from, erroComandoMsg(command),id)
                }

                let vd_registrado = await db.verificarRegistro(vd_usuario_consultado)
                if(vd_registrado){
                    vd_usuario = await db.obterUsuario(vd_usuario_consultado)
                } else {
                    return client.reply(from,msgs_texto.admin.verdados.nao_registrado,id)
                }
                let max_comandos_vd = vd_usuario.max_comandos_dia || "Sem limite"
                vd_usuario.tipo = msgs_texto.tipos[vd_usuario.tipo]
                let vd_nome =  vd_usuario.nome || "Ainda não obtido"
                let verdados_resposta = criarTexto(msgs_texto.admin.verdados.resposta_superior, vd_nome, vd_usuario.tipo, vd_usuario.id_usuario.replace("@c.us",""))
                if(botInfo().limite_diario.status){
                    verdados_resposta += criarTexto(msgs_texto.admin.verdados.resposta_variavel.limite_diario.on, vd_usuario.comandos_dia, max_comandos_vd, max_comandos_vd)
                }
                verdados_resposta += criarTexto(msgs_texto.admin.verdados.resposta_inferior, vd_usuario.comandos_total)
                client.reply(from, verdados_resposta, id)
                break

            case '!bctodos':
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                var mensagem = body.slice(9).trim(), chatsId = await client.getAllChatIds(), bloqueados = await client.getBlockedIds()
                for (var chatId of chatsId) {
                    if(chatId.match(/@g.us/g)){
                        var chatInfo = await client.getChatById(chatId)
                        if (!chatInfo.isReadOnly) await client.sendText(chatId, criarTexto(msgs_texto.admin.bctodos.anuncio, mensagem))
                    } else {
                        if(!bloqueados.includes(chatId)) await client.sendText(chatId, criarTexto(msgs_texto.admin.bctodos.anuncio, mensagem))
                    }
                }
                await client.reply(from, msgs_texto.admin.bctodos.bc_sucesso , id)
                break

            case '!bccontatos':
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                var mensagem = body.slice(12).trim(), chatsId = await client.getAllChatIds(), bloqueados = await client.getBlockedIds()
                for (let chatId of chatsId) {
                    if(chatId.match(/@c.us/g) && !bloqueados.includes(chatId)) await client.sendText(chatId, criarTexto(msgs_texto.admin.bccontatos.anuncio, mensagem))
                }
                await client.reply(from, msgs_texto.admin.bccontatos.bc_sucesso , id)
                break
            
            case '!bcgrupos':
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                var mensagem = body.slice(10).trim(), chatsId = await client.getAllChatIds()
                for (var chatId of chatsId) {
                    if(chatId.match(/@g.us/g)){
                        var chatInfo = await client.getChatById(chatId)
                        if (!chatInfo.isReadOnly) await client.sendText(chatId, criarTexto(msgs_texto.admin.bcgrupos.anuncio, mensagem))
                    }
                }
                await client.reply(from, msgs_texto.admin.bcgrupos.bc_sucesso , id)
                break
            
            case '!print':
                let print = await client.getSnapshot()
                await client.sendFile(from,print,"print.png",'Captura de Tela',id)
                break

            case '!estado':
                if(args.length != 2)  return client.reply(from,erroComandoMsg(command),id)
                switch(args[1]){
                    case 'online':
                        client.setMyStatus("< 🟢 Online />")
                        client.reply(from,msgs_texto.admin.estado.sucesso,id)
                        break
                    case 'offline':
                        client.setMyStatus("< 🔴 Offline />")
                        client.reply(from,msgs_texto.admin.estado.sucesso,id)
                        break    
                    case 'manutencao':
                        client.setMyStatus("< 🟡 Manutenção />")
                        client.reply(from,msgs_texto.admin.estado.sucesso,id)
                        break
                    default:
                        client.reply(from, erroComandoMsg(command), id)
                }
                break

            case '!desligar':
                await client.reply(from, msgs_texto.admin.desligar.sucesso, id).then(()=>{
                    client.kill()
                })
                break
            
            case "!ping":
                var os = require('os')
                var tempoResposta = (moment.now()/1000) - t
                var memoriaTotal = os.totalmem()/1024000000, memoriaUsada = (os.totalmem() - os.freemem())/1024000000
                var sistemaOperacional = `${os.type()} ${os.release()}`
                var nomeProcessador = os.cpus()[0].model
                var mensagensCarregadas = await client.getAmountOfLoadedMessages()
                var chatContatos = await client.getAllContacts(), chatGrupos = await client.getAllGroups()
                client.reply(from, criarTexto(
                    msgs_texto.admin.ping.resposta, 
                    sistemaOperacional, 
                    nomeProcessador, 
                    memoriaUsada.toFixed(2), 
                    memoriaTotal.toFixed(2), 
                    tempoResposta.toFixed(3),
                    mensagensCarregadas,
                    chatContatos.length,
                    chatGrupos.length,
                    timestampParaData(botInfo().iniciado) 
                    ), id)
                break
        }
    } catch(err){
        throw err
    }
    
}