const msgs_texto = {
    inicio:{
        arquivos_criados: "✓ Seus arquivos necessários foram criados, configure seu .env e inicie o aplicativo novamente.",
        dados_bot: "✓ Obteve dados do BOT",
        cadastro_grupos: "✓ Sucesso no cadastro de grupos",
        participantes_atualizados: "✓ Participantes dos grupos atualizados",
        contagem_recarregada: "✓ Todas as contagens foram recarregadas e novos membros foram adicionados/removidos."
    },
    geral: {
        erro: "[❗] Não entendi que merda você quis fazer",
        espera : "[AGUARDE] Em andamento ⏳ espere por favor.",
        min_membros: "O grupo precisa de no mínimo {p1} para o bot ser convidado.`",
        entrada_grupo: "Saudações *{p1}* se tiverem alguma dúvida só digitar *!ajuda*",
        sem_ligacoes: "[❗] Não posso receber ligações, você sera bloqueado.",
        comando_invalido: "[❗] Parece que você não digitou corretamente o comando ou não sabe como usá-los, digite o comando *!ajuda* para mais informações.",
        cmd_erro: "[❗] Houve um erro no comando *{p1}*, digite *{p2} guia* para aprender a usá-lo."
    },
    utilidades:{
        ajuda:{
            resposta_comum: "Usuário : *{p1}*\n"+
            "Tipo de Usuário : *{p2}*\n",
            resposta_limite_diario: "Usuário : *{p1}* -  Limite : *{p2}/{p3}*\n"+
            "Tipo de Usuário : *{p4}*\n"
        },
        info:{
            resposta: "*Criador do Bot* : {p1}\n"+
            "*Criado em* : {p2}\n"+
            "*Nome do bot* : {p3}\n"+
            "*Online desde* : {p4}\n"+
            "*Comandos executados* : {p5}\n"+
            "*Contato do criador* : wa.me/{p6}\n"+
            "*Versão atual* : {p7}\n"+
            "*GitHub* : https://github.com/Victorsouza02/lbot-whatsapp\n"
        },
        meusdados:{
            resposta_geral: "[🤖*SEUS DADOS DE USO*🤖]\n\n"+
            "Tipo de usuário : *{p1}*\n"+
            "Nome : *{p2}*\n"+
            "Total de comandos usados : *{p3}* comandos\n",
            resposta_limite_diario: "Comandos usados hoje : *{p1}/{p2}*\n"+
            "Limite diário : *{p3}*\n",
            resposta_grupo: "Mensagens neste grupo : *{p1}* mensagens\n"
        },
        rastreio:{
            cmd_erro: '[❗] Enviar comando *!rastreio [código-rastreio] *\n\nExemplo *!rastreio 0000000000000*',
            codigo_invalido : '[❗] Código de rastreio deve ter 13 digitos!',
            nao_postado : '[❗] *Parece que este objeto ainda não foi postado*',
            erro_servidor : '[❗] *Houve um erro na API dos Correios*',
            resposta_titulo: "📦📦*RASTREIO*📦📦\n\n",
            resposta_itens: "Status : {p1}\n"+
            "Data : {p2}\n"+
            "Hora : {p3}\n"+
            "{p4}\n"
        },
        reportar:{
            cmd_erro: '[❗] Você deve digitar a mensagem após o comando *!reportar*',
            sucesso: `✅ Sua mensagem foi enviada ao dono do Bot.`,
            resposta: "[ 🤖 REPORTAR ⚙️]\n\n"+
            "*Usuário* : {p1}\n"+
            "*Contato* : http://wa.me/{p2}\n"+
            "*Mensagem* : {p3}\n"
        },
        sticker:{
            cmd_erro : "[❗] Certifique-se que a midia é uma imagem e que está com a legenda *!s* ou responda uma imagem que ja foi enviada com *!s*\n\nObs: Este comando é apenas para *IMAGENS*.",
            video_longo : '[❗] O Whatsapp tem um limite de 1MB por sticker, dimunua seu video ou escolha algum outro',
            link_invalido : '[❗] O link que você enviou não é válido.',
            ssf_imagem: `[❗] Este comando é válido apenas para imagens.`,
            video_invalido : '[❗] Envie um video/gif com !sgif com no máx 10 segundos.',
            erro_remover: '[❗] Houve um erro ao remover fundo, verifique se a imagem é compatível.',
            sem_credito: '[❗] Créditos insuficientes para remover fundo da imagem, contate ao administrador.',
            autenticacao: '[❗] Chave API não está configurada corretamente no arquivo .env, contate ao administrador.'
        },
        tps:{
            cmd_erro : "[❗] Você não digitou após o comando *!tps* ou está usando o comando de forma incorreta.",
            erro_conversao: "[❗] Houve algum erro na conversao do *!tps*, verifique se não há emojis no seu texto.",
            texto_longo : "[❗] Texto é muito longo, no máximo 40 caracteres. ",
            espera: "⏳ Em andamento , estou transformando seu texto em Sticker."
        },
        simg:{
            cmd_erro: "[❗] Você deve responder a um sticker com *!simg*"
        },
        img : {
            cmd_erro: "[❗] Você deve apenas digitar *!img [tema-imagem]*, sem nenhuma foto ou respondendo outra pessoa.",
            tema_longo : '[❗] Tema da imagem é muito longo',
            tema_vazio : '[❗] Tu é idiota, cadê o tema da imagem?',
            qtd_imagem : '[❗] Essa quantidade de imagens não é válida (Min: 1 imagem / Máx: 5 imagens)',
            erro_imagem: '[❗] Não foi possível obter essa imagem.',
            nao_encontrado: '[❗] Não foi possível encontrar imagem com esse tema, tente novamente.',
            erro_api: "[❗] Houve um erro na API de pesquisa de imagens, verifique se você não excedeu o limite ou se sua chave está configurada."
        },
        audio: {
            cmd_erro : "[❗] Você deve responder a um audio com *!audio [tipo-edicao]*\n"+
            "Temos disponível :\n\n"+
            "- *grave* - Torna audio mais grave e lento\n"+
            "- *agudo* - Torna o audio mais agudo e rapido\n"+
            "- *estourar* - Deixa o audio estourado\n"+
            "- *volume* - Aumenta o volume em 4 vezes\n"+
            "- *x2* - Acelera o audio em 2 vezes\n"+
            "- *reverso* - Reverte o audio",
            erro_conversao: "[❗] Houve um erro na conversão de audio"
        },
        anime:{
            cmd_erro: "[❗] Você deve postar uma imagem com *!anime* ou responder outra imagem com *!anime*",
            espera: "⏳ Estou processando a imagem e pesquisando o anime.",
            similaridade: "[❗] Nível de similaridade é muito baixo, certifique se enviar uma cena VÁLIDA de anime (Não funciona com imagens não oficiais, Wallpapers ou imagens recortadas e/ou baixa qualidade).",
            limite_solicitacao: "[❗] Muitas solicitações sendo feitas, tente novamente mais tarde.",
            sem_resultado: "[❗] Não foi possível achar resultados para esta imagem",
            resposta: "〘 Pesquisa de anime 〙\n\n"+
            "Título: *{p1}*\n"+
            "Episódio: {p2}\n"+
            "Tempo da cena: *{p3} - {p4}*\n"+
            "Similaridade: *{p5}%*",
            erro_servidor: "[❗] Houve um erro no servidor de pesquisa de imagem.",
            erro_processamento: "[❗] Houve um erro no processamento da imagem"
        },
        animelanc:{
            erro_pesquisa: "[❗] Houve um erro na API de pesquisa de animes, tente novamente mais tarde.",
            resposta_titulo: "[🇯🇵 Lançamentos atuais de animes 🇯🇵]\n\n",
            resposta_itens: "Nome : *{p1}*\n"+
            "Episódio : *{p2}*\n"+
            "Link : {p3}\n\n"
        },
        voz : {
            cmd_erro: "[❗] Enviar comando *!voz [pt, en, jp] [texto]*\n\n"+
            "Exemplo *!voz pt olá* - Diz olá em português-brasileiro.",
            texto_vazio : '[❗] Tu é idiota, cadê o texto do comando?',
            texto_longo: '[❗] Texto muito longo!',
            erro_audio: "[❗] Houve um erro na criação do áudio",
            nao_suportado: "[❗] Sem dados do idioma ou idioma não suportado! Atualmente suportamos :\n\n"+
            "- 🇧🇷 Português (pt)\n"+
            "- 🇺🇸 Inglês (en)\n"+
            "- 🇯🇵 Japonês (jp)\n"+
            "- 🇮🇹 Italiano (it)\n"+
            "- 🇪🇸 Espanhol (es)"
        },
        traduz: {
            cmd_erro: '[❗] Você deve digitar *!traduz [texto]* ou responder a algum texto com *!traduz*',
            erro_servidor: '[❗] Houve um erro de resposta do servidor de tradução.',
            resposta: "🇧🇷 *Tradução para português* 🇧🇷 :\n\n"+
            "*Texto*: {p1}\n\n"+
            "*Tradução* : {p2}"
        },
        noticia:{
            erro_servidor: '[❗] Houve um erro na API de notícias, verifique se a chave API está configurada corretamente.',
            resposta_titulo: "╔══✪〘 NOTICIAS 〙✪══\n",
            resposta_itens: "╠\n╠➥ 📰🗞️ *{p1}* \n"
        },
        ddd:{
            somente_br: "[❗] Esse comando só é aceito com números brasileiros.",
            erro_ddd: "[❗] O DDD inserido é inválido",
            cmd_erro: "[❗] Você deve responder alguém com *!ddd* ou colocar o ddd após o comando",
            resposta: "📱 Estado : *{p1}* / Região : *{p2}*"
        },
        clima:{
            cmd_erro: "[❗] Você deve digitar cidade/bairro e estado completos.\n\n"+
            "Exemplo: *!clima Madureira Rio de Janeiro*",
            erro_resultado : "[❗] Local não encontrado ou houve um erro na API.\n\n"+
            "Dica: *Digite cidade e estado completos para maior chance de ser encontrado.*",
            resposta: "☀️ CONSULTA DE CLIMA ☀️\n\n"+
            "{p1}"
        },
        moeda:{
            cmd_erro: "[❗] Digite o tipo de moeda e quantidade para converter para Real Brasileiro.\n\n"+
            "Exemplo: *!moeda dolar 20* - Converte 20 dolares para real",
            nao_suportado: "[❗] Moeda não suportada, atualmente existe suporte para : dolar|iene|euro",
            valor_invalido: "[❗] O valor não é um número válido",
            valor_limite: "[❗] Quantidade muito alta, você provavelmente não tem todo esse dinheiro.",
            erro_servidor: "[❗] Houve um erro na API de conversão de moedas",
            resposta: "💵 Atualmente *{p1} {p2}* está valendo *R$ {p3}*\n\n"+
            "Informação atualizada : *{p4}*"
        },
        pesquisa: {
            cmd_erro: "[❗] Digite o que você quer pesquisar\n\nExemplo: *!pesquisa Batata* - Pesquisa batata",
            erro_servidor: "[❗] Houve um erro na API de pesquisa",
            resposta_titulo: "🔎 Resultados da pesquisa de : *{p1}*🔎\n\n",
            resposta_itens: "🔎 {p1}\n"+
            "*Link* : {p2}\n\n"+
            "*Descrição* : {p3}\n\n"
        },
        calc:{
            cmd_erro: "[❗] Você deve digitar o que deseja calcular após o comando *!calc*\n\n"+
            "Exemplo: *!calc 2+2* - Calcula 2+2",
            carac_invalidos: "[❗] Seu cálculo tem caracteres inválidos.",
            divisao_zero: "🧮 Para de ficar tentando dividir por 0 , seu mongol.",
            erro_calculo: "[❗] Houve um erro no cálculo",
            resposta: "🧮 O resultado é *{p1}* "
        },
        play:{
            cmd_erro: "[❗] Você deve digitar *!play [musica]*",
            espera: "[AGUARDE] 🎧 Sua música está sendo baixada e processada.\n\n"+
            "Titulo: *{p1}*\n"+
            "Duração: *{p2}*",
            limite: "[❗] A música deve ter menos de *5 minutos*",
            nao_encontrado: "[❗] Video não encontrado, digite o nome do video com mais detalhes",
            erro_enviar: "[❗] Houve um erro ao enviar o áudio",
            erro_pesquisa: "[❗] Houve um erro na pesquisa da música",
            erro_download: "[❗] Houve um erro no download da música"
        },
        yt:{
            cmd_erro: "[❗] Você deve digitar *!yt [nome do video]*",
            espera: "[AGUARDE] 🎥 Seu video está sendo baixado e processado.\n\n"+
            "Titulo: *{p1}*\n"+
            "Duração: *{p2}*",
            nao_encontrado: "[❗] Video não encontrado, digite o nome do video com mais detalhes",
            limite: "[❗] O video deve ter menos de *5 minutos*",
            erro_link: "[❗] Houve um erro no servidor para obter link de download",
            erro_pesquisa: "[❗] Houve um erro no servidor de pesquisa de videos",

        },
        tw:{
            cmd_erro: "[❗] Você deve digitar *!tw [link-video]*",
            espera: "[AGUARDE] 🎥 Seu video está sendo baixado e processado.",
            nao_encontrado: "[❗] Video não encontrado, verifique o link do video",
            limite: "[❗] O video deve ter menos de *5 minutos*",
            erro_link: "[❗] Houve um erro no servidor para obter link de download, verifique se o link está correto.",
            erro_pesquisa: "[❗] Houve um erro no servidor de pesquisa de videos",
        }
    },
    grupo: {
        bemvindo:{
            ja_ligado: "[❗] O recurso de boas-vindas já está ligado.",
            ja_desligado: "[❗] O recurso de boas-vindas já está desligado.",
            ligado: "✅ O recurso de boas vindas foi ativado com sucesso",
            desligado: "✅ O recurso de boas vindas foi desativado com sucesso",
            mensagem: "👋 Olá @{p1}\n"+
            "Seja bem vindo(a) ao grupo *{p2}*\n\n"+
            "{p3}"+
            "Digite *!ajuda* para ver os comandos."
        },
        status:{
            resposta_titulo: "[ 🤖 S T A T U S   D O   G R U P O 🤖 ]\n\n",
            resposta_variavel: {
                bemvindo:{
                    on: "- Recurso Boas Vindas : ✅\n",
                    off: "- Recurso Boas Vindas : ❌\n"
                },
                mutar:{
                    on: "- Recurso Mutar : ✅\n",
                    off: "- Recurso Mutar : ❌\n"
                },
                antilink:{
                    on: "- Recurso Anti-Link : ✅\n"+
                    "{p1}",
                    off: "- Recurso Anti-Link : ❌\n",
                    filtros: {
                        youtube: "   - *Youtube* liberado\n",
                        twitter: "   - *Twitter* liberado\n",
                        facebook: "   - *Facebook* liberado\n",
                        whatsapp: "   - *WhatsApp* liberado\n"
                    }
                },
                antifake:{
                    on: "- Recurso Anti-Fake : ✅\n",
                    off: "- Recurso Anti-Fake : ❌\n"
                },
                antiflood:{
                    on: "- Recurso Anti-Flood : ✅ Máx: *{p1}* msgs / *{p2}* s \n",
                    off: "- Recurso Anti-Flood : ❌\n"
                },
                contador:{
                    on: "- Recurso Contador : ✅ {p1}\n",
                    off: "- Recurso Contador : ❌\n"
                },
                bloqueiocmds:{
                    on: "- Bloqueio de comandos : ✅ *{p1}*\n",
                    off: "- Bloqueio de comandos : ❌\n"
                }
            }
        },
        antilink:{
            ja_ligado: "[❗] O recurso de anti-link já está ligado.",
            ja_desligado: "[❗] O recurso de anti-link já está desligado.",
            ligado: "✅ O recurso de anti-link foi ativado com sucesso",
            desligado: "✅ O recurso de anti-link foi desativado com sucesso"
        },
        antifake:{
            ja_ligado: "[❗] O recurso de anti-fake já está ligado.",
            ja_desligado: "[❗] O recurso de anti-fake já está desligado.",
            ligado: "✅ O recurso de anti-fake foi ativado com sucesso",
            desligado: "✅ O recurso de anti-fake foi desativado com sucesso"
        },
        mutar:{
            ja_desligado: "[❗] O recurso de mutar já está desligado.",
            ligado: "✅ O recurso de mutar foi ativado com sucesso",
            desligado: "✅ O recurso de mutar foi desativado com sucesso"
        },
        antiflood:{
            ja_ligado: "[❗] O recurso de anti-flood já está ligado.",
            max: "[❗] Escolha um valor entre 5-20 mensagens para o anti-flood.",
            intervalo: "[❗] Escolha um valor entre 10-60 segundos para o intervalo do anti-flood.",
            ban_resposta: "BANIDO @{p1} - Limite de mensagens excedido pelo ANTI FLOOD",
            ja_desligado: "[❗] O recurso de anti-flood já está desligado.",
            ligado: "✅ O recurso de anti-flood foi ativado com sucesso",
            desligado: "✅ O recurso de anti-flood foi desativado com sucesso"
        },
        add:{
            add_erro: "[❗] Não foi possível adicionar este membro."
        },
        banir:{
            banir_admin: "[❗] O bot não pode banir um administrador",
            banir_sucesso: "🤖✅ KKKKKKKKKKKKKK BANI UM TROUXA",
            banir_erro: "[❗] Não foi possível banir este membro, provavelmente ele já saiu do grupo."
        },
        banirtodos:{
            banir_sucesso: '🤖✅ Todos banidos com sucesso!'
        },
        promover:{
            cmd_erro: "[❗] Marque o membro que será promovido *!promover* @membro",
            limite_membro: "[❗] Apenas 1 pessoa por vez",
            admin: "[❗] Esta pessoa já é um administrador.",
            sucesso: "✅ Sucesso! O membro @{p1} virou ADMINISTRADOR."
        },
        rebaixar:{
            cmd_erro: "[❗] Marque o admin que você quer rebaixar *!rebaixar* @admin",
            limite_membro: "[❗] Apenas 1 pessoa por vez",
            admin: "[❗] Esta pessoa não é um administrador.",
            sucesso: "✅ Sucesso! O membro @{p1} foi rebaixado para MEMBRO."
        },
        voteban:{
            sem_votacao: "[❗] Não existe votação aberta neste grupo.",
            ja_votou: "[❗] Qual foi mané, tentando votar mais de uma vez?",
            erro_ban: "[❗] Houve um erro para expulsar esse membro. Provavelmente o otário saiu do grupo antes.",
            erro_botadmin : "[❗] Não foi possível banir, o bot não tem permissões administrativas. Votação encerrada!",
            ja_aberto: "[❗] Já existe uma votação em aberto neste grupo, veja em *!votacao*",
            membro_ja_aberto: "[❗] Uma votação para este membro já foi aberta.",
            erro_mencao: "[❗] Você deve mencionar 1 membro",
            erro_num_votos: "[❗] Quantidade de votos deve ser em número",
            limit_num_votos: "[❗] Número máximo de votos deve ser entre 3 e 30.",
            cmd_erro : "[❗] Você deve digitar : \n\nPara abrir votação : *!vb on @membro max-votos*\nPara fechar votação: *!vb off*",
            erro_dono: "[❗] Você não pode iniciar votação no dono do grupo ou no bot.",
            votacao_resposta: "🗳️ Atualmente existe um membro em votação : @{p1}\n\nDigite *!votar* para votar nestre membro.",
            voto_sucesso: "[VOTE BAN] ✅ Olá @{p1}, você votou com sucesso no membro em votação @{p2}. ({p3}/{p4} Votos)",
            ban_resposta: "[VOTE BAN] ✅ O membro @{p1} que estava em votação foi banido com sucesso. VIVA A DEMOCRACIA!",
            votacao_aberta_resposta: "[VOTE BAN] 🗳️ Uma votação foi aberta para expulsar o membro @{p1}. (0/{p2} Votos)\n\n"+
            "O comando *!votar* foi habilitado.",
            votacao_encerrada_resposta: "[VOTE BAN] 🗳️ A votação para expulsar @{p1} foi encerrada."
        },
        contador:{
            cmd_erro: "[❗] Você deve digitar *!contador on|off*",
            ja_ligado: "[❗] O recurso de contador já está *ligado*",
            ja_desligado: "[❗] O recurso de contador já está *desligado*",
            ligado: "✅ O recurso de contador foi ligado com sucesso",
            desligado: "✅ O recurso de contador foi desligado com sucesso",
            recarregar_contagem: "✓ Todas as contagens foram recarregadas e novos membros foram adicionados/removidos.",
            grupo_nao_registrado: "O grupo {p1} ainda não está registrado"
        },
        alterarcont:{
            cmd_erro: "[❗] Você deve responder alguém com *!alterarcont [qtd]* ou marcar uma pessoa após o comando.",
            num_invalido: "[❗] Quantidade de mensagens é inválida.",
            erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
            fora_grupo: "[❗] Não é possível alterar a contagem de quem não está no grupo.",
            sucesso: "✅ A contagem do usuário foi definida com sucesso"
        },
        atividade:{
            erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
            bot_erro: "[❗] Não é possível ver a atividade do bot.",
            fora_grupo: "[❗] Não é possível ver a atividade de quem não está no grupo.",
            resposta: "🤖 *Atividade do usuário* 🤖\n\n"+
            "📱 *Total de mensagens* : {p1}\n"+
            "═════════════════\n"+
            "🔤 Textos enviados : {p2}\n"+
            "📸 Imagens enviadas : {p3}\n"+
            "🎥 Videos enviados : {p4}\n"+
            "🖼️ Figurinhas enviadas : {p5}\n"+
            "🎙️ Gravaçôes enviadas : {p6}\n"+
            "🎧 Arquivo de aúdio enviados : {p7}\n"+
            "🧩 Outros : {p8}\n"
        },
        minativos:{
            cmd_erro: "[❗] Você deve digitar *!minativos 1-50*.",
            erro_qtd: "[❗] A quantidade mínima de mensagens não é um número válido.",
            limite_qtd: "[❗] A quantidade mínima de mensagens deve ser entre [1-50]",
            erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
            sem_inativo: "✅ Não existe membros inativos neste grupo.",
            resposta_titulo: "╔══✪〘🤖 Marcando todos que tem menos de {p1} mensagens〙\n\n"+
            "👤 *Membros inativos* : {p2}\n",
            resposta_itens: "╠➥ @{p1} - *{p2}* Msgs\n"
        },
        binativos:{
            cmd_erro: "[❗] Você deve digitar *!binativos 1-50*.",
            erro_qtd: "[❗] A quantidade mínima de mensagens não é um número válido.",
            limite_qtd: "[❗] A quantidade mínima de mensagens deve ser entre 1 e 50",
            erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
            sucesso: "🤖✅ {p1} Membros com menos de {p2} mensagens foram banidos.",
            sem_inativo: "✅ Não existe membros inativos neste grupo."
        },
        topativos:{
            cmd_erro: "[❗] Você deve digitar *!topativos 1-50*.",
            erro_qtd: "[❗] A quantidade de pessoas não é um número válido.",
            limite_qtd: "[❗] A quantidade de pessoas deve ser entre 1 e 50",
            erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
            resposta_titulo: "╔══✪〘🏆 TOP {p1} ATIVOS 🏆 〙\n╠\n",
            resposta_itens: "╠➥ {p1} {p2}° Lugar @{p3} - *{p4}* Msgs\n"
        },
        enquete:{
            cmd_erro:"[❗] Você deve digitar :\n *!enquete pergunta,opcao1,opcao2,opcao3...* para abrir enquete\n*!enquete off* para encerrar enquete",
            ja_aberta: "[❗] Já existe uma enquete aberta, confira no *!verenquete*",
            min_opcao: "[❗] A enquete precisa de no mínimo 2 opçôes",
            aberta: "✅ A enquete foi aberta com sucesso, digite *!verenquete* para vê-la",
            ja_fechada: "[❗] Não existe enquete aberta no grupo para ser encerrada.",
            fechada: "✅ A enquete foi encerrada com sucesso, obtendo os resultados.",
            resultado_titulo: "[ 📋 RESULTADO DA ENQUETE 📋]\n\n"+
            "❔ Pergunta : *{p1}* \n\n",
            resultado_itens: "▫️ Opção {p1} -> {p2} - *{p3}* Votos \n\n"
        },
        verenquete:{
            sem_enquete: "[❗]  Não existe enquete aberta no grupo para ser votada.",
            resposta_titulo: "[📋 ENQUETE ATUAL 📋]\n\n"+
            "❔ Pergunta : *{p1}* \n\n",
            resposta_itens: "▫️ !votarenquete *{p1}* --> {p2} \n\n",
            resposta_inferior: "Para votar digite *!votarenquete numero-opcao*"
        },
        votarenquete:{
            cmd_erro:"[❗] Você deve digitar : *!votarenquete numero-opcao*",
            sem_enquete: "[❗]  Não existe enquete aberta no grupo para ser votada.",
            opcao_erro: "[❗] A opção escolhida não é um número válido",
            ja_votou: "[❗] Você já votou seu filhote de chocadeira!",
            opcao_invalida: "[❗] A opção que você escolheu não existe",
            sucesso: "✅ Seu voto foi contabilizado com sucesso."
        },
        bcmd:{
            cmd_erro: "[❗] Você deve digitar *!bcmd* e os comandos separados por vírgula.",
            resposta_titulo: "[🤖 *Bloquear comandos* 🤖]\n\n",
            resposta_variavel: {
                ja_bloqueado: "- Comando *{p1}* já está bloqueado.\n",
                bloqueado_sucesso: "- Comando *{p1}* bloqueado com sucesso.\n",
                comando_admin: "- Comando *{p1}* não pode ser bloqueado (Comando ADMIN).\n",
                nao_existe: "- Comando *{p1}* não existe.\n"
            },
            resposta_cmd_bloqueado : "[❗] O comando *{p1}* está temporariamente bloqueado neste grupo pelo administrador."
        },
        dcmd:{
            cmd_erro: " [❗] Você deve digitar *!dcmd* e os comandos separados por vírgula.",
            resposta_titulo: "[🤖 *Desbloquear Comandos* 🤖]\n\n",
            resposta_variavel: {
                desbloqueado_sucesso: "- Comando *{p1}* foi desbloqueado.\n",
                ja_desbloqueado: "- Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
            }
        },
        link:{
            resposta: "\nLink do grupo : *{p1}*"
        },
        adms:{
            resposta_titulo: "🤖 Lista de administradores :\n\n",
            resposta_itens: "➸ @{p1}\n"
        },
        mt:{
            resposta_titulo_comum: "╔══✪〘🤖 Marcando Todos 〙✪══\n",
            resposta_titulo_variavel: "╔══✪〘{p1}〙✪══\n",
            resposta_itens: "╠➥ @{p1}\n"
        },
        dono:{
            resposta: "🤖 O Dono do grupo é : @{p1}"
        },
        apagar:{
            cmd_erro: "[❗] Erro! Responda a mensagem do bot com  *!apg*",
            minha_msg: "[❗] Erro! O bot não pode apagar mensagem de outros membros.",
            nao_recente: "[❗] A mensagem que você quer apagar não é recente"
        },
        fechar:{
            cmd_erro: "[❗] Erro! Digite com  *!f on/off*",
        },
        rlink:{
            erro: "[❗] Houve um erro na redefinição de link",
            sucesso : "✅ Link foi redefinido com sucesso"
        }
    },
    diversao: {
        viadometro: {
            respostas: [' 0%\n\n - ESSE É MACHO ',
           '██                 20% \n\n - HMMMMM ',
           '████             40%\n\n - JÁ MAMOU O PRIMO',
           '██████         60%\n\n - EITA MAMOU O BONDE',
           '████████     80%\n\n - JÁ SENTOU EM ALGUEM',
           '██████████ 100%\n\n - BIXONA ALERTA VERMELHO CUIDADO COM SEUS ORGÃOS SEXUAIS'],
            cmd_erro: "[❗] Erro! Você deve responder a alguém com  *!viadometro*",
            apenas_um: "[❗] Erro! Apenas um membro por vez deve ser mencionado.",
            resposta: "🧩 *VIADÔMETRO* - {p1}"
        },
        gadometro:{
            respostas : [' 0%\n\n - ESSE NÃO É GADO ',
            '🐃 20% \n\n - GADO APRENDIZ, TÁ NO CAMINHO ',
            '🐃🐃 40%\n\n - GADO INTERMEDIÁRIO, JÁ INVADE PV DE UMAS E PENSA EM PAGAR PACK DE PEZINHO',
            '🐃🐃🐃 60%\n\n - CUIDADO! GADO EXPERIENTE, INVADE PV E FALA LINDA EM TODAS FOTOS',
            '🐃🐃🐃🐃 80%\n\n - ALERTA! GADO MASTER, SÓ APARECE COM MULHER ON',
            '🐃🐃🐃🐃🐃 100%\n\n - PERIGO! GADO MEGA BLASTER ULTRA PAGA BOLETO DE MULHER QUE TEM NAMORADO'],
            cmd_erro: "[❗] Você deve mencionar alguém com o !gadometro ou responder alguma mensagem.",
            apenas_um: "[❗] Erro! Apenas um membro por vez deve ser mencionado.",
            resposta: "🧩 *GADÔMETRO* - {p1}"
        },
        bafometro:{
            respostas : [' 0%\n\n - ESTÁ SÓBRIO ',
            '🍺  20% \n\n - TOMOU UM GORÓZINHO ',
            '🍺🍺  40%\n\n - JÁ TÁ FICANDO MEIO CHAPADO E FALANDO BOSTA',
            '🍺🍺🍺  60%\n\n - TÁ MAMADO E COMEÇANDO A FAZER MERDA',
            '🍺🍺🍺🍺  80%\n\n - TÁ LOUCÃO NEM CONSEGUE DIFERENCIAR MULHER E HOMEM',
            '🍺🍺🍺🍺🍺  100%\n\n - ALERTA! ESTÁ FORA DE SI , BEIJANDO MENDIGO E CACHORRO DE RUA'],
            cmd_erro: "[❗] Você deve mencionar alguém com o !bafometro ou responder alguma mensagem.",
            apenas_um: "[❗] Erro! Apenas um membro por vez deve ser mencionado.",
            resposta: "🧩 *BAFÔMETRO* - {p1}"
        },
        detector: {
            cmd_erro: "[❗] Erro! Você deve responder a alguém com  *!detector*",
            espera: "⏳ Calibrando a máquina da verdade"
        },
        caracoroa:{
            espera: "🤜🪙 Lançando a moeda..",
            resposta: "🪙 O resultado é *{p1}*"
        },
        ppt:{
            cmd_erro: "[❗] Você deve digitar *!ppt* [*pedra*, *papel* ou *tesoura*]",
            opcao_erro: "[❗] Você deve escolher entre *pedra*, *papel*  ou *tesoura*",
            resposta : {
                vitoria: "🧩 Você venceu! Você escolheu {p1} e o bot escolheu {p2}",
                derrota: "🧩 Você perdeu! Você escolheu {p1} e o bot escolheu {p2}",
                empate: "🧩 Um empate! Você escolheu {p1} e o bot escolheu {p2}"
            }
        },
        roletarussa:{
            espera: "🎲 Sorteando uma vítima 🎲",
            resposta: "🔫 Você foi o escolhido @{p1}, até a próxima!"
        },
        casal:{
            resposta: "👩‍❤️‍👨 Está rolando um clima entre @{p1} e @{p2}"
        },
        top5:{
            cmd_erro: "[❗] Você deve digitar !top5 [tema]",
            erro_membros: "[❗] O grupo deve ter no mínimo 5 membros para usar este comando.",
            resposta_titulo: "╔══✪〘🏆 TOP 5 {p1} 🏆 〙\n╠\n",
            resposta_itens: "╠➥ {p1} {p2}° Lugar @{p3}\n"
        },
        fch:{
            resposta: "🧩〘*FRASES CONTRA A HUMANIDADE*〙\n\n - {p1}"
        },
        par:{
            cmd_erro: "[❗] Você deve marcar 2 pessoas",
            respostas: [' *0%*\n - NÃO COMBINAM ',
            '❤️ *20%* \n - HMMM TALVEZ ',
            '❤️❤️ *40%*\n - PODE ROLAR ALGO SÉRIO', 
            '❤️❤️❤️ *60%*\n - UIA ESSES DOIS TEM FUTURO',
            '❤️❤️❤️❤️ *80%*\n - ESSES DOIS TEM QUÍMICA, TALVEZ UM CASAMENTO EM BREVE', 
            '❤️❤️❤️❤️❤️ *100%*\n - CASAL PERFEITO! PREPAREM-SE PARA VIVER ATÉ A VELHICE JUNTOS',
            ],
            resposta: "👩‍❤️‍👨 PAR - @{p1} & @{p2}\n\n{p3}"
        }
    },
    admin: {
        entrar_grupo:{
            cmd_erro: "[❗] Inválido *!entrargrupo link-grupo*\n\nEx: *!entrargrupo* https://chat.whatsapp.com/H7CIdeyyb5UGLbYqxu18Fs",
            chave_invalida: "[❗] Sua chave é inválida, peça ao dono do BOT uma chave válida!",
            link_invalido: "[❗] Isso não é um link válido! 👊🤬",
            maximo_grupos: "[❗] O bot já está com o número máximo de grupos!",
            minimo_membros: "[❗] O grupo precisa de no mínimo 5 membros.",
            entrar_sucesso: "🤖✅ Entendido, entrarei em breve no grupo."
        },
        infocompleta:{
            resposta_superior:"*Criador do Bot* : {p1}\n"+
            "*Criado em* : {p2}\n"+
            "*Nome do bot* : {p3}\n"+
            "*Online desde* : {p4}\n"+
            "*Versão* : {p5}\n"+
            "*GitHub* : https://github.com/Victorsouza02/lbot-whatsapp\n",
            resposta_variavel:{
                limite_diario: {
                    on: "*Limite diário* : ✅\n"+
                    "- *{p1}* Cmds/dia por usuário\n"+
                    "- Reseta *{p2}/{p3}/{p4} às {p5}:{p6}:{p7}*\n",
                    off: "*Limite diário* : ❌\n"
                },
                taxa_comandos:{
                    on: "*Taxa máxima comandos/minuto* : ✅\n "+
                    "- *{p1}* Cmds/minuto por usuário\n"+
                    "- Tempo de bloqueio : *{p2}* segundos\n",
                    off: "*Taxa máxima comandos/minuto* : ❌\n"
                },
                limitarmsgs:{
                    on: "*Taxa máxima de mensagens privadas* : ✅\n"+
                    "- *{p1}* Msgs a cada *{p2}* s por usuário\n",
                    off: "*Taxa máxima de mensagens privadas* : ❌\n"
                },
                bloqueiocmds:{
                    on: "*Bloqueio de comandos* : ✅ *{p1}*\n",
                    off: "*Bloqueio de comandos* : ❌\n"
                }
            },
            resposta_inferior:"*Quantidade de pessoas bloqueadas* : *{p1}* pessoas\n"+
            "*Comandos executados* : *{p2}* Cmds\n"+
            "*Contato do criador* : wa.me/{p3}\n"
        },
        env:{
            cmd_erro: "[❗] Você deve digitar a api e a chave (sem [ ]) que você deseja utilizar depois de *!env*\n"+
            "ex: *!env removebg [chave]* - Edita chave do RemoveBG\n"+
            "ex: *!env newsorg [chave]* - Edita chave do NewsORG\n"+
            "ex: *!env rapidapi [chave]* - Edita chave do RapidAPI\n"+
            "ex: *!env twitter [twitter_consumer_key] [twitter_consumer_secret] [twitter_access_token] [twitter_access_token_secret]* - Edita as chaves do Twitter",
            chave_erro: "[❗] Você deve digitar a(s) chave(s) que você deseja utilizar",
            resposta: "⚙️ Reinicie o BOT para que as alterações tenham efeito",
        },
        listablock:{
            resposta_titulo: "🤖 Esse é o total de pessoas bloqueadas \nTotal : {p1}\n",
            resposta_itens: "➸ @{p1}\n",
        },
        bloquear:{
            cmd_erro: "[❗] Marque o membro que será bloqueado*!bloquear* @membro ou responda ele com *!bloquear*",
            erro_dono: "[❗] O Usuário @{p1} é dono do BOT, não foi possivel bloquear.",
            ja_bloqueado: "[❗] O Usuário @{p1} já está *bloqueado*.",
            sucesso: "✅ O Usuário @{p1} foi *bloqueado* com sucesso"
        },
        desbloquear:{
            cmd_erro: "[❗] Marque o membro que será desbloqueado*!desbloquear* @membro ou responda ele com *!desbloquear*",
            ja_desbloqueado: "[❗] O Usuário @{p1} já está *desbloqueado*.",
            sucesso: "✅ O Usuário @{p1} foi *desbloqueado* com sucesso"
        },
        desligar:{
            sucesso: "🤖✅ Entendido, o BOT será desligado"
        },
        bc:{
            cmd_erro: "[❗] Erro! Você deve digitar *!bc [mensagem]* ",
            anuncio: "[🤖 LBOT® - Mensagem para todos]\n\n"+
            "{p1}",
            bc_sucesso: "🤖✅ Anúncio feito com sucesso."
        },
        mudarlimite: {
            cmd_erro: "[❗] Você deve digitar *!mudarlimite novo-limite*",
            invalido: "[❗] O número para definir o limite de comandos é inválido",
            erro_limite_diario: "[❗] Este comando só pode ser usado com o *!limitediario* ativado.",
            sucesso: "✅ O limite diário de todos os usuários foi definido para {p1} comandos/dia "
        },
        tipo: {
            cmd_erro: "[❗] Você deve responder algúem com *!cargo membro|admin* ou mencionar alguém após o comando",
            tipo_dono: "[❗] Não é possivel alterar cargo do dono",
            tipos_disponiveis: "[❗] Você deve escolher o tipo da conta entre 'comum' ou 'vip'",
            nao_registrado: "[❗] Este usuário ainda não está registrado",
            sucesso: "✅ O tipo desse usuário foi definido para {p1}"
        },
        limparvip:{
            sucesso: "✅Todos os VIP foram convertidos para COMUM"
        },
        bcmdglobal:{
            cmd_erro: "[❗] Você deve digitar *!bcmdglobal* e os comandos separados por vírgula.",
            resposta_titulo: "[🤖 *Bloquear comandos - Global* 🤖]\n\n",
            resposta_variavel: {
                ja_bloqueado: "- Comando *{p1}* já está bloqueado.\n",
                bloqueado_sucesso: "- Comando *{p1}* bloqueado com sucesso.\n",
                comando_admin: "- Comando *{p1}* não pode ser bloqueado (Comando ADMIN).\n",
                nao_existe: "- Comando *{p1}* não existe.\n"
            },
            resposta_cmd_bloqueado : "[❗] O comando *{p1}* está indisponível no momento, tente novamente mais tarde."
        },
        dcmdglobal:{
            cmd_erro: " [❗] Você deve digitar *!dcmdglobal* e os comandos separados por vírgula.",
            resposta_titulo: "[🤖 *Desbloquear Comandos - Global* 🤖]\n\n",
            resposta_variavel: {
                desbloqueado_sucesso: "- Comando *{p1}* foi desbloqueado.\n",
                ja_desbloqueado: "- Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
            }
        },
        limitediario:{
            cmd_erro: "[❗] Você deve inserir *!limitediario on|off qtd-comandos*",
            ja_ativado: "[❗] O limite diário de comandos já está ativado",
            qtd_invalida: "[❗] A quantidade de comandos por dia está inválida",
            ativado: "✅ O Limite diário de comandos foi ativado com sucesso",
            ja_desativado: "[❗] O limite diário de comandos já está desativado",
            desativado: "✅ O Limite diário de comandos foi desativado com sucesso",
            resposta_excedeu_limite: "[❗] {p1} -> Você ultrapassou seu limite diário de {p2} comandos por dia."

        },
        limitecomandos:{
            cmd_erro: "[❗] Você deve inserir *!limitador on|off qtd-max-minuto tempo-bloqueio*",
            ja_ativado: "[❗] O limitador de comandos já está ativado",
            qtd_invalida: "[❗] A quantidade máxima de mensagens por minuto está inválida",
            tempo_invalido: "[❗] O tempo de bloqueio de mensagens está inválido",
            ativado: "✅ O Limitador de comandos por minuto foi ativado com sucesso",
            ja_desativado: "[❗] O limitador de comandos já está desativado",
            desativado: "✅ O Limitador de comandos por minuto foi desativado com sucesso",
            resposta_usuario_limitado: "[❗] Você está impossibilitado de mandar comandos por *{p1}* segundos, pega leve cara."
        },
        limitarmsgs:{
            cmd_erro: "[❗] Você deve inserir *!limitarmsgs on|off qtd-mensagens intervalo-segundos*",
            ja_ativado: "[❗] O limitador de mensagens privadas já está ativado",
            qtd_invalida: "[❗] A quantidade máxima de mensagens privadas está inválida",
            tempo_invalido: "[❗] O intervalo de mensagens está inválido",
            ativado: "✅ O Limitador de mensagens privadas foi ativado com sucesso",
            ja_desativado: "[❗] O Limitador de mensagens privadas já está desativado",
            desativado: "✅ O Limitador de mensagens privadas foi desativado com sucesso",
            resposta_usuario_bloqueado: "[❗]  *Você foi bloqueado devido ao excesso de mensagens, fale com o dono se houve algum engano.*"
        },
        r: {
            cmd_erro: "[❗] Você deve responder algúem com *!r* ou mencionar alguém após o comando",
            sucesso: "✅ Os comandos diários desse usuário foram resetados",
            nao_registrado: "[❗] Este usuário ainda não está registrado",
            erro_limite_diario: "[❗] Este comando só pode ser usado com o *!limitediario* ativado."
        },
        rtodos:{
            sucesso: "✅ Os comandos diários de todos os usuários foram resetados",
            erro_limite_diario: "[❗] Este comando só pode ser usado com o *!limitediario* ativado."
        },
        verdados:{
            cmd_erro: "[❗] Você deve responder algúem com *!verdados* ou mencionar alguém após o comando",
            nao_registrado: "[❗] Este usuário ainda não está registrado",
            resposta_superior: "[🤖*VER DADOS DE USO*🤖]\n\n"+
            "Nome : *{p1}*\n"+
            "Tipo de usuário : *{p2}*\n"+
            "Numero Usuário : *{p3}*\n",
            resposta_variavel: {
                limite_diario: {
                    on:"Comandos usados hoje : *{p1}/{p2}*\n"+
                    "Limite diário : *{p3}*\n",
                    off: ""
                }
            },
            resposta_inferior: "Total de comandos usados : *{p1}* comandos\n"
        },
        vervips:{
            sem_vips: "[❗] Não existe usuários VIP's no momento",
            resposta_titulo: "[⭐ USUÁRIOS VIP's ⭐]\n\n",
            resposta_itens: "➸ ⭐ {p1}  @{p2} - {p3} Cmds\n"
        },
        rconfig:{
            reset_sucesso: "🤖✅ As configurações dos grupos foram resetadas com sucesso"
        },
        bcgrupos:{
            cmd_erro: "[❗] Erro! Você deve digitar *!bcgrupos [mensagem]* ",
            anuncio: "[🤖LBOT® - Mensagem para os grupos]\n\n"+
            "{p1}",
            bc_sucesso: "🤖✅ Anúncio feito com sucesso."
        },
        sair:{
            sair_sucesso: "🤖✅ FLW VLW.",
        },
        sairtodos:{
            sair_sucesso: "🤖✅ Saí de todos os grupos com sucesso.",
            resposta: "🤖 Estou saindo dos grupos, total de grupos : {p1}"
        },
        limpar:{
            limpar_sucesso : "🤖✅ Todos os chats foram limpos.",
        },
        estado:{
            cmd_erro: "[❗] Digite o estado atual do bot com *!estado online|offline|manutencao*",
            sucesso: "🤖✅ Seu estado foi alterado com sucesso."
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
    api: {
        rapidapi: "Houve um erro na API do RAPIDAPI (Pesquisas), confira se o limite gratuito da chave excedeu ou se ela está configurada.",
        removebg: "Houve um erro na API de remover fundo, confira se o limite gratuito da chave excedeu ou se ela está configurada.",
        twitter: "Houve um erro na API do Twitter, confira se o limite gratuito da chave excedeu ou se ela está configurada.",
        newsapi: "Houve um erro na API de Notícias, confira se o limite gratuito da chave excedeu ou se ela está configurada."
    }
}


exports.msgs_texto = msgs_texto
