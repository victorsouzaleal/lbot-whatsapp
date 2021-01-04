//REQUERINDO MODULOS
const msgs_texto = require('../lib/msgs')

module.exports = diversao = async(client,message) => {
    const {id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj} = message
    let { body } = message
    let { pushname, verifiedName } = sender
    pushname = pushname || verifiedName
    const commands = caption || body || ''
    const command = commands.toLowerCase().split(' ')[0] || ''
    const args =  commands.split(' ')
    const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot

    switch(command){
        case '!detector' :
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!quotedMsg) return client.reply(from, msgs_texto.erro.grupo.detector.cmd_erro, id)
            await client.sendFile(from, './media/img/detector/calibrando.png', 'detector.png', msgs_texto.espera.detector , id)
            const imgs_detector = ['verdade.png','vaipra.png','mentiroso.png','meengana.png','kao.png','incerteza.png','estresse.png','conversapraboi.png']
            let aleatorio_detector = Math.floor(Math.random() * imgs_detector.length)
            await client.sendFile(from, `./media/img/detector/${imgs_detector[aleatorio_detector]}`, 'detector.png', "", quotedMsgObj.id)
            break
        
        case '!viadometro' :
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!quotedMsg) return client.reply(from, msgs_texto.erro.grupo.viadometro.cmd_erro, id)
            const medida = [' 0%\n\n - ESSE É MACHO ','██                 20% \n\n - HMMMMM ', '████             40%\n\n - JÁ MAMOU O PRIMO', '██████         60%\n\n - EITA MAMOU O BONDE', '████████     80%\n\n - JÁ SENTOU EM ALGUEM', '██████████ 100%\n\n - BIXONA ALERTA VERMELHO CUIDADO COM SEUS ORGÃOS SEXUAIS']
            let aleatorio = Math.floor(Math.random() * medida.length)
            if(ownerNumber.includes(quotedMsgObj.author.replace(/@c.us/g, ''))) aleatorio = 0
            client.reply(from,`🤖 *VIADÔMETRO* - ${medida[aleatorio]}`, quotedMsgObj.id)
            break

        case '!mascote':
            const url_mascote_img = "https://i.imgur.com/mVwa7q4.png"
            client.sendFileFromUrl(from, url_mascote_img, 'mascote.jpeg', 'Whatsapp Jr.', id)
            break        
    }
}