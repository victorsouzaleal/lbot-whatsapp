module.exports = {
    espera: {
        geral: "[ AGUARDE ] Em andamento ⏳ espere por favor.",
        detector : "[ AGUARDE ] Calibrando a máquina ⏳"
    },
    erro: {
        geral: "[❗] Não entendi que merda você quis fazer",
        rastreio:{
            cmd_erro: '[❗] Enviar comando *!rastreio [código-rastreio] *, exemplo *!rastreio 0000000000000*',
            codigo_invalido : '[❗] Código de rastreio deve ter 13 digitos!',
            nao_postado : '[❗] *Parece que este objeto ainda não foi postado*'
        },
        sticker:{
            cmd_erro : "[❗] Envie a imagem com a legenda *!s* ou responda uma imagem que ja foi enviada.",
            video_longo : '[❗] O whatsapp tem um limite de 1MB por sticker, dimunua seu video ou escolha algum outro',
            link_invalido : '[❗] O link que você enviou não é válido.',
            video_invalido : '[❗] Envie um video/gif com !sgif ou !sgif2 com no máx 10 segundos.',
            erro_background: '[❗] Não foi possível identificar o plano de fundo da imagem. Para obter detalhes e recomendações, consulte https://www.remove.bg/supported-images.',
            sem_credito: '[❗] Créditos insuficientes para remover fundo da imagem, contate ao administrador.',
            autenticacao: '[❗] Chave API não está configurada corretamente no arquivo .env, contate ao administrador.'
        },
        img : {
            tema_longo : '[❗] Tema da imagem é muito longo',
            tema_vazio : '[❗] Tu é idiota, cadê o tema da imagem?',
            qtd_imagem : '[❗] Essa quantidade de imagens não é válida (Min: 1 imagem / Máx: 5 imagens)'
        },
        voz : {
            cmd_erro: '[❗] Enviar comando *!voz [pt, en, jp] [texto]*, exemplo *!voz pt olá*',
            texto_vazio : '[❗] Tu é idiota, cadê o texto do comando?',
            texto_longo: '[❗] Texto muito longo!',
            nao_suportado: '[❗] Sem dados do idioma ou idioma não suportado! Atualmente suportamos :\n\n- 🇧🇷 Português (pt)\n- 🇺🇸 Inglês (en)\n- 🇯🇵 Japonês (jp)\n- 🇮🇹 Italiano (it)\n- 🇪🇸 Espanhol (es)'
        },
        traduz: {
            cmd_erro: '[❗] Para fazer a tradução você deve responder a algum texto com o comando *!traduz*',
        },
        noticia:{
            autenticacao: '[❗] Chave API não está configurada corretamente no arquivo .env, contate ao administrador.'
        },
        grupo: {
            bemvindo:{
                cmd_erro: "[❗] Selecione *ligado* ou *desligado*",
                ligado: "[❗] O recurso de boas-vindas já está ligado.",
                desligado: "[❗] O recurso de boas-vindas já está desligado."
            },
            antilink:{
                cmd_erro: "[❗] Selecione *ligado* ou *desligado*",
                ligado: "[❗] O recurso de anti-link já está ligado.",
                desligado: "[❗] O recurso de anti-link já está desligado."
            },
            antifake:{
                cmd_erro: "[❗] Selecione *ligado* ou *desligado*",
                ligado: "[❗] O recurso de anti-fake já está ligado.",
                desligado: "[❗] O recurso de anti-fake já está desligado."
            },
            antiflood:{
                cmd_erro: "[❗] Selecione *ligado* ou *desligado*",
                ligado: "[❗] O recurso de anti-flood já está ligado.",
                max: "[❗] Escolha um valor entre 5-20 mensagens para o anti-flood.",
                desligado: "[❗] O recurso de anti-flood já está desligado."
            },
            add:{
                cmd_erro: "[❗] Digite o numero da pessoa que você quer adicionar *!add* 5521xxxxxxxxx",
                add_erro: "[❗] Não foi possível adicionar este membro."
            },
            banir:{
                cmd_erro: "[❗] Marque o membro que você quer kickar *!banir* @membro ou responda o membro que quer banir com *!banir*",
                banir_admin: "[❗] O bot não pode banir um administrador"
            },
            promover:{
                cmd_erro: "[❗] Marque o membro que será promovido *!promote* @membro",
                limite_membro: "[❗] Apenas 1 pessoa por vez",
                admin: "[❗] Esta pessoa já é um administrador."
            },
            rebaixar:{
                cmd_erro: "[❗] Marque o admin que você quer rebaixar *!demote* @admin",
                limite_membro: "[❗] Apenas 1 pessoa por vez",
                admin: "[❗] Esta pessoa não é um administrador."
            },
            entrar_grupo:{
                cmd_erro: "[❗] Inválido *!entrargrupo link-grupo*\n\nEx: *!entrargrupo* https://chat.whatsapp.com/H7CIdeyyb5UGLbYqxu18Fs",
                chave_invalida: "[❗] Sua chave é inválida, peça ao dono do BOT uma chave válida!",
                link_invalido: "[❗] Isso não é um link válido! 👊🤬",
                maximo_grupos: "[❗] O bot já está com o número máximo de grupos!",
                minimo_membros: "[❗] O grupo precisa de no mínimo 5 membros."
            },
            apagar:{
                cmd_erro: "[❗] Erro! Responda a mensagem do bot com  *!apagar*",
                minha_msg: "[❗] Erro! O bot não pode apagar mensagem de outros membros."
            },
            fechar:{
                cmd_erro: "[❗] Erro! Digite com  *!fechar on/off*",
            },
            viadometro: {
                cmd_erro: "[❗] Erro! Você deve responder a alguém com  *!viadometro*",
            },
            detector: {
                cmd_erro: "[❗] Erro! Você deve responder a alguém com  *!detector*",
            }
        }
    },
    admin: {
        bloquear:{
            cmd_erro: "[❗] Marque o membro que será bloqueado*!bloquear* @membro ou responda ele com *!bloquear*",
            ja_bloqueado: "[❗] Este membro já está bloqueado",
        },
        desbloquear:{
            cmd_erro: "[❗] Marque o membro que será desbloqueado*!desbloquear* @membro ou responda ele com *!desbloquear*",
            ja_desbloqueado: "[❗] Este membro já está desbloqueado",
        },
        estado:{
            cmd_erro: "[❗] Digite o estado atual do bot com *!estado online|offline|manutencao*"
        },

    },
    permissao: {
        grupo: '[❗] Este comando só pode ser usado em grupos',
        bot_admin: '[❗] Permita que o BOT tenha permissões administrativas.',
        banir_admin : '[❗] O Bot não tem permissão para banir um administrador',
        apenas_admin : '[❗] Apenas administradores podem usar este comando.',
        apenas_dono_bot: '[❗] Apenas o dono do BOT pode usar este comando.',
        apenas_dono_grupo: '[❗] Apenas o dono do GRUPO pode usar este comando.',

    },
    sucesso: {
        grupo: {
            bemvindo: {
                ativado: "✅ O recurso de boas vindas foi ativado com sucesso",
                desativado: "✅ O recurso de boas vindas foi desativado com sucesso"
            },
            antilink: {
                ativado: "✅ O recurso de anti-link foi ativado com sucesso",
                desativado: "✅ O recurso de anti-link foi desativado com sucesso"
            },
            antifake: {
                ativado: "✅ O recurso de anti-fake foi ativado com sucesso",
                desativado: "✅ O recurso de anti-fake foi desativado com sucesso"
            },
            antiflood: {
                ativado: "✅ O recurso de anti-flood foi ativado com sucesso",
                desativado: "✅ O recurso de anti-flood foi desativado com sucesso"
            },
            banirtodos: "🤖✅ Todos banidos com sucesso!",
            banir: "🤖✅ KKKKKKKKKKKKKK BANI UM VIADIN",
            entrargrupo: "🤖✅ Entendido, entrarei em breve no grupo.",
            sair: "🤖✅ FLW VLW.",
            limpartudo : "🤖✅ Todos os chats foram limpos.",
            sairtodos: "🤖✅ Saí de todos os grupos com sucesso.",
        }
    }
}