//REQUERINDO MODULOS
const {AddParticipantErrorStatusCode} = require("@open-wa/wa-automate")
const msgs_texto = require('../lib/msgs')
const {criarTexto, erroComandoMsg, removerNegritoComando} = require('../lib/util')
const {bloquearComandosGrupo, desbloquearComandosGrupo} = require('../lib/bloqueioComandos')
const db = require('../lib/database')
const {obterDestravas} = require("../lib/api")

module.exports = grupo = async(client,message) => {
    try{
        const { id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj, mentionedJidList, body} = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)

        switch(command){
            case '!regras':
                var grupoInfo = await client.getGroupInfo(groupId), grupoFoto = await client.getProfilePicFromServer(groupId), grupoDescricao = grupoInfo.description || msgs_texto.grupo.regras.sem_descrição
                if(grupoFoto){
                    client.sendFile(from, grupoFoto, "foto-grupo.jpg", grupoDescricao)
                } else {
                    client.sendText(from, grupoDescricao)
                }
                break
            
            case '!status':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var grupoInfo = await db.obterGrupo(groupId)
                var resposta = msgs_texto.grupo.status.resposta_titulo
                //Bem-vindo
                resposta += (grupoInfo.bemvindo.status) ? msgs_texto.grupo.status.resposta_variavel.bemvindo.on : msgs_texto.grupo.status.resposta_variavel.bemvindo.off
                //Mutar
                resposta += (grupoInfo.mutar) ? msgs_texto.grupo.status.resposta_variavel.mutar.on : msgs_texto.grupo.status.resposta_variavel.mutar.off
                //Anti-Link
                let al_filtros = ""
                if(grupoInfo.antilink.filtros.youtube) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.youtube
                if(grupoInfo.antilink.filtros.whatsapp) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.whatsapp
                if(grupoInfo.antilink.filtros.facebook) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.facebook
                if(grupoInfo.antilink.filtros.twitter) al_filtros += msgs_texto.grupo.status.resposta_variavel.antilink.filtros.twitter
                resposta += (grupoInfo.antilink.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antilink.on, al_filtros) : msgs_texto.grupo.status.resposta_variavel.antilink.off
                //Anti-fake
                resposta += (grupoInfo.antifake.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antifake.on, grupoInfo.antifake.ddi_liberados.toString()) : msgs_texto.grupo.status.resposta_variavel.antifake.off
                //Anti-flood
                let infoAntiFlood = db.grupoInfoAntiFlood(groupId)
                resposta += (grupoInfo.antiflood) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.antiflood.on, infoAntiFlood.max, infoAntiFlood.intervalo) : msgs_texto.grupo.status.resposta_variavel.antiflood.off 
                //Contador
                resposta += (grupoInfo.contador.status) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.contador.on, grupoInfo.contador.inicio) : msgs_texto.grupo.status.resposta_variavel.contador.off
                //Bloqueio de CMDS
                resposta += (grupoInfo.block_cmds.length != 0) ? criarTexto(msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.on, grupoInfo.block_cmds.toString()) : msgs_texto.grupo.status.resposta_variavel.bloqueiocmds.off
                //Lista Negra
                resposta += criarTexto(msgs_texto.grupo.status.resposta_variavel.listanegra, grupoInfo.lista_negra.length)
                client.sendText(from, resposta)
                break

            case "!destravar":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var destravas = await obterDestravas()
                for(var destrava of destravas) await client.sendText(from, destrava)
                break

            case '!bv':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.bemvindo.status
                if (estadoNovo) {
                    var usuarioMensagem = args.slice(1).join(" ")
                    await db.alterarBemVindo(groupId, true, usuarioMensagem)
                    client.reply(from, msgs_texto.grupo.bemvindo.ligado, id)
                } else {
                    await db.alterarBemVindo(groupId, false)
                    client.reply(from, msgs_texto.grupo.bemvindo.desligado, id)
                }
                break

            case "!blista":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command), id)
                let blista_numero = body.slice(8).trim().replace(/\W+/g,"")
                if(blista_numero.length == 0) return client.reply(from, msgs_texto.grupo.blista.numero_vazio , id)
                let blista_grupo_lista = await db.obterListaNegra(groupId), blista_id_usuario = blista_numero+"@c.us"
                if(blista_grupo_lista.includes(blista_id_usuario)) return client.reply(from, msgs_texto.grupo.blista.ja_listado, id)
                await db.adicionarListaNegra(groupId,blista_id_usuario)
                client.reply(from, msgs_texto.grupo.blista.sucesso, id)
                break
            
            case "!dlista":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command), id)
                let dlista_numero = body.slice(8).trim().replace(/\W+/g,"")
                if(dlista_numero.length == 0) return client.reply(from, msgs_texto.grupo.dlista.numero_vazio, id)
                let dlista_grupo_lista = await db.obterListaNegra(groupId), dlista_id_usuario = dlista_numero+"@c.us"
                if(!dlista_grupo_lista.includes(dlista_id_usuario)) return client.reply(from, msgs_texto.grupo.dlista.nao_listado, id)
                await db.removerListaNegra(groupId,dlista_id_usuario)
                client.reply(from, msgs_texto.grupo.dlista.sucesso, id)
                break
            
            case "!listanegra":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                let lista_negra_grupo = await db.obterListaNegra(groupId), resposta_listanegra = msgs_texto.grupo.listanegra.resposta_titulo
                if(lista_negra_grupo.length == 0) return client.reply(from, msgs_texto.grupo.listanegra.lista_vazia, id)
                for(let usuario_lista of lista_negra_grupo){
                    resposta_listanegra += criarTexto(msgs_texto.grupo.listanegra.resposta_itens, usuario_lista.replace(/@c.us/g, ''))
                }
                resposta_listanegra += '╚═〘 LBOT®〙'
                await client.sendTextWithMentions(from, resposta_listanegra)
                break

            case '!alink':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.antilink.status
                if (estadoNovo) {
                    var filtros = body.slice(7).trim().toLowerCase().split(" ")
                    await db.alterarAntiLink(groupId, true, filtros)
                    client.reply(from, msgs_texto.grupo.antilink.ligado, id)
                } else {
                    await db.alterarAntiLink(groupId, false)
                    client.reply(from, msgs_texto.grupo.antilink.desligado, id)
                }
                break
                    
            case '!rlink':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                client.revokeGroupInviteLink(groupId).then(()=>{client.reply(from, msgs_texto.grupo.rlink.sucesso ,id)}).catch(()=>{client.reply(from, msgs_texto.grupo.rlink.erro ,id)})
                break        

            case '!afake':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.antifake.status
                if (estadoNovo) {
                    var DDIAutorizados = (body.slice(7).length == 0) ? ["55"] : body.slice(7).split(" ")
                    await db.alterarAntiFake(groupId, true, DDIAutorizados)
                    client.reply(from,  msgs_texto.grupo.antifake.ligado, id)
                } else {
                    await db.alterarAntiFake(groupId, false)
                    client.reply(from,  msgs_texto.grupo.antifake.desligado, id)
                } 
                break

            case "!mutar":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.mutar
                if (estadoNovo) {
                    await db.alterarMutar(groupId)
                    client.reply(from,  msgs_texto.grupo.mutar.ligado, id)
                } else {
                    await db.alterarMutar(groupId,false)
                    client.reply(from,  msgs_texto.grupo.mutar.desligado, id)

                }
                break

            case '!contador':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.contador.status
                var membrosAtuais = await client.getGroupMembers(groupId)
                if (estadoNovo) {
                    await db.alterarContador(groupId)
                    await db.registrarContagemTodos(groupId, membrosAtuais)
                    client.reply(from, msgs_texto.grupo.contador.ligado, id)
                } else {
                    await db.alterarContador(groupId, false)
                    await db.removerContagemGrupo(groupId)
                    client.reply(from,msgs_texto.grupo.contador.desligado, id)
                } 
                break

            case "!atividade":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.contador.status) return client.reply(from, msgs_texto.grupo.atividade.erro_contador, id)
                var atividadeUsuario = null
                if(quotedMsg){
                    if(quotedMsgObj.author == botNumber+"@c.us") return client.reply(from, msgs_texto.grupo.atividade.bot_erro, id)
                    atividadeUsuario = await db.obterAtividade(groupId, quotedMsgObj.author)
                    if(atividadeUsuario == null) return client.reply(from, msgs_texto.grupo.atividade.fora_grupo, id)
                } else if (mentionedJidList.length === 1){
                    if(mentionedJidList[0] == botNumber+"@c.us") return client.reply(from, msgs_texto.grupo.atividade.bot_erro, id)
                    atividadeUsuario = await db.obterAtividade(groupId, mentionedJidList[0])
                    if(atividadeUsuario == null) return client.reply(from, msgs_texto.grupo.atividade.fora_grupo, id)
                } else {
                    return client.reply(from, erroComandoMsg(command),id)
                }
                var atividadeResposta = criarTexto(msgs_texto.grupo.atividade.resposta, atividadeUsuario.msg, atividadeUsuario.texto, atividadeUsuario.imagem, atividadeUsuario.video, atividadeUsuario.sticker, atividadeUsuario.gravacao, atividadeUsuario.audio, atividadeUsuario.outro)
                client.reply(from, atividadeResposta, id)
                break
            
            case "!alterarcont":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1)  return client.reply(from, erroComandoMsg(command), id)
                var usuarioNumeroMsg = args[1]
                if(isNaN(usuarioNumeroMsg) || usuarioNumeroMsg < 0)  return client.reply(from, msgs_texto.grupo.alterarcont.num_invalido, id)
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.contador.status) return client.reply(from, msgs_texto.grupo.alterarcont.erro_contador, id)
                if(!quotedMsg && mentionedJidList.length != 1) return client.reply(from, erroComandoMsg(command), id)
                var usuarioSelecionado = quotedMsg ? quotedMsgObj.author : mentionedJidList[0]
                var contagemUsuario = await db.obterAtividade(groupId, usuarioSelecionado)
                if(!contagemUsuario) return client.reply(from, msgs_texto.grupo.alterarcont.fora_grupo,id) 
                await db.alterarContagemUsuario(groupId, usuarioSelecionado, usuarioNumeroMsg)
                await client.reply(from, msgs_texto.grupo.alterarcont.sucesso, id)
                break

            case "!imarcar":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                var qtdMensagem = args[1]
                if(isNaN(qtdMensagem)) return client.reply(from, msgs_texto.grupo.minativos.erro_qtd , id)
                if(qtdMensagem < 1 || qtdMensagem > 50) return client.reply(from, msgs_texto.grupo.minativos.limite_qtd, id)
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.contador.status) return client.reply(from, msgs_texto.grupo.minativos.erro_contador, id)
                var usuariosInativos = await db.obterUsuariosInativos(groupId, qtdMensagem)
                let qtdInativos = usuariosInativos.length - 1
                if(qtdInativos > 0){
                    let inativosResposta = criarTexto(msgs_texto.grupo.minativos.resposta_titulo, qtdMensagem, qtdInativos)
                    inativosResposta += `═════════════════\n`
                    for(let usuario of usuariosInativos){
                        if(usuario.id_usuario != botNumber+"@c.us") inativosResposta += criarTexto(msgs_texto.grupo.minativos.resposta_itens, usuario.id_usuario.replace(/@c.us/g, ''), usuario.msg)
                    }
                    inativosResposta += '╚═〘 LBOT® 〙'
                    client.sendTextWithMentions(from, inativosResposta)
                } else {
                    client.reply(from,msgs_texto.grupo.minativos.sem_inativo,id)
                }
                break
                
            case "!ibanir":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command), id)
                var qtdMensagem = args[1]
                if(isNaN(qtdMensagem)) return client.reply(from, msgs_texto.grupo.binativos.erro_qtd , id)
                if(qtdMensagem < 1 || qtdMensagem > 50) return client.reply(from, msgs_texto.grupo.binativos.limite_qtd , id)
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.contador.status) return client.reply(from, msgs_texto.grupo.binativos.erro_contador , id)
                var usuariosInativos = await db.obterUsuariosInativos(groupId, qtdMensagem)
                if(usuariosInativos.length != 0){
                    for(let usuario of usuariosInativos){
                        if(usuario.id_usuario != botNumber+"@c.us") await client.removeParticipant(from,usuario.id_usuario)
                    }
                    client.reply(from,criarTexto(msgs_texto.grupo.binativos.sucesso, usuariosInativos.length - 1, qtdMensagem), id)
                } else {
                    client.reply(from,msgs_texto.grupo.binativos.sem_inativo,id)
                }
                break

            case "!topativos":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                var qtdUsuarios = args[1]
                if(isNaN(qtdUsuarios)) return client.reply(from, msgs_texto.grupo.topativos.erro_qtd , id)
                if(qtdUsuarios < 1 || qtdUsuarios > 50) return client.reply(from, msgs_texto.grupo.topativos.limite_qtd , id)
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.contador.status) return client.reply(from, msgs_texto.grupo.topativos.erro_contador , id)
                var usuariosAtivos = await db.obterUsuariosAtivos(groupId, qtdUsuarios)
                var respostaTop = criarTexto(msgs_texto.grupo.topativos.resposta_titulo, qtdUsuarios)
                for (let i = 0 ; i < usuariosAtivos.length ; i++){
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
                    respostaTop += criarTexto(msgs_texto.grupo.topativos.resposta_itens, medalha, i+1, usuariosAtivos[i].id_usuario.replace(/@c.us/g, ''), usuariosAtivos[i].msg)   
                }
                respostaTop += '╠\n╚═〘 LBOT® 〙'
                await client.sendTextWithMentions(from, respostaTop)
                break
            
            case "!enquete":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.enquete.status
                if(estadoNovo){
                    if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                    var enquetePergunta = body.slice(9).split(",")[0], enqueteOpcoes = body.slice(9).split(",").slice(1)
                    if(enqueteOpcoes.length < 2) return client.reply(from, msgs_texto.grupo.enquete.min_opcao , id)
                    await db.alterarEnquete(groupId, true, enquetePergunta, enqueteOpcoes)
                    await client.reply(from, msgs_texto.grupo.enquete.aberta,id)
                } else {
                    var enquetePergunta = grupoInfo.enquete.pergunta, enqueteOpcoes = grupoInfo.enquete.opcoes
                    let enqueteResultado = criarTexto(msgs_texto.grupo.enquete.resultado_titulo, enquetePergunta)
                    for(let opcao of enqueteOpcoes){
                        enqueteResultado += criarTexto(msgs_texto.grupo.enquete.resultado_itens, opcao.digito, opcao.opcao.trim(), opcao.qtd_votos)
                    }
                    await db.alterarEnquete(groupId, false)
                    await client.sendText(from, msgs_texto.grupo.enquete.fechada).then(async ()=>{
                        await client.sendText(from, enqueteResultado)
                    })
                }
                break
            
            case '!votarenquete':
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.enquete.status) return client.reply(from, msgs_texto.grupo.votarenquete.sem_enquete , id)
                if(args.length == 1) return client.reply(from, erroComandoMsg(command) , id)
                var usuarioOpcao = args[1]
                if(isNaN(usuarioOpcao)) return client.reply(from, msgs_texto.grupo.votarenquete.opcao_erro , id)
                if((grupoInfo.enquete.opcoes.find(opcao => opcao.votos.includes(sender.id))) != undefined)  return client.reply(from, msgs_texto.grupo.votarenquete.ja_votou , id)
                if((grupoInfo.enquete.opcoes.find(opcao => opcao.digito == usuarioOpcao)) == undefined)  return client.reply(from, msgs_texto.grupo.votarenquete.opcao_invalida , id)
                await db.addVotoEnquete(groupId, sender.id, usuarioOpcao).then(async ()=>{
                    await client.reply(from,msgs_texto.grupo.votarenquete.sucesso,id)
                })
                break
            
            case '!verenquete':
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.enquete.status) return client.reply(from, msgs_texto.grupo.verenquete.sem_enquete , id)
                var enqueteResposta = criarTexto(msgs_texto.grupo.verenquete.resposta_titulo, grupoInfo.enquete.pergunta)
                for(let opcao of grupoInfo.enquete.opcoes){
                    enqueteResposta += criarTexto(msgs_texto.grupo.verenquete.resposta_itens, opcao.digito, opcao.opcao.trim())
                }
                enqueteResposta += msgs_texto.grupo.verenquete.resposta_inferior
                await client.reply(from, enqueteResposta, id)
                break
            
            case '!aflood':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                var grupoInfo = await db.obterGrupo(groupId)
                var intervalo = 10, maxMensagem = 10, estadoNovo = !grupoInfo.antiflood
                //VALIDAÇÃO DO ARGUMENTO - INTERVALO
                if(args.length === 3){
                    var intervaloInserido = args[2]
                    if(!isNaN(intervalo) && intervalo>=10 && intervalo<=60){
                        intervalo = intervaloInserido
                    } else {
                        return client.reply(from, msgs_texto.grupo.antiflood.intervalo,id)
                    }
                }
                //VALIDACAO DO ARGUMENTO - MÁX MENSAGEM
                if(args.length >= 2){
                    var maxMensagemInserido = args[1]
                    if(!isNaN(maxMensagemInserido) && maxMensagemInserido>= 5 && maxMensagemInserido <= 20){
                        maxMensagem = maxMensagemInserido
                    } else {
                        return client.reply(from, msgs_texto.grupo.antiflood.max,id)
                    }
                }
                if(estadoNovo) {
                    await db.alterarAntiFlood(groupId, true, maxMensagem, intervalo)
                    client.reply(from, criarTexto(msgs_texto.grupo.antiflood.ligado, maxMensagem, intervalo), id)
                } else {
                    await db.alterarAntiFlood(groupId, false)
                    client.reply(from,  msgs_texto.grupo.antiflood.desligado, id)
                }
                break
            
            case "!votacao":
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.voteban.status) {
                    client.reply(from, msgs_texto.grupo.voteban.sem_votacao, id)
                } else {
                    client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.voteban.votacao_resposta, grupoInfo.voteban.usuario))
                }
                break
            
            case '!votar':
                var grupoInfo = await db.obterGrupo(groupId)
                if(!grupoInfo.voteban.status) return client.reply(from, msgs_texto.grupo.voteban.sem_votacao , id)
                if(grupoInfo.voteban.votou.indexOf(sender.id) != -1) return client.reply(from, msgs_texto.grupo.voteban.ja_votou ,id)
                var voteban  = await db.addVoto(groupId,sender.id)
                await client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.voteban.voto_sucesso, sender.id, grupoInfo.voteban.usuario.replace("@c.us",""), eval(grupoInfo.voteban.votos + 1), grupoInfo.voteban.max))
                if(voteban){
                    if (isBotGroupAdmins) {
                        await client.removeParticipant(from, grupoInfo.voteban.usuario)
                        .then(()=>{
                            client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.voteban.ban_resposta, grupoInfo.voteban.usuario))
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
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var grupoInfo = await db.obterGrupo(groupId)
                var estadoNovo = !grupoInfo.voteban.status, maxVotos = args[2]
                if(estadoNovo){
                    if(args.length != 3) return client.reply(from, erroComandoMsg(command), id)
                    if(mentionedJidList.length != 1) return client.reply(from, msgs_texto.grupo.voteban.erro_mencao ,id)
                    if(mentionedJidList[0] == botNumber+"@c.us" || mentionedJidList[0] == chat.groupMetadata.owner) return client.reply(from, msgs_texto.grupo.voteban.erro_dono ,id)
                    if(isNaN(maxVotos)) return client.reply(from, msgs_texto.grupo.voteban.erro_num_votos ,id)
                    if(maxVotos < 3 || maxVotos > 30) return client.reply(from, msgs_texto.grupo.voteban.limit_num_votos ,id)
                    await db.alterarVoteban(groupId, true, maxVotos, mentionedJidList[0])
                    client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.voteban.votacao_aberta_resposta, mentionedJidList[0], maxVotos))
                } else {
                    client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.voteban.votacao_encerrada_resposta, grupoInfo.voteban.usuario))
                    await db.alterarVoteban(groupId,false)
                }
                break

            case "!bcmd":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command) ,id)
                var usuarioComandos = body.slice(6).split(" "), respostaBloqueio = await bloquearComandosGrupo(usuarioComandos, groupId)
                await client.reply(from, respostaBloqueio, id)
                break
            
            case "!dcmd":
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command),id)
                var usuarioComandos = body.slice(6).split(" "), respostaDesbloqueio = await desbloquearComandosGrupo(usuarioComandos, groupId)
                await client.reply(from, respostaDesbloqueio, id)
                break

            case '!link':
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                var linkConvite = await client.getGroupInviteLink(groupId)
                var {title} = await client.getGroupInfo(groupId);
                await client.sendLinkWithAutoPreview(from, linkConvite, criarTexto(msgs_texto.grupo.link.resposta, title))
                break

            case '!adms':
                var admsResposta = msgs_texto.grupo.adms.resposta_titulo
                for (let adm of groupAdmins) {
                    admsResposta += criarTexto(msgs_texto.grupo.adms.resposta_itens, adm.replace(/@c.us/g, ''))
                }
                await client.sendTextWithMentions(from, admsResposta)
                break

            case "!dono":
                const Owner_ = chat.groupMetadata.owner
                await client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.dono.resposta, Owner_))
                break

            case '!mt':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                var membrosGrupo = await client.getGroupMembers(groupId)
                var usuarioTexto = body.slice(4).trim()
                var respostaMarcar = (args.length > 1) ? criarTexto(msgs_texto.grupo.mt.resposta_titulo_variavel, usuarioTexto) : msgs_texto.grupo.mt.resposta_titulo_comum
                for(let membro of membrosGrupo){
                    respostaMarcar += criarTexto(msgs_texto.grupo.mt.resposta_itens, membro.id.split("@")[0])
                }
                respostaMarcar += '╚═〘 LBOT®〙'
                await client.sendTextWithMentions(from, respostaMarcar)
                break
                
            case '!mm':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                var membrosGrupo = await client.getGroupMembers(groupId), membrosMarcados = []
                var usuarioTexto = body.slice(4).trim()
                var respostaMarcar = (args.length > 1) ? criarTexto(msgs_texto.grupo.mm.resposta_titulo_variavel, usuarioTexto) : msgs_texto.grupo.mm.resposta_titulo_comum
                for(let membro of membrosGrupo){
                    if(!groupAdmins.includes(membro.id)) {
                        respostaMarcar += criarTexto(msgs_texto.grupo.mm.resposta_itens, membro.id.split("@")[0])
                        membrosMarcados.push(membro)
                    }
                }
                respostaMarcar += '╚═〘 LBOT®〙'
                if(membrosMarcados.length == 0) return client.reply(from, msgs_texto.grupo.mm.sem_membros, id)
                await client.sendTextWithMentions(from, respostaMarcar)
                break  

            case '!bantodos':
                var donoGrupo = sender.id === chat.groupMetadata.owner
                if (!donoGrupo) return client.reply(from, msgs_texto.permissao.apenas_dono_grupo, id)           
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                var membrosGrupo = await client.getGroupMembers(groupId)
                for(let membro of membrosGrupo){
                    if (!groupAdmins.includes(membro.id)) await client.removeParticipant(groupId, membro.id)
                }
                client.reply(from, msgs_texto.grupo.banirtodos.banir_sucesso, id)
                break  
            
            case '!add':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                if (args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                var usuarioNumeros = body.slice(5).split(",")
                for(let numero of usuarioNumeros){
                    var numeroCompleto = numero.trim().replace(/\W+/g,"")+"@c.us"
                    client.addParticipant(from, numeroCompleto).catch((err)=>{
                        var numeroFormatado  = numeroCompleto.replace("@c.us", ""), mensagemErro = msgs_texto.grupo.add.add_erro
                        if(err.data){
                            switch(err.data[numeroCompleto]){
                                case AddParticipantErrorStatusCode.ALREADY_IN_GROUP:
                                    mensagemErro = msgs_texto.grupo.add.membro_grupo
                                    break
                                case AddParticipantErrorStatusCode.RECENTLY_LEFT:
                                    mensagemErro = msgs_texto.grupo.add.saiu_recente
                                    break
                                case AddParticipantErrorStatusCode.PRIVACY_SETTINGS:
                                    mensagemErro = msgs_texto.grupo.add.com_privacidade
                                    break
                                case AddParticipantErrorStatusCode.GROUP_FULL:
                                    mensagemErro = msgs_texto.grupo.add.grupo_cheio
                                    break
                            }
                        } else {
                            mensagemErro = msgs_texto.grupo.add.nao_contato
                        }
                        client.reply(from, criarTexto(mensagemErro, numeroFormatado), id)
                    })
                }
                break

            case '!ban':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                var usuariosSelecionados = []
                if(mentionedJidList.length === 0 && quotedMsg) usuariosSelecionados.push(quotedMsgObj.author)
                else if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                else return client.reply(from, erroComandoMsg(command), id)
                var idParticipantesAtuais = await client.getGroupMembersId(groupId)
                for(let usuario of usuariosSelecionados){
                    if(idParticipantesAtuais.includes(usuario)){
                        if(!groupAdmins.includes(usuario)){
                            client.removeParticipant(groupId, usuario).then(()=>{
                                if(usuariosSelecionados.length === 1) client.reply(from, msgs_texto.grupo.banir.banir_sucesso, id)
                            })
                        } else {
                            if(usuariosSelecionados.length === 1) client.reply(from, msgs_texto.grupo.banir.banir_admin, id)
                        }
                    } else {
                        if(usuariosSelecionados.length === 1) client.reply(from,  msgs_texto.grupo.banir.banir_erro, id)
                    }
                }     
                break

            case '!promover':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                var usuariosSelecionados = [], respostaUsuarios = ''
                if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                else if(quotedMsg) usuariosSelecionados.push(quotedMsgObj.author)
                else return client.reply(from, erroComandoMsg(command), id)
                if(usuariosSelecionados.includes(botNumber+"@c.us")) usuariosSelecionados.splice(usuariosSelecionados.indexOf(botNumber+"@c.us"),1)
                for(let usuario of usuariosSelecionados){
                    if(!groupAdmins.includes(usuario)) {
                        await client.promoteParticipant(groupId, usuario)
                        respostaUsuarios += criarTexto(msgs_texto.grupo.promover.sucesso_usuario, usuario.replace("@c.us", ""))
                    } else {
                        respostaUsuarios += criarTexto(msgs_texto.grupo.promover.erro_usuario, usuario.replace("@c.us", ""))
                    }
                }
                if(!usuariosSelecionados.length) return client.reply(from, msgs_texto.grupo.promover.erro_bot, id)
                await client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.promover.resposta, respostaUsuarios))
                break

            case '!rebaixar':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                var usuariosSelecionados = [], respostaUsuarios = ''
                if(mentionedJidList.length > 0) usuariosSelecionados = mentionedJidList
                else if(quotedMsg) usuariosSelecionados.push(quotedMsgObj.author)
                else return client.reply(from, erroComandoMsg(command), id)
                if(usuariosSelecionados.includes(botNumber+"@c.us")) usuariosSelecionados.splice(usuariosSelecionados.indexOf(botNumber+"@c.us"),1)
                for(let usuario of usuariosSelecionados){
                    if(groupAdmins.includes(usuario)) {
                        await client.demoteParticipant(groupId, usuario)
                        respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.sucesso_usuario, usuario.replace("@c.us", ""))
                    } else {
                        respostaUsuarios += criarTexto(msgs_texto.grupo.rebaixar.erro_usuario, usuario.replace("@c.us", ""))
                    }
                }
                if(!usuariosSelecionados.length) return client.reply(from, msgs_texto.grupo.rebaixar.erro_bot, id)
                await client.sendTextWithMentions(from, criarTexto(msgs_texto.grupo.rebaixar.resposta, respostaUsuarios))
                break

            case '!apg':
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                if (!quotedMsg) return client.reply(from, erroComandoMsg(command), id)
                if (!quotedMsgObj.fromMe) return client.reply(from, msgs_texto.grupo.apagar.minha_msg, id)
                client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false).catch(()=>{
                    client.reply(from, msgs_texto.grupo.apagar.nao_recente , id)
                })
                break

            case '!f':
                if (!isBotGroupAdmins) return client.reply(from, msgs_texto.permissao.bot_admin, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin, id)
                var estadoNovo = !chat.groupMetadata.announce
                client.setGroupToAdminsOnly(groupId, estadoNovo)
                break 
        }
    } catch(err){
        throw err
    }
    
}