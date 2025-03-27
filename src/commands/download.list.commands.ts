import { Bot } from "../interfaces/bot.interface.js"
import * as downloadFunctions from './download.functions.commands.js'

export function commandsDownload(botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name
    const download = {
        play: {
            guide: `Ex: *${PREFIX}play* musica - Faz download de uma música do Youtube e envia como audio.\n`,
            msgs: {
                wait: "[AGUARDE] 🎧 Sua música está sendo baixada e processada.\n\n"+
                "*Título*: {p1}\n"+
                "*Duração*: {p2}",
                error_limit: "O vídeo deve ter no máximo *6 minutos*",
                error_live: "Esse vídeo não pode ser convertido em áudio, lives não são aceitas."
            },
            function: downloadFunctions.playCommand
        },
        yt: {
            guide: `Ex: *${PREFIX}yt* titulo - Faz download de um video do Youtube com o titulo digitado e envia.\n`,
            msgs: {
                wait: "[AGUARDE] 🎥 Seu video está sendo baixado e processado.\n\n"+
                "*Título*: {p1}\n"+
                "*Duração*: {p2}",
                error_limit: "O video deve ter no máximo *6 minutos*",
                error_live: "Houve um erro de download, o bot não aceita download de lives."
            },
            function: downloadFunctions.ytCommand
        },
        fb: {
            guide: `Ex: *${PREFIX}fb* link - Faz download de um video do Facebook pelo link digitado e envia.\n`,
            msgs: {
                wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                "*Título*: {p1}\n"+
                "*Duração*: {p2}",
                error_limit: "O video deve ter no máximo *6 minutos*",
            },
            function: downloadFunctions.fbCommand
        },
        ig: {
            guide: `Ex: *${PREFIX}ig* link - Faz download de videos/fotos do Instagram pelo link digitado e envia.\n`,
            msgs: {
                wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                "*Autor*: {p1} (@{p2})\n"+
                "*Descrição*: {p3}\n"+
                "*Likes*: {p4}"
            },
            function: downloadFunctions.igCommand
        },
        x: {
            guide: `Ex: *${PREFIX}x* link - Faz download de um video/imagem do X pelo link digitado e envia.\n`,
            msgs: {
                wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                "*Postagem*: {p1}",
            },
            function: downloadFunctions.xCommand
        },
        tk: {
            guide: `Ex: *${PREFIX}tk* link - Faz download de um video do Tiktok pelo link digitado e envia.\n`,
            msgs: {
                wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                "*Perfil*: @{p1}\n"+
                "*Descrição*: {p2}",
            },
            function: downloadFunctions.tkCommand
        },
        img: {
            guide: `Ex: *${PREFIX}img* tema - Envia uma imagem com o tema que você digitar.\n`,
            msgs: {
                error: 'Não foi possível obter nenhuma imagem, tente novamente com outra pesquisa.',
            },
            function: downloadFunctions.imgCommand
        }
    }
    
    return download
}