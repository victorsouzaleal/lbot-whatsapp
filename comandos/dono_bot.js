//REQUERINDO MODULOS
const {admin} = require('../lib/menu')
const msgs_texto = require('../lib/msgs')
const fs = require('fs-extra')

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