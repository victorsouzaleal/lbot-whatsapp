//REQUERINDO MODULOS
const fs = require('fs-extra')
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
            if(!quotedMsg) return client.reply(from, msgs_texto.diversao.detector.cmd_erro , id)
            await client.sendFile(from, './media/img/detector/calibrando.png', 'detector.png', msgs_texto.diversao.detector.espera, id)
            const imgs_detector = ['verdade.png','vaipra.png','mentiroso.png','meengana.png','kao.png','incerteza.png','estresse.png','conversapraboi.png']
            let aleatorio_detector = Math.floor(Math.random() * imgs_detector.length)
            await client.sendFile(from, `./media/img/detector/${imgs_detector[aleatorio_detector]}`, 'detector.png', "", quotedMsgObj.id)
            break
        
        case '!viadometro' :
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(!quotedMsg) return client.reply(from, msgs_texto.diversao.viadometro.cmd_erro, id)
            const viadometro_resps = msgs_texto.diversao.viadometro.respostas
            let aleatorio = Math.floor(Math.random() * viadometro_resps.length)
            if(ownerNumber.includes(quotedMsgObj.author.replace(/@c.us/g, ''))) aleatorio = 0
            client.reply(from,`🧩 *VIADÔMETRO* - ${viadometro_resps[aleatorio]}`, quotedMsgObj.id)
            break

        case '!mascote':
            const url_mascote_img = "https://i.imgur.com/mVwa7q4.png"
            client.sendFileFromUrl(from, url_mascote_img, 'mascote.jpeg', 'Whatsapp Jr.', id)
            break 

        case '!malacos':
            const url_malacos_img = "https://instagram.fsdu6-1.fna.fbcdn.net/v/t51.2885-15/e35/123749592_128000845743872_4350553576495440946_n.jpg?_nc_ht=instagram.fsdu6-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=m2UaMTuk_mcAX8qUg__&tp=1&oh=d3cf971a3b695cfe302c494f355922b2&oe=60035949"
            client.sendFileFromUrl(from, url_malacos_img, 'malacos.jpeg', 'Somos o problema', id)
            break

        case '!roletrando':
        case '!roletarussa':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
            if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
            let membros_id = await client.getGroupMembersId(groupId)
            membros_id.splice(membros_id.indexOf(groupOwner),1)
            membros_id.splice(membros_id.indexOf(botNumber+'@c.us'),1)
            let membro_id_index = Math.floor(Math.random() * membros_id.length)
            await client.reply(from, msgs_texto.diversao.roletarussa.espera , id)
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
            if(!quotedMsg && mentionedJidList.length === 0) return client.reply(from, msgs_texto.diversao.gadometro.cmd_erro , id) 
            const gadometro_resps = msgs_texto.diversao.gadometro.respostas 
            let gado_aleatorio = Math.floor(Math.random() * gadometro_resps.length)
            let alvo = ''

            if(quotedMsg){
                alvo = quotedMsgObj.author.replace(/@c.us/g, '')
                if(ownerNumber.includes(alvo.replace(/@c.us/g, ''))) gado_aleatorio = 0
                return client.reply(from,`🧩 *GADÔMETRO* - ${gadometro_resps[gado_aleatorio]}`, quotedMsgObj.id)
            }

            if (mentionedJidList.length !== 0){
                alvo = mentionedJidList[0]
                if(ownerNumber.includes(alvo.replace(/@c.us/g, ''))) gado_aleatorio = 0
                return client.reply(from,`🧩 *GADÔMETRO* - ${gadometro_resps[gado_aleatorio]}`, id)
            }
            
            break

        case '!top5':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(args.length === 1) return client.reply(from,msgs_texto.diversao.top5.cmd_erro , id)
            let tema_ranking = body.slice(6)
            let ranking_membros_id = await client.getGroupMembersId(groupId)
            let msg_top5 = `╔══✪〘🏆 TOP 5 ${tema_ranking} 🏆 〙\n╠\n`
            for (let i = 0 ; i < 5 ; i++){
                let medalha = ''
                switch(i+1){
                    case 1:
                        medalha = '🥇'
                    break
                    case 2:
                        medalha = '🥈'
                    break
                    case 3:
                        medalha = '🥉'
                    break
                    default:
                        medalha = ''
                }
                let top5_aleatorio = Math.floor(Math.random() * ranking_membros_id.length)
                let m_atual = ranking_membros_id[top5_aleatorio]
                msg_top5 += `╠➥ ${medalha} ${i+1}° Lugar @${m_atual.replace(/@c.us/g, '')}\n`
                ranking_membros_id.splice(ranking_membros_id.indexOf(m_atual),1)                
            }
            await client.sendTextWithMentions(from, msg_top5)
            break

        case '!par':
            if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
            if(mentionedJidList.length !== 2) return client.reply(from, msgs_texto.diversao.par.cmd_erro , id)
            const par_resps = msgs_texto.diversao.par.respostas
            let par_aleatorio = Math.floor(Math.random() * par_resps.length)
            client.sendTextWithMentions(from, `👩‍❤️‍👨 PAR - @${mentionedJidList[0].replace(/@c.us/g, '')} & @${mentionedJidList[1].replace(/@c.us/g, '')}\n\n${par_resps[par_aleatorio]}`)
            break
        case "!fch":
            let cartas = JSON.parse(fs.readFileSync('./lib/cartas.json'))
            let carta_preta_aleatoria = Math.floor(Math.random() * cartas.cartas_pretas.length)
            let carta_preta_escolhida = cartas.cartas_pretas[carta_preta_aleatoria]
            let cont_parametros = 1

            if(carta_preta_escolhida.indexOf("{p3}" != -1)){cont_parametros = 3}
            else if(carta_preta_escolhida.indexOf("{p2}" != -1)) {cont_parametros = 2}
            else {cont_parametros = 1}

            for(i = 1; i <= cont_parametros; i++){
                let carta_branca_aleatoria = Math.floor(Math.random() * cartas.cartas_brancas.length)
                let carta_branca_escolhida = cartas.cartas_brancas[carta_branca_aleatoria]
                carta_preta_escolhida = carta_preta_escolhida.replace(`{p${i}}`, `*${carta_branca_escolhida}*`)
                cartas.cartas_brancas.splice(cartas.cartas_brancas.indexOf(carta_branca_escolhida,1))
            }

            await client.reply(from, `🧩〘*FRASES CONTRA A HUMANIDADE*〙\n\n - ${carta_preta_escolhida}`,id)

            break    
    }
}