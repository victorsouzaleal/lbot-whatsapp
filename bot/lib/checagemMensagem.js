//REQUERINDO MODULOS
import { criarTexto} from './util.js'
import * as socket from '../baileys/socket.js'
import {BotControle} from '../controles/BotControle.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import {MessageTypes} from '../baileys/mensagem.js'


export const checagemMensagem = async (c, mensagemInfoCompleta) => {
    try {
        const bot = new BotControle()
        const usuarios = new UsuarioControle()
        const grupos = new GrupoControle()
        const {msgs_texto, lista_comandos, ownerNumber} = mensagemInfoCompleta
        const {botInfoJSON, botNumber} = mensagemInfoCompleta.bot
        const {groupId, grupoInfo, isGroupAdmins, isBotGroupAdmins} = mensagemInfoCompleta.grupo
        const {command, args, sender, isOwner, isGroupMsg, type, id, chatId, username, participant, messageId} = mensagemInfoCompleta.mensagem
        const {prefixo, nome_bot} = botInfoJSON
        const autoStickerPv = (!isGroupMsg && (type == MessageTypes.image || type == MessageTypes.video) && botInfoJSON.autosticker)
        const autoStickerGrupo = (isGroupMsg && (type == MessageTypes.image || type == MessageTypes.video) && grupoInfo.autosticker)
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await socket.obterContatosBloqueados(c)
        const isBlocked = blockedNumbers.includes(sender)
        const comandoExiste = (
            lista_comandos.utilidades.includes(command) ||
            lista_comandos.grupo.includes(command) || 
            lista_comandos.diversao.includes(command) ||
            lista_comandos.admin.includes(command) ||
            lista_comandos.info.includes(command) ||
            lista_comandos.figurinhas.includes(command) ||
            lista_comandos.downloads.includes(command)
        )

        //Se o numero do dono estiver vazio e o comando for !admin, cadastre quem fez o comando como dono.
        if(botInfoJSON.numero_dono == '' && command == `${prefixo}admin`) {
            await bot.alterarNumeroDono(sender)
            await socket.responderTexto(c, chatId, msgs_texto.geral.dono_cadastrado, id)
            return false
        }

        // DADOS DO USUÁRIO E REGISTRO
        let usuarioRegistrado = await usuarios.verificarRegistro(sender)
        if(!usuarioRegistrado) await usuarios.registrarUsuario(sender, username)
        if(isOwner) await usuarios.verificarDono(sender)
        // OBTENDO DADOS ATUALIZADOS DO USUÁRIO
        const dadosUsuario = await usuarios.obterDadosUsuario(sender)

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, VERIFICA SE O USUARIO EXISTE NO CONTADOR , REGISTRA ELE E ADICIONA A CONTAGEM
        if(isGroupMsg && grupoInfo?.contador.status) {
            await grupos.verificarRegistrarContagemParticipante(groupId, sender)
            await grupos.adicionarContagemParticipante(groupId, sender, type)
        }

        //SE FOR BLOQUEADO RETORNE
        if (isBlocked) return false
        //SE O PV DO BOT NÃO ESTIVER LIBERADO
        if(!isGroupMsg && !isOwner && !botInfoJSON.pvliberado) return false
        //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
        if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return false
        //SE FOR MENSAGEM DE GRUPO, O BOT NÃO FOR ADMIN E ESTIVER COM RESTRIÇÃO DE MENSAGENS PARA ADMINS
        if(isGroupMsg && !isBotGroupAdmins && grupoInfo.restrito_msg) return false

        //SE O USUÁRIO MANDAR MENSAGEM NO PV E AINDA NÃO TIVER RECEBIDO A MENSAGEM DE BOAS VINDAS, ENVIE.
        if(!isGroupMsg && !dadosUsuario.recebeuBoasVindas && botInfoJSON.pvliberado){
            await socket.enviarTexto(c, chatId, criarTexto(msgs_texto.geral.usuario_novo, nome_bot?.trim(), username), id)
            await usuarios.recebeuBoasVindas(sender)
        }

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //ENVIE QUE LEU A MENSAGEM
            await socket.lerMensagem(c, chatId, participant, messageId)
            //ATUALIZE NOME DO USUÁRIO 
            await usuarios.atualizarNome(sender, username)
            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfoJSON.limitecomandos.status){
                let limiteComando = await bot.verificarLimiteComando(sender, dadosUsuario.tipo, isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await socket.responderTexto(c,chatId, limiteComando.msg, id)
                    return false
                }
            }
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await bot.verificarComandosBloqueadosGlobal(command, botInfoJSON, prefixo) && !isOwner){
                await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, command), id)
                return false
            }
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && await grupos.verificarComandosBloqueadosGrupo(command, grupoInfo, prefixo) && !isGroupAdmins) {
                await socket.responderTexto(c,chatId,criarTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, command), id)
                return false
            }
            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfoJSON.limite_diario.status){
                if(!lista_comandos.excecoes_contagem.includes(command) && !lista_comandos.admin.includes(command) && !lista_comandos.grupo.includes(command) && !lista_comandos.info.includes(command) && !msgGuia){
                    await bot.verificarExpiracaoLimite()
                    let ultrapassou = await usuarios.verificarUltrapassouLimiteComandos(sender)
                    if(!ultrapassou) {
                        await usuarios.adicionarContagemDiariaComandos(sender) 
                    } else {
                        await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber.replace("@s.whatsapp.net", "")), id)
                        return false
                    }   
                } else {
                    await usuarios.adicionarContagemTotalComandos(sender)
                    await bot.verificarExpiracaoLimite()
                }
            } else {
                await usuarios.adicionarContagemTotalComandos(sender)
            }
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await bot.atualizarComandosFeitos()
        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            if(autoStickerPv || autoStickerGrupo){
                //ENVIE QUE LEU A MENSAGEM
                await socket.lerMensagem(c, chatId, participant, messageId)
                //ATUALIZE NOME DO USUÁRIO 
                await usuarios.atualizarNome(sender, username)
                //LIMITACAO DE COMANDO POR MINUTO
                if(botInfoJSON.limitecomandos.status){
                    let limiteComando = await bot.verificarLimiteComando(sender, dadosUsuario.tipo,isGroupAdmins)
                    if(limiteComando.comando_bloqueado) if(limiteComando.msg != undefined) return await socket.responderTexto(c,chatId, limiteComando.msg, id)
                }
                //SE O LIMITE DIARIO DE COMANDOS ESTIVER ATIVADO
                if(botInfoJSON.limite_diario.status){
                    await bot.verificarExpiracaoLimite()
                    let ultrapassou = await usuarios.verificarUltrapassouLimiteComandos(sender)
                    if(!ultrapassou) await usuarios.adicionarContagemDiariaComandos(sender) 
                    else return await socket.responderTexto(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber.replace("@s.whatsapp.net", "")), id)
                } else {
                    await usuarios.adicionarContagemTotalComandos(sender)
                }
                //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
                await bot.atualizarComandosFeitos()
            } else {
                return false
            } 
        }
        return true
    } catch (err) {
        err.message = `checagemMensagem - ${err.message}`
        throw err
    }
}
