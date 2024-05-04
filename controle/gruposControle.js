import * as gruposdb from '../db_funcoes/grupos.js'
import {obterMensagensTexto} from '../lib/msgs.js'
import { listarComandos } from '../comandos/comandos.js'
import * as bot from './botControle.js'
import * as socket from '../baileys/socket-funcoes.js'
import {consoleErro, criarTexto} from '../lib/util.js'


// Obter dados do grupo

export const obterGrupoInfo = async(grupoId)=>{
    return await gruposdb.obterGrupo(grupoId)
}

export const verificarRegistroGrupo = async(grupoId)=>{
    let resposta = await gruposdb.verificarGrupo(grupoId)
    return resposta
}

export const obterAdminsGrupo = async(grupoId)=>{
    return await gruposdb.obterAdminsGrupo(grupoId)
}

export const obterDonoGrupo = async(grupoId)=>{ 
    let dono = await gruposdb.obterDonoGrupo(grupoId)
    return dono
}

export const obterStatusRestritoGrupo = async(grupoId)=>{ 
    let status = await gruposdb.obterStatusRestritoMsg(grupoId)
    return status
}

export const obterParticipantesGrupo = async(grupoId)=>{ 
    let participantes = await gruposdb.obterParticipantesGrupo(grupoId)
    return participantes
}

export const obterTodosGruposInfo = async()=>{
    let grupos = await gruposdb.obterTodosGrupos()
    return grupos
}


// Cadastro/Remoção/Atualização de grupos

export const registrarGrupo = async(grupoId, dadosGrupo)=>{
    await gruposdb.registrarGrupo(grupoId, dadosGrupo)
}

export const atualizarNomeGrupo = async(grupoId, nome)=>{
    await gruposdb.atualizarNomeGrupo(grupoId, nome)
}

export const atualizarRestritoGrupo = async(grupoId, status)=>{
    await gruposdb.atualizarRestritoGrupo(grupoId, status)
}

export const registrarGruposAoIniciar = async(gruposInfo)=>{
    try{
        var msgs_texto = await obterMensagensTexto()
        for(let grupo of gruposInfo){ 
            let g_registrado = await verificarRegistroGrupo(grupo.id)
            if(!g_registrado){
                let participantes = await socket.getGroupMembersIdFromMetadata(grupo)
                let admins = await socket.getGroupAdminsFromMetadata(grupo)
                let dadosGrupo = {
                    titulo: grupo.subject,
                    descricao: grupo.desc,
                    participantes,
                    admins,
                    dono: grupo.owner,
                    restrito: grupo.announce
                }
                await registrarGrupo(grupo.id, dadosGrupo)  
            } 
        }
        return msgs_texto.inicio.cadastro_grupos
    } catch(err){
        err.message = `registrarGruposAoIniciar - ${err.message}`
        throw err
    }
}

export const registrarGrupoAoSerAdicionado = async(grupoInfo)=>{
    try{
        let g_registrado = await verificarRegistroGrupo(grupoInfo.id)
        if(!g_registrado){
            let participantes = await socket.getGroupMembersIdFromMetadata(grupoInfo)
            let admins = await socket.getGroupAdminsFromMetadata(grupoInfo)
            let dadosGrupo = {
                titulo: grupoInfo.subject,
                descricao: grupoInfo.desc,
                participantes,
                admins,
                dono: grupoInfo.owner,
                restrito: grupoInfo.announce
            }
            await registrarGrupo(grupoInfo.id, dadosGrupo)  
        }
    } catch(err){
        err.message = `registrarGrupoAoSerAdicionado - ${err.message}`
        throw err
    }
}

export const atualizarDadosGrupo = async(grupoId, dadosGrupo)=>{
    await gruposdb.atualizarGrupo(grupoId, dadosGrupo)
}

export const atualizarDadosGrupoParcial = async(dadosGrupo)=>{
    try{
        if(dadosGrupo.subject != undefined) await atualizarNomeGrupo(dadosGrupo.id, dadosGrupo.subject)
        if(dadosGrupo.announce != undefined) await atualizarRestritoGrupo(dadosGrupo.id, dadosGrupo.announce)
    } catch(err){
        err.message = `atualizarDadosGrupoParcial - ${err.message}`
        throw err
    }
}

