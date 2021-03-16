module.exports = {
    menuPrincipal : ()=>{
        return `__| ☾ *🤖 LBOT®* ☽ 
|
|-- ☾ 🤖 *MENU PRINCIPAL* 🤖☽
|
|- Digite um dos comandos abaixo:
|
|- *!menu* 0 -> Informação
|- *!menu* 1 -> Figurinhas
|- *!menu* 2 -> Utilidades
|- *!menu* 3 -> Downloads
|- *!menu* 4 -> Grupo
|- *!menu* 5 -> Diversão
|- *!menu* 6 -> Créditos
|
╰╼❥ LBOT® by *Leal*`
    },

    menuFigurinhas: ()=>{
        return `__| ☾ *🤖 LBOT®* ☽ 
|
|>-- ☾ 🖼️ *FIGURINHAS* 🖼️☽
|
|- *!s* - Transfome uma IMAGEM em sticker
|
|- *!sgif* - Transforme um VIDEO/GIF em sticker.
|
|- *!simg* - Transforme um STICKER em foto
|
|- *!tps* - Transforme um TEXTO em sticker
|
|- *!ssf* - Transorme uma IMAGEM em sticker sem fundo.
|
╰╼❥ LBOT® by *Leal*`
    },

    menuInfoSuporte: ()=>{
        return `__| ☾ *🤖 LBOT®* ☽ 
|
|>-- ☾ ❓ *INFO/SUPORTE* ❓☽
|
|- *!info* - Informações do bot e contato do dono.
|
|- *!reportar* [mensagem] - Reporte um problema para o dono.
|
|- *!meusdados* - Exibe seus dados de uso 
|
╰╼❥ LBOT® by *Leal*`
    },

    menuDownload: ()=>{
        return `__| ☾ *🤖 LBOT®* ☽ 
|
|>-- ☾ 📥 *DOWNLOADS* 📥☽
|
|- *!play* [nome-musica] - Faz download de uma música e envia.
|
|- *!yt* [nome-video] - Faz download de um video do Youtube e envia.
|
|- *!ig* [link-post] - Faz download de um video/foto do Instagram e envia.
|
|- *!fb* [link-post] - Faz download de um video do Facebook e envia.
|
|- *!tw* [link-tweet] - Faz download de um video/foto do Twitter e envia.
|
|- *!img* [tema-imagem] - Faz download de uma imagem e envia.
|
╰╼❥ LBOT® by *Leal*`
    },

    menuUtilidades: ()=>{
        return `__| ☾ *🤖 LBOT®* ☽
|
|>-- ☾ ⚒️ *UTILITÁRIOS* ⚒️☽
|
|- *!voz [idioma] [mensagem]* - Transforma texto em audio, exemplo : *!voz pt olá*
|
|- *!audio [tipo-edicao]* - Responda um audio com este comando para fazer a edição
|
|- *!qualmusica* - Responda um audio/video para identificar a música.
|
|- *!anime* -  Identifica o anime por foto de uma cena.
|
|- *!animelanc* -  Mostra os lançamentos atuais de animes.
|
|- *!traduz* - Traduz um texto em outro idioma para português.
|
|- *!ddd* - Responda alguém com *!ddd* ou coloque o DDD que você quer saber depois do comando.
|
|- *!pesquisa* [tema] - Faz uma rápida pesquisa na internet
|
|- *!clima* [cidade] - Mostra a temperatura atual.
|
|- *!noticias* - Obtem noticias atuais
|
|- *!moeda* [dolar|euro|iene] [valor] - Converte o valor de uma determinada moeda para Real
|
|- *!calc* [expressão-matemática] - Calcula alguma conta que queira fazer
|
|- *!rastreio* [código-rastreio] - Rastreamento dos CORREIOS
|
╰╼❥ LBOT® by *Leal*`
    },

    menuGrupo: (isGroupAdmin)=>{
        if(isGroupAdmin){
            return `__| ☾ *🤖 LBOT®* ☽ 
|
|>----☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽ 
|
|-- ☾ GERAL ☽
|
|- *!status* - Vê os recursos ligados/desligados
|- *!regras* - Exibe a descrição do grupo com as regras
|- *!adms* - Lista todos administradores
|- *!mt* - Marca todos
|- *!mt* [mensagem] - Marca todos com uma mensagem personalizada
|- *!dono* - Mostra dono do grupo
|
|-- ☾ CONTROLE DE ATIVIDADE ☽
|
|- *!contador* [on/off] - Liga/desliga o contador de atividade(Mensagens).
|- *!atividade* @marcarmembro - Mostra a atividade do usuário no grupo. 
|- *!alterarcont* [quantidade] @membro - Altera a quantidade de mensagens de um membro
|- *!imarcar* 1-50 - Marca todos os inativos com menos de 1 até 50 mensagens
|- *!ibanir* 1-50 - Bane todos os inativos com  menos de 1 até 50 mensagens
|- *!topativos* 1-50 - Marca os membros mais ativos em um ranking de 1-50 pessoas.
|
|-- ☾ BLOQUEIO DE COMANDOS ☽ 
|
|- *!bcmd* [comando1 comando2 etc] - Bloqueia os comandos escolhidos no grupo.
|- *!dcmd* [comando1 comando2 etc] - Desbloqueia os comandos escolhidos no grupo.
|
|-- ☾ LISTA NEGRA ☽ 
|
|- *!blista* +55 (21) 9xxxx-xxxx - Adiciona o número na lista negra do grupo.
|- *!dlista* +55 (21) 9xxxx-xxxx - Remove o número na lista negra do grupo.
|- *!listanegra* - Exibe a lista negra do grupo.
|
|-- ☾ RECURSOS ☽ 
|
|- *!mutar* [on/off] - Muta o bot para não realizar comandos para os membros
|- *!alink* [on/off] - Bane quem posta qualquer tipo de link.
|- *!bv* [on/off] [mensagem] - Recurso de boas vindas com mensagem personalizada
|- *!afake* [on/off] - Número não brasileiros são expulsos ao entrarem
|- *!aflood* [on/off]  - Ativa o anti-flood
|
|-- ☾ ADMINISTRATIVO ☽
|
|- *!add* +55 (21) 9xxxx-xxxx - Adicionar
|- *!ban* @marcarmembro - Banir
|- *!f* [on/off] - Abre/Fecha o grupo
|- *!promover* @marcarmembro - Promove a ADM
|- *!rebaixar* @marcaradmin - Rebaixa a MEMBRO
|- *!link* - Exibe o link do grupo
|- *!rlink* - Redefine o link do grupo
|- *!apg* - Apaga mensagem do BOT
|- *!bantodos* - Bane todos os membros
|
|-- ☾ VOTAÇÃO ☽
|
|- *!votacao* - Veja se tem algum membro em votação de ban
|- *!vb* on @marcarmembro max-votos - Abre uma votação de ban (ex: !vb on @pessoa 5)
|- *!vb* off - Encerra uma votação de ban.
|
|-- ☾ ENQUETE ☽
|
|- *!enquete* pergunta,opcao1,opcao2,etc.. - Abre uma enquete com uma pergunta e as opçôes.
|- *!enquete* off - Encerra a enquete atual e exibe os resultados.
|- *!verenquete* - Veja se tem alguma enquete em aberto.
|- *!votarenquete* [numero-opcao] - Vota na opção selecionada na enquete.
|
|-- ☾ ETC.. ☽
|
|- *!roletarussa* - Expulsa um membro aleatório do grupo
|
╰╼❥ LBOT® by *Leal*`
        } else {
            return `__| ☾ *🤖 LBOT®* ☽ 
|
|- *OBS*: Se tiver dúvida em algum comando digite *guia* após o comando.
|- *Ex*: *!adms* guia
|
|>---- ☾ 👨‍👩‍👧‍👦 *GRUPO* 👨‍👩‍👧‍👦☽
|
|-- ☾ GERAL ☽
|- *!regras* - Exibe a descrição do grupo com as regras
|- *!adms* - Lista todos administradores
|- *!dono* - Mostra dono do grupo
|
|-- ☾ VOTAÇÃO BAN ☽
|
|- *!votacao* - Veja se tem algum membro em votação de ban
|- *!votar* - Vota no membro que está em votação
|
|--☾ ENQUETE ☽
|
|- *!verenquete* - Veja se tem alguma enquete em aberto
|- *!votarenquete* [numero-opcao] - Vota na opção selecionada na enquete
|
╰╼❥ LBOT® by *Leal*`
        }
    },

    menuDiversao:(isGroup)=>{
        if(isGroup){
            return `__| ☾ *🤖 LBOT®* ❣ 
|
|>-- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|
|- *!caracoroa* - Decide no cara ou coroa
|
|- *!ppt* [pedra, papel, tesoura] - Pedra, papel ou tesoura
|
|- *!viadometro* - Mede o nível de viadagem de alguma pessoa
|
|- *!detector* - Detecta mentiras utilizando uma IA avançada
|
|- *!casal* - Seleciona aleatoriamente um casal
|
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|
|- *!gadometro* - Mencione um membro ou responda ele para descobrir
|
|- *!bafometro* - Mede o nível de álcool de uma pessoa
|
|- *!top5* [tema] - Ranking dos Top 5 com o tema que você escolher
|
|- *!par* @pessoa1 @pessoa2 - Mede o nivel de compatibilidade entre 2 pessoas
|
╰╼❥ LBOT® by *Leal*`
        } else {
            return `__| ☾ *🤖 LBOT®* ☽ 
|
|>-- ☾ 🧩 *DIVERSÃO/OUTROS* ☽
|
|- *!mascote*
|
|- *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
|
|- *!caracoroa* - Decide no cara ou coroa
|
|- *!ppt* [pedra, papel, tesoura] - Pedra, papel ou tesoura
|
╰╼❥ LBOT® by *Leal*`
        }
    },

//NÃO REMOVA ESSA PARTE DE CRÉDITOS, PENSE NO TRABALHO E ESFORÇO QUE TEMOS PARA MANTER O BOT ATUALIZADO E FUNCIONANDO.
    menuCreditos: ()=>{
        return `☾ *🤖 LBOT®* ☽ 

Criador do Bot : Leal
Github : https://github.com/victorsouzaleal

Criador Open-WA : Mohammed Shah
Github : https://github.com/smashah

Quer ajudar no projeto e a comprar um servidor para manter o bot 24hs?
💰 Pix : 21995612287

O bot sempre será gratuito mas se alguém quiser ajudar será bem-vindo!
`
    },

    menuAdmin: ()=>{
        return `__| ☾ *🤖 LBOT®* ☽ 
|
|>---- ☾ ⚙️ *ADMINISTRAÇÃO* ⚙️☽
|
|-- ☾ GERAL ☽
|
|- *!infocompleta* - Informação completa do BOT
|- *!print* - Mostra tela inicial do bot
|- *!limpartudo*  - Limpa todos os chats(Grupos e contatos)
|- *!limpar*  - Limpa todos os chats de contatos
|- *!bloquear* @usuario  - Bloqueia o usuário mencionado
|- *!desbloquear* @usuario  - Desbloqueia o usuário mencionado
|- *!listablock*  - Lista todos os usuários bloqueados
|- *!estado* online|offline|manutencao  - Seleciona o estado atual do bot
|- *!bc* [mensagem] - Faz um anúncio com uma mensagem para todos os CHATS
|- *!desligar* - Desliga o bot
|
|-- ☾ BOT USUÁRIOS ☽
|
|- *!verdados* @usuario - Mostra os dados do usuario cadastrado no bot
|- *!vervips* - Mostra todos os usuários VIP's
|- *!tipo* [comum|vip] @usuario - Muda o tipo de conta do usuário
|- *!limparvip* [comum|vip] @usuario - Limpa todos os vips e transforma em usuarios comuns
|
|-- ☾ CONTROLE/LIMITE ☽
|
|- *!taxalimite* on [qtd-comandos] [tempo-bloqueio] - Ativa a taxa de comandos por minuto
|- *!taxalimite* off - Desativa a taxa de comandos por minuto
|- *!limitediario* on [qtd-comandos] - Ativa o limite diario de comandos por dia
|- *!limitediario* off - Desativa o limite diario de comandos por dia
|- *!limitarmsgs* on [qtd-msgs] [intervalo] - Ativa o limite de mensagens privadas em um intervalo
|- *!limitarmsgs* off - Desativa o limite de mensagens privadas em um intervalo
|- *!mudarlimite* [novo-limite] - Muda o limite de comandos por dia de todos os membros
|- *!rtodos* - Reseta os comandos diários de todos
|- *!r* @usuario - Reseta os comandos diários de um usuário
|
|-- ☾ GRUPOS ☽
|
|- *!sair* - Sai do grupo
|- *!sairgrupos* - Sai de todos os grupos
|- *!entrargrupo* [link-grupo] - BOT entra no grupo
|- *!bcgrupos* [mensagem] - Faz um anúncio com uma mensagem somente para os GRUPOS
|- *!rconfig* - Reseta as configurações dos grupos
|
╰╼❥ LBOT® by *Leal*`
    }
}
