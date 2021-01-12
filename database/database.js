const { AsyncNedb } = require('nedb-async')
var db = {}
db.usuarios = new AsyncNedb({filename : './database/db/usuarios.db'})
db.grupos = new AsyncNedb({filename : './database/db/grupos.db'})
const max_comandos_dia = 20

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
    registrarUsuarioComum : async(id_usuario,nome) =>{
        var cadastro_usuario = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia,
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
    definirLimite: async(id_usuario, limite)=>{
        db.usuarios.asyncUpdate({id_usuario}, {$set: {max_comandos_dia: limite}}, {upsert: true})
    },
    resetarComandosDia: async() =>{
        db.usuarios.asyncUpdate({tipo:"comum"}, {$set:{comandos_dia : 0}}, {multi: true, upsert: true})
        db.usuarios.asyncUpdate({tipo:"vip"}, {$set:{comandos_dia : 0}}, {multi: true, upsert: true})
        db.usuarios.asyncUpdate({tipo:"dono"}, {$set:{comandos_dia : 0}}, {multi: true, upsert: true})
    }

    // ############### FUNCOES GRUPO #########################
}