export const atualizarDadosGruposInicio = async(gruposInfo)=>{
    try{
        var msgs_texto = await obterMensagensTexto()
        for(let grupo of gruposInfo){
            let participantesGrupo = await socket.getGroupMembersIdFromMetadata(grupo)
            let adminsGrupo = await socket.getGroupAdminsFromMetadata(grupo)
            let dadosGrupo = {
                titulo: grupo.subject,
                descricao: grupo.desc,
                participantes : participantesGrupo,
                admins: adminsGrupo,
                dono: grupo.owner,
                restrito: grupo.announce
            }
            await atualizarDadosGrupo(grupo.id, dadosGrupo)
        }
        return msgs_texto.inicio.participantes_atualizados
    } catch(err) {
        err.message = `atualizarParticipantes - ${err.message}`
        throw err
    }
}

export const removerGrupo = async(grupoId)=>{
    try{
        let g_registrado = await verificarRegistroGrupo(grupoId)
        if(g_registrado) await gruposdb.removerGrupo(grupoId)
    } catch(err){
        err.message = `removerGrupo - ${err.message}`
        throw err
    }
}

export const resetarGrupos = async()=>{
    await gruposdb.resetarGrupos()
}

// Adicionar/Editar/Remover participantes do grupo

export const participanteExiste = async(grupoId, usuario)=>{
    let resposta = await gruposdb.participanteExiste(grupoId, usuario)
    return resposta
}

export const adicionarParticipante = async(grupoId, usuario)=>{
    try{
        let existe = await participanteExiste(grupoId,usuario)
        if(!existe) await gruposdb.adicionarParticipante(grupoId, usuario)
    } catch(err){
        err.message = `adicionarParticipante - ${err.message}`
        throw err
    }
}

export const removerParticipante = async(grupoId, usuario)=>{
    try{
        let usuarioAdministrador = await verificarAdmin(grupoId, usuario)
        if (usuarioAdministrador) await removerAdmin(grupoId, usuario) 
        await gruposdb.removerParticipante(grupoId, usuario)
    } catch(err){
        err.message = `removerParticipante - ${err.message}`
        throw err
    }
}

export const adicionarAdmin = async(grupoId, usuario)=>{
    await gruposdb.adicionarAdmin(grupoId, usuario)
}

export const verificarAdmin = async(grupoId, usuario)=>{
    let resposta = gruposdb.verificarAdmin(grupoId, usuario)
    return resposta
}

export const removerAdmin = async(grupoId, usuario)=>{
    await gruposdb.removerAdmin(grupoId, usuario)
}


// Recurso de atividade/contador de mensagens

export const alterarContador = async(grupoId, status = true)=>{
    await gruposdb.alterarContador(grupoId, status)
}

export const obterAtividadeParticipante = async(grupoId, usuario)=>{
    let atividade = await gruposdb.obterAtividade(grupoId, usuario)
    return atividade
}

export const obterParticipantesInativos = async(grupoId, qtdMensagem)=>{
    let inativos = await gruposdb.obterUsuariosInativos(grupoId, qtdMensagem)
    let grupoInfo = await obterGrupoInfo(grupoId)
    let inativosNoGrupo = []
    inativos.forEach((inativo)=>{
        if(grupoInfo.participantes.includes(inativo.id_usuario)) inativosNoGrupo.push(inativo)
    })
    return inativosNoGrupo
}

export const obterParticipantesAtivos = async(grupoId, qtdParticipantes)=>{
    let ativos = await gruposdb.obterUsuariosAtivos(grupoId, qtdParticipantes)
    let grupoInfo = await obterGrupoInfo(grupoId)
    let ativosNoGrupo = []
    ativos.forEach((ativo)=>{
        if(grupoInfo.participantes.includes(ativo.id_usuario)) ativosNoGrupo.push(ativo)
    })
    return ativosNoGrupo.length >= qtdParticipantes ? ativosNoGrupo.slice(0, (qtdParticipantes - 1)) : ativosNoGrupo
}

export const registrarContagemParticipante = async(grupoId, usuario)=>{
    await gruposdb.registrarContagem(grupoId, usuario)
}

