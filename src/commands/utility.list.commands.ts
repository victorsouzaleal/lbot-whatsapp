import { Bot } from "../interfaces/bot.interface.js"
import * as utilityFunctions from './utility.functions.commands.js'

export function commandsUtility(botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name
    // *********************************** COMANDOS - UTILIDADE ***********************************
    const utility = {
        steamverde: {
            guide: `Ex: *${PREFIX}steamverde GTA* - Exibe os downloads disponíveis do jogo GTA.\n`,
            msgs: {
                reply_title: '🏴‍☠️ *STEAM VERDE*\n'+
                '────────────────────────\n',
                reply_item: '*{p1}*\n'+
                '- *Enviado por*: {p2}\n'+
                '- *Data do envio*: {p3}\n'+
                '{p4}'+
                '- *Tamanho*: {p5}\n\n',
                link_torrent: '- *Torrent*: {p1}\n',
                link_direct: '- *Link direto*: {p1}\n',
                error_not_found: 'Nenhum jogo foi encontrado, tente pesquisar novamente com outros termos.'
            },
            function: utilityFunctions.steamverdeCommand
        },
        animes:{
            guide: `Ex: *${PREFIX}animes* - Exibe os ultimos lançamentos de episódios de anime.\n`,
            msgs: {
                reply_title: '🇯🇵 *Lançamento de animes*\n'+
                '────────────────────────\n',
                reply_item: '*{p1}*\n'+
                '- *Episódio*: {p2} \n'+
                '- *Link*: {p3} \n\n',
            },
            function: utilityFunctions.animesCommand
        },
        mangas:{
            guide: `Ex: *${PREFIX}mangas* - Exibe os ultimos lançamentos de capitulos de mangá.\n`,
            msgs: {
                reply_title: '🇯🇵 *Lançamento de mangás*\n'+
                '────────────────────────\n',
                reply_item: '*{p1}*\n'+
                '- *Capítulo*: {p2} \n'+
                '- *Link*: {p3} \n\n',
            },
            function: utilityFunctions.mangasCommand
        },
        brasileirao:{
            guide: `Ex: *${PREFIX}brasileirao* - Exibe a tabela e a rodada atual do Brasileirão Serie A.\n`+
            `Ex: *${PREFIX}brasileirao* B - Exibe a tabela e a rodada atual do Brasileirão Serie B.\n`,
            msgs: {
                error: '[❗] A série digitada não é suportada, atualmente são suportados apenas A e B.',
                reply_title: '⚽ *Brasileirão série {p1}*\n\n',
                reply_table_title: '🗒️ *Tabela*:\n'+
                '────────────────────────\n',
                reply_table_item: '- {p1}° {p2} - P:{p3} J:{p4} V:{p5}\n',
                reply_round_title: '\n📆 *Rodada Atual*:\n'+
                '────────────────────────\n',
                reply_match_item:'- Partida: {p1} x {p2}\n'+
                '- Data: {p3}\n'+
                '- Local: {p4}\n'+
                '- Resultado: {p5}\n\n'
            },
            function: utilityFunctions.brasileiraoCommand
        },
        encurtar: {
            guide: `Ex: *${PREFIX}encurtar* link - Encurta o link digitado.\n`,
            msgs: {
                reply: "✂️ *Encurtador de link*\n"+
                '────────────────────────\n'+
                "*Link*: {p1}\n"
            },
            function: utilityFunctions.encurtarCommand
        },
        upimg: {
            guide: `Ex: Envie/responda uma *imagem* com *${PREFIX}upimg* - Faz upload da imagem e retorna o link.\n`,
            msgs: {
                reply: "🖼️ *Upload de imagem*\n"+
                '────────────────────────\n'+
                "*Link*: {p1}\n"
            },
            function: utilityFunctions.upimgCommand
        },
        filmes: {
            guide: `Ex: *${PREFIX}filmes* - Exibe as tendências atuais de filmes.\n`,
            msgs: {
                reply: "🎬 *Têndencias de filmes*\n"+
                '────────────────────────\n'+
                "{p1}\n"
            },
            function: utilityFunctions.filmesCommand
        },
        series: {
            guide: `Ex: *${PREFIX}series* - Exibe as tendências atuais de séries.\n`,
            msgs: {
                reply: "📺 *Têndencias de séries*\n"+
                '────────────────────────\n'+
                "{p1}\n"
            },
            function: utilityFunctions.seriesCommand
        },
        /*
        ia: {
            guide: `Ex: *${PREFIX}ia* texto - Recebe uma resposta de IA de acordo com o texto.\n`,
            msgs: {
                reply: "🤖 *Inteligência Artificial*:\n"+
                '────────────────────────\n'+
                "*Resposta*: {p1}"
            },
            function: utilityFunctions.iaCommand
        },
        criarimg: {
            guide: `Ex: *${PREFIX}criarimg* texto - Criar uma imagem de acordo com o texto usando IA.\n`,
            msgs: {
                wait: '[AGUARDE] 📸 Sua imagem está sendo gerada pela IA, pode levar entre 20-40s.',
            },
            function: utilityFunctions.criarimgCommand
        },*/
        tabela: {
            guide: `Ex: *${PREFIX}tabela* - Exibe a tabela de caracteres para criação de nicks.\n`,
            msgs: {
                reply: "🔠 *Tabela de caracteres*\n"+
                '────────────────────────\n'+
                "{p1}"
            },
            function: utilityFunctions.tabelaCommand
        },
        rbg: {
            guide: `Ex: Envie/responda uma *imagem* com *${PREFIX}rbg* - Retira o fundo da imagem.\n\n`,
            msgs: {
                error_message: "Houve um erro ao obter os dados da mensagem.",
                error_only_image: "Este comando só funciona com *IMAGENS*.",
                wait: "[AGUARDE] 📸 O fundo da imagem está sendo removido.",
            },
            function: utilityFunctions.rbgCommand
        },
        ouvir: {
            guide: `Ex: Responda um áudio com *${PREFIX}ouvir* para transformar em texto.\n`,
            msgs: {
                error_audio_limit: "Houve um erro na transcrição, o áudio ultrapassa *1m30s*",
                error_key: "A chave de API do Deepgram ainda não foi configurada, relate ao administrador para ele realizar a configuração.",
                reply: "🔤 *Transcrição de áudio*\n"+
                '────────────────────────\n'+
                "*Texto*: {p1}"
            },
            function: utilityFunctions.ouvirCommand
        },
        audio: {
            guide: `Responda um aúdio com um desses comandos:\n\n`+
            `Ex: *${PREFIX}audio* grave - Torna audio mais grave e lento\n\n`+
            `Ex: *${PREFIX}audio* agudo - Torna o audio mais agudo e rapido\n\n`+
            `Ex: *${PREFIX}audio* estourar - Deixa o audio estourado\n\n`+
            `Ex: *${PREFIX}audio* volume  - Aumenta o volume em 4 vezes\n\n`+
            `Ex: *${PREFIX}audio* x2 - Acelera o audio em 2 vezes\n\n`+
            `Ex: *${PREFIX}audio* reverso - Reverte o audio\n\n`+
            `*Obs*: Este comando funciona apenas com *AUDIOS*.\n`,
            msgs: {
                error: "[❗] Houve um erro na conversão de audio"
            },
            function: utilityFunctions.audioCommand
        },
        traduz: {
            guide: `Ex: *${PREFIX}traduz* pt texto - Traduz o texto que foi digitado para *Português*.\n\n`+
            `Ex: *${PREFIX}traduz* en texto - Traduz o texto que foi digitado para *Inglês*.\n\n`+
            `Ex: Responda um *texto* com *${PREFIX}traduz* pt - Traduz o resto respondido para *Português*.\n\n`+
            `Ex: Responda um *texto* com *${PREFIX}traduz* en - Traduz o resto respondido para *Inglês*.\n\n`+
            `Idiomas suportados: \n`+
            `- 🇧🇷 Português (pt)\n`+
            `- 🇺🇸 Inglês (en)\n`+
            `- 🇯🇵 Japonês (ja)\n`+
            `- 🇮🇹 Italiano (it)\n`+
            `- 🇪🇸 Espanhol (es)\n`+
            `- 🇷🇺 Russo (ru)\n`+
            `- 🇰🇷 Coreano (ko)\n`,
            msgs: {
                error: "[❗] Sem dados do idioma ou idioma não suportado. Atualmente suportamos:\n\n"+
                `- 🇧🇷 Português - ${PREFIX}traduz pt\n`+
                `- 🇺🇸 Inglês - ${PREFIX}traduz en\n`+
                `- 🇯🇵 Japonês - ${PREFIX}traduz ja\n`+
                `- 🇮🇹 Italiano - ${PREFIX}traduz it\n`+
                `- 🇪🇸 Espanhol - ${PREFIX}traduz es\n`+
                `- 🇷🇺 Russo - ${PREFIX}traduz ru\n`+
                `- 🇰🇷 Coreano - ${PREFIX}traduz ko\n`,
                reply: "🔠 *Tradução* 🔠:\n"+
                '────────────────────────\n'+
                "*Texto*: {p1}\n\n"+
                "*Tradução*: {p2}"
            },
            function: utilityFunctions.traduzCommand
        },
        voz: {
            guide: `Ex: *${PREFIX}voz* pt texto - Manda um audio falando o texto digitado com a voz do Google em Português-Brasil.\n\n`+
            `Ex: Responda um texto com *${PREFIX}voz* pt - Manda um audio falando o texto respondido com a voz do Google em Português-Brasil.\n\n`+
            `Idiomas suportados: \n`+
            `- 🇧🇷 Português (pt)\n`+
            `- 🇺🇸 Inglês (en)\n`+
            `- 🇯🇵 Japonês (jp)\n`+
            `- 🇮🇹 Italiano (it)\n`+
            `- 🇪🇸 Espanhol (es)\n`+
            `- 🇷🇺 Russo (ru)\n`+
            `- 🇰🇷 Coreano (ko)\n`+
            `- 🇸🇪 Sueco (sv)\n`,
            msgs: {
                error_text: 'O texto para ser transformado em áudio está vazio.',
                error_text_long: 'O texto muito longo, há um limite de 500 caracteres.',
                error_not_supported: "O idioma escolhido não é suportado. Atualmente suportamos:\n\n"+
                `- 🇧🇷 Português - ${PREFIX}voz pt\n`+
                `- 🇺🇸 Inglês - ${PREFIX}voz en\n`+
                `- 🇯🇵 Japonês - ${PREFIX}voz ja\n`+
                `- 🇮🇹 Italiano - ${PREFIX}voz it\n`+
                `- 🇪🇸 Espanhol - ${PREFIX}voz es\n`+
                `- 🇷🇺 Russo - ${PREFIX}voz ru\n`+
                `- 🇰🇷 Coreano - ${PREFIX}voz ko\n`+
                `- 🇸🇪 Sueco - ${PREFIX}voz sv\n`
            },
            function: utilityFunctions.vozCommand
        },
        letra: {
            guide: `Ex: *${PREFIX}letra* nome-musica - Exibe a letra da música que você digitou.\n`,
            msgs: {
                reply: "🎼 *Letra de música*\n"+
                '────────────────────────\n'+
                "*Música*: {p1}\n"+
                "*Artista*: {p2}\n"+
                "*Letra*:\n"+
                "{p3}"
            },
            function: utilityFunctions.letraCommand
        },
        noticias: {
            guide: `Ex: *${PREFIX}noticias* - Exibe as notícias atuais.\n`,
            msgs: {
                reply_title: "🗞️ *Últimas notícias*\n"+
                '────────────────────────\n',
                reply_item: "*{p1}*\n"+
                "- *Publicado por*: {p2} há {p3}\n"+
                "- *Link*: {p4}\n\n"
            },
            function: utilityFunctions.noticiasCommand
        },
        calc: {
            guide: `Ex: *${PREFIX}calc* 8x8 - Exibe o resultado do cálculo.\n\n`+
            `Ex: *${PREFIX}calc* 1mm em 1km - Exibe o resultado do conversão de medidas.\n`,
            msgs: {
                reply: "🧮 *Calculadora*\n"+
                '────────────────────────\n'+
                "*Resultado*: {p1}"
            },
            function: utilityFunctions.calcCommand
        },
        pesquisa: {
            guide: `Ex: *${PREFIX}pesquisa* tema - Faz uma pesquisa com o tema que você digitar.\n`,
            msgs: {
                reply_title: "🔎 *Pesquisa*\n\n"+
                "*Você pesquisou por*: {p1}\n"+
                '────────────────────────\n',
                reply_item: "*{p1}*\n"+
                "- *Link*: {p2}\n\n",
            },
            function: utilityFunctions.pesquisaCommand
        },
        moeda: {
            guide: `Ex: *${PREFIX}moeda* real 20 - Converte 20 reais para outras moedas\n`+
            `Ex: *${PREFIX}moeda* dolar 20 - Converte 20 dólares para outras moedas.\n`+
            `Ex: *${PREFIX}moeda* euro 20 - Converte 20 euros para outras moedas.\n`,
            msgs: {
                reply_title: "💵 *Conversão de moeda*\n"+
                "*Tipo da moeda*: {p1}\n"+
                "*Valor*: {p2}\n"+
                '────────────────────────\n',
                reply_item: "- *Conversão*: {p1}\n"+
                "- *Valor convertido*: *{p2}* {p3}\n"+
                "- *Última atualização*: {p4}\n\n"
            },
            function: utilityFunctions.moedaCommand
        },
        clima: {
            guide: `Ex: *${PREFIX}clima* Rio de Janeiro - Mostra o clima atual e dos próximos dias para o Rio de Janeiro.\n`,
            msgs: {
                reply: "☀️ *Clima atual*\n\n"+
                '*Local escolhido*: {p1}\n'+
                '────────────────────────\n'+
                "- *Nome*: {p2}\n"+
                "- *Estado*: {p3}\n"+
                "- *País*: {p4}\n"+
                "- *Horário atual*: {p5}\n"+
                "- *Temperatura atual*: {p6}\n"+
                "- *Sensação térmica*: {p7}\n"+
                "- *Condição*: {p8}\n"+
                "- *Vento*: {p9}\n"+
                "- *Umidade*: {p10}\n"+
                "- *Nuvens*: {p11}\n\n",
                reply_forecast: "🗓️ Previsão *{p1}*\n"+
                "- *Max*: {p2}\n"+
                "- *Min*: {p3}\n"+
                "- *Condição*: {p4}\n"+
                "- *Vento máximo*: {p5}\n"+
                "- *Chuva?* {p6} de chance\n"+
                "- *Neve?* {p7} de chance\n"+
                "- *Nível UV*: {p8}\n\n"
            },
            function: utilityFunctions.climaCommand
        },
        ddd: {
            guide: `Ex: *${PREFIX}ddd* 21 - Exibe qual estado e região do DDD 21.\n\n`+
            `Ex: Responda com *${PREFIX}ddd* - Exibe qual estado e região do membro respondido.\n`,
            msgs: {
                error: "Esse comando só é aceito com números brasileiros.",
                reply: "📱 *Informação do DDD*\n"+
                '────────────────────────\n'+
                "*Estado*: {p1}\n"+ 
                "*Região*: {p2}\n"
            },
            function: utilityFunctions.dddCommand
        },
        qualanime: {
            guide: `Ex: Envie/responda uma imagem com *${PREFIX}qualanime* - Procura o anime pela imagem.\n\n`+
            `*Obs*: Este comando funciona apenas com *IMAGENS* e deve ser uma *CENA VÁLIDA DE ANIME*, *NÃO* podendo ser imagens com *baixa qualidade*, *wallpappers*, *imagens editadas/recortadas*.\n`,
            msgs: {
                wait: "⏳ Estou processando a imagem e pesquisando o anime.",
                error_similarity: "Nível de similaridade é muito baixo, certifique se enviar uma cena VÁLIDA de anime (Não funciona com imagens não oficiais, Wallpapers ou imagens recortadas e/ou baixa qualidade).",
                error_message: "Houve um erro ao obter os dados da mensagem",
                reply: "🔎 *Reconhecimento de anime*\n"+
                '────────────────────────\n'+
                "*Título*: {p1}\n"+
                "*Episódio*: {p2}\n"+
                "*Tempo da cena*: {p3} - {p4}\n"+
                "*Similaridade*: {p5}%\n"+
                "*Prévia*: {p6}",
            },
            function: utilityFunctions.qualanimeCommand
        },
        qualmusica: {
            guide: `Ex: Envie/responda um audio/video com *${PREFIX}qualmusica* - Procura a música tocada no audio/video.\n\n`+
            `*Obs*: Este comando funciona apenas com *AUDIO/VIDEO*.\n`,
            msgs: {
                error_message: "Houve um erro ao obter os dados da mensagem.",
                error_key: "A chave de API do ACRCloud ainda não foi configurada, relate ao administrador para ele realizar a configuração.",
                wait: "⏳ Em andamento , estou procurando sua música.",
                reply: "💿 *Reconhecimento de música*\n"+
                '────────────────────────\n'+
                "*Título*: {p1}\n"+
                "*Produtora*: {p2}\n"+
                "*Duração*: {p3}\n"+
                "*Lançamento*: {p4}\n"+
                "*Album*: {p5}\n"+
                "*Artistas*: {p6}\n",
            },
            function: utilityFunctions.qualmusicaCommand
        }
    }

    return utility
}