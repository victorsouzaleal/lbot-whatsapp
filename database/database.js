
const { AsyncNedb } = require('nedb-async')
const path = require('path')
const fs = require('fs-extra')
var db = {}
db.usuarios = new AsyncNedb({filename : './database/db/usuarios.db'})
db.grupos = new AsyncNedb({filename : './database/db/grupos.db'})
db.contador = new AsyncNedb({filename : './database/db/contador.db'})

module.exports = {
    // ######################## FUNCOES USUARIO #####################
    obterUsuario : async (id_usuario) =>{
        db.usuarios.loadDatabase()
        let usuario = await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        return usuario
    },
    obterUsuariosVip : async () =>{
        db.usuarios.loadDatabase()
        let usuarios = await db.usuarios.asyncFind({tipo: "vip"})
        return usuarios
    },
    verificarRegistro  : async (id_usuario) => {
        db.usuarios.loadDatabase()
        let resp = await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        return (resp != null)
    },
    atualizarNome : async(id_usuario,nome) =>{
        db.usuarios.loadDatabase()
        await db.usuarios.asyncUpdate({id_usuario}, {$set:{nome}})
    },
    registrarUsuarioComum : async(id_usuario, nome) =>{
        db.usuarios.loadDatabase()
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        var cadastro_usuario = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia : limite_diario.qtd,
            tipo: "comum"
        }
        await db.usuarios.asyncInsert(cadastro_usuario)
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
        db.usuarios.loadDatabase()
        await db.usuarios.asyncInsert(cadastro_usuario_dono)
    },
    alterarTipoUsuario: async(id_usuario, tipo)=>{
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        if(tipo == "comum") db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia: limite_diario.qtd}})
        if(tipo == "vip") db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia: null}})
    },
    limparVip: async()=>{
        let {limite_diario} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        db.usuarios.asyncUpdate({tipo : "vip"}, {$set: {tipo: "comum", max_comandos_dia:limite_diario.qtd}}, {multi: true})
    },
    ultrapassouLimite: async(id_usuario)=>{
        db.usuarios.loadDatabase()
        let usuario =  await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        if(usuario.tipo == 'dono') return false
        if(usuario.tipo == 'vip') return false
        return (usuario.comandos_dia >= usuario.max_comandos_dia)
    },
    addContagemDiaria: async(id_usuario)=>{
        db.usuarios.loadDatabase()
        db.usuarios.asyncUpdate({id_usuario}, {$inc: {comandos_total: 1, comandos_dia: 1}})
    },
    addContagemTotal: async(id_usuario)=>{
        db.usuarios.loadDatabase()
        db.usuarios.asyncUpdate({id_usuario}, {$inc: {comandos_total: 1}})
    },
    definirLimite: async(limite)=>{
        db.usuarios.loadDatabase()
        db.usuarios.asyncUpdate({tipo: "comum"}, {$set: {max_comandos_dia: limite}}, {multi: true})
    },
    resetarComandosDia: async() =>{
        db.usuarios.loadDatabase()
        db.usuarios.asyncUpdate({}, {$set:{comandos_dia : 0}}, {multi: true})
    },
    resetarComandosDiaUsuario: async(id_usuario) =>{
        db.usuarios.loadDatabase()
        db.usuarios.asyncUpdate({id_usuario}, {$set:{comandos_dia : 0}})
    },
    //###########################################################

    // ############### FUNCOES GRUPO #########################
    verificarGrupo: async(id_grupo) =>{
        db.grupos.loadDatabase()
        let resp = await db.grupos.asyncFindOne({id_grupo})
        return (resp != null)
    },
    registrarGrupo: async(id_grupo)=>{
        let cadastro_grupo = {
            id_grupo,
            bemvindo: {status: false, msg: ""},
            antifake: false,
            antilink: false,
            antiflood: {status: false , max: 10, intervalo:10, msgs: []},
            voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
            contador: {status:false, inicio: ''},
            enquete: {status: false, pergunta: "", opcoes: []},
            block_cmds: []
        }
        db.grupos.loadDatabase()
        await db.grupos.asyncInsert(cadastro_grupo)
    },

    resetarGrupos: async()=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({}, 
        {$set: {
        bemvindo: {status: false, msg:""},
        antifake: false,
        antilink: false,
        antiflood: {status: false , max: 10, intervalo: 10, msgs: []},
        voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
        contador: {status:false, inicio: ''},
        enquete: {status: false, pergunta: "", opcoes: []},
        block_cmds: []
        }}, {multi: true})
    },

    obterGrupo: async(id_grupo)=>{
        db.grupos.loadDatabase()
        let grupo_info = await db.grupos.asyncFindOne({id_grupo})
        return grupo_info
    },
    alterarBemVindo: async(id_grupo, status, msg = "")=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{"bemvindo.status": status, "bemvindo.msg":msg}})
    },
    alterarAntiFake: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{antifake: status}}, {upsert: true})
    },
    alterarAntiLink: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{antilink: status}})
    },
    alterarContador: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        let data = new Date()
        let dia = `0${data.getDate()}`, mes = `0${data.getMonth()+1}`, horas = `0${data.getHours()}`, minutos = `0${data.getMinutes()}`, segundos = `0${data.getSeconds()}`
        let data_atual = (status) ? `${dia.substr(-2)}/${mes.substr(-2)}/${data.getFullYear()} - ${horas.substr(-2)}:${minutos.substr(-2)}:${segundos.substr(-2)}` : ''
        db.grupos.asyncUpdate({id_grupo}, {$set:{"contador.status":status, "contador.inicio":data_atual}})
    },
    alterarAntiFlood: async(id_grupo, status = true, max = 10, intervalo=10)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{"antiflood.status":status, "antiflood.max":parseInt(max), "antiflood.intervalo":parseInt(intervalo),"antiflood.msgs": []}})
    },
    alterarEnquete: async(id_grupo,status, pergunta= "", opcoes=[])=>{
        db.grupos.loadDatabase()
        let opcoes_obj = []
        for(let i = 0 ; i < opcoes.length;i++){
            opcoes_obj.push({
                opcao: opcoes[i],
                digito: i+1,
                qtd_votos: 0,
                votos: []
            })
        }
        db.grupos.asyncUpdate({id_grupo}, {$set:{"enquete.status":status, "enquete.pergunta":pergunta, "enquete.opcoes":opcoes_obj}})
    },

    //ANTIFLOOD GRUPO
    addMsgFlood: async(id_grupo, usuario_msg)=>{
        db.grupos.loadDatabase()
        let grupo_info = await db.grupos.asyncFindOne({id_grupo})
        let timestamp_atual = Math.round(new Date().getTime()/1000)

        //VERIFICA SE ALGUM MEMBRO JA PASSOU DO TEMPO DE TER AS MENSAGENS RESETADAS
        for(let i = 0; i < grupo_info.antiflood.msgs.length; i++){
            if(timestamp_atual >= grupo_info.antiflood.msgs[i].expiracao) grupo_info.antiflood.msgs.splice(i,1)
             
        }
        
        //PESQUISA O INDICE DO USUARIO
        let usuarioIndex = grupo_info.antiflood.msgs.findIndex(usuario=> usuario.id_usuario == usuario_msg)

        //SE O USUARIO JÁ ESTIVER NA LISTA
        if(usuarioIndex != -1){
            //INCREMENTA A CONTAGEM
            grupo_info.antiflood.msgs[usuarioIndex].qtd++
            let max_msg = grupo_info.antiflood.max
            if(grupo_info.antiflood.msgs[usuarioIndex].qtd >= max_msg){
                grupo_info.antiflood.msgs.splice(usuarioIndex,1)
                //ATUALIZAÇÃO DOS DADOS NO BANCO E RETORNO
                await db.grupos.asyncUpdate({id_grupo}, {$set: {"antiflood.msgs": grupo_info.antiflood.msgs}})
                return true
            } else{
                //ATUALIZAÇÃO DOS DADOS NO BANCO E RETORNO
                await db.grupos.asyncUpdate({id_grupo}, {$set: {"antiflood.msgs": grupo_info.antiflood.msgs}})
                return false
            }
        } else {
            //ADICIONA O USUARIO NA LISTA
            grupo_info.antiflood.msgs.push({
                id_usuario: usuario_msg,
                expiracao: timestamp_atual + grupo_info.antiflood.intervalo,
                qtd: 1
            })
            //ATUALIZAÇÃO DOS DADOS NO BANCO E RETORNO
            await db.grupos.asyncUpdate({id_grupo}, {$set: {"antiflood.msgs": grupo_info.antiflood.msgs}})
            return false
        }
    },

    alterarVoteban: async(id_grupo, status = true, max = 5, usuario = "")=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{"voteban.status":status, "voteban.max":max, "voteban.usuario":usuario, "voteban.votos":0, "voteban.votou":[]}})
    },

    addVoto: async(id_grupo, id_usuario)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$inc:{"voteban.votos": 1}})
        db.grupos.asyncUpdate({id_grupo}, {$push:{"voteban.votou": id_usuario}})
        let grupo_info_atualizado  = await db.grupos.asyncFindOne({id_grupo})
        return (grupo_info_atualizado.voteban.max == grupo_info_atualizado.voteban.votos)
    },

    //BLOQUEIO DE COMANDOS
    addBlockedCmd: async(id_grupo, cmds)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$push: { block_cmds: {$each: cmds} }})
    },
    removeBlockedCmd: async(id_grupo, cmds)=>{
        db.grupos.loadDatabase()
        cmds.forEach(async(cmd) =>{
            await db.grupos.asyncUpdate({id_grupo}, {$pull:{block_cmds: cmd}})
        })
    },

    //ENQUETE
    addVotoEnquete: async(id_grupo,id_usuario, digito)=>{
        db.grupos.loadDatabase()
        let g_info = await db.grupos.asyncFindOne({id_grupo})
        let opcoes = g_info.enquete.opcoes
        let index = digito - 1
        let opcao = opcoes[index]
        opcao.qtd_votos = opcao.qtd_votos + 1
        opcao.votos.push(id_usuario)
        opcoes[index] = opcao
        db.grupos.asyncUpdate({id_grupo}, {$set:{"enquete.opcoes":opcoes}})
    },

    //CONTADOR DE MENSAGENS
    registrarContagemTodos: async(id_grupo,usuarios)=>{
        db.contador.loadDatabase()
        usuarios.forEach(async (usuario)=>{
            await db.contador.asyncInsert({id_grupo,id_usuario: usuario.id ,msg:0,imagem:0,gravacao:0,audio:0,sticker:0,video:0,outro:0,texto:0})
        })
    },
    registrarContagem: async(id_grupo,id_usuario)=>{
        db.contador.loadDatabase()
        db.contador.asyncInsert({id_grupo,id_usuario,msg:0,imagem:0,gravacao:0,audio:0,sticker:0,video:0,outro:0,texto:0})
    },
    addContagem: async(id_grupo,id_usuario,tipo_msg)=>{
        db.contador.loadDatabase()
        switch(tipo_msg){
            case "chat":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, texto: 1}})
                break
            case "image":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, imagem: 1}})
                break
            case "video":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, video: 1}})
                break
            case "sticker":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, sticker: 1}})
                break
            case "ptt":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, gravacao: 1}})
                break
            case "audio":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, audio: 1}})
                break
            case "document":
                db.contador.asyncUpdate({id_grupo,id_usuario}, {$inc:{msg: 1, outro: 1}})
                break    
        }
    },
    obterAtividade: async(id_grupo,id_usuario)=>{
        db.contador.loadDatabase()
        let atividade = await db.contador.asyncFindOne({id_grupo,id_usuario})
        return atividade
    },
    alterarContagemUsuario: async(id_grupo,id_usuario,qtd)=>{
        db.contador.loadDatabase()
        let resto = parseInt(qtd % 6)
        let msgs_cada = parseInt((qtd - resto)/6)
        await db.contador.asyncUpdate({id_grupo,id_usuario}, {$set:{msg:parseInt(qtd), texto:msgs_cada, imagem:msgs_cada, video:msgs_cada, sticker:msgs_cada, gravacao: msgs_cada, audio:msgs_cada, outro: resto }})
    },
    obterUsuariosInativos: async(id_grupo,min)=>{
        db.contador.loadDatabase()
        min = parseInt(min)
        let usuarios_inativos = await db.contador.asyncFind({id_grupo, msg: {$lt: min}},[ ["sort", {msg:-1}]])
        return usuarios_inativos
    },
    obterUsuariosAtivos: async(id_grupo, limite) =>{
        db.contador.loadDatabase()
        let usuarios_ativos = await db.contador.asyncFind({id_grupo}, [ ["sort", {msg:-1}] , ['limit', limite] ] )
        return usuarios_ativos
    },
    obterTodasContagensGrupo: async(id_grupo)=>{
        db.contador.loadDatabase()
        let contagens = await db.contador.asyncFind({id_grupo})
        return contagens
    },
    removerContagem: async(id_grupo,id_usuario)=>{
        db.contador.loadDatabase()
        db.contador.asyncRemove({id_grupo,id_usuario})
    },
    removerContagemGrupo: async(id_grupo)=>{
        db.contador.loadDatabase()
        db.contador.asyncRemove({id_grupo}, {multi: true})
    },
    // ###############################################################################

}