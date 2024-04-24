import * as gruposdb from '../database/grupos.js'
import { obterMensagensTexto } from '../lib/msgs.js' 
import * as grupos from '../controle/gruposControle.js'

export const recarregarContagem = async(groupsInfo)=>{
    try{
        var msgs_texto = await obterMensagensTexto()
        for (let grupo of groupsInfo){
            let g_info = await grupos.obterGrupoInfo(grupo.id)
            if(g_info != null){
                if(g_info.contador.status){
                    let contagens = await gruposdb.obterTodasContagensGrupo(grupo.id)
                    let membros_grupo = await grupos.obterParticipantesGrupo(grupo.id)
                    //ADICIONANDO NA CONTAGEM QUEM ENTROU NO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let membroId of membros_grupo){
                        if(contagens.find(contagem => contagem.id_usuario == membroId) == undefined) await gruposdb.registrarContagem(grupo.id,membroId)
                    }
                    //REMOVENDO DA CONTAGEM QUEM SAIU DO GRUPO ENQUANTO O BOT ESTAVA OFF
                    for(let contagem of contagens){
                        if(membros_grupo.find(membro => membro == contagem.id_usuario) == undefined) await gruposdb.removerContagem(grupo.id,contagem.id_usuario)
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