const db = require('../lib/database')
const {consoleErro} = require("./util")
const {adicionarParticipante, removerParticipante, participanteExiste} = require("./controleParticipantes")
const {verificarUsuarioListaNegra} = require("./listaNegra")
const antiFake = require("./antiFake")
const bemVindo = require("./bemVindo")

module.exports = eventosGrupo = async (client, event) => {
    try {
        const g_info = await db.obterGrupo(event.chat)
        if (event.action == 'add') {
            //SE O PARTICIPANTE JA ESTIVER NO BANCO DE DADOS IGNORA O EVENTO DE ADD
            if(await participanteExiste(event)) return
            //SE O PARTICIPANTE ESTIVER NA LISTA NEGRA, EXPULSE
            if(!await verificarUsuarioListaNegra(client,event)) return
            //ANTIFAKE
            if(!await antiFake(client,event,g_info)) return
            //BEM-VINDO
            await bemVindo(client,event,g_info)
            //CONTADOR
            if(g_info.contador) await db.registrarContagem(event.chat,event.who)
            //ATUALIZA A LISTA DE PARTICIPANTES NO BANDO DE DADOS
            await adicionarParticipante(event.chat,event.who)
        } else if(event.action == "remove"){
            //ATUALIZA A LISTA DE PARTICIPANTES NO BANDO DE DADOS
            await removerParticipante(event.chat,event.who)
            if(g_info.contador) await db.removerContagem(event.chat,event.who)
        }
    } catch (err) {
        consoleErro(err.message, 'EVENTO-GRUPO')
    }
}
