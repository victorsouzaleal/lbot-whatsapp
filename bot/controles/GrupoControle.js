import {Grupo} from '../modelos/Grupo.js'
import {obterMensagensTexto} from '../lib/msgs.js'
import {listarComandos} from '../comandos/comandos.js'
import * as socket from '../baileys/socket.js'
import {consoleErro, criarTexto} from '../lib/util.js'
import moment from "moment-timezone"
import {MessageTypes} from '../baileys/mensagem.js'


export class GrupoControle {

    constructor(){
        this.grupo = new Grupo()
    }
    
    //Obter dados do grupo
    async obterGrupoInfo(id_grupo){
        return await this.grupo.obterGrupo(id_grupo)
    }

    async verificarRegistroGrupo(id_grupo){
        let grupo = await this.grupo.obterGrupo(id_grupo)
        return (grupo != null)
    }

    async obterAdminsGrupo(id_grupo){
        let grupo = await this.grupo.obterGrupo(id_grupo)
        return grupo?.admins
    }

    async obterDonoGrupo(id_grupo){
        let grupo = await this.grupo.obterGrupo(id_grupo)
        return grupo?.dono
    }

    async obterStatusRestritoGrupo(id_grupo){
        let grupo = await this.grupo.obterGrupo(id_grupo)
        return grupo?.restrito_msg
    }

    async obterParticipantesGrupo(id_grupo){
        let grupo = await this.grupo.obterGrupo(id_grupo)
        return grupo?.participantes
    }

    async obterTodosGruposInfo(){
        return await this.grupo.obterTodosGrupos()
    }

    // Cadastro/Remoção/Atualização de grupos
    async registrarGrupo(dadosGrupo){
        dadosGrupo.mutar = false
        dadosGrupo.bemvindo = {status: false, msg : ''}
        dadosGrupo.antifake = {status: false, ddi_liberados: []}
        dadosGrupo.antilink = false
        dadosGrupo.antiflood = {status: false, max: 10, intervalo: 10, msgs: []}
        dadosGrupo.autosticker = false
        dadosGrupo.contador = {status: false, inicio : ''}
        dadosGrupo.block_cmds = []
        dadosGrupo.lista_negra = []

        await this.grupo.registrarGrupo(dadosGrupo)
    }

    async atualizarNomeGrupo(id_grupo, nome){
        await this.grupo.atualizarNomeGrupo(id_grupo, nome)
    }

    async atualizarRestritoGrupo(id_grupo, status){
        await this.grupo.atualizarRestritoGrupo(id_grupo, status)
    }

    async registrarGruposAoIniciar(gruposInfo){
        try{
            for(let grupo of gruposInfo){ 
                let g_registrado = await this.verificarRegistroGrupo(grupo.id)
                if(!g_registrado){
                    let participantes = await socket.obterMembrosGrupoPorMetadata(grupo)
                    let admins = await socket.obterAdminsGrupoPorMetadata(grupo)
                    let dadosGrupo = {
                        id_grupo: grupo.id,
                        nome: grupo.subject,
                        descricao: grupo.desc,
                        participantes,
                        admins,
                        dono: grupo.owner,
                        restrito_msg: grupo.announce
                    }
                    await this.registrarGrupo(dadosGrupo)  
                } 
            }
        } catch(err){
            err.message = `registrarGruposAoIniciar - ${err.message}`
            throw err
        }
    }

    async registrarGrupoAoSerAdicionado(grupoInfo){
        try{
            let g_registrado = await this.verificarRegistroGrupo(grupoInfo.id)
            if(!g_registrado){
                let participantes = await socket.obterMembrosGrupoPorMetadata(grupoInfo)
                let admins = await socket.obterAdminsGrupoPorMetadata(grupoInfo)
                let dadosGrupo = {
                    id_grupo: grupoInfo.id,
                    nome: grupoInfo.subject,
                    descricao: grupoInfo.desc,
                    participantes,
                    admins,
                    dono: grupoInfo.owner,
                    restrito_msg: grupoInfo.announce
                }
                await this.registrarGrupo(dadosGrupo)  
            }
        } catch(err){
            err.message = `registrarGrupoAoSerAdicionado - ${err.message}`
            throw err
        }
    }

    async atualizarDadosGrupo(dadosGrupo){
        await this.grupo.atualizarGrupo(dadosGrupo)
    }

    async atualizarDadosGrupoParcial(dadosGrupo){
        try{
            if(dadosGrupo.subject != undefined) await this.atualizarNomeGrupo(dadosGrupo.id, dadosGrupo.subject)
            if(dadosGrupo.announce != undefined) await this.atualizarRestritoGrupo(dadosGrupo.id, dadosGrupo.announce)
        } catch(err){
            err.message = `atualizarDadosGrupoParcial - ${err.message}`
            throw err
        }
    }

