function help() {
    return `
┏ ❣ *🤖 LBOT v2.0* ❣
╿
┠❥ *!dono* - Contato do dono
╿
┷┯ ☾ ⚒️ UTILITÁRIOS ☽
 ╽
 ┠❥ *!s* - Cria um sticker a partir de uma imagem
 ┠❥ *!sgif* - Transforme o video em gif ou use um trecho curto de video.
 ┠❥ *!sgif2* - Caso o !sgif não consiga converter seu video/gif.
 ┠❥ *!ssf* - Tira o fundo de uma foto e cria um sticker.
 ┠❥ *!traduz* - Traduz um texto em outro idioma para português.
 ┠❥ *!voz [idioma] [mensagem]* - Transforma texto em audio, exemplo : *!voz pt olá*
 ┠❥ *!img [tema-imagem]* Pega uma foto com o tema que você escolher
 ┠❥ *!noticias*
 ┠❥ *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
 ╿
┯┷ ☾ 👨‍👩‍👧‍👦 COMANDOS DE GRUPO ☽
╽
┠❥ *!status* - Vê os recursos ligados/desligados
┠❥ *!regras* - Exibe a descrição do grupo com as regras
┠❥ *!add +55 (21) 9xxxx-xxxx*
┠❥ *!banir @marcarmembro*
┠❥ *!promover @marcarmembro*
┠❥ *!rebaixar @marcaradmin*
┠❥ *!marcartodos*
┠❥ *!listaradmins*
┠❥ *!donogrupo*
┠❥ *!linkgrupo*
┠❥ *!fechar [on/off]* - Fecha o grupo apenas para administradores
┠❥ *!antilink [ligado/desligado]* - Bane quem posta link de grupos
┠❥ *!bemvindo [ligado/desligado]* - Recurso de boas vindas
┠❥ *!antifake [ligado/desligado]* - Números fakes são banidos ao entrarem no grupo
┠❥ *!antiflood [ligado/desligado]* - Bane quem flooda o grupo digitando várias vezes.
┠❥ *!apagar* (responda a msg do bot para apagar a msg)
┠❥ *!banirtodos*
┠❥ *!bemvindo [ligado/desligado]*
╿
┷┯ ☾ 🎲 BRINCADEIRAS/OUTROS ☽  
 ╽
 ┠❥ *!mascote*
 ┠❥ *!viadometro* - Mede o nível de viadagem de alguma pessoa
 ┠❥ *!detector* - Detecta mentiras utilizando uma IA avançada
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
