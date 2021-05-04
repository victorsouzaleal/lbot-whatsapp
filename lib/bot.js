const path = require('path')
const fs = require("fs-extra")
const msgs_texto = require("./msgs")
const moment = require("moment-timezone")

module.exports = {
    botCriarArquivo : async ()=>{
        const bot = {
            nome:"LBOT",
            criador:"Leal",
            iniciado: 0,
            cmds_executados:0,
            autosticker: false,
            bloqueio_cmds:[],
            antitrava: {
                status: false,
                max_caracteres: 0
            },
            limite_diario:{
              status: false,
              expiracao: 0,
              limite_tipos: {
                  bronze : 25,
                  prata: 50,
                  ouro: 100,
                  vip: null
              }
            },
            limitarmensagens:{
              status:false,
              max: 10,
              intervalo: 10,
              msgs:[]
            },
            limitecomandos:{
              status: false,
              cmds_minuto_max: 5,
              tempo_bloqueio: 60,
              usuarios: [],
              usuarios_limitados: []
            }
        }
        await fs.writeFile(path.resolve("database/json/bot.json"), JSON.stringify(bot))
    },
    botInfoUpdate : ()=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        bot.cmds_executados = bot.cmds_executados + 1
        fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    },
    
    botInfo : ()=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        return bot
    },

    botStart : async ()=>{
        try{
            let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
            bot.iniciado = moment.now()
            await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
            return msgs_texto.inicio.dados_bot
        }catch(err){
            console.error(err)
            throw new Error("Erro no botStart")
        }
    },

    // * AUTO-STICKER PRIVADO
    botAlterarAutoSticker : async (status= true)=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        bot.autosticker = status
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    },

    // * ANTI-TRAVA PRIVADO
    botAlterarAntitrava: async(status = true, maxCaracteres = 1500)=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        bot.antitrava.status = status
        bot.antitrava.max_caracteres = maxCaracteres
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    },

    // * LIMITE DIARIO DE COMANDOS
    botQtdLimiteDiario : async (tipo, limite)=>{
        let db = require(path.resolve("lib/database.js"))
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        if(limite == -1) limite = null
        if(bot.limite_diario.limite_tipos[tipo] === undefined) return false
        bot.limite_diario.limite_tipos[tipo] = parseInt(limite)
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
        await db.definirLimite(tipo, parseInt(limite))
        return true
    },

    botAlterarLimiteDiario : async (status)=>{
        let db = require(path.resolve("lib/database.js"))
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        let timestamp_atual = Math.round(new Date().getTime()/1000)
        bot.limite_diario.expiracao = (status) ? timestamp_atual+86400 : 0
        bot.limite_diario.status = status
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
        if(status){
            for(var tipo in bot.limite_diario.limite_tipos){
                await db.definirLimite(tipo, parseInt(bot.limite_diario.limite_tipos[tipo]))
            }
        } else {
            await db.resetarComandosDia()
            for(var tipo in bot.limite_diario.limite_tipos){
                await db.definirLimite(tipo, null)
            }
        }
    },

    botVerificarExpiracaoLimite : async ()=>{
        let db = require(path.resolve("lib/database.js"))
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        let timestamp_atual = Math.round(new Date().getTime()/1000)
        if(timestamp_atual >= bot.limite_diario.expiracao){
            await db.resetarComandosDia()
            bot.limite_diario.expiracao = bot.limite_diario.expiracao + 86400
            await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
        } 
    },
    //

    // * LIMITE DE COMANDOS POR MINUTO
    botAlterarLimitador : async (status= true, cmds_minuto = 5, tempo_bloqueio= 60)=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        bot.limitecomandos.status = status
        bot.limitecomandos.cmds_minuto_max = cmds_minuto
        bot.limitecomandos.tempo_bloqueio = tempo_bloqueio
        bot.limitecomandos.usuarios = []
        bot.limitecomandos.usuarios_limitados = []
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    },

    botLimitarComando : async (usuario_id, tipo_usuario, isAdmin)=>{
        const {criarTexto} = require(path.resolve("lib/util.js"))
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json'))),timestamp_atual = Math.round(new Date().getTime()/1000), resposta = {}
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

        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot)) //ATUALIZA OS DADOS NO ARQUIVO E RETORNO
        return resposta
    },
    //

    // * LIMITE DE MENSAGENS NO PRIVADO
    botAlterarLimitarMensagensPv : async (status, max = 10, intervalo= 10)=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        bot.limitarmensagens.status = status
        bot.limitarmensagens.max = max
        bot.limitarmensagens.intervalo = intervalo
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    },

    botLimitarMensagensPv : async (usuario_msg,usuario_tipo)=>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json'))), timestamp_atual = Math.round(new Date().getTime()/1000), resposta = {}
        //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
        for(let i = 0; i < bot.limitarmensagens.msgs.length; i++){
            if(timestamp_atual >= bot.limitarmensagens.msgs[i].expiracao) bot.limitarmensagens.msgs.splice(i,1)
        }
        //SE O USUARIO NÃO FOR DO TIPO DONO RETORNE FALSO
        if(usuario_tipo == "dono") {
            resposta = {bloquear_usuario : false}
        } else {
            //PESQUISA O INDICE DO USUARIO
            let usuarioIndex = bot.limitarmensagens.msgs.findIndex(usuario=> usuario.id_usuario == usuario_msg)
            //SE O USUARIO JÁ ESTIVER NA LISTA
            if(usuarioIndex != -1){
                //INCREMENTA A CONTAGEM
                bot.limitarmensagens.msgs[usuarioIndex].qtd++
                let max_msg = bot.limitarmensagens.max
                if(bot.limitarmensagens.msgs[usuarioIndex].qtd >= max_msg){
                    bot.limitarmensagens.msgs.splice(usuarioIndex,1)
                    resposta = {
                        bloquear_usuario : true,
                        msg: msgs_texto.admin.limitarmsgs.resposta_usuario_bloqueado
                    }
                } else{
                    resposta = {bloquear_usuario : false}
                }
            } else {
                //ADICIONA O USUARIO NA LISTA
                bot.limitarmensagens.msgs.push({
                    id_usuario: usuario_msg,
                    expiracao: timestamp_atual + bot.limitarmensagens.intervalo,
                    qtd: 1
                })
                resposta = {bloquear_usuario : false}
            }
        }
        //ATUALIZAÇÃO DOS DADOS E RETORNO
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
        return resposta
    },
    //

    //BLOQUEIO DE COMANDOS
    botBloquearComando : async cmds =>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        for(let cmd of cmds){
            bot.bloqueio_cmds.push(cmd)
        }
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    },

    botDesbloquearComando : async cmds =>{
        let bot = JSON.parse(fs.readFileSync(path.resolve('database/json/bot.json')))
        for(let cmd of cmds){
            let index = bot.bloqueio_cmds.findIndex(cmd_block=> cmd_block == cmd)
            if(index != -1){
                bot.bloqueio_cmds.splice(index,1)
            }
        }
        await fs.writeFileSync(path.resolve('database/json/bot.json'), JSON.stringify(bot))
    }
}