import Datastore from '@seald-io/nedb'
import {MessageTypes} from '../baileys/mensagem.js'
import moment from "moment-timezone"

const db = {
    grupos : new Datastore({filename : './dados/grupos.db', autoload: true}),
    contador : new Datastore({filename : './dados/contador.db', autoload: true})
}

async function Grupo(id_grupo, dados){
    const 
    ID_GRUPO = id_grupo,
    NOME = dados.nome,
    DESCRICAO = dados.descricao,
    PARTICIPANTES = dados.participantes,
    ADMINS = dados.admins,
    DONO = dados.dono,
    RESTRITO_MSG = dados.restrito,
    MUTAR = false,
    BEMVINDO = {status: false, msg : ''},
    ANTIFAKE = {status: false, ddi_liberados: []},
    ANTILINK = false,
    ANTIFLOOD = {status: false, max: 10, intervalo: 10, msgs: []},
    AUTOSTICKER = false,
    CONTADOR = {status: false, inicio : ''},
    BLOCK_CMDS = [],
    LISTA_NEGRA = []

    return {
        id_grupo : ID_GRUPO,
        nome : NOME,
        descricao : DESCRICAO,
        participantes: PARTICIPANTES,
        admins: ADMINS,
        dono: DONO,
        restrito_msg: RESTRITO_MSG,
        mutar: MUTAR,
        bemvindo: BEMVINDO,
        antifake: ANTIFAKE,
        antilink: ANTILINK,
        antiflood: ANTIFLOOD,
        autosticker: AUTOSTICKER,
        contador: CONTADOR,
        block_cmds: BLOCK_CMDS,
        lista_negra: LISTA_NEGRA
    }
}

//### GERAL
export const verificarGrupo = async(id_grupo) =>{
    let resp = await db.grupos.findOneAsync({id_grupo})
    return (resp != null)
}

export const registrarGrupo = async(id_grupo, dados)=>{
    await db.grupos.insertAsync(await Grupo(id_grupo, dados))
}

export const obterGrupo = async(id_grupo)=>{
    let grupo_info = await db.grupos.findOneAsync({id_grupo})
    return grupo_info
}

export const removerGrupo = async(id_grupo)=>{
    await db.grupos.removeAsync({id_grupo}, {multi: true})
}

export const obterTodosGrupos = async()=>{
    let grupos = await db.grupos.findAsync({})
    return grupos
}

//###

// ### PARTICIPANTES 
export const obterParticipantesGrupo = async (id_grupo)=>{
    let grupo = await db.grupos.findOneAsync({id_grupo})
    if(grupo == null) return false
    return grupo.participantes
}

export const obterAdminsGrupo = async (id_grupo)=>{
    let grupo = await db.grupos.findOneAsync({id_grupo})
    if(grupo == null) return false
    return grupo.admins
}

export const obterDonoGrupo = async (id_grupo)=>{
    let grupo = await db.grupos.findOneAsync({id_grupo})
    if(grupo == null) return false
    return grupo.dono
}

export const obterStatusRestritoMsg = async (id_grupo)=>{
    let grupo = await db.grupos.findOneAsync({id_grupo})
    if(grupo == null) return false
    return grupo.restrito_msg
}

export const atualizarGrupo = async(id_grupo, dados)=>{  
    await db.grupos.updateAsync({id_grupo}, {$set: {
        nome: dados.titulo,
        descricao: dados.descricao,
        participantes: dados.participantes,
        admins: dados.admins,
        dono: dados.dono,
        restrito_msg: dados.restrito
    }})
}

export const atualizarNomeGrupo = async(id_grupo, nome)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{nome}})
}

export const atualizarRestritoGrupo = async(id_grupo, restrito_msg)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{restrito_msg}})
}

export const adicionarParticipante = async(id_grupo, participante)=>{ 
    await db.grupos.updateAsync({id_grupo}, {$push: { participantes: participante} })
}

export const adicionarAdmin = async(id_grupo, participante)=>{ 
    await db.grupos.updateAsync({id_grupo}, {$push: { admins: participante} })
}

export const removerParticipante = async(id_grupo, participante)=>{   
    await db.grupos.updateAsync({id_grupo}, { $pull: { participantes : participante } })
}

export const removerAdmin = async(id_grupo, participante)=>{   
    await db.grupos.updateAsync({id_grupo}, { $pull: { admins : participante } })
}

export const participanteExiste = async (id_grupo, id_usuario)=>{
    let grupo = await db.grupos.findOneAsync({id_grupo})
    return (grupo != null && grupo.participantes.includes(id_usuario))
}

export const verificarAdmin = async (id_grupo, id_usuario)=>{
    let grupo = await db.grupos.findOneAsync({id_grupo})
    return (grupo != null && grupo.admins.includes(id_usuario))
}

//###

//### ALTERAR RECURSOS
export const alterarBemVindo = async(id_grupo, status, msg)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{"bemvindo.status": status, "bemvindo.msg":msg}})
}

export const alterarAntiFake = async(id_grupo, status, ddi)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{"antifake.status": status, "antifake.ddi_liberados": ddi}})
}

export const alterarMutar = async(id_grupo, status)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{mutar: status}})
}

export const alterarAntiLink = async(id_grupo, status)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{antilink: status}})
}

