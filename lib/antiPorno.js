const db = require('./database')
const {consoleErro, obterNomeAleatorio, criarTexto} = require('./util')
const {botInfo} = require("./bot")
const msgs_texto = require("./msgs")
const fs = require("fs")
const {decryptMedia} = require("@open-wa/wa-decrypt")
const { MessageTypes } = require('@open-wa/wa-automate')
const deepai = require('deepai');
const path = require("path")

module.exports = antiPorno = async (client, message) => {
    try{
        const {sender, isGroupMsg, chatId, chat, type } = message
        if(isGroupMsg && (type == MessageTypes.IMAGE || type == MessageTypes.STICKER)){
            const groupId = isGroupMsg ? chat.groupMetadata.id : ''
            const {antiporno} = await db.obterGrupo(groupId)
            if(antiporno){
                const botNumber = await client.getHostNumber()
                const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
                const isAdmin = isGroupMsg ? groupAdmins.includes(sender.id) : false
                if(isBotGroupAdmins){
                    if(!isAdmin && type == MessageTypes.IMAGE){
                        const mediaData = await decryptMedia(message)
                        const localArquivo = path.resolve(`media/img/tmp/${obterNomeAleatorio(".png")}`)
                        fs.writeFileSync(localArquivo, mediaData, {encoding: "base64"})
                        deepai.setApiKey(process.env.API_DEEPAI.trim());
                        var resp = await deepai.callStandardApi("nsfw-detector", {
                            image: fs.createReadStream(localArquivo),
                        });
                        fs.unlinkSync(localArquivo)
                        if(parseFloat(resp.output.nsfw_score) >= 0.85){
                            await client.removeParticipant(groupId, sender.id)
                            await client.sendTextWithMentions(chatId, criarTexto(msgs_texto.geral.resposta_ban, sender.id.replace("@c.us", ""), msgs_texto.grupo.antiporno.motivo, botInfo().nome))
                            return false
                        }
                    } 
                } else {
                    await db.alterarAntiPorno(groupId, false)
                }
            }   
        }
        return true
    } catch(err){
        consoleErro(msgs_texto.grupo.antiporno.erro_api, 'ANTI-PORNO')
        return false
    }
        
}