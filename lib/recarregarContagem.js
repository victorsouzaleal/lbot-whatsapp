const db = require('../database/database')

module.exports = {
    recarregarContagem: async(client)=>{
        let grupos = await client.getAllGroups()
        grupos.forEach(async (grupo) =>{
            let g_info = await db.obterGrupo(grupo.id)
            if(g_info != null){
                if(g_info.contador.status){
                    let contagens = await db.obterTodasContagensGrupo(grupo.id)
                    let membros_grupo = await client.getGroupMembers(grupo.id)
                    //ADICIONANDO NA CONTAGEM QUEM ENTROU NO GRUPO ENQUANTO O BOT ESTAVA OFF
                    membros_grupo.forEach(async (membro) =>{
                        if(contagens.find(contagem => contagem.id_usuario == membro.id) == undefined) await db.registrarContagem(grupo.id,membro.id)
                    })
                    //REMOVENDO DA CONTAGEM QUEM SAIU DO GRUPO ENQUANTO O BOT ESTAVA OFF
                    contagens.forEach(async (contagem)=>{
                        if(membros_grupo.find(membro => membro.id == contagem.id_usuario) == undefined) await db.removerContagem(grupo.id,contagem.id_usuario)
                    })
                }       
            } else {
                console.log(`O grupo ${grupo.id} ainda não está registrado`)
            }
               
        })
        console.log("Todas as contagens foram recarregadas e novos membros foram adicionados/removidos.")
    }
}