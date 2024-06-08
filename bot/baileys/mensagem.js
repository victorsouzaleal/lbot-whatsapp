import {generateWAMessageFromContent, getContentType} from '@whiskeysockets/baileys'
import pino from 'pino'
import {GrupoControle} from '../controles/GrupoControle.js'
import {UsuarioControle} from '../controles/UsuarioControle.js'


export async function converterMensagem(m, botInfo){
    return new Promise(async (resolve, reject)=>{
        try {
            m = m.messages[0]
            let tipo = getContentType(m.message)
            let mensagem_vunica = tipo.includes('viewOnce')
            if(mensagem_vunica){
                m.message = m.message[tipo].message
                tipo = getContentType(m.message)
            }
            let mensagem_citada = tipo == tiposMensagem.textoExt && m.message.extendedTextMessage?.contextInfo?.quotedMessage != undefined
            let {numero_bot} = botInfo
            let remetente = (m.key.fromMe) ? numero_bot : m.key.participant || m.key.remoteJid
            let texto_completo = m.message[tipo]?.caption || m.message.conversation || m.message.extendedTextMessage?.text || '' 
            let [comando, ...args] = texto_completo.trim().split(" ")
            let numero_dono = await new UsuarioControle().obterIdDono()
            let mensagem_dono = numero_dono == remetente
            let mensagem_grupo = m.key.remoteJid.includes("@g.us")
            
            let respostaInformacoes = {
                id_mensagem : m.key.id,
                remetente,
                tipo,
                t : m.messageTimestamp,
                id_chat: m.key.remoteJid,
                nome_usuario : m.pushName,
                corpo : m.message.conversation ?? m.message.extendedTextMessage?.text ?? '',
                legenda : m.message[tipo]?.caption,
                mencionados : m.message[tipo]?.contextInfo?.mentionedJid ?? [],
                texto_recebido : args?.join(" ").trim() ?? '',
                comando: comando?.toLowerCase().trim() ?? '',
                args,
                mensagem_citada,
                mensagem_grupo,
                mensagem_vunica,
                mensagem_dono,
                mensagem_bot : m.key.fromMe,
                mensagem_broadcast : m.key.remoteJid == "status@broadcast",
                mensagem_midia : tipo != tiposMensagem.texto && tipo != tiposMensagem.textoExt,
                mensagem: m,
            }
            
            // Se for mensagem de midia
            if(respostaInformacoes.mensagem_midia){
                respostaInformacoes.midia = {
                    mimetype: m.message[tipo]?.mimetype,
                    midia_url: m.message[tipo]?.url,
                    segundos : m.message[tipo]?.seconds,
                    tamanho_arquivo: m.message[tipo]?.fileLength,
                }
            }
            
            // Se for mensagem de grupo
            if(mensagem_grupo){
                let id_grupo = m.key.remoteJid
                let grupoInfo = await new GrupoControle().obterGrupoInfo(id_grupo)
                respostaInformacoes.grupo = grupoInfo
                respostaInformacoes.grupo.usuario_admin = grupoInfo ? grupoInfo.admins.includes(remetente) : null
                respostaInformacoes.grupo.bot_admin = grupoInfo ? grupoInfo.admins.includes(numero_bot) : null
            }
            
            // Se tiver citado alguma mensagem
            if(mensagem_citada) {
                let tipoMensagemCitada = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
                let mensagem_vunica = tipoMensagemCitada.includes('viewOnce')
                if(mensagem_vunica) {
                    m.message.extendedTextMessage.contextInfo.quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage[tipoMensagemCitada].message
                    tipoMensagemCitada = getContentType(m.message.extendedTextMessage?.contextInfo?.quotedMessage)
                }
                respostaInformacoes.citacao = {
                    tipo : tipoMensagemCitada,
                    remetente : m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid,
                    corpo : m.message.extendedTextMessage.contextInfo.quotedMessage?.conversation || m.message.extendedTextMessage.contextInfo.quotedMessage?.extendedTextMessage?.text,
                    legenda : m.message.extendedTextMessage.contextInfo.quotedMessage[tipoMensagemCitada]?.caption,
                    midia_url : m.message.extendedTextMessage.contextInfo.quotedMessage[tipoMensagemCitada]?.url,
                    mimetype : m.message.extendedTextMessage.contextInfo.quotedMessage[tipoMensagemCitada]?.mimetype,
                    tamanho_arquivo: m.message.extendedTextMessage.contextInfo.quotedMessage[tipoMensagemCitada]?.fileLength,
                    segundos: m.message.extendedTextMessage.contextInfo.quotedMessage[tipoMensagemCitada]?.seconds,
                    mensagem_vunica,
                    mensagem: generateWAMessageFromContent(m.message.extendedTextMessage.contextInfo.participant || m.message.extendedTextMessage.contextInfo.remoteJid, m.message.extendedTextMessage.contextInfo.quotedMessage , { logger : pino() })
                }
            }
            
            resolve(respostaInformacoes)
        } catch (err) {
            reject(err)
        }
    })
   
}

export const obterTipoDeMensagem = (tipo) => {
    if(tipo == tiposMensagem.texto || tipo == tiposMensagem.textoExt) return 'Texto'
    if(tipo == tiposMensagem.imagem) return 'Imagem'
    if(tipo == tiposMensagem.documento) return 'Documento/Arquivo'
    if(tipo == tiposMensagem.video) return 'Video/GIF'
    if(tipo == tiposMensagem.sticker) return 'Sticker'
    if(tipo == tiposMensagem.audio) return 'Audio'
    return null
}

export const tiposMensagem = {
    texto : "conversation",
    textoExt : "extendedTextMessage",
    imagem: "imageMessage",
    documento: "documentMessage",
    video: "videoMessage",
    sticker: "stickerMessage",
    audio: "audioMessage"
}

export const tiposPermitidosMensagens = [
    "conversation",
    "extendedTextMessage",
    "imageMessage",
    "documentMessage",
    "videoMessage",
    "stickerMessage",
    "audioMessage"
]