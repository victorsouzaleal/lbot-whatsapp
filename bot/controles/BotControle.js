import {obterMensagensTexto} from '../lib/msgs.js'
import {listarComandos} from '../comandos/comandos.js'
import {consoleErro, criarTexto, corTexto} from '../lib/util.js'
import {Bot} from '../modelos/Bot.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'
import moment from "moment-timezone"
import * as socket from '../baileys/socket.js'
import {obterTipoDeMensagem} from '../baileys/mensagem.js'


export class BotControle{
    constructor(){
        this.bot = new Bot()
    }

    obterCaminhoJSON(){
        return this.bot.caminhoJSON
    }

    async inicializarBot(c, botInfo){
        try{
            let bot = botInfo
            bot.iniciado = moment.now()
            bot.hostNumber = await socket.obterNumeroHost(c)
            await this.bot.atualizarDados(bot)
            console.log("[BOT]", corTexto(obterMensagensTexto(bot).inicio.dados_bot))
        }catch(err){
            err.message = `botStart - ${err.message}`
            throw err
        }
    }

    async criarArquivo(){
        const bot = {
            iniciado: 0,
            nome_bot: "LBOT",
            nome_adm: "Leal",
            nome_pack: "LBOT Stickers",
            prefixo: "!",
            numero_dono:"",
            cmds_executados:0,
            autosticker: false,
            autorevelar: false,
            bloqueio_cmds:[],
            limite_diario:{
                status: false,
                expiracao: 0,
                limite_tipos: {
                    comum : 50,
                    premium: 100,
                    vip: null
                }
            },
            limitecomandos:{
                status: false,
                cmds_minuto_max: 5,
                tempo_bloqueio: 60,
                usuarios: [],
                usuarios_limitados: []
            },
            pvliberado: true
        }

        await this.bot.atualizarDados(bot)
    }

    async atualizarComandosFeitos(){
        await this.bot.atualizarComandos()
    }

    async obterInformacoesBot(){
        try{
            return await this.bot.obterDados()
        }catch{
            await this.criarArquivo()
            return await this.bot.obterDados()
        }
    }

    async verificarLimiteComando(usuario_id, tipo_usuario, isAdmin, botInfo){
        let bot = botInfo, timestamp_atual = Math.round(new Date().getTime()/1000), resposta = {}
        let msgs_texto = obterMensagensTexto(bot)
        //VERIFICA OS USUARIOS LIMITADOS QUE JÁ ESTÃO EXPIRADOS E REMOVE ELES DA LISTA
        for (let i = 0; i < bot.limitecomandos.usuarios_limitados.length; i++){
            if(bot.limitecomandos.usuarios_limitados[i].horario_liberacao <= timestamp_atual) bot.limitecomandos.usuarios_limitados.splice(i,1)
        }
        //VERIFICA OS USUARIOS QUE JÁ ESTÃO COM COMANDO EXPIRADOS NO ULTIMO MINUTO
        for (let i = 0; i < bot.limitecomandos.usuarios.length; i++){
            if(bot.limitecomandos.usuarios[i].expiracao <= timestamp_atual) bot.limitecomandos.usuarios.splice(i,1)
        }
        //SE NÃO FOR UM USUARIO DO TIPO DONO OU FOR ADMINISTRADOR DO GRUPO , NÃO FAÇA A CONTAGEM.
            if(tipo_usuario == "dono" || isAdmin){
            resposta = {comando_bloqueado : false}
        } else {
            //VERIFICA SE O USUARIO ESTÁ LIMITADO
            let usuarioIndexLimitado = bot.limitecomandos.usuarios_limitados.findIndex(usuario=> usuario.usuario_id == usuario_id)
            if(usuarioIndexLimitado != -1) {
                resposta = {comando_bloqueado : true}
            } else {
                //OBTEM O INDICE DO USUARIO NA LISTA DE USUARIOS
                let usuarioIndex = bot.limitecomandos.usuarios.findIndex(usuario=> usuario.usuario_id == usuario_id)
                //VERIFICA SE O USUARIO ESTÁ NA LISTA DE USUARIOS
                if(usuarioIndex != -1){
                    bot.limitecomandos.usuarios[usuarioIndex].cmds++ //ADICIONA A CONTAGEM DE COMANDOS ATUAIS
                    if(bot.limitecomandos.usuarios[usuarioIndex].cmds >= bot.limitecomandos.cmds_minuto_max){ //SE ATINGIR A QUANTIDADE MAXIMA DE COMANDOS POR MINUTO
                        //ADICIONA A LISTA DE USUARIOS LIMITADOS
                        bot.limitecomandos.usuarios_limitados.push({usuario_id, horario_liberacao: timestamp_atual + bot.limitecomandos.tempo_bloqueio})
                        bot.limitecomandos.usuarios.splice(usuarioIndex,1)
                        resposta = {
                            comando_bloqueado: true,
                            msg: criarTexto(msgs_texto.admin.limitecomandos.resposta_usuario_limitado, bot.limitecomandos.tempo_bloqueio)
                        }
                    } else { //SE NÃO ATINGIU A QUANTIDADE MÁXIMA DE COMANDOS
                        resposta = {comando_bloqueado: false}
                    }
                } else {//SE NÃO EXISTIR NA LISTA
                    bot.limitecomandos.usuarios.push({usuario_id, cmds: 1, expiracao: timestamp_atual+60})
                    resposta = {comando_bloqueado: false} 
                }
            }
        }
    
        await this.bot.atualizarDados(bot) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
        return resposta
    }

