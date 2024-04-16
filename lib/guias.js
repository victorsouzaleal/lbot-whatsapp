const obterBotVariaveis = require("../db-modulos/dados-bot-variaveis")

module.exports = guias = () => {
    const cabecalho = `❔ USO DO COMANDO ❔\n\n`
    let {prefixo, nome_adm, nome_bot} = obterBotVariaveis()
    return {
        info:{
            ajuda: cabecalho+
            `Ex: *${prefixo}ajuda* - Exibe o menu de comandos gerais.`,
            info: cabecalho+
            `Ex: *${prefixo}info* - Exibe as informações do bot, dono, etc.`,
            meusdados: cabecalho+
            `Ex: *${prefixo}meusdados* - Exibe seus dados gerais como comandos, mensagens, tipo de usuário, etc.`,
            reportar: cabecalho+
            `Ex: *${prefixo}reportar* mensagem - Reporta uma mensagem para a administração do Bot.`,
        },
        figurinhas: {
            s: cabecalho+
            `Ex: Envie/responda uma *imagem/gif/video* com *${prefixo}s* - Transforma em sticker.\n\n`+
            `Ex: Envie/responda uma *imagem/gif/video* com *${prefixo}s* 1 - Transforma em sticker circular.\n\n`+
            `Ex: Envie/responda uma *imagem/gif/video* com *${prefixo}s* 2 - Transforma em sticker sem cortar.`,
            ssf: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}ssf* - Retira o fundo da imagem e transforma em sticker.\n\n`+
            `*Obs*: Este comando funciona apenas com *IMAGENS*.`,
            tps: cabecalho+
            `Ex: *${prefixo}tps* texto - Transforma o texto que você digitou em sticker.`,
            atps: cabecalho+
            `Ex: *${prefixo}atps* texto - Transforma o texto que você digitou em sticker animado.`,
            simg: cabecalho+
            `Ex: Responda um sticker com *${prefixo}simg* - Transforma o sticker em imagem.\n\n`+
            `*Obs*: Este comando funciona apenas com *STICKERS NÃO ANIMADOS*.`,
        },
        downloads: {
            play: cabecalho+
            `Ex: *${prefixo}play* musica - Faz download de uma música do Youtube e envia como audio.`,
            yt: cabecalho+
            `Ex: *${prefixo}yt* titulo - Faz download de um video do Youtube com o titulo digitado e envia.`,
            fb: cabecalho+
            `Ex: *${prefixo}fb* link - Faz download de um video do Facebook pelo link digitado e envia.`,
            tw: cabecalho+
            `Ex: *${prefixo}tw* link - Faz download de um video/imagem do Twitter pelo link digitado e envia.`,
            tk: cabecalho+
            `Ex: *${prefixo}tk* link - Faz download de um video do Tiktok pelo link digitado e envia.`,
            ig: cabecalho+
            `Ex: *${prefixo}ig* link - Faz download de um video/foto do Instagram pelo link digitado e envia.\n\n`+
            `Ex: *${prefixo}ig* link 2 - Faz download do SEGUNDO video/foto do link (em caso do link ter mais de 1 video/foto).`,
            img: cabecalho+
            `Ex: *${prefixo}img* tema - Envia 1 imagem com o tema que você digitar.\n\n`+
            `Ex: *${prefixo}img* 5 tema - Envia 5 imagens com o tema que você digitar.`,
        },
        utilidade : {
            tabela: cabecalho+
            `Ex: *${prefixo}tabela* - Exibe a tabela de letras para criação de nicks.`,
            ouvir: cabecalho+
            `Ex: Responda um áudio com *${prefixo}ouvir* para transformar em texto.`,
            audio: cabecalho+
            `Responda um aúdio com um desses comandos :\n\n`+
            `Ex: *${prefixo}audio* grave - Torna audio mais grave e lento\n\n`+
            `Ex: *${prefixo}audio* agudo - Torna o audio mais agudo e rapido\n\n`+
            `Ex: *${prefixo}audio* estourar - Deixa o audio estourado\n\n`+
            `Ex: *${prefixo}audio* volume  - Aumenta o volume em 4 vezes\n\n`+
            `Ex: *${prefixo}audio* x2 - Acelera o audio em 2 vezes\n\n`+
            `Ex: *${prefixo}audio* reverso - Reverte o audio\n\n`+
            `*Obs*: Este comando funciona apenas com *AUDIOS*.`,
            traduz: cabecalho+
            `Ex: *${prefixo}traduz* pt texto - Traduz o texto que foi digitado para *Português*.\n\n`+
            `Ex: *${prefixo}traduz* en texto - Traduz o texto que foi digitado para *Inglês*.\n\n`+
            `Ex: Responda um *texto* com *${prefixo}traduz* pt - Traduz o resto respondido para *Português*.\n\n`+
            `Ex: Responda um *texto* com *${prefixo}traduz* en - Traduz o resto respondido para *Inglês*.\n\n`+
            `Idiomas suportados : \n`+
            `- 🇧🇷 Português (pt)\n`+
            `- 🇺🇸 Inglês (en)\n`+
            `- 🇯🇵 Japonês (ja)\n`+
            `- 🇮🇹 Italiano (it)\n`+
            `- 🇪🇸 Espanhol (es)\n`+
            `- 🇷🇺 Russo (ru)\n`+
            `- 🇰🇷 Coreano (ko)\n`,
            voz: cabecalho+
            `Ex: *${prefixo}voz* pt texto - Manda um audio falando o texto digitado com a voz do Google em Português-Brasil.\n\n`+
            `Ex: Responda um texto com *${prefixo}voz* pt - Manda um audio falando o texto respondido com a voz do Google em Português-Brasil.\n\n`+
            `Idiomas suportados : \n`+
            `- 🇧🇷 Português (pt)\n`+
            `- 🇺🇸 Inglês (en)\n`+
            `- 🇯🇵 Japonês (jp)\n`+
            `- 🇮🇹 Italiano (it)\n`+
            `- 🇪🇸 Espanhol (es)\n`+
            `- 🇷🇺 Russo (ru)\n`+
            `- 🇰🇷 Coreano (ko)\n`+
            `- 🇸🇪 Sueco (sv)\n`,
            noticias: cabecalho+
            `Ex: *${prefixo}noticias* - Exibe as notícias atuais.`,
            letra: cabecalho+
            `Ex: *${prefixo}letra* nome-musica - Exibe a letra da música que você digitou.`,
            rastreio: cabecalho+
            `Ex: *${prefixo}rastreio* PBXXXXXXXXXXX - Exibe o rastreio da encomenda dos correios que você digitou.`,
            calc: cabecalho+
            `Ex: *${prefixo}calc* 8x8 - Exibe o resultado do cálculo.\n\n`+
            `Ex: *${prefixo}calc* 1mm em 1km - Exibe o resultado do conversão de medidas.`,
            pesquisa: cabecalho+
            `Ex: *${prefixo}pesquisa* tema - Faz uma pesquisa com o tema que você digitar.`,
            moeda: cabecalho+
            `Ex: *${prefixo}moeda* real 20 - Converte 20 reais para outras moedas\n\n`+
            `Ex: *${prefixo}moeda* dolar 20 - Converte 20 dólares para outras moedas.\n\n`+
            `Ex: *${prefixo}moeda* euro 20 - Converte 20 euros para outras moedas.`,
            clima: cabecalho+
            `Ex: *${prefixo}clima* Rio de Janeiro - Mostra o clima atual e dos próximos dias para o Rio de Janeiro.`,
            ddd: cabecalho+
            `Ex: *${prefixo}ddd* 21 - Exibe qual estado e região do DDD 21.\n\n`+
            `Ex: Responda com *${prefixo}ddd* - Exibe qual estado e região do membro respondido.`,
            anime:cabecalho+
            `Ex: Envie/responda uma imagem com *${prefixo}anime* - Procura o anime pela imagem.\n\n`+
            `*Obs*: Este comando funciona apenas com *IMAGENS* e deve ser uma *CENA VÁLIDA DE ANIME*, *NÃO* podendo ser imagens com *baixa qualidade*, *wallpappers*, *imagens editadas/recortadas*.`,
            qualmusica: cabecalho+
            `Ex: Envie/responda um audio/video com *${prefixo}qualmusica* - Procura a música tocada no audio/video.\n\n`+
            `*Obs*: Este comando funciona apenas com *AUDIO/VIDEO*.`,
        },
        grupo:{
            regras: cabecalho+
            `Ex: *${prefixo}regras* - Exibe a descrição/regras do grupo`,
            status: cabecalho+
            `Ex: *${prefixo}status* - Exibe as configurações atuais do grupo`,
            blista: cabecalho+
            `Ex: Responda alguém com *${prefixo}blista* - Adiciona o numero de quem foi respondido a lista negra.\n\n`+
            `Ex: *${prefixo}blista* +55219xxxx-xxxx - Adiciona o número digitado a lista negra do grupo.`,
            dlista: cabecalho+
            `Ex: *${prefixo}dlista* +55219xxxx-xxxx - Remove o número digitado da lista negra do grupo.`,
            listanegra: cabecalho+
            `Ex: *${prefixo}listanegra* - Exibe a lista negra do grupo.`,
            bv: cabecalho+
            `Ex: *${prefixo}bv*  - Liga/desliga a mensagem de bem-vindo para novos membros.\n\n`+
            `Ex: *${prefixo}bv* [mensagem]  - Liga a mensagem de bem-vindo com uma mensagem da sua escolha.`,
            aflood: cabecalho+
            `Ex: *${prefixo}aflood*  - Liga/desliga o anti-flood.\n\n`+
            `Ex: *${prefixo}aflood* 5 15  - Maxímo de mensagens fica 5 mensagens a cada 15 segundos.`,
            afake: cabecalho+
            `Ex: *${prefixo}afake* - Liga/desliga o anti-fake em grupos.\n`+
            `Ex: *${prefixo}afake* DDI - Configura o anti-fake para que todos números com o DDI exterior seja banido, exceto o que você escolheu.\n`+
            `Ex: *${prefixo}afake* DDI1 DDI2 DDI3 - Configura o anti-fake para que todos números com DDI exterior sejam banidos, excetos o que você escolheu.\n\n`+
            `*Obs*: A ativação do anti-fake bane pessoas com DDI do exterior (que não sejam 55 - Brasil).`,
            alink: cabecalho+
            `Ex: *${prefixo}alink* - Liga/desliga o antilink e bane quem postar qualquer tipo de link.\n\n`+
            `Ex: *${prefixo}alink* twitter facebook youtube whatsapp - Liga o antilink e bane quem postar link que não seja do Twitter, Facebook, Youtube ou WhatsApp.`,
            mutar: cabecalho+
            `Ex: *${prefixo}mutar* - Liga/desliga a execução de comandos dos membros.`,
            autosticker: cabecalho+
            `Ex: *${prefixo}autosticker* - Liga/desliga a criação automatica de stickers sem precisar de comandos.`,
            add: cabecalho+
            `Ex: *${prefixo}add* 5521xxxxxxxxx - Digite o numero com o código do país para adicionar a pessoa.\n\n`+
            `Ex: *${prefixo}add* 5521xxxxxxxxx, 5521xxxxxxxxx - Digite os numeros com o código do país (adiciona mais de uma pessoa no grupo).`,
            ban: cabecalho+
            `Ex: *${prefixo}ban* @membro - Para banir um membro marcando ele.\n\n`+
            `Ex: Responder alguém com *${prefixo}ban* - Bane a pessoa que você respondeu.`,
            rlink: cabecalho+
            `Ex: *${prefixo}rlink* - Redefine o link do grupo.`,
            contador: cabecalho+
            `Ex: *${prefixo}contador* - Liga/desliga a contagem de mensagens no grupo.`,
            atividade:cabecalho+
            `Ex: *${prefixo}atividade* @membro - Mostra a atividade do membro mencionado.\n\n`+
            `Ex: Responder com *${prefixo}atividade* - Mostra a atividade do membro que você respondeu.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.`,
            alterarcont:cabecalho+
            `Ex: *${prefixo}alterarcont* @membro 50 - Altera a quantidade de mensagens de um membro mencionado para 50 mensagens.\n\n`+
            `Ex: Responder com *${prefixo}alterarcont* 20 - Altera a quantidade de mensagens do membro que você respondeu para 20 mensagens.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.`,
            imarcar:cabecalho+
            `Ex: *${prefixo}imarcar* 5 - Marca todos os membros com menos de 5 mensagens.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.`,
            ibanir:cabecalho+
            `Ex: *${prefixo}ibanir* 10 - Bane todos os membros com menos de 10 mensagens.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.`,
            topativos:cabecalho+
            `Ex: *${prefixo}topativos* 10 - Marca os 10 membros com mais mensagens do grupo.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.`,
            enquete:cabecalho+
            `Ex: *${prefixo}enquete* tema,opcao1,opcao2,opcao3 - Cria uma enquete com um tema e as opções de voto.\n`,   
            fotogrupo: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}fotogrupo* - Altera a foto do grupo.\n\n`,
            bcmd: cabecalho+
            `Ex: *${prefixo}bcmd* ${prefixo}s ${prefixo}sgif ${prefixo}play - Bloqueia no grupo os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play (você pode escolher os comandos a sua necessidade).\n\n`+
            `Ex: *${prefixo}bcmd* figurinhas - Bloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}bcmd* utilidades - Bloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}bcmd* downloads - Bloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}bcmd* diversão - Bloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Você não pode bloquear comandos de administrador.`,
            dcmd: cabecalho+
            `Ex: *${prefixo}dcmd* ${prefixo}s ${prefixo}sgif ${prefixo}play - Desbloqueia no grupo os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play.\n\n`+
            `Ex: *${prefixo}dcmd* todos - Desbloqueia todos os comandos.\n\n`+
            `Ex: *${prefixo}dcmd* figurinhas - Desbloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}dcmd* utilidades - Desbloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}dcmd* downloads - Desbloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}dcmd* diversão - Desbloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Verifique os comandos que estão bloqueados com *${prefixo}status*.`,
            link: cabecalho+
            `Ex: *${prefixo}link* - Exibe o link do grupo.`,
            adms:  cabecalho+
            `Ex: Responder com *${prefixo}adms* - Marca todos os *ADMINISTRADORES* em uma postagem.\n\n`+
            `Ex: *${prefixo}adms* - Marca os *ADMINISTRADORES* do grupo.`,
            dono:  cabecalho+
            `Ex: *${prefixo}dono* - Exibe e marca o dono do grupo.`,
            mt: cabecalho+
            `Ex: *${prefixo}mt* - Marca todos os *MEMBROS/ADMIN* do grupo.\n\n`+
            `Ex: *${prefixo}mt* mensagem - Marca todos os *MEMBROS/ADMIN* do grupo com uma mensagem.`,
            mm: cabecalho+
            `Ex: *${prefixo}mm* - Marca todos os *MEMBROS* do grupo.\n\n`+
            `Ex: *${prefixo}mm* mensagem - Marca todos os *MEMBROS* do grupo com uma mensagem.`,
            bantodos: cabecalho+
            `Ex: *${prefixo}bantodos* - Bane todos os membros do grupo.\n\n`+
            `*Obs* : Apenas o dono do grupo pode usar este comando.`,
            promover: cabecalho+
            `Ex: *${prefixo}promover* @membro - Promove o membro mencionado a *ADMINISTRADOR*.\n\n`+
            `Ex: Responder com *${prefixo}promover* - Promove o usuário respondido a *ADMINISTRADOR*.`,
            rebaixar: cabecalho+
            `Ex: *${prefixo}rebaixar* @admin - Rebaixa o administrador mencionado a *MEMBRO*.\n\n`+
            `Ex: Responder com *${prefixo}rebaixar* - Rebaixa o administrador respondido a *MEMBRO*.`,
            apg: cabecalho+
            `Ex: Responder com *${prefixo}apg* - Apaga a mensagem do bot que foi respondida com esse comando.\n\n`+
            `*Obs* : Só é possivel apagar as mensagens do bot.`,
            f: cabecalho+
            `Ex: *${prefixo}f* - Abre/Fecha o grupo.`
        },
        diversao:{
            detector:cabecalho+
            `Ex: Responder com *${prefixo}detector* - Exibe o resultado da máquina da verdade.`,
            viadometro:cabecalho+
            `Ex: *${prefixo}viadometro* @membro - Mede o nível de viadagem do membro mencionado.\n\n`+
            `Ex: Responder com *${prefixo}viadometro* - Mede o nível de viadagem do membro respondido.`,
            bafometro: cabecalho+
            `Ex: *${prefixo}bafometro* @membro - Mede o nível de alcool do membro mencionado.\n\n`+
            `Ex: Responder com *${prefixo}bafometro* - Mede o nível de alcool do membro respondido.`,
            caracoroa: cabecalho+
            `Ex: *${prefixo}caracoroa* - Decisão no cara ou coroa, exibe o lado da moeda que cair.`,
            chance: cabecalho+
            `Ex: *${prefixo}chance de ficar rico* - Calcula sua chance de um tema aleatório a sua escolha.`,
            ppt: cabecalho+
            `Ex: *${prefixo}ppt* pedra - Escolhe pedra, para jogar pedra, papel ou tesoura.\n\n`+
            `Ex: *${prefixo}ppt* papel - Escolhe papel, para jogar pedra, papel ou tesoura.\n\n`+
            `Ex: *${prefixo}ppt* tesoura - Escolhe tesoura, para jogar pedra, papel ou tesoura.`,
            top5:cabecalho+
            `Ex: *${prefixo}top5* tema - Exibe uma ranking de 5 membros aleatórios com o tema que você escolher.`,
            mascote:cabecalho+
            `Ex: *${prefixo}mascote* - Exibe o mascote do BOT.`,
            roletarussa: cabecalho+
            `Ex: *${prefixo}roletarussa* - Bane um membro aleatório do grupo.\n\n`+
            `*Obs*: Comando apenas para administradores, pode banir qualquer um exceto o dono do grupo e o BOT.`,
            casal: cabecalho+
            `Ex: *${prefixo}casal* - Escolhe 2 pessoas aleatórias do grupo para formar um casal.`,
            par: cabecalho+
            `Ex: *${prefixo}par* @membro1 @membro2 - Mede o nível de compatibilidade dos 2 membros mencionados.`,
            fch: cabecalho+
            `Ex: *${prefixo}fch* - Exibe uma frase aleatória montada com as cartas do jogo Cartas contra a Humanidade.`,
        },
        admin:{
            admin: cabecalho+
            `Ex: *${prefixo}admin* - Exibe o menu de administração do Bot.`,
            grupos: cabecalho+
            `Ex: *${prefixo}grupos* - Mostra os grupos atuais que o bot está e suas informações.`,
            fotobot: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}fotobot* - Altera a foto do BOT.\n\n`,
            infocompleta: cabecalho+
            `Ex: *${prefixo}infocompleta* - Exibe as informações completas do bot, inclusive as configurações atuais.`,
            entrargrupo:cabecalho+
            `Ex: *${prefixo}entrargrupo* link - Entra em um grupo por link de convite.`,
            sair:cabecalho+
            `Ex: *${prefixo}sair* - Faz o bot sair do grupo.`,
            listablock:cabecalho+
            `Ex: *${prefixo}listablock* - Exibe a lista de usuários bloqueados pelo bot.`,
            bcmdglobal:cabecalho+
            `Ex: *${prefixo}bcmdglobal* ${prefixo}s ${prefixo}sgif ${prefixo}play - Bloqueia  os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play (você pode escolher os comandos a sua necessidade).\n\n`+
            `Ex: *${prefixo}bcmdglobal* figurinhas - Bloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}bcmdglobal* utilidades - Bloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}bcmdglobal* downloads - Bloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}bcmdglobal* diversão - Bloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Você não pode bloquear comandos de administrador.`,
            dcmdglobal:cabecalho+
            `Ex: *${prefixo}dcmdglobal* ${prefixo}s ${prefixo}sgif ${prefixo}play - Desbloqueia  os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play.\n\n`+
            `Ex: *${prefixo}dcmdglobal* todos - Desbloqueia todos os comandos.\n\n`+
            `Ex: *${prefixo}dcmdglobal* figurinhas - Desbloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}dcmdglobal* utilidades - Desbloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}dcmdglobal* downloads - Desbloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}dcmdglobal* diversão - Desbloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Verifique os comandos que estão bloqueados com ${prefixo}infocompleta.`,
            autostickerpv: cabecalho+
            `Ex: *${prefixo}autostickerpv* - Liga/desliga a criação automatica de stickers sem precisar de comandos no privado.`,
            nomebot: cabecalho+
            `Ex: *${prefixo}nomebot* Teste123 - Muda o nome do *BOT* para *Teste123* e atualiza os menus com o novo nome.`,
            nomeadm: cabecalho+
            `Ex: *${prefixo}nomeadm* Teste123 - Muda o nome do *ADMINISTRADOR* para *Teste123* e atualiza os menus com o novo nome.`,
            nomesticker: cabecalho+
            `Ex: *${prefixo}nomesticker* Teste123 - Muda o nome do *PACOTE DE STICKERS* para *Teste123* e atualiza os novos stickers com o novo nome.`,
            prefixo: cabecalho+
            `Ex: *${prefixo}prefixo* .  - Muda o prefixo dos *COMANDOS* para *.* e atualiza os menus e comandos com o novo prefixo.\n\n`+
            `Suporta os seguintes prefixos : *!*  *#*  *.*  ***`,
            pvliberado: cabecalho+
            `Ex: *${prefixo}pvliberado* - Liga/desliga os comandos em MENSAGENS PRIVADAS.`,
            rconfig: cabecalho+
            `Ex: *${prefixo}rconfig* - Reseta a configuração de todos os grupos.`,
            sairgrupos: cabecalho+
            `Ex: *${prefixo}sairgrupos* - Sai de todos os grupos.`,
            bloquear: cabecalho+
            `Ex: *${prefixo}bloquear* @membro - Para o bot bloquear o membro mencionado.\n\n`+
            `Ex: *${prefixo}bloquear* +55 (xx) xxxxx-xxxx - Para o bot bloquear o número digitado.\n\n`+
            `Ex: Responder alguém com *${prefixo}bloquear* - Para o bot bloquear o membro que você respondeu.`,
            desbloquear: cabecalho+
            `Ex: *${prefixo}desbloquear* @membro - Para o bot desbloquear o membro mencionado.\n\n`+
            `Ex: *${prefixo}desbloquear* +55 (xx) xxxxx-xxxx - Para o bot desbloquear o número digitado.\n\n`+
            `Ex: Responder alguém com *${prefixo}desbloquear* - Para o bot desbloquear o membro que você respondeu.`,
            usuarios: cabecalho+
            `Ex: *${prefixo}usuarios* bronze - Mostra todos os usuários do tipo *BRONZE*.\n\n`+
            `*Obs*: Use o *${prefixo}tipos* para ver os tipos disponíveis de usuários.`,
            limitediario: cabecalho+
            `Ex: *${prefixo}limitediario* - Ativa/desativa o limite diario de comandos.`,
            taxalimite: cabecalho+
            `Ex: *${prefixo}taxalimite* 5 60 - Ativa a taxa limite de comandos para 5 comandos a cada minuto por usuário, caso o usuário ultrapasse ele fica 60 segundos impossibilitado de fazer comandos.\n\n`+
            `*Obs*: Digite *${prefixo}taxalimite* novamente para desativar a taxa limite de comandos.`,
            limitarmsgs: cabecalho+
            `Ex: *${prefixo}limitarmsgs* 10 10 - Ativa o limite de mensagens privadas em 10 mensagens a cada 10 segundos, se o usuário ultrapassar ele será bloqueado.\n\n`+
            `*Obs*: Digite *${prefixo}limitarmsgs* novamente para desativar o limite de mensagens privadas.`,
            tipos: cabecalho+
            `Ex: *${prefixo}tipos* - Exibe os tipos de usuários disponíveis e quantos comandos estão configurados por dia.`,
            limpartipo: cabecalho+
            `Ex: *${prefixo}limpartipo* ouro - Transforma todos os usuários do tipo *OURO* em *BRONZE*.\n\n`+
            `*Obs*: Use o *${prefixo}tipos* para ver os tipos disponíveis de usuários.`,
            mudarlimite: cabecalho+
            `Ex: *${prefixo}mudarlimite* bronze 50 - Altera o limite diário de comandos do usuário *BRONZE* para 50/dia.\n\n`+
            `*Obs*: O comando de *${prefixo}limitediario* deve estar ativado.\n`+
            `*Obs²*: Verifique os tipos disponíveis de usuários em *${prefixo}tipos*.\n`+
            `*Obs³*: Para ficar sem limite de comandos digite -1 no campo de limite.`,
            alterartipo: cabecalho+
            `Ex: *${prefixo}alterartipo* ouro @usuario - Altera o tipo do usuário mencionado para *OURO*.\n\n`+
            `Ex: Responder com *${prefixo}alterartipo* bronze - Altera o tipo do usuário respondido para *BRONZE*.\n\n`+
            `Ex: *${prefixo}alterartipo* prata  55219xxxxxxxx - Altera o tipo do usuário do número para *PRATA*.\n\n`+
            `*Obs*: Use o *${prefixo}tipos* para ver os tipos disponíveis de usuários.`,
            rtodos: cabecalho+
            `Ex: *${prefixo}rtodos* - Reseta os comandos diários de todos os usuários.\n\n`+
            `*Obs*: O comando de *${prefixo}limitediario* deve estar ativado.`,
            r: cabecalho+
            `Ex: *${prefixo}r* @usuario - Reseta os comandos diários de um usuário mencionado.\n\n`+
            `Ex: Responder com *${prefixo}r* - Reseta os comandos diários do usuário respondido.\n\n`+
            `Ex: *${prefixo}r* 55219xxxxxxxx - Reseta os comandos diários do usuário com esse número.\n\n`+
            `*Obs*: O comando de *${prefixo}limitediario* deve estar ativado.`,
            verdados:cabecalho+
            `Ex: *${prefixo}verdados* @usuario - Mostra os dados gerais do usuário mencionado.\n\n`+
            `Ex: Responder com *${prefixo}verdados* - Mostra os dados gerais do usuário respondido.\n\n`+
            `Ex: *${prefixo}verdados* 55219xxxxxxxx - Mostra os dados gerais do usuário com esse número.`,
            bcgrupos: cabecalho+
            `Ex: *${prefixo}bcgrupos* mensagem - Envia uma mensagem para todos os *GRUPOS*.`,
            estado: cabecalho+
            `Ex: *${prefixo}estado* online - Muda o status do bot para ONLINE.\n\n`+
            `Ex: *${prefixo}estado* offline - Muda o status do bot para OFFLINE.\n\n`+
            `Ex: *${prefixo}estado* manutencao - Muda o status do bot para MANUTENCÃO.`,
            desligar: cabecalho+
            `Ex: *${prefixo}desligar* - Desliga o BOT.`,
            ping: cabecalho+
            `Ex: *${prefixo}ping* - Exibe as informações do sistema do BOT e o tempo de resposta dele.`
        }
   
    }
}