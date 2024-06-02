
import {Usuario} from '../modelos/Usuario.js'


export class UsuarioControle{

    constructor(){
        this.usuario = new Usuario()
    }

    async registrarUsuario(id_usuario, nome){
        const dadosUsuario = {
            id_usuario,
            nome,
            comandos_total: 0,
            comandos_dia: 0,
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

    async cadastrarDono(id_usuario){
        await this.usuario.resetarDonos()
        await this.usuario.atualizarDono(id_usuario)
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

    async obterDono(){
        return await this.usuario.obterDono()
    }

    async obterIdDono(){
        const dono = await this.usuario.obterDono()
        return dono?.id_usuario ?? ''
    }

    async limparTipo(tipo, botInfo){
        let {limite_diario} = botInfo
        if(!limite_diario.limite_tipos[tipo] || tipo === "comum" || tipo === 'dono') return false
        await this.usuario.limparTipo(tipo)
        return true
    }

    async recebeuBoasVindas(id_usuario){
        await this.usuario.alterarRecebeuBoasVindas(id_usuario)
    }

    async verificarUltrapassouLimiteComandos(id_usuario, botInfo){
        let usuario = await this.usuario.obterUsuario(id_usuario)
        const maxComandos = botInfo.limite_diario.limite_tipos[usuario.tipo].comandos
        if(!maxComandos) return false
        return (usuario.comandos_dia >= maxComandos)
    }

    async adicionarContagemDiariaComandos(id_usuario){
        await this.usuario.addContagemDiaria(id_usuario)
    }

    async adicionarContagemTotalComandos(id_usuario){
        await this.usuario.addContagemTotal(id_usuario)
    }

    async alterarTipoUsuario(id_usuario, tipo, botInfo){
        let {limite_diario} = botInfo
        if(limite_diario.limite_tipos[tipo] && tipo != 'dono'){
            await this.usuario.alterarTipoUsuario(id_usuario, tipo)
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