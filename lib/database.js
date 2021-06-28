const Datastore = require('nedb-promises')
const {MessageTypes} = require("@open-wa/wa-automate")
const path = require('path')
const fs = require('fs-extra')
const moment = require("moment-timezone")
var db = {}
db.usuarios = new Datastore({filename : './database/db/usuarios.db', autoload: true})
db.grupos = new Datastore({filename : './database/db/grupos.db', autoload: true})
db.contador = new Datastore({filename : './database/db/contador.db', autoload: true})


module.exports = {
    // ######################## FUNCOES USUARIO #####################
    obterUsuario : async (id_usuario) =>{
        let usuario = await db.usuarios.findOne({id_usuario : id_usuario})
        return usuario
    },
    obterUsuariosTipo : async (tipo) =>{
        let usuarios = await db.usuarios.find({tipo})
        return usuarios
    },
    verificarRegistro  : async (id_usuario) => {
        let resp = await db.usuarios.findOne({id_usuario})
        return (resp != null)
    },
    atualizarNome : async(id_usuario,nome) =>{
        await db.usuarios.update({id_usuario}, {$set:{nome}})
    },

    registrarUsuario: async(id_usuario, nome) =>{
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        var cadastro_usuario = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia : limite_diario.limite_tipos.bronze,
            tipo: "bronze"
        }
        await db.usuarios.insert(cadastro_usuario)
    },
    registrarDono: async(id_usuario, nome)=>{
        var cadastro_usuario_dono = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia : null,
            tipo: "dono"
        }
        await db.usuarios.insert(cadastro_usuario_dono)
    },

    verificarDonoAtual : async(id_usuario)=>{
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        var usuario = await db.usuarios.findOne({id_usuario, tipo: "dono"})
        if(!usuario){
            await db.usuarios.update({tipo: "dono"}, {$set:{tipo: "bronze",  max_comandos_dia : limite_diario.limite_tipos.bronze}}, {multi: true})
            await db.usuarios.update({id_usuario}, {$set: {tipo : "dono", max_comandos_dia: null}})
        }
    },

    alterarTipoUsuario: async(id_usuario, tipo)=>{
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        if(limite_diario.limite_tipos[tipo] || limite_diario.limite_tipos[tipo] == null){
            await db.usuarios.update({id_usuario}, {$set: {tipo, max_comandos_dia: limite_diario.limite_tipos[tipo]}})
            return true
        } else {
            return false
        }
    },

    limparTipo: async(tipo)=>{
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        if(limite_diario.limite_tipos[tipo] === undefined || tipo === "bronze") return false
        await db.usuarios.update({tipo}, {$set: {tipo: "bronze", max_comandos_dia: limite_diario.limite_tipos.bronze}}, {multi: true})
        return true
    },
    ultrapassouLimite: async(id_usuario)=>{
        let usuario =  await db.usuarios.findOne({id_usuario : id_usuario})
        if(usuario.max_comandos_dia == null) return false
        return (usuario.comandos_dia >= usuario.max_comandos_dia)
    },
    addContagemDiaria: async(id_usuario)=>{
        db.usuarios.update({id_usuario}, {$inc: {comandos_total: 1, comandos_dia: 1}})
    },
    addContagemTotal: async(id_usuario)=>{
        db.usuarios.update({id_usuario}, {$inc: {comandos_total: 1}})
    },
    definirLimite: async(tipo, limite)=>{
        db.usuarios.update({tipo}, {$set: {max_comandos_dia: limite}}, {multi: true})
    },
    resetarComandosDia: async() =>{
        db.usuarios.update({}, {$set:{comandos_dia : 0}}, {multi: true})
    },
    resetarComandosDiaUsuario: async(id_usuario) =>{
        db.usuarios.update({id_usuario}, {$set:{comandos_dia : 0}})
    },
    //###########################################################

    //##################### FUNCOES GRUPO #########################

    //### GERAL
    verificarGrupo: async(id_grupo) =>{
        let resp = await db.grupos.findOne({id_grupo})
        return (resp != null)
    },

    registrarGrupo: async(id_grupo, participantes)=>{
        let cadastro_grupo = {
            id_grupo,
            participantes,
            mutar: false,
            bemvindo: {status: false, msg: ""},
            antifake: {status: false, ddi_liberados:[]},
            antilink: {status: false, filtros:{youtube: false, whatsapp:false, facebook:false, twitter:false}},
            antitrava: {status: false, max_caracteres: 0},
            antiflood: false,
            antiporno: false,
            autosticker: false,
            voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
            contador: {status:false, inicio: ''},
            enquete: {status: false, pergunta: "", opcoes: []},
            block_cmds: [],
            lista_negra: []
        }
        await db.grupos.insert(cadastro_grupo)
    },
    resetarGrupos: async()=>{
        db.grupos.update({}, 
        {$set: {
        mutar: false,
        bemvindo: {status: false, msg:""},
        antifake: {status: false, ddi_liberados:[]},
        antilink: {status: false, filtros:{youtube: false, whatsapp:false, facebook:false, twitter:false}},
        antitrava: {status: false, max_caracteres: 0},
        antiflood: false,
        antiporno: false,
        autosticker: false,
        voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
        contador: {status:false, inicio: ''},
        enquete: {status: false, pergunta: "", opcoes: []},
        block_cmds: [],
        lista_negra: []
        }}, {multi: true})
    },
    obterGrupo: async(id_grupo)=>{
        let grupo_info = await db.grupos.findOne({id_grupo})
        return grupo_info
    },
    //###

    // ### PARTICIPANTES 
    obterParticipantesGrupo: async (id_grupo)=>{
        let grupo = await db.grupos.findOne({id_grupo})
        if(grupo == null) return false
        return grupo.participantes
    },
    atualizarParticipantes: async(id_grupo, participantes_array)=>{  
        await db.grupos.update({id_grupo}, {$set:{participantes: participantes_array}})
    },
    adicionarParticipante: async(id_grupo, participante)=>{ 
        await db.grupos.update({id_grupo}, {$push: { participantes: participante} })
    },
    removerParticipante: async(id_grupo, participante)=>{   
        await db.grupos.update({id_grupo}, { $pull: { participantes : participante } })
    },
    participanteExiste: async (id_grupo, id_usuario)=>{
        let grupo = await db.grupos.findOne({id_grupo})
        return (grupo != null && grupo.participantes.includes(id_usuario))
    },
    //###

    //### ALTERAR RECURSOS
    alterarBemVindo: async(id_grupo, status, msg = "")=>{
        await db.grupos.update({id_grupo}, {$set:{"bemvindo.status": status, "bemvindo.msg":msg}})
    },
    alterarAntiFake: async(id_grupo, status = true, ddi=[])=>{
        await db.grupos.update({id_grupo}, {$set:{"antifake.status": status, "antifake.ddi_liberados": ddi}})
    },
    alterarMutar: async(id_grupo, status = true)=>{
        await db.grupos.update({id_grupo}, {$set:{mutar: status}})
    },
    alterarAntiTrava: async(id_grupo, status = true, max = 1500)=>{
        await db.grupos.update({id_grupo}, {$set:{"antitrava.status": status, "antitrava.max_caracteres": max}})
    },
    alterarAntiLink: async(id_grupo, status = true, filtros = [])=>{
        let filtros_obj = {
            youtube: false,
            whatsapp: false,
            facebook: false,
            twitter: false
        }

        for(let filtro of filtros){
            if(filtro == "youtube") filtros_obj.youtube = true
            if(filtro == "whatsapp") filtros_obj.whatsapp = true
            if(filtro == "facebook") filtros_obj.facebook = true
            if(filtro == "twitter") filtros_obj.twitter = true
        }

        await db.grupos.update({id_grupo}, {$set:{"antilink.status": status, "antilink.filtros":filtros_obj}})
    },
    alterarAutoSticker: async(id_grupo, status = true)=>{
        await db.grupos.update({id_grupo}, {$set:{autosticker: status}})
    },

    alterarAntiPorno: async(id_grupo, status = true)=>{
        await db.grupos.update({id_grupo}, {$set:{antiporno: status}})
    },

    alterarContador: async(id_grupo, status = true)=>{
        let data_atual = (status) ? moment(moment.now()).format("DD/MM HH:mm:ss") : ''
        await db.grupos.update({id_grupo}, {$set:{"contador.status":status, "contador.inicio":data_atual}})
    },

    alterarAntiFlood: async(id_grupo, status = true, max = 10, intervalo=10)=>{
        db.grupos.update({id_grupo}, {$set:{antiflood:status}})
        let antifloodJson = JSON.parse(fs.readFileSync(path.resolve('database/json/antiflood.json')))
        if(status){
            antifloodJson.push({
                id_grupo: id_grupo,
                max: parseInt(max),
                intervalo : parseInt(intervalo),
                msgs : []
            })
        } else {
            antifloodJson.splice(antifloodJson.findIndex(item => item.id_grupo == id_grupo), 1)
        }
        fs.writeFileSync(path.resolve('database/json/antiflood.json'), JSON.stringify(antifloodJson))
    },

    alterarEnquete: async(id_grupo,status, pergunta= "", opcoes=[])=>{
        let opcoes_obj = []
        for(let i = 0 ; i < opcoes.length;i++){
            opcoes_obj.push({
                opcao: opcoes[i],
                digito: i+1,
                qtd_votos: 0,
                votos: []
            })
        }
        await db.grupos.update({id_grupo}, {$set:{"enquete.status":status, "enquete.pergunta":pergunta, "enquete.opcoes":opcoes_obj}})
    },

    //### ANTI-TRAVA
    obterDadosAntiTrava : async (id_grupo)=>{
        let {antitrava}= await db.grupos.findOne({id_grupo})
        return antitrava
    },

    //### LISTA NEGRA
    obterListaNegra : async (id_grupo)=>{
        let {lista_negra}= await db.grupos.findOne({id_grupo})
        return lista_negra
    },
    adicionarListaNegra: async(id_grupo, id_usuario)=>{
        await db.grupos.update({id_grupo}, {$push: { lista_negra: id_usuario } })
    },
    removerListaNegra: async(id_grupo, id_usuario)=>{
        await db.grupos.update({id_grupo}, {$pull: { lista_negra: id_usuario } } )
    },
    //###

    //### ANTIFLOOD GRUPO
    grupoInfoAntiFlood : (id_grupo)=>{
        let antifloodJson = JSON.parse(fs.readFileSync(path.resolve('database/json/antiflood.json'))), grupoIndex = antifloodJson.findIndex(item => item.id_grupo == id_grupo)
        return antifloodJson[grupoIndex]
    },
    addMsgFlood: async(id_grupo, usuario_msg)=>{
        try{
            let antifloodJson = JSON.parse(fs.readFileSync(path.resolve('database/json/antiflood.json'))), grupoIndex = antifloodJson.findIndex(item => item.id_grupo == id_grupo)
            let grupo_info = antifloodJson[grupoIndex], timestamp_atual = Math.round(new Date().getTime()/1000),  resposta = false
            //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
            for(let i = 0; i < grupo_info.msgs.length; i++){
                if(timestamp_atual >= grupo_info.msgs[i].expiracao) grupo_info.msgs.splice(i,1)
                 
            }
            //PESQUISA O INDICE DO USUARIO
            let usuarioIndex = grupo_info.msgs.findIndex(usuario=> usuario.id_usuario == usuario_msg)
            //SE O USUARIO JÁ ESTIVER NA LISTA
            if(usuarioIndex != -1){
                //INCREMENTA A CONTAGEM
                grupo_info.msgs[usuarioIndex].qtd++
                let max_msg = grupo_info.max
                if(grupo_info.msgs[usuarioIndex].qtd >= max_msg){
                    grupo_info.msgs.splice(usuarioIndex,1)
                    resposta = true
                } else{
                    resposta = false
                }
            } else {
                //ADICIONA O USUARIO NA LISTA
                grupo_info.msgs.push({
                    id_usuario: usuario_msg,
                    expiracao: timestamp_atual + grupo_info.intervalo,
                    qtd: 1
                })
                resposta = false
            }

            //ATUALIZAÇÃO DO JSON E RETORNO
            antifloodJson[grupoIndex] = grupo_info
            await fs.writeFileSync(path.resolve('database/json/antiflood.json'), JSON.stringify(antifloodJson))
            return resposta
        } catch(err){
            throw new Error(err)
        }
    },
    //###

    //### VOTEBAN
    alterarVoteban: async(id_grupo, status = true, max = 5, usuario = "")=>{
        db.grupos.update({id_grupo}, {$set:{"voteban.status":status, "voteban.max":max, "voteban.usuario":usuario, "voteban.votos":0, "voteban.votou":[]}})
    },

    addVoto: async(id_grupo, id_usuario)=>{
        db.grupos.update({id_grupo}, {$inc:{"voteban.votos": 1}})
        db.grupos.update({id_grupo}, {$push:{"voteban.votou": id_usuario}})
        let grupo_info_atualizado  = await db.grupos.findOne({id_grupo})
        return (grupo_info_atualizado.voteban.max == grupo_info_atualizado.voteban.votos)
    },
    //###

    //### BLOQUEIO DE COMANDOS
    addBlockedCmd: async(id_grupo, cmds)=>{
        db.grupos.update({id_grupo}, {$push: { block_cmds: {$each: cmds} }})
    },
    removeBlockedCmd: async(id_grupo, cmds)=>{
        for(let cmd of cmds){
            await db.grupos.update({id_grupo}, {$pull:{block_cmds: cmd}})
        }
    },
    //###


    // ### ENQUETE
    addVotoEnquete: async(id_grupo,id_usuario, digito)=>{
        let g_info = await db.grupos.findOne({id_grupo})
        let opcoes = g_info.enquete.opcoes
        let index = digito - 1
        let opcao = opcoes[index]
        opcao.qtd_votos = opcao.qtd_votos + 1
        opcao.votos.push(id_usuario)
        opcoes[index] = opcao
        db.grupos.update({id_grupo}, {$set:{"enquete.opcoes":opcoes}})
    },
    //###
    
    //##################### FUNCOES CONTADOR #########################
    registrarContagemTodos: async(id_grupo,usuarios)=>{
        for(let usuario of usuarios){
            let id_unico = `${id_grupo}-${usuario.id}`
            await db.contador.insert({id_grupo,id_usuario: usuario.id, id_unico, msg:0,imagem:0,gravacao:0,audio:0,sticker:0,video:0,outro:0,texto:0})
        }
    },
    existeUsuarioContador: async(id_grupo,id_usuario)=>{
        let id_unico = `${id_grupo}-${id_usuario}`
        let contador = await db.contador.findOne({id_unico})
        if(contador == null) {
            db.contador.insert({id_grupo,id_usuario,id_unico,msg:0,imagem:0,gravacao:0,audio:0,sticker:0,video:0,outro:0,texto:0})
        }

    },
    registrarContagem: async(id_grupo,id_usuario)=>{
        let id_unico = `${id_grupo}-${id_usuario}`
        db.contador.insert({id_grupo,id_usuario,id_unico,msg:0,imagem:0,gravacao:0,audio:0,sticker:0,video:0,outro:0,texto:0})
    },
    addContagem: async(id_grupo,id_usuario,tipo_msg)=>{
        switch(tipo_msg){
            case MessageTypes.TEXT:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, texto: 1}})
                break
            case MessageTypes.IMAGE:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, imagem: 1}})
                break
            case MessageTypes.VIDEO:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, video: 1}})
                break
            case MessageTypes.STICKER:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, sticker: 1}})
                break
            case MessageTypes.VOICE:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, gravacao: 1}})
                break
            case MessageTypes.AUDIO:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, audio: 1}})
                break
            case MessageTypes.DOCUMENT:
                db.contador.update({id_grupo,id_usuario}, {$inc:{msg: 1, outro: 1}})
                break    
        }
    },
    obterAtividade: async(id_grupo,id_usuario)=>{
        let atividade = await db.contador.findOne({id_grupo,id_usuario})
        return atividade
    },
    alterarContagemUsuario: async(id_grupo,id_usuario,qtd)=>{
        let resto = parseInt(qtd % 6)
        let msgs_cada = parseInt((qtd - resto)/6)
        await db.contador.update({id_grupo,id_usuario}, {$set:{msg:parseInt(qtd), texto:msgs_cada, imagem:msgs_cada, video:msgs_cada, sticker:msgs_cada, gravacao: msgs_cada, audio:msgs_cada, outro: resto }})
    },
    obterUsuariosInativos: async(id_grupo,min)=>{
        min = parseInt(min)
        let usuarios_inativos = await db.contador.find({id_grupo, msg: {$lt: min}},[ ["sort", {msg:-1}]])
        return usuarios_inativos
    },
    obterUsuariosAtivos: async(id_grupo, limite) =>{
        let usuarios_ativos = await db.contador.find({id_grupo}, [ ["sort", {msg:-1}] , ['limit', limite] ] )
        return usuarios_ativos
    },
    obterTodasContagensGrupo: async(id_grupo)=>{
        let contagens = await db.contador.find({id_grupo})
        return contagens
    },
    removerContagem: async(id_grupo,id_usuario)=>{
        await db.contador.remove({id_grupo,id_usuario})
    },
    removerContagemGrupo: async(id_grupo)=>{
        await db.contador.remove({id_grupo}, {multi: true})
    },
    // ###

    // ######################################################################
}