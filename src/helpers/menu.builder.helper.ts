import { Bot } from "../interfaces/bot.interface.js"

// MENU PRINCIPAL
export const mainMenu  = (botInfo : Bot)=> { 
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━ ✦ 🔎 *MENU PRINCIPAL* ✦
 ▎
┣━━ Digite um dos comandos abaixo:
 ▎
┣► *${prefix}menu* 0   ❓ Informação
┣► *${prefix}menu* 1   🖼️ Figurinhas
┣► *${prefix}menu* 2   ⚒️ Utilidades
┣► *${prefix}menu* 3   📥 Downloads
┣► *${prefix}menu* 4   🧩 Variado
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU PRINCIPAL (GRUPO)
export const mainMenuGroup  = (botInfo : Bot)=> { 
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━ ✦ 🔎 *MENU PRINCIPAL* ✦
 ▎
┣━━ Digite um dos comandos abaixo:
 ▎
┣► *${prefix}menu* 0   ❓ Informação
┣► *${prefix}menu* 1   🖼️ Figurinhas
┣► *${prefix}menu* 2   ⚒️ Utilidades
┣► *${prefix}menu* 3   📥 Downloads
┣► *${prefix}menu* 4   🧩 Variado
┣► *${prefix}menu* 5   👨‍👩‍👧‍👦 Grupo
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - STICKER
export const stickerMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎ 
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎ 
┣━━━━ ✦ 🖼️ *FIGURINHAS* ✦
 ▎
┣► *${prefix}s* - Imagem/vídeo para sticker
┣► *${prefix}s* 1 - Imagem para sticker (circular)
┣► *${prefix}s* 2 - Imagem para sticker (sem corte)
┣► *${prefix}snome* pack, autor - Renomeia sticker
┣► *${prefix}simg* - Sticker para imagem
┣► *${prefix}ssf* - Imagem para sticker (sem fundo)
┣► *${prefix}emojimix* 💩+😀 - Emoji para sticker
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - INFO
export const infoMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎ 
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎ 
┣━━━━ ✦ ❓ *INFO/SUPORTE* ✦
 ▎ 
┣► *${prefix}info* - Informações do bot
┣► *${prefix}reportar* texto - Reporte um problema
┣► *${prefix}meusdados* - Exibe seus dados de uso
 ▎ 
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - DOWNLOAD
export const downloadMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━━━ ✦ 📥 *DOWNLOADS* ✦
 ▎
┣► *${prefix}play* nome - Áudio do Youtube
┣► *${prefix}yt* nome - Vídeo do Youtube
┣► *${prefix}fb* link - Vídeo do Facebook
┣► *${prefix}ig* link - Videos/imagens do Instagram
┣► *${prefix}x* link - Videos/imagens do X
┣► *${prefix}tk* link - Vídeo do Tiktok
┣► *${prefix}img* tema - Imagens do Google
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - UTILIDADE
export const utilityMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━━━ ✦ ⚒️ *UTILITÁRIOS* ✦
 ▎
┣━━ ✦ 🔎 *CONSULTAS/TEXTO* ✦
 ▎
┣► *${prefix}steamverde* jogo - Pesquisa de jogos "alternativos"
┣► *${prefix}brasileirao* - Tabela do Brasileirão
┣► *${prefix}animes* - Últimos lançamentos de animes
┣► *${prefix}mangas* - Últimos lançamentos de mangás
┣► *${prefix}filmes* - Tendências atuais de filmes
┣► *${prefix}series* - Tendências atuais de séries
┣► *${prefix}encurtar* link - Encurtador de link
┣► *${prefix}letra* musica - Letra de música
┣► *${prefix}traduz* idioma texto - Tradutor de texto
┣► *${prefix}pesquisa* texto - Pesquisa do Google
┣► *${prefix}clima* cidade - Previsão do tempo
┣► *${prefix}noticias* - Notícias atuais
┣► *${prefix}moeda* tipo valor - Conversor de moeda
┣► *${prefix}calc* expressao - Calculadora
┣► *${prefix}ddd* - Informação do DDD
┣► *${prefix}tabela* - Tabela de caracteres
 ▎
┣━━ ✦ 🔊 *AUDIO* ✦
 ▎
┣► *${prefix}ouvir* - Áudio para texto
┣► *${prefix}audio* tipo - Edição de áudio
┣► *${prefix}voz* pt texto - Texto para áudio
 ▎
┣━━ ✦ 🖼️ *IMAGENS* ✦
 ▎
┣► *${prefix}upimg* - Upload de imagem
┣► *${prefix}rbg* - Removedor de fundo
 ▎
┣━━ ✦ ❔ *RECONHECIMENTO* ✦
 ▎
┣► *${prefix}qualmusica* - Reconhecimento de música
┣► *${prefix}qualanime* - Reconhecimento de anime
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - GRUPO
export const groupMenu = (botInfo : Bot) =>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━━━ ✦ 👨‍👩‍👧‍👦 *GRUPO* ✦
 ▎
┣━━ ✦ 🛠️ *GERAL* ✦
 ▎
┣► *${prefix}grupo* - Dados do grupo
┣► *${prefix}adms* - Lista de administradores
┣► *${prefix}dono* - Dono do grupo
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - GRUPO (ADMINISTRADOR)
export const groupAdminMenu = (botInfo : Bot)=>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━━━ ✦ 👨‍👩‍👧‍👦 *GRUPO* ✦
 ▎
┣━━ ✦ 🛠️ *GERAL* ✦
 ▎
┣► *${prefix}grupo* - Dados do grupo
┣► *${prefix}adms* - Lista de administradores
┣► *${prefix}fotogrupo* - Altera foto do grupo
┣► *${prefix}mt* texto - Marca membros/admins com uma mensagem
┣► *${prefix}mm* texto - Marca membros com uma mensagem
┣► *${prefix}dono* - Dono do grupo
 ▎
┣━━ ✦ 🧰 *RECURSOS* ✦ 
 ▎
┣► *${prefix}mutar* - Ativa/desativa o uso de comandos somente para admins
┣► *${prefix}autosticker* - Ativa/desativa a criação automática de stickers
┣► *${prefix}bemvindo* - Ativa/desativa a mensagem de bem-vindo
┣► *${prefix}antilink* - Ativa/desativa o anti-link
┣► *${prefix}antifake* - Ativa/desativa o anti-fake
┣► *${prefix}antiflood* - Ativa/desativa o anti-flood
 ▎
┣━━ ✦ 👤 *MEMBROS* ✦
 ▎
┣► *${prefix}membro* @membro - Mostra os dados do membro
┣► *${prefix}topativos* - Marca os 10 membros mais ativos
┣► *${prefix}inativos* numero - Marca os membros com menos de um determinado número de mensagens
 ▎
┣━━ ✦ 🚫 *BLOQUEIO DE COMANDOS* ✦
 ▎
┣► *${prefix}bcmd* !cmd1 !cmd2 - Bloqueia os comandos
┣► *${prefix}dcmd* !cmd1 !cmd2 - Desbloqueia os comandos
 ▎
┣━━ ✦ 🗒️ *LISTA NEGRA* ✦
 ▎
┣► *${prefix}listanegra* - Lista negra do grupo
┣► *${prefix}addlista* +55 219xxxxxxxx - Adiciona a lista negra do grupo
┣► *${prefix}rmlista* +55 219xxxxxxxx - Remove da lista negra do grupo
 ▎
┣━━ ✦ ⌨️ *ADMINISTRATIVO* ✦
 ▎
┣► *${prefix}add* +55 219xxxxxxxx - Adiciona ao grupo
┣► *${prefix}ban* @membro - Bane do grupo
┣► *${prefix}restrito* - Abre/feche o grupo só para admin
┣► *${prefix}promover* @membro - Promove a admin
┣► *${prefix}rebaixar* @admin - Rebaixa a membro
┣► *${prefix}link* - Link do grupo
┣► *${prefix}rlink* - Redefine o link do grupo
┣► *${prefix}apg* - Apaga mensagem
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - VARIADO
export const miscMenu = (botInfo : Bot) =>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━ ✦ 🕹️ *JOGOS* ✦
 ▎
┣► *${prefix}ppt* opção - Joga pedra, papel e tesoura
┣► *${prefix}caracoroa* - Joga cara ou coroa
┣► *${prefix}roletarussa* - Joga roleta russa
 ▎
 ┣━━ ✦ 🎲 *SORTEIO* ✦
 ▎
┣► *${prefix}sorteio* numero - Sorteia um número até esse valor.
 ▎
┣━━ ✦ 🧩 *ENTRETENIMENTO* ✦
 ▎
┣► *${prefix}mascote* - Onipotente e onipresente WhatsApp Jr
┣► *${prefix}frase* - Frase dúvidosa do WhatsApp Jr
┣► *${prefix}chance* texto - Chance de algo acontecer
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - VARIADO (GRUPO)
export const miscGroupMenu = (botInfo : Bot) =>{
    let {name, prefix} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━ ✦ 🕹️ *JOGOS* ✦
 ▎
┣► *${prefix}ppt* opcão - Joga pedra, papel e tesoura
┣► *${prefix}caracoroa* - Joga cara ou coroa
┣► *${prefix}roletarussa* - Joga roleta russa
 ▎
┣━━ ✦ 🎲 *SORTEIO* ✦
 ▎
┣► *${prefix}sorteio* numero - Sorteia um número até esse valor.
┣► *${prefix}sorteiomembro* - Sorteia um membro do grupo.
 ▎
┣━━ ✦ 🧩 *ENTRETENIMENTO* ✦
 ▎
┣► *${prefix}mascote* - Onipotente e onipresente WhatsApp Jr
┣► *${prefix}frase* - Frase dúvidosa do WhatsApp Jr
┣► *${prefix}viadometro* - Nível de viadagem
┣► *${prefix}detector* - Detector de mentira
┣► *${prefix}casal* - Escolhe um casal
┣► *${prefix}gadometro* - Nível de gado
┣► *${prefix}chance* texto - Chance de algo acontecer
┣► *${prefix}bafometro* - Nível de álcool
┣► *${prefix}top5* tema - Ranking de top 5
┣► *${prefix}par* @pessoa1 @pessoa2 - Nível de compatibilidade
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

// MENU - ADMIN
export const adminMenu = (botInfo : Bot)=>{
    let {prefix, name} = botInfo
    return `┏━━━ ✦ *🤖 ${name?.trim()}* ✦
 ▎
┣━━━━ Guia ❔: *${prefix}comando* guia
 ▎
┣━━━━ ✦ ⚙️ *ADMINISTRAÇÃO* ✦
 ▎
┣━━ ✦ 🛠️ *GERAL* ✦
 ▎
┣► *${prefix}info* - Informação do bot
┣► *${prefix}ping* - Informação do sistema
┣► *${prefix}bloquear* @usuario  - Bloqueia o usuário
┣► *${prefix}desbloquear* @usuario  - Desbloqueia o usuário
┣► *${prefix}listablock*  - Lista de usuários bloqueados
┣► *${prefix}bcgrupos* texto - Mensagem para todos os grupos
┣► *${prefix}desligar* - Desliga o bot
 ▎
┣━━ ✦ 🎨 *CUSTOMIZAÇÃO* ✦
 ▎
┣► *${prefix}nomebot* nome - Altera nome do bot
┣► *${prefix}nomeautor* nome - Altera nome do autor de sticker
┣► *${prefix}nomepack* nome - Altera nome do pacote de figurinhas
┣► *${prefix}prefixo* simbolo - Altera o prefixo dos comandos
┣► *${prefix}fotobot* - Altera foto do bot
┣► *${prefix}recado* texto - Altera o texto do recado/status
 ▎
┣━━ ✦ 👤 *USUÁRIOS* ✦
 ▎
┣► *${prefix}verusuario* @usuario - Dados do usuário
 ▎
┣━━ ✦ ⭐ *ADMINS* ✦
 ▎
┣► *${prefix}veradmins* - Administradores do bot
┣► *${prefix}addadmin* - Promove a admin do bot
┣► *${prefix}rmadmin* - Rebaixa a usuário do bot
 ▎
┣━ ✦ 🚫 *BLOQUEIO DE COMANDOS* ✦
 ▎
┣► *${prefix}bcmdglobal* !cmd1 !cmd2 - Bloqueia os comandos globalmente
┣► *${prefix}dcmdglobal* !cmd1 !cmd2 - Desbloqueia os comandos globalmente
 ▎
┣━━ ✦ 🧰  *RECURSOS* ✦
 ▎
┣► *${prefix}taxacomandos* numero - Ativa/desativa a taxa de comandos por minuto
┣► *${prefix}comandospv* - Ativa/desativa os comandos em mensagens privadas
┣► *${prefix}autostickerpv* - Ativa/desativa a criação automática de stickers no privado
 ▎
┣━━ ✦ 👨‍👩‍👧‍👦 *GRUPOS* ✦
 ▎
┣► *${prefix}vergrupos* - Dados dos grupos atuais
┣► *${prefix}entrargrupo* link - Entra no grupo
 ▎
┗━━✦༻ _*by @Victorsouzaleal*_ ༺✦`
}

