import * as groupFunctions from './group.functions.commands.js'

const groupCommands = {
    grupo: {
        guide: `Ex: *{$p}grupo* - Exibe os dados atuais do grupo.\n`,
        msgs: {
            reply_title: "👥 *Dados gerais do grupo* \n\n"+
            "*Nome*: {$1}\n"+
            "*Participantes*: {$2}\n"+
            "*Admins*: {$3} \n"+
            "*Descrição/Regras*: {$4}\n\n"+
            "*Comandos executados*: {$5} \n\n",
            reply_resource_title: '🧰 *RECURSOS DO GRUPO* \n\n',
            reply_item_welcome_on: "*Boas vindas*: ✅\n",
            reply_item_welcome_off: "*Boas vindas*: ❌\n",
            reply_item_mute_on: "*Mutar*: ✅\n",
            reply_item_mute_off: "*Mutar*: ❌\n",
            reply_item_autosticker_on: "*Auto-Sticker*: ✅\n",
            reply_item_autosticker_off: "*Auto-Sticker*: ❌\n",
            reply_item_antilink_on: "*Anti-Link*: ✅\n"+
            "- *Exceções*: {$1}\n",
            reply_item_antilink_off: "*Anti-Link*: ❌\n",
            reply_item_antifake_on: "*Anti-Fake*: ✅\n"+
            "- *Prefixos liberados*: {$1}\n",
            reply_item_antifake_off: "*Anti-Fake*: ❌\n",
            reply_item_antiflood_on: "*Anti-Flood*: ✅\n"+
            "- Máx: *{$1}* msgs / *{$2}* s \n",
            reply_item_antiflood_off: "*Anti-Flood*: ❌\n",
            reply_item_counter_on: "*Contador*: ✅\n"+
            "- {$1}\n",
            reply_item_counter_off: "*Contador*: ❌\n",
            reply_item_blockcmds_on: "*Bloqueio de comandos*: ✅\n"+
            "- *{$1}*\n",
            reply_item_blockcmds_off: "*Bloqueio de comandos*: ❌\n",
            reply_item_filter_on: "*Filtro de palavras*: ✅\n"+
            "- *{$1}*\n",
            reply_item_filter_off: "*Filtro de palavras*: ❌\n",
            reply_item_blacklist: "*Lista Negra*: *{$1}*\n"
        },
        function: groupFunctions.grupoCommand
    },
    fotogrupo: {
        guide: `Ex: Envie/responda uma *imagem* com *{$p}fotogrupo* - Altera a foto do grupo.\n\n`,
        msgs: {
            reply: "✅ A foto do GRUPO foi alterada com sucesso.",
        },
        function: groupFunctions.fotogrupoCommand
    },
    aviso:{
        guide: `Ex: Responda alguém com *{$p}aviso* - Adiciona um aviso ao membro respondido.\n`+
        `Ex: Marque alguém com *{$p}aviso* - Adiciona um aviso ao membro marcado.\n\n`+
        `*Obs*: Se o membro chegar a 3 avisos ele é adicionado automaticamente a lista negra do grupo.\n`,
        msgs: {
            reply: '‼️ Aviso\n\n'+
            "@{$1}, você recebeu um aviso do administrador, se chegar a 3 avisos será adicionado a lista negra do grupo.\n\n"+
            'Atualmente você tem {$2} avisos.',
            reply_max_warning: '‼️ Aviso\n\n'+
            '@{$1}, você recebeu o 3° aviso e será adicionado a lista negra do grupo.',
            error_not_registered: 'Membro do grupo ainda não foi registrado pelo bot.',
            error_warning_bot: 'Não é possível dar um aviso ao bot.',
            error_warning_admin: 'Não é possível dar um aviso a um administrador do grupo.'
        },
        function: groupFunctions.avisoCommand
    },
    rmaviso:{
        guide: `Ex: Responda alguém com *{$p}rmaviso* - Remove um aviso do membro respondido.\n`+
        `Ex: Marque alguém com *{$p}rmaviso* - Remove um aviso do membro marcado.\n\n`,
        msgs: {
            reply: '‼️ Aviso removido\n\n'+
            "@{$1}, você teve um aviso removido pelo administrador.\n\n"+
            'Atualmente você tem {$2} avisos.',
            error_no_warning: 'Esse membro não tem nenhum aviso para ser removido',
            error_not_registered: 'Membro do grupo ainda não foi registrado pelo bot.',
        },
        function: groupFunctions.rmavisoCommand
    },
    zeraravisos:{
        guide: `Ex: *{$p}zeraravisos* - Remove todos os avisos dos membros do grupo.\n`,
        msgs: {
            reply: '‼️ Zerar avisos\n\n'+
            "Todos os avisos dos membros foram zerados.",
        },
        function: groupFunctions.zeraravisosCommand
    },
    addfiltros: {
        guide: `Ex: *{$p}addfiltros* batata uva - Adiciona as palavras *batata* e *uva* no filtro de palavras.\n\n`+
        '*Obs*: Se algum membro enviar uma mensagem contendo uma palavra do filtro, a mensagem dele será deletada automaticamente.',
        msgs: {
            reply_title: '🚫 Filtro de palavras\n\n',
            reply_item_success: 'A palavra *{$1}* foi adicionada ao filtro.\n',
            reply_item_error: 'A palavra *{$1}* já existe no filtro.\n',
        },
        function: groupFunctions.addfiltrosCommand
    },
    rmfiltros: {
        guide: `Ex: *{$p}rmfiltros* batata uva - Remove as palavras *batata* e *uva* do filtro de palavras.`,
        msgs: {
            reply_title: '🚫 Filtro de palavras\n\n',
            reply_item_success: 'A palavra *{$1}* foi removida do filtro.\n',
            reply_item_error: 'A palavra *{$1}* não existe no filtro.\n',
        },
        function: groupFunctions.rmfiltrosCommand
    },
    addlista: {
        guide: `Ex: Responda alguém com *{$p}addlista* - Adiciona o numero de quem foi respondido a lista negra e bane em seguida.\n\n`+
        `Ex: Marque alguém com *{$p}addlista* - Adiciona o numero de quem foi marcado a lista negra e bane em seguida.\n\n`+
        `Ex: *{$p}addlista* +55219xxxx-xxxx - Adiciona o número digitado a lista negra do grupo e bane em seguida.\n.`,
        msgs: {
            reply: "✅ O número desse usuário foi adicionado á lista negra e será banido do grupo caso ainda esteja aqui.",
            error_add_bot: "O *bot* não pode ser adicionado a lista negra.",
            error_add_admin: "O *administrador do grupo* não pode ser adicionado a lista negra.",
            error_already_listed: "Este usuário já está na lista negra.",
        },
        function: groupFunctions.addlistaCommand
    },
    rmlista: {
        guide: `Ex: Digite *{$p}rmlista 1* - Remove o usuário selecionado da lista negra.\n\n`+
        `*Obs*: Para ver o ID dos usuários é necessário checar no comando *{$p}listanegra*\n\n`+
        `Você também pode remover da lista negra da seguinte forma: \n\n`+
        `Ex: *{$p}rmlista* +55219xxxx-xxxx - Remove o número digitado da lista negra do grupo.\n`,
        msgs: {
            reply: "✅ O número desse usuário foi removido da lista negra.",
            error_not_listed: "Este usuário não está na lista negra.",
        },
        function: groupFunctions.rmlistaCommand
    },
    listanegra: {
        guide: `Ex: *{$p}listanegra* - Exibe a lista negra do grupo.\n`,
        msgs: {
            error_empty_list: "Não existem usuários na lista negra deste grupo.",
            reply_title: "❌ *Lista negra*\n\n"+
            "*Usuários na lista negra*: {$1}\n\n",
            reply_item: '- *ID*: {$1}\n'+
            '- *Nome*: {$2}\n'+
            '- *Contato*: +{$3}\n\n'
        },
        function: groupFunctions.listanegraCommand
    },
    add: {
        guide: `Ex: *{$p}add* +55219xxxx-xxxx - Digite o numero com o código do país para adicionar a pessoa.\n\n`+
        `Ex: *{$p}add* +55219xxxx-xxxx, +55119xxxx-xxxx - Digite os numeros com o código do país (adiciona mais de uma pessoa no grupo).\n`,
        msgs: {
            reply: '✅ O número +{$1} foi adicionado ao grupo com sucesso.',
            error_add: "O número +{$1} não pode ser adicionado. Provavelmente está com privacidade ativada, já está no grupo ou o grupo não aceita mais membros.",
            error_input: "Foi encontrado texto no número inserido, digite corretamente o número de quem você deseja adicionar ao grupo.",
            error_invalid_number: "Houve um erro em adicionar o número +{$1}, verifique se o número existe ou tente tirar o 9.",
        },
        function: groupFunctions.addCommand
    },
    ban: {
        guide: `Ex: *{$p}ban* @membro - Para banir um membro marcando ele.\n\n`+
        `Ex: Responder alguém com *{$p}ban* - Bane o membro que você respondeu.\n`,
        msgs: {
            reply_title: '🚷 *Banimento de membros*\n\n',
            reply_item_success: "+{$1} foi banido do grupo com sucesso.\n",
            reply_item_ban_admin: "+{$1} não pode ser banido, o bot não pode banir um administrador.\n",
            reply_item_not_found: "+{$1} não pode ser banido, provavelmente ele já saiu do grupo.\n",
        },
        function: groupFunctions.banCommand
    },
    promover: {
        guide: `Ex: *{$p}promover* @membro - Promove o membro mencionado a *administrador*.\n\n`+
        `Ex: Responder com *{$p}promover* - Promove o usuário respondido a *administrador*.\n`,
        msgs: {
            error: "O bot não pode ser promovido por ele mesmo.",
            reply_title: "⬆️ *Promover membros*\n\n",
            reply_item_success: "@{$1} foi promovido para *ADMINISTRADOR*.\n",
            reply_item_error: "@{$1} já é um *ADMINISTRADOR*.\n",
        },
        function: groupFunctions.promoverCommand
    },
    rebaixar: {
        guide: `Ex: *{$p}rebaixar* @admin - Rebaixa o administrador mencionado a *membro*.\n\n`+
        `Ex: Responder com *{$p}rebaixar* - Rebaixa o administrador respondido a *membro*.\n`,
        msgs: {
            error: "O bot não pode ser rebaixado por ele mesmo.",
            reply_title: "⬇️ *Rebaixar membros*\n\n",
            reply_item_success: "@{$1} foi rebaixado para *MEMBRO*.\n",
            reply_item_error_is_member: "@{$1} já é um *MEMBRO*.\n",
            reply_item_error: "@{$1} não pode ser rebaixado.\n"
        },
        function: groupFunctions.rebaixarCommand
    },
    mt: {
        guide: `Ex: *{$p}mt* - Marca todos os *membros/admin* do grupo.\n\n`+
        `Ex: *{$p}mt* mensagem - Marca todos os *membros/admin* do grupo com uma mensagem.\n`,
        msgs: {
            reply: "❕ Marquei todos os {$1} *membros/admins*.",
            reply_with_message: "❕ Marquei todos os {$1} *membros/admins*.\n\n"+
            "*Mensagem*: {$2}\n"
        },
        function: groupFunctions.mtCommand
    },
    mm: {
        guide: `Ex: *{$p}mm* - Marca todos os *MEMBROS* do grupo.\n\n`+
        `Ex: *{$p}mm* mensagem - Marca todos os *MEMBROS* do grupo com uma mensagem.\n`,
        msgs: {
            reply: "❕ Marquei todos os {$1} *membros*.",
            reply_with_message: "❕ Marquei os {$1} *membros*.\n\n"+
            "*Mensagem*: {$2}\n",
            error_no_members: "Não existem membros comuns para serem marcados.",
        },
        function: groupFunctions.mmCommand
    },
    adms: {
        guide: `Ex: Responder com *{$p}adms* - Marca todos os *ADMINISTRADORES* em uma postagem.\n\n`+
        `Ex: *{$p}adms* - Marca os *ADMINISTRADORES* do grupo.\n`,
        msgs: {
            reply: "🤖❕ Marquei todos os *{$1}* admins.",
            reply_with_message: "❕ Marquei todos os {$1} *admins*.\n\n"+
            "*Mensagem*: {$2}\n",
        },
        function: groupFunctions.admsCommand
    },
    dono: {
        guide: `Ex: *{$p}dono* - Exibe quem é dono do grupo.\n`,
        msgs: {
            reply: "🤖 O dono do grupo é: +{$1}",
            error: "Não foi possível exibir o dono do grupo, o dono teve o número banido ou cancelado."
        },
        function: groupFunctions.donoCommand
    },
    mutar: {
        guide: `Ex: *{$p}mutar* - Liga/desliga a execução de comandos dos membros.\n`,
        msgs: {
            reply_on: "✅ O recurso de *MUTAR GRUPO* foi ativado com sucesso",
            reply_off: "✅ O recurso de *MUTAR GRUPO* foi desativado com sucesso"
        },
        function: groupFunctions.mutarCommand
    },
    link: {
        guide: `Ex: *{$p}link* - Exibe o link do grupo.\n`,
        msgs: {
            reply: "👥 *Link do grupo*\n\n"+
            "*Nome do grupo*: {$1}\n"+
            "*Link do grupo*: {$2}"
        },
        function: groupFunctions.linkCommand
    },
    rlink: {
        guide: `Ex: *{$p}rlink* - Redefine o link do grupo.\n`,
        msgs: {
            error: "Houve um erro na redefinição de link",
            reply: "✅ Link do grupo foi redefinido com sucesso."
        },
        function: groupFunctions.rlinkCommand
    },
    restrito: {
        guide: `Ex: *{$p}restrito* - Abre/fecha o grupo apenas para administradores conversarem.\n`,
        msgs: {
            reply_on: "✅ O grupo foi restrito apenas para *ADMINISTRADORES* poderem conversar.",
            reply_off: '✅ O grupo foi liberado para todos os *MEMBROS* poderem conversar.'
        },
        function: groupFunctions.restritoCommand
    },
    antilink: {
        guide: `Ex: *{$p}antilink* - Liga/desliga o Anti-LINK no grupo e apaga a mensagem de quem postar qualquer tipo de link.\n\n`+
        `Ex: *{$p}antilink* google.com youtube.com - Liga/desliga o Anti-LINK no grupo e permite os links inseridos como exceção.`,
        msgs: {
            reply_on: "✅ O recurso de *ANTI-LINK* foi ativado com sucesso.",
            reply_off: "✅ O recurso de *ANTI-LINK* foi desativado com sucesso."
        },
        function: groupFunctions.antilinkCommand
    },
    autosticker: {
        guide: `Ex: *{$p}autosticker* - Liga/desliga a criação automatica de stickers sem precisar de comandos.\n`,
        msgs: {
            reply_on: "✅ O recurso de *AUTO-STICKER* foi ativado com sucesso.",
            reply_off: "✅ O recurso de *AUTO-STICKER* foi desativado com sucesso."
        },
        function: groupFunctions.autostickerCommand
    },
    bemvindo: {
        guide: `Ex: *{$p}bemvindo*  - Liga/desliga a mensagem de bem-vindo para novos membros.\n\n`+
        `Ex: *{$p}bemvindo* mensagem - Liga a mensagem de bem-vindo com uma mensagem da sua escolha.\n`,
        msgs: {
            reply_on: "✅ O recurso de *BOAS VINDAS* foi ativado com sucesso.",
            reply_off: "✅ O recurso de *BOAS VINDAS* foi desativado com sucesso.",
        },
        function: groupFunctions.bemvindoCommand
    },
    antifake: {
        guide: `Ex: *{$p}antifake* - Liga/desliga o Anti-FAKE no grupo.\n`+
        `Ex: *{$p}antifake* DDI - Configura o anti-fake para que todos números com o DDI exterior seja banido, exceto o que você escolheu.\n`+
        `Ex: *{$p}antifake* DDI1 DDI2 DDI3 - Configura o anti-fake para que todos números com DDI exterior sejam banidos, excetos o que você escolheu.\n\n`+
        `*Obs*: A ativação do anti-fake bane pessoas com DDI do exterior (que não sejam 55 - Brasil).\n`,
        msgs: {
            reply_on: "✅ O recurso de *ANTI-FAKE* foi ativado com sucesso.",
            reply_off: "✅ O recurso de *ANTI-FAKE* foi desativado com sucesso."
        },
        function: groupFunctions.antifakeCommand
    },
    antiflood: {
        guide: `Ex: *{$p}antiflood*  - Liga/desliga o Anti-FLOOD no grupo.\n\n`+
        `Ex: *{$p}antiflood* 5 15  - Maxímo de mensagens fica 5 mensagens a cada 15 segundos.\n`,
        msgs: {
            error_value_message: "O valor de mensagem é inválido, escolha um valor entre 5-20 mensagens para o Anti-FLOOD.",
            error_value_interval: "O valor do intervalo é inválido, escolha um valor entre 10-60 segundos para o intervalo do Anti-FLOOD.",
            reply_on: "✅ O recurso de *ANTI-FLOOD* foi ativado para *{$1}* mensagens a cada *{$2}* segundos.",
            reply_off: "✅ O recurso de *ANTI-FLOOD* foi desativado com sucesso."
        },
        function: groupFunctions.antifloodCommand
    },
    apg: {
        guide: `Ex: Responder com *{$p}apg* - Apaga a mensagem que foi respondida com esse comando.\n\n`+
        `*Obs*: O bot precisa ser administrador.\n`,
        function: groupFunctions.apgCommand
    },
    topativos: {
        guide: `Ex: *{$p}topativos* - Marca os 10 membros com mais mensagens do grupo.\n`+
        `Ex: *{$p}topativos* 15 - Marca os 15 membros com mais mensagens do grupo.\n`,
        msgs: {
            error_value_invalid: "A quantidade de pessoas não é um número válido.",
            error_value_limit: "A quantidade de pessoas deve ser entre 1 e 50",
            reply_title: "🏆 *Top {$1} - Membros ativos*\n\n",
            reply_item: "{$1} *{$2}° Lugar* @{$3} - {$4} msgs\n"
        },
        function: groupFunctions.topativosCommand
    },
    membro: {
        guide: `Ex: *{$p}membro* @membro - Mostra os dados do membro mencionado.\n\n`+
        `Ex: Responder com *{$p}membro* - Mostra os dados do membro que você respondeu.\n`,
        msgs: {
            error_not_member: "Não é possível obter a atividade de quem não está no grupo.",
            reply: "📖 *Dados do membro*:\n\n"+
            "👤 *Nome*: {$1}\n"+
            "📲 *Número*: +{$2}\n"+
            "‼️ *Avisos*: {$3}\n"+
            "📆 *Registrado pelo bot em*: \n- {$4}\n\n"+
            "📊 *Atividade*:\n"+
            "- 🤖 *Comandos usados*: {$5}\n"+
            "- ✉️ *Mensagens*: {$6}\n"+
            "- 🔤 *Textos*: {$7}\n"+
            "- 📸 *Imagens*: {$8}\n"+
            "- 🎥 *Videos*: {$9}\n"+
            "- 🖼️ *Figurinhas*: {$10}\n"+
            "- 🎧 *Aúdios*: {$11}\n"+
            "- 🧩 *Outros*: {$12}\n"
        },
        function: groupFunctions.membroCommand
    },
    inativos: {
        guide: `Ex: *{$p}inativos* 5 - Marca todos os membros com menos de 5 mensagens.\n`,
        msgs: {
            error_value_invalid: "A quantidade mínima de mensagens não é um número válido.",
            error_value_limit: "A quantidade mínima de mensagens deve ser maior ou igual a 1.",
            error_no_inactives: "Não existem membros inativos neste grupo.",
            reply_title: "💤 *Membros inativos*:\n\n"+
            "👤 *Quantidade de inativos*: {$1}\n"+
            'Marcando todos que tem menos de *{$2}* mensagens:\n\n',
            reply_item: "@{$1} - {$2} msgs\n"
        },
        function: groupFunctions.inativosCommand
    },
    bcmd: {
        guide: `Ex: *{$p}bcmd* {$p}s {$p}sgif {$p}play - Bloqueia no grupo os comandos {$p}s, {$p}sgif e {$p}play (você pode escolher os comandos a sua necessidade).\n\n`+
        `Ex: *{$p}bcmd* sticker - Bloqueia todos os comandos da categoria STICKER.\n\n`+
        `Ex: *{$p}bcmd* utilidade - Bloqueia todos os comandos da categoria UTILIDADE.\n\n`+
        `Ex: *{$p}bcmd* download - Bloqueia todos os comandos da categoria DOWNLOAD.\n\n`+
        `Ex: *{$p}bcmd* variado - Bloqueia todos os comandos da categoria VARIADO.\n\n`+
        `*Obs*: Você não pode bloquear comandos de administrador.\n`,
        msgs: {
            reply_title: "🔒 *Bloquear comandos - Grupo*\n\n",
            reply_item_already_blocked: "Comando *{$1}* já está bloqueado.\n",
            reply_item_blocked: "Comando *{$1}* bloqueado com sucesso.\n",
            reply_item_error: "Comando *{$1}* não pode ser bloqueado.\n",
            reply_item_not_exist: "Comando *{$1}* não existe.\n",
        },
        function: groupFunctions.bcmdCommand
    },
    dcmd: {
        guide: `Ex: *{$p}dcmd* {$p}s {$p}sgif {$p}play - Desbloqueia no grupo os comandos {$p}s, {$p}sgif e {$p}play.\n\n`+
        `Ex: *{$p}dcmd* todos - Desbloqueia todos os comandos.\n\n`+
        `Ex: *{$p}dcmd* sticker - Desbloqueia todos os comandos da categoria STICKER.\n\n`+
        `Ex: *{$p}dcmd* utilidade - Desbloqueia todos os comandos da categoria UTILIDADE.\n\n`+
        `Ex: *{$p}dcmd* download - Desbloqueia todos os comandos da categoria DOWNLOAD.\n\n`+
        `Ex: *{$p}dcmd* variado - Desbloqueia todos os comandos da categoria VARIADO.\n\n`+
        `*Obs*: Verifique os comandos que estão bloqueados com *{$p}status*.\n`,
        msgs: {
            reply_title: "🔓 *Desbloquear comandos - Grupo*\n\n",
            reply_item_unblocked: "Comando *{$1}* foi desbloqueado.\n",
            reply_item_not_blocked: "Comando *{$1}* já esta desbloqueado ou nunca foi bloqueado.\n"
        },
        function: groupFunctions.dcmdCommand
    }
}

export default groupCommands