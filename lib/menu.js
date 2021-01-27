function msg_admin_grupo() {
    return `
__| ❣ *🤖 LBOT v2.0* ❣ 
|
|>---------- ☾ ❓ *INFO/SUPORTE* ❓☽
|
|- *!info* - Informações do bot e contato do dono.
|- *!reportar* - Reporte um problema para o dono.
|- *!meusdados* - Exibe seus dados de uso
|
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
|
|--------- ☾ GERAL ☽
|
|- *!play [nome-da-música]* - Faz download de uma música e envia.
|- *!anime* -  Identifica o anime por foto de uma cena.
|- *!traduz* - Traduz um texto em outro idioma para português.
|- *!ddd* - Responda alguém com *!ddd* ou coloque o DDD que você quer saber depois do comando.
|- *!img [tema-imagem]* - Pega uma foto com o tema que você escolher
|- *!google [pesquisa]* - Faz uma rápida pesquisa no google
|- *!clima [cidade] [estado]* - Mostra a temperatura atual, ex: !clima Rio de Janeiro
|- *!noticias* - Obtem noticias atuais
|- *!moeda [dolar|euro|iene] [valor]* - Converte o valor de uma determinada moeda para Real
|- *!calc [expressão-matemática]* - Calcula alguma conta que queira fazer
|- *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
|
|>---------- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽ 
|
|--------- ☾ GERAL ☽
|
|- *!status* - Vê os recursos ligados/desligados
|- *!regras* - Exibe a descrição do grupo com as regras
|- *!adms* - Lista todos administradores
|- *!mt* - Marca todos
|- *!mt [mensagem]* - Marca todos com uma mensagem personalizada
|- *!adms* - Lista todos administradores
|- *!dono* - Mostra dono do grupo
|
|--------- ☾ CONTROLE DE ATIVIDADE ☽
|
|- *!contador [on/off]* - Liga/desliga o contador de atividade(Mensagens).
|- *!atividade @marcarmembro* - Mostra a atividade do usuário no grupo. 
|- *!imarcar 1-50* - Marca todos os inativos com menos de 1 até 50 mensagens
|- *!ibanir 1-50* - Bane todos os inativos com  menos de 1 até 50 mensagens
|- *!topativos 1-50* - Marca os membros mais ativos em um ranking de 1-50 pessoas.
|
|--------- ☾ BLOQUEIO DE COMANDOS ☽ 
|
|- *!bcmd [comando1 comando2 etc]* - Bloqueia os comandos escolhidos no grupo.
|- *!dcmd [comando1 comando2 etc]* - Desbloqueia os comandos escolhidos no grupo.
|
|--------- ☾ ADMINISTRATIVO ☽
|
|- *!add +55 (21) 9xxxx-xxxx*
|- *!ban @marcarmembro*
|- *!promover @marcarmembro*
|- *!rebaixar @marcaradmin*
|- *!link* - Exibe o link do grupo
|- *!rlink* - Redefine o link do grupo
|- *!f [on/off]* - Fecha o grupo apenas para administradores
|- *!alink [on/off]* - Bane quem posta qualquer tipo de link (exceto Youtube)
|- *!bv [on/off]* - Recurso de boas vindas
|- *!afake [on/off]* - Números fakes são banidos ao entrarem no grupo
|- *!aflood [5-20] [on/off]* - São banidos quem ultrapassar o numero máximo de flood(ex: !aflood 5 on)
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
|
|>---------- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|- *!viadometro* - Mede o nível de viadagem de alguma pessoa
|- *!detector* - Detecta mentiras utilizando uma IA avançada
|- *!casal* - Seleciona aleatoriamente um casal
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|- *!bafometro* - Mede o nível de álcool de uma pessoa
|- *!gadometro* - Mencione um membro ou responda ele para descobrir
|- *!top5 [tema]* - Ranking dos Top 5 com o tema que você escolher
|- *!par @pessoa1 @pessoa2* - Mede o nivel de compatibilidade entre 2 pessoas
|
╰╼❥ LBOT v2.0 by *Leal*.`
}


