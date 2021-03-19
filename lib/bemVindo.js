const msgs_texto = require("./msgs")
const {criarTexto} = require("./util")
const Canvas = require("discord-canvas")

module.exports = bemVindo = async(client,event,g_info)=>{
    if(g_info.bemvindo.status){
        const gChat = await client.getChatById(event.chat)
        const ultimosDigitosParticipante = event.who.split("@")[0].slice(-4)
        const fotoParticipante = await client.getProfilePicFromServer(event.who) || "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg"
        const qtdParticipantes = gChat.groupMetadata.participants.length
        const {id, pushname, formattedName, verifiedName} = await client.getContact(event.who)
        const nomeUsuario =  pushname || verifiedName || formattedName
        const {name } = gChat
        const image = await new Canvas.Welcome()
            .setText("title", "Bem-vindo")
            .setText("message", "Bem-vindo ao {server}")
            .setText('member-count', '- MEMBRO N°{count}')
            .setUsername(nomeUsuario)
            .setDiscriminator(ultimosDigitosParticipante)
            .setMemberCount(qtdParticipantes)
            .setGuildName(name)
            .setAvatar(fotoParticipante)
            .setColor("border", "#1fbdcf")
            .setColor("username-box", "#1fbdcf")
            .setColor("discriminator-box", "#1fbdcf")
            .setColor("message-box", "#1fbdcf")
            .setColor("title", "#1fbdcf")
            .setColor("avatar", "#1fbdcf")
            .setBackground("https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/286300/c33a58cd147d270171996c766b102de411603d89.jpg")
            .toAttachment()
        let msg_customizada = (g_info.bemvindo.msg != "") ? g_info.bemvindo.msg+"\n\n" : "" 
        let mensagem_bemvindo = criarTexto(msgs_texto.grupo.bemvindo.mensagem, nomeUsuario, name, msg_customizada)
        await client.sendFile(event.chat, image.toDataURL(),"", mensagem_bemvindo)
        //await client.sendTextWithMentions(event.chat,mensagem_bemvindo)
    }
}