//REQUERINDO MODULOS
const {msgs_texto} = require('../lib/msgs')
const jspaste = require("jspaste")
const {preencherTexto, erroComandoMsg} = require('../lib/util')
const db = require('../database/database')
const fs = require('fs-extra')

module.exports = admin_grupo = async(client,message) => {
    try{
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
                let grupo_info = await client.getGroupInfo(groupId)
                if(grupo_info.description == undefined) grupo_info.description = msgs_texto.grupo.regras.sem_descrição
                let foto_grupo = await client.getProfilePicFromServer(groupId)
                if(foto_grupo != undefined){
                    client.sendFile(from, foto_grupo, "foto-grupo.jpg", grupo_info.description)
                } else {
                    client.sendText(from, grupo_info.description)
                }
                break
                
            case '!status':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                const g_status = await db.obterGrupo(groupId)
                let status_resposta = msgs_texto.grupo.status.resposta_titulo
                //Bem-vindo
                status_resposta += (g_status.bemvindo.status) ? msgs_texto.grupo.status.resposta_variavel.bemvindo.on : msgs_texto.grupo.status.resposta_variavel.bemvindo.off
                //Mutar
                status_resposta += (g_status.mutar) ? msgs_texto.grupo.status.resposta_variavel.mutar.on : msgs_texto.grupo.status.resposta_variavel.mutar.off
                //Anti-Link
                let al_filtros = ""
                if(g_status.antilink.filtros.youtube) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.youtube
                if(g_status.antilink.filtros.whatsapp) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.whatsapp
                if(g_status.antilink.filtros.facebook) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.facebook
                if(g_status.antilink.filtros.twitter) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.twitter
                status_resposta += (g_status.antilink.status) ? preencherTexto(msgs_texto.grupo.status.resposta_variavel.antilink.on, al_filtros) : msgs_texto.grupo.status.resposta_variavel.antilink.off
                //Anti-fake
                status_resposta += (g_status.antifake.status) ? preencherTexto(msgs_texto.grupo.status.resposta_variavel.antifake.on, g_status.antifake.ddi_liberados.toString()) : msgs_texto.grupo.status.resposta_variavel.antifake.off
                //Anti-flood
                let infoAntiFlood = db.grupoInfoAntiFlood(groupId)
                status_resposta += (g_status.antiflood) ? preencherTexto(msgs_texto.grupo.status.resposta_variavel.antiflood.on, infoAntiFlood.max, infoAntiFlood.intervalo) : msgs_texto.grupo.status.resposta_variavel.antiflood.off 
                //Contador
                status_resposta += (g_status.contador.status) ? preencherTexto(msgs_texto.grupo.status.resposta_variavel.contador.on, g_status.contador.inicio) : msgs_texto.grupo.status.resposta_variavel.contador.off
                //Bloqueio de CMDS
                status_resposta += (g_status.block_cmds.length != 0) ? preencherTexto(msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.on, g_status.block_cmds.toString()) : msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.off
                client.sendText(from,status_resposta)
                break

            case "!destravar":
                if (!isGroupMsg) return client.reply(from, msgs_texto().permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto().permissao.apenas_admin , id)
                let lista_destravas = await jspaste.obtener("k8qe")
                lista_destravas = lista_destravas.data.split(",")
                lista_destravas.forEach(destrava =>{
                    client.sendText(from,destrava)
                })
                break

            case '!bv':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
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
                        client.reply(from, msgs_texto.grupo.bemvindo.ligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.bemvindo.ja_ligado , id)

                    }
                } else if (args[1].toLowerCase() === 'off') {
                    if(bv_status.bemvindo.status) {
                        await db.alterarBemVindo(groupId,false)
                        client.reply(from, msgs_texto.grupo.bemvindo.desligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.bemvindo.ja_desligado , id)
                    }
                } else {
                    client.reply(from, erroComandoMsg(command), id)
                }
                break


            case '!alink':
                    if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                    if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                    if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                    if (args.length === 1) return client.reply(from,erroComandoMsg(command), id)
                    const al_status = await db.obterGrupo(groupId)

                    if (args[1].toLowerCase() === 'on') {
                        if(!al_status.antilink.status){
                            let filtros = body.slice(10).toLowerCase().split(" ")
                            await db.alterarAntiLink(groupId,true, filtros)
                            client.reply(from, msgs_texto.grupo.antilink.ligado, id)
                        } else {
                            client.reply(from, msgs_texto.grupo.antilink.ja_ligado , id)
                        } 
                    } else if (args[1].toLowerCase() === 'off') {
                        if(al_status.antilink.status){
                            await db.alterarAntiLink(groupId,false)
                            client.reply(from, msgs_texto.grupo.antilink.desligado, id)
                        } else {
                            client.reply(from, msgs_texto.grupo.antilink.ja_desligado , id)
                        }
                    } else {
                        client.reply(from, erroComandoMsg(command), id)
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
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                const af_status = await db.obterGrupo(groupId)

                if (args[1].toLowerCase() === 'on') {
                    if(!af_status.antifake.status){
                        let ddi_liberados = (body.slice(10).length == 0) ? ["55"] : body.slice(10).split(" ")
                        await db.alterarAntiFake(groupId,true,ddi_liberados)
                        client.reply(from,  msgs_texto.grupo.antifake.ligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.antifake.ja_ligado , id)
                    } 
                } else if (args[1].toLowerCase() === 'off') {
                    if(af_status.antifake.status){
                        await db.alterarAntiFake(groupId,false)
                        client.reply(from,  msgs_texto.grupo.antifake.desligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.antifake.ja_desligado , id)
                    }
                } else {
                    client.reply(from, erroComandoMsg(command) , id)
                }
                break

            case "!mutar":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                const mutar_status = await db.obterGrupo(groupId)
                if (args[1].toLowerCase() === 'on') {
                    if(!mutar_status.mutar){
                        await db.alterarMutar(groupId)
                        client.reply(from,  msgs_texto.grupo.mutar.ligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.mutar.ja_ligado , id)
                    } 
                } else if (args[1].toLowerCase() === 'off') {
                    if(mutar_status.mutar){
                        await db.alterarMutar(groupId,false)
                        client.reply(from,  msgs_texto.grupo.mutar.desligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.mutar.ja_desligado , id)
                    }
                } else {
                    client.reply(from, erroComandoMsg(command) , id)
                }
                break

            case '!contador':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (args.length === 1) return client.reply(from,erroComandoMsg(command), id)
                const cont_status = await db.obterGrupo(groupId)
                const membros_atuais = await client.getGroupMembers(groupId)
                if (args[1].toLowerCase() === 'on') {
                    if(!cont_status.contador.status){
                        await db.alterarContador(groupId)
                        await db.registrarContagemTodos(groupId,membros_atuais)
                        client.reply(from, msgs_texto.grupo.contador.ligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.contador.ja_ligado , id)
                    } 
                } else if (args[1].toLowerCase() === 'off') {
                    if(cont_status.contador.status){
                        await db.alterarContador(groupId,false)
                        await db.removerContagemGrupo(groupId)
                        client.reply(from,msgs_texto.grupo.contador.desligado, id)
                    } else {
                        client.reply(from, msgs_texto.grupo.contador.ja_desligado , id)
                    }
                } else {
                    client.reply(from,  erroComandoMsg(command) , id)
                }
                break

            case "!atividade":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                let atv_contador = await db.obterGrupo(groupId)
                if(!atv_contador.contador.status) return client.reply(from, msgs_texto.grupo.atividade.erro_contador , id)
                let atividade_usuario = null
                if(quotedMsg){
                    if(quotedMsgObj.author == botNumber+"@c.us") return client.reply(from, msgs_texto.grupo.atividade.bot_erro , id)
                    atividade_usuario = await db.obterAtividade(groupId,quotedMsgObj.author)
                    if(atividade_usuario == null) return client.reply(from, msgs_texto.grupo.atividade.fora_grupo , id)
                } else if (mentionedJidList.length === 1){
                    if(mentionedJidList[0] == botNumber+"@c.us") return client.reply(from, msgs_texto.grupo.atividade.bot_erro , id)
                    atividade_usuario = await db.obterAtividade(groupId,mentionedJidList[0])
                    if(atividade_usuario == null) return client.reply(from, msgs_texto.grupo.atividade.fora_grupo , id)
                } else {
                return client.reply(from, erroComandoMsg(command),id)
                }

                let atividade_resposta = preencherTexto(msgs_texto.grupo.atividade.resposta, atividade_usuario.msg, atividade_usuario.texto, atividade_usuario.imagem, atividade_usuario.video, atividade_usuario.sticker, atividade_usuario.gravacao, atividade_usuario.audio, atividade_usuario.outro)
                client.reply(from,atividade_resposta,id)
                break
            
            case "!alterarcont":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1)  return client.reply(from, erroComandoMsg(command), id)
                if(isNaN(args[1]) || args[1] < 0)  return client.reply(from, msgs_texto.grupo.alterarcont.num_invalido, id)
                let ac_contador = await db.obterGrupo(groupId)
                if(!ac_contador.contador.status) return client.reply(from, msgs_texto.grupo.alterarcont.erro_contador, id)
                if(quotedMsg){
                    let cont_usuario = await db.obterAtividade(groupId,quotedMsgObj.author)
                    if(cont_usuario == null) return client.reply(from, msgs_texto.grupo.alterarcont.fora_grupo,id) 
                    await db.alterarContagemUsuario(groupId, quotedMsgObj.author, args[1])
                    await client.reply(from, msgs_texto.grupo.alterarcont.sucesso, id)
                } else if (mentionedJidList.length == 1){
                    let cont_usuario = await db.obterAtividade(groupId,mentionedJidList[0])
                    if(cont_usuario == null) return client.reply(from, msgs_texto.grupo.alterarcont.fora_grupo,id) 
                    await db.alterarContagemUsuario(groupId, mentionedJidList[0],args[1])
                    await client.reply(from, msgs_texto.grupo.alterarcont.sucesso, id)
                } else {
                    await client.reply(from, erroComandoMsg(command), id)
                }
                break
            
            case "!imarcar":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                if(isNaN(args[1])) return client.reply(from, msgs_texto.grupo.minativos.erro_qtd , id)
                if(args[1] < 1 || args[1] > 50) return client.reply(from, msgs_texto.grupo.minativos.limite_qtd, id)
                let mi_contador = await db.obterGrupo(groupId)
                if(!mi_contador.contador.status) return client.reply(from, msgs_texto.grupo.minativos.erro_contador, id)
                let mi_usuarios = await db.obterUsuariosInativos(groupId,args[1])
                let qtd_inativos = mi_usuarios.length - 1
                if(qtd_inativos > 0){
                    let imarcar_resposta = preencherTexto(msgs_texto.grupo.minativos.resposta_titulo, args[1], qtd_inativos)
                    imarcar_resposta += `═════════════════\n`
                    for(let usuario of mi_usuarios){
                        if(usuario.id_usuario != botNumber+"@c.us") imarcar_resposta += preencherTexto(msgs_texto.grupo.minativos.resposta_itens, usuario.id_usuario.replace(/@c.us/g, ''), usuario.msg)
                    }
                    imarcar_resposta += '╚═〘 LBOT® 〙'
                    client.sendTextWithMentions(from,imarcar_resposta)
                } else {
                    client.reply(from,msgs_texto.grupo.minativos.sem_inativo,id)
                }
                break
                
            case "!ibanir":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command), id)
                if(isNaN(args[1])) return client.reply(from, msgs_texto.grupo.binativos.erro_qtd , id)
                if(args[1] < 1 || args[1] > 50) return client.reply(from, msgs_texto.grupo.binativos.limite_qtd , id)
                let bi_contador = await db.obterGrupo(groupId)
                if(!bi_contador.contador.status) return client.reply(from, msgs_texto.grupo.binativos.erro_contador , id)
                let bi_usuarios = await db.obterUsuariosInativos(groupId,args[1])
                if(bi_usuarios.length != 0){
                    for(let usuario of bi_usuarios){
                        if(usuario.id_usuario != botNumber+"@c.us") await client.removeParticipant(from,usuario.id_usuario)
                    }
                    client.reply(from,preencherTexto(msgs_texto.grupo.binativos.sucesso, bi_usuarios.length - 1, args[1]),id)
                } else {
                    client.reply(from,msgs_texto.grupo.binativos.sem_inativo,id)
                }
                break
            
            case "!topativos":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                if(isNaN(args[1])) return client.reply(from, msgs_texto.grupo.topativos.erro_qtd , id)
                if(args[1] < 1 || args[1] > 50) return client.reply(from, msgs_texto.grupo.topativos.limite_qtd , id)
                let ta_contador = await db.obterGrupo(groupId)
                if(!ta_contador.contador.status) return client.reply(from, msgs_texto.grupo.topativos.erro_contador , id)
                let top_ativos = await db.obterUsuariosAtivos(groupId,args[1])
                let topativos_resposta = preencherTexto(msgs_texto.grupo.topativos.resposta_titulo, args[1])
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
                    topativos_resposta += preencherTexto(msgs_texto.grupo.topativos.resposta_itens, medalha, i+1, top_ativos[i].id_usuario.replace(/@c.us/g, ''), top_ativos[i].msg)   
                }
                topativos_resposta += '╠\n╚═〘 LBOT® 〙'
                await client.sendTextWithMentions(from,topativos_resposta)
                break
            
            case "!enquete":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                let enq_grupo = await db.obterGrupo(groupId)
                if(args[1] != "off"){
                    if(enq_grupo.enquete.status) return client.reply(from, msgs_texto.grupo.enquete.ja_aberta , id)
                    let enquete_entrada = body.slice(9).split(",")
                    let pergunta = enquete_entrada.shift()
                    let opcoes = enquete_entrada
                    if(opcoes.length < 2) return client.reply(from, msgs_texto.grupo.enquete.min_opcao , id)
                    await db.alterarEnquete(groupId,true,pergunta,opcoes)
                    await client.reply(from, msgs_texto.grupo.enquete.aberta,id)
                } else {
                    if(!enq_grupo.enquete.status) return client.reply(from, msgs_texto.grupo.enquete.ja_fechada , id)
                    let pergunta = enq_grupo.enquete.pergunta
                    let opcoes = enq_grupo.enquete.opcoes
                    let enquete_resultado = preencherTexto(msgs_texto.grupo.enquete.resultado_titulo, pergunta)
                    for(let opcao of opcoes){
                        enquete_resultado += preencherTexto(msgs_texto.grupo.enquete.resultado_itens, opcao.digito, opcao.opcao.trim(), opcao.qtd_votos)
                    }
                    await db.alterarEnquete(groupId,false)
                    await client.sendText(from, msgs_texto.grupo.enquete.fechada).then(async ()=>{
                        await client.sendText(from,enquete_resultado)
                    })
                }
                break
            
            case '!votarenquete':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                let ve_grupo = await db.obterGrupo(groupId)
                if(!ve_grupo.enquete.status) return client.reply(from, msgs_texto.grupo.votarenquete.sem_enquete , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                if(isNaN(args[1])) return client.reply(from, msgs_texto.grupo.votarenquete.opcao_erro , id)
                if((ve_grupo.enquete.opcoes.find(opcao => opcao.votos.includes(sender.id))) != undefined)  return client.reply(from, msgs_texto.grupo.votarenquete.ja_votou , id)
                if((ve_grupo.enquete.opcoes.find(opcao => opcao.digito == args[1])) == undefined)  return client.reply(from, msgs_texto.grupo.votarenquete.opcao_invalida , id)
                await db.addVotoEnquete(groupId,sender.id,args[1]).then(async ()=>{
                    await client.reply(from,msgs_texto.grupo.votarenquete.sucesso,id)
                })
                break
            
            case '!verenquete':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                let ver_grupo = await db.obterGrupo(groupId)
                if(!ver_grupo.enquete.status) return client.reply(from, msgs_texto.grupo.verenquete.sem_enquete , id)
                let verenquete_resposta = preencherTexto(msgs_texto.grupo.verenquete.resposta_titulo, ver_grupo.enquete.pergunta)
                for(let opcao of ver_grupo.enquete.opcoes){
                    verenquete_resposta += preencherTexto(msgs_texto.grupo.verenquete.resposta_itens, opcao.digito, opcao.opcao.trim())
                }
                verenquete_resposta += msgs_texto.grupo.verenquete.resposta_inferior
                await client.reply(from,verenquete_resposta,id)
                break
            
            case '!aflood':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                const afl_status = await db.obterGrupo(groupId)
                let intervalo = 10
                let max_flood = 10
                let estado = args[1]

                //VALIDAÇÃO DO ARGUMENTO - INTERVALO
                if(args.length === 4){
                    if(!isNaN(args[3])){
                        if(args[3]>=10 && args[3]<=60){
                            intervalo = args[3]
                        } else {
                            return client.reply(from, msgs_texto.grupo.antiflood.intervalo,id)
                        }
                    }
                }

                //VALIDACAO DO ARGUMENTO - QUANTIDADE DE MSG
                if(args.length >= 3){
                    if(!isNaN(args[2])){
                        if(args[2]>= 5 && args[2] <= 20){
                            max_flood = args[2]
                        } else {
                            return client.reply(from, msgs_texto.grupo.antiflood.max,id)
                        }
                    }
                }
                
                if (estado.toLowerCase() === 'on') {
                    if(afl_status.antiflood) return client.reply(from, msgs_texto.grupo.antiflood.ja_ligado , id)
                    await db.alterarAntiFlood(groupId,true,max_flood,intervalo)
                    client.reply(from,  msgs_texto.grupo.antiflood.ligado, id)
                } else if (estado.toLowerCase() === 'off') {
                    if(!afl_status.antiflood) return client.reply(from, msgs_texto.grupo.antiflood.ja_desligado , id)
                    await db.alterarAntiFlood(groupId,false)
                    client.reply(from,  msgs_texto.grupo.antiflood.desligado, id)
                } else {
                    client.reply(from, erroComandoMsg(command) , id)
                }
                break
            
            case "!votacao":
                const vb_status = await db.obterGrupo(groupId)
                if(!vb_status.voteban.status) {
                    client.reply(from, msgs_texto.grupo.voteban.sem_votacao, id)
                } else {
                    client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.voteban.votacao_resposta, vb_status.voteban.usuario))
                }
                break
            
            case '!votar':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                const votar_status = await db.obterGrupo(groupId)
                if(!votar_status.voteban.status) return client.reply(from, msgs_texto.grupo.voteban.sem_votacao , id)
                if(votar_status.voteban.votou.indexOf(sender.id) != -1) return client.reply(from, msgs_texto.grupo.voteban.ja_votou ,id)
                let voteban  = await db.addVoto(groupId,sender.id)
                await client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.voteban.voto_sucesso, sender.id, votar_status.voteban.usuario.replace("@c.us",""), eval(votar_status.voteban.votos + 1), votar_status.voteban.max))
                if(voteban){
                    if (isBotGroupAdmins) {
                        await client.removeParticipant(from, votar_status.voteban.usuario)
                        .then(()=>{
                            client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.voteban.ban_resposta, votar_status.voteban.usuario))
                        }).catch(()=>{
                            client.sendText(from, msgs_texto.grupo.voteban.erro_ban)
                        })
                    } else {
                        client.reply(from, msgs_texto.grupo.voteban.erro_botadmin , id)
                    }
                    await db.alterarVoteban(groupId,false)
                }

                break

            case "!vb":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                const vtb_status = await db.obterGrupo(groupId)
                if(args[1] == "on"){
                    if(vtb_status.voteban.status) return client.reply(from, msgs_texto.grupo.voteban.ja_aberto ,id)
                    if(mentionedJidList.length != 1) return client.reply(from, msgs_texto.grupo.voteban.erro_mencao ,id)
                    if(mentionedJidList[0] == botNumber+"@c.us" || mentionedJidList[0] == chat.groupMetadata.owner) return client.reply(from, msgs_texto.grupo.voteban.erro_dono ,id)
                    if(isNaN(args[3])) return client.reply(from, msgs_texto.grupo.voteban.erro_num_votos ,id)
                    if(args[3] < 3 || args[3]> 30) return client.reply(from, msgs_texto.grupo.voteban.limit_num_votos ,id)
                    await db.alterarVoteban(groupId,true,args[3],mentionedJidList[0])
                    client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.voteban.votacao_aberta_resposta, mentionedJidList[0], args[3]))
                } else if(args[1] == "off"){
                    if (!vtb_status.voteban.status) return client.reply(from,msgs_texto.grupo.voteban.sem_votacao,id)
                    client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.voteban.votacao_encerrada_resposta, vtb_status.voteban.usuario))
                    await db.alterarVoteban(groupId,false)
                } else {
                    client.reply(from,erroComandoMsg(command),id)
                }
                break

            case "!bcmd":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                let b_cmd_inseridos = body.slice(6).split(" "), b_cmd_verificados = [], b_cmd_grupo = await db.obterGrupo(groupId), bcmd_resposta = msgs_texto.grupo.bcmd.resposta_titulo
                const lista_comandos = JSON.parse(fs.readFileSync('./comandos/comandos.json'))
                for(let b_cmd of b_cmd_inseridos){
                    if(lista_comandos.utilidades.includes(b_cmd) || lista_comandos.diversao.includes(b_cmd)){
                        if(b_cmd_grupo.block_cmds.includes(b_cmd)){
                            bcmd_resposta += preencherTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, b_cmd)
                        } else {
                            b_cmd_verificados.push(b_cmd)
                            bcmd_resposta += preencherTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, b_cmd)
                        }
                    } else if (lista_comandos.admin_grupo.includes(b_cmd) || lista_comandos.dono_bot.includes(b_cmd) ){
                        bcmd_resposta += preencherTexto(msgs_texto.grupo.bcmd.resposta_variavel.comando_admin, b_cmd)
                    } else {
                        bcmd_resposta += preencherTexto(msgs_texto.grupo.bcmd.resposta_variavel.nao_existe, b_cmd)
                    }
                }
                if(b_cmd_verificados.length != 0) await db.addBlockedCmd(groupId, b_cmd_verificados)
                client.reply(from, bcmd_resposta, id)
                break
            
            case "!dcmd":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
                let d_cmd_inseridos = body.slice(6).split(" "), d_cmd_verificados = [], d_cmd_grupo = await db.obterGrupo(groupId), dcmd_resposta = msgs_texto.grupo.dcmd.resposta_titulo
                for(let d_cmd of d_cmd_inseridos){
                    if(d_cmd_grupo.block_cmds.includes(d_cmd)) {
                        d_cmd_verificados.push(d_cmd)
                        dcmd_resposta += preencherTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, d_cmd)
                    } else {
                        dcmd_resposta += preencherTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, d_cmd)
                    }
                }
                if(d_cmd_verificados.length != 0) await db.removeBlockedCmd(groupId, d_cmd_verificados)
                client.reply(from, dcmd_resposta, id)
                break

            case '!link':
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (isGroupMsg) {
                    const inviteLink = await client.getGroupInviteLink(groupId);
                    client.sendLinkWithAutoPreview(from, inviteLink, preencherTexto(msgs_texto.grupo.link.resposta, name))
                } else {
                    client.reply(from, msgs_texto.permissao.grupo , id)
                }
                break

            case '!adms':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                let adms_resposta = msgs_texto.grupo.adms.resposta_titulo
                for (let adm of groupAdmins) {
                    adms_resposta += preencherTexto(msgs_texto.grupo.adms.resposta_itens, adm.replace(/@c.us/g, ''))
                }
                await client.sendTextWithMentions(from, adms_resposta)
                break

            case "!dono":
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                const Owner_ = chat.groupMetadata.owner
                await client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.dono.resposta, Owner_))
                break

            case '!mt':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                const groupMem = await client.getGroupMembers(groupId)
                let mt_resposta = (args.length > 1) ? preencherTexto(msgs_texto.grupo.mt.resposta_titulo_variavel, body.slice(4)) : msgs_texto.grupo.mt.resposta_titulo_comum
                for (let i = 0; i < groupMem.length; i++) {
                    mt_resposta += preencherTexto(msgs_texto.grupo.mt.resposta_itens, groupMem[i].id.replace(/@c.us/g, ''))
                }
                mt_resposta += '╚═〘 LBOT®〙'
                await client.sendTextWithMentions(from, mt_resposta)
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
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                
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
                    if(!quotedMsg) return client.reply(from, erroComandoMsg(command), id)
                    if (groupAdmins.includes(quotedMsgObj.author)) return client.reply(from, msgs_texto.grupo.banir.banir_admin, id)
                    await client.removeParticipant(groupId, quotedMsgObj.author).then(async()=>{
                        await client.sendText(from, msgs_texto.grupo.banir.banir_sucesso)
                    }).catch(async ()=>{
                        await client.reply(from, msgs_texto.grupo.banir.banir_erro,id)
                    })        
                } else {
                    for (let i = 0; i < mentionedJidList.length; i++) {
                        if (groupAdmins.includes(mentionedJidList[i])) return client.reply(from, msgs_texto.grupo.banir.banir_admin, id)
                        await client.removeParticipant(groupId, mentionedJidList[i]).then(async()=>{
                            if(mentionedJidList.length === 1) await client.sendText(from, msgs_texto.grupo.banir.banir_sucesso)
                        }).catch(async ()=>{
                            await client.reply(from,  msgs_texto.grupo.banir.banir_erro, id)
                        })
                    }
                }        
                break

            case '!promover':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo , id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                if (mentionedJidList.length === 0) return client.reply(from, erroComandoMsg(command), id)
                if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto.grupo.promover.limite_membro, id)
                if (groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto.grupo.promover.admin, id)
                await client.promoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.promover.sucesso, mentionedJidList[0]))
                break

            case '!rebaixar':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                if (mentionedJidList.length === 0) return client.reply(from, erroComandoMsg(command), id)
                if (mentionedJidList.length >= 2) return client.reply(from, msgs_texto.grupo.rebaixar.limite_membro, id)
                if (!groupAdmins.includes(mentionedJidList[0])) return client.reply(from, msgs_texto.grupo.rebaixar.admin, id)
                await client.demoteParticipant(groupId, mentionedJidList[0])
                await client.sendTextWithMentions(from, preencherTexto(msgs_texto.grupo.rebaixar.sucesso, mentionedJidList[0]))
                break

            case '!apg':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!quotedMsg) return client.reply(from, erroComandoMsg(command), id)
                if (!quotedMsgObj.fromMe) return client.reply(from, msgs_texto.grupo.apagar.minha_msg, id)
                client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false).catch(()=>{
                    client.reply(from, msgs_texto.grupo.apagar.nao_recente , id)
                })
                break

            case '!f':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if(args.length === 1) return client.reply(from,erroComandoMsg(command), id)
                client.setGroupToAdminsOnly(groupId,(args[1] == "on") ? true : false)
                break
            
        }
    } catch(err){
        throw new Error(err)
    }
    
}