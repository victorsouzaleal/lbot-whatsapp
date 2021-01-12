//REQUERINDO MODULOS
const fs = require('fs-extra')
const msgs_texto = require('../lib/msgs')


module.exports = admin_grupo = async(client,message) => {
    const { id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj, mentionedJidList } = message
    let { body } = message
    const { name } = chat
    let { pushname, verifiedName } = sender
    pushname = pushname || verifiedName
    const commands = caption || body || ''
    const command = commands.toLowerCase().split(' ')[0] || ''
    const args =  commands.split(' ')
    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false

    switch(command){
        //##################### ADMINISTRAÇÃO GRUPO #########################
        case '!regras':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            let grupo_info = await client.getChatById(groupId)
            await client.sendFileFromUrl(from, grupo_info.contact.profilePicThumbObj.eurl, grupo_info.contact.name, grupo_info.groupMetadata.desc,id)
            break
        case '!status':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            const status_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            const isWelcome = status_recursos.bemvindo.includes(groupId)
            const isAntilink = status_recursos.antilink.includes(groupId)
            const isAntifake = status_recursos.antifake.includes(groupId)
            const isAntiflood_on = status_recursos.antiflood.grupos.includes(groupId)

            let status_text = `[S T A T U S   D O   G R U P O]\n\n`
            status_text += "- Recurso Boas Vindas : "
            status_text += (isWelcome) ? "✅ Ligado\n" : "❌ Desligado\n"
            status_text += "- Recurso Anti-Link de Grupos : "
            status_text += (isAntilink) ? "✅ Ligado\n" : "❌ Desligado\n"
            status_text += "- Recurso Anti-Fake : "
            status_text += (isAntifake) ? "✅ Ligado\n" : "❌ Desligado\n"
            status_text += "- Recurso Anti-Flood : "
            status_text += (isAntiflood_on) ? `✅ Ligado (Máx: ${status_recursos.antiflood.dados[status_recursos.antiflood.dados.findIndex(dado => dado.groupId == groupId)].max} mensagens)\n` : "❌ Desligado\n"
            client.sendText(from,status_text)
            break

        case '!bv':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (args.length === 1) return client.reply(from, msgs_texto.grupo.bemvindo.cmd_erro, id)
            const bv_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))

            if (args[1].toLowerCase() === 'on') {
                if(!bv_recursos.bemvindo.includes(chat.id)) {
                    bv_recursos.bemvindo.push(chat.id)
                    fs.writeFileSync('./lib/recursos.json', JSON.stringify(bv_recursos))
                    client.reply(from, msgs_texto.grupo.bemvindo.ligado, id)
                } else {
                    client.reply(from, msgs_texto.grupo.bemvindo.ja_ligado , id)

                }
            } else if (args[1].toLowerCase() === 'off') {
                if(bv_recursos.bemvindo.includes(chat.id)) {
                    bv_recursos.bemvindo.splice(bv_recursos.bemvindo.indexOf(chat.id), 1)
                    fs.writeFileSync('./lib/recursos.json', JSON.stringify(bv_recursos))
                    client.reply(from, msgs_texto.grupo.bemvindo.desligado, id)
                } else {
                    client.reply(from, msgs_texto.grupo.bemvindo.ja_desligado , id)
                }
            } else {
                client.reply(from, msgs_texto.grupo.bemvindo.cmd_erro, id)
            }
            break

        case '!alink':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (args.length === 1) return client.reply(from, msgs_texto.grupo.antilink.cmd_erro, id)
                const al_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))

                if (args[1].toLowerCase() === 'on') {
                    if(!al_recursos.antilink.includes(chat.id)){
                        al_recursos.antilink.push(chat.id)
                        fs.writeFileSync('./lib/recursos.json', JSON.stringify(al_recursos))
                        client.reply(from, msgs_texto.grupo.antilink.ligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.antilink.ja_ligado , id)
                    } 
                } else if (args[1].toLowerCase() === 'off') {
                    if(al_recursos.antilink.includes(chat.id)){
                        al_recursos.antilink.splice(al_recursos.antilink.indexOf(chat.id), 1)
                        fs.writeFileSync('./lib/recursos.json', JSON.stringify(al_recursos))
                        client.reply(from, msgs_texto.grupo.antilink.desligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.antilink.ja_desligado , id)
                    }
                    
                } else {
                    client.reply(from, msgs_texto.grupo.antilink.cmd_erro, id)
                }
                break
        case '!rlink':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            client.revokeGroupInviteLink(groupId).then(()=>{client.reply(from, msgs_texto.grupo.rlink.sucesso ,id)}).catch(()=>{client.reply(from, msgs_texto.grupo.rlink.erro ,id)})
            break        

        case '!afake':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (args.length === 1) return client.reply(from, msgs_texto.grupo.antifake.cmd_erro, id)
            const af_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))

            if (args[1].toLowerCase() === 'on') {
                if(!af_recursos.antifake.includes(chat.id)){
                    af_recursos.antifake.push(chat.id)
                    fs.writeFileSync('./lib/recursos.json', JSON.stringify(af_recursos))
                    client.reply(from,  msgs_texto.grupo.antifake.ligado, id)
                } else {
                    client.reply(from, msgs_texto.grupo.antifake.ja_ligado , id)
                } 
            } else if (args[1].toLowerCase() === 'off') {
                if(af_recursos.antifake.includes(chat.id)){
                    af_recursos.antifake.splice(af_recursos.antifake.indexOf(chat.id), 1)
                    fs.writeFileSync('./lib/recursos.json', JSON.stringify(af_recursos))
                    client.reply(from,  msgs_texto.grupo.antifake.desligado, id)
                } else {
                    client.reply(from, msgs_texto.grupo.antifake.ja_desligado , id)
                }
            } else {
                client.reply(from,  msgs_texto.grupo.antifake.cmd_erro , id)
            }
            break
        
        case '!aflood':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (args.length === 1) return client.reply(from, msgs_texto.grupo.antiflood.cmd_erro, id)
            const afl_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            let max_flood = 10
            let estado = ""

            if(!isNaN(args[1])){
                console.log(args[1] + " " + args[2])
                if(args[1]>= 5 && args[1] <= 20){
                    max_flood = args[1]
                    estado = args[2]
                } else {
                    return client.reply(from, msgs_texto.grupo.antiflood.max,id)
                }
            } else {
                estado = args[1]
            }
            
            if (estado.toLowerCase() === 'on') {
                if(afl_recursos.antiflood.grupos.includes(chat.id)) return client.reply(from, msgs_texto.grupo.antiflood.ja_ligado , id)
                afl_recursos.antiflood.grupos.push(chat.id)
                afl_recursos.antiflood.dados.push({
                    groupId : chat.id,
                    max: max_flood,
                    msgs : []
                })
                fs.writeFileSync('./lib/recursos.json', JSON.stringify(afl_recursos))
                client.reply(from,  msgs_texto.grupo.antiflood.ligado, id)
            } else if (estado.toLowerCase() === 'off') {
                if(!afl_recursos.antiflood.grupos.includes(chat.id)) return client.reply(from, msgs_texto.grupo.antiflood.ja_desligado , id)
                afl_recursos.antiflood.grupos.splice(afl_recursos.antiflood.grupos.indexOf(chat.id),1)
                afl_recursos.antiflood.dados.splice(afl_recursos.antiflood.dados.findIndex(dado => dado.groupId == chat.id),1)
                fs.writeFileSync('./lib/recursos.json', JSON.stringify(afl_recursos))
                client.reply(from,  msgs_texto.grupo.antiflood.desligado, id)
            } else {
                client.reply(from, msgs_texto.grupo.antiflood.cmd_erro , id)
            }
            break
        
        case "!votacao":
            const vb_recursos_votacao = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            let index_votacao = vb_recursos_votacao.voteban.findIndex(voto => voto.grupo == groupId)
            if((index_votacao == -1)) {
                client.reply(from, msgs_texto.grupo.voteban.sem_votacao, id)
            } else {
                client.sendTextWithMentions(from, `Atualmente existe um membro em votação : @${vb_recursos_votacao.voteban[index_votacao].usuario}`)
            }
            break
        
        case '!votar':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            const vb_recursos_votar = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            let index_votar = vb_recursos_votar.voteban.findIndex(voto => voto.grupo == groupId)
            if(index_votar == -1) return client.reply(from, msgs_texto.grupo.voteban.sem_votacao , id)
            if(vb_recursos_votar.voteban[index_votar].votos.indexOf(sender.id) != -1) return client.reply(from, msgs_texto.grupo.voteban.ja_votou ,id)
            vb_recursos_votar.voteban[index_votar].votos.push(sender.id)
            fs.writeFileSync('./lib/recursos.json', JSON.stringify(vb_recursos_votar))
            await client.reply(from, `[VOTE BAN] Você votou com sucesso no membro em votação. (${vb_recursos_votar.voteban[index_votar].votos.length}/${vb_recursos_votar.voteban[index_votar].max_votos} Votos)`,id)
            if(vb_recursos_votar.voteban[index_votar].votos.length == vb_recursos_votar.voteban[index_votar].max_votos){
                if (isBotGroupAdmins) {
                    await client.removeParticipant(from, vb_recursos_votar.voteban[index_votar].usuario)
                    .then(()=>{
                        client.sendTextWithMentions(from, `[VOTE BAN] O membro @${vb_recursos_votar.voteban[index_votar].usuario} que estava em votação foi banido com sucesso. VIVA A DEMOCRACIA!`)
                    }).catch(()=>{
                        client.sendText(from, msgs_texto.grupo.voteban.erro_ban)
                    })
                    
                } else {
                    client.reply(from, msgs_texto.grupo.voteban.erro_botadmin , id)
                }
                vb_recursos_votar.voteban.splice(index_votar,1)
                fs.writeFileSync('./lib/recursos.json', JSON.stringify(vb_recursos_votar))
            }

            break   
        case "!vb":
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if(args.length === 1) return client.reply(from, msgs_texto.grupo.voteban.cmd_erro ,id)
            const vb_recursos = JSON.parse(fs.readFileSync('./lib/recursos.json'))
            if(args[1] == "on"){
                if(vb_recursos.voteban.findIndex(voto => voto.grupo == groupId) != -1) return client.reply(from, msgs_texto.grupo.voteban.ja_aberto ,id)
                if(mentionedJidList.length != 1) return client.reply(from, msgs_texto.grupo.voteban.erro_mencao ,id)
                if(mentionedJidList[0] == botNumber+"@c.us" || mentionedJidList[0] == chat.groupMetadata.owner) return client.reply(from, msgs_texto.grupo.voteban.erro_dono ,id)
                if (vb_recursos.voteban.findIndex(voto => voto.usuario == mentionedJidList[0]) != -1) return client.reply(from, msgs_texto.grupo.voteban.membro_ja_aberto ,id)
                if(isNaN(args[3])) return client.reply(from, msgs_texto.grupo.voteban.erro_num_votos ,id)
                if(args[3] < 3 || args[3]> 30) return client.reply(from, msgs_texto.grupo.voteban.limit_num_votos ,id)
                vb_recursos.voteban.push({grupo : groupId, usuario: mentionedJidList[0], max_votos: args[3], votos: []})
                fs.writeFileSync('./lib/recursos.json', JSON.stringify(vb_recursos))
                client.sendTextWithMentions(from, `[VOTE BAN] Uma votação foi aberta para expulsar o membro @${mentionedJidList[0]}. (0/${args[3]} Votos)\n\nO comando *!votar* foi habilitado.`)
            } else if(args[1] == "off"){
                let index_usuario = vb_recursos.voteban.findIndex(voto => voto.grupo == groupId)
                if (index_usuario == -1) return client.reply(from,msgs_texto.grupo.voteban.sem_votacao,id)
                client.sendTextWithMentions(from, `[VOTE BAN] A votação para expulsar @${vb_recursos.voteban[index_usuario].usuario} foi encerrada.`)
                vb_recursos.voteban.splice(index_usuario,1)
                fs.writeFileSync('./lib/recursos.json', JSON.stringify(vb_recursos))
            } else {
                client.reply(from,msgs_texto.grupo.voteban.cmd_erro,id)
            }
            break

        case '!link':
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo : *${name}*`)
            } else {
            	client.reply(from, msgs_texto.permissao.grupo , id)
            }
            break

        case '!adms':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break

        case "!dono":
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `🤖 O Dono do grupo é : @${Owner_}`)
            break

        case '!mt':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe =  (args.length > 1) ? `╔══✪〘${body.slice(4)}〙✪══\n` : '╔══✪〘🤖 Marcando Todos 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 LBOT v2.0 〙'
            await client.sendTextWithMentions(from, hehe)
            break

        case '!bantodos':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, msgs_texto.permissao.apenas_dono_grupo, id)           
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (!groupAdmins.includes(allMem[i].id)) await client.removeParticipant(groupId, allMem[i].id)
            }
            client.reply(from, msgs_texto.grupo.banirtodos.banir_sucesso, id)
            break  
        
        case '!add':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (args.length === 1) return client.reply(from, msgs_texto.grupo.add.cmd_erro, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            const add_number = body.slice(5).replace(/\W+/g,"")
            try {
                await client.addParticipant(from,`${add_number}@c.us`)
            } catch (err) {
                client.reply(from, msgs_texto.grupo.add.add_erro, id)
            }
            break

        case '!ban':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto.grupo.banir.cmd_erro, id)
                if (groupAdmins.includes(quotedMsgObj.author)) return client.reply(from, msgs_texto.grupo.banir.banir_admin, id)
                try{
                    await client.removeParticipant(groupId, quotedMsgObj.author)
                    await client.sendText(from, msgs_texto.grupo.banir.banir_sucesso)
                } catch {
                    client.reply(from, msgs_texto.grupo.banir.banir_erro,id)
                }
                
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, msgs_texto.grupo.banir.banir_admin, id)
                    try{
                        await client.removeParticipant(groupId, mentionedJidList[i])
                        await client.sendText(from, msgs_texto.grupo.banir.banir_sucesso)
                    } catch {
                        client.reply(from,  msgs_texto.grupo.banir.banir_erro, id)
                    }
                }
            }        
            break

        case '!promover':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo , id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (mentionedJidList.length === 0) return client.reply(from, msgs_texto.grupo.promover.cmd_erro, id)
            if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto.grupo.promover.limite_membro, id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto.grupo.promover.admin, id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sucesso! O membro @${mentionedJidList[0]} virou ADMINISTRADOR.`)
            break

        case '!rebaixar':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (mentionedJidList.length === 0) return client.reply(from, msgs_texto.grupo.rebaixar.cmd_erro, id)
            if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto.grupo.rebaixar.limite_membro, id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto.grupo.rebaixar.admin, id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sucesso! O membro @${mentionedJidList[0]} foi rebaixado para MEMBRO.`)
            break
        case '!apg':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
            if (!quotedMsg) return client.reply(from, msgs_texto.grupo.apagar.cmd_erro, id)
            if (!quotedMsgObj.fromMe) return client.reply(from, msgs_texto.grupo.apagar.minha_msg, id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case '!f':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)   
            if(args.length === 1) return client.reply(from, msgs_texto.grupo.fechar.cmd_erro, id)
            client.setGroupToAdminsOnly(groupId,(args[1] == "on") ? true : false)
            break
         
    }
}