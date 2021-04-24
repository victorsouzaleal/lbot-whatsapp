const db = require('./database')
const {botVerificarCampos} = require("./bot")
const {verificarCamposEnv} = require("./env")
const msgs_texto = require("./msgs")

module.exports = {
    atualizadorCamposGrupos : async()=>{
        try{
            await db.verificarCamposGrupos()
            return msgs_texto.inicio.dbgrupos_verificado
        } catch(err){
            throw new Error("Erro no atualizadorCampos - Grupos")
        }
    },

    atualizadorCamposBot: async()=>{
        try{
            await botVerificarCampos()
            return msgs_texto.inicio.dbbot_verificado
        } catch(err){
            throw new Error("Erro no atualizadorCampos - Bot")
        }
    },

    atualizadorCamposEnv: async()=>{
        try{
            var reiniciar = await verificarCamposEnv()
            return reiniciar
        } catch(err){
            throw new Error("Erro no atualizadorCampos - Env")
        }
    },

    atualizadorCamposUsuarios : async()=>{
        try{
            await db.verificarCamposUsuarios()
            return msgs_texto.inicio.dbusuarios_verificado
        } catch(err){
            throw new Error("Erro no atualizadorCampos - Usuarios")
        }
    },
}