export const verificarRegistrarContagemParticipante = async(grupoId, usuario)=>{
    await gruposdb.verificarRegistrarContagem(grupoId, usuario)
}

export const obterTodasContagensGrupo = async(grupoId)=>{
    let contagens = await gruposdb.obterTodasContagensGrupo(grupoId)
    return contagens
}

export const adicionarContagemParticipante = async(grupoId, usuario, tipoMensagem)=>{
    await gruposdb.addContagem(grupoId, usuario, tipoMensagem)
}

export const removerContagemParticipante = async(grupoId, usuario)=>{
    await gruposdb.removerContagem(grupoId, usuario)
}

export const registrarContagemGrupo = async(grupoId, usuariosGrupo) =>{
    await gruposdb.registrarContagemTodos(grupoId, usuariosGrupo)
}

export const removerContagemGrupo = async(grupoId)=>{
    await gruposdb.removerContagemGrupo(grupoId)
}

export const atualizarContagemGrupos = async(gruposInfo)=>{
    try{
        var msgs_texto = await obterMensagensTexto()
        for (let grupo of gruposInfo){
            let g_info = await obterGrupoInfo(grupo.id)
            if(g_info != null){
                if(g_info.contador.status){
                    let contagens = await obterTodasContagensGrupo(grupo.id)
                    let membros_grupo = await obterParticipantesGrupo(grupo.id)
                    //ADICIONANDO NA CONTAGEM QUEM ENTROU NO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let membroId of membros_grupo){
                        if(contagens.find(contagem => contagem.id_usuario == membroId) == undefined) await registrarContagemParticipante(grupo.id,membroId)
                    }
                }       
            }
        }
        return msgs_texto.inicio.contagem_recarregada
    } catch(err) {
        err.message = `atualizarContagemGrupos - ${err.message}`
        throw err
    }
}


// Recurso de boas-vindas

export const alterarBemVindo = async(grupoId, status, mensagem= "")=>{
    await gruposdb.alterarBemVindo(grupoId, status, mensagem)
}

export const mensagemBemVindo = async(c, evento, grupoInfo)=>{
    try{
        var msgs_texto = await obterMensagensTexto()
        if(grupoInfo.bemvindo.status){
            let msg_customizada = (grupoInfo.bemvindo.msg != "") ? grupoInfo.bemvindo.msg+"\n\n" : "" 
            let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, evento.participants[0].replace("@s.whatsapp.net", ""), grupoInfo.nome, msg_customizada)
            await socket.sendTextWithMentions(c, evento.id, mensagem_bemvindo, [evento.participants[0]])
        }
    } catch(err){
        err.message = `bemVindo - ${err.message}`
        consoleErro(err, "BEM VINDO")
    }
}


// Recurso ANTI-LINK

export const alterarAntiLink = async(grupoId, status = true)=>{
    await gruposdb.alterarAntiLink(grupoId, status)
}

export const filtroAntiLink = async(c, mensagemInfoCompleta)=>{
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {groupId, groupAdmins, isBotGroupAdmins } = mensagemInfoCompleta.grupo
        const {sender, chatId, isGroupMsg, body, caption, id} = mensagemInfoCompleta.mensagem
        if(!isGroupMsg) return true
        const al_status = await obterGrupoInfo(groupId)
        if(!al_status?.antilink) return true

        if (!isBotGroupAdmins) {
            await alterarAntiLink(groupId,false)
        } else {
            let mensagem = body || caption
            if(mensagem != undefined){
                const isUrl = mensagem.match(new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img))
                if(isUrl && !groupAdmins.includes(sender)){
                    await socket.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.grupo.antilink.detectou, sender.replace("@s.whatsapp.net", "")), [sender])
                    await socket.deleteMessage(c, id)
                    return false
                }
            }
        }
        return true   
    } catch(err){
        err.message = `antiLink - ${err.message}`
        consoleErro(err, "ANTI-LINK")
        return true
    }
}


// Recurso AUTO-STICKER

export const alterarAutoSticker = async(grupoId, status= true) =>{
    await gruposdb.alterarAutoSticker(grupoId, status)
}


// Recurso ANTI-FAKE

export const alterarAntiFake = async(grupoId, status = true, ddiAutorizados = [])=>{
    await gruposdb.alterarAntiFake(grupoId, status, ddiAutorizados)
}

