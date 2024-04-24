//REQUERINDO MODULOS
import * as gruposdb from '../database/grupos.js'
import * as usuariosdb from '../database/usuarios.js'
import {verificarBloqueioGlobal, verificarBloqueioGrupo} from './bloqueioComandos.js'
import { criarTexto} from './util.js'
import * as socket from '../baileys/socket-funcoes.js'
import * as bot from '../controle/botControle.js'


export const checagemMensagem = async (c, mensagemInfoCompleta) => {
    try {
        const {msgs_texto, lista_comandos, ownerNumber} = mensagemInfoCompleta
        const {botInfoJSON} = mensagemInfoCompleta.bot
        const {groupId, grupoInfo, isGroupAdmins} = mensagemInfoCompleta.grupo
        const {command, args, sender, isOwner, isGroupMsg, type, id, chatId, username, participant, messageId} = mensagemInfoCompleta.mensagem
        const {prefixo, nome_bot} = botInfoJSON

        //Se o numero do dono estiver vazio e o comando for !admin, cadastre quem fez o comando como dono.
        if(botInfoJSON.numero_dono == '' && command == `${prefixo}admin`) {
            await bot.alterarNumeroDono(sender)
            await socket.reply(c, chatId, msgs_texto.geral.dono_cadastrado, id)
            return false
        }

        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const blockedNumbers = await socket.getBlockedIds(c)
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

        //SE O PV DO BOT NÃO ESTIVER LIBERADO
        if(!isGroupMsg && !isOwner && !botInfoJSON.pvliberado) return false

        //SE NÃO FOR MENSAGEM DE GRUPO E FOR  BLOQUEADO RETORNE
        if (!isGroupMsg && isBlocked) return false

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, VERIFICA SE O USUARIO EXISTE NO CONTADOR , REGISTRA ELE E ADICIONA A CONTAGEM
        if(isGroupMsg && grupoInfo.contador.status) {
            await gruposdb.existeUsuarioContador(groupId,sender)
            await gruposdb.addContagem(groupId,sender,type)
        }

        //SE O USUARIO NÃO FOR REGISTRADO, FAÇA O REGISTRO
        var registrado = await usuariosdb.verificarRegistro(sender)
        if(!registrado) {
            if(isOwner) {
                await usuariosdb.verificarDonoAtual(sender)
                await usuariosdb.registrarDono(sender, username)
            }
            else {
                await usuariosdb.registrarUsuario(sender, username)
                //SE NÃO FOR MENSAGEM DE GRUPO E A MENSAGEM NÃO TIVER O COMANDO, ENVIE UM GUIA
                if(!isGroupMsg && !comandoExiste) await socket.sendText(c, chatId, criarTexto(msgs_texto.geral.usuario_novo, nome_bot, username))
            }
        } else {
            if(isOwner) await usuariosdb.verificarDonoAtual(sender)       
        }

        //ENVIE QUE LEU A MENSAGEM
        await socket.readMessage(c, chatId, participant, messageId)

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //ATUALIZE NOME DO USUÁRIO 
            await usuariosdb.atualizarNome(sender, username)

            //SE FOR MENSAGEM DE GRUPO E USUARIO FOR BLOQUEADO RETORNE
            if (isGroupMsg && isBlocked) return false

            //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
            if(isGroupMsg && !isGroupAdmins && grupoInfo.mutar) return false

            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfoJSON.limitecomandos.status){
                let usuario = await usuariosdb.obterUsuario(sender)
                let limiteComando = await bot.verificarLimiteComando(sender, usuario.tipo,isGroupAdmins)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await socket.reply(c,chatId, limiteComando.msg, id)
                    return false
                }
            }
            
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await verificarBloqueioGlobal(command, botInfoJSON, prefixo) && !isOwner){
                await socket.reply(c, chatId, criarTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, command), id)
                return false
            }
            
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(isGroupMsg && await verificarBloqueioGrupo(command, grupoInfo, prefixo) && !isGroupAdmins) {
                await socket.reply(c,chatId,criarTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, command), id)
                return false
            }

            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfoJSON.limite_diario.status){
                if(!lista_comandos.excecoes_contagem.includes(command) && !lista_comandos.admin.includes(command) && !lista_comandos.grupo.includes(command) && !lista_comandos.info.includes(command) && !msgGuia){
                    await bot.verificarExpiracaoLimite()
                    let ultrapassou = await usuariosdb.ultrapassouLimite(sender)
                    if(!ultrapassou) {
                        await usuariosdb.addContagemDiaria(sender) 
                    } else {
                        await socket.reply(c, chatId, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, username, ownerNumber.replace("@s.whatsapp.net", "")), id)
                        return false
                    }   
                } else {
                    await usuariosdb.addContagemTotal(sender)
                    await bot.verificarExpiracaoLimite()
                }
            } else {
                await usuariosdb.addContagemTotal(sender)
            }
          
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await bot.atualizarComandosFeitos()

        } else { //SE NÃO FOR UM COMANDO EXISTENTE
            //SE FOR UMA MENSAGEM PRIVADA E O LIMITADOR DE MENSAGENS ESTIVER ATIVO
            if(!isGroupMsg && botInfoJSON.limitarmensagens.status){
                let u = await usuariosdb.obterUsuario(sender)
                let tipo_usuario_pv = u ? u.tipo : "comum"
                let limitarMensagens = await bot.verificarLimitarMensagensPv(sender, tipo_usuario_pv)
                if(limitarMensagens.bloquear_usuario) {
                    await socket.sendText(c, sender, limitarMensagens.msg)
                    await socket.contactBlock(c, sender)
                    return false
                }
            }
        }
        return true
    } catch (err) {
        err.message = `checagemMensagem - ${err.message}`
        throw err
    }
}
