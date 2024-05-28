import Datastore from '@seald-io/nedb'
const db = new Datastore({filename : './dados/usuarios.db', autoload: true})

export class Usuario {

    constructor(){}

    async adicionarUsuario(dadosUsuario){
        await db.insertAsync(dadosUsuario)
    }

    async obterUsuario(id_usuario){
        return await db.findOneAsync({id_usuario})
    }

    async obterUsuariosTipo(tipo){
        return await db.findAsync({tipo})
    }

    async obterTodosUsuarios(){
        return await db.findAsync({})
    }
    
    async atualizarNome(id_usuario, nome){
        await db.updateAsync({id_usuario}, {$set:{nome}})
    }

    async verificarDono(id_usuario){
        return await db.findOneAsync({id_usuario, tipo: "dono"})
    }

    async resetarDonos(){
        await db.updateAsync({tipo: "dono"}, {$set: {tipo: "comum"}}, {multi: true})
    }

    async atualizarDono(id_usuario){
        await db.updateAsync({id_usuario}, {$set: {tipo : "dono"}})
    }

    async alterarTipoUsuario(id_usuario, tipo){
        await db.updateAsync({id_usuario}, {$set: {tipo}})
    }

    async alterarRecebeuBoasVindas(id_usuario, status = true){
        await db.updateAsync({id_usuario}, {$set : {recebeuBoasVindas : status}})
    }

    async limparTipo(tipo){
        await db.updateAsync({tipo}, {$set: {tipo: "comum"}}, {multi: true})
    }

    async addContagemDiaria(id_usuario){
        await db.updateAsync({id_usuario}, {$inc: {comandos_total: 1, comandos_dia: 1}})
    }

    async addContagemTotal(id_usuario){
        await db.updateAsync({id_usuario}, {$inc: {comandos_total: 1}})
    }

    async resetarComandosDia(){
        await db.updateAsync({}, {$set:{comandos_dia : 0}}, {multi: true})
    }

    async resetarComandosDiaUsuario(id_usuario){
        await db.updateAsync({id_usuario}, {$set:{comandos_dia : 0}})
    }

}