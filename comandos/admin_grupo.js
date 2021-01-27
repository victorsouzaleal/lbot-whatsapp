//REQUERINDO MODULOS
const {msgs_texto} = require('../lib/msgs')
const destravas = require("../lib/destravas")
const db = require('../database/database')
const fs = require('fs-extra')

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
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            let grupo_info = await client.getGroupInfo(groupId)
            let foto_grupo = await client.getProfilePicFromServer(groupId)
            await client.sendFile(from, foto_grupo, "foto-grupo.jpg", grupo_info.description)
            break
        case '!status':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            const g_status = await db.obterGrupo(groupId)
            let status_text = `[ 🤖 S T A T U S   D O   G R U P O 🤖 ]\n\n`
            status_text += "- Recurso Boas Vindas : "
            status_text += (g_status.bemvindo.status) ? " ✅\n" : " ❌\n"
            status_text += "- Recurso Anti-Link : "
            status_text += (g_status.antilink) ? " ✅\n" : " ❌\n"
            status_text += "- Recurso Anti-Fake : "
            status_text += (g_status.antifake) ? " ✅\n" : " ❌\n"
            status_text += "- Recurso Anti-Flood : "
            status_text += (g_status.antiflood.status) ? ` ✅ Máx: ${g_status.antiflood.max} mensagens\n` : " ❌\n"
            status_text += "- Recurso Contador : "
            status_text += (g_status.contador.status) ? ` ✅ ${g_status.contador.inicio}\n` : " ❌\n"
            status_text += "- Bloqueio de comandos : "
            status_text += (g_status.block_cmds.length != 0) ? ` ✅ *${g_status.block_cmds.toString()}*\n` : " ❌\n"
            client.sendText(from,status_text)
            break

        case '!bv':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if (args.length === 1) return client.reply(from, msgs_texto().grupo.bemvindo.cmd_erro, id)
            const bv_status = await db.obterGrupo(groupId)

            if (args[1].toLowerCase() === 'on') {
                if(!bv_status.bemvindo.status) {
                    let msg = ""
                    for(let i = 2; i < args.length; i++){
                        if(i == (args.length - 1)){
                            msg += args[i]
                        } else {
                            msg += args[i]+" "
                        }
                       
                    }
                    await db.alterarBemVindo(groupId,true,msg)
                    client.reply(from, msgs_texto().grupo.bemvindo.ligado, id)
                } else {
                    client.reply(from, msgs_texto().grupo.bemvindo.ja_ligado , id)

                }
            } else if (args[1].toLowerCase() === 'off') {
                if(bv_status.bemvindo.status) {
                    await db.alterarBemVindo(groupId,false)
                    client.reply(from, msgs_texto().grupo.bemvindo.desligado, id)
                } else {
                    client.reply(from, msgs_texto().grupo.bemvindo.ja_desligado , id)
                }
            } else {
                client.reply(from, msgs_texto().grupo.bemvindo.cmd_erro, id)
            }
            break

        case '!alink':
                if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto().permissao.bot_admin, id)
                if (args.length === 1) return client.reply(from, msgs_texto().grupo.antilink.cmd_erro, id)
                const al_status = await db.obterGrupo(groupId)

                if (args[1].toLowerCase() === 'on') {
                    if(!al_status.antilink){
                        await db.alterarAntiLink(groupId)
                        client.reply(from, msgs_texto().grupo.antilink.ligado, id)
                    } else {
                        client.reply(from, msgs_texto().grupo.antilink.ja_ligado , id)
                    } 
                } else if (args[1].toLowerCase() === 'off') {
                    if(al_status.antilink){
                        await db.alterarAntiLink(groupId,false)
                        client.reply(from, msgs_texto().grupo.antilink.desligado, id)
                    } else {
                        client.reply(from, msgs_texto().grupo.antilink.ja_desligado , id)
                    }
                } else {
                    client.reply(from, msgs_texto().grupo.antilink.cmd_erro, id)
                }
                break
        case '!rlink':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto().permissao.bot_admin, id)
            client.revokeGroupInviteLink(groupId).then(()=>{client.reply(from, msgs_texto().grupo.rlink.sucesso ,id)}).catch(()=>{client.reply(from, msgs_texto().grupo.rlink.erro ,id)})
            break        

        case '!afake':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto().permissao.bot_admin, id)
            if (args.length === 1) return client.reply(from, msgs_texto().grupo.antifake.cmd_erro, id)
            const af_status = await db.obterGrupo(groupId)

            if (args[1].toLowerCase() === 'on') {
                if(!af_status.antifake){
                    await db.alterarAntiFake(groupId)
                    client.reply(from,  msgs_texto().grupo.antifake.ligado, id)
                } else {
                    client.reply(from, msgs_texto().grupo.antifake.ja_ligado , id)
                } 
            } else if (args[1].toLowerCase() === 'off') {
                if(af_status.antifake){
                    await db.alterarAntiFake(groupId,false)
                    client.reply(from,  msgs_texto().grupo.antifake.desligado, id)
                } else {
                    client.reply(from, msgs_texto().grupo.antifake.ja_desligado , id)
                }
            } else {
                client.reply(from,  msgs_texto().grupo.antifake.cmd_erro , id)
            }
            break

        case '!contador':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if (args.length === 1) return client.reply(from, msgs_texto().grupo.contador.cmd_erro, id)
            const cont_status = await db.obterGrupo(groupId)
            const membros_atuais = await client.getGroupMembers(groupId)
            if (args[1].toLowerCase() === 'on') {
                if(!cont_status.contador.status){
                    await db.alterarContador(groupId)
                    await db.registrarContagemTodos(groupId,membros_atuais)
                    client.reply(from, msgs_texto().grupo.contador.ligado, id)
                } else {
                    client.reply(from, msgs_texto().grupo.contador.ja_ligado , id)
                } 
            } else if (args[1].toLowerCase() === 'off') {
                if(cont_status.contador.status){
                    await db.alterarContador(groupId,false)
                    await db.removerContagemGrupo(groupId)
                    client.reply(from,msgs_texto().grupo.contador.desligado, id)
                } else {
                    client.reply(from, msgs_texto().grupo.contador.ja_desligado , id)
                }
            } else {
                client.reply(from,  msgs_texto().grupo.contador.cmd_erro , id)
            }
            break

        case "!atividade":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            let atv_contador = await db.obterGrupo(groupId)
            if(!atv_contador.contador.status) return client.reply(from, msgs_texto().grupo.atividade.erro_contador , id)
            let atividade_usuario = null
            if(quotedMsg){
                if(quotedMsgObj.author == botNumber+"@c.us") return client.reply(from, msgs_texto().grupo.atividade.bot_erro , id)
                atividade_usuario = await db.obterAtividade(groupId,quotedMsgObj.author)
                if(atividade_usuario == null) return client.reply(from, msgs_texto().grupo.atividade.fora_grupo , id)
            } else if (mentionedJidList.length === 1){
                if(mentionedJidList[0] == botNumber+"@c.us") return client.reply(from, msgs_texto().grupo.atividade.bot_erro , id)
                atividade_usuario = await db.obterAtividade(groupId,mentionedJidList[0])
                if(atividade_usuario == null) return client.reply(from, msgs_texto().grupo.atividade.fora_grupo , id)
            } else {
               return client.reply(from, msgs_texto().grupo.atividade.cmd_erro,id)
            }

            let msg_atividade = `🤖 *Atividade do usuário* 🤖\n\n`
            msg_atividade += `📱 *Total de mensagens* : ${atividade_usuario.msg}\n`
            msg_atividade += `═════════════════\n`
            msg_atividade += `🔤 Textos enviados : ${atividade_usuario.texto}\n`
            msg_atividade += `📸 Imagens enviadas : ${atividade_usuario.imagem}\n`
            msg_atividade += `🎥 Videos enviados : ${atividade_usuario.video}\n`
            msg_atividade += `🖼️ Figurinhas enviadas : ${atividade_usuario.sticker}\n`
            msg_atividade += `🎙️ Gravaçôes enviadas : ${atividade_usuario.gravacao}\n`
            msg_atividade += `🎧 Arquivo de aúdio enviados : ${atividade_usuario.audio}\n`
            msg_atividade += `🧩 Outros : ${atividade_usuario.outro}\n`
            client.reply(from,msg_atividade,id)

            break
        
        case "!imarcar":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length == 1) return client.reply(from, msgs_texto().grupo.minativos.cmd_erro , id)
            if(isNaN(args[1])) return client.reply(from, msgs_texto().grupo.minativos.erro_qtd , id)
            if(args[1] < 1 || args[1] > 50) return client.reply(from, msgs_texto().grupo.minativos.limite_qtd, id)
            let mi_contador = await db.obterGrupo(groupId)
            if(!mi_contador.contador.status) return client.reply(from, msgs_texto().grupo.minativos.erro_contador, id)
            let mi_usuarios = await db.obterUsuariosInativos(groupId,args[1])
            let qtd_inativos = mi_usuarios.length - 1
            if(qtd_inativos != 0){
                let msg_inativos = `╔══✪〘🤖 Marcando todos que tem menos de ${args[1]} mensagens〙\n\n`
                msg_inativos += `👤 *Membros inativos* : ${qtd_inativos}\n`
                msg_inativos += `═════════════════\n`
                mi_usuarios.forEach(usuario =>{
                    if(usuario.id_usuario != botNumber+"@c.us") msg_inativos += `╠➥ @${usuario.id_usuario.replace(/@c.us/g, '')} - *${usuario.msg}* Msgs\n`   
                })
                msg_inativos += '╚═〘 LBOT v2.0 〙'
                client.sendTextWithMentions(from,msg_inativos)
            } else {
                client.reply(from,msgs_texto().grupo.minativos.sem_inativo,id)
            }
            break
            
        case "!ibanir":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length == 1) return client.reply(from, msgs_texto().grupo.binativos.cmd_erro, id)
            if(isNaN(args[1])) return client.reply(from, msgs_texto().grupo.binativos.erro_qtd , id)
            if(args[1] < 1 || args[1] > 50) return client.reply(from, msgs_texto().grupo.binativos.limite_qtd , id)
            let bi_contador = await db.obterGrupo(groupId)
            if(!bi_contador.contador.status) return client.reply(from, msgs_texto().grupo.binativos.erro_contador , id)
            let bi_usuarios = await db.obterUsuariosInativos(groupId,args[1])
            if(bi_usuarios.length != 0){
                bi_usuarios.forEach(async usuario =>{
                    if(usuario.id_usuario != botNumber+"@c.us") await client.removeParticipant(from,usuario.id_usuario)
                })
                client.reply(from,`🤖✅ ${bi_usuarios.length - 1} Membros com menos de ${args[1]} mensagens foram banidos.`,id)
            } else {
                client.reply(from,msgs_texto().grupo.binativos.sem_inativo,id)
            }
            break
        
        case "!topativos":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length == 1) return client.reply(from, msgs_texto().grupo.topativos.cmd_erro , id)
            if(isNaN(args[1])) return client.reply(from, msgs_texto().grupo.topativos.erro_qtd , id)
            if(args[1] < 1 || args[1] > 50) return client.reply(from, msgs_texto().grupo.topativos.limite_qtd , id)
            let ta_contador = await db.obterGrupo(groupId)
            if(!ta_contador.contador.status) return client.reply(from, msgs_texto().grupo.topativos.erro_contador , id)
            let top_ativos = await db.obterUsuariosAtivos(groupId,args[1])
            let msg_top_ativos = `╔══✪〘🏆 TOP ${args[1]} ATIVOS 🏆 〙\n╠\n`
            for (let i = 0 ; i < top_ativos.length ; i++){
                let medalha = ''
                switch(i+1){
                    case 1:
                        medalha = '🥇'
                    break
                    case 2:
                        medalha = '🥈'
                    break
                    case 3:
                        medalha = '🥉'
                    break
                    default:
                        medalha = ''
                }
                msg_top_ativos += `╠➥ ${medalha} ${i+1}° Lugar @${top_ativos[i].id_usuario.replace(/@c.us/g, '')} - *${top_ativos[i].msg}* Msgs\n`
            }
            await client.sendTextWithMentions(from,msg_top_ativos)
            break
        
        case "!enquete":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length == 1) return client.reply(from, msgs_texto().grupo.enquete.cmd_erro , id)
            let enq_grupo = await db.obterGrupo(groupId)
            if(args[1] != "off"){
                if(enq_grupo.enquete.status) return client.reply(from, msgs_texto().grupo.enquete.ja_aberta , id)
                //if((enq_grupo.enquete.opcoes.find(opcao => opcao.votos.includes(sender.id))) != undefined) 
                let enquete_entrada = body.slice(9).split(",")
                let pergunta = enquete_entrada.shift()
                let opcoes = enquete_entrada
                if(opcoes.length < 2) return client.reply(from, msgs_texto().grupo.enquete.min_opcao , id)
                await db.alterarEnquete(groupId,true,pergunta,opcoes)
                await client.reply(from, msgs_texto().grupo.enquete.aberta,id)
            } else {
                if(!enq_grupo.enquete.status) return client.reply(from, msgs_texto().grupo.enquete.ja_fechada , id)
                let pergunta = enq_grupo.enquete.pergunta
                let opcoes = enq_grupo.enquete.opcoes
                let r_final = "[ 📋 RESULTADO DA ENQUETE 📋]\n\n"
                r_final += `❔ Pergunta : *${pergunta}* \n\n`
                opcoes.forEach(opcao =>{
                    r_final += `▫️ Opção ${opcao.digito} -> ${opcao.opcao.trim()} - *${opcao.qtd_votos}* Votos \n\n`
                })
                await db.alterarEnquete(groupId,false)
                await client.sendText(from, msgs_texto().grupo.enquete.fechada).then(async ()=>{
                    await client.sendText(from,r_final)
                })
            }
            break
        
        case '!votarenquete':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            let ve_grupo = await db.obterGrupo(groupId)
            if(!ve_grupo.enquete.status) return client.reply(from, msgs_texto().grupo.votarenquete.sem_enquete , id)
            if(args.length == 1) return client.reply(from, msgs_texto().grupo.votarenquete.cmd_erro , id)
            if(isNaN(args[1])) return client.reply(from, msgs_texto().grupo.votarenquete.opcao_erro , id)
            if((ve_grupo.enquete.opcoes.find(opcao => opcao.votos.includes(sender.id))) != undefined)  return client.reply(from, msgs_texto().grupo.votarenquete.ja_votou , id)
            if((ve_grupo.enquete.opcoes.find(opcao => opcao.digito == args[1])) == undefined)  return client.reply(from, msgs_texto().grupo.votarenquete.opcao_invalida , id)
            await db.addVotoEnquete(groupId,sender.id,args[1]).then(async ()=>{
                await client.reply(from,msgs_texto().grupo.votarenquete.sucesso,id)
            })
            break
        
        case '!verenquete':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            let ver_grupo = await db.obterGrupo(groupId)
            if(!ver_grupo.enquete.status) return client.reply(from, msgs_texto().grupo.verenquete.sem_enquete , id)
            let ver_enq = "[📋 ENQUETE ATUAL 📋]\n\n"
            ver_enq += `❔ Pergunta : *${ver_grupo.enquete.pergunta}* \n\n`
            ver_grupo.enquete.opcoes.forEach(opcao =>{
                ver_enq += `▫️ !votarenquete *${opcao.digito}* --> ${opcao.opcao.trim()} \n\n`
            })
            ver_enq += `Para votar digite *!votarenquete numero-opcao*`
            await client.reply(from,ver_enq,id)
            break

        case "!destravar":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            let lista_destravas = destravas.destravas()
            lista_destravas.forEach(destrava =>{
                client.sendText(from,destrava)
            })
            break
        
        case '!aflood':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto().permissao.bot_admin, id)
            if (args.length === 1) return client.reply(from, msgs_texto().grupo.antiflood.cmd_erro, id)
            const afl_status = await db.obterGrupo(groupId)
            let max_flood = 10
            let estado = ""

            if(!isNaN(args[1])){
                if(args[1]>= 5 && args[1] <= 20){
                    max_flood = args[1]
                    estado = args[2]
                } else {
                    return client.reply(from, msgs_texto().grupo.antiflood.max,id)
                }
            } else {
                estado = args[1]
            }
            
            if (estado.toLowerCase() === 'on') {
                if(afl_status.antiflood.status) return client.reply(from, msgs_texto().grupo.antiflood.ja_ligado , id)
                await db.alterarAntiFlood(groupId,true,max_flood)
                client.reply(from,  msgs_texto().grupo.antiflood.ligado, id)
            } else if (estado.toLowerCase() === 'off') {
                if(!afl_status.antiflood.status) return client.reply(from, msgs_texto().grupo.antiflood.ja_desligado , id)
                await db.alterarAntiFlood(groupId,false)
                client.reply(from,  msgs_texto().grupo.antiflood.desligado, id)
            } else {
                client.reply(from, msgs_texto().grupo.antiflood.cmd_erro , id)
            }
            break
        
        case "!votacao":
            const vb_status = await db.obterGrupo(groupId)
            if(!vb_status.voteban.status) {
                client.reply(from, msgs_texto().grupo.voteban.sem_votacao, id)
            } else {
                client.sendTextWithMentions(from, `Atualmente existe um membro em votação : @${vb_status.voteban.usuario}`)
            }
            break
        
        case '!votar':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            const votar_status = await db.obterGrupo(groupId)
            if(!votar_status.voteban.status) return client.reply(from, msgs_texto().grupo.voteban.sem_votacao , id)
            if(votar_status.voteban.votou.indexOf(sender.id) != -1) return client.reply(from, msgs_texto().grupo.voteban.ja_votou ,id)
            let voteban  = await db.addVoto(groupId,sender.id)
            await client.reply(from, `[VOTE BAN] Você votou com sucesso no membro em votação. (${votar_status.voteban.votos + 1}/${votar_status.voteban.max} Votos)`,id)
            if(voteban){
                if (isBotGroupAdmins) {
                    await client.removeParticipant(from, votar_status.voteban.usuario)
                    .then(()=>{
                        client.sendTextWithMentions(from, `[VOTE BAN] O membro @${votar_status.voteban.usuario} que estava em votação foi banido com sucesso. VIVA A DEMOCRACIA!`)
                    }).catch(()=>{
                        client.sendText(from, msgs_texto().grupo.voteban.erro_ban)
                    })
                } else {
                    client.reply(from, msgs_texto().grupo.voteban.erro_botadmin , id)
                }
                await db.alterarVoteban(groupId,false)
            }

            break   
        case "!vb":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto().permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length === 1) return client.reply(from, msgs_texto().grupo.voteban.cmd_erro ,id)
            const vtb_status = await db.obterGrupo(groupId)
            if(args[1] == "on"){
                if(vtb_status.voteban.status) return client.reply(from, msgs_texto().grupo.voteban.ja_aberto ,id)
                if(mentionedJidList.length != 1) return client.reply(from, msgs_texto().grupo.voteban.erro_mencao ,id)
                if(mentionedJidList[0] == botNumber+"@c.us" || mentionedJidList[0] == chat.groupMetadata.owner) return client.reply(from, msgs_texto().grupo.voteban.erro_dono ,id)
                if(isNaN(args[3])) return client.reply(from, msgs_texto().grupo.voteban.erro_num_votos ,id)
                if(args[3] < 3 || args[3]> 30) return client.reply(from, msgs_texto().grupo.voteban.limit_num_votos ,id)
                await db.alterarVoteban(groupId,true,args[3],mentionedJidList[0])
                client.sendTextWithMentions(from, `[VOTE BAN] Uma votação foi aberta para expulsar o membro @${mentionedJidList[0]}. (0/${args[3]} Votos)\n\nO comando *!votar* foi habilitado.`)
            } else if(args[1] == "off"){
                if (!vtb_status.voteban.status) return client.reply(from,msgs_texto().grupo.voteban.sem_votacao,id)
                client.sendTextWithMentions(from, `[VOTE BAN] A votação para expulsar @${vtb_status.voteban.usuario} foi encerrada.`)
                await db.alterarVoteban(groupId,false)
            } else {
                client.reply(from,msgs_texto().grupo.voteban.cmd_erro,id)
            }
            break

        case "!bcmd":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length === 1) return client.reply(from, msgs_texto().grupo.bcmd.cmd_erro ,id)
            let msg_resp = "[🤖 *Bloquear comandos* 🤖]\n\n"
            let b_cmd_inseridos = body.slice(6).split(" ")
            let b_cmd_verificados = []
            const lista_comandos = JSON.parse(fs.readFileSync('./comandos/comandos.json'))
            let b_cmd_grupo = await db.obterGrupo(groupId)
            b_cmd_inseridos.forEach(b_cmd =>{
                if(lista_comandos.utilidades.includes(b_cmd) || lista_comandos.diversao.includes(b_cmd)){
                    if(b_cmd_grupo.block_cmds.includes(b_cmd)){
                        msg_resp+= `- Comando *${b_cmd}* já está bloqueado.\n`
                    } else {
                        b_cmd_verificados.push(b_cmd)
                        msg_resp+= `- Comando *${b_cmd}* bloqueado com sucesso.\n`
                    }
                    
                } else if (lista_comandos.admin_grupo.includes(b_cmd) || lista_comandos.dono_bot.includes(b_cmd) ){
                    msg_resp+= `- Comando *${b_cmd}* não pode ser bloqueado (Comando ADMIN).\n`
                } else {
                    msg_resp+= `- Comando *${b_cmd}* não existe.\n`
                }
            })
            if(b_cmd_verificados.length != 0) await db.addBlockedCmd(groupId, b_cmd_verificados)
            client.reply(from, msg_resp, id)
            break
        
        case "!dcmd":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if(args.length === 1) return client.reply(from,msgs_texto().grupo.dcmd.cmd_erro,id)
            let d_msg_resp = "[🤖 *Desbloquear Comandos* 🤖]\n\n"
            let d_cmd_inseridos = body.slice(6).split(" ")
            let d_cmd_verificados = []
            let d_cmd_grupo = await db.obterGrupo(groupId)
            d_cmd_inseridos.forEach((d_cmd) =>{
                if(d_cmd_grupo.block_cmds.includes(d_cmd)) {
                    d_cmd_verificados.push(d_cmd)
                    d_msg_resp += `- Comando *${d_cmd}* foi desbloqueado.\n`
                } else {
                    d_msg_resp += `- Comando *${d_cmd}* já esta desbloqueado ou nunca foi bloqueado.\n`
                }
            })
            if(d_cmd_verificados.length != 0) await db.removeBlockedCmd(groupId, d_cmd_verificados)
            client.reply(from, d_msg_resp, id)
            break

        case '!link':
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto().permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `\nLink do grupo : *${name}*`)
            } else {
            	client.reply(from, msgs_texto().permissao.grupo , id)
            }
            break

        case '!adms':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            let mimin = ''
            for (let admon of groupAdmins) {
                mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` 
            }
            await client.sendTextWithMentions(from, mimin)
            break

        case "!dono":
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            const Owner_ = chat.groupMetadata.owner
            await client.sendTextWithMentions(from, `🤖 O Dono do grupo é : @${Owner_}`)
            break

        case '!mt':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)
            const groupMem = await client.getGroupMembers(groupId)
            let hehe =  (args.length > 1) ? `╔══✪〘${body.slice(4)}〙✪══\n` : '╔══✪〘🤖 Marcando Todos 〙✪══\n'
            for (let i = 0; i < groupMem.length; i++) {
                hehe += '╠➥'
                hehe += `@${groupMem[i].id.replace(/@c.us/g, '')}\n`
            }
            hehe += '╚═〘 LBOT v2.0 〙'
            await client.sendTextWithMentions(from, hehe)
            break

        case '!bantodos':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            const isGroupOwner = sender.id === chat.groupMetadata.owner
            if (!isGroupOwner) return client.reply(from, msgs_texto().permissao.apenas_dono_grupo, id)           
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto().permissao.bot_admin, id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (!groupAdmins.includes(allMem[i].id)) await client.removeParticipant(groupId, allMem[i].id)
            }
            client.reply(from, msgs_texto().grupo.banirtodos.banir_sucesso, id)
            break  
        
        case '!add':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (args.length === 1) return client.reply(from, msgs_texto().grupo.add.cmd_erro, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto().permissao.bot_admin, id)
            const add_number = body.slice(5).replace(/\W+/g,"")
            try {
                await client.addParticipant(from,`${add_number}@c.us`)
            } catch (err) {
                client.reply(from, msgs_texto().grupo.add.add_erro, id)
            }
            break

        case '!ban':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto().permissao.bot_admin, id)
            if (mentionedJidList.length === 0){
                if(!quotedMsg) return client.reply(from, msgs_texto().grupo.banir.cmd_erro, id)
                if (groupAdmins.includes(quotedMsgObj.author)) return client.reply(from, msgs_texto().grupo.banir.banir_admin, id)
                await client.removeParticipant(groupId, quotedMsgObj.author).then(async()=>{
                    await client.sendText(from, msgs_texto().grupo.banir.banir_sucesso)
                }).catch(async ()=>{
                    await client.reply(from, msgs_texto().grupo.banir.banir_erro,id)
                })        
            } else {
                for (let i = 0; i < mentionedJidList.length; i++) {
                    if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, msgs_texto().grupo.banir.banir_admin, id)
                    await client.removeParticipant(groupId, mentionedJidList[i]).then(async()=>{
                        await client.sendText(from, msgs_texto().grupo.banir.banir_sucesso)
                    }).catch(async ()=>{
                        await client.reply(from,  msgs_texto().grupo.banir.banir_erro, id)
                    })
                }
            }        
            break

        case '!promover':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo , id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto().permissao.bot_admin, id)
            if (mentionedJidList.length === 0) return client.reply(from, msgs_texto().grupo.promover.cmd_erro, id)
            if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto().grupo.promover.limite_membro, id)
            if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto().grupo.promover.admin, id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sucesso! O membro @${mentionedJidList[0]} virou ADMINISTRADOR.`)
            break

        case '!rebaixar':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto().permissao.bot_admin, id)
            if (mentionedJidList.length === 0) return client.reply(from, msgs_texto().grupo.rebaixar.cmd_erro, id)
            if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto().grupo.rebaixar.limite_membro, id)
            if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto().grupo.rebaixar.admin, id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `✅ Sucesso! O membro @${mentionedJidList[0]} foi rebaixado para MEMBRO.`)
            break
        case '!apg':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)
            if (!quotedMsg) return client.reply(from, msgs_texto().grupo.apagar.cmd_erro, id)
            if (!quotedMsgObj.fromMe) return client.reply(from, msgs_texto().grupo.apagar.minha_msg, id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case '!f':
            if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
            if (!isBotGroupAdmins) return client.reply(from, msgs_texto().permissao.bot_admin, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin, id)   
            if(args.length === 1) return client.reply(from, msgs_texto().grupo.fechar.cmd_erro, id)
            client.setGroupToAdminsOnly(groupId,(args[1] == "on") ? true : false)
            break
         
    }
}