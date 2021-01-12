//REQUERINDO MODULOS
const {admin} = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const fs = require('fs-extra')
const db = require('../database/database')
const { ml } = require('googleapis/build/src/apis/ml')

module.exports = dono_bot = async(client,message) => {
    const {id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj, mentionedJidList } = message
    let { body } = message
    let { pushname, verifiedName } = sender
    pushname = pushname || verifiedName
    const commands = caption || body || ''
    const command = commands.toLowerCase().split(' ')[0] || ''
    const args =  commands.split(' ')
    const blockNumber = await client.getBlockedIds()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot
    const isOwner = ownerNumber.includes(sender.id.replace(/@c.us/g, ''))

    switch(command){
        case "!admin":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            client.sendText(from, admin)
            break
            
        case '!entrargrupo':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if (args.length < 2) return client.reply(from, msgs_texto.admin.entrar_grupo.cmd_erro, id)
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
            await client.sendText(from, msgs_texto.admin.sair.sair_sucesso).then(async () =>{
                await client.leaveGroup(groupId)
            }) 
            break

        case '!listablock':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let msg_block = `🤖 Esse é o total de pessoas bloqueadas \nTotal : ${blockNumber.length}\n`
            for (let i of blockNumber) {
                msg_block += `➸ @${i.replace(/@c.us/g,'')}\n`
            }
            client.sendTextWithMentions(from, msg_block, id)
            break

        case '!limpartudo':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            const allChatz = await client.getAllChats()
            for (let dchat of allChatz) {
                await client.deleteChat(dchat.id)
            }
            client.reply(from, msgs_texto.admin.limpar.limpar_sucesso, id)
            break

        case '!limpar':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            const all_chats = await client.getAllChats()
            for (let dchat of all_chats) {
                if(dchat.id.match(/@c.us/g) && dchat.id != sender.id) await client.deleteChat(dchat.id)
            }
            client.reply(from, msgs_texto.admin.limpar.limpar_sucesso, id)
            break
            
        case '!rconfig':
            await fs.writeFileSync("./lib/recursos.json", JSON.stringify({"bemvindo":[],"antilink":[],"antifake":[],"antiflood":{"grupos":[],"dados":[]},"voteban":[]}) , 'utf8')
            client.reply(from,msgs_texto.admin.rconfig.reset_sucesso,id)
            break

        case '!sairgrupos':
        if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            const allChats = await client.getAllChatIds()
            const allGroups = await client.getAllGroups()
            for (let gclist of allGroups) {
                await client.sendText(gclist.contact.id, `🤖 Estou saindo dos grupos, total de grupos : ${allChats.length}`)
                await client.leaveGroup(gclist.contact.id)
            }
            client.reply(from, msgs_texto.admin.sairtodos.sair_sucesso, id)
            break

        case "!bloquear":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let usuarios_bloq = []
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto.admin.bloquear.cmd_erro, id)
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
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let usuarios_desbloq = []
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto.admin.desbloquear.cmd_erro, id)
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
        
        case "!mudarlimite":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, "[ERRO] Você deve responder algúem com *!mudarlimite novo-limite* ou mencionar alguém após o comando",id)
            if(isNaN(args[1])) return client.reply(from, "[ERRO] O número para definir o limite de comandos é inválido",id)
            if(quotedMsg){
                let mc_registrado = await db.verificarRegistro(quotedMsgObj.author)
                if(mc_registrado){
                    let ml_user = await db.obterUsuario(quotedMsgObj.author)
                    if(ml_user.tipo == "vip" || ml_user.tipo == "dono") return  client.reply(from, `[❗] Você não pode alterar limite de um vip/dono (Sem limites).`,id)
                    await db.definirLimite(quotedMsgObj.author, args[1])
                    client.reply(from, `✅ O limite desse usuário foi definido para ${args[1]} comandos/dia`,id)
                } else {
                    client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                }
            } else if (mentionedJidList.length === 1){
                let mc_registrado = await db.verificarRegistro(mentionedJidList[0])
                if(mc_registrado){
                    let ml_user = await db.obterUsuario(quotedMsgObj.author)
                    if(ml_user.tipo == "vip" || ml_user.tipo == "dono") return  client.reply(from, `[❗] Você não pode alterar limite de um vip/dono (Sem limites).`,id)
                    await db.definirLimite(mentionedJidList[0], args[1])
                    client.reply(from, `✅ O limite desse usuário foi definido para ${args[1]} comandos/dia`,id)
                } else {
                    client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                }
            } else {
                client.reply(from, "[❗] Você deve responder algúem com *!mudarlimite novo-limite* ou mencionar alguém após o comando",id)
            }
            break
        
        case "!tipo":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, "[ERRO] Você deve responder algúem com *!cargo membro|admin* ou mencionar alguém após o comando",id)
            if(args[1].toLowerCase() == "comum" || args[1].toLowerCase() == "vip"){
                if(quotedMsg){
                    if(ownerNumber.includes(quotedMsgObj.author.replace("@c.us",""))) return client.reply(from, "[ERRO] Não é possivel alterar cargo do dono",id)
                    let c_registrado = await db.verificarRegistro(quotedMsgObj.author)
                    if(c_registrado){
                        await db.alterarTipoUsuario(quotedMsgObj.author, args[1])
                        return client.reply(from, `✅ O tipo desse usuário foi definido para ${args[1].toUpperCase()}`,id)
                    } else {
                        return client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                    }
                } else if (mentionedJidList.length === 1){
                    if(ownerNumber.includes(mentionedJidList[0].replace("@c.us",""))) return client.reply(from, "[ERRO] Não é possivel alterar cargo do dono",id)
                    let c_registrado = await db.verificarRegistro(mentionedJidList[0])
                    if(c_registrado){
                        await db.alterarTipoUsuario(mentionedJidList[0], args[1])
                        return client.reply(from, `✅ O tipo desse usuário foi definido para ${args[1].toUpperCase()}`,id)
                    } else {
                        return client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                    }
                } else if(args.length >= 2){
                    let numero_usuario = ""
                    for (let i = 2; i < args.length; i++){
                        numero_usuario += args[i]
                    }
                    numero_usuario = numero_usuario.replace(/\W+/g,"")
                    if(ownerNumber.includes(numero_usuario)) return client.reply(from, "[ERRO] Não é possivel alterar cargo do dono",id)
                    let c_registrado = await db.verificarRegistro(numero_usuario+"@c.us")
                    if(c_registrado){
                        await db.alterarTipoUsuario(numero_usuario+"@c.us", args[1])
                        return client.reply(from, `✅ O tipo desse usuário foi definido para ${args[1].toUpperCase()}`,id)
                    } else {
                        return client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                    }
                } else {
                    client.reply(from, "[ERRO] Você deve responder algúem com *!cargo membro|admin* ou mencionar alguém após o comando",id)
                }
            } else {
                 client.reply(from, "[ERRO] Você deve escolher *Comum* ou *Vip* como cargo",id)
            }
            break
        
        case "!limparvip":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            await db.limparVip()
            client.reply(from, `✅ Todos os VIP foram convertidos para COMUM`,id)
            break
        
        case "!resetarcmd":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            db.resetarComandosDia().then(async()=>{
                client.reply(from, `✅ Os comandos diários de todos os usuários foram resetados`,id)
            })
            break

        case "!verdados":
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let vd_usuario = {}
            if(quotedMsg){
                let vd_registrado = await db.verificarRegistro(quotedMsgObj.author)
                if(vd_registrado){
                    vd_usuario = await db.obterUsuario(quotedMsgObj.author)
                } else {
                    return client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                }
            } else if (mentionedJidList.length === 1){
                let vd_registrado = await db.verificarRegistro(mentionedJidList[0])
                if(vd_registrado){
                    vd_usuario = await db.obterUsuario(mentionedJidList[0])
                } else {
                    return client.reply(from, "[❗] Este usuário ainda não está registrado",id)
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
                    return client.reply(from, "[❗] Este usuário ainda não está registrado",id)
                }
            } else {
               return client.reply(from, "[ERRO] Você deve responder algúem com *!verdados* ou mencionar alguém após o comando",id)
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
            msg_verdados += `Tipo de usuário : *${vd_usuario.tipo }*\n`
            msg_verdados += `Nome : *${vd_usuario.nome}*\n`
            msg_verdados += `Comandos usados hoje : *${vd_usuario.comandos_dia}/${max_comandos_vd}*\n`
            msg_verdados += `Limite diário : *${max_comandos_vd}*\n`
            msg_verdados += `Total de comandos usados : *${vd_usuario.comandos_total} comandos*\n`
            client.reply(from, msg_verdados, id)
            break

        case '!bc':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, msgs_texto.admin.bc.cmd_erro, id)
            let msg_bc = body.slice(4)
            const chats_bc = await client.getAllChatIds()
            for (let id_chat of chats_bc) {
                var chat_bc_info = await client.getChatById(id_chat)
                if (!chat_bc_info.isReadOnly) await client.sendText(id_chat, `[🤖 LBOT v2.0 ANÚNCIA]\n\n${msg_bc}`)
            }
            client.reply(from, msgs_texto.admin.bc.bc_sucesso , id)
            break
        
        case '!bcgrupos':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if(args.length === 1) return client.reply(from, msgs_texto.admin.bcgrupos.cmd_erro, id)
            let msg_bcgrupos = body.slice(10)
            const chats_bcgrupos = await client.getAllChatIds()
            for (let id_chat of chats_bcgrupos) {
                if(id_chat.match(/@g.us/g)){
                    var chat_bcgrupos_info = await client.getChatById(id_chat)
                    if (!chat_bcgrupos_info.isReadOnly) await client.sendText(id_chat, `[🤖LBOT v2.0 ANÚNCIA]\n\n${msg_bcgrupos}`)
                }
            }
            client.reply(from, msgs_texto.admin.bcgrupos.bc_sucesso , id)
            break
        
        case '!print':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            let print = await client.getSnapshot()
            await client.sendFile(from,print,"print.png",'Captura de Tela',id)
            break

        case '!estado':
            if (!isOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_bot, id)
            if(args.length != 2)  return client.reply(from,msgs_texto.admin.estado.cmd_erro,id)
            switch(args[1]){
                case 'online':
                    client.setMyStatus("🟢🤖 Bot online - Digite !ajuda")
                    break
                case 'offline':
                    client.setMyStatus("🔴🤖 Bot offline - Dormindo")
                    break    
                case 'manutencao':
                    client.setMyStatus("🟡🤖 Bot em manutenção")
                    break
                default:
                    client.reply(from,msgs_texto.admin.estado.cmd_erro,id)
            }
            break
    }
}