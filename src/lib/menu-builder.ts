import { Bot } from "../interfaces/bot.interface.js"

// MAIN MENU
export const mainMenu  = (botInfo : Bot)=> { 
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name.trim()}®* 〗
|
|----〖🔎 *MENU PRINCIPAL*〗
|
|- Digite um dos comandos abaixo:
|
|- *${prefix}menu* 0  ❓ Informação
|- *${prefix}menu* 1  🖼️ Figurinhas
|- *${prefix}menu* 2  ⚒️ Utilidades
|- *${prefix}menu* 3  📥 Downloads
|- *${prefix}menu* 4  👨‍👩‍👧‍👦 Grupo
|- *${prefix}menu* 5  🕹️ Diversão/Jogos
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// STICKER MENU
export const stickerMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖🖼️ *FIGURINHAS*〗
|
|- *${prefix}s* - Transfoma uma IMAGEM/VIDEO em *sticker*.
|- *${prefix}s* 1 - Transfoma uma IMAGEM em *sticker* (circular).
|- *${prefix}s* 2 - Transfoma uma IMAGEM em *sticker* (tamanho original).
|- *${prefix}snome* pack, autor - Renomeia o sticker.
|- *${prefix}simg* - Transforma um STICKER NÃO ANIMADO em *foto*.
|- *${prefix}ssf* - Transforma uma IMAGEM em *sticker sem fundo*.
|- *${prefix}emojimix* 💩+😀 - Tranforma 2 emojis em *sticker*.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// INFO MENU
export const infoMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖❓ *INFO/SUPORTE*〗
|
|- *${prefix}info* - Informações gerais do bot.
|- *${prefix}reportar* mensagem - Reporte um problema para o administrador.
|- *${prefix}meusdados* - Exibe seus dados de uso.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// DOWNLOADS MENU
export const downloadMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖📥 *DOWNLOADS*〗
|
|- *${prefix}play* nome - Envia áudio de um vídeo do Youtube.
|- *${prefix}yt* nome - Envia um vídeo do Youtube.
|- *${prefix}fb* link - Envia um vídeo do Facebook.
|- *${prefix}ig* link - Envia videos/fotos do Instagram.
|- *${prefix}x* link - Envia videos/fotos do X.
|- *${prefix}tk* link - Envia vídeo do Tiktok.
|- *${prefix}img* tema - Envia imagens do Google Imagens.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// UTILITIES MENU
export const utilityMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖⚒️ *UTILITÁRIOS*〗
|
|--〖🔎 *CONSULTAS/TEXTO* 〗
|
|- *${prefix}brasileirao* - Exibe a tabela e rodada atual do Brasileirão.
|- *${prefix}animes* - Exibe os ultimos lançamentos de animes.
|- *${prefix}mangas* - Exibe os ultimos lançamentos de mangás.
|- *${prefix}filmes* - Exibe as tendências atuais de filmes.
|- *${prefix}series* - Exibe as tendências atuais de séries.
|- *${prefix}encurtar* link - Encurta o link digitado.
|- *${prefix}letra* musica - Envia a letra da música digitada.
|- *${prefix}traduz* idioma texto - Traduz um texto para o idioma escolhido.
|- *${prefix}pesquisa* texto - Faz uma rápida pesquisa na internet.
|- *${prefix}clima* cidade - Mostra a temperatura atual.
|- *${prefix}noticias* - Obtem noticias atuais.
|- *${prefix}moeda* tipo valor - Converte o valor de uma determinada moeda para outras.
|- *${prefix}calc* expressao - Calcula alguma conta que queira fazer.
|- *${prefix}ddd* - Responda alguém para ver o estado/região.
|- *${prefix}tabela* -  Mostra tabela com caracteres para criação de nicks.
|
|--〖🔊 *AUDIO*〗
|
|- *${prefix}ouvir* - Responda um áudio para transformar em texto.
|- *${prefix}audio* tipo_edicao - Responda um audio com este comando para fazer a edição.
|- *${prefix}voz* idioma texto - Transforma texto em audio.
|
|--〖🖼️ *IMAGENS*〗
|
|- *${prefix}upimg* - Faz upload de uma imagem e retorna o link.
|- *${prefix}rbg* - Retira o fundo de uma IMAGEM.
|
|--〖❔ *RECONHECIMENTO*〗
|
|- *${prefix}qualmusica* - Responda um audio/video para identificar a música.
|- *${prefix}qualanime* -  Identifica o anime por foto de uma cena.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// GROUP MENU
export const groupMenu = (botInfo : Bot) =>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖👨‍👩‍👧‍👦 *GRUPO*〗
|
|--〖🛠️ *GERAL*〗
|
|- *${prefix}grupo* - Exibe os dados gerais do grupo.
|- *${prefix}adms* - Lista todos administradores.
|- *${prefix}dono* - Mostra dono do grupo.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// GROUP MENU FOR GROUP ADMIN
export const groupAdminMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖👨‍👩‍👧‍👦 *GRUPO*〗
|
|--〖🛠️ *GERAL*〗
|
|- *${prefix}grupo* - Exibe os dados gerais do grupo.
|- *${prefix}adms* - Lista todos administradores.
|- *${prefix}fotogrupo* - Altera foto do grupo
|- *${prefix}mt* mensagem - Marca todos MEMBROS/ADMINS com uma mensagem.
|- *${prefix}mm* mensagem - Marca os MEMBROS com uma mensagem.
|- *${prefix}dono* - Mostra dono do grupo.
|
|--〖🎚️ *CONTADOR/ATIVIDADE*〗
|
|- *${prefix}contador* - Liga/desliga o contador de atividade.
|- *${prefix}atividade* @marcarmembro - Mostra a atividade do membro.
|- *${prefix}topativos* - Marca os 10 membros mais ativos.
|- *${prefix}inativos* numero - Marca os membros com menos de um determinado número de mensagens.
|
|--〖🚫 *BLOQUEIO DE COMANDOS*〗
|
|- *${prefix}bcmd* !comando1 !comando2  - Bloqueia os comandos escolhidos no grupo.
|- *${prefix}dcmd* !comando1 !comando2  - Desbloqueia os comandos escolhidos no grupo.
|
|--〖🗒️ *LISTA NEGRA*〗
|
|- *${prefix}listanegra* - Exibe a lista negra do grupo.
|- *${prefix}addlista* +55 (21) 9xxxx-xxxx - Adiciona o número na lista negra do grupo.
|- *${prefix}rmlista* +55 (21) 9xxxx-xxxx - Remove o número na lista negra do grupo.
|
|--〖🧰 *RECURSOS*〗 
|
|- *${prefix}mutar* - Ativa/desativa o uso de comandos.
|- *${prefix}autosticker* - Ativa/desativa a criação automática de stickers.
|- *${prefix}bemvindo* - Ativa/desativa a mensagem de BEM-VINDO.
|- *${prefix}antilink* - Ativa/desativa o Anti-LINK.
|- *${prefix}antifake* - Ativa/desativa o Anti-FAKE.
|- *${prefix}antispam* - Ativa/desativa o Anti-SPAM.
|
|--〖⌨️ *ADMINISTRATIVO*〗
|
|- *${prefix}add* +55 (21) 9xxxx-xxxx - Adiciona ao grupo.
|- *${prefix}ban* @marcarmembro - Bane do grupo.
|- *${prefix}restrito* - Abre/Restringe o grupo só para ADMS.
|- *${prefix}promover* @marcarmembro - Promove a ADM.
|- *${prefix}rebaixar* @marcaradmin - Rebaixa a MEMBRO.
|- *${prefix}link* - Exibe o link do grupo.
|- *${prefix}rlink* - Redefine o link do grupo.
|- *${prefix}apg* - Apaga uma mensagem do grupo.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// FUN MENU
export const funMenu = (botInfo : Bot) =>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖🕹️ *JOGOS*〗
|
|- *${prefix}ppt* pedra, papel ou tesoura - Joga o Pedra, papel ou tesoura.
|- *${prefix}caracoroa* - Decide no cara ou coroa.
|
|----〖🧩 *DIVERSÃO*〗
|
|- *${prefix}mascote* - Exibe o onipotente e onipresente WhatsApp Jr.
|- *${prefix}frase* - Receba uma frase dúvidosa do WhatsApp Jr.
|- *${prefix}simi* texto - Recebe uma resposta do SimSimi.
|- *${prefix}chance* - Calcula a chance de algo acontecer.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// FUN MENU IN A GROUP
export const funGroupMenu = (botInfo : Bot) =>{
    let {name, prefix} = botInfo
    return `
|-----〖 *🤖 ${name?.trim()}®* 〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|----〖🕹️ *JOGOS*〗
|
|- *${prefix}ppt* pedra, papel ou tesoura - Joga o pedra, papel ou tesoura.
|- *${prefix}caracoroa* - Decide no cara ou coroa.
|
|----〖🧩 *DIVERSÃO*〗
|
|- *${prefix}mascote* - Exibe o onipotente e onipresente WhatsApp Jr.
|- *${prefix}frase* - Receba uma frase dúvidosa do WhatsApp Jr.
|- *${prefix}simi* texto - Recebe uma resposta do SimSimi.
|- *${prefix}viadometro* - Mede o nível de viadagem de alguma pessoa.
|- *${prefix}detector* - Detecta mentiras utilizando uma IA avançada.
|- *${prefix}casal* - Seleciona aleatoriamente um casal.
|- *${prefix}gadometro* - Mencione um membro ou responda ele para descobrir.
|- *${prefix}chance* - Calcula a chance de algo acontecer.
|- *${prefix}bafometro* - Mede o nível de álcool de uma pessoa.
|- *${prefix}top5* tema - Ranking dos Top 5 com o tema que você escolher.
|- *${prefix}par* @pessoa1 @pessoa2 - Mede o nivel de compatibilidade entre 2 pessoas.
|- *${prefix}roletarussa* - Expulsa um membro aleatório do grupo.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

// ADMIN MENU
export const adminMenu = (botInfo : Bot)=>{
    let {prefix} = botInfo
    return `
|-----〖⚙️ *ADMINISTRAÇÃO*〗
|
|---- Guia ❔: *${prefix}comando* guia
|
|--〖🎨 *CUSTOMIZAÇÃO*〗
|
|- *${prefix}nomebot* nome - Altera nome do bot e atualiza menus.
|- *${prefix}nomeautor* nome - Altera nome do autor de sticker.
|- *${prefix}nomepack* nome - Altera nome do pacote de figurinhas.
|- *${prefix}prefixo* simbolo - Altera o prefixo dos comandos.
|- *${prefix}fotobot* - Altera foto do BOT.
|- *${prefix}estado* online, offline ou manutencao - Altera o estado atual do bot.
|
|--〖🛠️ *GERAL*〗
|
|- *${prefix}infobot* - Informação completa do BOT.
|- *${prefix}ping* - Informação do sistema e de tempo de resposta.
|- *${prefix}bloquear* @usuario  - Bloqueia o usuário mencionado.
|- *${prefix}desbloquear* @usuario  - Desbloqueia o usuário mencionado.
|- *${prefix}listablock*  - Lista todos os usuários bloqueados.
|- *${prefix}bcgrupos* mensagem - Faz um anúncio com uma mensagem somente para os GRUPOS.
|- *${prefix}desligar* - Desliga o bot.
|
|--〖👤 *USUÁRIOS*〗
|
|- *${prefix}verdados* @usuario - Mostra os dados do usuario cadastrado no bot.
|
|--〖🚫 *BLOQUEIO DE COMANDOS*〗 
|
|- *${prefix}bcmdglobal* !comando1 !comando2 - Bloqueia os comandos escolhidos globalmente.
|- *${prefix}dcmdglobal* !comando1 !comando2 - Desbloqueia os comandos escolhidos globalmente.
|
|--〖👤 *ANTI-SPAM COMANDOS*〗
|
|- *${prefix}taxacomandos* qtd-comandos - Ativa/desativa a taxa de comandos por minuto.
|
|--〖🎚️ *CONTROLE*〗
|
|- *${prefix}pvliberado* - Ativa/desativa os comandos em mensagens privadas.
|- *${prefix}autostickerpv* - Ativa/desativa a criação automática de stickers no privado.
|
|--〖👨‍👩‍👧‍👦 *GRUPOS*〗
|
|- *${prefix}grupos* - Mostra os grupos atuais.
|- *${prefix}linkgrupo* numero - Mostra o link do grupo selecionado.
|- *${prefix}sair* - Sai do grupo.
|- *${prefix}sairgrupos* - Sai de todos os grupos.
|- *${prefix}entrargrupo* link-grupo - BOT entra no grupo.
|
╰╼❥ _*by @Victorsouzaleal*_`
}

