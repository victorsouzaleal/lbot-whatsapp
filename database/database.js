
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
        let usuario = await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        return usuario
    },
    obterUsuariosVip : async () =>{
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
        let {limite_diario_usuarios} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        var cadastro_usuario = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia : limite_diario_usuarios,
            tipo: "comum"
        }
        db.usuarios.loadDatabase()
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
        let {limite_diario_usuarios} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        if(tipo == "comum") db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia: limite_diario_usuarios}})
        if(tipo == "vip") db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia: null}})
    },
    limparVip: async()=>{
        let {limite_diario_usuarios} = JSON.parse(fs.readFileSync(path.resolve("database/json/bot.json")))
        db.usuarios.asyncUpdate({tipo : "vip"}, {$set: {tipo: "comum", max_comandos_dia:limite_diario_usuarios}}, {multi: true})
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
        db.usuarios.asyncUpdate({tipo:"comum"}, {$set:{comandos_dia : 0}}, {multi: true, upsert: true})
        db.usuarios.asyncUpdate({tipo:"vip"}, {$set:{comandos_dia : 0}}, {multi: true, upsert: true})
        db.usuarios.asyncUpdate({tipo:"dono"}, {$set:{comandos_dia : 0}}, {multi: true, upsert: true})
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
            antiflood: {status: false , max: 10, msgs: []},
            voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
            contador: {status:false, inicio: ''},
            enquete: {status: false, pergunta: "", opcoes: []},
            block_cmds: []
        }
        db.grupos.loadDatabase()
        await db.grupos.asyncInsert(cadastro_grupo)
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
        db.grupos.asyncUpdate({id_grupo}, {$set:{antilink: status}}, {upsert: true})
    },
    alterarContador: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        let data = new Date()
        let mes = data.getMonth()+1
        let dia = (data.getDate().toString().length == 1) ? `0${data.getDate()}` : data.getDate()
        mes = (mes.toString.length == 1) ? `0${mes}` : mes
        let minutos = (data.getMinutes().toString().length == 1) ? `0${data.getMinutes()}` : data.getMinutes()
        let segundos = (data.getSeconds().toString().length == 1) ? `0${data.getSeconds()}` : data.getSeconds()
        let data_atual = (status) ? `${dia}/${mes}/${data.getFullYear()} - ${data.getHours()}:${minutos}:${segundos}` : ''
        db.grupos.asyncUpdate({id_grupo}, {$set:{"contador.status":status, "contador.inicio":data_atual}})
    },
    alterarAntiFlood: async(id_grupo, status = true, max = 10)=>{
        db.grupos.loadDatabase()
        let arrayMsg = []
        if(status){
            for (let i = 0; i < max; i++){
                arrayMsg.push(`msg${i}`)
            }
        }
        db.grupos.asyncUpdate({id_grupo}, {$set:{"antiflood.status":status, "antiflood.max":max, "antiflood.msgs": arrayMsg}})
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
        let max_msg = grupo_info.antiflood.max
        await db.grupos.asyncUpdate({id_grupo}, {$pop: {"antiflood.msgs" : -1}})
        await db.grupos.asyncUpdate({id_grupo}, {$push: {"antiflood.msgs":usuario_msg}})
        let grupo_info_atualizado  = await db.grupos.asyncFindOne({id_grupo})
        let count = 0
        grupo_info_atualizado.antiflood.msgs.forEach(msg =>{
            if (msg == usuario_msg) count++
        })
        return count == max_msg
    },
    resetMsgFlood: async(id_grupo)=>{
        db.grupos.loadDatabase()
        let grupo_info = await db.grupos.asyncFindOne({id_grupo})
        let max_msg = grupo_info.antiflood.max
        let arrayMsg = []
        for (let i = 0; i < max_msg; i++){
            arrayMsg.push(`msg${i}`)
        }
        db.grupos.asyncUpdate({id_grupo}, {$set:{"antiflood.msgs": arrayMsg}})
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
    resetarGrupos: async()=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({}, 
        {$set: {
        bemvindo: {status: false, msg:""},
        antifake: false,
        antilink: false,
        antiflood: {status: false , max: 10, msgs: []},
        voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
        contador: {status:false, inicio: ''},
        enquete: {status: false, pergunta: "", opcoes: []},
        block_cmds: []
        }}, {multi: true})
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