//REQUERINDO MODULOS
const {admin} = require('../lib/menu')
const {msgs_texto} = require('../lib/msgs')
const {preencherTexto, editarEnv,erroComandoMsg,guiaComandoMsg} = require('../lib/util')
const db = require('../database/database')
const fs = require("fs-extra")
const path = require("path")
const {botAlterarLimitador, botInfo, botAlterarLimiteDiario, botQtdLimiteDiario, botAlterarLimitarMensagensPv, botBloquearComando, botDesbloquearComando} = require('../lib/bot')


module.exports = dono_bot = async(client,message) => {
    try{
        const {id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj, mentionedJidList } = message
        let { body } = message
        let { pushname, verifiedName } = sender
        pushname = pushname || verifiedName
        const commands = caption || body || ''
        const command = commands.toLowerCase().split(' ')[0] || ''
        const args =  commands.split(' ')
        const botNumber = await client.getHostNumber()
        const blockNumber = await client.getBlockedIds()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot
        const isOwner = ownerNumber.includes(sender.id.replace(/@c.us/g, ''))
        const isGuia = (args.length == 1) ? false : args[1] == "guia"

        switch(command){

            case "!admin":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                client.sendText(from, admin)
                break

            case "!infocompleta":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                const foto_bot_url = await client.getProfilePicFromServer(botNumber+'@c.us')
                let info_bot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
                let data = new Date(info_bot.limite_diario.expiracao * 1000)
                let dia = `0${data.getDate()}`, mes = `0${data.getMonth()+1}`, ano= data.getFullYear(), horas = `0${data.getHours()}`, minutos = `0${data.getMinutes()}`, segundos = `0${data.getSeconds()}`
                let infocompleta_resposta = preencherTexto(msgs_texto.admin.infocompleta.resposta_superior, info_bot.criador, info_bot.criado_em, info_bot.nome, info_bot.iniciado, process.env.npm_package_version)
                infocompleta_resposta += (info_bot.limite_diario.status) ? preencherTexto(msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.on, info_bot.limite_diario.qtd, dia.substr(-2), mes.substr(-2), ano, horas.substr(-2), minutos.substr(-2), segundos.substr(-2)) : msgs_texto.admin.infocompleta.resposta_variavel.limite_diario.off
                infocompleta_resposta += (info_bot.limitecomandos.status) ? preencherTexto(msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.on, info_bot.limitecomandos.cmds_minuto_max, info_bot.limitecomandos.tempo_bloqueio) : msgs_texto.admin.infocompleta.resposta_variavel.taxa_comandos.off
                infocompleta_resposta += (info_bot.limitarmensagens.status) ? preencherTexto(msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.on, info_bot.limitarmensagens.max, info_bot.limitarmensagens.intervalo) : msgs_texto.admin.infocompleta.resposta_variavel.limitarmsgs.off
                infocompleta_resposta += (info_bot.bloqueio_cmds.length != 0) ? preencherTexto(msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.on, info_bot.bloqueio_cmds.toString()) : msgs_texto.admin.infocompleta.resposta_variavel.bloqueiocmds.off
                infocompleta_resposta += preencherTexto(msgs_texto.admin.infocompleta.resposta_inferior, blockNumber.length, info_bot.cmds_executados, ownerNumber[0])
                client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",infocompleta_resposta,id)
                break
                
            case '!entrargrupo':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if (args.length < 2) return client.reply(from, erroComandoMsg(command), id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                const link = args[1]
                const tGr = await client.getAllGroups()
                const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
                const check = await client.inviteInfo(link)
                if (!isLink) return client.reply(from, msgs_texto.admin.entrar_grupo.link_invalido, id)
                if (tGr.length > 10) return client.reply(from, msgs_texto.admin.entrar_grupo.maximo_grupos, id)
                if (check.size < 5) return client.reply(from, msgs_texto.admin.entrar_grupo.minimo_membros, id)
                if (check.status === 200) {
                    await client.joinGroupViaLink(link).then(() => client.reply(from, msgs_texto.admin.entrar_grupo.entrar_sucesso,id))
                } else {
                    client.reply(from, msgs_texto.admin.entrar_grupo.link_invalido, id)
                }
                break

            case '!sair':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot , id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                await client.sendText(from, msgs_texto.admin.sair.sair_sucesso).then(async () =>{
                    await client.leaveGroup(groupId)
                }) 
                break

            case '!listablock':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let listablock_resposta = preencherTexto(msgs_texto.admin.listablock.resposta_titulo, blockNumber.length)
                for (let i of blockNumber) {
                    listablock_resposta += preencherTexto(msgs_texto.admin.listablock.resposta_itens, i.replace(/@c.us/g,''))
                }
                client.sendTextWithMentions(from, listablock_resposta, id)
                break

            case '!limpartudo':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                const allChatz = await client.getAllChats()
                for (let dchat of allChatz) {
                    await client.deleteChat(dchat.id)
                }
                client.reply(from, msgs_texto.admin.limpar.limpar_sucesso, id)
                break
            
            case "!bcmdglobal":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let b_cmd_inseridos = body.slice(12).split(" "), b_cmd_verificados = [], b_cmd_global = JSON.parse(fs.readFileSync('./database/json/bot.json')), bcmd_resposta = msgs_texto.admin.bcmdglobal.resposta_titulo
                const lista_comandos = JSON.parse(fs.readFileSync('./comandos/comandos.json'))
                for(let b_cmd of b_cmd_inseridos){
                    if(lista_comandos.utilidades.includes(b_cmd) || lista_comandos.diversao.includes(b_cmd)){
                        if(b_cmd_global.bloqueio_cmds.includes(b_cmd)){
                            bcmd_resposta += preencherTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, b_cmd)
                        } else {
                            b_cmd_verificados.push(b_cmd)
                            bcmd_resposta += preencherTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, b_cmd)
                        }
                    } else if (lista_comandos.admin_grupo.includes(b_cmd) || lista_comandos.dono_bot.includes(b_cmd) ){
                        bcmd_resposta += preencherTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.comando_admin, b_cmd)
                    } else {
                        bcmd_resposta += preencherTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.nao_existe, b_cmd)
                    }
                }
                if(b_cmd_verificados.length != 0) botBloquearComando(b_cmd_verificados)
                client.reply(from, bcmd_resposta, id)
                break
            
            case "!dcmdglobal":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from,erroComandoMsg(command),id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let d_cmd_inseridos = body.slice(12).split(" "), d_cmd_verificados = [], d_cmd_global = JSON.parse(fs.readFileSync('./database/json/bot.json')), dcmd_resposta = msgs_texto.admin.dcmdglobal.resposta_titulo
                for(let d_cmd of d_cmd_inseridos){
                    if(d_cmd_global.bloqueio_cmds.includes(d_cmd)) {
                        d_cmd_verificados.push(d_cmd)
                        dcmd_resposta += preencherTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, d_cmd)
                    } else {
                        dcmd_resposta += preencherTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, d_cmd)
                    }
                }
                if(d_cmd_verificados.length != 0)  botDesbloquearComando(d_cmd_verificados)
                client.reply(from, dcmd_resposta, id)
                break

            case '!limpar':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                const all_chats = await client.getAllChats()
                for (let dchat of all_chats) {
                    if(dchat.id.match(/@c.us/g) && dchat.id != sender.id) await client.deleteChat(dchat.id)
                }
                client.reply(from, msgs_texto.admin.limpar.limpar_sucesso, id)
                break
                
            case '!rconfig':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                await db.resetarGrupos()
                client.reply(from,msgs_texto.admin.rconfig.reset_sucesso,id)
                break

            case '!sairgrupos':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                const allGroups = await client.getAllGroups()
                for (let gclist of allGroups) {
                    let total_grupos_resposta = preencherTexto(msgs_texto.admin.sairtodos.resposta, allGroups.length)
                    await client.sendText(gclist.contact.id, total_grupos_resposta)
                    await client.leaveGroup(gclist.contact.id)
                }
                client.reply(from, msgs_texto.admin.sairtodos.sair_sucesso, id)
                break

            case "!bloquear":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let usuarios_bloq = []
                if (mentionedJidList.length === 0){
                    if(!quotedMsg) return client.reply(from, erroComandoMsg(command), id)
                    usuarios_bloq.push(quotedMsgObj.author)
                } else {
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        usuarios_bloq.push(mentionedJidList[i])
                    }
                }

                for (let user_b of usuarios_bloq){
                    if(ownerNumber.includes(user_b.replace(/@c.us/g, ''))){
                        await client.sendTextWithMentions(from, preencherTexto(msgs_texto.admin.bloquear.erro_dono, user_b.replace(/@c.us/g, '')))
                    } else {
                        if(blockNumber.includes(user_b)) {
                            await client.sendTextWithMentions(from, preencherTexto(msgs_texto.admin.bloquear.ja_bloqueado, user_b.replace(/@c.us/g, '')))
                        } else {
                            await client.contactBlock(user_b)
                            await client.sendTextWithMentions(from, preencherTexto(msgs_texto.admin.bloquear.sucesso, user_b.replace(/@c.us/g, '')))
                        }
                    }
                    
                }
                break      

            case "!desbloquear":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let usuarios_desbloq = []
                if (mentionedJidList.length === 0){
                    if(!quotedMsg) return client.reply(from, erroComandoMsg(command), id)
                    usuarios_desbloq.push(quotedMsgObj.author)
                } else {
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        usuarios_desbloq.push(mentionedJidList[i])
                    }
                }

                for (let user_d of usuarios_desbloq){
                    if(!blockNumber.includes(user_d)) {
                        await client.sendTextWithMentions(from, preencherTexto(msgs_texto.admin.desbloquear.ja_desbloqueado, user_d.replace(/@c.us/g,'')))
                    } else {
                        await client.contactUnblock(user_d)
                        await client.sendTextWithMentions(from, preencherTexto(msgs_texto.admin.desbloquear.sucesso, user_d.replace(/@c.us/g,'')))
                    }
                }
                break

            
            case "!limitediario":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let limitediario_estado = args[1]
                if(limitediario_estado == "on"){
                    if(botInfo().limite_diario.status) return client.reply(from,msgs_texto.admin.limitediario.ja_ativado,id)
                    if(args.length !== 3) return client.reply(from,erroComandoMsg(command),id)
                    let qtd_comandos = args[2]
                    if(isNaN(qtd_comandos) || qtd_comandos < 10) return client.reply(from,msgs_texto.admin.limitediario.qtd_invalida,id)
                    botAlterarLimiteDiario(true,qtd_comandos)
                    client.reply(from, msgs_texto.admin.limitediario.ativado,id)
                } else if(limitediario_estado == "off"){
                    if(!botInfo().limite_diario.status) return client.reply(from,msgs_texto.admin.limitediario.ja_desativado,id)
                    botAlterarLimiteDiario(false)
                    client.reply(from, msgs_texto.admin.limitediario.desativado,id)
                } else {
                    client.reply(from, erroComandoMsg(command), id)
                }
                break

            case "!taxalimite":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let limitador_estado = args[1]
                if(limitador_estado == "on"){
                    if(botInfo().limitecomandos.status) return client.reply(from,msgs_texto.admin.limitecomandos.ja_ativado,id)
                    if(args.length !== 4) return client.reply(from,erroComandoMsg(command),id)
                    let qtd_max_minuto = args[2], tempo_bloqueio = args[3]
                    if(isNaN(qtd_max_minuto) || qtd_max_minuto < 3) return client.reply(from,msgs_texto.admin.limitecomandos.qtd_invalida,id)
                    if(isNaN(tempo_bloqueio) || tempo_bloqueio < 10) return client.reply(from,msgs_texto.admin.limitecomandos.tempo_invalido,id)
                    botAlterarLimitador(true,parseInt(qtd_max_minuto),parseInt(tempo_bloqueio))
                    client.reply(from, msgs_texto.admin.limitecomandos.ativado,id)
                } else if(limitador_estado == "off"){
                    if(!botInfo().limitecomandos.status) return client.reply(from,msgs_texto.admin.limitecomandos.ja_desativado,id)
                    botAlterarLimitador(false)
                    client.reply(from, msgs_texto.admin.limitecomandos.desativado,id)
                } else {
                    client.reply(from,erroComandoMsg(command),id)
                }
                break
            
            case "!limitarmsgs":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let limitarmsgs_estado = args[1]
                if(limitarmsgs_estado == "on"){
                    if(botInfo().limitarmensagens.status) return client.reply(from,msgs_texto.admin.limitarmsgs.ja_ativado,id)
                    if(args.length !== 4) return client.reply(from,erroComandoMsg(command),id)
                    let max_msg = args[2], msgs_intervalo = args[3]
                    if(isNaN(max_msg) || max_msg < 3) return client.reply(from,msgs_texto.admin.limitarmsgs.qtd_invalida,id)
                    if(isNaN(msgs_intervalo) || msgs_intervalo < 10) return client.reply(from,msgs_texto.admin.limitarmsgs.tempo_invalido,id)
                    botAlterarLimitarMensagensPv(true,parseInt(max_msg),parseInt(msgs_intervalo))
                    client.reply(from, msgs_texto.admin.limitarmsgs.ativado,id)
                } else if(limitarmsgs_estado == "off"){
                    if(!botInfo().limitarmensagens.status) return client.reply(from,msgs_texto.admin.limitarmsgs.ja_desativado,id)
                    botAlterarLimitarMensagensPv(false)
                    client.reply(from, msgs_texto.admin.limitarmsgs.desativado,id)
                } else {
                    client.reply(from,erroComandoMsg(command),id)
                }
                break
            
            case "!mudarlimite":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto.admin.mudarlimite.erro_limite_diario,id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
                if(isNaN(args[1])) return client.reply(from, msgs_texto.admin.mudarlimite.invalido,id)
                await botQtdLimiteDiario(parseInt(args[1]))
                client.reply(from, preencherTexto(msgs_texto.admin.mudarlimite.sucesso, args[1]),id)
                break
            
            case "!tipo":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                if(args[1].toLowerCase() == "comum" || args[1].toLowerCase() == "vip"){
                    let usuario_tipo = ""
                    if(quotedMsg){
                        usuario_tipo = quotedMsgObj.author
                    } else if(mentionedJidList.length === 1){
                        usuario_tipo = mentionedJidList[0]
                    } else if(args.length > 2){
                        usuario_tipo = args.slice(2).join("").replace(/\W+/g,"")+"@c.us"
                    } else {
                        return client.reply(from, erroComandoMsg(command),id)
                    }

                    if(ownerNumber.includes(usuario_tipo.replace("@c.us",""))) return client.reply(from, msgs_texto.admin.tipo.tipo_dono,id)
                        let c_registrado = await db.verificarRegistro(usuario_tipo)
                        if(c_registrado){
                            await db.alterarTipoUsuario(usuario_tipo, args[1])
                            return client.reply(from, preencherTexto(msgs_texto.admin.tipo.sucesso, args[1].toUpperCase()),id)
                        } else {
                            return client.reply(from, msgs_texto.admin.tipo.nao_registrado,id)
                    }

                } else {
                    client.reply(from, msgs_texto.admin.tipo.tipos_disponiveis,id)
                }
                break
            
            case "!limparvip":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                await db.limparVip()
                client.reply(from,msgs_texto.admin.limparvip.sucesso,id)
                break

            case "!env":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length <= 2) return client.reply(from, erroComandoMsg(command) ,id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let resposta = {
                    api_removebg : null,
                    api_newsorg : null,
                    api_rapidapi : null,
                    api_twitter_ck : null,
                    api_twitter_cks : null,
                    api_twitter_at : null,
                    api_twitter_ats : null
                }

                switch(args[1]){
                    case "removebg":
                        if(args.length < 3) return client.reply(from, msgs_texto.admin.env.chave_erro,id)
                        resposta.api_removebg = args[2]
                        break
                    case "newsorg":
                        if(args.length < 3) return client.reply(from, msgs_texto.admin.env.chave_erro,id)
                        resposta.api_newsorg = args[2]
                        break
                    case "rapidapi":
                        if(args.length < 3) return client.reply(from, msgs_texto.admin.env.chave_erro ,id)
                        resposta.api_rapidapi = args[2]
                        break
                    case "twitter":
                        if(args.length < 6) return client.reply(from,msgs_texto.admin.env.chave_erro ,id)
                        resposta.api_twitter_ck = args[2]
                        resposta.api_twitter_cks = args[3]
                        resposta.api_twitter_at = args[4]
                        resposta.api_twitter_ats = args[5]
                        break
                }
                editarEnv(resposta)
                client.reply(from, msgs_texto.admin.env.resposta ,id)
                break
            
            case "!vervips":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let u_vips = await db.obterUsuariosVip()
                if(u_vips.length == 0) return client.reply(from, msgs_texto.admin.vervips.sem_vips, id)
                let vervips_resposta = msgs_texto.admin.vervips.resposta_titulo
                for(let u of u_vips){
                    let vip_nome = (u.nome != undefined) ? u.nome : ""
                    vervips_resposta += preencherTexto(msgs_texto.admin.vervips.resposta_itens, vip_nome, u.id_usuario.replace(/@c.us/g,''), u.comandos_total)
                }
                await client.sendTextWithMentions(from,vervips_resposta)
                break
            
            case "!rtodos":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto.admin.rtodos.erro_limite_diario,id)
                db.resetarComandosDia().then(async()=>{
                    await client.reply(from, msgs_texto.admin.rtodos.sucesso,id)
                })
                break

            case "!r":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto.admin.r.erro_limite_diario,id)
                if(quotedMsg){
                    let r_registrado = await db.verificarRegistro(quotedMsgObj.author)
                    if(r_registrado){
                        await db.resetarComandosDiaUsuario(quotedMsgObj.author)
                        client.reply(from, msgs_texto.admin.r.sucesso,id)
                    } else {
                        return client.reply(from, msgs_texto.admin.r.nao_registrado,id)
                    }
                } else if (mentionedJidList.length === 1){
                    let r_registrado = await db.verificarRegistro(mentionedJidList[0])
                    if(r_registrado){
                        await db.resetarComandosDiaUsuario(mentionedJidList[0])
                        client.reply(from, msgs_texto.admin.r.sucesso,id)
                    } else {
                        return client.reply(from, msgs_texto.admin.r.nao_registrado,id)
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
                        client.reply(from, msgs_texto.admin.r.sucesso,id)
                    } else {
                        return client.reply(from, msgs_texto.admin.r.nao_registrado,id)
                    }
                } else {
                return client.reply(from, erroComandoMsg(command),id)
                }
                break  
                
            case "!verdados":
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
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

                let max_comandos_vd = (vd_usuario.max_comandos_dia == null) ? "Sem limite" : vd_usuario.max_comandos_dia

                switch(vd_usuario.tipo) {
                    case "dono":
                        vd_usuario.tipo = "🤖 Dono"
                        break
                    case "vip":
                        vd_usuario.tipo  = "⭐ VIP"
                        break
                    case "comum":
                        vd_usuario.tipo  = "👤 Comum"
                        break    
                }

                let vd_nome =  (vd_usuario.nome != undefined) ? vd_usuario.nome : "Ainda não obtido"
                let verdados_resposta = preencherTexto(msgs_texto.admin.verdados.resposta_superior, vd_nome, vd_usuario.tipo, vd_usuario.id_usuario.replace("@c.us",""))
                if(botInfo().limite_diario.status){
                    verdados_resposta += preencherTexto(msgs_texto.admin.verdados.resposta_variavel.limite_diario.on, vd_usuario.comandos_dia, max_comandos_vd, max_comandos_vd)
                }
                verdados_resposta += preencherTexto(msgs_texto.admin.verdados.resposta_inferior, vd_usuario.comandos_total)
                client.reply(from, verdados_resposta, id)
                break

            case '!bc':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let msg_bc = body.slice(4)
                const chats_bc = await client.getAllChatIds()
                for (let id_chat of chats_bc) {
                    var chat_bc_info = await client.getChatById(id_chat)
                    if (!chat_bc_info.isReadOnly) await client.sendText(id_chat, preencherTexto(msgs_texto.admin.bc.anuncio, msg_bc))
                }
                client.reply(from, msgs_texto.admin.bc.bc_sucesso , id)
                break
            
            case '!bcgrupos':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let msg_bcgrupos = body.slice(10)
                const chats_bcgrupos = await client.getAllChatIds()
                for (let id_chat of chats_bcgrupos) {
                    if(id_chat.match(/@g.us/g)){
                        var chat_bcgrupos_info = await client.getChatById(id_chat)
                        if (!chat_bcgrupos_info.isReadOnly) await client.sendText(id_chat, preencherTexto(msgs_texto.admin.bcgrupos.anuncio, msg_bcgrupos))
                    }
                }
                client.reply(from, msgs_texto.admin.bcgrupos.bc_sucesso , id)
                break
            
            case '!print':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                let print = await client.getSnapshot()
                await client.sendFile(from,print,"print.png",'Captura de Tela',id)
                break

            case '!estado':
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(args.length != 2)  return client.reply(from,erroComandoMsg(command),id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
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
                if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
                if(isGuia) return client.reply(from, guiaComandoMsg("admin", command), id)
                await client.reply(from, msgs_texto.admin.desligar.sucesso, id).then(()=>{
                    client.kill()
                })
                break
        }
    } catch(err){
        throw err
    }
    
}