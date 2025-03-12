import * as infoCommand from "./category-info.commands.js"
import * as utilityCommand from './category-utility.commands.js'
import * as stickerCommand from './category-sticker.commands.js'
import * as downloadCommand from './category-download.commands.js'
import * as funCommand from './category-fun.commands.js'
import * as groupCommand from './category-group.commands.js'
import { Bot } from "../interfaces/bot.interface.js"

export default function getCommands (botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name 
    const GUIDE_TITLE = `❔ USO DO COMANDO ❔\n\n`
    return {
        info: { // ************* INFO *************
            menu: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}menu* - Exibe o menu de comandos gerais.\n`,
                msgs: {
                    reply: "Olá, *{p1}*\n"+
                    "Tipo de Usuário : *{p2}*\n"+
                    "Comandos feitos : *{p3}*\n",
                    error_user_not_found: "Usuário não foi encontrado no banco de dados.",
                    error_invalid_option: "A opção selecionada não existe no menu.",
                },
                function : infoCommand.menuCommand
            },
            reportar: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}reportar* mensagem - Reporta uma mensagem para a administração do Bot.\n`,
                msgs: {
                    reply: `✅ Obrigado, seu problema foi reportado com sucesso e será analisado pelo dono.`,
                    error: 'Não foi possível enviar a mensagem para o dono, pois ele ainda não está cadastrado.',
                    reply_admin: "[ 🤖 REPORTAR ⚙️]\n\n"+
                    "*Usuário* : {p1}\n"+
                    "*Contato* : http://wa.me/{p2}\n"+
                    "*Problema* : {p3}\n"
                },
                function: infoCommand.reportarCommand
            },
            meusdados: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}meusdados* - Exibe seus dados gerais como comandos, mensagens, tipo de usuário, etc.\n`,
                msgs: {
                    reply: "[🤖*SEUS DADOS DE USO*🤖]\n\n"+
                    "Tipo de usuário : *{p1}*\n"+
                    "Nome : *{p2}*\n"+
                    "Total de comandos usados : *{p3}* comandos\n",
                    reply_group: "[🤖*SEUS DADOS DE USO*🤖]\n\n"+
                    "Tipo de usuário : *{p1}*\n"+
                    "Nome : *{p2}*\n"+
                    "Total de comandos usados : *{p3}* comandos\n"+
                    "Mensagens neste grupo : *{p4}* mensagens\n",
                    error_not_found: 'Usuário não foi encontrado.'
                },
                function: infoCommand.meusdadosCommand
            },
            info: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}info* - Exibe as informações do bot, dono, etc.\n`,
                msgs: {
                    reply: "*Nome do bot* : {p1}\n"+
                    "*Online desde* : {p2}\n"+
                    "*Comandos executados* : {p3}\n"+
                    "*Contato do administradores* : \n"+
                    "{p4}"+
                    "*Versão atual* : {p5}\n"+
                    "*Criador* : victorsouzaleal\n"+
                    "*GitHub* : https://github.com/victorsouzaleal/lbot-whatsapp\n"
                },
                function: infoCommand.infoCommand
            }
        },

        utility: { // ************* UTILITY *************
            animes:{
                guide: GUIDE_TITLE +`Ex: *${PREFIX}animes* - Exibe os ultimos lançamentos de episódios de anime.\n`,
                msgs: {
                    reply_title: '🇯🇵 LANÇAMENTO DE ANIMES 🇯🇵 \n\n',
                    reply_item: '- Nome: {p1} \n'+
                    '- Episódio: {p2} \n'+
                    '- Link: {p3} \n\n',
                },
                function : utilityCommand.animesCommand
            },
            mangas:{
                guide: GUIDE_TITLE +`Ex: *${PREFIX}mangas* - Exibe os ultimos lançamentos de capitulos de mangá.\n`,
                msgs: {
                    reply_title: '🇯🇵 LANÇAMENTO DE MANGÁS 🇯🇵 \n\n',
                    reply_item: '- Nome: {p1} \n'+
                    '- Capítulo: {p2} \n'+
                    '- Link: {p3} \n\n',
                },
                function : utilityCommand.mangasCommand
            },
            brasileirao:{
                guide: GUIDE_TITLE +`Ex: *${PREFIX}brasileirao* - Exibe a tabela e a rodada atual do Brasileirão Serie A.\n`+
                `Ex: *${PREFIX}brasileirao* B - Exibe a tabela e a rodada atual do Brasileirão Serie B.\n`,
                msgs: {
                    error: '[❗] A série digitada não é suportada, atualmente são suportados apenas A e B.',
                    reply_title: '⚽ BRASILEIRÃO SERIE {p1} ⚽ \n\n',
                    reply_table_title: 'Tabela :\n\n',
                    reply_table_item: '- {p1}° {p2} - P:{p3} J:{p4} V:{p5}\n',
                    reply_round_title: 'Rodada Atual :\n\n',
                    reply_match_item: '- Partida : {p1} x {p2} \n'+
                    '- Data : {p3} \n'+
                    '- Local : {p4} \n'+
                    '- Resultado : {p5}\n\n'
                },
                function : utilityCommand.brasileiraoCommand
            },
            encurtar : {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}encurtar* link - Encurta o link digitado.\n`,
                msgs: {
                    reply: "✂️ ENCURTADOR DE LINKS ✂️\n\n"+
                    "*Link :* {p1}\n"
                },
                function : utilityCommand.encurtarCommand
            },
            upimg: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma *imagem* com *${PREFIX}upimg* - Faz upload da imagem e retorna o link.\n`,
                msgs: {
                    reply: "🖼️ UPLOAD DE IMAGEM 🖼️\n\n"+
                    "*Link :* {p1}\n"
                },
                function : utilityCommand.upimgCommand
            },
            filmes: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}filmes* - Exibe as tendências atuais de filmes.\n`,
                msgs: {
                    reply: "🎬 TÊNDENCIAS DE FILMES 🎬\n\n"+
                    "{p1}\n"
                },
                function : utilityCommand.filmesCommand
            },
            series: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}series* - Exibe as tendências atuais de séries.\n`,
                msgs: {
                    reply: "📺 TÊNDENCIAS DE SÉRIES 📺\n\n"+
                    "{p1}\n"
                },
                function : utilityCommand.seriesCommand
            },
            /*
            ia : {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}ia* texto - Recebe uma resposta de IA de acordo com o texto.\n`,
                msgs: {
                    reply: "🤖 Resposta da IA :\n\n"+
                    "{p1}"
                },
                function : utilityCommand.iaCommand
            },
            criarimg: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}criarimg* texto - Criar uma imagem de acordo com o texto usando IA.\n`,
                msgs: {
                    wait: '[AGUARDE] 📸 Sua imagem está sendo gerada pela IA, pode levar entre 20-40s.',
                },
                function : infoCommand.menuCommand
            },*/
            tabela: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}tabela* - Exibe a tabela de letras para criação de nicks.\n`,
                msgs: {
                    reply: "🤖 Tabela de Nicks :\n\n"+
                    "{p1}"
                },
                function : utilityCommand.tabelaCommand
            },
            rbg: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma *imagem* com *${PREFIX}rbg* - Retira o fundo da imagem.\n\n`,
                msgs: {
                    error_message: "Houve um erro ao obter os dados da mensagem.",
                    error_only_image : "Este comando só funciona com IMAGENS.",
                    wait: "[AGUARDE] 📸 O fundo da imagem está sendo removido.",
                },
                function : utilityCommand.rbgCommand
            },
            ouvir: {
                guide: GUIDE_TITLE +`Ex: Responda um áudio com *${PREFIX}ouvir* para transformar em texto.\n`,
                msgs: {
                    error_audio_limit: "Houve um erro na transcrição, o áudio ultrapassa *1m30s*",
                    error_key: "A chave de API do Deepgram ainda não foi configurada, relate ao administrador para ele realizar a configuração.",
                    reply: "🔤 Transcrição de áudio :\n\n"+
                    "-- {p1}"
                },
                function : utilityCommand.ouvirCommand
            },
            audio: {
                guide: GUIDE_TITLE +`Responda um aúdio com um desses comandos :\n\n`+
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
                function : utilityCommand.audioCommand
            },
            traduz: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}traduz* pt texto - Traduz o texto que foi digitado para *Português*.\n\n`+
                `Ex: *${PREFIX}traduz* en texto - Traduz o texto que foi digitado para *Inglês*.\n\n`+
                `Ex: Responda um *texto* com *${PREFIX}traduz* pt - Traduz o resto respondido para *Português*.\n\n`+
                `Ex: Responda um *texto* com *${PREFIX}traduz* en - Traduz o resto respondido para *Inglês*.\n\n`+
                `Idiomas suportados : \n`+
                `- 🇧🇷 Português (pt)\n`+
                `- 🇺🇸 Inglês (en)\n`+
                `- 🇯🇵 Japonês (ja)\n`+
                `- 🇮🇹 Italiano (it)\n`+
                `- 🇪🇸 Espanhol (es)\n`+
                `- 🇷🇺 Russo (ru)\n`+
                `- 🇰🇷 Coreano (ko)\n`,
                msgs: {
                    error: "[❗] Sem dados do idioma ou idioma não suportado. Atualmente suportamos :\n\n"+
                    `- 🇧🇷 Português - ${PREFIX}traduz pt\n`+
                    `- 🇺🇸 Inglês - ${PREFIX}traduz en\n`+
                    `- 🇯🇵 Japonês - ${PREFIX}traduz ja\n`+
                    `- 🇮🇹 Italiano - ${PREFIX}traduz it\n`+
                    `- 🇪🇸 Espanhol - ${PREFIX}traduz es\n`+
                    `- 🇷🇺 Russo - ${PREFIX}traduz ru\n`+
                    `- 🇰🇷 Coreano - ${PREFIX}traduz ko\n`,
                    reply: "🔠 *Resposta - Tradução* 🔠 :\n\n"+
                    "*Texto*: {p1}\n\n"+
                    "*Tradução* : {p2}"
                },
                function : utilityCommand.traduzCommand
            },
            voz: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}voz* pt texto - Manda um audio falando o texto digitado com a voz do Google em Português-Brasil.\n\n`+
                `Ex: Responda um texto com *${PREFIX}voz* pt - Manda um audio falando o texto respondido com a voz do Google em Português-Brasil.\n\n`+
                `Idiomas suportados : \n`+
                `- 🇧🇷 Português (pt)\n`+
                `- 🇺🇸 Inglês (en)\n`+
                `- 🇯🇵 Japonês (jp)\n`+
                `- 🇮🇹 Italiano (it)\n`+
                `- 🇪🇸 Espanhol (es)\n`+
                `- 🇷🇺 Russo (ru)\n`+
                `- 🇰🇷 Coreano (ko)\n`+
                `- 🇸🇪 Sueco (sv)\n`,
                msgs: {
                    error_text : 'O texto para ser transformado em áudio está vazio.',
                    error_text_long: 'O texto muito longo, há um limite de 500 caracteres.',
                    error_not_supported: "O idioma escolhido não é suportado. Atualmente suportamos :\n\n"+
                    `- 🇧🇷 Português - ${PREFIX}voz pt\n`+
                    `- 🇺🇸 Inglês - ${PREFIX}voz en\n`+
                    `- 🇯🇵 Japonês - ${PREFIX}voz ja\n`+
                    `- 🇮🇹 Italiano - ${PREFIX}voz it\n`+
                    `- 🇪🇸 Espanhol - ${PREFIX}voz es\n`+
                    `- 🇷🇺 Russo - ${PREFIX}voz ru\n`+
                    `- 🇰🇷 Coreano - ${PREFIX}voz ko\n`+
                    `- 🇸🇪 Sueco - ${PREFIX}voz sv\n`
                },
                function : utilityCommand.vozCommand
            },
            letra: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}letra* nome-musica - Exibe a letra da música que você digitou.\n`,
                msgs: {
                    reply: "🎼 LETRA DE MÚSICA 🎼\n\n"+
                    "Música : *{p1}*\n"+
                    "Artista : *{p2}*\n\n"+
                    "{p3}"
                },
                function : utilityCommand.letraCommand
            },
            noticias: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}noticias* - Exibe as notícias atuais.\n`,
                msgs: {
                    reply_title: "〘🗞️ ULTIMAS NOTÍCIAS 〙\n\n",
                    reply_item: "➥ 📰 *{p1}* \n"+
                    "Publicado por *{p2}* há *{p3}*\n"+
                    "*Link* : {p4}\n\n"
                },
                function : utilityCommand.noticiasCommand
            },
            /*
            rastreio: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}rastreio* PBXXXXXXXXXXX - Exibe o rastreio da encomenda dos correios que você digitou.\n`,
                msgs: {
                    error: 'Código de rastreio deve ter 13 digitos.',
                    reply_title: "📦📦*RASTREIO*📦📦\n\n",
                    reply_item: "Status : {p1}\n"+
                    "Data : {p2}\n"+
                    "Hora : {p3}\n"+
                    "{p4}\n"
                },
                function : utilityCommand.rastreioCommand
            },*/
            calc: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}calc* 8x8 - Exibe o resultado do cálculo.\n\n`+
                `Ex: *${PREFIX}calc* 1mm em 1km - Exibe o resultado do conversão de medidas.\n`,
                msgs: {
                    reply: "🧮 O resultado é *{p1}* "
                },
                function : utilityCommand.calcCommand
            },
            pesquisa: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}pesquisa* tema - Faz uma pesquisa com o tema que você digitar.\n`,
                msgs: {
                    reply_title: "🔎 Resultados da pesquisa de : *{p1}*🔎\n\n",
                    reply_item: "🔎 {p1}\n"+
                    "*Link* : {p2}\n\n",
                },
                function : utilityCommand.pesquisaCommand
            },
            moeda: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}moeda* real 20 - Converte 20 reais para outras moedas\n\n`+
                `Ex: *${PREFIX}moeda* dolar 20 - Converte 20 dólares para outras moedas.\n\n`+
                `Ex: *${PREFIX}moeda* euro 20 - Converte 20 euros para outras moedas.\n`,
                msgs: {
                    reply_title: "💵 Conversão de {p1} - *{p2}*\n",
                    reply_item: "----------------------------\n"+ 
                    "*Conversão* : {p1}\n"+
                    "*Valor convertido* : *{p2}* {p3}\n"+
                    "*Última atualização* : {p4}\n\n"
                },
                function : utilityCommand.moedaCommand
            },
            clima: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}clima* Rio de Janeiro - Mostra o clima atual e dos próximos dias para o Rio de Janeiro.\n`,
                msgs: {
                    reply: "☀️ CLIMA ATUAL ☀️\n\n"+
                    "Nome : {p1}\n"+
                    "Estado : {p2}\n"+
                    "País : {p3}\n"+
                    "Horário atual : {p4}\n"+
                    "Temperatura atual : {p5}\n"+
                    "Sensação térmica : {p6}\n"+
                    "Condição : {p7}\n"+
                    "Vento : {p8}\n"+
                    "Umidade : {p9}\n"+
                    "Nuvens : {p10}\n\n",
                    reply_forecast: "🗓️ Previsão {p1} 🗓️\n\n"+
                    "Max : {p2}\n"+
                    "Min : {p3}\n"+
                    "Condição : {p4}\n"+
                    "Vento máximo : {p5}\n"+
                    "Chuva? {p6} de chance\n"+
                    "Neve? {p7} de chance\n"+
                    "Nível UV : {p8}\n\n"
                },
                function : utilityCommand.climaCommand
            },
            ddd: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}ddd* 21 - Exibe qual estado e região do DDD 21.\n\n`+
                `Ex: Responda com *${PREFIX}ddd* - Exibe qual estado e região do membro respondido.\n`,
                msgs: {
                    error: "Esse comando só é aceito com números brasileiros.",
                    reply: "📱 Estado : *{p1}* / Região : *{p2}*"
                },
                function : utilityCommand.dddCommand
            },
            qualanime: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma imagem com *${PREFIX}qualanime* - Procura o anime pela imagem.\n\n`+
                `*Obs*: Este comando funciona apenas com *IMAGENS* e deve ser uma *CENA VÁLIDA DE ANIME*, *NÃO* podendo ser imagens com *baixa qualidade*, *wallpappers*, *imagens editadas/recortadas*.\n`,
                msgs: {
                    wait: "⏳ Estou processando a imagem e pesquisando o anime.",
                    error_similarity: "Nível de similaridade é muito baixo, certifique se enviar uma cena VÁLIDA de anime (Não funciona com imagens não oficiais, Wallpapers ou imagens recortadas e/ou baixa qualidade).",
                    error_message: "Houve um erro ao obter os dados da mensagem",
                    reply: "〘 Pesquisa de anime 〙\n\n"+
                    "Título: *{p1}*\n"+
                    "Episódio: {p2}\n"+
                    "Tempo da cena: *{p3} - {p4}*\n"+
                    "Similaridade: *{p5}%*\n"+
                    "Prévia : {p6}",
                },
                function : utilityCommand.qualanimeCommand
            },
            qualmusica: {
                guide: GUIDE_TITLE +`Ex: Envie/responda um audio/video com *${PREFIX}qualmusica* - Procura a música tocada no audio/video.\n\n`+
                `*Obs*: Este comando funciona apenas com *AUDIO/VIDEO*.\n`,
                msgs: {
                    error_message: "Houve um erro ao obter os dados da mensagem.",
                    error_key: "A chave de API do ACRCloud ainda não foi configurada, relate ao administrador para ele realizar a configuração.",
                    wait: "⏳ Em andamento , estou procurando sua música.",
                    reply: "💿 Reconhecimento de Música\n\n"+
                    "Título: *{p1}*\n"+
                    "Produtora: {p2}\n"+
                    "Duração : *{p3}*\n"+
                    "Lançamento: *{p4}*\n"+
                    "Album: *{p5}*\n"+
                    "Artistas: *{p6}*\n",
                },
                function : utilityCommand.qualmusicaCommand
            }
        },
        
        sticker: { // ************* STICKER *************
            s: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma *IMAGEM/VIDEO* com *${PREFIX}s* - Transforma em sticker.\n`+
                `Ex: Envie/responda uma *IMAGEM* com *${PREFIX}s 1* - Transforma em sticker circular.\n`+
                `Ex: Envie/responda uma *IMAGEM* com *${PREFIX}s 2* - Transforma em sticker sem perder a proporção.\n`,
                msgs: {
                    error_limit: 'O video/gif deve ter no máximo 8 segundos.',
                    error_message: "Houve um erro ao obter os dados da mensagem."
                },
                function : stickerCommand.sCommand
            },
            simg: {
                guide: GUIDE_TITLE +`Ex: Responda um sticker com *${PREFIX}simg* - Transforma o sticker em imagem.\n\n`+
                `*Obs*: Este comando funciona apenas com *STICKERS NÃO ANIMADOS*.\n`,
                msgs: {
                    error_sticker: `Este comando pode ser usado apenas respondendo stickers.`
                },
                function : stickerCommand.simgCommand
            },
            ssf: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma *imagem* com *${PREFIX}ssf* - Retira o fundo da imagem e transforma em sticker.\n\n`+
                `*Obs*: Este comando funciona apenas com *IMAGENS*.\n`,
                msgs: {
                    wait: `[AGUARDE] 📸 O fundo da imagem está sendo removido e o sticker será enviado em breve.`,
                    error_image: `Este comando é válido apenas para imagens.`,
                    error_message: "Houve um erro ao obter os dados da mensagem."
                },
                function : stickerCommand.ssfCommand
            },
            emojimix: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}emojimix* 💩+😀 - Junta os dois emojis e transforma em sticker.\n\n`+
                `*Obs*: Nem todos os emojis são compátiveis, então vá tentando fazer combinações.\n`,
                msgs: {
                    error: ''
                },
                function : stickerCommand.emojimixCommand
            },
            snome: {
                guide: GUIDE_TITLE +`Ex: Responda um *STICKER* com *${PREFIX}snome* pack, autor - Renomeia o nome do pack e do autor do sticker.`,
                msgs: {
                    error_message: "Houve um erro ao obter os dados da mensagem."
                },
                function : stickerCommand.snomeCommand
            }
        },
        
        fun: { // ************* FUN *************
            mascote: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}mascote* - Exibe o inigualável e onipotente WhatsApp Jr.\n`,
                msgs: {
                    reply: 'WhatsApp Jr.'
                },
                function : funCommand.mascoteCommand
            },
            simi: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}simi* frase  - Envia um texto para o SimSimi responder.\n`,
                msgs: {
                    reply: `{p1} - 🐤 *SIMI* : \n\n`+
                    `{p2}`,
                },
                function : funCommand.simiCommand
            },
            viadometro: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}viadometro* @membro - Mede o nível de viadagem do membro mencionado.\n\n`+
                `Ex: Responder com *${PREFIX}viadometro* - Mede o nível de viadagem do membro respondido.\n`,
                msgs: {
                    answers: [' 0%\n\n - ESSE É MACHO ',
                    '██                 20% \n\n - HMMMMM ',
                    '████             40%\n\n - JÁ MAMOU O PRIMO',
                    '██████         60%\n\n - EITA MAMOU O BONDE',
                    '████████     80%\n\n - JÁ SENTOU EM ALGUEM',
                    '██████████ 100%\n\n - BIXONA ALERTA VERMELHO CUIDADO COM SEUS ORGÃOS SEXUAIS'],
                    error_mention: "Apenas UM membro deve ser marcado por vez.",
                    error_message: "Houve um erro ao obter os dados da mensagem.",
                    reply: "🧩 *VIADÔMETRO* - {p1}"
                },
                function : funCommand.viadometroCommand
            },
            detector: {
                guide: GUIDE_TITLE +`Ex: Responder com *${PREFIX}detector* - Exibe o resultado da máquina da verdade.\n`,
                msgs: {
                    wait: "⏳ Calibrando a máquina da verdade",
                    error_message: "Houve um erro ao obter os dados da mensagem."
                },
                function : funCommand.detectorCommand
            },
            roletarussa: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}roletarussa* - Bane um membro aleatório do grupo.\n\n`+
                `*Obs*: Comando apenas para administradores, pode banir qualquer um exceto o dono do grupo e o BOT.\n`,
                msgs: {
                    error: "Não existem membros válidos para participarem da roleta.",
                    wait: "🎲 Sorteando uma vítima 🎲",
                    reply: "🔫 Você foi o escolhido @{p1}, até a próxima."
                },
                function : funCommand.roletarussaCommand
            },
            casal: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}casal* - Escolhe 2 pessoas aleatórias do grupo para formar um casal.\n`,
                msgs: {
                    error: "Este comando precisa de no mínimo 2 membros no grupo.",
                    reply: "👩‍❤️‍👨 Está rolando um clima entre @{p1} e @{p2}"
                },
                function : funCommand.casalCommand
            },
            caracoroa: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}caracoroa* cara - Escolhe cara e joga a moeda.\n\n`+
                `Ex: *${PREFIX}caracoroa* coroa - Escolhe coroa e joga a moeda.\n`,
                msgs: {
                    wait: "🕹️ Lançando a moeda 🪙",
                    reply_victory: "🕹️ *VITÓRIA!* 🕹️\n\n"+
                    "O resultado caiu *{p1}*\n",
                    reply_defeat: "🕹️ *DERROTA!* 🕹️\n\n"+
                    "O resultado caiu *{p1}*\n"
                },
                function : funCommand.caracoroaCommand
            },
            ppt: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}ppt* pedra - Escolhe pedra, para jogar pedra, papel ou tesoura.\n\n`+
                `Ex: *${PREFIX}ppt* papel - Escolhe papel, para jogar pedra, papel ou tesoura.\n\n`+
                `Ex: *${PREFIX}ppt* tesoura - Escolhe tesoura, para jogar pedra, papel ou tesoura.\n`,
                msgs: {
                    error: "[❗] Você deve escolher entre *pedra*, *papel*  ou *tesoura*",
                    reply_victory: "🕹️ *VITÓRIA!* 🕹️\n\n"+
                    "Você escolheu {p1} e o bot escolheu {p2}\n",
                    reply_defeat: "🕹️ *DERROTA!* 🕹️\n\n"+
                    "Você escolheu {p1} e o bot escolheu {p2}\n",
                    reply_draw: "🕹️ *EMPATE!* 🕹️\n\n"+
                    "Você escolheu {p1} e o bot escolheu {p2}\n"
                },
                function : funCommand.pptCommand
            },
            gadometro: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}gadometro* @membro - Mede o nível de gadisse do membro mencionado.\n\n`+
                `Ex: Responder com *${PREFIX}gadometro* - Mede o nível de gadisse do membro respondido.\n`,
                msgs: {
                    answers : [' 0%\n\n - ESSE NÃO É GADO ',
                    '🐃 20% \n\n - GADO APRENDIZ, TÁ NO CAMINHO ',
                    '🐃🐃 40%\n\n - GADO INTERMEDIÁRIO, JÁ INVADE PV DE UMAS E PENSA EM PAGAR PACK DE PEZINHO',
                    '🐃🐃🐃 60%\n\n - CUIDADO : GADO EXPERIENTE, INVADE PV E FALA LINDA EM TODAS FOTOS',
                    '🐃🐃🐃🐃 80%\n\n - ALERTA : GADO MASTER, SÓ APARECE COM MULHER ON',
                    '🐃🐃🐃🐃🐃 100%\n\n - PERIGO : GADO MEGA BLASTER ULTRA PAGA BOLETO DE MULHER QUE TEM NAMORADO'],
                    error_mention: "Apenas UM membro deve ser marcado por vez.",
                    error_message: "Houve um erro ao obter os dados da mensagem.",
                    reply: "🧩 *GADÔMETRO* - {p1}"
                },
                function : funCommand.gadometroCommand
            },
            bafometro: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}bafometro* @membro - Mede o nível de alcool do membro mencionado.\n\n`+
                `Ex: Responder com *${PREFIX}bafometro* - Mede o nível de alcool do membro respondido.\n`,
                msgs: {
                    answers : [' 0%\n\n - ESTÁ SÓBRIO ',
                    '🍺  20% \n\n - TOMOU UM GORÓZINHO ',
                    '🍺🍺  40%\n\n - JÁ TÁ FICANDO MEIO CHAPADO E FALANDO BOSTA',
                    '🍺🍺🍺  60%\n\n - TÁ MAMADO E COMEÇANDO A FAZER MERDA',
                    '🍺🍺🍺🍺  80%\n\n - TÁ LOUCÃO NEM CONSEGUE DIFERENCIAR MULHER E HOMEM',
                    '🍺🍺🍺🍺🍺  100%\n\n - ALERTA: ESTÁ FORA DE SI , BEIJANDO MENDIGO E CACHORRO DE RUA'],
                    reply: "🧩 *BAFÔMETRO* - {p1}",
                    error_mention: "Apenas UM membro deve ser marcado por vez.",
                    error_message: "Houve um erro ao obter os dados da mensagem.",
                },
                function : funCommand.bafometroCommand
            },
            top5: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}top5* tema - Exibe uma ranking de 5 membros aleatórios com o tema que você escolher.\n`,
                msgs: {
                    error_members: "O grupo deve ter no mínimo 5 membros para usar este comando.",
                    reply_title: "╔══✪〘🏆 TOP 5 {p1} 🏆 〙\n╠\n",
                    reply_item: "╠➥ {p1} {p2}° Lugar @{p3}\n"
                },
                function : funCommand.top5Command
            },
            par: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}par* @membro1 @membro2 - Mede o nível de compatibilidade dos 2 membros mencionados.\n`,
                msgs: {
                    answers: [' *0%*\n - NÃO COMBINAM ',
                    '❤️ *20%* \n - HMMM TALVEZ ',
                    '❤️❤️ *40%*\n - PODE ROLAR ALGO SÉRIO', 
                    '❤️❤️❤️ *60%*\n - UIA ESSES DOIS TEM FUTURO',
                    '❤️❤️❤️❤️ *80%*\n - ESSES DOIS TEM QUÍMICA, TALVEZ UM CASAMENTO EM BREVE', 
                    '❤️❤️❤️❤️❤️ *100%*\n - CASAL PERFEITO: PREPAREM-SE PARA VIVER ATÉ A VELHICE JUNTOS',
                    ],
                    reply: "👩‍❤️‍👨 PAR - @{p1} & @{p2}\n\n{p3}"
                },
                function : funCommand.parCommand
            },
            chance: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}chance de ficar rico* - Calcula sua chance de um tema aleatório a sua escolha.\n`,
                msgs: {
                    reply: "🧩 *CHANCE* - Você tem *{p1}%* de chance {p2}"
                },
                function : funCommand.chanceCommand
            }, 
            frase: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}fch* - Exibe uma frase aleatória montada com as cartas do jogo Cartas contra a Humanidade.\n`,
                msgs: {
                    reply: "🙊💬 *FRASES DO WHATSAPP JR.*\n\n - {p1}",
                },
                function : funCommand.fraseCommand
            }
        },
        
        download: { // ************* DOWNLOAD *************
            play: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}play* musica - Faz download de uma música do Youtube e envia como audio.\n`,
                msgs: {
                    wait: "[AGUARDE] 🎧 Sua música está sendo baixada e processada.\n\n"+
                    "Titulo: *{p1}*\n"+
                    "Duração: *{p2}*",
                    error_limit: "O vídeo deve ter no máximo *6 minutos*",
                    error_live: "Esse vídeo não pode ser convertido em áudio, lives não são aceitas."
                },
                function : downloadCommand.playCommand
            },
            yt: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}yt* titulo - Faz download de um video do Youtube com o titulo digitado e envia.\n`,
                msgs: {
                    wait: "[AGUARDE] 🎥 Seu video está sendo baixado e processado.\n\n"+
                    "Titulo: *{p1}*\n"+
                    "Duração: *{p2}*",
                    error_limit: "O video deve ter no máximo *6 minutos*",
                    error_live: "Houve um erro de download, o bot não aceita download de lives."
                },
                function : downloadCommand.ytCommand
            },
            fb: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}fb* link - Faz download de um video do Facebook pelo link digitado e envia.\n`,
                msgs: {
                    wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                    "Titulo: *{p1}*\n"+
                    "Duração: *{p2}*",
                    error_limit: "O video deve ter no máximo *6 minutos*",
                },
                function : downloadCommand.fbCommand
            },
            ig: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}ig* link - Faz download de videos/fotos do Instagram pelo link digitado e envia.\n`,
                msgs: {
                    wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                    "Autor: *{p1}* (@{p2})\n"+
                    "Descrição: {p3}\n"+
                    "Likes: *{p4}*"
                },
                function : downloadCommand.igCommand
            },
            x: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}x* link - Faz download de um video/imagem do X pelo link digitado e envia.\n`,
                msgs: {
                    wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                    "Post: {p1}",
                },
                function : downloadCommand.xCommand
            },
            tk: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}tk* link - Faz download de um video do Tiktok pelo link digitado e envia.\n`,
                msgs: {
                    wait: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                    "Perfil: *@{p1}*\n"+
                    "Descrição: *{p2}*\n",
                },
                function : downloadCommand.tkCommand
            },
            img: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}img* tema - Envia uma imagem com o tema que você digitar.\n`,
                msgs: {
                    error: 'Não foi possível obter nenhuma imagem, tente novamente com outra pesquisa.',
                },
                function : downloadCommand.imgCommand
            }
        },
        
        group: { // ************* GROUP *************
            grupo: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}grupo* - Exibe os dados atuais do grupo.\n`,
                msgs: {
                    reply_title: "👥 *DADOS GERAIS DO GRUPO* \n\n"+
                    "*Nome*: {p1}\n"+
                    "*Participantes*: {p2}\n"+
                    "*Admins*: {p3} \n"+
                    "*Descrição/Regras*: {p4}\n\n"+
                    "*Comandos executados*: {p5} \n\n",
                    reply_resource_title: '🧰 *RECURSOS DO GRUPO* \n\n',
                    reply_item_welcome_on: "*Boas vindas*: ✅\n",
                    reply_item_welcome_off: "*Boas vindas*: ❌\n",
                    reply_item_mute_on : "*Mutar*: ✅\n",
                    reply_item_mute_off : "*Mutar*: ❌\n",
                    reply_item_autosticker_on : "*Auto-Sticker*: ✅\n",
                    reply_item_autosticker_off : "*Auto-Sticker*: ❌\n",
                    reply_item_antilink_on : "*Anti-Link*: ✅\n",
                    reply_item_antilink_off : "*Anti-Link*: ❌\n",
                    reply_item_antifake_on : "*Anti-Fake*: ✅\n"+
                    "- *Prefixos liberados* : {p1}\n",
                    reply_item_antifake_off : "*Anti-Fake*: ❌\n",
                    reply_item_antispam_on : "*Anti-Spam*: ✅\n"+
                    "- Máx: *{p1}* msgs / *{p2}* s \n",
                    reply_item_antispam_off : "*Anti-Spam*: ❌\n",
                    reply_item_counter_on : "*Contador*: ✅\n"+
                    "- {p1}\n",
                    reply_item_counter_off : "*Contador*: ❌\n",
                    reply_item_blockcmds_on : "*Bloqueio de comandos*: ✅\n"+
                    "- *{p1}*\n",
                    reply_item_blockcmds_off : "*Bloqueio de comandos*: ❌\n",
                    reply_item_blacklist : "*Lista Negra*: *{p1}*\n"
                },
                function : groupCommand.grupoCommand
            },
            fotogrupo: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma *imagem* com *${PREFIX}fotogrupo* - Altera a foto do grupo.\n\n`,
                msgs: {
                    reply: "🤖✅ A foto do GRUPO foi alterada com sucesso.",
                },
                function : groupCommand.fotogrupoCommand
            },
            addlista: {
                guide: GUIDE_TITLE +`Ex: Responda alguém com *${PREFIX}addlista* - Adiciona o numero de quem foi respondido a lista negra e bane em seguida.\n\n`+
                `Ex: Marque alguém com *${PREFIX}addlista* - Adiciona o numero de quem foi marcado a lista negra e bane em seguida.\n\n`+
                `Ex: *${PREFIX}addlista* +55219xxxx-xxxx - Adiciona o número digitado a lista negra do grupo e bane em seguida.\n.`,
                msgs: {
                    reply: "✅ O número desse usuário foi adicionado á lista negra e será banido do grupo caso ainda esteja aqui.",
                    error_add_bot: "O BOT não pode ser adicionado a lista negra.",
                    error_add_admin: "O ADMINISTRADOR DO GRUPO não pode ser adicionado a lista negra.",
                    error_already_listed: "Este usuário já está na lista negra.",
                },
                function : groupCommand.addlistaCommand
            },
            rmlista: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}rmlista* +55219xxxx-xxxx - Remove o número digitado da lista negra do grupo.\n`,
                msgs: {
                    reply: "✅ O número desse usuário foi removido da lista negra.",
                    error_not_listed: "Este usuário não está na lista negra.",
                },
                function : groupCommand.rmlistaCommand
            },
            listanegra: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}listanegra* - Exibe a lista negra do grupo.\n`,
                msgs: {
                    error_empty_list: "Não existem usuários na lista negra deste grupo.",
                    reply_title: "❌ LISTA NEGRA DO GRUPO\n\n"+
                    "Quantidade de usuários na lista : *{p1}*\n\n",
                    reply_item_with_username: "{p1} - +{p2} ({p3})\n",
                    reply_item_no_username: "{p1} - +{p2} (DESCONHECIDO)\n"
                },
                function : groupCommand.listanegraCommand
            },
            add: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}add* 5521xxxxxxxxx - Digite o numero com o código do país para adicionar a pessoa.\n\n`+
                `Ex: *${PREFIX}add* 5521xxxxxxxxx, 5521xxxxxxxxx - Digite os numeros com o código do país (adiciona mais de uma pessoa no grupo).\n`,
                msgs: {
                    reply: '✅ O número +{p1} foi adicionado ao grupo com sucesso.',
                    error_add: "O número +{p1} não pode ser adicionado. Provavelmente está com privacidade ativada, já está no grupo ou o grupo não aceita mais membros.",
                    error_input: "Foi encontrado texto no número inserido, digite corretamente o número de quem você deseja adicionar ao grupo.",
                    error_invalid_number: "Houve um erro em adicionar o número +{p1}, verifique se o número existe ou tente tirar o 9.",
                },
                function : groupCommand.addCommand
            },
            ban: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}ban* @membro - Para banir um membro marcando ele.\n\n`+
                `Ex: Responder alguém com *${PREFIX}ban* - Bane o membro que você respondeu.\n`,
                msgs: {
                    reply_title: '🚷 BANIMENTO DE MEMBROS\n\n',
                    reply_item_success: "+{p1} foi banido do grupo com sucesso.\n",
                    reply_item_ban_admin: "+{p1} não pode ser banido, o bot não pode banir um administrador.\n",
                    reply_item_not_found: "+{p1} não pode ser banido, provavelmente ele já saiu do grupo.\n",
                },
                function : groupCommand.banCommand
            },
            promover: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}promover* @membro - Promove o membro mencionado a *ADMINISTRADOR*.\n\n`+
                `Ex: Responder com *${PREFIX}promover* - Promove o usuário respondido a *ADMINISTRADOR*.\n`,
                msgs: {
                    error: "[❗] O BOT não pode ser promovido por ele mesmo.",
                    reply_title: "👤 ⬆️ PROMOVER MEMBROS\n\n",
                    reply_item_success: "➥ @{p1} foi promovido para *ADMINISTRADOR*.\n",
                    reply_item_error: "➥ @{p1} já é um *ADMINISTRADOR*.\n",
                },
                function : groupCommand.promoverCommand
            },
            rebaixar: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}rebaixar* @admin - Rebaixa o administrador mencionado a *MEMBRO*.\n\n`+
                `Ex: Responder com *${PREFIX}rebaixar* - Rebaixa o administrador respondido a *MEMBRO*.\n`,
                msgs: {
                    error: "[❗] O BOT não pode ser rebaixado por ele mesmo.",
                    reply_title: "👤 ⬇️ REBAIXAR MEMBROS\n\n",
                    reply_item_success: "➥ @{p1} foi rebaixado para *MEMBRO*.\n",
                    reply_item_error_is_member: "➥ @{p1} já é um *MEMBRO*.\n",
                    reply_item_error: "➥ @{p1} não pode ser rebaixado.\n"
                },
                function : groupCommand.rebaixarCommand
            },
            mt: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}mt* - Marca todos os *MEMBROS/ADMIN* do grupo.\n\n`+
                `Ex: *${PREFIX}mt* mensagem - Marca todos os *MEMBROS/ADMIN* do grupo com uma mensagem.\n`,
                msgs: {
                    reply: "🤖❕ Marquei todos os *{p1}* membros/admins.",
                    reply_with_message: "🤖❕ Marquei todos os *{p1}* membros/admins.\n\n"+
                    "Mensagem: *{p2}*\n"
                },
                function : groupCommand.mtCommand
            },
            mm: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}mm* - Marca todos os *MEMBROS* do grupo.\n\n`+
                `Ex: *${PREFIX}mm* mensagem - Marca todos os *MEMBROS* do grupo com uma mensagem.\n`,
                msgs: {
                    reply: "🤖❕ Marquei todos os *{p1}* membros.",
                    reply_with_message: "🤖❕ Marquei os *{p1}* membros.\n\n"+
                    "Mensagem: *{p2}*\n",
                    error_no_members: "Não existem membros comuns para serem marcados.",
                },
                function : groupCommand.mmCommand
            },
            adms: {
                guide: GUIDE_TITLE +`Ex: Responder com *${PREFIX}adms* - Marca todos os *ADMINISTRADORES* em uma postagem.\n\n`+
                `Ex: *${PREFIX}adms* - Marca os *ADMINISTRADORES* do grupo.\n`,
                msgs: {
                    reply: "🤖❕ Marquei todos os *{p1}* admins.",
                    reply_with_message: "🤖❕ Marquei todos os *{p1}* admins.\n\n"+
                    "Mensagem: *{p2}*\n",
                },
                function : groupCommand.admsCommand
            },
            dono: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}dono* - Exibe quem é dono do grupo.\n`,
                msgs: {
                    reply: "🤖 O dono do grupo é : +{p1}",
                    error: "Não foi possível exibir o dono do grupo, o dono teve o número banido ou cancelado."
                },
                function : groupCommand.donoCommand
            },
            mutar: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}mutar* - Liga/desliga a execução de comandos dos membros.\n`,
                msgs: {
                    reply_on: "✅ O recurso de MUTAR GRUPO foi ativado com sucesso",
                    reply_off: "✅ O recurso de MUTAR GRUPO foi desativado com sucesso"
                },
                function : groupCommand.mutarCommand
            },
            link: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}link* - Exibe o link do grupo.\n`,
                msgs: {
                    reply: "👥 Grupo: *{p1}*\n\n"+
                    "*Link do grupo*: {p2}"
                },
                function : groupCommand.linkCommand
            },
            rlink: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}rlink* - Redefine o link do grupo.\n`,
                msgs: {
                    error: "Houve um erro na redefinição de link",
                    reply: "✅ Link do grupo foi redefinido com sucesso."
                },
                function : groupCommand.rlinkCommand
            },
            restrito: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}restrito* - Abre/Restringe o grupo para ADMS.\n`,
                msgs: {
                    reply_on: "✅ O grupo foi restrito apenas para ADMINISTRADORES poderem conversar.",
                    reply_off: '✅ O grupo foi liberado para todos os MEMBROS poderem conversar.'
                },
                function : groupCommand.restritoCommand
            },
            antilink: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}antilink* - Liga/desliga o antilink e apaga a mensagem de quem postar qualquer tipo de link.\n`,
                msgs: {
                    reply_on: "✅ O recurso de ANTI-LINK foi ativado com sucesso",
                    reply_off: "✅ O recurso de ANTI-LINK foi desativado com sucesso"
                },
                function : groupCommand.antilinkCommand
            },
            autosticker: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}autosticker* - Liga/desliga a criação automatica de stickers sem precisar de comandos.\n`,
                msgs: {
                    reply_on: "✅ O recurso de AUTO-STICKER foi ativado com sucesso",
                    reply_off: "✅ O recurso de AUTO-STICKER foi desativado com sucesso"
                },
                function : groupCommand.autostickerCommand
            },
            bemvindo: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}bemvindo*  - Liga/desliga a mensagem de bem-vindo para novos membros.\n\n`+
                `Ex: *${PREFIX}bemvindo* mensagem - Liga a mensagem de bem-vindo com uma mensagem da sua escolha.\n`,
                msgs: {
                    reply_on: "✅ O recurso de BOAS VINDAS foi ativado com sucesso",
                    reply_off: "✅ O recurso de BOAS VINDAS foi desativado com sucesso",
                },
                function : groupCommand.bemvindoCommand
            },
            antifake: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}antifake* - Liga/desliga o anti-fake em grupos.\n`+
                `Ex: *${PREFIX}antifake* DDI - Configura o anti-fake para que todos números com o DDI exterior seja banido, exceto o que você escolheu.\n`+
                `Ex: *${PREFIX}antifake* DDI1 DDI2 DDI3 - Configura o anti-fake para que todos números com DDI exterior sejam banidos, excetos o que você escolheu.\n\n`+
                `*Obs*: A ativação do anti-fake bane pessoas com DDI do exterior (que não sejam 55 - Brasil).\n`,
                msgs: {
                    reply_on: "✅ O recurso de ANTI-FAKE foi ativado com sucesso",
                    reply_off: "✅ O recurso de ANTI-FAKE foi desativado com sucesso"
                },
                function : groupCommand.antifakeCommand
            },
            antispam: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}antispam*  - Liga/desliga o anti-spam.\n\n`+
                `Ex: *${PREFIX}antispam* 5 15  - Maxímo de mensagens fica 5 mensagens a cada 15 segundos.\n`,
                msgs: {
                    error_value_message: "O valor de mensagem é inválido, escolha um valor entre 5-20 mensagens para o Anti-SPAM.",
                    error_value_interval: "O valor do intervalo é inválido, escolha um valor entre 10-60 segundos para o intervalo do Anti-SPAM.",
                    reply_on: "✅ O recurso de ANTI-SPAM foi ativado para *{p1}* mensagens a cada *{p2}* segundos.",
                    reply_off: "✅ O recurso de ANTI-SPAM foi desativado com sucesso"
                },
                function : groupCommand.antispamCommand
            },
            apg: {
                guide: GUIDE_TITLE +`Ex: Responder com *${PREFIX}apg* - Apaga a mensagem que foi respondida com esse comando.\n\n`+
                `*Obs* : O bot precisa ser administrador.\n`,
                function : groupCommand.apgCommand
            },
            topativos: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}topativos* - Marca os 10 membros com mais mensagens do grupo.\n`+
                `Ex: *${PREFIX}topativos* 15 - Marca os 15 membros com mais mensagens do grupo.\n\n`+
                `*Obs*: Este comando só funciona com o *${PREFIX}contador* ativado.\n`,
                msgs: {
                    error_value_invalid: "A quantidade de pessoas não é um número válido.",
                    error_value_limit: "A quantidade de pessoas deve ser entre 1 e 50",
                    error_counter: "Este comando só funciona quando o contador está ativado.",
                    reply_title: "🏆 TOP {p1} ATIVOS 🏆\n\n",
                    reply_item: "{p1} {p2}° Lugar @{p3} - *{p4}* Msgs\n"
                },
                function : groupCommand.topativosCommand
            },
            contador: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}contador* - Liga/desliga a contagem de mensagens no grupo.\n`,
                msgs: {
                    reply_on: "✅ O recurso de CONTADOR foi ligado com sucesso",
                    reply_off: "✅ O recurso de CONTADOR foi desligado com sucesso",
                },
                function : groupCommand.contadorCommand
            }, 
            atividade: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}atividade* @membro - Mostra a atividade do membro mencionado.\n\n`+
                `Ex: Responder com *${PREFIX}atividade* - Mostra a atividade do membro que você respondeu.\n\n`+
                `*Obs*: Este comando só funciona com o *${PREFIX}contador* ativado.\n`,
                msgs: {
                    error_counter: "Este comando só funciona quando o contador está ativado.",
                    error_not_member: "Não é possível obter a atividade de quem não está no grupo.",
                    reply: "📊 *ATIVIDADE DO MEMBRO*:\n\n"+
                    "👤 *Nome*: {p1}\n"+
                    "📲 *Número*: +{p2}\n"+
                    "🧮 *Total de mensagens* : {p3}\n"+
                    "═════════════════\n"+
                    "🔤 Textos enviados : {p4}\n"+
                    "📸 Imagens enviadas : {p5}\n"+
                    "🎥 Videos enviados : {p6}\n"+
                    "🖼️ Figurinhas enviadas : {p7}\n"+
                    "🎧 Aúdios enviados : {p8}\n"+
                    "🧩 Outros : {p9}\n"
                },
                function : groupCommand.atividadeCommand
            },
            inativos: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}inativos* 5 - Marca todos os membros com menos de 5 mensagens.\n\n`+
                `*Obs*: Este comando só funciona com o *${PREFIX}contador* ativado.\n`,
                msgs: {
                    error_value_invalid: "A quantidade mínima de mensagens não é um número válido.",
                    error_value_limit: "A quantidade mínima de mensagens deve ser maior ou igual a 1.",
                    error_counter: "Este comando só funciona quando o contador está ativado.",
                    error_no_inactives: "Não existem membros inativos neste grupo.",
                    reply_title: "💤 *MEMBROS INATIVOS*:\n\n"+
                    "👤 *Quantidade de inativos*: {p1}\n\n"+
                    'Marcando todos que tem menos de *{p2}* mensagens:\n\n',
                    reply_item: "@{p1} - *{p2}* Msgs\n"
                },
                function : groupCommand.inativosCommand
            },
            bcmd: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}bcmd* ${PREFIX}s ${PREFIX}sgif ${PREFIX}play - Bloqueia no grupo os comandos ${PREFIX}s, ${PREFIX}sgif e ${PREFIX}play (você pode escolher os comandos a sua necessidade).\n\n`+
                `Ex: *${PREFIX}bcmd* sticker - Bloqueia todos os comandos da categoria STICKER.\n\n`+
                `Ex: *${PREFIX}bcmd* utilidade - Bloqueia todos os comandos da categoria UTILIDADE.\n\n`+
                `Ex: *${PREFIX}bcmd* download - Bloqueia todos os comandos da categoria DOWNLOAD.\n\n`+
                `Ex: *${PREFIX}bcmd* diversao - Bloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
                `*Obs* : Você não pode bloquear comandos de administrador.\n`,
                msgs: {
                    reply_title: "🔒 *Bloquear comandos no grupo*\n\n",
                    reply_item_already_blocked: "Comando *{p1}* já está bloqueado.\n",
                    reply_item_blocked: "Comando *{p1}* bloqueado com sucesso.\n",
                    reply_item_error : "Comando *{p1}* não pode ser bloqueado.\n",
                    reply_item_not_exist: "Comando *{p1}* não existe.\n",
                },
                function : groupCommand.bcmdCommand
            },
            dcmd: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}dcmd* ${PREFIX}s ${PREFIX}sgif ${PREFIX}play - Desbloqueia no grupo os comandos ${PREFIX}s, ${PREFIX}sgif e ${PREFIX}play.\n\n`+
                `Ex: *${PREFIX}dcmd* todos - Desbloqueia todos os comandos.\n\n`+
                `Ex: *${PREFIX}dcmd* sticker - Desbloqueia todos os comandos da categoria STICKER.\n\n`+
                `Ex: *${PREFIX}dcmd* utilidade - Desbloqueia todos os comandos da categoria UTILIDADE.\n\n`+
                `Ex: *${PREFIX}dcmd* download - Desbloqueia todos os comandos da categoria DOWNLOAD.\n\n`+
                `Ex: *${PREFIX}dcmd* diversao - Desbloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
                `*Obs* : Verifique os comandos que estão bloqueados com *${PREFIX}status*.\n`,
                msgs: {
                    reply_title: "🔓 *Desbloquear comandos no grupo*\n\n",
                    reply_item_unblocked: "Comando *{p1}* foi desbloqueado.\n",
                    reply_item_not_blocked: "Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
                },
                function : groupCommand.dcmdCommand
            }
        },
        
        admin: { // ************* ADMIN *************
            sair: {
                guide: GUIDE_TITLE +`Ex: Digite *${PREFIX}sair* em um grupo - Faz o bot sair do grupo atual.\n`+
                `Ex: *${PREFIX}sair* 1 - Faz o bot sair do grupo selecionado.\n\n`+
                `*Obs*: Para ver o número dos grupos é necessário checar no comando *${PREFIX}grupos*\n`,
                msgs: {
                    reply: "🤖✅ O bot saiu com sucesso do grupo escolhido.",
                    error: `[❗] Não foi possível sair deste grupo, o grupo não foi encontrado ou o número é inválido. Cheque o comando correto em *${PREFIX}grupos*`,
                },
                function : infoCommand.menuCommand
            },
            pvliberado: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}pvliberado* - Liga/desliga os comandos em MENSAGENS PRIVADAS.\n`,
                msgs: {
                    reply_off: "✅ Os comandos em MENSAGENS PRIVADAS foram desativados com sucesso.",
                    reply_on: "✅ Os comandos em MENSAGENS PRIVADAS foram ativados com sucesso."
                },
                function : infoCommand.menuCommand
            },
            bcmdglobal: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}bcmdglobal* ${PREFIX}s ${PREFIX}sgif ${PREFIX}play - Bloqueia  os comandos ${PREFIX}s, ${PREFIX}sgif e ${PREFIX}play (você pode escolher os comandos a sua necessidade).\n\n`+
                `Ex: *${PREFIX}bcmdglobal* figurinhas - Bloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
                `Ex: *${PREFIX}bcmdglobal* utilidades - Bloqueia todos os comandos da categoria UTILIDADES.\n\n`+
                `Ex: *${PREFIX}bcmdglobal* downloads - Bloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
                `Ex: *${PREFIX}bcmdglobal* diversao - Bloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
                `*Obs* : Você não pode bloquear comandos de administrador.\n`,
                msgs: {
                    reply_title: "[🤖 *Bloquear comandos - Global* 🤖]\n\n",
                    reply_item_already_blocked: "- Comando *{p1}* já está bloqueado.\n",
                    reply_item_blocked: "- Comando *{p1}* bloqueado com sucesso.\n",
                    reply_item_error: "- Comando *{p1}* não pode ser bloqueado.\n",
                    reply_item_not_exist: "- Comando *{p1}* não existe.\n",
                },
                function : infoCommand.menuCommand
            },
            dcmdglobal: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}dcmdglobal* ${PREFIX}s ${PREFIX}sgif ${PREFIX}play - Desbloqueia  os comandos ${PREFIX}s, ${PREFIX}sgif e ${PREFIX}play.\n\n`+
                `Ex: *${PREFIX}dcmdglobal* todos - Desbloqueia todos os comandos.\n\n`+
                `Ex: *${PREFIX}dcmdglobal* figurinhas - Desbloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
                `Ex: *${PREFIX}dcmdglobal* utilidades - Desbloqueia todos os comandos da categoria UTILIDADES.\n\n`+
                `Ex: *${PREFIX}dcmdglobal* downloads - Desbloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
                `Ex: *${PREFIX}dcmdglobal* diversao - Desbloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
                `*Obs* : Verifique os comandos que estão bloqueados com ${PREFIX}infocompleta.\n`,
                msgs: {
                    reply_title: "[🤖 *Desbloquear Comandos - Global* 🤖]\n\n",
                    reply_item_unblocked: "- Comando *{p1}* foi desbloqueado.\n",
                    reply_item_not_blocked: "- Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
                },
                function : infoCommand.menuCommand
            },
            sairgrupos: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}sairgrupos* - Sai de todos os grupos.\n`,
                msgs: {
                    reply: "🤖✅ Saí de todos os grupos com sucesso, total de grupos : {p1}"
                },
                function : infoCommand.menuCommand
            },
            infobot: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}infobot* - Exibe as informações completas do bot, inclusive as configurações atuais.\n`,
                msgs: {
                    reply_title:"*Administrador do Bot* : {p1}\n"+
                    "*Nome do bot* : {p2}\n"+
                    "*Online desde* : {p3}\n"+
                    "*Versão* : {p4}\n"+
                    "*GitHub* : https://github.com/victorsouzaleal/lbot-whatsapp\n"+
                    "-------------------\n",
                    reply_item_autosticker_on : "*Auto-Sticker privado* : ✅\n"+
                    "-------------------\n",
                    reply_item_autosticker_off : "*Auto-Sticker privado* : ❌\n"+
                    "-------------------\n",
                    reply_item_pvallowed_on : "*PV Liberado* : ✅\n"+
                    "-------------------\n",
                    reply_item_pvallowed_off : "*PV Liberado* : ❌\n"+
                    "-------------------\n",
                    reply_item_taxacomandos_on: "*Taxa comandos/minuto* : ✅\n"+
                    "- *{p1}* Cmds/minuto por usuário\n"+
                    "- Bloqueio : *{p2}* s\n"+
                    "-------------------\n",
                    reply_item_taxacomandos_off: "*Taxa comandos/minuto* : ❌\n"+
                    "-------------------\n",
                    reply_item_blockcmds_on : "*Bloqueio de comandos* : ✅\n"+
                    "- Bloqueados: *{p1}*\n"+
                    "-------------------\n",
                    reply_item_blockcmds_off : "*Bloqueio de comandos* : ❌\n"+
                    "-------------------\n",
                    reply_footer: "*Pessoas bloqueadas* : *{p1}* pessoas\n"+
                    "*Comandos executados* : *{p2}*\n"+
                    "*Contato do Administrador* : wa.me/{p3}\n"
                },
                function : infoCommand.menuCommand
            },
            entrargrupo: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}entrargrupo* link - Entra em um grupo por link de convite.\n`,
                msgs: {
                    error_link_invalid: "[❗] Isso não é um link válido 👊🤬",
                    error_group : "[❗] Houve um erro para entrar nesse grupo, verifique se o link está correto.",
                    reply_pending: "🤖 Não foi possivel entrar neste momento, o grupo provavelmente está com modo para administrador aceitar solicitação.",
                    reply: "🤖✅ Entendido, entrarei em breve no grupo."
                },
                function : infoCommand.menuCommand
            },
            bcgrupos: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}bcgrupos* mensagem - Envia uma mensagem para todos os *GRUPOS*.\n`,
                msgs: {
                    message: `[🤖${BOT_NAME}® - Mensagem para os grupos]\n\n`+
                    "{p1}",
                    wait: "⏳ Em andamento , estou enviando sua mensagem para {p1} grupos.\n\n"+
                    "Tempo estimado : *{p2}* segundos",
                    reply: "🤖✅ Anúncio feito com sucesso."
                },
                function : infoCommand.menuCommand
            },
            fotobot: {
                guide: GUIDE_TITLE +`Ex: Envie/responda uma *imagem* com *${PREFIX}fotobot* - Altera a foto do BOT.\n`,
                msgs: {
                    reply: "🤖✅ A foto do BOT foi alterada com sucesso."
                },
                function : infoCommand.menuCommand
            },
            nomebot: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}nomebot* Teste123 - Muda o nome do *BOT* para *Teste123* e atualiza os menus com o novo nome.\n`,
                msgs: {
                    reply: "✅ O nome do bot foi alterado com sucesso.",
                },
                function : infoCommand.menuCommand
            },
            nomesticker: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}nomesticker* Teste123 - Muda o nome do *PACOTE DE STICKERS* para *Teste123* e atualiza os novos stickers com o novo nome.\n`,
                msgs: {
                    reply: "✅ O nome do pacote de figurinhas foi alterado com sucesso.",
                },
                function : infoCommand.menuCommand
            },
            nomeadm: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}nomeadm* Teste123 - Muda o nome do *ADMINISTRADOR* para *Teste123* e atualiza os menus com o novo nome.\n`,
                msgs: {
                    reply: "✅ O nome do administrador foi alterado com sucesso.",
                },
                function : infoCommand.menuCommand
            },
            prefixo: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}prefixo* .  - Muda o prefixo dos *COMANDOS* para *.* e atualiza os menus e comandos com o novo prefixo.\n\n`+
                `Suporta os seguintes prefixos : *!*  *#*  *.*  ***\n`,
                msgs: {
                    reply: "✅ O prefixo dos comandos foi alterado com sucesso.",
                    error: "[❗] Não suportado como prefixo, são suportados somente : ! # . *"
                },
                function : infoCommand.menuCommand
            },
            autostickerpv: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}autostickerpv* - Liga/desliga a criação automatica de stickers sem precisar de comandos no privado.\n`,
                msgs: {
                    reply_off: "✅ O AUTO-STICKER em mensagens privadas foi desativado com sucesso",
                    reply_on: "✅ O AUTO-STICKER em mensagens privadas foi ativado com sucesso",
                },
                function : infoCommand.menuCommand
            },
            listablock: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}listablock* - Exibe a lista de usuários bloqueados pelo bot.\n`,
                msgs: {
                    reply_title: "🤖 Esse é o total de pessoas bloqueadas \nTotal : {p1}\n",
                    error: "[❗] O bot não tem pessoas bloqueadas.",
                    reply_item: "➸ +{p1}\n",
                },
                function : infoCommand.menuCommand
            },
            bloquear: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}bloquear* @membro - Para o bot bloquear o membro mencionado.\n\n`+
                `Ex: *${PREFIX}bloquear* +55 (xx) xxxxx-xxxx - Para o bot bloquear o número digitado.\n\n`+
                `Ex: Responder alguém com *${PREFIX}bloquear* - Para o bot bloquear o membro que você respondeu.\n`,
                msgs: {
                    error_block_admin_bot: "[❗] O Usuário +{p1} é ADMIN do bot, não foi possivel bloquear.",
                    error_already_blocked: "[❗] O Usuário +{p1} já está *bloqueado*.",
                    reply: "✅ O Usuário +{p1} foi *bloqueado* com sucesso"
                },
                function : infoCommand.menuCommand
            },
            taxacomandos: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}taxacomandos* 5 60 - Ativa a taxa limite de comandos para 5 comandos a cada minuto por usuário, caso o usuário ultrapasse ele fica 60 segundos impossibilitado de fazer comandos.\n\n`+
                `*Obs*: Digite *${PREFIX}taxacomandos* novamente para desativar a taxa limite de comandos.\n`,
                msgs: {
                    error_msg_number_invalid: "[❗] A quantidade máxima de mensagens por minuto está inválida",
                    error_time_invalid: "[❗] O tempo de bloqueio de mensagens está inválido",
                    reply_on: "✅ O Limitador de comandos por minuto foi ativado com sucesso",
                    reply_off: "✅ O Limitador de comandos por minuto foi desativado com sucesso",
                },
                function : infoCommand.menuCommand
            },
            desbloquear: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}desbloquear* @membro - Para o bot desbloquear o membro mencionado.\n\n`+
                `Ex: *${PREFIX}desbloquear* +55 (xx) xxxxx-xxxx - Para o bot desbloquear o número digitado.\n\n`+
                `Ex: Responder alguém com *${PREFIX}desbloquear* - Para o bot desbloquear o membro que você respondeu.\n`,
                msgs: {
                    error: "[❗] O Usuário +{p1} já está *desbloqueado*.",
                    reply: "✅ O Usuário +{p1} foi *desbloqueado* com sucesso"
                },
                function : infoCommand.menuCommand
            },
            estado: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}estado* online - Muda o status do bot para ONLINE.\n\n`+
                `Ex: *${PREFIX}estado* offline - Muda o status do bot para OFFLINE.\n\n`+
                `Ex: *${PREFIX}estado* manutencao - Muda o status do bot para MANUTENCÃO.\n`,
                msgs: {
                    reply: "🤖✅ Seu estado foi alterado com sucesso."
                },
                function : infoCommand.menuCommand
            },
            admin: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}admin* - Exibe o menu de administração do bot.\n`,
                function : infoCommand.menuCommand
            },
            grupos: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}grupos* - Mostra os grupos atuais que o bot está e suas informações.\n`,
                msgs: {
                    reply_title: "🤖 GRUPOS ATUAIS ({p1})\n",
                    reply_item: "----------------------------\n"+
                    "*N° Grupo* : {p1}\n"+
                    "*Nome* : {p2}\n"+
                    "*Participantes* : {p3}\n"+
                    "*Admins* : {p4}\n"+
                    "*Bot é admin?* {p5}\n"+
                    `*Link*: {p6}\n`
                },
                function : infoCommand.menuCommand
            },
            linkgrupo: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}linkgrupo* 1 - Exibe o link do grupo selecionado.\n\n`+
                `*Obs*: Para ver o número dos grupos é necessário checar no comando *${PREFIX}grupos*\n`,
                msgs: {
                    reply: `🤖✅ O link para este grupo atualmente é : {p1}`,
                    error_bot_not_admin: '[❗] Não foi possível obter o link desse grupo, o bot não é administrador deste grupo.',
                    error_not_found: `[❗] Não foi possível obter o link desse grupo, o grupo não foi encontrado ou o número é inválido. Cheque o comando correto em *${PREFIX}grupos*`,
                },
                function : infoCommand.menuCommand
            },
            usuario: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}usuario* @usuario - Mostra os dados gerais do usuário mencionado.\n\n`+
                `Ex: Responder com *${PREFIX}usuario* - Mostra os dados gerais do usuário respondido.\n\n`+
                `Ex: *${PREFIX}usuario* 55219xxxxxxxx - Mostra os dados gerais do usuário com esse número.\n`,
                msgs: {
                    error: "[❗] Este usuário ainda não está registrado",
                    reply: "[🤖*DADOS DO USUÁRIO*🤖]\n\n"+
                    "Nome : *{p1}*\n"+
                    "Tipo de usuário : *{p2}*\n"+
                    "Número : *{p3}*\n"+
                    "Total de comandos usados : *{p1}* comandos\n"
                },
                function : infoCommand.menuCommand
            },
            desligar: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}desligar* - Desliga o bot.\n`,
                msgs: {
                    reply: "🤖✅ Entendido, o BOT será desligado"
                },
                function : infoCommand.menuCommand
            },
            ping: {
                guide: GUIDE_TITLE +`Ex: *${PREFIX}ping* - Exibe as informações do sistema do BOT e o tempo de resposta dele.\n`,
                msgs: {
                    reply: "🖥️ INFORMAÇÃO GERAL 🖥️\n\n"+
                    "*OS*: {p1}\n"+
                    "*CPU*: {p2}\n"+
                    "*RAM*: {p3}GB/{p4}GB\n"+
                    "*Resposta*: {p5}s\n"+
                    "*Usuários cadastrados*: {p6}\n"+
                    "*Grupos cadastrados*: {p7}\n"+
                    "*Online desde*: {p8}"
                },
                function : infoCommand.menuCommand
            }
        }
    }
}


