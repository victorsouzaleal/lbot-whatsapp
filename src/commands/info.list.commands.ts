import { Bot } from "../interfaces/bot.interface.js"
import * as infoFunctions from "./info.functions.commands.js"

export default function commandsInfo(botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name 
    const info = {
        menu: {
            guide: `Ex: *${PREFIX}menu* - Exibe o menu de comandos gerais.\n`,
            msgs: {
                reply: "Olá, *{p1}*\n"+
                "Tipo de Usuário: *{p2}*\n"+
                "Comandos feitos: *{p3}*\n"+
                '────────────────────────\n',
                error_user_not_found: "Usuário não foi encontrado no banco de dados.",
                error_invalid_option: "A opção selecionada não existe no menu.",
            },
            function: infoFunctions.menuCommand
        },
        reportar: {
            guide: `Ex: *${PREFIX}reportar* mensagem - Reporta uma mensagem para a administração do Bot.\n`,
            msgs: {
                reply: `✅ Obrigado, seu problema foi reportado com sucesso e será analisado pelo dono.`,
                error: 'Não foi possível enviar a mensagem para o dono, pois ele ainda não está cadastrado.',
                reply_admin: "‼️ *Reportar*\n\n"+
                "*Usuário*: {p1}\n"+
                "*Contato*: http://wa.me/{p2}\n"+
                "*Problema*: {p3}\n"
            },
            function: infoFunctions.reportarCommand
        },
        meusdados: {
            guide: `Ex: *${PREFIX}meusdados* - Exibe seus dados gerais como comandos, mensagens, tipo de usuário, etc.\n`,
            msgs: {
                reply: "📊 *Seus dados de uso*\n\n"+
                "*Tipo de usuário*: {p1}\n"+
                "*Nome*: {p2}\n"+
                "*Comandos usados*: {p3} comandos\n",
                error_not_found: 'Usuário não foi encontrado.'
            },
            function: infoFunctions.meusdadosCommand
        },
        info: {
            guide: `Ex: *${PREFIX}info* - Exibe as informações completas do bot, inclusive as configurações atuais.\n`,
            msgs: {
                reply_title:"*Nome do bot*: {p1}\n"+
                "*Online desde*: {p2}\n"+
                "*Versão*: {p3}\n"+
                "*GitHub*: https://github.com/victorsouzaleal/lbot-whatsapp\n"+
                "*Comandos executados*: *{p4}*\n"+
                "*Contato do administradores*:\n{p5}\n",
                reply_title_resources: '🤖 *Recursos do bot*\n\n',
                reply_item_adminmode_on: "*Modo ADMIN*: ✅\n",
                reply_item_adminmode_off: "*Modo ADMIN*: ❌\n",
                reply_item_autosticker_on: "*Auto-Sticker PV*: ✅\n",
                reply_item_autosticker_off: "*Auto-Sticker PV*: ❌\n",
                reply_item_commandspv_on: "*Comandos PV*: ✅\n",
                reply_item_commandspv_off: "*Comandos PV*: ❌\n",
                reply_item_commandsrate_on: "*Taxa de comandos*: ✅\n"+
                "- *{p1}* cmds/minuto\n"+
                "- Bloqueio: *{p2}s*\n",
                reply_item_commandsrate_off: "*Taxa de comandos*: ❌\n",
                reply_item_blockcmds_on: "*Bloqueio de comandos*: ✅\n"+
                "- Bloqueados: *{p1}*\n",
                reply_item_blockcmds_off: "*Bloqueio de comandos*: ❌\n",
                reply_item_blocked_count: "*Usuários bloqueados*: *{p1}*\n",
            },
            function: infoFunctions.infoCommand
        }
    }

    return info
}