import { Bot } from "../interfaces/bot.interface.js"
import * as adminFunctions from './admin.functions.commands.js'

export function commandsAdmin(botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name 
    const admin = {
        admin: {
            guide: `Ex: *${PREFIX}admin* - Exibe o menu de administração do bot.\n`,
            function: adminFunctions.adminCommand
        },
        modoadmin: {
            guide: `Ex: *${PREFIX}modoadmin* - Liga/desliga o MODO ADMIN (apenas administradores do bot podem usar comandos).\n`,
            msgs: {
                reply_off: "✅ O *MODO ADMIN* foi desativado com sucesso e agora todos podem usar comandos.",
                reply_on: "✅ O *MODO ADMIN* foi ativado com sucesso e apenas administradores do bot podem usar comandos."
            },
            function: adminFunctions.modoadminCommand
        },
        api: {
            guide: 'Esse comando é usado apenas para configurar as chave de API de certos serviços.\n\n'+
            `Configurar *DEEPGRAM*\nEx: ${PREFIX}api deepgram, *secret_key*\n\n`+
            `Configurar *ACRCLOUD*\nEx: ${PREFIX}api acrcloud, *host*, *access_key*, *secret_key*\n`,
            msgs: {
                reply_deepgram_success: `✅ Sua API do Deepgram foi configurada com sucesso, teste o comando ${PREFIX}ouvir para verificar se funcionou e se caso não funcione tente configurar novamente.`,                        
                reply_deepgram_error: 'Houve um erro ao configurar a chave do Deepgram, verifique se digitou o comando corretamente.\n\n'+
                `Ex: ${PREFIX}api deepgram, *secret_key*`,                        
                reply_acrcloud_success: `✅ Sua API do ACRCloud foi configurada com sucesso, teste o comando ${PREFIX}qualmusica para verificar se funcionou e se caso não funcione tente configurar novamente.`,                        
                reply_acrcloud_error: 'Houve um erro ao configurar a chave do ACRCloud, verifique se inseriu os valores corretamente.\n\n'+
                `Ex: ${PREFIX}api acrcloud, *host*, *access_key*, *secret_key*`,                       
            },
            function: adminFunctions.apiCommand
        },
        grupos: {
            guide: `Ex: *${PREFIX}grupos* - Mostra os grupos atuais que o bot está e suas informações.\n`,
            msgs: {
                reply_title: "👥 *Grupos atuais ({p1})*\n\n"+
                "*ATENÇÃO*: Se quiser sair de *TODOS* os grupos digite !sairgrupos\n\n",
                reply_item: "- *ID*: {p1}\n"+
                "- *Nome*: {p2}\n"+
                "- *Participantes*: {p3}\n"+
                "- *Admins*: {p4}\n"+
                "- *Bot é admin?* {p5}\n"+
                `- *Link*: {p6}\n\n`+
                `- *Deseja sair desse grupo?* Use ${PREFIX}sair {p7}\n\n`
            },
            function: adminFunctions.gruposCommand
        },
        sair: {
            guide: `Ex: Digite *${PREFIX}sair 1* - Faz o bot sair do grupo selecionado.\n\n`+
            `*Obs*: Para ver o número dos grupos é necessário checar no comando *${PREFIX}grupos*\n`,
            msgs: {
                reply: `🤖 *Sair do grupo* - {p1} (Opção n° {p2})\n\n`+
                '✅ Saí com sucesso do grupo selecionado.',
                error: `Não foi possível sair deste grupo, o grupo não foi encontrado ou o número é inválido. Cheque o comando correto em *${PREFIX}grupos*`,
            },
            function: adminFunctions.sairCommand
        },
        sairgrupos: {
            guide: `Ex: *${PREFIX}sairgrupos* - Sai de todos os grupos.\n`,
            msgs: {
                reply: `🤖 *Sair de todos os grupos*\n\n`+
                '✅ Saí com sucesso de todos os *{p1}* grupos.',
            },
            function: adminFunctions.sairgruposCommand
        },
        linkgrupo: {
            guide: `Ex: *${PREFIX}linkgrupo* 1 - Exibe o link do grupo selecionado.\n\n`+
            `*Obs*: Para ver o número dos grupos é necessário checar no comando *${PREFIX}grupos*\n`,
            msgs: {
                reply_group: '🤖 Entendido, eu enviei o link para você no privado.',
                reply_admin: `🤖 *Link do grupo* - {p1} (Opção n° {p2})\n\n`+
                '✅ Aqui está o link do grupo selecionado: {p3}',
                error_bot_not_admin: 'Não foi possível obter o link, o bot não é administrador deste grupo.',
                error_not_found: `Não foi possível obter o link do grupo, o grupo não foi encontrado ou o número é inválido. Cheque o comando correto em *${PREFIX}grupos*`,
            },
            function: adminFunctions.linkgrupoCommand
        },
        admins: {
            guide: `Ex: *${PREFIX}admins* - Exibe todos os admins do bot.\n`,
            msgs: {
                reply_title: `⭐ *Admins do bot* ({p1})\n\n`,
                reply_item: '- *ID*: {p1}\n'+
                '- *Nome*: {p2}\n'+
                '- *Contato*: +{p3}\n'+
                `- *Tipo*: {p4}\n\n`
            },
            function: adminFunctions.adminsCommand
        },
        addadmin: {
            guide: `Ex: Responda alguém com *${PREFIX}addadmin* - Promove o usuário respondido a admin do bot.\n`+
            `Ex: *${PREFIX}addadmin* @membro - Promove o membro marcado a admin do bot.\n`+
            `Ex: *${PREFIX}addadmin* +55219xxxx-xxxx - Promove o número digitado a admin do bot.\n`,
            msgs: {
                reply: `✅ O usuário +{p1} ({p2}) foi promovido a *ADMINISTRADOR* do bot.`,
                error_user_not_found: 'O usuário ainda não está registrado no bot, faça ele interagir com o bot primeiro.',
                error_already_admin: "Este usuário já é *ADMINISTRADOR* do bot.",
            },
            function: adminFunctions.addadminCommand
        },
        rmadmin: {
            guide: `Ex: Digite *${PREFIX}rmadmin 1* - Rebaixa o administrador selecionado.\n\n`+
            `*Obs*: Para ver o ID dos administradores é necessário checar no comando *${PREFIX}veradmins*\n\n`+
            `Você também pode rebaixar adminstradores das seguinte formas: \n\n`+
            `Ex: *${PREFIX}rmadmin* +55219xxxx-xxxx - Rebaixa o administrador pelo número digitado.\n`+
            `Ex: Responda com *${PREFIX}rmadmin* - Rebaixa o administrador que for respondido.\n`+
            `Ex: *${PREFIX}rmadmin* @membro - Rebaixa o administrador que for marcado.\n`,
            msgs: {
                reply: `✅ O usuário +{p1} ({p2}) foi rebaixado a *USUÁRIO* do bot.`,
                error_not_admin: "Este usuário não é *ADMINISTRADOR* do bot.",
                error_user_not_found: 'O usuário ainda não está registrado no bot, faça ele interagir com o bot primeiro.',
                error_demote_owner: "Você não pode rebaixar o *DONO* do bot."
            },
            function: adminFunctions.rmadminCommand
        },
        comandospv: {
            guide: `Ex: *${PREFIX}comandospv* - Liga/desliga os comandos em MENSAGENS PRIVADAS.\n`,
            msgs: {
                reply_off: "✅ Os *COMANDOS EM MENSAGENS PRIVADAS* foram desativados com sucesso.",
                reply_on: "✅ Os *COMANDOS EM MENSAGENS PRIVADAS* foram ativados com sucesso."
            },
            function: adminFunctions.comandospvCommand
        },
        taxacomandos: {
            guide: `Ex: *${PREFIX}taxacomandos* 5 - Ativa a taxa limite de comandos para 5 comandos a cada minuto por usuário, com 60 segundos de bloqueio.\n`+
            `Ex: *${PREFIX}taxacomandos* 10 80 - Ativa a taxa limite de comandos para 10 comandos a cada minuto por usuário, com 80 segundos de bloqueio.\n\n`+
            `*Obs*: Digite *${PREFIX}taxacomandos* novamente para desativar a taxa limite de comandos.\n`,
            msgs: {
                error_max_commands_invalid: "A quantidade máxima de comandos por minuto está inválida, precisa ser um número e ser maior que 3.",
                error_block_time_invalid: "O tempo de bloqueio de mensagens está inválido, precisa ser um número e maior que 10.",
                reply_on: "✅ A *TAXA DE COMANDOS POR MINUTO* foi ativada com sucesso.\n\n"+
                '*Configuração atual*: \n'+
                '- *Comandos por minuto*: {p1}\n'+
                '- *Tempo de bloqueio*: {p2}s\n',
                reply_off: "✅ A *TAXA DE COMANDOS POR MINUTO* foi desativada com sucesso.",
            },
            function: adminFunctions.taxacomandosCommand
        },
        autostickerpv: {
            guide: `Ex: *${PREFIX}autostickerpv* - Liga/desliga a criação automatica de stickers sem precisar de comandos no privado.\n`,
            msgs: {
                reply_off: "✅ O *AUTO-STICKER* em mensagens privadas foi desativado com sucesso",
                reply_on: "✅ O *AUTO-STICKER* em mensagens privadas foi ativado com sucesso",
            },
            function: adminFunctions.autostickerpvCommand
        },
        bcmdglobal: {
            guide: `Ex: *${PREFIX}bcmdglobal* ${PREFIX}s ${PREFIX}sgif ${PREFIX}play - Bloqueia  os comandos ${PREFIX}s, ${PREFIX}sgif e ${PREFIX}play (você pode escolher os comandos a sua necessidade).\n\n`+
            `Ex: *${PREFIX}bcmdglobal* sticker - Bloqueia todos os comandos da categoria STICKER.\n\n`+
            `Ex: *${PREFIX}bcmdglobal* utilidade - Bloqueia todos os comandos da categoria UTILIDADE.\n\n`+
            `Ex: *${PREFIX}bcmdglobal* download - Bloqueia todos os comandos da categoria DOWNLOAD.\n\n`+
            `Ex: *${PREFIX}bcmdglobal* variado - Bloqueia todos os comandos da categoria VARIADO.\n\n`+
            `*Obs*: Você não pode bloquear comandos de administrador.\n`,
            msgs: {
                reply_title: "🔒 *Bloquear comandos - Global*\n\n",
                reply_item_already_blocked: "Comando *{p1}* já está bloqueado.\n",
                reply_item_blocked: "Comando *{p1}* bloqueado com sucesso.\n",
                reply_item_error: "Comando *{p1}* não pode ser bloqueado.\n",
                reply_item_not_exist: "Comando *{p1}* não existe.\n",
            },
            function: adminFunctions.bcmdglobalCommand
        },
        dcmdglobal: {
            guide: `Ex: *${PREFIX}dcmdglobal* ${PREFIX}s ${PREFIX}sgif ${PREFIX}play - Desbloqueia  os comandos ${PREFIX}s, ${PREFIX}sgif e ${PREFIX}play.\n\n`+
            `Ex: *${PREFIX}dcmdglobal* todos - Desbloqueia todos os comandos.\n\n`+
            `Ex: *${PREFIX}dcmdglobal* sticker - Desbloqueia todos os comandos da categoria STICKER.\n\n`+
            `Ex: *${PREFIX}dcmdglobal* utilidade - Desbloqueia todos os comandos da categoria UTILIDADE.\n\n`+
            `Ex: *${PREFIX}dcmdglobal* download - Desbloqueia todos os comandos da categoria DOWNLOAD.\n\n`+
            `Ex: *${PREFIX}dcmdglobal* variado - Desbloqueia todos os comandos da categoria VARIADO.\n\n`+
            `*Obs*: Verifique os comandos que estão bloqueados com ${PREFIX}infocompleta.\n`,
            msgs: {
                reply_title: "🔓 *Desbloquear Comandos - Global* \n\n",
                reply_item_unblocked: "Comando *{p1}* foi desbloqueado.\n",
                reply_item_not_blocked: "Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
            },
            function: adminFunctions.dcmdglobalCommand
        },
        entrargrupo: {
            guide: `Ex: *${PREFIX}entrargrupo* link - Entra em um grupo por link de convite.\n`,
            msgs: {
                error_link_invalid: "Isso não é um link de grupo válido.",
                error_group: "Houve um erro ao entrar nesse grupo, verifique se o link está correto.",
                reply_pending: "⏳ Fiz um pedido para entrar no grupo, porém é necessário um administrador aceitar a entrada.",
                reply: "✅ Entrei no grupo pelo link fornecido."
            },
            function: adminFunctions.entrargrupoCommand
        },
        bcgrupos: {
            guide: `Ex: *${PREFIX}bcgrupos* mensagem - Envia uma mensagem para todos os *GRUPOS*.\n`,
            msgs: {
                message: `🤖*${BOT_NAME}® - Mensagem para os grupos*\n\n`+
                "{p1}",
                wait: "⏳ Em andamento , estou enviando sua mensagem para {p1} grupos.\n\n"+
                "*Tempo estimado*: {p2} segundos",
                reply: "✅ Anúncio feito com sucesso."
            },
            function: adminFunctions.bcgruposCommand
        },
        fotobot: {
            guide: `Ex: Envie/responda uma *imagem* com *${PREFIX}fotobot* - Altera a foto do BOT.\n`,
            msgs: {
                reply: "✅ A foto do bot foi alterada com sucesso.",
                error_message: "Houve um erro ao obter os dados da mensagem."
            },
            function: adminFunctions.fotobotCommand
        },
        nomebot: {
            guide: `Ex: *${PREFIX}nomebot* Teste123 - Muda o nome do *BOT* para *Teste123* e atualiza os menus com o novo nome.\n`,
            msgs: {
                reply: "✅ O nome do bot foi alterado com sucesso.",
            },
            function: adminFunctions.nomebotCommand
        },
        nomepack: {
            guide: `Ex: *${PREFIX}nomesticker* Teste123 - Muda o nome do *PACOTE DE STICKERS* para *Teste123* e atualiza os novos stickers com o novo nome.\n`,
            msgs: {
                reply: "✅ O nome do pacote de figurinhas foi alterado com sucesso.",
            },
            function: adminFunctions.nomepackCommand
        },
        nomeautor: {
            guide: `Ex: *${PREFIX}nomeadm* Teste123 - Muda o nome do *ADMINISTRADOR* para *Teste123* e atualiza os menus com o novo nome.\n`,
            msgs: {
                reply: "✅ O nome do autor de figurinhas foi alterado com sucesso.",
            },
            function: adminFunctions.nomeautorCommand
        },
        prefixo: {
            guide: `Ex: *${PREFIX}prefixo* .  - Muda o prefixo dos *COMANDOS* para *.* e atualiza os menus e comandos com o novo prefixo.\n\n`+
            `Suporta os seguintes prefixos: *!*  *#*  *.*  ***\n`,
            msgs: {
                reply: "✅ O prefixo dos comandos foi alterado com sucesso.",
                error_not_supported: "Esse símbolo não é suportado como prefixo, são suportados somente: ! # . *"
            },
            function: adminFunctions.prefixoCommand
        },
        listablock: {
            guide: `Ex: *${PREFIX}listablock* - Exibe a lista de usuários bloqueados pelo bot.\n`,
            msgs: {
                reply_title: "🚷 *Usuários bloqueados* \n\n"+
                "*Total*: {p1}\n\n",
                reply_item: "- *ID*: {p1}\n"+
                "- *Contato*: +{p2}\n\n",
                error: "O bot não tem usuários bloqueados.",
            },
            function: adminFunctions.listablockCommand
        },
        bloquear: {
            guide: `Ex: *${PREFIX}bloquear* @membro - Para o bot bloquear o membro mencionado.\n\n`+
            `Ex: *${PREFIX}bloquear* +55 (xx) xxxxx-xxxx - Para o bot bloquear o número digitado.\n\n`+
            `Ex: Responder alguém com *${PREFIX}bloquear* - Para o bot bloquear o membro que você respondeu.\n`,
            msgs: {
                error_block_admin_bot: "O usuário +{p1} é *admin* do bot, não foi possivel bloquear.",
                error_already_blocked: "O usuário +{p1} já está *bloqueado*.",
                error_block: "Houve um erro ao bloquear este usuário, verifique se o número inserido existe e está correto.",
                reply: "✅ O usuário +{p1} foi *bloqueado* com sucesso"
            },
            function: adminFunctions.bloquearCommand
        },
        desbloquear: {
            guide: `Ex: Digite *${PREFIX}desbloquear 1* - Desbloqueia o usuário selecionado da lista negra.\n\n`+
            `*Obs*: Para ver o ID dos usuários é necessário checar no comando *${PREFIX}listablock*\n\n`+
            `Você também pode desbloquear usuários das seguintes formas: \n\n`+
            `Ex: *${PREFIX}desbloquear* @membro - Para o bot desbloquear o membro mencionado.\n\n`+
            `Ex: *${PREFIX}desbloquear* +55 (xx) xxxxx-xxxx - Para o bot desbloquear o número digitado.\n\n`+
            `Ex: Responder alguém com *${PREFIX}desbloquear* - Para o bot desbloquear o usuário que você respondeu.\n`,
            msgs: {
                error_already_unblocked: "O usuário +{p1} já está *desbloqueado* ou nunca foi bloqueado.",
                error_unblock: "Houve um erro ao desbloquear este usuário, verifique se o número está correto e que ele realmente está bloqueado.",
                reply: "✅ O usuário +{p1} foi *desbloqueado* com sucesso."
            },
            function: adminFunctions.desbloquearCommand
        },
        recado: {
            guide: `Ex: *${PREFIX}recado* texto - Muda o texto do recado/status do bot.\n`,
            msgs: {
                reply: '📝 *Recado/Status*:\n\n'+
                "Seu recado/status foi alterado com sucesso para: {p1}"
            },
            function: adminFunctions.recadoCommand
        },
        usuario: {
            guide: `Ex: *${PREFIX}usuario* @usuario - Mostra os dados gerais do usuário mencionado.\n\n`+
            `Ex: Responder com *${PREFIX}usuario* - Mostra os dados gerais do usuário respondido.\n\n`+
            `Ex: *${PREFIX}usuario* 55219xxxxxxxx - Mostra os dados gerais do usuário com esse número.\n`,
            msgs: {
                error_user_not_found: "Este usuário ainda não está registrado, faça ele interagir com o bot primeiro.",
                reply: "👤 *Dados do usuário*\n\n"+
                "*Nome*: {p1}\n"+
                "*Tipo de usuário*: {p2}\n"+
                "*Número*: +{p3}\n"+
                "*Total de comandos usados*: {p4} comandos"
            },
            function: adminFunctions.usuarioCommand
        },
        desligar: {
            guide: `Ex: *${PREFIX}desligar* - Desliga o bot.\n`,
            msgs: {
                reply: "✅ Entendido, o bot será desligado."
            },
            function: adminFunctions.desligarCommand
        },
        ping: {
            guide: `Ex: *${PREFIX}ping* - Exibe as informações do sistema do BOT e o tempo de resposta dele.\n`,
            msgs: {
                reply: "🖥️ *Informação geral*\n\n"+
                "*OS*: {p1}\n"+
                "*CPU*: {p2}\n"+
                "*RAM*: {p3}GB/{p4}GB\n"+
                "*Resposta*: {p5}s\n"+
                "*Usuários cadastrados*: {p6}\n"+
                "*Grupos cadastrados*: {p7}\n"+
                "*Online desde*: {p8}"
            },
            function: adminFunctions.pingCommand
        }
    }

    return admin
}