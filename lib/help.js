function help() {
    return `
┏ ❣ *Lealzin BOT* ❣
╿
┷┯ ☾ UTILITÁRIOS ☽
 ╽
 ┠❥ *!s* - Cria um sticker a partir de uma imagem
 ┠❥ *!sgif* - Transforme o video em gif ou use um trecho curto de video.
 ┠❥ *!sgif2* - Caso o !sgif não consiga converter seu video/gif.
 ┠❥ *!ssf* - Tira o fundo de uma foto e cria um sticker.
 ┠❥ *!traduz* - Traduz um texto em outro idioma para português.
 ┠❥ *!voz [idioma] [mensagem]* - Transforma texto em audio, exemplo : *!voz pt olá*
 ┠❥ *!img [1-10] [tema-imagem]* Pega 1-10 fotos com o tema que você escolher
 ┠❥ *!img [tema-imagem]* Pega 1 foto com o tema que você escolher
 ┠❥ *!noticias* - OLHA AS FAKE NEWSSS
 ┠❥ *!rastreio [código-rastreio]* - Rastreamento dos CORREIOS
 ╿
┯┷ ☾ COMANDOS DE GRUPO ☽
╽
┠❥ *!status* - Vê os recursos ligados/desligados
┠❥ *!add 55219xxxxx*
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
┷┯ ☾ OUTROS ☽
 ╽
 ┠❥ *!dono*
 ┠❥ *!mascote*
 ┠❥ *!viadometro* - Mede o nível de viadagem de alguma pessoa
 ┠❥ *!detector* - Detecta mentiras utilizando uma IA avançada
 ╿
 ╰╼❥ SOMOS O PROBLEMA.`
}

function admin() {
    return `
┏ ❣ *Lealzin BOT* ❣
╿
┷┯ ☾ ADMINISTRAÇÃO DO BOT ☽
 ╽
 ┠❥ *!sair* - Sai do grupo
 ┠❥ *!sairgrupos* - Sai de todos os grupos
 ┠❥ *!entrargrupo [link-grupo] [chave-autorização]* 
 ┠❥ *!limpartudo*  - Limpa todos os chats(Grupos e contatos)
 ┠❥ *!limpar*  - Limpa todos os chats de contatos
 ┠❥ *!listablock*  - Lista todos os usuários bloqueados
 ┠❥ *!bloquear @usuario*  - Bloqueia o usuário mencionado
 ┠❥ *!desbloquear @usuario*  - Desbloqueia o usuário mencionado
 ┠❥ *!estado online|offline|manutencao*  - Seleciona o estado atual do bot
 ╿
 ╰╼❥ LEALZIN BOT SOMOS O PROBLEMA`
}

exports.help = help()
exports.admin = admin()
