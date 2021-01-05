//REQUERINDO MODULOS
const msgs_texto = require('../lib/msgs')

module.exports = diversao = async(client,message) => {
    const {id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj,mentionedJidList} = message
    let { body } = message
    let { pushname, verifiedName } = sender
    pushname = pushname || verifiedName
    const commands = caption || body || ''
    const command = commands.toLowerCase().split(' ')[0] || ''
    const args =  commands.split(' ')
    const ownerNumber = process.env.NUMERO_DONO.split(',') // Número do administrador do bot
    const botNumber = await client.getHostNumber()
    const groupId = isGroupMsg ? chat.groupMetadata.id : ''
    const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
    const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
    const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
    const groupOwner = isGroupMsg ? chat.groupMetadata.owner : ''
    const isGroupOwner = sender.id === groupOwner

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

        case '!roletarussa':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            let membros_id = await client.getGroupMembersId(groupId)
            membros_id.splice(membros_id.indexOf(groupOwner),1)
            membros_id.splice(membros_id.indexOf(botNumber+'@c.us'),1)
            let membro_id_index = Math.floor(Math.random() * membros_id.length)
            await client.reply(from, "🎲 Sorteando uma vítima 🎲", id)
            await client.sendTextWithMentions(from,`🔫 Você foi o escolhido @${membros_id[membro_id_index].replace(/@c.us/g, '')}, até a próxima!`).then(async ()=>{
                await client.removeParticipant(groupId, membros_id[membro_id_index])
            })
            break
        
        case '!casal':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            let casal_membros_id = await client.getGroupMembersId(groupId)
            const p1_index = Math.floor(Math.random() * casal_membros_id.length)
            const pessoa1 = casal_membros_id[p1_index]
            casal_membros_id.splice(p1_index,1)
            const p2_index = Math.floor(Math.random() * casal_membros_id.length)
            const pessoa2 = casal_membros_id[p2_index]
            client.sendTextWithMentions(from, `👩‍❤️‍👨 Está rolando um clima entre @${pessoa1.replace(/@c.us/g, '')} e @${pessoa2.replace(/@c.us/g, '')}`)
            break

        case '!gadometro':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!quotedMsg && mentionedJidList.length === 0) return client.reply(from, "[ERRO] Você deve mencionar alguém com o !gadometro ou responder alguma mensagem.", id) 
            const nivel_gado = [' 0%\n\n - ESSE NÃO É GADO ','🐃 20% \n\n - GADO APRENDIZ, TÁ NO CAMINHO ', '🐃🐃 40%\n\n - GADO INTERMEDIÁRIO, JÁ INVADE PV DE UMAS', '🐃🐃🐃 60%\n\n - CUIDADO! GADO EXPERIENTE, INVADE PV E FALA LINDA EM TODAS FOTOS', '🐃🐃🐃🐃 80%\n\n - ALERTA! GADO MASTER, SÓ APARECE COM MULHER ON', '🐃🐃🐃🐃🐃 100%\n\n - PERIGO! GADO MEGA BLASTER ULTRA PAGA BOLETO DE MULHER QUE TEM NAMORADO']
            let gado_aleatorio = Math.floor(Math.random() * nivel_gado.length)
            let alvo = ''

            if(quotedMsg){
                alvo = quotedMsgObj.author.replace(/@c.us/g, '')
                if(ownerNumber.includes(alvo.replace(/@c.us/g, ''))) gado_aleatorio = 0
                return client.reply(from,`🎲 *GADÔMETRO* - ${nivel_gado[gado_aleatorio]}`, quotedMsgObj.id)
            }

            if (mentionedJidList.length !== 0){
                alvo = mentionedJidList[0]
                if(ownerNumber.includes(alvo.replace(/@c.us/g, ''))) gado_aleatorio = 0
                return client.reply(from,`🎲 *GADÔMETRO* - ${nivel_gado[gado_aleatorio]}`, id)
            }
            
            break
        case '!top5gados':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            let gados_membros_id = await client.getGroupMembersId(groupId)
            let msg_top5 = '╔══✪〘🐃 TOP 5 GADOS 〙✪══\n'
            for (let i = 0 ; i < 5 ; i++){
                let top5_aleatorio = Math.floor(Math.random() * gados_membros_id.length)
                let gado_atual = gados_membros_id[top5_aleatorio]
                msg_top5 += `╠➥ ${i+1}° Lugar @${gado_atual.replace(/@c.us/g, '')}\n`
                gados_membros_id.splice(gados_membros_id.indexOf(gado_atual),1)                
            }
            await client.sendTextWithMentions(from, msg_top5)
            break
        case '!par':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(mentionedJidList.length !== 2) return client.reply(from, "[ERRO] Você deve marcar 2 pessoas", id)
            const nivel_par = [' *0%*\n - NÃO COMBINAM ','❤️ *20%* \n - HMMM TALVEZ ', '❤️❤️ *40%*\n - PODE ROLAR ALGO SÉRIO', '❤️❤️❤️ *60%*\n - UIA ESSES DOIS TEM FUTURO', '❤️❤️❤️❤️ *80%*\n - ESSES DOIS TEM QUÍMICA, TALVEZ UM CASAMENTO EM BREVE', '❤️❤️❤️❤️❤️ *100%*\n - CASAL PERFEITO! PREPAREM-SE PARA VIVER ATÉ A VELHICE JUNTOS']
            let par_aleatorio = Math.floor(Math.random() * nivel_par.length)
            client.sendTextWithMentions(from, `👩‍❤️‍👨 PAR - @${mentionedJidList[0].replace(/@c.us/g, '')} & @${mentionedJidList[1].replace(/@c.us/g, '')}\n\n${nivel_par[par_aleatorio]}`)
            break
    }
}