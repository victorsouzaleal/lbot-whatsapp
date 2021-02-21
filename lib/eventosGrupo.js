const db = require('../database/database')
const {msgs_texto} = require("./msgs")
const color = require("./color")
const {preencherTexto} = require("./util")
const {adicionarParticipante, removerParticipante} = require("./atualizarParticipantes")

module.exports = eventosGrupo = async (client, event) => {
    try {
        const g_info = await db.obterGrupo(event.chat)
        if (event.action == 'add') {

            //SE O PARTICIPANTE JA ESTIVER NO BANCO DE DADOS IGNORA O EVENTO DE ADD
            let participanteExiste = await db.participanteExiste(event.chat, event.who)
            if(participanteExiste) return

            const gChat = await client.getChatById(event.chat) 
            const pChat = await client.getContact(event.who) 
            const {name } = gChat
            if(g_info.antifake.status){
                const botNumber = await client.getHostNumber()
                const groupAdmins = await client.getGroupAdmins(event.chat)
                const isBotGroupAdmins = groupAdmins.includes(botNumber + '@c.us')
                if(!isBotGroupAdmins){
                    await db.alterarAntiFake(event.chat,false)
                } else {
                    let liberado = false
                    for(ddi of g_info.antifake.ddi_liberados){
                        if(pChat.id.startsWith(ddi)) {
                            liberado = true
                        }
                    }
                    if(!liberado){
                        client.removeParticipant(event.chat, pChat.id)
                        return
                    }
                }
            } 
            if(g_info.bemvindo.status){
                let msg_customizada = (g_info.bemvindo.msg != "") ? g_info.bemvindo.msg+"\n\n" : "" 
                let mensagem_bemvindo = preencherTexto(msgs_texto.grupo.bemvindo.mensagem, pChat.id.replace(/@c.us/g, ''), name, msg_customizada)
                await client.sendTextWithMentions(event.chat,mensagem_bemvindo)
            }

            if(g_info.contador) await db.registrarContagem(event.chat,event.who)

            //ATUALIZA A LISTA DE PARTICIPANTES NO BANDO DE DADOS
            await adicionarParticipante(event.chat,event.who)

        } else if(event.action == "remove"){
            //ATUALIZA A LISTA DE PARTICIPANTES NO BANDO DE DADOS
            await removerParticipante(event.chat,event.who)
            if(g_info.contador) await db.removerContagem(event.chat,event.who)
        }
    } catch (err) {
        console.error(color("[ERRO]","red"),err)
    }
}
