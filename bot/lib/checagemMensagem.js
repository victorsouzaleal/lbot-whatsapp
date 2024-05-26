//REQUERINDO MODULOS
import { criarTexto, verificarComandoExiste} from './util.js'
import * as socket from '../baileys/socket.js'
import {BotControle} from '../controles/BotControle.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import {MessageTypes} from '../baileys/mensagem.js'
import {obterMensagensTexto} from './msgs.js'
import {listarComandos} from '../comandos/comandos.js'


export const checagemMensagem = async (c, mensagemBaileys, botInfo) => {
    try {
        //Atribuição de valores
        const bot = new BotControle()
        const usuarios = new UsuarioControle()
        const grupos = new GrupoControle()
        const {prefixo, nome_bot} = botInfo
        const numero_dono = botInfo.numero_dono
        const msgs_texto = obterMensagensTexto(botInfo)
        const lista_comandos = listarComandos(prefixo)
        const {
            comando,
            args,
            remetente,
            mensagem_dono,
            mensagem_grupo,
            tipo,
            mensagem_completa,
            id_chat,
            nome_usuario,
            id_mensagem,
            mensagem_vunica,
            grupo,
            citacao
        } = mensagemBaileys
        const {id_grupo, usuario_admin, bot_admin} = {...grupo}
        const msgGuia = (args.length == 1) ? false : args[1] == "guia"
        const usuariosBloqueados = await socket.obterContatosBloqueados(c)
        const usuarioBloqueado = usuariosBloqueados.includes(remetente)
        const comandoExiste = verificarComandoExiste(lista_comandos, comando)
        
        //Se o numero do dono estiver vazio e o comando for !admin, cadastre quem fez o comando como dono.
        if(!numero_dono && comando == `${prefixo}admin`) {
            await bot.alterarNumeroDono(remetente, botInfo)
            await socket.responderTexto(c, id_chat, msgs_texto.geral.dono_cadastrado, mensagem_completa)
            return false
        }

        // DADOS DO USUÁRIO E REGISTRO
        let usuarioRegistrado = await usuarios.verificarRegistro(remetente)
        if(!usuarioRegistrado) await usuarios.registrarUsuario(remetente, nome_usuario, botInfo)
        if(mensagem_dono) await usuarios.verificarDono(remetente, botInfo)
        // OBTENDO DADOS ATUALIZADOS DO USUÁRIO
        const dadosUsuario = await usuarios.obterDadosUsuario(remetente)

        //SE O CONTADOR TIVER ATIVADO E FOR UMA MENSAGEM DE GRUPO, VERIFICA SE O USUARIO EXISTE NO CONTADOR , REGISTRA ELE E ADICIONA A CONTAGEM
        if(mensagem_grupo && grupo?.contador.status) {
            await grupos.verificarRegistrarContagemParticipante(id_grupo, remetente)
            await grupos.adicionarContagemParticipante(id_grupo, remetente, tipo)
        }

        //SE FOR BLOQUEADO RETORNE
        if (usuarioBloqueado) return false
        //SE O PV DO BOT NÃO ESTIVER LIBERADO
        if(!mensagem_grupo && !mensagem_dono && !botInfo.pvliberado) return false
        //SE O GRUPO ESTIVER COM O RECURSO 'MUTADO' LIGADO E USUARIO NÃO FOR ADMINISTRADOR
        if(mensagem_grupo && !usuario_admin && grupo?.mutar) return false
        //SE FOR MENSAGEM DE GRUPO, O BOT NÃO FOR ADMIN E ESTIVER COM RESTRIÇÃO DE MENSAGENS PARA ADMINS
        if(mensagem_grupo && !bot_admin && grupo?.restrito_msg) return false

        //SE O USUÁRIO MANDAR MENSAGEM NO PV E AINDA NÃO TIVER RECEBIDO A MENSAGEM DE BOAS VINDAS, ENVIE.
        if(!mensagem_grupo && !dadosUsuario.recebeuBoasVindas && botInfo.pvliberado){
            await socket.enviarTexto(c, id_chat, criarTexto(msgs_texto.geral.usuario_novo, nome_bot?.trim(), nome_usuario), mensagem_completa)
            await usuarios.recebeuBoasVindas(remetente)
        }

        //ENVIE QUE LEU A MENSAGEM
        await socket.lerMensagem(c, id_chat, remetente, id_mensagem)
        //ATUALIZE NOME DO USUÁRIO 
        await usuarios.atualizarNome(remetente, nome_usuario)

        //SE FOR VISUALIZACAO UNICA E O AUTO REVELAR ESTIVER ATIVO E TIVER UM NUMERO DE DONO JÁ CADASTRADO
        if(mensagem_vunica && botInfo.autorevelar && botInfo.numero_dono){
            await bot.redirecionarMensagemRevelada(c, mensagemBaileys, botInfo)
        }

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //VERIFICAR SE ESTÁ USANDO O COMANDO NO GRUPO E EM UMA MENSAGEM COM VISUALIZACAO UNICA
            if(!mensagem_dono && mensagem_grupo && (mensagem_vunica || citacao?.mensagem_vunica)){
                await socket.responderTexto(c, id_chat, msgs_texto.geral.visualizacao_unica, mensagem_completa)
                return false
            }
            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfo.limitecomandos.status){
                let limiteComando = await bot.verificarLimiteComando(remetente, dadosUsuario.tipo, usuario_admin, botInfo)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await socket.responderTexto(c,id_chat, limiteComando.msg, mensagem_completa)
                    return false
                }
            }
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await bot.verificarComandosBloqueadosGlobal(comando, botInfo, prefixo) && !mensagem_dono){
                await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.admin.bcmdglobal.resposta_cmd_bloqueado, comando), mensagem_completa)
                return false
            }
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(mensagem_grupo && await grupos.verificarComandosBloqueadosGrupo(comando, grupo, prefixo) && !usuario_admin) {
                await socket.responderTexto(c,id_chat,criarTexto(msgs_texto.grupo.bcmd.resposta_cmd_bloqueado, comando), mensagem_completa)
                return false
            }
            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfo.limite_diario.status){
                if(!lista_comandos.excecoes_contagem.includes(comando) && !lista_comandos.admin.includes(comando) && !lista_comandos.grupo.includes(comando) && !lista_comandos.info.includes(comando) && !msgGuia){
                    await bot.verificarExpiracaoLimite(botInfo)
                    let ultrapassou = await usuarios.verificarUltrapassouLimiteComandos(remetente)
                    if(!ultrapassou) {
                        await usuarios.adicionarContagemDiariaComandos(remetente) 
                    } else {
                        await socket.responderTexto(c, id_chat, criarTexto(msgs_texto.admin.limitediario.resposta_excedeu_limite, nome_usuario, numero_dono.replace("@s.whatsapp.net", "")), mensagem_completa)
                        return false
                    }   
                } else {
                    await usuarios.adicionarContagemTotalComandos(remetente)
                    await bot.verificarExpiracaoLimite(botInfo)
                }
            } else {
                await usuarios.adicionarContagemTotalComandos(remetente)
            }
            //ADICIONA A CONTAGEM DE COMANDOS EXECUTADOS PELO BOT
            await bot.atualizarComandosFeitos()
        }

        return true
    } catch (err) {
        err.message = `checagemMensagem - ${err.message}`
        throw err
    }
}
