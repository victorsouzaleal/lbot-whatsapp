const db = require('../database/database')
const path = require("path")

module.exports = recarregarContagem = async(client)=>{
    try{
        const msgs_texto = require(path.resolve("lib/msgs.js"))
        let grupos = await client.getAllGroups()
        for (let grupo of grupos){
            let g_info = await db.obterGrupo(grupo.id)
            if(g_info != null){
                if(g_info.contador.status){
                    let contagens = await db.obterTodasContagensGrupo(grupo.id)
                    let membros_grupo = await client.getGroupMembers(grupo.id)
                    //ADICIONANDO NA CONTAGEM QUEM ENTROU NO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let membro of membros_grupo){
                        if(contagens.find(contagem => contagem.id_usuario == membro.id) == undefined) await db.registrarContagem(grupo.id,membro.id)
                    }
                    //REMOVENDO DA CONTAGEM QUEM SAIU DO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let contagem of contagens){
                        if(membros_grupo.find(membro => membro.id == contagem.id_usuario) == undefined) await db.removerContagem(grupo.id,contagem.id_usuario)
                    }
                }       
            }
        }
        return msgs_texto.inicio.contagem_recarregada
    } catch(err) {
        throw new Error("Erro no recarregarContagem")
    }
}