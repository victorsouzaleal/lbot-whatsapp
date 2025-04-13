import * as stickerFunctions from './sticker.functions.commands.js'

const stickerCommands = {
    s: {
        guide: `Ex: Envie/responda uma *IMAGEM/VIDEO* com *{$p}s* - Transforma em sticker.\n`+
        `Ex: Envie/responda uma *IMAGEM* com *{$p}s 1* - Transforma em sticker circular.\n`+
        `Ex: Envie/responda uma *IMAGEM* com *{$p}s 2* - Transforma em sticker sem perder a proporção.\n`,
        msgs: {
            error_limit: 'O video/gif deve ter no máximo 8 segundos.',
            error_message: "Houve um erro ao obter os dados da mensagem.",
            author_text: 'Solicitado por: {$1}'
        },
        function: stickerFunctions.sCommand
    },
    simg: {
        guide: `Ex: Responda um sticker com *{$p}simg* - Transforma o sticker em imagem.\n\n`+
        `*Obs*: Este comando funciona apenas com *STICKERS NÃO ANIMADOS*.\n`,
        msgs: {
            error_sticker: `Este comando pode ser usado apenas respondendo stickers.`
        },
        function: stickerFunctions.simgCommand
    },
    ssf: {
        guide: `Ex: Envie/responda uma *imagem* com *{$p}ssf* - Retira o fundo da imagem e transforma em sticker.\n\n`+
        `*Obs*: Este comando funciona apenas com *IMAGENS*.\n`,
        msgs: {
            wait: `[AGUARDE] 📸 O fundo da imagem está sendo removido e o sticker será enviado em breve.`,
            error_image: `Este comando é válido apenas para imagens.`,
            error_message: "Houve um erro ao obter os dados da mensagem.",
            author_text: 'Solicitado por: {$1}'
        },
        function: stickerFunctions.ssfCommand
    },
    emojimix: {
        guide: `Ex: *{$p}emojimix* 💩+😀 - Junta os dois emojis e transforma em sticker.\n\n`+
        `*Obs*: Nem todos os emojis são compátiveis, então vá tentando fazer combinações.\n`,
        msgs: {
            error_emoji: "O emoji {$1} não é compatível para essa união",
            error_emojis: "Os emoji {$1} e {$2} não são compatíveis para a união",
            error_not_found: "Não foi encontrada uma união válida para esses emojis",
            author_text: 'Solicitado por: {$1}'
        },
        function: stickerFunctions.emojimixCommand
    },
    snome: {
        guide: `Ex: Responda um *STICKER* com *{$p}snome* pack, autor - Renomeia o nome do pack e do autor do sticker.`,
        msgs: {
            error_message: "Houve um erro ao obter os dados da mensagem."
        },
        function: stickerFunctions.snomeCommand
    }
}

export default stickerCommands