export const filtroAntiFake = async(c, evento, grupoInfo)=>{
    try{
        if(grupoInfo.antifake.status){
            let msgs_texto = await obterMensagensTexto()
            let botInfo = await bot.obterInformacoesBot()
            let participante = evento.participants[0], botNumber = botInfo.numero_dono,  groupAdmins = grupoInfo.admins, isBotGroupAdmins = groupAdmins.includes(botNumber)
            if(!isBotGroupAdmins){
                await alterarAntiFake(evento.id,false)
            } else {
                for(ddi of grupoInfo.antifake.ddi_liberados){
                    if(participante.startsWith(ddi)) return true
                }
                await socket.sendTextWithMentions(c, evento.id, criarTexto(msgs_texto.geral.resposta_ban, participante.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antifake.motivo, botInfo.nome), [participante])
                await socket.removeParticipant(c, evento.id, participante)
                return false
            }
        }
        return true 
    } catch(err){
        err.message = `antiFake - ${err.message}`
        consoleErro(err, "ANTI-FAKE")
        return true
    }
}


// Recurso MUTAR GRUPO

export const alterarMutar = async(grupoId, status = true)=>{
    await gruposdb.alterarMutar(grupoId, status)
}


// Recurso ANTI-FLOOD

export const alterarAntiFlood = async(grupoId, status = true, qtdMensagem = 10, intervalo = 10)=>{
    await gruposdb.alterarAntiFlood(grupoId, status, qtdMensagem, intervalo)
}

export const tratarMensagemAntiFlood = async(grupoId, usuario)=>{
    let flood = await gruposdb.addMsgFlood(grupoId, usuario)
    return flood
}

export const filtroAntiFlood = async(c, mensagemInfoCompleta)=>{
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {groupId, groupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {chatId, sender, isGroupMsg} = mensagemInfoCompleta.mensagem
        if(!isGroupMsg) return true
        const afl_status = await obterGrupoInfo(groupId)
        if(!afl_status?.antiflood.status) return true
        if (!isBotGroupAdmins) {
            await alterarAntiFlood(groupId,false)
        } else {
            let flood = await tratarMensagemAntiFlood(groupId,sender)
            if(flood) {
                if(!groupAdmins.includes(sender)) {
                    await socket.removeParticipant(c, groupId, sender)
                    await socket.sendTextWithMentions(c,chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, botInfoJSON.nome_bot), [sender])
                    return false
                }
            } 
        }
        return true
    } catch(err){
        err.message = `antiFlood - ${err.message}`
        consoleErro(err, "ANTI-FLOOD")
        return true
    }
}


// Recurso LISTA NEGRA

export const obterListaNegra = async(grupoId)=>{
    let listaNegra = await gruposdb.obterListaNegra(grupoId)
    return listaNegra
}

export const adicionarUsuarioListaNegra = async(grupoId, usuario)=>{
    await gruposdb.adicionarListaNegra(grupoId, usuario)
}

export const removerUsuarioListaNegra = async(grupoId, usuario)=>{
    await gruposdb.removerListaNegra(grupoId, usuario)
}

export const verificarListaNegraGeral = async(c, gruposInfo)=>{
    try {
        var msgs_texto = await obterMensagensTexto()
        let botInfo = await bot.obterInformacoesBot()
        for(var grupo of gruposInfo){
            var botNumber = await bot.obterNumeroBot(), groupAdmins = await socket.getGroupAdminsFromMetadata(grupo),  isBotGroupAdmins = groupAdmins.includes(botNumber)
            if(isBotGroupAdmins){
                let groupId = grupo.id, participantesGrupo = await socket.getGroupMembersIdFromMetadata(grupo), lista_negra = await obterListaNegra(groupId), usuarios_listados = []
                for(let participante of participantesGrupo){
                    if(lista_negra.includes(participante)) usuarios_listados.push(participante)
                }
                for(let usuario of usuarios_listados){
                    await socket.removeParticipant(c, groupId, usuario)
                    await socket.sendTextWithMentions(c, groupId, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo.nome), [usuario])
                }
            }
        }
        return msgs_texto.inicio.lista_negra
    } catch (err) {
        err.message = `verificarListaNegraGeral - ${err.message}`
        throw err
    }
}

