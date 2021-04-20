const db = require('./database')
const sharp = require("sharp")
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
        const {sender, isGroupMsg, from, chat, type } = message
        if(isGroupMsg && (type == MessageTypes.IMAGE || type == MessageTypes.STICKER)){
            const groupId = isGroupMsg ? chat.groupMetadata.id : ''
            const {antiporno} = await db.obterGrupo(groupId)
            if(antiporno){
                const botNumber = await client.getHostNumber()
                const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
                const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
                const isAdmin = isGroupMsg ? groupAdmins.includes(sender.id) : false
                if(isBotGroupAdmins){
                    if(!isAdmin){
                        const mediaData = await decryptMedia(message)
                        const localArquivo = path.resolve(`media/img/${obterNomeAleatorio(".png")}`)
                        if(type == MessageTypes.IMAGE){
                            fs.writeFileSync(localArquivo, mediaData, {encoding: "base64"})
                        }
                        if(type == MessageTypes.STICKER){
                            await new Promise((resolve, reject)=>{
                                sharp(Buffer.from(mediaData, "base64"))
                                .trim()
                                .toFile(localArquivo, (err, info)=>{
                                    if(!err) resolve()
                                    else reject()
                                })
                            }) 
                        }
                        deepai.setApiKey(process.env.API_DEEPAI.trim());
                        var resp = await deepai.callStandardApi("nsfw-detector", {
                            image: fs.createReadStream(localArquivo),
                        });
                        fs.unlinkSync(localArquivo)
                        if(parseFloat(resp.output.nsfw_score) >= 0.70){
                            await client.removeParticipant(groupId, sender.id)
                            await client.sendTextWithMentions(from, criarTexto(msgs_texto.geral.resposta_ban, sender.id.replace("@c.us", ""), msgs_texto.grupo.antiporno.motivo, botInfo().nome))
                        }
                        return
                    }
                } else {
                    await db.alterarAntiPorno(groupId, false)
                }
            }   
        } 
    } catch(err){
        consoleErro(msgs_texto.grupo.antiporno.erro_api, 'ANTI-PORNO')
    }
        
}