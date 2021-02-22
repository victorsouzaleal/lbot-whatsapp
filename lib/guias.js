const cabecalho = "--------❔ USO DO COMANDO ❔--------\n"
module.exports = {
    utilidade : {

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

    },
    admin:{
        
    }
}