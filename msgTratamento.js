//REQUERINDO MODULOS
const { MessageTypes } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const cadastrarGrupo = require('./lib/cadastrarGrupo')
const db = require('./lib/database')
const {botInfoUpdate, botLimitarComando, botInfo, botVerificarExpiracaoLimite,botLimitarMensagensPv} = require("./lib/bot")
const {verificarBloqueioGlobal, verificarBloqueioGrupo} = require("./lib/bloqueioComandos")
const { criarTexto, guiaComandoMsg, removerNegritoComando, consoleErro, consoleComando } = require('./lib/util')
const msgs_texto = require('./lib/msgs')
const {autoSticker} = require("./lib/sticker")

//COMANDOS
const lista_comandos = JSON.parse(fs.readFileSync('./comandos/comandos.json'))
const grupo = require('./comandos/grupo'), utilidades = require('./comandos/utilidades'), diversao = require('./comandos/diversao'), admin = require('./comandos/admin'), info = require('./comandos/info'), figurinhas = require('./comandos/figurinhas'), downloads = require('./comandos/downloads')

module.exports = msgTratamento = async (client, message) => {
    try {
        const {t, sender, isGroupMsg, chat, type, caption, id, from, body} = message
        const {formattedTitle} = chat, { pushname, verifiedName, formattedName } = sender, username = pushname || verifiedName || formattedName
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const ownerNumber = process.env.NUMERO_DONO.trim()
        const isOwner = ownerNumber == sender.id.replace(/@c.us/g, '')
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const grupoInfo = isGroupMsg ? await db.obterGrupo(groupId) : ''
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await client.getBlockedIds()
        const isBlocked = blockedNumbers.includes(sender.id)
        const comandoExiste = (
            lista_comandos.utilidades.includes(command) ||
            lista_comandos.grupo.includes(command) || 
            lista_comandos.diversao.includes(command) ||
            lista_comandos.admin.includes(command) ||
            lista_comandos.info.includes(command) ||
            lista_comandos.figurinhas.includes(command) ||
            lista_comandos.downloads.includes(command)
        )

        //SE O GRUPO NÃO FOR CADASTRADO
        if(isGroupMsg && !grupoInfo) await cadastrarGrupo(message,"msg",client)

        //SE NÃO FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
        if (!isGroupMsg && isBlocked) return

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, VERIFICA SE O USUARIO EXISTE NO CONTADOR , REGISTRA ELE E ADICIONA A CONTAGEM
        if(isGroupMsg && grupoInfo.contador.status) {
            await db.existeUsuarioContador(groupId,sender.id)
            await db.addContagem(groupId,sender.id,type)
        }

        //SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
        var registrado = await db.verificarRegistro(sender.id)
        if(!registrado) {
            if(isOwner) {
                await db.verificarDonoAtual(sender.id)
                await db.registrarDono(sender.id, username)
            }
            else {
                await db.registrarUsuario(sender.id, username)
            }
        } else {
            if(isOwner) await db.verificarDonoAtual(sender.id)       
        }

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //ATUALIZE NOME DO USUÁRIO 
            await db.atualizarNome(sender.id, username)

            //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
            if (isGroupMsg && isBlocked) return

            //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
            if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return

            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfo().limitecomandos.status){
                let usuario = await db.obterUsuario(sender.id)
                let limiteComando = await botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await client.reply(from, limiteComando.msg, id)
                    return 
                }
            }
            
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await verificarBloqueioGlobal(command) && !isOwner){
                return client.reply(from, criarTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, command), id)
            }
            
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && await verificarBloqueioGrupo(command, groupId) && !isGroupAdmins) return client.reply(from,criarTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, command), id)

            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfo().limite_diario.status){
                if(!lista_comandos.excecoes_contagem.includes(command) && !lista_comandos.admin.includes(command) && !lista_comandos.grupo.includes(command) && !lista_comandos.info.includes(command) && !msgGuia){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender.id)
                    if(!ultrapassou) await db.addContagemDiaria(sender.id) 
                    else return client.reply(from, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender.id)
                    await botVerificarExpiracaoLimite()
                }
            } else {
                await db.addContagemTotal(sender.id)
            }
          
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await botInfoUpdate()

        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //AUTO-STICKER GRUPO
            if(isGroupMsg && (type == MessageTypes.IMAGE || type == MessageTypes.VIDEO) && grupoInfo.autosticker){
                //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
                if (isGroupMsg && isBlocked) return
                //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
                if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfo().limitecomandos.status){
                    let usuario = await db.obterUsuario(sender.id)
                    let limiteComando = await botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) {
                        if(limiteComando.msg != undefined) await client.reply(from, limiteComando.msg, id)
                        return 
                    }
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfo().limite_diario.status){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender.id)
                    if(!ultrapassou) await db.addContagemDiaria(sender.id) 
                    else return client.reply(from, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender.id)
                }            
                await autoSticker(client, message)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
                return
            }

            //AUTO-STICKER PRIVADO
            if(!isGroupMsg && (type == MessageTypes.IMAGE || type == MessageTypes.VIDEO) && botInfo().autosticker){
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfo().limitecomandos.status){
                    let usuario = await db.obterUsuario(sender.id)
                    let limiteComando = await botLimitarComando(sender.id, usuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) {
                        if(limiteComando.msg != undefined) await client.reply(from, limiteComando.msg, id)
                        return 
                    }
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfo().limite_diario.status){
                    await botVerificarExpiracaoLimite()
                    let ultrapassou = await db.ultrapassouLimite(sender.id)
                    if(!ultrapassou) await db.addContagemDiaria(sender.id) 
                    else return await client.reply(from, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber), id)
                } else {
                    await db.addContagemTotal(sender.id)
                }
                await autoSticker(client, message)
                consoleComando(isGroupMsg, "FIGURINHAS", "AUTO-STICKER", "#ae45d1", t, username, formattedTitle)
                return
            }

            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfo().limitarmensagens.status){
                let u = await db.obterUsuario(sender.id)
                let tipo_usuario_pv = u ? u.tipo : "bronze"
                let limitarMensagens = await botLimitarMensagensPv(sender.id, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    await client.sendText(sender.id, limitarMensagens.msg)
                    return client.contactBlock(sender.id)
                }
            }
        }

        //APÓS TODAS AS VERIFICAÇÕES SOLICITE OS COMANDOS
        if(lista_comandos.utilidades.includes(command)){
            //UTILIDADES
            if(msgGuia) return client.reply(from, guiaComandoMsg("utilidade", command), id)
            await utilidades(client,message)
            consoleComando(isGroupMsg, "UTILIDADES", command, "#de9a07", t, username, formattedTitle)
        }  else if(lista_comandos.figurinhas.includes(command)){
            //FIGURINHAS
            if(msgGuia) return client.reply(from, guiaComandoMsg("figurinhas", command), id)
            await figurinhas(client,message)
            consoleComando(isGroupMsg, "FIGURINHAS", command, "#ae45d1", t, username, formattedTitle)
        } else if(lista_comandos.downloads.includes(command)){
            //DOWNLOADS
            if(msgGuia) return client.reply(from, guiaComandoMsg("downloads", command), id)
            await downloads(client,message)
            consoleComando(isGroupMsg, "DOWNLOADS", command, "#2195cf", t, username, formattedTitle)
        } else if (lista_comandos.grupo.includes(command)){
            //GRUPO
            if(msgGuia) return client.reply(from, guiaComandoMsg("grupo", command), id)
            await grupo(client,message)
            if(isGroupMsg) consoleComando(isGroupMsg, "ADMINISTRAÇÃO", command, "#e0e031", t, username, formattedTitle)
        } else if(lista_comandos.diversao.includes(command)){
            //DIVERSÃO
            if(msgGuia) return client.reply(from, guiaComandoMsg("diversao", command), id)
            await diversao(client,message)
            consoleComando(isGroupMsg, "DIVERSÃO", command, "#22e3dd", t, username, formattedTitle)
        } else if(lista_comandos.admin.includes(command)){
            //ADMIN
            if(msgGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
            await admin(client,message)
            consoleComando(isGroupMsg, "DONO", command, "#d1d1d1", t, username, formattedTitle)
        } else if(lista_comandos.info.includes(command) || commands.match(/comandos|comando|ajuda|menu|help/gm)){
            //INFO
            if(commands.match(/comandos|comando|ajuda|menu|help/gmi)) command = "!menu"
            if(msgGuia) return client.reply(from, guiaComandoMsg("info", command), id)
            await info(client,message)
            consoleComando(isGroupMsg, "INFO", command, "#8ac46e", t, username, formattedTitle)
        }
    } catch (err) {
        consoleErro(err, 'MSG')
    }
}