export const verificarListaNegraUsuario = async(c, evento)=>{
    try{
        var msgs_texto = await obterMensagensTexto()
        let botInfo = await bot.obterInformacoesBot()
        const botNumber = await bot.obterNumeroBot(), groupAdmins = await obterAdminsGrupo(evento.id),  isBotGroupAdmins = groupAdmins.includes(botNumber)
        if(isBotGroupAdmins){
            let lista_negra = await obterListaNegra(evento.id)
            if(lista_negra.includes(evento.participants[0])){
                await socket.removeParticipant(c, evento.id, evento.participants[0])
                await socket.sendTextWithMentions(c, evento.id, criarTexto(msgs_texto.geral.resposta_ban, evento.participants[0].replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo.nome), [evento.participants[0]])
                return false
            }
        }
        return true
    } catch(err){
        err.message = `verificarListaNegraUsuario - ${err.message}`
        consoleErro(err, "LISTA NEGRA")
        return true
    }
}


// Recurso Bloqueio/Desbloqueio de comandos

export const bloquearComandos = async(grupoId, comandos)=>{
    await gruposdb.addBlockedCmd(grupoId, comandos)
}

export const desbloquearComandos = async(grupoId, comandos)=>{
    await gruposdb.removeBlockedCmd(grupoId, comandos)
}

export const verificarComandosBloqueadosGrupo = async(comando, grupoInfo, prefixo)=>{
    return grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))
}

export const bloquearComandosGrupo = async(usuarioComandos, idGrupo)=>{
    var listaComandos = await listarComandos()
    var msgs_texto = await obterMensagensTexto()
    let {prefixo} = await bot.obterInformacoesBot()
    var comandosBloqueados = [], grupoInfo = await obterGrupoInfo(idGrupo), respostaBloqueio = msgs_texto.grupo.bcmd.resposta_titulo
    var categorias = ['figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "figurinhas":
                comandosCategoria = listaComandos.figurinhas
                break
            case "utilidades":
                comandosCategoria = listaComandos.utilidades
                break
            case "downloads":
                comandosCategoria = listaComandos.downloads
                break
            case "diversão":
                comandosCategoria = listaComandos.diversao
                break
        }

        for(var comando of comandosCategoria){
            if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
            } else {
                comandosBloqueados.push(comando.replace(prefixo, ''))
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
            }
        }
    } else {
        for(var comando of usuarioComandos){
            if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))){
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando.replace(prefixo, ''))
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
                }
            } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando)){
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.erro, comando)
            } else {
                respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.nao_existe, comando)
            }
        }
    }

    if(comandosBloqueados.length != 0) await bloquearComandos(idGrupo, comandosBloqueados)
    return respostaBloqueio
}

export const desbloquearComandosGrupo = async(usuarioComandos, idGrupo)=>{
    var listaComandos = await listarComandos()
    var msgs_texto = await obterMensagensTexto()
    let {prefixo} = await bot.obterInformacoesBot()
    var comandosDesbloqueados = [], grupoInfo = await obterGrupoInfo(idGrupo), respostaDesbloqueio = msgs_texto.grupo.dcmd.resposta_titulo
    var categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
    if(categorias.includes(primeiroComando)){
        var comandosCategoria = []
        switch(primeiroComando){
            case "todos":
                comandosCategoria = grupoInfo.block_cmds
                break
            case "figurinhas":
                comandosCategoria = listaComandos.figurinhas
                break
            case "utilidades":
                comandosCategoria = listaComandos.utilidades
                break
            case "downloads":
                comandosCategoria = listaComandos.downloads
                break
            case "diversão":
                comandosCategoria = listaComandos.diversao
                break
        }

        for(var comando of comandosCategoria){
            if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))) {
                comandosDesbloqueados.push(comando.replace(prefixo, ''))
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }

    } else {
        for(var comando of usuarioComandos){
            if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))) {
                comandosDesbloqueados.push(comando.replace(prefixo, ''))
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
            } else {
                respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
            }
        }
    }

    if(comandosDesbloqueados.length != 0) await desbloquearComandos(idGrupo, comandosDesbloqueados)
    return respostaDesbloqueio
}