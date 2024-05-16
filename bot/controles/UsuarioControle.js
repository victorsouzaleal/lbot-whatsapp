
import {Usuario} from '../modelos/Usuario.js'


export class UsuarioControle{

    constructor(){
        this.usuario = new Usuario()
    }

    async registrarUsuario(id_usuario, nome, botInfo){
        const dadosUsuario = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
            max_comandos_dia : botInfo.limite_diario.limite_tipos.comum,
            recebeuBoasVindas: false,
            tipo: 'comum'
        }

        await this.usuario.adicionarUsuario(dadosUsuario)
    }

    async atualizarNome(id_usuario, nome){
        await this.usuario.atualizarNome(id_usuario, nome)
    }

    async verificarRegistro(id_usuario){
        let registro = await this.usuario.obterUsuario(id_usuario)
        return (registro != null)
    }

    async verificarDono(id_usuario, botInfo){
        let donoAtual = await this.usuario.verificarDono(id_usuario)
        if(!donoAtual){
            let {limite_diario} = botInfo
            await this.usuario.resetarDonos(limite_diario.limite_tipos.comum)
            await this.usuario.atualizarDono(id_usuario)
        }
    }

    async obterDadosTodosUsuarios(){
        return await this.usuario.obterTodosUsuarios()
    }

    async obterDadosUsuario(id_usuario){
        return await this.usuario.obterUsuario(id_usuario)
    }

    async obterUsuariosTipo(tipo){
        return await this.usuario.obterUsuariosTipo(tipo)
    }

    async limparTipo(tipo, botInfo){
        let {limite_diario} = botInfo
        if(limite_diario.limite_tipos[tipo] === undefined || tipo === "comum") return false
        await this.usuario.limparTipo(tipo, limite_diario.limite_tipos.comum)
        return true
    }

    async alterarLimiteComandosTipo(tipo, qtdLimite){
        await this.usuario.definirLimite(tipo, qtdLimite)
    }

    async recebeuBoasVindas(id_usuario){
        await this.usuario.alterarRecebeuBoasVindas(id_usuario)
    }

    async verificarUltrapassouLimiteComandos(id_usuario){
        let usuario = await this.usuario.obterUsuario(id_usuario)
        if(usuario.max_comandos_dia == null) return false
        return (usuario.comandos_dia >= usuario.max_comandos_dia)
    }

    async adicionarContagemDiariaComandos(id_usuario){
        await this.usuario.addContagemDiaria(id_usuario)
    }

    async adicionarContagemTotalComandos(id_usuario){
        await this.usuario.addContagemTotal(id_usuario)
    }

    async alterarTipoUsuario(id_usuario, tipo, botInfo){
        let {limite_diario} = botInfo
        if(limite_diario.limite_tipos[tipo] !== undefined){
            await this.usuario.alterarTipoUsuario(id_usuario, tipo, limite_diario.limite_tipos[tipo])
            return true
        } else {
            return false
        }
    }

    async resetarComandosDia(){
        await this.usuario.resetarComandosDia()
    }

    async resetarComandosDiaUsuario(id_usuario){
        await this.usuario.resetarComandosDiaUsuario(id_usuario)
    }
    
}