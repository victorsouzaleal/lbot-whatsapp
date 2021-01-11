function help() {
    return `
┏ ❣ *🤖 LBOT v2.0* ❣
╿
┠❥ *!info* - Informações do bot
┠❥ *!admin* - Painel administrativo do bot
╿
┷┯ ☾ ⚒️ UTILITÁRIOS ☽
 ╽
 ┠❥ *!s* - Cria um sticker a partir de uma imagem
 ┠❥ *!sgif* - Transforme o video em gif ou use um trecho curto de video.
 ┠❥ *!sgif2* - Caso o !sgif não consiga converter seu video/gif (EM TESTES).
 ┠❥ *!ssf* - Tira o fundo de uma foto e cria um sticker.
 ┠❥ *!play [nome-da-música]* - Faz download de uma música e envia.
 ┠❥ *!anime* -  Pesquisa o anime por imagem
 ┠❥ *!traduz* - Traduz um texto em outro idioma para português.
 ┠❥ *!ddd* - Responda alguém com *!ddd* ou coloque o DDD que você quer saber depois do comando.
 ┠❥ *!voz [idioma] [mensagem]* - Transforma texto em audio, exemplo : *!voz pt olá*
 ┠❥ *!img [tema-imagem]* - Pega uma foto com o tema que você escolher
 ┠❥ *!google [pesquisa]* - Faz uma rápida pesquisa no google
 ┠❥ *!clima [cidade] [estado]* - Mostra a temperatura atual, ex: !clima Rio de Janeiro
 ┠❥ *!noticias* - Obtem noticias atuais
 ┠❥ *!moeda [dolar|euro|iene] [valor]* - Converte o valor de uma determinada moeda para Real
 ┠❥ *!calc [expressão-matemárica]* - Calcula alguma conta que queira fazer
 ┠❥ *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
 ╿
┯┷ ☾ 👨‍👩‍👧‍👦 COMANDOS DE GRUPO ☽
╽
┠❥ *!status* - Vê os recursos ligados/desligados
┠❥ *!regras* - Exibe a descrição do grupo com as regras
┠❥ *!add +55 (21) 9xxxx-xxxx*
┠❥ *!ban @marcarmembro*
┠❥ *!votacao* - Veja se tem algum membro em votação de ban
┠❥ *!vb on @marcarmembro max-votos* - Abre uma votação de ban (ex: !vb on @pessoa 5)
┠❥ *!vb off* - Encerra uma votação de ban (ex: !vb off)
┠❥ *!promover @marcarmembro*
┠❥ *!rebaixar @marcaradmin*
┠❥ *!mt* - Marca todos
┠❥ *!mt [mensagem]* - Marca todos com uma mensagem personalizada
┠❥ *!adms* - Lista todos administradores
┠❥ *!dono* - Mostra dono do grupo
┠❥ *!link* - Exibe o link do grupo
┠❥ *!rlink* - Redefine o link do grupo
┠❥ *!f [on/off]* - Fecha o grupo apenas para administradores
┠❥ *!alink [on/off]* - Bane quem posta link de grupos
┠❥ *!bv [on/off]* - Recurso de boas vindas
┠❥ *!afake [on/off]* - Números fakes são banidos ao entrarem no grupo
┠❥ *!aflood [5-20] [on/off]* - São banidos quem ultrapassar o numero máximo de flood(ex: !aflood 5 on)
┠❥ *!apg* (responda a msg do bot para apagar a msg)
┠❥ *!bantodos* - Bane todos os membros
╿
┷┯ ☾ 🧩 DIVERSÃO/OUTROS ☽  
 ╽
 ┠❥ *!mascote*
 ┠❥ *!roletarussa* - Bane um membro aleatório (Somente ADMIN's)
 ┠❥ *!viadometro* - Mede o nível de viadagem de alguma pessoa
 ┠❥ *!detector* - Detecta mentiras utilizando uma IA avançada
 ┠❥ *!casal* - Seleciona aleatoriamente um casal
 ┠❥ *!fch* - Gera uma frase contra a humanidade (Do jogo cartas contra a humanidade)
 ┠❥ *!gadometro* - Mencione um membro ou responda ele para descobrir
 ┠❥ *!top5 [tema]* - Ranking dos Top 5 com o tema que você escolher
 ┠❥ *!par @pessoa1 @pessoa2* - Mede o nivel de compatibilidade entre 2 pessoas
 ╿
 ╰╼❥ LBOT v2.0 by *Leal*.`
}

function admin() {
    return `
┏ ❣ *🤖 LBOT v2.0* ❣
╿
┷┯ ☾ ⚙️ ADMINISTRAÇÃO DO BOT ☽
 ╽
 ┠❥ *!sair* - Sai do grupo
 ┠❥ *!sairgrupos* - Sai de todos os grupos
 ┠❥ *!entrargrupo [link-grupo]* 
 ┠❥ *!bc [mensagem]* - Faz um anúncio com uma mensagem para todos os CHATS
 ┠❥ *!bcgrupos [mensagem]* - Faz um anúncio com uma mensagem somente para os GRUPOS
 ┠❥ *!print* - Mostra tela inicial do bot
 ┠❥ *!rconfig* - Reseta as configurações dos grupos
 ┠❥ *!limpartudo*  - Limpa todos os chats(Grupos e contatos)
 ┠❥ *!limpar*  - Limpa todos os chats de contatos
 ┠❥ *!listablock*  - Lista todos os usuários bloqueados
 ┠❥ *!bloquear @usuario*  - Bloqueia o usuário mencionado
 ┠❥ *!desbloquear @usuario*  - Desbloqueia o usuário mencionado
 ┠❥ *!estado online|offline|manutencao*  - Seleciona o estado atual do bot
 ╿
 ╰╼❥ LBOT v2.0 by *Leal*`
}

exports.help = help()
exports.admin = admin()