    async verificarExpiracaoLimite(botInfo){
        let bot = botInfo
        let timestamp_atual = Math.round(new Date().getTime()/1000)
        if(timestamp_atual >= bot.limite_diario.expiracao){
            await new UsuarioControle().resetarComandosDia()
            bot.limite_diario.expiracao = timestamp_atual + 86400
            await this.bot.atualizarDados(bot)
        } 
    }

    async bloquearComandos(comandos, botInfo){
        let bot = botInfo
        for(let cmd of comandos){
            bot.bloqueio_cmds.push(cmd)
        }
        await this.bot.atualizarDados(bot)
    }

    async desbloquearComandos(comandos, botInfo){
        let bot = botInfo
        for(let cmd of comandos){
            let index = bot.bloqueio_cmds.findIndex(cmd_block=> cmd_block == cmd)
            if(index != -1){
                bot.bloqueio_cmds.splice(index,1)
            }
        }
        await this.bot.atualizarDados(bot)
    }

    async bloquearComandosGlobal(usuarioComandos, botInfo){
        let {prefixo} = botInfo
        let listaComandos = listarComandos(prefixo)
        let msgs_texto = obterMensagensTexto(botInfo)
        let comandosBloqueados = [], respostaBloqueio = msgs_texto.admin.bcmdglobal.resposta_titulo
        let categorias = ['figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]

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
                if(botInfo.bloqueio_cmds.includes(comando.replace(prefixo, ''))){
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
                } else {
                    comandosBloqueados.push(comando.replace(prefixo, ''))
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
                }
            }         

        } else { 
            for(let comando of usuarioComandos){
                if(listaComandos.utilidades.includes(comando) || listaComandos.diversao.includes(comando) || listaComandos.figurinhas.includes(comando) || listaComandos.downloads.includes(comando)){
                    if(botInfo.bloqueio_cmds.includes(comando.replace(prefixo, ''))){
                        respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.ja_bloqueado, comando)
                    } else {
                        comandosBloqueados.push(comando.replace(prefixo, ''))
                        respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.bloqueado_sucesso, comando)
                    }
                } else if (listaComandos.grupo.includes(comando) || listaComandos.admin.includes(comando) || listaComandos.info.includes(comando) ){
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.erro, comando)
                } else {
                    respostaBloqueio += criarTexto(msgs_texto.admin.bcmdglobal.resposta_variavel.nao_existe, comando)
                }
            }
        }

        if(comandosBloqueados.length != 0) await this.bloquearComandos(comandosBloqueados, botInfo)
        return respostaBloqueio
    }

    async desbloquearComandosGlobal(usuarioComandos, botInfo){
        let {prefixo} = botInfo
        let listaComandos = listarComandos(prefixo)
        let msgs_texto = obterMensagensTexto(botInfo)
        let comandosDesbloqueados = [], respostaDesbloqueio = msgs_texto.admin.dcmdglobal.resposta_titulo
        let categorias = ['todos', 'figurinhas', 'utilidades', 'downloads', 'diversão'], primeiroComando = usuarioComandos[0]
        if(categorias.includes(primeiroComando)){
            let comandosCategoria = []
            switch(primeiroComando){
                case "todos":
                    comandosCategoria = botInfo.bloqueio_cmds
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
                if(botInfo.bloqueio_cmds.includes(comando.replace(prefixo, ''))) {
                    comandosDesbloqueados.push(comando.replace(prefixo, ''))
                    respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
                } else {
                    respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
                }
            }
        } else {
            for(let comando of usuarioComandos){
                if(botInfo.bloqueio_cmds.includes(comando.replace(prefixo, ''))) {
                    comandosDesbloqueados.push(comando.replace(prefixo, ''))
                    respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.desbloqueado_sucesso, comando)
                } else {
                    respostaDesbloqueio += criarTexto(msgs_texto.admin.dcmdglobal.resposta_variavel.ja_desbloqueado, comando)
                }
            }
        }

        if(comandosDesbloqueados.length != 0)  await this.desbloquearComandos(comandosDesbloqueados, botInfo)
        return respostaDesbloqueio
    }

    async verificarComandosBloqueadosGlobal(comando, botInfo){
        let {prefixo} = botInfo
        return botInfo.bloqueio_cmds.includes(comando.replace(prefixo, ''))
    }

    async redirecionarMensagemRevelada(c, mensagemBaileys, botInfo){
        try{
            const msgs_texto = obterMensagensTexto(botInfo)
            const {id : mensagemCompleta, username : nomeUsuario, sender, isGroupMsg, type} = mensagemBaileys
            const {grupoInfo} = mensagemBaileys.grupo
            const {numero_dono : numeroDono} = botInfo
            const numeroUsuario = sender.replace("@s.whatsapp.net", '')
            const nomeGrupo = isGroupMsg ? grupoInfo.nome : '----'
            const tipoMensagem = obterTipoDeMensagem(type)
            let mensagemVisivel = mensagemCompleta.message
            mensagemVisivel[type].viewOnce = false
            await socket.enviarTexto(c, numeroDono, criarTexto(msgs_texto.admin.autorevelar.restransmissao, nomeUsuario, numeroUsuario, nomeGrupo, tipoMensagem))
            await socket.retransmitirMensagem(c, numeroDono, mensagemVisivel)
        } catch(err){
            err.message = `redirecionarMensagemRevelada - ${err.message}`
            consoleErro(err, "AUTO-REVELAR")
        }
    }

    async obterNumeroBot(){
        let {hostNumber} = await this.obterInformacoesBot()
        return hostNumber
    }

    async obterNumeroDono(){
        let {numero_dono} = await this.obterInformacoesBot()
        return numero_dono
    }

    async alterarNumeroDono(numero, botInfo){
        let bot = botInfo
        bot.numero_dono = numero
        await this.bot.atualizarDados(bot)
    }

    async alterarPrefixo(prefixo, botInfo){
        let bot = botInfo
        bot.prefixo = prefixo
        await this.bot.atualizarDados(bot)
    }

    async alterarQtdLimiteDiarioTipo(tipo, limite, botInfo){
        let bot = botInfo
        if(limite == -1) limite = null
        if(bot.limite_diario.limite_tipos[tipo] === undefined) return false
        bot.limite_diario.limite_tipos[tipo] = parseInt(limite)
        await this.bot.atualizarDados(bot)
        await new UsuarioControle().alterarLimiteComandosTipo(tipo, parseInt(limite))
        return true
    }

    async alterarAutoSticker(status, botInfo){
        let bot = botInfo
        bot.autosticker = status
        await this.bot.atualizarDados(bot)
    }

    async alterarAutoRevelar(status, botInfo){
        let bot = botInfo
        bot.autorevelar = status
        await this.bot.atualizarDados(bot)
    }

    async alterarPvLiberado(status, botInfo){
        let bot = botInfo
        bot.pvliberado = status
        await this.bot.atualizarDados(bot)
    }

    async alterarLimiteDiario(status, botInfo){
        let bot = botInfo
        let timestamp_atual = Math.round(new Date().getTime()/1000)
        bot.limite_diario.expiracao = (status) ? timestamp_atual+86400 : 0
        bot.limite_diario.status = status
        await this.bot.atualizarDados(bot)
        if(status){
            for(let tipo in bot.limite_diario.limite_tipos){
                await new UsuarioControle().alterarLimiteComandosTipo(tipo, parseInt(bot.limite_diario.limite_tipos[tipo]))
            }
        } else {
            await new UsuarioControle().resetarComandosDia()
            for(let tipo in bot.limite_diario.limite_tipos){
                await new UsuarioControle().alterarLimiteComandosTipo(tipo, null)
            }
        }
    }

    async alterarLimitador(botInfo, status= true, cmds_minuto = 5, tempo_bloqueio= 60){
        let bot = botInfo
        bot.limitecomandos.status = status
        bot.limitecomandos.cmds_minuto_max = cmds_minuto
        bot.limitecomandos.tempo_bloqueio = tempo_bloqueio
        bot.limitecomandos.usuarios = []
        bot.limitecomandos.usuarios_limitados = []
        await this.bot.atualizarDados(bot)
    }

    async alterarNomeBot(nome, botInfo){
        let bot = botInfo
        bot.nome_bot = nome
        await this.bot.atualizarDados(bot)
    }

    async alterarNomeAdm(nome, botInfo){
        let bot = botInfo
        bot.nome_adm = nome
        await this.bot.atualizarDados(bot)
    }

    async alterarNomeFigurinhas(nome, botInfo){
        let bot = botInfo
        bot.nome_pack = nome
        await this.bot.atualizarDados(bot)
    }

}