    async atualizarDadosGruposInicio(gruposInfo){
        try{
            for(let grupo of gruposInfo){
                let participantesGrupo = await socket.obterMembrosGrupoPorMetadata(grupo)
                let adminsGrupo = await socket.obterAdminsGrupoPorMetadata(grupo)
                let dadosGrupo = {
                    id_grupo : grupo.id,
                    nome: grupo.subject,
                    descricao: grupo.desc,
                    participantes : participantesGrupo,
                    admins: adminsGrupo,
                    dono: grupo.owner,
                    restrito_msg: grupo.announce
                }
                await this.atualizarDadosGrupo(dadosGrupo)
            }
        } catch(err) {
            err.message = `atualizarParticipantes - ${err.message}`
            throw err
        }
    }

    async removerGrupo(id_grupo){
        try{
            let g_registrado = this.verificarRegistroGrupo(id_grupo)
            if(g_registrado) await this.grupo.removerGrupo(id_grupo)
        } catch(err){
            err.message = `removerGrupo - ${err.message}`
            throw err
        }
    }

    // Adicionar/Editar/Remover participantes do grupo
    async participanteExiste(id_grupo, id_usuario){
        let participantes = await this.grupo.obterParticipantes(id_grupo)
        return (participantes && participantes.includes(id_usuario))
    }

    async adicionarParticipante(id_grupo, id_usuario){
        try{
            let existe = await this.participanteExiste(id_grupo, id_usuario)
            if(!existe) await this.grupo.adicionarParticipante(id_grupo, id_usuario)
        } catch(err){
            err.message = `adicionarParticipante - ${err.message}`
            throw err
        }
    }

    async adicionarAdmin(id_grupo, id_usuario){
        await this.grupo.adicionarAdmin(id_grupo, id_usuario)
    }

    async removerAdmin(id_grupo, id_usuario){
        await this.grupo.removerAdmin(id_grupo, id_usuario)
    }

    async verificarAdmin(id_grupo, id_usuario){
        let admins = await this.grupo.obterAdmins(id_grupo)
        return (admins && admins.includes(id_usuario))
    }

    async removerParticipante(id_grupo, id_usuario){
        try{
            let usuarioAdministrador = await this.verificarAdmin(id_grupo, id_usuario)
            if (usuarioAdministrador) await this.removerAdmin(id_grupo, id_usuario) 
            await this.grupo.removerParticipante(id_grupo, id_usuario)
        } catch(err){
            err.message = `removerParticipante - ${err.message}`
            throw err
        }
    }

    // Recurso de atividade/contador de mensagens
    async alterarContador(id_grupo, status = true){
        let data_atual = (status) ? moment(moment.now()).format("DD/MM HH:mm:ss") : ''
        await this.grupo.alterarContador(id_grupo, status, data_atual)
    }
    
    async obterAtividadeParticipante(id_grupo, id_usuario){
        return await this.grupo.obterContagem(id_grupo, id_usuario)
    }

    async obterParticipantesInativos(id_grupo, qtdMensagem){
        let inativos = await this.grupo.obterContagensMenoresQue(id_grupo, qtdMensagem)
        let grupoInfo = await this.obterGrupoInfo(id_grupo)
        let inativosNoGrupo = []
        inativos.forEach((inativo)=>{
            if(grupoInfo.participantes.includes(inativo.id_usuario)) inativosNoGrupo.push(inativo)
        })
        return inativosNoGrupo
    }

    async obterParticipantesAtivos(id_grupo, qtd){
        let ativos = await this.grupo.obterMaioresContagens(id_grupo)
        let grupoInfo = await this.obterGrupoInfo(id_grupo)
        let ativosNoGrupo = []
        ativos.forEach((ativo)=>{
            if(grupoInfo.participantes.includes(ativo.id_usuario)) ativosNoGrupo.push(ativo)
        })
        return ativosNoGrupo.length >= qtd ? ativosNoGrupo.slice(0, (qtd - 1)) : ativosNoGrupo
    }

    async registrarContagemParticipante(id_grupo, id_usuario){
        await this.grupo.registrarContador(id_grupo, id_usuario)
    }
    
    async verificarRegistrarContagemParticipante(id_grupo, id_usuario){
        let contador = await this.obterAtividadeParticipante(id_grupo, id_usuario)
        if(!contador) await this.registrarContagemParticipante(id_grupo, id_usuario)
    }

