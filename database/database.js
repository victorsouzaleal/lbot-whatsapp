const { dns } = require('googleapis/build/src/apis/dns')
const { AsyncNedb } = require('nedb-async')
var db = {}
db.usuarios = new AsyncNedb({filename : './database/db/usuarios.db'})
db.grupos = new AsyncNedb({filename : './database/db/grupos.db'})
const max_comandos_dia = 30

module.exports = {
    // ######################## FUNCOES USUARIO #####################
    obterUsuario : async (id_usuario) =>{
        let usuario = await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        return usuario
    },
    verificarRegistro  : async (id_usuario) => {
        db.usuarios.loadDatabase()
        let resp = await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        return (resp != null)
    },
    registrarUsuarioComum : async(id_usuario) =>{
        var cadastro_usuario = {
            id_usuario,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia,
            tipo: "comum"
        }
        db.usuarios.loadDatabase()
        await db.usuarios.asyncInsert(cadastro_usuario)
    },
    registrarDono: async(id_usuario)=>{
        var cadastro_usuario_dono = {
            id_usuario,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia : null,
            tipo: "dono"
        }
        db.usuarios.loadDatabase()
        await db.usuarios.asyncInsert(cadastro_usuario_dono)
    },
    alterarTipoUsuario: async(id_usuario, tipo)=>{
        if(tipo == "comum") db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia}}, {upsert: true})
        if(tipo == "vip") db.usuarios.asyncUpdate({id_usuario}, {$set: {tipo, max_comandos_dia: null}}, {upsert: true})
    },
    limparVip: async()=>{
        db.usuarios.asyncUpdate({tipo : "vip"}, {$set: {tipo: "comum", max_comandos_dia}}, {upsert: true})
    },
    ultrapassouLimite: async(id_usuario)=>{
        db.usuarios.loadDatabase()
        let usuario =  await db.usuarios.asyncFindOne({id_usuario : id_usuario})
        if(usuario.tipo == 'dono') return false
        if(usuario.tipo == 'vip') return false
        return (usuario.comandos_dia >= usuario.max_comandos_dia)
    },
    addContagem: async(id_usuario)=>{
        db.usuarios.loadDatabase()
        db.usuarios.asyncUpdate({id_usuario}, {$inc: {comandos_total: 1, comandos_dia: 1}})
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

    // ############### FUNCOES GRUPO #########################
    verificarGrupo: async(id_grupo) =>{
        db.grupos.loadDatabase()
        let resp = await db.grupos.asyncFindOne({id_grupo})
        return (resp != null)
    },
    registrarGrupo: async(id_grupo)=>{
        let cadastro_grupo = {
            id_grupo,
            bemvindo: false,
            antifake: false,
            antilink: false,
            antiflood: {status: false , max: 10, msgs: []},
            voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
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
    alterarBemVindo: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{bemvindo: status}}, {upsert: true})
    },
    alterarAntiFake: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{antifake: status}}, {upsert: true})
    },
    alterarAntiLink: async(id_grupo, status = true)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{antilink: status}}, {upsert: true})
    },
    alterarAntiFlood: async(id_grupo, status = true, max = 10)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$set:{"antiflood.status":status, "antiflood.max":max, "antiflood.msgs": []}})
    },
    addMsgFlood: async(id_grupo, usuario_msg)=>{
        db.grupos.loadDatabase()
        let grupo_info = await db.grupos.asyncFindOne({id_grupo})
        let qtd_msg_atuais = grupo_info.antiflood.msgs.length
        let max_msg = grupo_info.antiflood.max
        if(qtd_msg_atuais >= max_msg) {
            if(qtd_msg_atuais > max_msg) await db.grupos.asyncUpdate({id_grupo}, {$pop: {"antiflood.msgs" : 1}})
            await db.grupos.asyncUpdate({id_grupo}, {$pop: {"antiflood.msgs" : -1}})
        }
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
        db.grupos.asyncUpdate({id_grupo}, {$set:{"antiflood.msgs": []}})
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
        bemvindo: false,
        antifake: false,
        antilink: false,
        antiflood: {status: false , max: 10, msgs: []},
        voteban: {status: false, max: 5, usuario: "", votos:0, votou:[]},
        block_cmds: []
        }}, {multi: true})
    },
    addBlockedCmd: async(id_grupo, cmds)=>{
        db.grupos.loadDatabase()
        db.grupos.asyncUpdate({id_grupo}, {$push: { block_cmds: {$each: cmds} }})
    },
    removeBlockedCmd: async(id_grupo, cmds)=>{
        db.grupos.loadDatabase()
        cmds.forEach(async(cmd) =>{
            await db.grupos.asyncUpdate({id_grupo}, {$pull:{block_cmds: cmd}})
        })
    }
}