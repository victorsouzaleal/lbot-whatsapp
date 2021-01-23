const db = require('../database/database')

module.exports = antiLink = async (client, message) => {
        const {sender, isGroupMsg, body, chat } = message
        if(isGroupMsg){
            const groupId = isGroupMsg ? chat.groupMetadata.id : ''
            const al_status = await db.obterGrupo(groupId)
            if(al_status.antilink){
                const botNumber = await client.getHostNumber()
                const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
                const inviteLink = await client.getGroupInviteLink(groupId)
                if (!isBotGroupAdmins) {
                    await db.alterarAntiLink(groupId,false)
                } else {
                    if(body != undefined && (!body.includes(inviteLink))){
                        const isYoutube = new RegExp(/http(?::\/\/(?:www\.youtube\.com\/|youtu\.be)|s:\/\/(?:www\.youtube\.com|youtu\.be))/gi)
                        const isUrl = new RegExp(/(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/img)
                        //const isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi)
                        let links_youtube = body.match(isYoutube) ? body.match(isYoutube).length : 0
                        let links_gerais = body.match(isUrl) ? body.match(isUrl).length : 0
                        if(links_gerais != 0){
                            console.log("ban")
                            if((links_youtube != links_gerais) && (!groupAdmins.includes(sender.id))){
                                client.removeParticipant(groupId, sender.id)
                                return
                            }
                        }
                    }
                }
            }   
        }
}