    async obterTodasContagensGrupo(id_grupo){
        return await this.grupo.obterTodasContagens(id_grupo)
    }

    async adicionarContagemParticipante(id_grupo, id_usuario, tipoMensagem){
        let dadosIncrementados = {msg: 1}
        switch(tipoMensagem){
            case MessageTypes.text :
            case MessageTypes.extendedText:
                dadosIncrementados.texto = 1
                break
            case MessageTypes.image:
                dadosIncrementados.imagem = 1
                break
            case MessageTypes.video:
                dadosIncrementados.video = 1
                break
            case MessageTypes.sticker:
                dadosIncrementados.sticker = 1
                break
            case MessageTypes.audio:
                dadosIncrementados.audio = 1
                break
            case MessageTypes.document:
                dadosIncrementados.outro = 1
                break    
        }
        await this.grupo.adicionarContagem(id_grupo, id_usuario, dadosIncrementados)
    }

    async removerContagemParticipante(id_grupo, id_usuario){
        await this.grupo.removerContador(id_grupo, id_usuario)
    }

    async registrarContagemGrupo(id_grupo, usuariosGrupo){
        for(let usuario of usuariosGrupo){
            await this.registrarContagemParticipante(id_grupo, usuario)
        }
    }

    async removerContagemGrupo(id_grupo){
        await this.grupo.removerContadorGrupo(id_grupo)
    }

    async atualizarContagemGrupos(gruposInfo){
        try{
            for (let grupo of gruposInfo){
                let g_info = await this.obterGrupoInfo(grupo.id)
                if(g_info != null){
                    if(g_info.contador.status){
                        let contagens = await this.obterTodasContagensGrupo(grupo.id)
                        let membros_grupo = await this.obterParticipantesGrupo(grupo.id)
                        //ADICIONANDO NA CONTAGEM QUEM ENTROU NO GRUPO ENQUANTO O BOT ESTAVA OFF
                        for(let membroId of membros_grupo){
                            if(contagens.find(contagem => contagem.id_usuario == membroId) == undefined) await this.registrarContagemParticipante(grupo.id,membroId)
                        }
                    }       
                }
            }
        } catch(err) {
            err.message = `atualizarContagemGrupos - ${err.message}`
            throw err
        }
    }

    // Recurso de boas-vindas
    async alterarBemVindo(id_grupo, status, mensagem = ''){
        await this.grupo.alterarBemVindo(id_grupo, status, mensagem)
    }

