import * as usuariosdb from '../database/usuarios.js'



export const enviarSalario = async (usuario)=>{
    let usuario = await usuariosdb.obterUsuario(usuario)
    if(usuario != null){
        let tAtual = Date.now(), tSalario = usuario.salario.proximo
        if(tAtual >= tSalario){
            await usuariosdb.adicionarMoedasUsuario(usuario, usuario.salario.valor)
            await usuariosdb.alterarProximoSalario(usuario, tAtual)
        }
    }
}

export const consumirMoedas = async(usuario, moedas)=>{
    let usuario = await usuariosdb.obterUsuario(usuario)
    if(usuario.moedas < moedas) return false
    await usuariosdb.removerMoedasUsuario(usuario, moedas)
    return true
}

export const premiarMoedas = async(usuario, moedas)=>{
    await usuariosdb.adicionarMoedasUsuario(usuario, moedas)
}