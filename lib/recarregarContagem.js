const db = require('../db-modules/database')
const path = require("path")
const socket = require("../lib-translate/socket-functions")
const socketdb = require("../lib-translate/socket-db-functions")

module.exports = recarregarContagem = async(groupsInfo)=>{
    try{
        const msgs_texto = require(path.resolve("lib/msgs.js"))
        for (let grupo of groupsInfo){
            let g_info = await socketdb.getGroupInfoFromDb(grupo.id)
            if(g_info != null){
                if(g_info.contador.status){
                    let contagens = await db.obterTodasContagensGrupo(grupo.id)
                    let membros_grupo = await socketdb.getGroupMembersIdFromDb(grupo.id)
                    //ADICIONANDO NA CONTAGEM QUEM ENTROU NO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let membroId of membros_grupo){
                        if(contagens.find(contagem => contagem.id_usuario == membroId) == undefined) await db.registrarContagem(grupo.id,membroId)
                    }
                    //REMOVENDO DA CONTAGEM QUEM SAIU DO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let contagem of contagens){
                        if(membros_grupo.find(membro => membro == contagem.id_usuario) == undefined) await db.removerContagem(grupo.id,contagem.id_usuario)
                    }
                }       
            }
        }
        return msgs_texto.inicio.contagem_recarregada
    } catch(err) {
        err.message = `recarregarContagem - ${err.message}`
        throw err
    }
}