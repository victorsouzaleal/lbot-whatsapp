import * as infoFunctions from "./info.functions.commands.js"

const infoCommands = {
    menu: {
        guide: `Ex: *{$p}menu* - Exibe o menu de comandos gerais.\n`,
        msgs: {
            reply: "Olá, *{$1}*\n"+
            "Tipo de Usuário: *{$2}*\n"+
            "Comandos feitos: *{$3}*\n"+
            '────────────────────────\n',
            error_user_not_found: "Usuário não foi encontrado no banco de dados.",
            error_invalid_option: "A opção selecionada não existe no menu.",
        },
        function: infoFunctions.menuCommand
    },
    reportar: {
        guide: `Ex: *{$p}reportar* mensagem - Reporta uma mensagem para a administração do Bot.\n`,
        msgs: {
            reply: `✅ Obrigado, seu problema foi reportado com sucesso e será analisado pelo dono.`,
            error: 'Não foi possível enviar a mensagem para o dono, pois ele ainda não está cadastrado.',
            reply_admin: "‼️ *Reportar*\n\n"+
            "*Usuário*: {$1}\n"+
            "*Contato*: http://wa.me/{$2}\n"+
            "*Problema*: {$3}\n"
        },
        function: infoFunctions.reportarCommand
    },
    meusdados: {
        guide: `Ex: *{$p}meusdados* - Exibe seus dados gerais como comandos, mensagens, tipo de usuário, etc.\n`,
        msgs: {
            reply: "📊 *Seus dados de uso*\n\n"+
            "*Tipo de usuário*: {$1}\n"+
            "*Nome*: {$2}\n"+
            "*Comandos usados*: {$3} comandos\n",
            error_not_found: 'Usuário não foi encontrado.'
        },
        function: infoFunctions.meusdadosCommand
    },
    info: {
        guide: `Ex: *{$p}info* - Exibe as informações completas do bot, inclusive as configurações atuais.\n`,
        msgs: {
            reply_title:"*Nome do bot*: {$1}\n"+
            "*Online desde*: {$2}\n"+
            "*Versão*: {$3}\n"+
            "*GitHub*: https://github.com/victorsouzaleal/lbot-whatsapp\n"+
            "*Comandos executados*: *{$4}*\n"+
            "*Contato do administradores*:\n{$5}\n",
            reply_title_resources: '🤖 *Recursos do bot*\n\n',
            reply_item_adminmode_on: "*Modo ADMIN*: ✅\n",
            reply_item_adminmode_off: "*Modo ADMIN*: ❌\n",
            reply_item_autosticker_on: "*Auto-Sticker PV*: ✅\n",
            reply_item_autosticker_off: "*Auto-Sticker PV*: ❌\n",
            reply_item_commandspv_on: "*Comandos PV*: ✅\n",
            reply_item_commandspv_off: "*Comandos PV*: ❌\n",
            reply_item_commandsrate_on: "*Taxa de comandos*: ✅\n"+
            "- *{$1}* cmds/minuto\n"+
            "- Bloqueio: *{$2}s*\n",
            reply_item_commandsrate_off: "*Taxa de comandos*: ❌\n",
            reply_item_blockcmds_on: "*Bloqueio de comandos*: ✅\n"+
            "- Bloqueados: *{$1}*\n",
            reply_item_blockcmds_off: "*Bloqueio de comandos*: ❌\n",
            reply_item_blocked_count: "*Usuários bloqueados*: *{$1}*\n",
        },
        function: infoFunctions.infoCommand
    }
}

export default infoCommands