const db = require('../database/database')
const color = require('./color')

module.exports = antiLink = async (client, message) => {
    try{
        const {sender, isGroupMsg, body, chat, type, caption } = message
        if(isGroupMsg){
            const groupId = isGroupMsg ? chat.groupMetadata.id : ''
            const al_status = await db.obterGrupo(groupId)

            if(al_status.antilink.status){
                const botNumber = await client.getHostNumber()
                const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
                if (!isBotGroupAdmins) {
                    await db.alterarAntiLink(groupId,false)
                } else {
                    if(body != undefined){
                        let mensagem = ""
                        if((type == "image" || type == "video") && caption != undefined){
                            mensagem = caption
                        } else if (type == "chat"){
                            mensagem = body
                        } else {
                            return
                        }
                        
                        //LINKS AO TODO
                        const isUrl = new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/img)
                        let links_gerais = mensagem.match(isUrl) ? mensagem.match(isUrl).length : 0

                        if(links_gerais == 0) return

                        //FILTROS
                        let links_permitidos_qtd = 0
                        if(al_status.antilink.filtros.youtube){
                            const isYoutube = new RegExp(/http(?::\/\/(?:www\.youtube\.com\/|youtu\.be)|s:\/\/(?:www\.youtube\.com|youtu\.be))/gi)
                            let links_youtube_qtd = mensagem.match(isYoutube) ? mensagem.match(isYoutube).length : 0
                            links_permitidos_qtd = links_permitidos_qtd + links_youtube_qtd
                        }
                        if(al_status.antilink.filtros.whatsapp){
                            const isWhatsapp = new RegExp(/(?:https?:\/\/(?:chat\.whatsapp\.com|wa\.me)|chat\.whatsapp\.com|wa\.me)\//gi)
                            let links_whatsapp_qtd = mensagem.match(isWhatsapp) ? mensagem.match(isWhatsapp).length : 0
                            links_permitidos_qtd = links_permitidos_qtd + links_whatsapp_qtd
                        }
                        if(al_status.antilink.filtros.twitter){
                            const isTwitter = new RegExp(/(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/gi)
                            let links_twitter_qtd = mensagem.match(isTwitter) ? mensagem.match(isTwitter).length : 0
                            links_permitidos_qtd = links_permitidos_qtd + links_twitter_qtd
                        }
                        if(al_status.antilink.filtros.facebook){
                            const isFacebook = new RegExp(/(?:https?:\/\/)?(?:www\.)?(mbasic.facebook|m\.facebook|facebook|fb)\.(com|me)\/(?:(?:\w\.)*#!\/)?(?:pages\/)?(?:[\w\-\.]*\/)*([\w\-\.]*)/ig)
                            let links_facebook_qtd = mensagem.match(isFacebook) ? mensagem.match(isFacebook).length : 0
                            links_permitidos_qtd = links_permitidos_qtd + links_facebook_qtd
                        }

                        //VERIFICAÇÃO DOS LINKS E BANIMENTO
                        if((links_permitidos_qtd != links_gerais) && (!groupAdmins.includes(sender.id))){
                            client.removeParticipant(groupId, sender.id)
                            return
                        }

                    }
                }
            }   
        }
    } catch(err){
        console.error(color("[ERRO]","red"),err)
    }
        
}