    async mensagemBemVindo(c, evento, grupoInfo, botInfo){
        try{
            let msgs_texto = obterMensagensTexto(botInfo)
            if(grupoInfo.bemvindo.status){
                let msg_customizada = (grupoInfo.bemvindo.msg != "") ? grupoInfo.bemvindo.msg+"\n\n" : "" 
                let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, evento.participants[0].replace("@s.whatsapp.net", ""), grupoInfo.nome, msg_customizada)
                await socket.enviarTextoComMencoes(c, evento.id, mensagem_bemvindo, [evento.participants[0]])
            }
        } catch(err){
            err.message = `bemVindo - ${err.message}`
            consoleErro(err, "BEM VINDO")
        }
    }

    // Recurso ANTI-LINK
    async alterarAntiLink(id_grupo, status = true){
        await this.grupo.alterarAntiLink(id_grupo, status)
    }

    async filtroAntiLink(c, mensagemBaileys, botInfo){
        try{
            const msgs_texto = obterMensagensTexto(botInfo)
            const {sender, chatId, isGroupMsg, body, caption, id} = mensagemBaileys
            const {groupId, groupAdmins, isBotGroupAdmins, grupoInfo} = mensagemBaileys.grupo
            if(!isGroupMsg) return true
            if(!grupoInfo?.antilink) return true
    
            if (!isBotGroupAdmins) {
                await this.alterarAntiLink(groupId,false)
            } else {
                let mensagem = body || caption
                if(mensagem != undefined){
                    const isUrl = mensagem.match(new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img))
                    if(isUrl && !groupAdmins.includes(sender)){
                        await socket.enviarTextoComMencoes(c, chatId, criarTexto(msgs_texto.grupo.antilink.detectou, sender.replace("@s.whatsapp.net", "")), [sender])
                        await socket.deletarMensagem(c, id)
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

    //Recurso AUTO-STICKER
    async alterarAutoSticker(id_grupo, status = true){
        await this.grupo.alterarAutoSticker(id_grupo, status)
    }

    //Recurso ANTI-FAKE
    async alterarAntiFake(id_grupo, status = true, ddiAutorizados = []){
        await this.grupo.alterarAntiFake(id_grupo, status, ddiAutorizados)
    }

    async filtroAntiFake(c, evento, grupoInfo, botInfo){
        try{
            if(grupoInfo.antifake.status){
                let msgs_texto = obterMensagensTexto(botInfo)
                let participante = evento.participants[0], botNumber = botInfo.numero_dono,  groupAdmins = grupoInfo.admins, isBotGroupAdmins = groupAdmins.includes(botNumber)
                if(!isBotGroupAdmins){
                    await this.alterarAntiFake(evento.id,false)
                } else {
                    for(ddi of grupoInfo.antifake.ddi_liberados){
                        if(participante.startsWith(ddi)) return true
                    }
                    await socket.enviarTextoComMencoes(c, evento.id, criarTexto(msgs_texto.geral.resposta_ban, participante.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antifake.motivo, botInfo.nome), [participante])
                    await socket.removerParticipante(c, evento.id, participante)
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
    async alterarMutar(id_grupo, status = true){
        await this.grupo.alterarMutar(id_grupo, status)
    }

    // Recurso ANTI-FLOOD
    async alterarAntiFlood(id_grupo, status = true, qtdMensagem = 10, intervalo = 10){
        await this.grupo.alterarAntiFlood(id_grupo, status, qtdMensagem, intervalo)
    }

    async tratarMensagemAntiFlood(grupo_info, id_usuario){
        try{
            let timestamp_atual = parseInt(Math.round(new Date().getTime()/1000)),  resposta = false
            //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
            for(let i = 0; i < grupo_info.antiflood.msgs.length; i++){
                if(timestamp_atual >= grupo_info.antiflood.msgs[i].expiracao) grupo_info.antiflood.msgs.splice(i,1)       
            }
            //PESQUISA O INDICE DO USUARIO
            let usuarioIndex = grupo_info.antiflood.msgs.findIndex(usuario=> usuario.id_usuario == id_usuario)
            //SE O USUARIO JÁ ESTIVER NA LISTA
            if(usuarioIndex != -1){
                //INCREMENTA A CONTAGEM
                grupo_info.antiflood.msgs[usuarioIndex].qtd++
                let max_msg = grupo_info.antiflood.max
                if(grupo_info.antiflood.msgs[usuarioIndex].qtd >= max_msg){
                    grupo_info.antiflood.msgs.splice(usuarioIndex,1)
                    resposta = true
                } else{
                    resposta = false
                }
            } else {
                //ADICIONA O USUARIO NA LISTA
                grupo_info.antiflood.msgs.push({
                    id_usuario,
                    expiracao: timestamp_atual + parseInt(grupo_info.antiflood.intervalo),
                    qtd: 1
                })
                resposta = false
            }
    
            //ATUALIZAÇÃO E RETORNO
            await this.grupo.atualizarAntiFlood(grupo_info.id_grupo, grupo_info.antiflood.msgs)
            return resposta
        } catch(err){
            throw new Error(err)
        }
    }

    async filtroAntiFlood(c, mensagemBaileys, botInfo){
        try{
            const msgs_texto = obterMensagensTexto(botInfo)
            const {chatId, sender, isGroupMsg} = mensagemBaileys
            const {groupId, groupAdmins, isBotGroupAdmins, grupoInfo} = mensagemBaileys.grupo
 
            if(!isGroupMsg) return true
            if(!grupoInfo?.antiflood.status) return true
            if (!isBotGroupAdmins) {
                await this.alterarAntiFlood(groupId, false)
            } else {
                let flood = await this.tratarMensagemAntiFlood(grupoInfo, sender)
                if(flood) {
                    if(!groupAdmins.includes(sender)) {
                        await socket.removerParticipante(c, groupId, sender)
                        await socket.enviarTextoComMencoes(c, chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.replace("@s.whatsapp.net", ""), msgs_texto.grupo.antiflood.motivo, botInfo.nome_bot), [sender])
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

    // Recurso LISTA-NEGRA
    async obterListaNegra(id_grupo){
        return await this.grupo.obterListaNegra(id_grupo)
    }

    async adicionarUsuarioListaNegra(id_grupo, id_usuario){
        await this.grupo.adicionarListaNegra(id_grupo, id_usuario)
    }

    async removerUsuarioListaNegra(id_grupo, id_usuario){
        await this.grupo.removerListaNegra(id_grupo, id_usuario)
    }

    async verificarListaNegraGeral(c, gruposInfo, botInfo){
        try {
            let msgs_texto = obterMensagensTexto(botInfo)
            for(let grupo of gruposInfo){
                let botNumber = botInfo.hostNumber, groupAdmins = await socket.obterAdminsGrupoPorMetadata(grupo),  isBotGroupAdmins = groupAdmins.includes(botNumber)
                if(isBotGroupAdmins){
                    let participantesGrupo = await socket.obterMembrosGrupoPorMetadata(grupo), lista_negra = await this.obterListaNegra(grupo.id), usuarios_listados = []
                    for(let participante of participantesGrupo){
                        if(lista_negra.includes(participante)) usuarios_listados.push(participante)
                    }
                    for(let usuario of usuarios_listados){
                        await socket.removerParticipante(c, grupo.id, usuario)
                        await socket.enviarTextoComMencoes(c, grupo.id, criarTexto(msgs_texto.geral.resposta_ban, usuario.replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo.nome_bot), [usuario])
                    }
                }
            }
        } catch (err) {
            err.message = `verificarListaNegraGeral - ${err.message}`
            throw err
        }
    }

    async verificarListaNegraUsuario(c, evento, botInfo){
        try{
            let msgs_texto = obterMensagensTexto(botInfo)
            const botNumber = botInfo.hostNumber, groupAdmins = await this.obterAdminsGrupo(evento.id),  isBotGroupAdmins = groupAdmins.includes(botNumber)
            if(isBotGroupAdmins){
                let lista_negra = await this.obterListaNegra(evento.id)
                if(lista_negra.includes(evento.participants[0])){
                    await socket.removerParticipante(c, evento.id, evento.participants[0])
                    await socket.enviarTextoComMencoes(c, evento.id, criarTexto(msgs_texto.geral.resposta_ban, evento.participants[0].replace("@s.whatsapp.net", ""), msgs_texto.grupo.listanegra.motivo, botInfo.nome_bot), [evento.participants[0]])
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

    //Recurso Bloqueio/Desbloqueio de comandos
    async bloquearComandos(id_grupo, comandos){
        await this.grupo.adicionarComandoBloqueio(id_grupo, comandos)
    }

    async desbloquearComandos(id_grupo, comandos){
        await this.grupo.removerComandosBloqueio(id_grupo, comandos)
    }

    async verificarComandosBloqueadosGrupo(comando, grupoInfo, prefixo){
        return grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))
    }

    async bloquearComandosGrupo(comandos, id_grupo, botInfo){
        let {prefixo} = botInfo
        let listaComandos = listarComandos(prefixo)
        let msgs_texto = obterMensagensTexto(botInfo)
        let comandosBloqueados = [], grupoInfo = await this.obterGrupoInfo(id_grupo), respostaBloqueio = msgs_texto.grupo.bcmd.resposta_titulo
        let categorias = ['figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = comandos[0]
        if(categorias.includes(primeiroComando)){
            let comandosCategoria = []
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

            for(let comando of comandosCategoria){
                if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))){
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando.replace(prefixo, ''))
                    respostaBloqueio += criarTexto(msgs_texto.grupo.bcmd.resposta_variavel.bloqueado_sucesso, comando)
                }
            }
        } else {
            for(let comando of comandos){
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

        if(comandosBloqueados.length != 0) await this.bloquearComandos(id_grupo, comandosBloqueados)
        return respostaBloqueio
    }

    async desbloquearComandosGrupo(comandos, id_grupo, botInfo){
        let {prefixo} = botInfo
        let listaComandos = listarComandos(prefixo)
        let msgs_texto = obterMensagensTexto(botInfo)
        let comandosDesbloqueados = [], grupoInfo = await this.obterGrupoInfo(id_grupo), respostaDesbloqueio = msgs_texto.grupo.dcmd.resposta_titulo
        let categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = comandos[0]
        if(categorias.includes(primeiroComando)){
            let comandosCategoria = []
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

            for(let comando of comandosCategoria){
                if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))) {
                    comandosDesbloqueados.push(comando.replace(prefixo, ''))
                    respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
                } else {
                    respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
                }
            }

        } else {
            for(let comando of comandos){
                if(grupoInfo.block_cmds.includes(comando.replace(prefixo, ''))) {
                    comandosDesbloqueados.push(comando.replace(prefixo, ''))
                    respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.desbloqueado_sucesso, comando)
                } else {
                    respostaDesbloqueio += criarTexto(msgs_texto.grupo.dcmd.resposta_variavel.ja_desbloqueado, comando)
                }
            }
        }

        if(comandosDesbloqueados.length != 0) await this.desbloquearComandos(id_grupo, comandosDesbloqueados)
        return respostaDesbloqueio
    }
}