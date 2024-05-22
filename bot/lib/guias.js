export const obterGuias = (prefixo) => {
    const cabecalho = `❔ USO DO COMANDO ❔\n\n`
    return {
        info:{
            menu: cabecalho+
            `Ex: *${prefixo}menu* - Exibe o menu de comandos gerais.\n`,
            info: cabecalho+
            `Ex: *${prefixo}info* - Exibe as informações do bot, dono, etc.\n`,
            meusdados: cabecalho+
            `Ex: *${prefixo}meusdados* - Exibe seus dados gerais como comandos, mensagens, tipo de usuário, etc.\n`,
            reportar: cabecalho+
            `Ex: *${prefixo}reportar* mensagem - Reporta uma mensagem para a administração do Bot.\n`,
        },
        figurinhas: {
            s: cabecalho+
            `Ex: Envie/responda uma *IMAGEM/VIDEO* com *${prefixo}s* - Transforma em sticker.\n`+
            `Ex: Envie/responda uma *IMAGEM* com *${prefixo}s 1* - Transforma em sticker circular.\n`,
            snome: cabecalho+
            `Ex: Responda um *STICKER* com *${prefixo}snome* pack, autor - Renomeia o nome do pack e do autor do sticker.`,
            ssf: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}ssf* - Retira o fundo da imagem e transforma em sticker.\n\n`+
            `*Obs*: Este comando funciona apenas com *IMAGENS*.\n`,
            emojimix: cabecalho+
            `Ex: *${prefixo}emojimix* 💩+😀 - Junta os dois emojis e transforma em sticker.\n\n`+
            `*Obs*: Nem todos os emojis são compátiveis, então vá tentando fazer combinações.\n`,
            tps: cabecalho+
            `Ex: *${prefixo}tps* texto - Transforma o texto que você digitou em sticker.\n`,
            atps: cabecalho+
            `Ex: *${prefixo}atps* texto - Transforma o texto que você digitou em sticker animado.\n`,
            simg: cabecalho+
            `Ex: Responda um sticker com *${prefixo}simg* - Transforma o sticker em imagem.\n\n`+
            `*Obs*: Este comando funciona apenas com *STICKERS NÃO ANIMADOS*.\n`,
        },
        downloads: {
            play: cabecalho+
            `Ex: *${prefixo}play* musica - Faz download de uma música do Youtube e envia como audio.\n`,
            yt: cabecalho+
            `Ex: *${prefixo}yt* titulo - Faz download de um video do Youtube com o titulo digitado e envia.\n`,
            fb: cabecalho+
            `Ex: *${prefixo}fb* link - Faz download de um video do Facebook pelo link digitado e envia.\n`,
            tw: cabecalho+
            `Ex: *${prefixo}tw* link - Faz download de um video/imagem do Twitter pelo link digitado e envia.\n`,
            tk: cabecalho+
            `Ex: *${prefixo}tk* link - Faz download de um video do Tiktok pelo link digitado e envia.\n`,
            ig: cabecalho+
            `Ex: *${prefixo}ig* link - Faz download de um video/foto do Instagram pelo link digitado e envia.\n\n`+
            `Ex: *${prefixo}ig* link 2 - Faz download do SEGUNDO video/foto do link (em caso do link ter mais de 1 video/foto).\n`,
            img: cabecalho+
            `Ex: *${prefixo}img* tema - Envia uma imagem com o tema que você digitar.\n`
        },
        utilidade : {
            upimg: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}upimg* - Faz upload da imagem e retorna o link.\n`,
            encurtar: cabecalho+
            `Ex: *${prefixo}encurtar* link - Encurta o link digitado.\n`,
            gpt: cabecalho+
            `Ex: *${prefixo}gpt* texto - Recebe uma resposta do CHAT GPT de acordo com o texto.\n`,
            criarimg: cabecalho+
            `Ex: *${prefixo}criarimg* texto - Criar uma imagem de acordo com o texto usando IA.\n`,
            rbg: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}rbg* - Retira o fundo da imagem.\n\n`,
            tabela: cabecalho+
            `Ex: *${prefixo}tabela* - Exibe a tabela de letras para criação de nicks.\n`,
            ouvir: cabecalho+
            `Ex: Responda um áudio com *${prefixo}ouvir* para transformar em texto.\n`,
            audio: cabecalho+
            `Responda um aúdio com um desses comandos :\n\n`+
            `Ex: *${prefixo}audio* grave - Torna audio mais grave e lento\n\n`+
            `Ex: *${prefixo}audio* agudo - Torna o audio mais agudo e rapido\n\n`+
            `Ex: *${prefixo}audio* estourar - Deixa o audio estourado\n\n`+
            `Ex: *${prefixo}audio* volume  - Aumenta o volume em 4 vezes\n\n`+
            `Ex: *${prefixo}audio* x2 - Acelera o audio em 2 vezes\n\n`+
            `Ex: *${prefixo}audio* reverso - Reverte o audio\n\n`+
            `*Obs*: Este comando funciona apenas com *AUDIOS*.\n`,
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
            `Ex: *${prefixo}noticias* - Exibe as notícias atuais.\n`,
            letra: cabecalho+
            `Ex: *${prefixo}letra* nome-musica - Exibe a letra da música que você digitou.\n`,
            rastreio: cabecalho+
            `Ex: *${prefixo}rastreio* PBXXXXXXXXXXX - Exibe o rastreio da encomenda dos correios que você digitou.\n`,
            calc: cabecalho+
            `Ex: *${prefixo}calc* 8x8 - Exibe o resultado do cálculo.\n\n`+
            `Ex: *${prefixo}calc* 1mm em 1km - Exibe o resultado do conversão de medidas.\n`,
            pesquisa: cabecalho+
            `Ex: *${prefixo}pesquisa* tema - Faz uma pesquisa com o tema que você digitar.\n`,
            filmes:cabecalho+
            `Ex: *${prefixo}filmes* - Exibe as tendências atuais de filmes.\n`,
            series:cabecalho+
            `Ex: *${prefixo}series* - Exibe as tendências atuais de séries.\n`,
            moeda: cabecalho+
            `Ex: *${prefixo}moeda* real 20 - Converte 20 reais para outras moedas\n\n`+
            `Ex: *${prefixo}moeda* dolar 20 - Converte 20 dólares para outras moedas.\n\n`+
            `Ex: *${prefixo}moeda* euro 20 - Converte 20 euros para outras moedas.\n`,
            clima: cabecalho+
            `Ex: *${prefixo}clima* Rio de Janeiro - Mostra o clima atual e dos próximos dias para o Rio de Janeiro.\n`,
            ddd: cabecalho+
            `Ex: *${prefixo}ddd* 21 - Exibe qual estado e região do DDD 21.\n\n`+
            `Ex: Responda com *${prefixo}ddd* - Exibe qual estado e região do membro respondido.\n`,
            anime:cabecalho+
            `Ex: Envie/responda uma imagem com *${prefixo}anime* - Procura o anime pela imagem.\n\n`+
            `*Obs*: Este comando funciona apenas com *IMAGENS* e deve ser uma *CENA VÁLIDA DE ANIME*, *NÃO* podendo ser imagens com *baixa qualidade*, *wallpappers*, *imagens editadas/recortadas*.\n`,
            qualmusica: cabecalho+
            `Ex: Envie/responda um audio/video com *${prefixo}qualmusica* - Procura a música tocada no audio/video.\n\n`+
            `*Obs*: Este comando funciona apenas com *AUDIO/VIDEO*.\n`,
        },
        grupo:{
            regras: cabecalho+
            `Ex: *${prefixo}regras* - Exibe a descrição/regras do grupo\n`,
            status: cabecalho+
            `Ex: *${prefixo}status* - Exibe as configurações atuais do grupo\n`,
            blista: cabecalho+
            `Ex: Responda alguém com *${prefixo}blista* - Adiciona o numero de quem foi respondido a lista negra e bane em seguida.\n\n`+
            `Ex: Marque alguém com *${prefixo}blista* - Adiciona o numero de quem foi marcado a lista negra e bane em seguida.\n\n`+
            `Ex: *${prefixo}blista* +55219xxxx-xxxx - Adiciona o número digitado a lista negra do grupo e bane em seguida.\n.`,
            dlista: cabecalho+
            `Ex: *${prefixo}dlista* +55219xxxx-xxxx - Remove o número digitado da lista negra do grupo.\n`,
            listanegra: cabecalho+
            `Ex: *${prefixo}listanegra* - Exibe a lista negra do grupo.\n`,
            bv: cabecalho+
            `Ex: *${prefixo}bv*  - Liga/desliga a mensagem de bem-vindo para novos membros.\n\n`+
            `Ex: *${prefixo}bv* mensagem - Liga a mensagem de bem-vindo com uma mensagem da sua escolha.\n`,
            aflood: cabecalho+
            `Ex: *${prefixo}aflood*  - Liga/desliga o anti-flood.\n\n`+
            `Ex: *${prefixo}aflood* 5 15  - Maxímo de mensagens fica 5 mensagens a cada 15 segundos.\n`,
            afake: cabecalho+
            `Ex: *${prefixo}afake* - Liga/desliga o anti-fake em grupos.\n`+
            `Ex: *${prefixo}afake* DDI - Configura o anti-fake para que todos números com o DDI exterior seja banido, exceto o que você escolheu.\n`+
            `Ex: *${prefixo}afake* DDI1 DDI2 DDI3 - Configura o anti-fake para que todos números com DDI exterior sejam banidos, excetos o que você escolheu.\n\n`+
            `*Obs*: A ativação do anti-fake bane pessoas com DDI do exterior (que não sejam 55 - Brasil).\n`,
            alink: cabecalho+
            `Ex: *${prefixo}alink* - Liga/desliga o antilink e apaga a mensagem de quem postar qualquer tipo de link.\n`,
            mutar: cabecalho+
            `Ex: *${prefixo}mutar* - Liga/desliga a execução de comandos dos membros.\n`,
            autosticker: cabecalho+
            `Ex: *${prefixo}autosticker* - Liga/desliga a criação automatica de stickers sem precisar de comandos.\n`,
            autorevelar: cabecalho+
            `Ex: *${prefixo}autorevelar* - Liga/desliga o envio automático a revelação de mensagens de visualização única para o PV.\n`,
            revelar: cabecalho+
            `Ex: Responder mensagem única com *${prefixo}revelar* - Revela e reenvia o conteúdo da mensagem única como uma mensagem normal.\n`,
            add: cabecalho+
            `Ex: *${prefixo}add* 5521xxxxxxxxx - Digite o numero com o código do país para adicionar a pessoa.\n\n`+
            `Ex: *${prefixo}add* 5521xxxxxxxxx, 5521xxxxxxxxx - Digite os numeros com o código do país (adiciona mais de uma pessoa no grupo).\n`,
            ban: cabecalho+
            `Ex: *${prefixo}ban* @membro - Para banir um membro marcando ele.\n\n`+
            `Ex: Responder alguém com *${prefixo}ban* - Bane a pessoa que você respondeu.\n`,
            rlink: cabecalho+
            `Ex: *${prefixo}rlink* - Redefine o link do grupo.\n`,
            contador: cabecalho+
            `Ex: *${prefixo}contador* - Liga/desliga a contagem de mensagens no grupo.\n`,
            atividade:cabecalho+
            `Ex: *${prefixo}atividade* @membro - Mostra a atividade do membro mencionado.\n\n`+
            `Ex: Responder com *${prefixo}atividade* - Mostra a atividade do membro que você respondeu.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.\n`,
            imarcar:cabecalho+
            `Ex: *${prefixo}imarcar* 5 - Marca todos os membros com menos de 5 mensagens.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.\n`,
            ibanir:cabecalho+
            `Ex: *${prefixo}ibanir* 10 - Bane todos os membros com menos de 10 mensagens.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.\n`,
            topativos:cabecalho+
            `Ex: *${prefixo}topativos* 10 - Marca os 10 membros com mais mensagens do grupo.\n\n`+
            `*Obs*: Este comando só funciona com o *${prefixo}contador* ativado.\n`,
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
            `*Obs* : Você não pode bloquear comandos de administrador.\n`,
            dcmd: cabecalho+
            `Ex: *${prefixo}dcmd* ${prefixo}s ${prefixo}sgif ${prefixo}play - Desbloqueia no grupo os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play.\n\n`+
            `Ex: *${prefixo}dcmd* todos - Desbloqueia todos os comandos.\n\n`+
            `Ex: *${prefixo}dcmd* figurinhas - Desbloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}dcmd* utilidades - Desbloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}dcmd* downloads - Desbloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}dcmd* diversão - Desbloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Verifique os comandos que estão bloqueados com *${prefixo}status*.\n`,
            link: cabecalho+
            `Ex: *${prefixo}link* - Exibe o link do grupo.\n`,
            adms:  cabecalho+
            `Ex: Responder com *${prefixo}adms* - Marca todos os *ADMINISTRADORES* em uma postagem.\n\n`+
            `Ex: *${prefixo}adms* - Marca os *ADMINISTRADORES* do grupo.\n`,
            dono:  cabecalho+
            `Ex: *${prefixo}dono* - Exibe e marca o dono do grupo.\n`,
            mt: cabecalho+
            `Ex: *${prefixo}mt* - Marca todos os *MEMBROS/ADMIN* do grupo.\n\n`+
            `Ex: *${prefixo}mt* mensagem - Marca todos os *MEMBROS/ADMIN* do grupo com uma mensagem.\n`,
            mm: cabecalho+
            `Ex: *${prefixo}mm* - Marca todos os *MEMBROS* do grupo.\n\n`+
            `Ex: *${prefixo}mm* mensagem - Marca todos os *MEMBROS* do grupo com uma mensagem.\n`,
            bantodos: cabecalho+
            `Ex: *${prefixo}bantodos* - Bane todos os membros do grupo.\n\n`+
            `*Obs* : Apenas o dono do grupo pode usar este comando.\n`,
            promover: cabecalho+
            `Ex: *${prefixo}promover* @membro - Promove o membro mencionado a *ADMINISTRADOR*.\n\n`+
            `Ex: Responder com *${prefixo}promover* - Promove o usuário respondido a *ADMINISTRADOR*.\n`,
            rebaixar: cabecalho+
            `Ex: *${prefixo}rebaixar* @admin - Rebaixa o administrador mencionado a *MEMBRO*.\n\n`+
            `Ex: Responder com *${prefixo}rebaixar* - Rebaixa o administrador respondido a *MEMBRO*.\n`,
            apg: cabecalho+
            `Ex: Responder com *${prefixo}apg* - Apaga a mensagem que foi respondida com esse comando.\n\n`+
            `*Obs* : O bot precisa ser administrador.\n`,
            f: cabecalho+
            `Ex: *${prefixo}f* - Abre/Fecha o grupo.\n`
        },
        diversao:{
            detector:cabecalho+
            `Ex: Responder com *${prefixo}detector* - Exibe o resultado da máquina da verdade.\n`,
            simi:cabecalho+
            `Ex: *${prefixo}simi* frase  - Envia um texto para o SimSimi responder.\n`,
            viadometro:cabecalho+
            `Ex: *${prefixo}viadometro* @membro - Mede o nível de viadagem do membro mencionado.\n\n`+
            `Ex: Responder com *${prefixo}viadometro* - Mede o nível de viadagem do membro respondido.\n`,
            bafometro: cabecalho+
            `Ex: *${prefixo}bafometro* @membro - Mede o nível de alcool do membro mencionado.\n\n`+
            `Ex: Responder com *${prefixo}bafometro* - Mede o nível de alcool do membro respondido.\n`,
            caracoroa: cabecalho+
            `Ex: *${prefixo}caracoroa* cara - Escolhe cara e joga a moeda.\n\n`+
            `Ex: *${prefixo}caracoroa* coroa - Escolhe coroa e joga a moeda.\n`,
            chance: cabecalho+
            `Ex: *${prefixo}chance de ficar rico* - Calcula sua chance de um tema aleatório a sua escolha.\n`,
            ppt: cabecalho+
            `Ex: *${prefixo}ppt* pedra - Escolhe pedra, para jogar pedra, papel ou tesoura.\n\n`+
            `Ex: *${prefixo}ppt* papel - Escolhe papel, para jogar pedra, papel ou tesoura.\n\n`+
            `Ex: *${prefixo}ppt* tesoura - Escolhe tesoura, para jogar pedra, papel ou tesoura.\n`,
            top5:cabecalho+
            `Ex: *${prefixo}top5* tema - Exibe uma ranking de 5 membros aleatórios com o tema que você escolher.\n`,
            mascote:cabecalho+
            `Ex: *${prefixo}mascote* - Exibe o mascote do BOT.\n`,
            roletarussa: cabecalho+
            `Ex: *${prefixo}roletarussa* - Bane um membro aleatório do grupo.\n\n`+
            `*Obs*: Comando apenas para administradores, pode banir qualquer um exceto o dono do grupo e o BOT.\n`,
            casal: cabecalho+
            `Ex: *${prefixo}casal* - Escolhe 2 pessoas aleatórias do grupo para formar um casal.\n`,
            par: cabecalho+
            `Ex: *${prefixo}par* @membro1 @membro2 - Mede o nível de compatibilidade dos 2 membros mencionados.\n`,
            fch: cabecalho+
            `Ex: *${prefixo}fch* - Exibe uma frase aleatória montada com as cartas do jogo Cartas contra a Humanidade.\n`,
        },
        admin:{
            admin: cabecalho+
            `Ex: *${prefixo}admin* - Exibe o menu de administração do Bot.\n`,
            grupos: cabecalho+
            `Ex: *${prefixo}grupos* - Mostra os grupos atuais que o bot está e suas informações.\n`,
            linkgrupo: cabecalho+
            `Ex: *${prefixo}linkgrupo* 1 - Exibe o link do grupo selecionado.\n\n`+
            `*Obs*: Para ver o número dos grupos é necessário checar no comando *${prefixo}grupos*\n`,
            fotobot: cabecalho+
            `Ex: Envie/responda uma *imagem* com *${prefixo}fotobot* - Altera a foto do BOT.\n`,
            infocompleta: cabecalho+
            `Ex: *${prefixo}infocompleta* - Exibe as informações completas do bot, inclusive as configurações atuais.\n`,
            entrargrupo:cabecalho+
            `Ex: *${prefixo}entrargrupo* link - Entra em um grupo por link de convite.\n`,
            sair:cabecalho+
            `Ex: Digite *${prefixo}sair* em um grupo - Faz o bot sair do grupo atual.\n`+
            `Ex: *${prefixo}sair* 1 - Faz o bot sair do grupo selecionado.\n\n`+
            `*Obs*: Para ver o número dos grupos é necessário checar no comando *${prefixo}grupos*\n`,
            listablock:cabecalho+
            `Ex: *${prefixo}listablock* - Exibe a lista de usuários bloqueados pelo bot.\n`,
            bcmdglobal:cabecalho+
            `Ex: *${prefixo}bcmdglobal* ${prefixo}s ${prefixo}sgif ${prefixo}play - Bloqueia  os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play (você pode escolher os comandos a sua necessidade).\n\n`+
            `Ex: *${prefixo}bcmdglobal* figurinhas - Bloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}bcmdglobal* utilidades - Bloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}bcmdglobal* downloads - Bloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}bcmdglobal* diversão - Bloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Você não pode bloquear comandos de administrador.\n`,
            dcmdglobal:cabecalho+
            `Ex: *${prefixo}dcmdglobal* ${prefixo}s ${prefixo}sgif ${prefixo}play - Desbloqueia  os comandos ${prefixo}s, ${prefixo}sgif e ${prefixo}play.\n\n`+
            `Ex: *${prefixo}dcmdglobal* todos - Desbloqueia todos os comandos.\n\n`+
            `Ex: *${prefixo}dcmdglobal* figurinhas - Desbloqueia todos os comandos da categoria FIGURINHAS.\n\n`+
            `Ex: *${prefixo}dcmdglobal* utilidades - Desbloqueia todos os comandos da categoria UTILIDADES.\n\n`+
            `Ex: *${prefixo}dcmdglobal* downloads - Desbloqueia todos os comandos da categoria DOWNLOADS.\n\n`+
            `Ex: *${prefixo}dcmdglobal* diversão - Desbloqueia todos os comandos da categoria DIVERSÃO.\n\n`+
            `*Obs* : Verifique os comandos que estão bloqueados com ${prefixo}infocompleta.\n`,
            autostickerpv: cabecalho+
            `Ex: *${prefixo}autostickerpv* - Liga/desliga a criação automatica de stickers sem precisar de comandos no privado.\n`,
            nomebot: cabecalho+
            `Ex: *${prefixo}nomebot* Teste123 - Muda o nome do *BOT* para *Teste123* e atualiza os menus com o novo nome.\n`,
            nomeadm: cabecalho+
            `Ex: *${prefixo}nomeadm* Teste123 - Muda o nome do *ADMINISTRADOR* para *Teste123* e atualiza os menus com o novo nome.\n`,
            nomesticker: cabecalho+
            `Ex: *${prefixo}nomesticker* Teste123 - Muda o nome do *PACOTE DE STICKERS* para *Teste123* e atualiza os novos stickers com o novo nome.\n`,
            prefixo: cabecalho+
            `Ex: *${prefixo}prefixo* .  - Muda o prefixo dos *COMANDOS* para *.* e atualiza os menus e comandos com o novo prefixo.\n\n`+
            `Suporta os seguintes prefixos : *!*  *#*  *.*  ***\n`,
            pvliberado: cabecalho+
            `Ex: *${prefixo}pvliberado* - Liga/desliga os comandos em MENSAGENS PRIVADAS.\n`,
            rconfig: cabecalho+
            `Ex: *${prefixo}rconfig* - Reseta a configuração de todos os grupos.\n`,
            sairgrupos: cabecalho+
            `Ex: *${prefixo}sairgrupos* - Sai de todos os grupos.\n`,
            bloquear: cabecalho+
            `Ex: *${prefixo}bloquear* @membro - Para o bot bloquear o membro mencionado.\n\n`+
            `Ex: *${prefixo}bloquear* +55 (xx) xxxxx-xxxx - Para o bot bloquear o número digitado.\n\n`+
            `Ex: Responder alguém com *${prefixo}bloquear* - Para o bot bloquear o membro que você respondeu.\n`,
            desbloquear: cabecalho+
            `Ex: *${prefixo}desbloquear* @membro - Para o bot desbloquear o membro mencionado.\n\n`+
            `Ex: *${prefixo}desbloquear* +55 (xx) xxxxx-xxxx - Para o bot desbloquear o número digitado.\n\n`+
            `Ex: Responder alguém com *${prefixo}desbloquear* - Para o bot desbloquear o membro que você respondeu.\n`,
            usuarios: cabecalho+
            `Ex: *${prefixo}usuarios* comum - Mostra todos os usuários do tipo *COMUM*.\n\n`+
            `*Obs*: Use o *${prefixo}tipos* para ver os tipos disponíveis de usuários.\n`,
            limitediario: cabecalho+
            `Ex: *${prefixo}limitediario* - Ativa/desativa o limite diario de comandos.\n`,
            taxalimite: cabecalho+
            `Ex: *${prefixo}taxalimite* 5 60 - Ativa a taxa limite de comandos para 5 comandos a cada minuto por usuário, caso o usuário ultrapasse ele fica 60 segundos impossibilitado de fazer comandos.\n\n`+
            `*Obs*: Digite *${prefixo}taxalimite* novamente para desativar a taxa limite de comandos.\n`,
            tipos: cabecalho+
            `Ex: *${prefixo}tipos* - Exibe os tipos de usuários disponíveis e quantos comandos estão configurados por dia.\n`,
            limpartipo: cabecalho+
            `Ex: *${prefixo}limpartipo* premium - Transforma todos os usuários do tipo *PREMIUM* em *COMUM*.\n\n`+
            `*Obs*: Use o *${prefixo}tipos* para ver os tipos disponíveis de usuários.\n`,
            mudarlimite: cabecalho+
            `Ex: *${prefixo}mudarlimite* comum 70 - Altera o limite diário de comandos do usuário *COMUM* para 70/dia.\n\n`+
            `*Obs*: O comando de *${prefixo}limitediario* deve estar ativado.\n`+
            `*Obs²*: Verifique os tipos disponíveis de usuários em *${prefixo}tipos*.\n`+
            `*Obs³*: Para ficar sem limite de comandos digite -1 no campo de limite.\n`,
            alterartipo: cabecalho+
            `Ex: *${prefixo}alterartipo* comum @usuario - Altera o tipo do usuário mencionado para *COMUM*.\n\n`+
            `Ex: Responder com *${prefixo}alterartipo* premium - Altera o tipo do usuário respondido para *PREMIUM*.\n\n`+
            `Ex: *${prefixo}alterartipo* vip  55219xxxxxxxx - Altera o tipo do usuário do número para *VIP*.\n\n`+
            `*Obs*: Use o *${prefixo}tipos* para ver os tipos disponíveis de usuários.\n`,
            rtodos: cabecalho+
            `Ex: *${prefixo}rtodos* - Reseta os comandos diários de todos os usuários.\n\n`+
            `*Obs*: O comando de *${prefixo}limitediario* deve estar ativado.\n`,
            r: cabecalho+
            `Ex: *${prefixo}r* @usuario - Reseta os comandos diários de um usuário mencionado.\n\n`+
            `Ex: Responder com *${prefixo}r* - Reseta os comandos diários do usuário respondido.\n\n`+
            `Ex: *${prefixo}r* 55219xxxxxxxx - Reseta os comandos diários do usuário com esse número.\n\n`+
            `*Obs*: O comando de *${prefixo}limitediario* deve estar ativado.\n`,
            verdados:cabecalho+
            `Ex: *${prefixo}verdados* @usuario - Mostra os dados gerais do usuário mencionado.\n\n`+
            `Ex: Responder com *${prefixo}verdados* - Mostra os dados gerais do usuário respondido.\n\n`+
            `Ex: *${prefixo}verdados* 55219xxxxxxxx - Mostra os dados gerais do usuário com esse número.\n`,
            bcgrupos: cabecalho+
            `Ex: *${prefixo}bcgrupos* mensagem - Envia uma mensagem para todos os *GRUPOS*.\n`,
            estado: cabecalho+
            `Ex: *${prefixo}estado* online - Muda o status do bot para ONLINE.\n\n`+
            `Ex: *${prefixo}estado* offline - Muda o status do bot para OFFLINE.\n\n`+
            `Ex: *${prefixo}estado* manutencao - Muda o status do bot para MANUTENCÃO.\n`,
            desligar: cabecalho+
            `Ex: *${prefixo}desligar* - Desliga o BOT.\n`,
            ping: cabecalho+
            `Ex: *${prefixo}ping* - Exibe as informações do sistema do BOT e o tempo de resposta dele.\n`
        }
   
    }
}