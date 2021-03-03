
function admin() {
    return `
__| ❣ *🤖 LBOT®* ❣
|
|- *OBS*: Se tiver dúvida em algum comando digite *guia* após o comando.
|
|>---------- ☾ ⚙️ *ADMINISTRAÇÃO*☽
|
|--------- ☾ GERAL ☽
|
|- *!infocompleta* - Informação completa do BOT
|- *!print* - Mostra tela inicial do bot
|- *!limpartudo*  - Limpa todos os chats(Grupos e contatos)
|- *!limpar*  - Limpa todos os chats de contatos
|- *!bloquear @usuario*  - Bloqueia o usuário mencionado
|- *!desbloquear @usuario*  - Desbloqueia o usuário mencionado
|- *!listablock*  - Lista todos os usuários bloqueados
|- *!estado online|offline|manutencao*  - Seleciona o estado atual do bot
|- *!bc [mensagem]* - Faz um anúncio com uma mensagem para todos os CHATS
|- *!desligar* - Desliga o bot
|
|--------- ☾ BOT USUÁRIOS ☽
|
|- *!verdados @usuario* - Mostra os dados do usuario cadastrado no bot
|- *!vervips* - Mostra todos os usuários VIP's
|- *!tipo [comum|vip] @usuario* - Muda o tipo de conta do usuário
|- *!limparvip [comum|vip] @usuario* - Limpa todos os vips e transforma em usuarios comuns
|
|--------- ☾ CONTROLE/LIMITE ☽
|
|- *!taxalimite on [qtd-comandos] [tempo-bloqueio]* - Ativa a taxa de comandos por minuto
|- *!taxalimite off* - Desativa a taxa de comandos por minuto
|- *!limitediario on [qtd-comandos]* - Ativa o limite diario de comandos por dia
|- *!limitediario off* - Desativa o limite diario de comandos por dia
|- *!limitarmsgs on [qtd-msgs] [intervalo]* - Ativa o limite de mensagens privadas em um intervalo
|- *!limitarmsgs off* - Desativa o limite de mensagens privadas em um intervalo
|- *!mudarlimite [novo-limite]* - Muda o limite de comandos por dia de todos os membros
|- *!rtodos* - Reseta os comandos diários de todos
|- *!r @usuario* - Reseta os comandos diários de um usuário
|
|--------- ☾ GRUPOS ☽
|
|- *!sair* - Sai do grupo
|- *!sairgrupos* - Sai de todos os grupos
|- *!entrargrupo [link-grupo]* 
|- *!bcgrupos [mensagem]* - Faz um anúncio com uma mensagem somente para os GRUPOS
|- *!rconfig* - Reseta as configurações dos grupos
|
╰╼❥ LBOT® by *Leal*`
}

