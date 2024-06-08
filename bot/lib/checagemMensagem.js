//REQUERINDO MODULOS
import { criarTexto} from './util.js'
import * as socket from '../baileys/socket.js'
import {BotControle} from '../controles/BotControle.js'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import {comandosInfo, verificarComandoExiste} from '../comandos/comandos.js'


export const checagemMensagem = async (c, mensagemBaileys, botInfo) => {
    try {
        //Atribuição de valores
        const bot = new BotControle()
        const usuarios = new UsuarioControle()
        const grupos = new GrupoControle()
        const {prefixo, nome_bot} = botInfo
        const numero_dono = await usuarios.obterIdDono()
        const comandos_info = comandosInfo(botInfo)
        const {
            comando,
            args,
            remetente,
            mensagem_dono,
            mensagem_grupo,
            tipo,
            mensagem,
            id_chat,
            nome_usuario,
            id_mensagem,
            mensagem_vunica,
            grupo,
            citacao
        } = mensagemBaileys
        const {id_grupo, usuario_admin, bot_admin} = {...grupo}
        const msgGuia = (!args.length) ? false : args[0] === "guia"
        const usuariosBloqueados = await socket.obterContatosBloqueados(c)
        const usuarioBloqueado = usuariosBloqueados.includes(remetente)
        const comandoExiste = verificarComandoExiste(botInfo, comando)
        
        // Verificação se o usuário existe e se não existir faça o cadastro.
        let usuarioRegistrado = await usuarios.verificarRegistro(remetente)
        if(!usuarioRegistrado) await usuarios.registrarUsuario(remetente, nome_usuario)

        //Se não houver um usuário do tipo 'dono' e o comando for !admin, altere o tipo de quem fez o comando como dono.
        if(!numero_dono && comando == `${prefixo}admin`) {
            await usuarios.cadastrarDono(remetente)
            await socket.responderTexto(c, id_chat, comandos_info.outros.dono_cadastrado, mensagem)
            return false
        }

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
            await socket.enviarTexto(c, id_chat, criarTexto(comandos_info.outros.usuario_novo, nome_bot?.trim(), nome_usuario), mensagem)
            await usuarios.recebeuBoasVindas(remetente)
        }

        //ENVIE QUE LEU A MENSAGEM
        await socket.lerMensagem(c, id_chat, remetente, id_mensagem)
        //ATUALIZE NOME DO USUÁRIO 
        await usuarios.atualizarNome(remetente, nome_usuario)

        //SE FOR VISUALIZACAO UNICA E O AUTO REVELAR ESTIVER ATIVO E TIVER UM NUMERO DE DONO JÁ CADASTRADO
        if(mensagem_vunica && botInfo.autorevelar && numero_dono){
            await bot.redirecionarMensagemRevelada(c, mensagemBaileys, botInfo)
        }

        //SE FOR ALGUM COMANDO EXISTENTE
        if(comandoExiste){
            //VERIFICAR SE ESTÁ USANDO O COMANDO NO GRUPO E EM UMA MENSAGEM COM VISUALIZACAO UNICA
            if(!mensagem_dono && mensagem_grupo && (mensagem_vunica || citacao?.mensagem_vunica)){
                await socket.responderTexto(c, id_chat, comandos_info.outros.visualizacao_unica, mensagem)
                return false
            }
            //LIMITACAO DE COMANDO POR MINUTO
            if(botInfo.limitecomandos.status){
                let limiteComando = await bot.verificarLimiteComando(remetente, dadosUsuario.tipo, usuario_admin, botInfo)
                if(limiteComando.comando_bloqueado) {
                    if(limiteComando.msg != undefined) await socket.responderTexto(c,id_chat, limiteComando.msg, mensagem)
                    return false
                }
            }
            //BLOQUEIO GLOBAL DE COMANDOS
            if(await bot.verificarComandosBloqueadosGlobal(comando, botInfo, prefixo) && !mensagem_dono){
                await socket.responderTexto(c, id_chat, criarTexto(comandos_info.admin.bcmdglobal.msgs.resposta_cmd_bloqueado, comando), mensagem)
                return false
            }
            //SE FOR MENSAGEM DE GRUPO , COMANDO ESTIVER BLOQUEADO E O USUARIO NAO FOR ADMINISTRADOR DO GRUPO
            if(mensagem_grupo && await grupos.verificarComandosBloqueadosGrupo(comando, grupo, prefixo) && !usuario_admin) {
                await socket.responderTexto(c,id_chat,criarTexto(comandos_info.grupo.bcmd.msgs.resposta_cmd_bloqueado, comando), mensagem)
                return false
            }
            //SE O RECURSO DE LIMITADOR DIARIO DE COMANDOS ESTIVER ATIVADO E O COMANDO NÃO ESTIVER NA LISTA DE EXCEÇÔES/INFO/GRUPO/ADMIN
            if(botInfo.limite_diario.status){
                await bot.verificarExpiracaoLimite(botInfo)
                if(!verificarComandoExiste(botInfo, comando, 'admin') && !verificarComandoExiste(botInfo, comando, 'grupo') && !verificarComandoExiste(botInfo, comando, 'info') && !msgGuia){
                    let ultrapassou = await usuarios.verificarUltrapassouLimiteComandos(remetente, botInfo)
                    if(!ultrapassou) {
                        await usuarios.adicionarContagemDiariaComandos(remetente) 
                    } else {
                        await socket.responderTexto(c, id_chat, criarTexto(comandos_info.admin.limitediario.msgs.resposta_excedeu_limite, nome_usuario, numero_dono.replace("@s.whatsapp.net", "")), mensagem)
                        return false
                    }   
                } else {
                    await usuarios.adicionarContagemTotalComandos(remetente)
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