function admin() {
    return `
__| ❣ *🤖 LBOT v2.0* ❣
|
|>---------- ☾ ⚙️ *ADMINISTRAÇÃO DO BOT* ⚙️ ☽
|
|--------- ☾ GERAL ☽
|
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
|- *!mudarlimite [novo-limite]* - Muda o limite de comandos por dia de todos os membros
|- *!tipo [comum|vip] @usuario* - Muda o tipo de conta do usuário
|- *!limparvip [comum|vip] @usuario* - Limpa todos os vips e transforma em usuarios comuns
|- *!rtodos* - Reseta os comandos diários de todos
|- *!r @usuario* - Reseta os comandos diários de um usuário
|- *!alterarcont [quantidade] @membro* - Altera a quantidade de mensagens de um membro
|
|--------- ☾ GRUPOS ☽
|
|- *!sair* - Sai do grupo
|- *!sairgrupos* - Sai de todos os grupos
|- *!entrargrupo [link-grupo]* 
|- *!bcgrupos [mensagem]* - Faz um anúncio com uma mensagem somente para os GRUPOS
|- *!rconfig* - Reseta as configurações dos grupos
|
╰╼❥ LBOT v2.0 by *Leal*`
}

function msg_comum(){
    return `
__| ❣ *🤖 LBOT v2.0* ❣ 
|
|>---------- ☾ ❓ *INFO/SUPORTE* ❓☽
|
|- *!info* - Informações do bot e contato do dono.
|- *!reportar* - Reporte um problema para o dono.
|- *!meusdados* - Exibe seus dados de uso
|
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
|
|--------- ☾ GERAL ☽
|
|- *!play [nome-da-música]* - Faz download de uma música e envia.
|- *!anime* -  Identifica o anime por foto de uma cena.
|- *!traduz* - Traduz um texto em outro idioma para português.
|- *!ddd* - Responda alguém com *!ddd* ou coloque o DDD que você quer saber depois do comando.
|- *!img [tema-imagem]* - Pega uma foto com o tema que você escolher
|- *!google [pesquisa]* - Faz uma rápida pesquisa no google
|- *!clima [cidade] [estado]* - Mostra a temperatura atual, ex: !clima Rio de Janeiro
|- *!noticias* - Obtem noticias atuais
|- *!moeda [dolar|euro|iene] [valor]* - Converte o valor de uma determinada moeda para Real
|- *!calc [expressão-matemática]* - Calcula alguma conta que queira fazer
|- *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
|
|>---------- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|
╰╼❥ LBOT v2.0 by *Leal*.`
}

function msg_comum_grupo(){
    return `
__| ❣ *🤖 LBOT v2.0* ❣ 
|
|>---------- ☾ ❓ *INFO/SUPORTE* ❓ ☽
|
|- *!info* - Informações do bot e contato do dono.
|- *!reportar* - Reporte um problema para o dono.
|- *!meusdados* - Exibe seus dados de uso
|
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
|
|--------- ☾ GERAL ☽
|
|- *!play [nome-da-música]* - Faz download de uma música e envia.
|- *!anime* -  Identifica o anime por foto de uma cena.
|- *!traduz* - Traduz um texto em outro idioma para português.
|- *!ddd* - Responda alguém com *!ddd* ou coloque o DDD que você quer saber depois do comando.
|- *!img [tema-imagem]* - Pega uma foto com o tema que você escolher
|- *!google [pesquisa]* - Faz uma rápida pesquisa no google
|- *!clima [cidade] [estado]* - Mostra a temperatura atual, ex: !clima Rio de Janeiro
|- *!noticias* - Obtem noticias atuais
|- *!moeda [dolar|euro|iene] [valor]* - Converte o valor de uma determinada moeda para Real
|- *!calc [expressão-matemática]* - Calcula alguma conta que queira fazer
|- *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
|
|>---------- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽
|
|--------- ☾ GERAL ☽
|- *!regras* - Exibe a descrição do grupo com as regras
|- *!adms* - Lista todos administradores
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
|
|>---------- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|- *!viadometro* - Mede o nível de viadagem de alguma pessoa
|- *!detector* - Detecta mentiras utilizando uma IA avançada
|- *!casal* - Seleciona aleatoriamente um casal
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|- *!gadometro* - Mencione um membro ou responda ele para descobrir
|- *!bafometro* - Mede o nível de álcool de uma pessoa
|- *!top5 [tema]* - Ranking dos Top 5 com o tema que você escolher
|- *!par @pessoa1 @pessoa2* - Mede o nivel de compatibilidade entre 2 pessoas
|
╰╼❥ LBOT v2.0 by *Leal*.`
}


exports.msg_admin_grupo = msg_admin_grupo()
exports.msg_comum_grupo = msg_comum_grupo()
exports.msg_comum = msg_comum()
exports.admin = admin()