function ajuda(isGroupAdmin, isGroup){
    //CABEÇALHO DO MENU
    let menu_cabecalho = `
    __| ❣ *🤖 LBOT®* ❣ 
|
|- *OBS*: Se tiver dúvida em algum comando digite *guia* após o comando.
|
|>---------- ☾ ❓ *INFO/SUPORTE* ❓☽
|
|- *!info* - Informações do bot e contato do dono.
|- *!reportar* - Reporte um problema para o dono.
|- *!meusdados* - Exibe seus dados de uso 
|`

    //MENU UTILITÁRIOS
    let menu_utilitarios = `
|>---------- ☾ ⚒️ *UTILITÁRIOS* ⚒️☽
|
|--------- ☾ CRIADOR/STICKERS/VOZ ☽
|
|- *!s* - Cria um sticker a partir de uma imagem
|- *!sgif* - Transforme o video em gif ou use um trecho curto de video.
|- *!simg* - Transforme um sticker em foto
|- *!tps* - Transforme um texto em sticker
|- *!ssf* - Tira o fundo de uma foto e cria um sticker.
|- *!voz [idioma] [mensagem]* - Transforma texto em audio, exemplo : *!voz pt olá*
|- *!audio [tipo-edicao]* - Responda um audio com este comando para fazer a edição
|
|--------- ☾ GERAL ☽
|
|- *!qualmusica* - Responda um audio/video para identificar a música.
|- *!play [nome-da-música]* - Faz download de uma música e envia.
|- *!yt [nome-do-video]* - Faz download de um video do Youtube e envia.
|- *!ig [link]* - Faz download de um video/foto do Instagram e envia.
|- *!tw [link-video]* - Faz download de um video do Twitter e envia.
|- *!anime* -  Identifica o anime por foto de uma cena.
|- *!animelanc* -  Mostra os lançamentos atuais de animes.
|- *!traduz* - Traduz um texto em outro idioma para português.
|- *!ddd* - Responda alguém com *!ddd* ou coloque o DDD que você quer saber depois do comando.
|- *!img [tema-imagem]* - Pesquisa uma imagem no Pinterest com o tema escolhido
|- *!pesquisa [tema]* - Faz uma rápida pesquisa na internet
|- *!clima [cidade] [estado]* - Mostra a temperatura atual, ex: !clima Rio de Janeiro
|- *!noticias* - Obtem noticias atuais
|- *!moeda [dolar|euro|iene] [valor]* - Converte o valor de uma determinada moeda para Real
|- *!calc [expressão-matemática]* - Calcula alguma conta que queira fazer
|- *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
|`

    //MENU DE GRUPO PARA MEMBROS COMUNS
    let menu_grupo_comum = `
|>---------- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽
|
|--------- ☾ GERAL ☽
|- *!regras* - Exibe a descrição do grupo com as regras
|- *!adms* - Lista todos administradores
|- *!dono* - Mostra dono do grupo
|
|--------- ☾ VOTAÇÃO BAN ☽
|
|- *!votacao* - Veja se tem algum membro em votação de ban
|- *!votar* - Vota no membro que está em votação
|
|--------- ☾ ENQUETE ☽
|
|- *!verenquete* - Veja se tem alguma enquete em aberto
|- *!votarenquete [numero-opcao]* - Vota na opção selecionada na enquete
|`

    //MENU DE GRUPO PARA MEMBROS ADMINISTRADORES
    let menu_grupo_admin = `
|>---------- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽ 
|
|--------- ☾ GERAL ☽
|
|- *!status* - Vê os recursos ligados/desligados
|- *!regras* - Exibe a descrição do grupo com as regras
|- *!adms* - Lista todos administradores
|- *!mt* - Marca todos
|- *!mt [mensagem]* - Marca todos com uma mensagem personalizada
|- *!dono* - Mostra dono do grupo
|
|--------- ☾ CONTROLE DE ATIVIDADE ☽
|
|- *!contador [on/off]* - Liga/desliga o contador de atividade(Mensagens).
|- *!atividade @marcarmembro* - Mostra a atividade do usuário no grupo. 
|- *!alterarcont [quantidade] @membro* - Altera a quantidade de mensagens de um membro
|- *!imarcar 1-50* - Marca todos os inativos com menos de 1 até 50 mensagens
|- *!ibanir 1-50* - Bane todos os inativos com  menos de 1 até 50 mensagens
|- *!topativos 1-50* - Marca os membros mais ativos em um ranking de 1-50 pessoas.
|
|--------- ☾ BLOQUEIO DE COMANDOS ☽ 
|
|- *!bcmd [comando1 comando2 etc]* - Bloqueia os comandos escolhidos no grupo.
|- *!dcmd [comando1 comando2 etc]* - Desbloqueia os comandos escolhidos no grupo.
|
|--------- ☾ LISTA NEGRA ☽ 
|
|- *!blista +55 (21) 9xxxx-xxxx* - Adiciona o número na lista negra do grupo.
|- *!dlista +55 (21) 9xxxx-xxxx* - Remove o número na lista negra do grupo.
|- *!listanegra* - Exibe a lista negra do grupo.
|
|--------- ☾ RECURSOS ☽ 
|
|- *!mutar [on/off]* - Muta o bot para não realizar comandos para os membros
|- *!alink [on/off] [excessôes]* - Bane quem posta qualquer tipo de link, exceto as excessões.
|- *!bv [on/off] [mensagem]* - Recurso de boas vindas com mensagem personalizada
|- *!afake [on/off][ddi1 ddi2]* - Libera acesso ao grupo apenas aos DDI digitados
|- *!aflood [on/off] [5-20] [10-60]* - São banidos quem ultrapassar o numero máximo de mensagens em um intervalo de tempo
|
|--------- ☾ ADMINISTRATIVO ☽
|
|- *!add +55 (21) 9xxxx-xxxx*
|- *!ban @marcarmembro*
|- *!f [on/off]* - Fecha o grupo apenas para administradores
|- *!promover @marcarmembro*
|- *!rebaixar @marcaradmin*
|- *!link* - Exibe o link do grupo
|- *!rlink* - Redefine o link do grupo
|- *!apg* (responda a msg do bot para apagar a msg)
|- *!bantodos* - Bane todos os membros
|
|--------- ☾ VOTAÇÃO ☽
|
|- *!votacao* - Veja se tem algum membro em votação de ban
|- *!vb on @marcarmembro max-votos* - Abre uma votação de ban (ex: !vb on @pessoa 5)
|- *!vb off* - Encerra uma votação de ban (ex: !vb off)
|
|--------- ☾ ENQUETE ☽
|
|- *!enquete pergunta,opcao1,opcao2,etc..* - Abre uma enquete com uma pergunta e as opçôes.
|- *!enquete off* - Encerra a enquete atual e exibe os resultados.
|- *!verenquete* - Veja se tem alguma enquete em aberto.
|- *!votarenquete [numero-opcao]* - Vota na opção selecionada na enquete.
|`
    //MENU DE DIVERSÃO PARA MENSAGENS PRIVADAS
    let menu_diversao_privado = `
|>---------- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|- *!caracoroa* - Decide no cara ou coroa
|- *!ppt [pedra, papel, tesoura]* - Pedra, papel ou tesoura
|`

    //MENU DE DIVERSÃO PARA GRUPO - MEMBROS COMUNS
    let menu_diversao_grupo_comum = `
|>---------- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|- *!caracoroa* - Decide no cara ou coroa
|- *!ppt [pedra, papel, tesoura]* - Pedra, papel ou tesoura
|- *!viadometro* - Mede o nível de viadagem de alguma pessoa
|- *!detector* - Detecta mentiras utilizando uma IA avançada
|- *!casal* - Seleciona aleatoriamente um casal
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|- *!gadometro* - Mencione um membro ou responda ele para descobrir
|- *!bafometro* - Mede o nível de álcool de uma pessoa
|- *!top5 [tema]* - Ranking dos Top 5 com o tema que você escolher
|- *!par @pessoa1 @pessoa2* - Mede o nivel de compatibilidade entre 2 pessoas
|`

    //MENU DE DIVERSÃO PARA GRUPO - MEMBROS ADMINISTRADORES
    let menu_diversao_grupo_admin = `
|>---------- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|- *!roletarussa* - Bane um membro aleatório do grupo
|- *!caracoroa* - Decide no cara ou coroa
|- *!ppt [pedra, papel, tesoura]* - Pedra, papel ou tesoura
|- *!viadometro* - Mede o nível de viadagem de alguma pessoa
|- *!detector* - Detecta mentiras utilizando uma IA avançada
|- *!casal* - Seleciona aleatoriamente um casal
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|- *!bafometro* - Mede o nível de álcool de uma pessoa
|- *!gadometro* - Mencione um membro ou responda ele para descobrir
|- *!top5 [tema]* - Ranking dos Top 5 com o tema que você escolher
|- *!par @pessoa1 @pessoa2* - Mede o nivel de compatibilidade entre 2 pessoas
|`

    //RODAPÉ DO MENU
    let menu_rodape = `\n╰╼❥ LBOT® by *Leal*.`

    if(isGroup){
        if(isGroupAdmin){
            return menu_cabecalho+menu_utilitarios+menu_grupo_admin+menu_diversao_grupo_admin+menu_rodape
        } else {
            return menu_cabecalho+menu_utilitarios+menu_grupo_comum+menu_diversao_grupo_comum+menu_rodape
        }
    } else {
        return menu_cabecalho+menu_utilitarios+menu_diversao_privado+menu_rodape
    }
}


exports.ajuda = ajuda
exports.admin = admin()