export const alterarAutoSticker = async(id_grupo, status)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{autosticker: status}})
}

export const alterarContador = async(id_grupo, status)=>{
    let data_atual = (status) ? moment(moment.now()).format("DD/MM HH:mm:ss") : ''
    await db.grupos.updateAsync({id_grupo}, {$set:{"contador.status":status, "contador.inicio":data_atual}})
}

export const alterarAntiFlood = async(id_grupo, status = true, max, intervalo)=>{
    await db.grupos.updateAsync({id_grupo}, {$set:{'antiflood.status':status, 'antiflood.max': max, 'antiflood.intervalo': intervalo}})
}

//### LISTA NEGRA
export const obterListaNegra  = async (id_grupo)=>{
    let {lista_negra}= await db.grupos.findOneAsync({id_grupo})
    return lista_negra
}

export const adicionarListaNegra = async(id_grupo, id_usuario)=>{
    await db.grupos.updateAsync({id_grupo}, {$push: { lista_negra: id_usuario } })
}

export const removerListaNegra = async(id_grupo, id_usuario)=>{
    await db.grupos.updateAsync({id_grupo}, {$pull: { lista_negra: id_usuario } } )
}
//###

//### ANTIFLOOD GRUPO
export const addMsgFlood = async(id_grupo, usuario_msg)=>{
    try{
        let grupo_info = await db.grupos.findOneAsync({id_grupo}), timestamp_atual = Math.round(new Date().getTime()/1000),  resposta = false
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
                resposta = true
            } else{
                resposta = false
            }
        } else {
            //ADICIONA O USUARIO NA LISTA
            grupo_info.antiflood.msgs.push({
                id_usuario: usuario_msg,
                expiracao: timestamp_atual + grupo_info.antiflood.intervalo,
                qtd: 1
            })
            resposta = false
        }

        //ATUALIZAÇÃO E RETORNO
        await db.grupos.updateAsync({id_grupo}, {$set: {'antiflood.msgs': grupo_info.antiflood.msgs}})
        return resposta
    } catch(err){
        throw new Error(err)
    }
}
//###

//### BLOQUEIO DE COMANDOS
export const addBlockedCmd = async(id_grupo, cmds)=>{
    db.grupos.updateAsync({id_grupo}, {$push: { block_cmds: {$each: cmds} }})
}

export const removeBlockedCmd = async(id_grupo, cmds)=>{
    for(let cmd of cmds){
        await db.grupos.updateAsync({id_grupo}, {$pull:{block_cmds: cmd}})
    }
}
//###

//##################### FUNCOES CONTADOR #########################
export const registrarContagemTodos =async(id_grupo,usuarios)=>{
    for(let usuario of usuarios){
        let id_unico = `${id_grupo}-${usuario}`
        await db.contador.insertAsync({id_grupo,id_usuario: usuario, id_unico, msg:0,imagem:0,audio:0,sticker:0,video:0,outro:0,texto:0})
    }
}

export const verificarRegistrarContagem = async(id_grupo,id_usuario)=>{
    let id_unico = `${id_grupo}-${id_usuario}`
    let contador = await db.contador.findOneAsync({id_unico})
    if(!contador) await db.contador.insertAsync({id_grupo,id_usuario,id_unico,msg:0,imagem:0,audio:0,sticker:0,video:0,outro:0,texto:0})
}

export const registrarContagem = async(id_grupo,id_usuario)=>{
    let id_unico = `${id_grupo}-${id_usuario}`
    await db.contador.insertAsync({id_grupo,id_usuario,id_unico,msg:0,imagem:0,audio:0,sticker:0,video:0,outro:0,texto:0}) 
}

export const addContagem = async(id_grupo,id_usuario,tipo_msg)=>{
    switch(tipo_msg){
        case MessageTypes.text :
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, texto: 1}})
            break
        case MessageTypes.extendedText:
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, texto: 1}})
            break
        case MessageTypes.image:
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, imagem: 1}})
            break
        case MessageTypes.video:
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, video: 1}})
            break
        case MessageTypes.sticker:
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, sticker: 1}})
            break
        case MessageTypes.audio:
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, audio: 1}})
            break
        case MessageTypes.document:
            db.contador.updateAsync({id_grupo,id_usuario}, {$inc:{msg: 1, outro: 1}})
            break    
    }
}

export const obterAtividade = async(id_grupo,id_usuario)=>{
    let atividade = await db.contador.findOneAsync({id_grupo,id_usuario})
    return atividade
}

export const obterUsuariosInativos = async(id_grupo,min)=>{
    min = parseInt(min)
    let usuarios_inativos = await db.contador.findAsync({id_grupo, msg: {$lt: min}}).sort({msg: -1})
    return usuarios_inativos
}

export const obterUsuariosAtivos = async(id_grupo) =>{
    let usuarios_ativos = await db.contador.findAsync({id_grupo}).sort({msg: -1})
    return usuarios_ativos
}

export const obterTodasContagensGrupo = async(id_grupo)=>{
    let contagens = await db.contador.findAsync({id_grupo})
    return contagens
}

export const removerContagem = async(id_grupo,id_usuario)=>{
    await db.contador.removeAsync({id_grupo,id_usuario})
}

export const removerContagemGrupo = async(id_grupo)=>{
    await db.contador.removeAsync({id_grupo}, {multi: true})
}