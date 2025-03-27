import { Bot } from "../interfaces/bot.interface.js"

export default function getBotTexts (botInfo? : Bot){
    let prefix = botInfo?.prefix
    return {
        starting: "  _____     ______      ___    _________  \r\n |_   _|   |_   _ \\   .\'   `. |  _   _  | \r\n   | |       | |_) | \/  .-.  \\|_\/ | | \\_| \r\n   | |   _   |  __\'. | |   | |    | |     \r\n  _| |__\/ | _| |__) |\\  `-\'  \/   _| |_    \r\n |________||_______\/  `.___.\'   |_____|   \r\n" + "\n  Iniciando na versão {p1}\n",
        bot_data: "✓ Obteve dados do BOT",
        no_update_available: 'Não há atualização disponível, seu bot está na versão mais recente.',
        update_available: 'Uma nova atualização compatível foi encontrada, aguarde o término da atualização...',
        error_check_update: 'Não foi possível checar se há alguma atualização disponível, o bot será iniciado.',
        bot_updated: 'Seu bot foi atualizado e será desligado, inicie novamente usando yarn start.',
        update_available_manual: 'Há uma atualização disponível, mas é necessário deletar todos os dados para a nova atualização funcionar corretamente. '+
        'Deseja continuar? ',
        server_started: '✓ Servidor iniciado!',
        groups_loaded: '✓ Todos os grupos foram carregados e atualizados.',
        admin_registered: `✅ Seu número foi cadastrado como DONO, agora você pode utilizar os comandos de ${prefix}admin`,
        new_user: "🤖 Boas vindas ao {p1}\n\n"+
        `👋 Olá {p2}, vi que você é um usuário novo para abrir o menu de comandos digite *${prefix}menu*`,
        new_group: "Saudações *{p1}* , se tiverem alguma dúvida só digitar "+`*${prefix}menu*`,
        guide_header_text: '❔ USO DO COMANDO ❔\n\n',
        no_guide_found: 'Não foi encontrado um guia para este comando.',
        error_command_usage: "Parece que você usou o comando *{p1}* incorretamente ou não sabe como utilizá-lo.\n\nDigite: *{p2} guia* para ver o guia e aprender sobre este comando.",
        error_command: "❗ Não foi possível realizar o comando *{p1}*.\n\n"+
        "*Motivo* : {p2}\n",
        command_rate_limited_message : "Você está impossibilitado de mandar comandos por *{p1}* segundos, pega leve cara.",
        group_blocked_command: "O comando *{p1}* está temporariamente bloqueado neste grupo pelo administrador.",
        globally_blocked_command: "O comando *{p1}* está indisponível no momento por ordem do administrador, tente novamente mais tarde.",
        detected_link: "🤖 Ei @{p1}, o ANTI-LINK está ativado e um possível link foi detectado na sua mensagem, ela foi apagada por segurança.",
        group_welcome_message: "👋 Olá, @{p1}\n\n"+
        "Seja bem vindo(a) ao grupo *{p2}*\n\n"+
        "{p3}"+
        `Digite *${prefix}menu* para ver os comandos.`,
        ban_message : "✅ Entendido, +{p1} será banido.\n\n"+
        "*Tipo*: BAN MANUAL\n"+
        "*Quem baniu*: {p2}",
        blacklist_ban_message : "✅ Entendido, +{p1} será banido.\n\n"+
        "*Tipo*: LISTA NEGRA\n"+
        "*Quem baniu*: {p2}",
        antifake_ban_message : "✅ Entendido, +{p1} será banido.\n\n"+
        "*Motivo*: ANTI-FAKE\n"+
        "*Quem baniu*: {p2}",
        antiflood_ban_messages : "✅ Entendido, +{p1} será banido.\n\n"+
        "*Motivo*: ANTI-FLOOD\n"+
        "*Quem baniu*: {p2}",
        queue_commands: "⏳ O bot está atendendo muitas pessoas ao mesmo tempo, tenha paciência!\n\n"+
        "Atualmente existem *{p1}* comandos na fila de espera.",
        user_types: {
            owner: '💻 Dono',
            admin: '⭐ Admin',
            user: '👤 Usuário',
        },
        disconnected:{
            command: "A conexão com o WhatsApp foi encerrada pelo comando do Administrador.",
            fatal_error: "A conexão com o WhatsApp foi encerrada devido a uma falha grave no código.",
            logout: "A sua sessão com o WhatsApp foi deslogada, leia o código QR novamente.",
            restart: "A sua conexão com o WhatsApp precisa ser reiniciada, tentando reconectar...",
            bad_connection: "A sua conexão com o WhatsApp foi encerrada, tentando reconectar... Motivo : {p1} - {p2}"
        },
        permission: {
            group: 'Este comando só pode ser usado em *grupos*.',
            bot_group_admin: 'Esse comando só pode ser realizado se o bot for *administrador do grupo*.',
            ban_admin : 'O bot não tem permissão para *banir um administrador*.',
            admin_group_only : 'Apenas *administradores do grupo* podem usar este comando.',
            admin_bot_only: 'Apenas *administradores do bot* podem usar este comando.',
            owner_bot_only: 'Apenas o *dono do bot* pode usar este comando.',
            owner_group_only: 'Apenas o *dono do grupo* pode usar este comando.',
        }
    }
}


