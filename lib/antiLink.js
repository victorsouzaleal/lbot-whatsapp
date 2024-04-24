import * as gruposdb from '../database/grupos.js'
import {consoleErro, criarTexto} from './util.js'
import * as socket from '../baileys/socket-funcoes.js'
import * as grupos from '../controle/gruposControle.js'


export const antiLink = async (c, mensagemInfoCompleta) => {
    try{
        const {msgs_texto} = mensagemInfoCompleta
        const {groupId, groupAdmins, isBotGroupAdmins } = mensagemInfoCompleta.grupo
        const {sender, chatId, isGroupMsg, body, caption, id} = mensagemInfoCompleta.mensagem
        if(!isGroupMsg) return true
        const al_status = await grupos.obterGrupoInfo(groupId)
        if(!al_status.antilink) return true

        if (!isBotGroupAdmins) {
            await gruposdb.alterarAntiLink(groupId,false)
        } else {
            let mensagem = body || caption
            if(mensagem != undefined){
                const isUrl = mensagem.match(new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img))
                if(isUrl && !groupAdmins.includes(sender)){
                    await socket.sendTextWithMentions(c, chatId, criarTexto(msgs_texto.grupo.antilink.detectou, sender.replace("@s.whatsapp.net", "")), [sender])
                    await socket.deleteMessage(c, id)
                    return false
                }
            }
        }

        return true   
    } catch(err){
        err.message = `antiLink - ${err.message}`
        consoleErro(err, "ANTI-LINK")
        return true
    }
        
}