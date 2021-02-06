//REQUERINDO MODULOS
const {admin} = require('../lib/menu')
const {msgs_texto} = require('../lib/msgs')
const db = require('../database/database')
const fs = require("fs-extra")
const path = require("path")
const {botAlterarLimitador, botInfo, botAlterarLimiteDiario, botQtdLimiteDiario, botAlterarLimitarMensagensPv} = require('../lib/bot')


module.exports = dono_bot = async(client,message) => {
    const {id, from, sender, type, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj, mentionedJidList } = message
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

    switch(command){
        case "!admin":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            client.sendText(from, admin)
            break

        case "!infocompleta":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            const foto_bot_url = await client.getProfilePicFromServer(botNumber+'@c.us')
            let info_bot = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
            let data = new Date(info_bot.limite_diario.expiracao * 1000)
            let dia = `0${data.getDate()}`, mes = `0${data.getMonth()+1}`, ano= data.getFullYear(), horas = `0${data.getHours()}`, minutos = `0${data.getMinutes()}`, segundos = `0${data.getSeconds()}`
            let msg_info = `*Criador do Bot* : ${info_bot.criador}\n`
            msg_info += `*Criado em* : ${info_bot.criado_em}\n`
            msg_info += `*Nome do bot* : ${info_bot.nome}\n`
            msg_info += `*Online desde* : ${info_bot.iniciado}\n`
            msg_info += "*Limite diário* : "
            msg_info += (info_bot.limite_diario.status)? ` ✅\n - *${info_bot.limite_diario.qtd}* Cmds/dia por usuário\n - Reseta *${dia.substr(-2)}/${mes.substr(-2)}/${ano} às ${horas.substr(-2)}:${minutos.substr(-2)}:${segundos.substr(-2)}*\n` : " ❌\n"
            msg_info += "*Taxa máxima comandos/minuto* : " 
            msg_info += (info_bot.limitecomandos.status) ? ` ✅\n - *${info_bot.limitecomandos.cmds_minuto_max}* Cmds/minuto por usuário\n - Tempo de bloqueio : *${info_bot.limitecomandos.tempo_bloqueio}* segundos\n` : " ❌\n"
            msg_info += "*Taxa máxima de mensagens privadas* : "
            msg_info += (info_bot.limitarmensagens.status) ? ` ✅\n - *${info_bot.limitarmensagens.max}* Msgs a cada *${info_bot.limitarmensagens.intervalo}* s por usuário\n` : " ❌\n"
            msg_info += `*Quantidade de pessoas bloqueadas* : *${blockNumber.length}* pessoas\n`
            msg_info += `*Comandos executados* : *${info_bot.cmds_executados}* Cmds\n`
            msg_info += `*Contato do criador* : wa.me/${ownerNumber[0]}\n`
            client.sendFileFromUrl(from,foto_bot_url,"foto_bot.jpg",msg_info,id)
            break
            
        case '!entrargrupo':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if (args.length < 2) return client.reply(from, msgs_texto().admin.entrar_grupo.cmd_erro, id)
            const link = args[1]
            const tGr = await client.getAllGroups()
            const isLink = link.match(/(https:\/\/chat.whatsapp.com)/gi)
            const check = await client.inviteInfo(link)
            if (!isLink) return client.reply(from, msgs_texto().admin.entrar_grupo.link_invalido, id)
            if (tGr.length > 10) return client.reply(from, msgs_texto().admin.entrar_grupo.maximo_grupos, id)
            if (check.size < 5) return client.reply(from, msgs_texto().admin.entrar_grupo.minimo_membros, id)
            if (check.status === 200) {
                await client.joinGroupViaLink(link).then(() => client.reply(from, msgs_texto().admin.entrar_grupo.entrar_sucesso,id))
            } else {
                client.reply(from, msgs_texto().admin.entrar_grupo.link_invalido, id)
            }
            break

        case '!sair':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if(!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot , id)
            await client.sendText(from, msgs_texto().admin.sair.sair_sucesso).then(async () =>{
                await client.leaveGroup(groupId)
            }) 
            break

        case '!listablock':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            let msg_block = `🤖 Esse é o total de pessoas bloqueadas \nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                msg_block += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, msg_block, id)
            break

        case '!limpartudo':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, msgs_texto().admin.limpar.limpar_sucesso, id)
            break

        case '!limpar':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            const all_chats = await client.getAllChats()
            for (let dchat of all_chats) {
                if(dchat.id.match(/@c.us/g) && dchat.id != sender.id) await client.deleteChat(dchat.id)
            }
            client.reply(from, msgs_texto().admin.limpar.limpar_sucesso, id)
            break
            
        case '!rconfig':
            await db.resetarGrupos()
            client.reply(from,msgs_texto().admin.rconfig.reset_sucesso,id)
            break

        case '!sairgrupos':
        if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `🤖 Estou saindo dos grupos, total de grupos : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, msgs_texto().admin.sairtodos.sair_sucesso, id)
            break

        case "!bloquear":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            let usuarios_bloq = []
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto().admin.bloquear.cmd_erro, id)
                usuarios_bloq.push(quotedMsgObj.author)
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    usuarios_bloq.push(mentionedJidList[i])
                }
            }

            for (let user_b of usuarios_bloq){
                if(ownerNumber.includes(user_b.replace(/@c.us/g, ''))){
                    await client.sendTextWithMentions(from, `[❗] O Usuário @${user_b.replace(/@c.us/g, '')} é dono do BOT, não foi possivel bloquear.`)
                } else {
                    if(blockNumber.includes(user_b)) {
                        await client.sendTextWithMentions(from, `[❗] O Usuário @${user_b.replace(/@c.us/g, '')} já está *bloqueado*.`)
                    } else {
                        await client.contactBlock(user_b)
                        await client.sendTextWithMentions(from, `✅ O Usuário @${user_b.replace(/@c.us/g, '')} foi *bloqueado* com sucesso`)
                    }
                }
                
            }
            break      

        case "!desbloquear":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            let usuarios_desbloq = []
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto().admin.desbloquear.cmd_erro, id)
                usuarios_desbloq.push(quotedMsgObj.author)
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    usuarios_desbloq.push(mentionedJidList[i])
                }
            }

            for (let user_d of usuarios_desbloq){
                if(!blockNumber.includes(user_d)) {
                    await client.sendTextWithMentions(from, `[❗] O Usuário @${user_d.replace(/@c.us/g,'')} já está *desbloqueado*.`)
                } else {
                    await client.contactUnblock(user_d)
                    await client.sendTextWithMentions(from, `✅ O Usuário @${user_d.replace(/@c.us/g,'')} foi *desbloqueado* com sucesso`)
                }
            }
            break

        
        case "!limitediario":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from,msgs_texto().admin.limitediario.cmd_erro,id)
            let limitediario_estado = args[1]
            if(limitediario_estado == "on"){
                if(botInfo().limite_diario.status) return client.reply(from,msgs_texto().admin.limitediario.ja_ativado,id)
                if(args.length !== 3) return client.reply(from,msgs_texto().admin.limitediario.cmd_erro,id)
                let qtd_comandos = args[2]
                if(isNaN(qtd_comandos) || qtd_comandos < 10) return client.reply(from,msgs_texto().admin.limitediario.qtd_invalida,id)
                botAlterarLimiteDiario(true,qtd_comandos)
                client.reply(from, msgs_texto().admin.limitediario.ativado,id)
            } else if(limitediario_estado == "off"){
                if(!botInfo().limite_diario.status) return client.reply(from,msgs_texto().admin.limitediario.ja_desativado,id)
                botAlterarLimiteDiario(false)
                client.reply(from, msgs_texto().admin.limitediario.desativado,id)
            } else {
                client.reply(from,msgs_texto().admin.limitediario.cmd_erro,id)
            }
            break

        case "!taxalimite":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from,msgs_texto().admin.limitecomandos.cmd_erro,id)
            let limitador_estado = args[1]
            if(limitador_estado == "on"){
                if(botInfo().limitecomandos.status) return client.reply(from,msgs_texto().admin.limitecomandos.ja_ativado,id)
                if(args.length !== 4) return client.reply(from,msgs_texto().admin.limitecomandos.cmd_erro,id)
                let qtd_max_minuto = args[2], tempo_bloqueio = args[3]
                if(isNaN(qtd_max_minuto) || qtd_max_minuto < 3) return client.reply(from,msgs_texto().admin.limitecomandos.qtd_invalida,id)
                if(isNaN(tempo_bloqueio) || tempo_bloqueio < 10) return client.reply(from,msgs_texto().admin.limitecomandos.tempo_invalido,id)
                botAlterarLimitador(true,parseInt(qtd_max_minuto),parseInt(tempo_bloqueio))
                client.reply(from, msgs_texto().admin.limitecomandos.ativado,id)
            } else if(limitador_estado == "off"){
                if(!botInfo().limitecomandos.status) return client.reply(from,msgs_texto().admin.limitecomandos.ja_desativado,id)
                botAlterarLimitador(false)
                client.reply(from, msgs_texto().admin.limitecomandos.desativado,id)
            } else {
                client.reply(from,msgs_texto().admin.limitecomandos.cmd_erro,id)
            }

            break
        
        case "!limitarmsgs":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from,msgs_texto().admin.limitarmsgs.cmd_erro,id)
            let limitarmsgs_estado = args[1]
            if(limitarmsgs_estado == "on"){
                if(botInfo().limitarmensagens.status) return client.reply(from,msgs_texto().admin.limitarmsgs.ja_ativado,id)
                if(args.length !== 4) return client.reply(from,msgs_texto().admin.limitarmsgs.cmd_erro,id)
                let max_msg = args[2], msgs_intervalo = args[3]
                if(isNaN(max_msg) || max_msg < 3) return client.reply(from,msgs_texto().admin.limitarmsgs.qtd_invalida,id)
                if(isNaN(msgs_intervalo) || msgs_intervalo < 10) return client.reply(from,msgs_texto().admin.limitarmsgs.tempo_invalido,id)
                botAlterarLimitarMensagensPv(true,parseInt(max_msg),parseInt(msgs_intervalo))
                client.reply(from, msgs_texto().admin.limitarmsgs.ativado,id)
            } else if(limitarmsgs_estado == "off"){
                if(!botInfo().limitarmensagens.status) return client.reply(from,msgs_texto().admin.limitarmsgs.ja_desativado,id)
                botAlterarLimitarMensagensPv(false)
                client.reply(from, msgs_texto().admin.limitarmsgs.desativado,id)
            } else {
                client.reply(from,msgs_texto().admin.limitarmsgs.cmd_erro,id)
            }

            break
        
        case "!mudarlimite":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto().admin.mudarlimite.erro_limite_diario,id)
            if(args.length === 1) return client.reply(from,msgs_texto().admin.mudarlimite.cmd_erro,id)
            if(isNaN(args[1])) return client.reply(from, msgs_texto().admin.mudarlimite.invalido,id)
            await botQtdLimiteDiario(parseInt(args[1]))
            client.reply(from, `✅ O limite diário de todos os usuários foi definido para ${args[1]} comandos/dia `,id)
            break
        
        case "!tipo":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, msgs_texto().admin.tipo.cmd_erro,id)
            if(args[1].toLowerCase() == "comum" || args[1].toLowerCase() == "vip"){
                if(quotedMsg){
                    if(ownerNumber.includes(quotedMsgObj.author.replace("@c.us",""))) return client.reply(from, msgs_texto().admin.tipo.tipo_dono,id)
                    let c_registrado = await db.verificarRegistro(quotedMsgObj.author)
                    if(c_registrado){
                        await db.alterarTipoUsuario(quotedMsgObj.author, args[1])
                        return client.reply(from, `✅ O tipo desse usuário foi definido para ${args[1].toUpperCase()}`,id)
                    } else {
                        return client.reply(from, msgs_texto().admin.tipo.nao_registrado,id)
                    }
                } else if (mentionedJidList.length === 1){
                    if(ownerNumber.includes(mentionedJidList[0].replace("@c.us",""))) return client.reply(from, msgs_texto().admin.tipo.tipo_dono,id)
                    let c_registrado = await db.verificarRegistro(mentionedJidList[0])
                    if(c_registrado){
                        await db.alterarTipoUsuario(mentionedJidList[0], args[1])
                        return client.reply(from, `✅ O tipo desse usuário foi definido para ${args[1].toUpperCase()}`,id)
                    } else {
                        return client.reply(from,msgs_texto().admin.tipo.nao_registrado,id)
                    }
                } else if(args.length >= 2){
                    let numero_usuario = ""
                    for (let i = 2; i < args.length; i++){
                        numero_usuario += args[i]
                    }
                    numero_usuario = numero_usuario.replace(/\W+/g,"")
                    if(ownerNumber.includes(numero_usuario)) return client.reply(from, msgs_texto().admin.tipo.tipo_dono,id)
                    let c_registrado = await db.verificarRegistro(numero_usuario+"@c.us")
                    if(c_registrado){
                        await db.alterarTipoUsuario(numero_usuario+"@c.us", args[1])
                        return client.reply(from, `✅ O tipo desse usuário foi definido para ${args[1].toUpperCase()}`,id)
                    } else {
                        return client.reply(from, msgs_texto().admin.tipo.nao_registrado,id)
                    }
                } else {
                    client.reply(from, msgs_texto().admin.tipo.cmd_erro,id)
                }
            } else {
                 client.reply(from, msgs_texto().admin.tipo.tipos_disponiveis,id)
            }
            break
        
        case "!limparvip":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            await db.limparVip()
            client.reply(from,msgs_texto().admin.limparvip.sucesso,id)
            break
        
        case "!vervips":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            let u_vips = await db.obterUsuariosVip()
            if(u_vips.length == 0) return client.reply(from, msgs_texto().admin.vervips.sem_vips, id)
            let msg_vips = "[⭐ USUÁRIOS VIP's ⭐]\n\n"
            u_vips.forEach(u=>{
                let vip_nome = (u.nome != undefined) ? u.nome : ""
                msg_vips += `➸ ⭐ ${vip_nome}  @${u.id_usuario.replace(/@c.us/g,'')} - ${u.comandos_total} Cmds\n`
            })
            await client.sendTextWithMentions(from,msg_vips)
            break
        
        case "!rtodos":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto().admin.rtodos.erro_limite_diario,id)
            db.resetarComandosDia().then(async()=>{
                await client.reply(from, msgs_texto().admin.rtodos.sucesso,id)
            })
            break

        case "!r":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(!botInfo().limite_diario.status) return client.reply(from, msgs_texto().admin.r.erro_limite_diario,id)
            if(quotedMsg){
                let r_registrado = await db.verificarRegistro(quotedMsgObj.author)
                if(r_registrado){
                    await db.resetarComandosDiaUsuario(quotedMsgObj.author)
                    client.reply(from, msgs_texto().admin.r.sucesso,id)
                } else {
                    return client.reply(from, msgs_texto().admin.r.nao_registrado,id)
                }
            } else if (mentionedJidList.length === 1){
                let r_registrado = await db.verificarRegistro(mentionedJidList[0])
                if(r_registrado){
                    await db.resetarComandosDiaUsuario(mentionedJidList[0])
                    client.reply(from, msgs_texto().admin.r.sucesso,id)
                } else {
                    return client.reply(from, msgs_texto().admin.r.nao_registrado,id)
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
                    client.reply(from, msgs_texto().admin.r.sucesso,id)
                } else {
                    return client.reply(from, msgs_texto().admin.r.nao_registrado,id)
                }
            } else {
               return client.reply(from, msgs_texto().admin.r.cmd_erro,id)
            }
            break  
            
        case "!verdados":
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            let vd_usuario = {}
            if(quotedMsg){
                let vd_registrado = await db.verificarRegistro(quotedMsgObj.author)
                if(vd_registrado){
                    vd_usuario = await db.obterUsuario(quotedMsgObj.author)
                } else {
                    return client.reply(from,msgs_texto().admin.verdados.nao_registrado,id)
                }
            } else if (mentionedJidList.length === 1){
                let vd_registrado = await db.verificarRegistro(mentionedJidList[0])
                if(vd_registrado){
                    vd_usuario = await db.obterUsuario(mentionedJidList[0])
                } else {
                    return client.reply(from, msgs_texto().admin.verdados.nao_registrado,id)
                }
            } else if(args.length >= 1){
                let vd_numero_usuario = ""
                for (let i = 1; i < args.length; i++){
                    vd_numero_usuario += args[i]
                }
                vd_numero_usuario = vd_numero_usuario.replace(/\W+/g,"")
                let vd_registrado = await db.verificarRegistro(vd_numero_usuario+"@c.us")
                if(vd_registrado){
                    vd_usuario = await db.obterUsuario(vd_numero_usuario+"@c.us")
                } else {
                    return client.reply(from, msgs_texto().admin.verdados.nao_registrado,id)
                }
            } else {
               return client.reply(from, msgs_texto().admin.verdados.cmd_erro,id)
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

            let msg_verdados = `[🤖*VER DADOS DE USO*🤖]\n\n`
            msg_verdados += (vd_usuario.nome != undefined) ? `Nome : *${vd_usuario.nome}*\n` : ""
            msg_verdados += `Tipo de usuário : *${vd_usuario.tipo }*\n`
            msg_verdados += `Numero Usuário : *${vd_usuario.id_usuario.replace("@c.us","")}*\n`
            if(botInfo().limite_diario.status){
                msg_verdados += `Comandos usados hoje : *${vd_usuario.comandos_dia}/${max_comandos_vd}*\n`
                msg_verdados += `Limite diário : *${max_comandos_vd}*\n`
            }
            msg_verdados += `Total de comandos usados : *${vd_usuario.comandos_total} comandos*\n`
            client.reply(from, msg_verdados, id)
            break

        case '!bc':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, msgs_texto().admin.bc.cmd_erro, id)
            let msg_bc = body.slice(4)
            const chats_bc = await client.getAllChatIds()
            for (let id_chat of chats_bc) {
                var chat_bc_info = await client.getChatById(id_chat)
                if (!chat_bc_info.isReadOnly) await client.sendText(id_chat, `[🤖 LBOT v2.0 ANÚNCIA]\n\n${msg_bc}`)
            }
            client.reply(from, msgs_texto().admin.bc.bc_sucesso , id)
            break
        
        case '!bcgrupos':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, msgs_texto().admin.bcgrupos.cmd_erro, id)
            let msg_bcgrupos = body.slice(10)
            const chats_bcgrupos = await client.getAllChatIds()
            for (let id_chat of chats_bcgrupos) {
                if(id_chat.match(/@g.us/g)){
                    var chat_bcgrupos_info = await client.getChatById(id_chat)
                    if (!chat_bcgrupos_info.isReadOnly) await client.sendText(id_chat, `[🤖LBOT v2.0 ANÚNCIA]\n\n${msg_bcgrupos}`)
                }
            }
            client.reply(from, msgs_texto().admin.bcgrupos.bc_sucesso , id)
            break
        
        case '!print':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            let print = await client.getSnapshot()
            await client.sendFile(from,print,"print.png",'Captura de Tela',id)
            break

        case '!estado':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            if(args.length != 2)  return client.reply(from,msgs_texto().admin.estado.cmd_erro,id)
            switch(args[1]){
                case 'online':
                    client.setMyStatus("< 🟢 Online />")
                    client.reply(from,msgs_texto().admin.estado.sucesso,id)
                    break
                case 'offline':
                    client.setMyStatus("< 🔴 Offline />")
                    client.reply(from,msgs_texto().admin.estado.sucesso,id)
                    break    
                case 'manutencao':
                    client.setMyStatus("< 🟡 Manutenção />")
                    client.reply(from,msgs_texto().admin.estado.sucesso,id)
                    break
                default:
                    client.reply(from,msgs_texto().admin.estado.cmd_erro,id)
            }
            break
        case '!desligar':
            if (!isOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_bot, id)
            await client.reply(from, msgs_texto().admin.desligar.sucesso, id).then(()=>{
                client.kill()
            })
            break
    }
}