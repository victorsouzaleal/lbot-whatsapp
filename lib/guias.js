module.exports = {
    utilidade : {

    },
    grupo:{
        regras: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!regras* - Exibe a descrição/regras do grupo",
        status: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!status* - Exibe as configurações atuais do grupo",
        bv: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!bv on*  - Liga a mensagem de bem-vindo para novos membros\n"+
        "Ex: *!bv off*  - Desliga a mensagem de bem-vindo\n"+
        "*Obs*: Se quiser uma mensagem personalizada de bem-vindo :\n"+
        "Ex: *!bv on Leia as regras*  - Liga a mensagem de bem-vindo com uma mensagem da sua escolha\n",
        aflood: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!aflood on*  - Maxímo de mensagens fica 10 mensagens a cada 10 segundos\n"+
        "Ex: *!aflood off*  - Desliga o antiflood\n"+
        "*Obs*: Se quiser o antiflood para um numero de mensagens especifico :\n"+
        "Ex: *!aflood on 5 15*  - Maxímo de mensagens fica 5 mensagens a cada 15 segundos\n",
        alink: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!alink on* - Liga o antilink e bane quem postar qualquer tipo de link\n"+
        "Ex: *!alink off* - Desliga o antilink\n"+
        "*Obs*: Se quiser customizar para liberar links especificos faça :\n"+
        "Ex: *!alink on twitter facebook youtube whatsapp* - Liga o antilink e bane quem postar link que não seja do Twitter, Facebook, Youtube ou WhatsApp\n",
        afake: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!afake on* - Libera acesso ao grupo só para números brasileiros\n"+
        "Ex: *!afake off* - Desliga e libera acesso ao grupo para qualquer número\n"+
        "*Obs*: Se quiser customizar para numeros de outros países faça :\n"+
        "Ex : *!afake on 55 1 351* - Libera acesso ao grupo só para numeros do Brasil, Estados Unidos e Portugal.",
        mutar: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!mutar on* - Muta o grupo para não executar comandos dos membros\n"+
        "Ex: *!mutar off* - Desmuta o grupo\n",
        add: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!add 5521xxxxxxxxx* - Digite o numero com o código do país para adicionar a pessoa.",
        ban: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!ban @membro* - Para banir um membro marcando ele.\n"+
        "Ex: *!ban @m1 @m2 @m3* - Para banir varios membros por marcação.\n"+
        "Ex: *Responder* alguém com *!ban* - Bane a pessoa que você respondeu.",
        rlink: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!rlink* - Redefine o link do grupo",
        contador: "--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!contador on* - Liga a contagem de mensagens no grupo\n"+
        "Ex: *!contador off* - Desliga a contagem de mensagens\n", 
        atividade:"--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!atividade @membro* - Mostra a atividade do membro mencionado\n"+
        "Ex: *Responder* com *!atividade* - Mostra a atividade do membro que você respondeu\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",
        alterarcont:"--------❔ USO DO COMANDO ❔--------\n"+
        "Ex: *!alterarcont @membro qtd* - Altera a quantidade de mensagens de um membro mencionado.\n"+
        "Ex: *Responder* com *!alterarcont qtd* - Altera a quantidade de mensagens do membro que você respondeu.\n"+
        "*Obs*: Este comando só funciona com o *!contador* ativado\n",  
    },
    diversao:{

    },
    admin:{

    }
}