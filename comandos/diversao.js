//REQUERINDO MODULOS
const msgs_texto = require('../lib/msgs')
const {criarTexto, primeiraLetraMaiuscula, erroComandoMsg, removerNegritoComando} = require("../lib/util")
const path = require("path")
const api = require('../lib/api')

module.exports = diversao = async(client,message) => {
    try {
        const {id, from, sender, isGroupMsg, chat, caption, quotedMsg, quotedMsgObj,mentionedJidList} = message
        let { body } = message
        const commands = caption || body || ''
        var command = commands.toLowerCase().split(' ')[0] || ''
        command = removerNegritoComando(command)
        const args =  commands.split(' ')
        const ownerNumber = process.env.NUMERO_DONO.trim() // Número do administrador do bot
        const botNumber = await client.getHostNumber()
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const isGroupAdmins = isGroupMsg ? groupAdmins.includes(sender.id) : false
        const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
        const groupOwner = isGroupMsg ? chat.groupMetadata.owner : ''

        switch(command){
            case '!detector' :
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(!quotedMsg) return client.reply(from, erroComandoMsg(command) , id)
                var imgsDetector = ['verdade','vaipra','mentiroso','meengana','kao','incerteza','estresse','conversapraboi']
                var indexAleatorio = Math.floor(Math.random() * imgsDetector.length)
                await client.sendFile(from, './media/img/comandos/detector/calibrando.png', 'detector.png', msgs_texto.diversao.detector.espera, id)
                await client.sendFile(from, `./media/img/comandos/detector/${imgsDetector[indexAleatorio]}.png`, 'detector.png', "", quotedMsgObj.id)
                break
            
            case '!viadometro' :
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(!quotedMsg && mentionedJidList.length == 0) return client.reply(from, erroComandoMsg(command), id)
                if(mentionedJidList.length > 1) client.reply(from, msgs_texto.diversao.viadometro.apenas_um, id)
                var respostas = msgs_texto.diversao.viadometro.respostas
                var indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                if(mentionedJidList.length == 1){
                    idResposta = id, alvo = mentionedJidList[0].replace(/@c.us/g, '')
                } else {
                    idResposta = quotedMsgObj.id, alvo = quotedMsgObj.author.replace(/@c.us/g, '')
                }
                if(ownerNumber == alvo) indexAleatorio = 0
                var respostaTexto = criarTexto(msgs_texto.diversao.viadometro.resposta,respostas[indexAleatorio])
                await client.reply(from, respostaTexto, idResposta)
                break
            
            case '!bafometro' :
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(!quotedMsg && mentionedJidList.length == 0) return client.reply(from, erroComandoMsg(command), id)
                if (mentionedJidList.length > 1) return client.reply(from, msgs_texto.diversao.bafometro.apenas_um, id)
                var respostas = msgs_texto.diversao.bafometro.respostas
                var indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                if(mentionedJidList.length == 1){
                    idResposta = id, alvo = mentionedJidList[0].replace(/@c.us/g, '')
                } else {
                    idResposta = quotedMsgObj.id, alvo = quotedMsgObj.author.replace(/@c.us/g, '')
                }
                if(ownerNumber == alvo) indexAleatorio = 0
                var respostaTexto = criarTexto(msgs_texto.diversao.bafometro.resposta, respostas[indexAleatorio])
                await client.reply(from, respostaTexto, idResposta)
                break

            case "!caracoroa":
                var ladosMoeda = ["cara","coroa"], indexAleatorio = Math.floor(Math.random() * ladosMoeda.length)
                await client.reply(from, msgs_texto.diversao.caracoroa.espera, id)
                var respostaTexto = criarTexto(msgs_texto.diversao.caracoroa.resposta, primeiraLetraMaiuscula(ladosMoeda[indexAleatorio]))
                await client.sendFile(from, path.resolve(`media/img/comandos/caracoroa/${ladosMoeda[indexAleatorio]}.png`), `${ladosMoeda[indexAleatorio]}.png`, respostaTexto, id)
                break

            case "!ppt":
                var ppt = ["pedra","papel","tesoura"], indexAleatorio = Math.floor(Math.random() * ppt.length)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                if(!ppt.includes(args[1].toLowerCase())) return client.reply(from, msgs_texto.diversao.ppt.opcao_erro, id)
                var escolhaBot = ppt[indexAleatorio], iconeEscolhaBot = null, escolhaUsuario = args[1].toLowerCase(), iconeEscolhaUsuario = null, vitoriaUsuario = null
                if(escolhaBot == "pedra"){
                    iconeEscolhaBot = "✊"
                    if(escolhaUsuario == "pedra") vitoriaUsuario = null, iconeEscolhaUsuario = "✊"
                    if(escolhaUsuario == "tesoura") vitoriaUsuario = false, iconeEscolhaUsuario = "✌️"
                    if(escolhaUsuario == "papel") vitoriaUsuario = true, iconeEscolhaUsuario = "✋"
                } else if(escolhaBot == "papel"){
                    iconeEscolhaBot = "✋"
                    if(escolhaUsuario == "pedra") vitoriaUsuario = false, iconeEscolhaUsuario = "✊"
                    if(escolhaUsuario == "tesoura") vitoriaUsuario = true, iconeEscolhaUsuario = "✌️"
                    if(escolhaUsuario == "papel") vitoriaUsuario = null, iconeEscolhaUsuario = "✋"
                } else  {
                    iconeEscolhaBot = "✌️"
                    if(escolhaUsuario == "pedra") vitoriaUsuario = true, iconeEscolhaUsuario = "✊"
                    if(escolhaUsuario == "tesoura") vitoriaUsuario = null, iconeEscolhaUsuario = "✌️"
                    if(escolhaUsuario == "papel") vitoriaUsuario = false, iconeEscolhaUsuario = "✋"
                }
                var textoResultado = ''
                if(vitoriaUsuario == true) textoResultado = msgs_texto.diversao.ppt.resposta.vitoria
                else if(vitoriaUsuario == false) textoResultado = msgs_texto.diversao.ppt.resposta.derrota
                else textoResultado = msgs_texto.diversao.ppt.resposta.empate
                await client.reply(from, criarTexto(textoResultado, iconeEscolhaUsuario, iconeEscolhaBot), id)
                break

            case "!massacote":
            case '!mascote':
                //var mascoteFotoURL = "https://i.imgur.com/mVwa7q4.png"
                var mascoteFotoURL = "https://i.imgur.com/SbKeovm.png"
                await client.sendFileFromUrl(from, mascoteFotoURL, 'mascote.jpeg', 'Whatsapp Jr.', id)
                break 

            case '!malacos':
                const malacosFotoURL = "https://i.imgur.com/7bcn2TK.jpg"
                await client.sendFileFromUrl(from, malacosFotoURL, 'malacos.jpg', 'Somos o problema', id)
                break

            case '!roletarussa':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if (!isGroupAdmins) return client.reply(from, msgs_texto.permissao.apenas_admin , id)
                if (!isBotGroupAdmins) return client.reply(from,msgs_texto.permissao.bot_admin, id)
                var idParticipantesAtuais = await client.getGroupMembersId(groupId)
                idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(groupOwner),1)
                idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(botNumber+'@c.us'),1)
                if(idParticipantesAtuais.length == 0) return client.reply(from, msgs_texto.diversao.roletarussa.sem_membros, id)
                var indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                var respostaTexto = criarTexto(msgs_texto.diversao.roletarussa.resposta, idParticipantesAtuais[indexAleatorio].replace(/@c.us/g, ''))
                await client.reply(from, msgs_texto.diversao.roletarussa.espera , id)
                await client.sendTextWithMentions(from, respostaTexto)
                await client.removeParticipant(groupId, idParticipantesAtuais[indexAleatorio])
                break
            
            case '!casal':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                var idParticipantesAtuais = await client.getGroupMembersId(groupId)
                if(idParticipantesAtuais.length < 2) return client.reply(from, msgs_texto.diversao.casal.minimo, id)
                var indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                var pessoaEscolhida1 = idParticipantesAtuais[indexAleatorio]
                idParticipantesAtuais.splice(indexAleatorio,1)
                indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                var pessoaEscolhida2 = idParticipantesAtuais[indexAleatorio]
                var respostaTexto = criarTexto(msgs_texto.diversao.casal.resposta, pessoaEscolhida1.replace(/@c.us/g, ''), pessoaEscolhida2.replace(/@c.us/g, ''))
                await client.sendTextWithMentions(from, respostaTexto)
                break

            case '!gadometro':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(!quotedMsg && mentionedJidList.length === 0) return client.reply(from, erroComandoMsg(command) , id)
                if(mentionedJidList.length > 1) return client.reply(from, msgs_texto.diversao.gadometro.apenas_um , id)
                var respostas = msgs_texto.diversao.gadometro.respostas 
                var indexAleatorio = Math.floor(Math.random() * respostas.length), idResposta = null, alvo = null
                if (mentionedJidList.length == 1){
                    idResposta = id, alvo = mentionedJidList[0].replace(/@c.us/g, '')
                }else{
                    idResposta = quotedMsgObj.id, alvo = quotedMsgObj.author.replace(/@c.us/g, '')
                }
                if(ownerNumber == alvo) indexAleatorio = 0
                var respostaTexto = criarTexto(msgs_texto.diversao.gadometro.resposta, respostas[indexAleatorio])
                await client.reply(from, respostaTexto, idResposta)       
                break

            case '!top5':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(args.length === 1) return client.reply(from, erroComandoMsg(command), id)
                var temaRanking = body.slice(6).trim(), idParticipantesAtuais = await client.getGroupMembersId(groupId)
                if(idParticipantesAtuais.length < 5) return client.reply(from,msgs_texto.diversao.top5.erro_membros, id)
                var respostaTexto = criarTexto(msgs_texto.diversao.top5.resposta_titulo, temaRanking)
                for (let i = 0 ; i < 5 ; i++){
                    var medalha = ""
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
                    var indexAleatorio = Math.floor(Math.random() * idParticipantesAtuais.length)
                    var membroSelecionado = idParticipantesAtuais[indexAleatorio]
                    respostaTexto += criarTexto(msgs_texto.diversao.top5.resposta_itens, medalha, i+1, membroSelecionado.replace(/@c.us/g, ''))
                    idParticipantesAtuais.splice(idParticipantesAtuais.indexOf(membroSelecionado),1)                
                }
                await client.sendTextWithMentions(from, respostaTexto)
                break

            case '!par':
                if (!isGroupMsg) return client.reply(from, msgs_texto.permissao.grupo, id)
                if(mentionedJidList.length !== 2) return client.reply(from, erroComandoMsg(command) , id)
                var respostas = msgs_texto.diversao.par.respostas
                var indexAleatorio = Math.floor(Math.random() * respostas.length)
                var respostaTexto = criarTexto(msgs_texto.diversao.par.resposta, mentionedJidList[0].replace(/@c.us/g, ''), mentionedJidList[1].replace(/@c.us/g, ''), respostas[indexAleatorio])
                await client.sendTextWithMentions(from, respostaTexto)
                break

            case "!fch":
                try{
                    var respostaFrase = await api.obterCartasContraHu()
                    await client.reply(from, respostaFrase, id)
                } catch(err){
                    await client.reply(from, err.message, id)
                }
                break    
        }
    } catch(err){
        throw new Error(err)
    }
    
}