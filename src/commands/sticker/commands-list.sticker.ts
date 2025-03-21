import { Bot } from "../../interfaces/bot.interface.js"
import * as stickerFunctions from './commands-functions.sticker.js'

export function commandsSticker(botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name
    const sticker = {
        s: {
            guide: `Ex: Envie/responda uma *IMAGEM/VIDEO* com *${PREFIX}s* - Transforma em sticker.\n`+
            `Ex: Envie/responda uma *IMAGEM* com *${PREFIX}s 1* - Transforma em sticker circular.\n`+
            `Ex: Envie/responda uma *IMAGEM* com *${PREFIX}s 2* - Transforma em sticker sem perder a proporção.\n`,
            msgs: {
                error_limit: 'O video/gif deve ter no máximo 8 segundos.',
                error_message: "Houve um erro ao obter os dados da mensagem."
            },
            function: stickerFunctions.sCommand
        },
        simg: {
            guide: `Ex: Responda um sticker com *${PREFIX}simg* - Transforma o sticker em imagem.\n\n`+
            `*Obs*: Este comando funciona apenas com *STICKERS NÃO ANIMADOS*.\n`,
            msgs: {
                error_sticker: `Este comando pode ser usado apenas respondendo stickers.`
            },
            function: stickerFunctions.simgCommand
        },
        ssf: {
            guide: `Ex: Envie/responda uma *imagem* com *${PREFIX}ssf* - Retira o fundo da imagem e transforma em sticker.\n\n`+
            `*Obs*: Este comando funciona apenas com *IMAGENS*.\n`,
            msgs: {
                wait: `[AGUARDE] 📸 O fundo da imagem está sendo removido e o sticker será enviado em breve.`,
                error_image: `Este comando é válido apenas para imagens.`,
                error_message: "Houve um erro ao obter os dados da mensagem."
            },
            function: stickerFunctions.ssfCommand
        },
        emojimix: {
            guide: `Ex: *${PREFIX}emojimix* 💩+😀 - Junta os dois emojis e transforma em sticker.\n\n`+
            `*Obs*: Nem todos os emojis são compátiveis, então vá tentando fazer combinações.\n`,
            msgs: {
                error: ''
            },
            function: stickerFunctions.emojimixCommand
        },
        snome: {
            guide: `Ex: Responda um *STICKER* com *${PREFIX}snome* pack, autor - Renomeia o nome do pack e do autor do sticker.`,
            msgs: {
                error_message: "Houve um erro ao obter os dados da mensagem."
            },
            function: stickerFunctions.snomeCommand
        }
    }

    return sticker
}