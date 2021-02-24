const cabecalho = "--------❔ USO DO COMANDO ❔--------\n\n"
module.exports = {
    utilidade : {
        ajuda: cabecalho+
        "Ex: *!ajuda* - Exibe o menu de comandos gerais.\n",
        s: cabecalho+
        "Ex: Envie uma *imagem* com legenda *!s* - Transforma a imagem que você *enviou* em sticker.\n"+
        "Ex: Responda uma *imagem* com *!s* - Transforma a imagem que você *respondeu* em sticker.\n"+
        "*Obs*: Este comando funciona apenas com *IMAGENS*.\n",
        sgif: cabecalho+
        "Ex: Envie um *gif/video* com legenda *!sgif* - Transforma o gif/video que você *enviou* em sticker animado.\n"+
        "Ex: Responda um *gif/video* com *!sgif* - Transforma o gif/video que você *respondeu* em sticker animado.\n"+
        "*Obs*: Este comando funciona apenas com *GIFS/VIDEOS*.\n",
        ssf: cabecalho+
        "Ex: Envie uma *imagem* com legenda *!ssf* - Retira o fundo da imagem que você *enviou* e transforma em sticker.\n"+
        "Ex: Responda uma *imagem* com *!ssf* - Retira o fundo da imagem que você *respondeu* e transforma em sticker.\n"+
        "*Obs*: Este comando funciona apenas com *IMAGENS*.\n",
        tps: cabecalho+
        "Ex: *!tps texto* - Transforma o texto que você digitou em sticker.\n",
        simg: cabecalho+
        "Ex: Responda um *sticker* com *!simg* - Transforma o sticker que você *respondeu* em imagem.\n"+
        "*Obs*: Este comando funciona apenas com *STICKERS*.\n"
    },
    grupo:{
        regras: cabecalho+
        "Ex: *!regras* - Exibe a descrição/regras do grupo",
        status: cabecalho+
        "Ex: *!status* - Exibe as configurações atuais do grupo",
        bv: cabecalho+
        "Ex: *!bv on*  - Liga a mensagem de bem-vindo para novos membros\n"+
        "Ex: *!bv off*  - Desliga a mensagem de bem-vindo\n"+
        "*Obs*: Se quiser uma mensagem personalizada de bem-vindo :\n"+
        "Ex: *!bv on Leia as regras*  - Liga a mensagem de bem-vindo com uma mensagem da sua escolha\n",
        aflood: cabecalho+
        "Ex: *!aflood on*  - Maxímo de mensagens fica 10 mensagens a cada 10 segundos\n"+
        "Ex: *!aflood off*  - Desliga o antiflood\n"+
        "*Obs*: Se quiser o antiflood para um numero de mensagens especifico :\n"+
        "Ex: *!aflood on 5 15*  - Maxímo de mensagens fica 5 mensagens a cada 15 segundos\n",
        alink: cabecalho+
        "Ex: *!alink on* - Liga o antilink e bane quem postar qualquer tipo de link\n"+
        "Ex: *!alink off* - Desliga o antilink\n"+
        "*Obs*: Se quiser customizar para liberar links especificos faça :\n"+
        "Ex: *!alink on twitter facebook youtube whatsapp* - Liga o antilink e bane quem postar link que não seja do Twitter, Facebook, Youtube ou WhatsApp\n",
        afake: cabecalho+
        "Ex: *!afake on* - Libera acesso ao grupo só para números brasileiros\n"+
        "Ex: *!afake off* - Desliga e libera acesso ao grupo para qualquer número\n"+
        "*Obs*: Se quiser customizar para numeros de outros países faça :\n"+
        "Ex : *!afake on 55 1 351* - Libera acesso ao grupo só para numeros do Brasil, Estados Unidos e Portugal.",
        mutar: cabecalho+
        "Ex: *!mutar on* - Muta o grupo para não executar comandos dos membros\n"+
        "Ex: *!mutar off* - Desmuta o grupo\n",
        add: cabecalho+
        "Ex: *!add 5521xxxxxxxxx* - Digite o numero com o código do país para adicionar a pessoa.",
        ban: cabecalho+
        "Ex: *!ban @membro* - Para banir um membro marcando ele.\n"+
        "Ex: *!ban @m1 @m2 @m3* - Para banir varios membros por marcação.\n"+
        "Ex: *Responder* alguém com *!ban* - Bane a pessoa que você respondeu.",
        rlink: cabecalho+
        "Ex: *!rlink* - Redefine o link do grupo",
        contador: cabecalho+
        "Ex: *!contador on* - Liga a contagem de mensagens no grupo\n"+
        "Ex: *!contador off* - Desliga a contagem de mensagens\n", 
        atividade:cabecalho+
        "Ex: *!atividade @membro* - Mostra a atividade do membro mencionado\n"+
        "Ex: *Responder* com *!atividade* - Mostra a atividade do membro que você respondeu\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",
        alterarcont:cabecalho+
        "Ex: *!alterarcont @membro 50* - Altera a quantidade de mensagens de um membro mencionado para 50 mensagens.\n"+
        "Ex: *Responder* com *!alterarcont 20* - Altera a quantidade de mensagens do membro que você respondeu para 20 mensagens.\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",
        imarcar:cabecalho+
        "Ex: *!imarcar 5* - Marca todos os membros com menos de 5 mensagens.\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",
        ibanir:cabecalho+
        "Ex: *!ibanir 10* - Bane todos os membros com menos de 10 mensagens.\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",
        topativos:cabecalho+
        "Ex: *!topativos 10* - Marca os 10 membros com mais mensagens do grupo.\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",
        enquete:cabecalho+
        "Ex: *!enquete tema,opcao1,opcao2,opcao3* - Cria uma enquete com um tema e as opções de voto.\n"+
        "Ex: *!enquete off* - Encerra uma enquete e exibe os resultados finais dela.\n",   
        votarenquete:cabecalho+
        "Ex: *!votarenquete 1* - Vota na opção 1 da enquete.\n"+
        "*Obs*: Este comando só funciona uma enquete em aberto.\n",
        verenquete: cabecalho+
        "Ex: *!verenquete* - Mostra se há alguma enquete em aberto.\n",
        votacao: cabecalho+
        "Ex: *!votacao* - Mostra se há alguma votação de ban em aberto.\n",
        votar: cabecalho+
        "Ex: *!votar* - Vota no membro que está em votação.\n",
        vb: cabecalho+
        "Ex: *!vb on @membro 10* - Abre uma votação de ban em um membro com limite de 10 votos\n"+
        "Ex: *!vb off* - Encerra a votação\n",
        bcmd: cabecalho+
        "Ex: *!bcmd !s !sgif !play* - Bloqueia no grupo os comandos !s, !sgif e !play (você pode escolher os comandos a sua necessidade)\n"+
        "*Obs* : Você não pode bloquear comandos de administrador.\n",
        dcmd: cabecalho+
        "Ex: *!dcmd !s !sgif !play* - Desbloqueia no grupo os comandos !s, !sgif e !play\n"+
        "*Obs* : Verifique os comandos que estão bloqueados com !status.\n",
        link: cabecalho+
        "Ex: *!link* - Exibe o link do grupo\n",
        adms:  cabecalho+
        "Ex: *!adms* - Exibe e marca os administradores do grupo\n",
        dono:  cabecalho+
        "Ex: *!dono* - Exibe e marca o dono do grupo\n",
        mt: cabecalho+
        "Ex: *!mt* - Marca todos os membros do grupo.\n"+
        "*Obs* : Se quiser colocar uma mensagem personalizada faça :\n"+
        "Ex: *!mt mensagem* - Marca todos os membros do grupo com uma mensagem personalizada.",
        bantodos: cabecalho+
        "Ex: *!bantodos* - Bane todos os membros do grupo.\n"+
        "*Obs* : Apenas o dono do grupo pode usar este comando.",
        promover: cabecalho+
        "Ex: *!promover @membro* - Promove o membro mencionado a administrador.\n",
        rebaixar: cabecalho+
        "Ex: *!rebaixar @admin* - Rebaixa o administrador mencionado a membro.\n",
        apg: cabecalho+
        "Ex: *Responder* com *!apg* - Apaga a mensagem do bot que foi respondida com esse comando.\n"+
        "*Obs* : Só é possivel apagar as mensagens do bot\n",
        f: cabecalho+
        "Ex: *f on* - Fecha o grupo apenas para administradores.\n"+
        "Ex: *f off* - Abre o grupo para todos.\n",
    },
    diversao:{
        detector:cabecalho+
        "Ex: *Responder* com *!detector* - Exibe o resultado da máquina da verdade\n",
        viadometro:cabecalho+
        "Ex: *!viadometro @membro* - Mede o nível de viadagem do membro mencionado\n"+
        "Ex: *Responder* com *!viadometro* - Mede o nível de viadagem do membro respondido\n",
        bafometro: cabecalho+
        "Ex: *!bafometro @membro* - Mede o nível de alcool do membro mencionado\n"+
        "Ex: *Responder* com *!bafometro* - Mede o nível de alcool do membro respondido\n",
        caracoroa: cabecalho+
        "Ex: *!caracoroa* - Decisão no cara ou coroa, exibe o lado da moeda que cair.\n",
        ppt: cabecalho+
        "Ex: *!ppt pedra* - Escolhe pedra, para jogar pedra, papel ou tesoura.\n"+
        "Ex: *!ppt papel* - Escolhe papel, para jogar pedra, papel ou tesoura.\n"+
        "Ex: *!ppt tesoura* - Escolhe tesoura, para jogar pedra, papel ou tesoura.\n",
        top5:cabecalho+
        "Ex: *!top5 tema* - Exibe uma ranking de 5 membros aleatórios com o tema que você escolher\n",
        mascote:cabecalho+
        "Ex: *!mascote* - Exibe o mascote do BOT.\n",
        roletarussa: cabecalho+
        "Ex: *!roletarussa* - Bane um membro aleatório do grupo.\n"+
        "*Obs*: Comando apenas para administradores, pode banir qualquer um exceto o dono do grupo e o BOT.\n",
        casal: cabecalho+
        "Ex: *!casal* - Escolhe 2 pessoas aleatórias do grupo para formar um casal.\n",
        par: cabecalho+
        "Ex: *!par @membro1 @membro2* - Mede o nível de compatibilidade dos 2 membros mencionados.\n",
        fch: cabecalho+
        "Ex: *!fch* - Exibe uma frase aleatória montada com as cartas do jogo Cartas contra a Humanidade.\n",
    },
    admin:{
        admin: cabecalho+
        "Ex: *!admin* - Exibe o menu de administração do Bot\n",
        infocompleta: cabecalho+
        "Ex: *!infocompleta* - Exibe as informações completas do bot, inclusive as configurações atuais.\n",
        entrargrupo:cabecalho+
        "Ex: *!entrargrupo link* - Entra em um grupo por link de convite.\n",
        sair:cabecalho+
        "Ex: *!sair* - Faz o bot sair do grupo\n",
        listablock:cabecalho+
        "Ex: *!listablock* - Exibe a lista de usuários bloqueados pelo bot\n",
        limpartudo:cabecalho+
        "Ex: *!limpartudo* - Limpa todos os chats (Grupos e Contatos)\n",
        bcmdglobal:cabecalho+
        "Ex: *!bcmdglobal !s !sgif !play* - Bloqueia para TODOS os comandos !s, !sgif e !play (você pode escolher os comandos a sua necessidade)\n"+
        "*Obs* : Você não pode bloquear comandos de administrador.\n",
        dcmdglobal:cabecalho+
        "Ex: *!dcmdglobal !s !sgif !play* - Desbloqueia para TODOS os comandos !s, !sgif e !play\n"+
        "*Obs* : Verifique os comandos que estão bloqueados com !infocompleta.\n",
        limpar: cabecalho+
        "Ex: *!limpar* - Limpa todos os chats de contatos\n",
        rconfig: cabecalho+
        "Ex: *!rconfig* - Reseta a configuração de todos os grupos\n",
        sairgrupos: cabecalho+
        "Ex: *!sairgrupos* - Sai de todos os grupos\n",
        bloquear: cabecalho+
        "Ex: *!bloquear @membro* - Para o bot bloquear o membro mencionado.\n"+
        "Ex: *Responder* alguém com *!bloquear* - Para o bot bloquear o membro que você respondeu.",
        desbloquear: cabecalho+
        "Ex: *!desbloquear @membro* - Para o bot desbloquear o membro mencionado.\n"+
        "Ex: *Responder* alguém com *!desbloquear* - Para o bot desbloquear o membro que você respondeu.",
        limitediario: cabecalho+
        "Ex: *!limitediario off* - Desativa o limite diario de comandos.\n"+
        "Ex: *!limitediario on 30* - Ativa o limite diario de 30 comandos por dia por usuário\n",
        taxalimite: cabecalho+
        "Ex: *!taxalimite on 5 60* - Ativa a taxa limite de comandos para 5 comandos a cada minuto por usuário, caso o usuário ultrapasse ele fica 60 segundos impossibilitado de fazer comandos. \n"+
        "Ex: *!taxalimite off* - Desativa a taxa limite de comandos por usuário.\n",
        limitarmsgs: cabecalho+
        "Ex: *!limitarmsgs on 10 10* - Ativa o limite de mensagens privadas em 10 mensagens a cada 10 segundos, se o usuário ultrapassar ele será bloqueado. \n"+
        "Ex: *!limitarmsgs off* - Desativa o limite de mensagens privadas.\n",
        mudarlimite: cabecalho+
        "Ex: *!mudarlimite 50* - Altera o limite diário de comandos para 50/dia.\n"+
        "*Obs*: O comando de *!limitediario* deve estar ativado.\n",
        tipo: cabecalho+
        "Ex: *!tipo comum|vip @usuario* - Altera o tipo do usuário mencionado para COMUM ou VIP.\n"+
        "Ex: *Responder* com *!tipo comum|vip* - Altera o tipo do usuário respondido para COMUM ou VIP.\n"+
        "Ex: *!tipo comum|vip 55219xxxxxxxx* - Altera o tipo do usuário do número para COMUM ou VIP.\n",
        limparvip: cabecalho+
        "Ex: *!limparvip* - Remove todos os usuários VIP e torna eles COMUM\n",
        env: cabecalho +
        "Ex: *!env removebg [chave]* - Edita chave do RemoveBG\n"+
        "Ex: *!env newsorg [chave]* - Edita chave do NewsORG\n"+
        "Ex: *!env rapidapi [chave]* - Edita chave do RapidAPI\n"+
        "Ex: *!env twitter [twitter_consumer_key] [twitter_consumer_secret] [twitter_access_token] [twitter_access_token_secret]* - Edita as chaves do Twitter\n"+
        "*Obs*: O BOT deve ser reiniciado para aplicar as alterações.\n",
        vervips: cabecalho+
        "Ex: *!vervips* - Exibe os usuários que estão como VIP\n",
        rtodos: cabecalho+
        "Ex: *!rtodos* - Reseta os comandos diários de todos os usuários\n"+
        "*Obs*: O comando de *!limitediario* deve estar ativado.\n",
        r: cabecalho+
        "Ex: *!r @usuario* - Reseta os comandos diários de um usuário mencionado.\n"+
        "Ex: *Responder* com *!r* - Reseta os comandos diários do usuário respondido.\n"+
        "Ex: *!r 55219xxxxxxxx* - Reseta os comandos diários do usuário com esse número.\n"+
        "*Obs*: O comando de *!limitediario* deve estar ativado.\n",
        verdados:cabecalho+
        "Ex: *!verdados @usuario* - Mostra os dados gerais do usuário mencionado.\n"+
        "Ex: *Responder* com *!verdados* - Mostra os dados gerais do usuário respondido.\n"+
        "Ex: *!verdados 55219xxxxxxxx* - Mostra os dados gerais do usuário com esse número.\n",
        bc: cabecalho+
        "Ex: *!bc mensagem* - Envia uma mensagem para todos os chats (Grupos e Contatos)\n",
        bcgrupos: cabecalho+
        "Ex: *!bcgrupos mensagem* - Envia uma mensagem para todos os grupos\n",
        print: cabecalho+
        "Ex: *!print* - Tira uma print do WhatsApp Web do BOT e envia.\n",
        estado: cabecalho+
        "Ex: *!estado online* - Muda o status do bot para ONLINE\n"+
        "Ex: *!estado offline* - Muda o status do bot para OFFLINE\n"+
        "Ex: *!estado manutencao* - Muda o status do bot para MANUTENCÃO\n",
        desligar: cabecalho+
        "Ex: *!desligar* - Desliga o BOT.\n",
    },

}