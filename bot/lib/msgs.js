export const obterMensagensTexto = (botInfo)=>{
    let {prefixo, nome_adm, nome_bot} = botInfo
    return {
        inicio:{
            inicializando: 'Inicializando o BOT na versão v{p1}...',
            dados_bot: "✓ Obteve dados do BOT",
            servidor_iniciado: '✓ Servidor iniciado!',
            grupos_carregados: '✓ Todos os grupos foram carregados e atualizados.',
        },
        geral: {
            dono_cadastrado: `✅ Seu número foi cadastrado como DONO, agora você pode utilizar os comandos de ${prefixo}admin`,
            usuario_novo: "[ 🤖 Boas Vindas ao {p1} 🤖]\n\n"+
            `👋 Olá {p2}, vi que você é um usuário novo para abrir o menu de comandos digite *${prefixo}menu*`,
            entrada_grupo: "Saudações *{p1}* , se tiverem alguma dúvida só digitar "+`*${prefixo}menu*`,
            cmd_erro: "[❗] Ops, parece que você usou o comando *{p1}* incorretamente ou não sabe como utilizá-lo. Quer aprender a usar?\n\n Digite :\n  - Ex: *{p2} guia* para ver o guia.",
            erro_comando_codigo: "[❗] Houve um erro no comando *{p1}*, relate ao administrador ou tente novamente mais tarde.",
            erro_api : "[❗] Houve um erro no comando *{p1}*.\n\n"+
            "Motivo: *{p2}*\n",
            resposta_ban : "🤖✅ Entendido, +{p1} será banido.\n\n"+
            "Motivo : {p2}\n"+
            "Quem baniu : {p3}",
            fila_comando: "⏳ O bot está atendendo muitas pessoas ao mesmo tempo, tenha paciência!\n\n"+
            "Atualmente existem *{p1}* comandos na fila de espera.",
            visualizacao_unica: "[❗] Por privacidade do grupo não foi possivel usar o seu comando em uma mensagem de visualização única. Este recurso só está disponível em mensagens privadas.",
            desconectado:{
                comando: "A conexão com o WhatsApp foi encerrada pelo comando do Administrador.",
                falha_grave: "A conexão com o WhatsApp foi encerrada devido a uma falha grave no código.",
                deslogado: "A sua sessão com o WhatsApp foi deslogada, leia o código QR novamente.",
                reiniciar: "A sua conexão com o WhatsApp precisa ser reiniciada, tentando reconectar...",
                conexao: "A sua conexão com o WhatsApp foi encerrada, tentando reconectar... Motivo : {p1} - {p2}"
            }
        },
        info: {
            ajuda:{
                resposta_comum: "Olá, *{p1}*\n"+
                "Tipo de Usuário : *{p2}*\n"+
                "Comandos feitos : *{p3}*\n",
                resposta_limite_diario: "Olá, *{p1}*\n"+
                "Limite diário : *{p2}/{p3}*\n"+
                "Tipo de Usuário : *{p4}*\n"+
                "Comandos feitos : *{p5}*\n"
            },
            info:{
                resposta: "*Criador do Bot* : {p1}\n"+
                "*Nome do bot* : {p2}\n"+
                "*Online desde* : {p3}\n"+
                "*Comandos executados* : {p4}\n"+
                "*Contato do criador* : wa.me/{p5}\n"+
                "*Versão atual* : {p6}\n"+
                "*GitHub* : https://github.com/victorsouzaleal/lbot-whatsapp\n"
            },
            meusdados:{
                resposta_geral: "[🤖*SEUS DADOS DE USO*🤖]\n\n"+
                "Tipo de usuário : *{p1}*\n"+
                "Nome : *{p2}*\n"+
                "Total de comandos usados : *{p3}* comandos\n",
                resposta_limite_diario: "Comandos usados hoje : *{p1}/{p2}*\n"+
                "Limite diário : *{p3}*\n",
                resposta_grupo: "Mensagens neste grupo : *{p1}* mensagens\n",
            },
            reportar:{
                sucesso: `✅ Obrigado, seu problema foi reportado com sucesso e será analisado pelo dono.`,
                erro: '[❗] Não foi possível enviar a mensagem para o dono, pois ele ainda não está cadastrado.',
                resposta: "[ 🤖 REPORTAR ⚙️]\n\n"+
                "*Usuário* : {p1}\n"+
                "*Contato* : http://wa.me/{p2}\n"+
                "*Problema* : {p3}\n"
            }
        },
        figurinhas: {
            sticker:{
                video_invalido : '[❗] Envie um video/gif com no máximo 8 segundos.',
            },
            ssf:{
                espera: `[AGUARDE] 📸 O fundo da imagem está sendo removido e o sticker será enviado em breve.`,
                erro_imagem: `[❗] Este comando é válido apenas para imagens.`
            },
            tps:{
                texto_longo : "[❗] Texto é muito longo, no máximo 30 caracteres. ",
                espera: "⏳ Em andamento , estou transformando seu texto em sticker."
            },
            atps:{
                texto_longo : "[❗] Texto é muito longo, no máximo 30 caracteres. ",
                espera: "⏳ Em andamento , estou transformando seu texto em sticker animado."
            },
        },
        downloads: {
            play:{
                espera: "[AGUARDE] 🎧 Sua música está sendo baixada e processada.\n\n"+
                "Titulo: *{p1}*\n"+
                "Duração: *{p2}*",
                limite: "[❗] A música deve ter menos de *5 minutos*",
                erro_live: "[❗] Houve um erro de download, o bot não aceita download de lives."
            },
            yt:{
                espera: "[AGUARDE] 🎥 Seu video está sendo baixado e processado.\n\n"+
                "Titulo: *{p1}*\n"+
                "Duração: *{p2}*",
                limite: "[❗] O video deve ter menos de *5 minutos*",
                erro_live: "[❗] Houve um erro de download, o bot não aceita download de lives."
            },
            fb: {
                espera: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                "Titulo: *{p1}*\n"+
                "Duração: *{p2}*",
                limite: "[❗] O video deve ter menos de *3 minutos*",
            },
            ig: {
                espera: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.",
            },
            tk: {
                espera: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.\n\n"+
                "Perfil: *@{p1}*\n"+
                "Descrição: *{p2}*\n",
            },
            tw:{
                espera: "[AGUARDE] 🎬 Sua mídia está sendo baixada e processada.",
            },
            img : {
                erro_imagem: '[❗] Não foi possível obter nenhuma imagem, tente novamente.',
            }
        },
        utilidades:{
            gpt:{
                resposta: "🤖 Chat GPT v3 :\n\n"+
                "{p1}"
            },
            criarimg:{
                espera: '[AGUARDE] 📸 Sua imagem está sendo gerada pela IA, pode levar entre 20-40s.',
            },
            rbg:{
                invalido: "[❗] Este comando só funciona com IMAGENS.",
                espera: "[AGUARDE] 📸 O fundo da imagem está sendo removido.",
            },
            tabela:{
                resposta: "🤖 Tabela de Nicks :\n\n"+
                "{p1}"
            },
            rastreio:{
                codigo_invalido : '[❗] Código de rastreio deve ter 13 digitos.',
                resposta_titulo: "📦📦*RASTREIO*📦📦\n\n",
                resposta_itens: "Status : {p1}\n"+
                "Data : {p2}\n"+
                "Hora : {p3}\n"+
                "{p4}\n"
            },
            audio: {
                erro_conversao: "[❗] Houve um erro na conversão de audio"
            },
            ouvir:{
                erro_limite: "[❗] Houve um erro na transcrição, o áudio ultrapassa *1m30s*",
                sucesso: "🔤 Transcrição de áudio :\n\n"+
                "-- {p1}"
            },
            qualmusica:{
                espera: "⏳ Em andamento , estou procurando sua música.",
                resposta: "💿 Reconhecimento de Música\n\n"+
                "Título: *{p1}*\n"+
                "Produtora: {p2}\n"+
                "Duração : *{p3}*\n"+
                "Lançamento: *{p4}*\n"+
                "Album: *{p5}*\n"+
                "Artistas: *{p6}*\n",
            },
            anime:{
                espera: "⏳ Estou processando a imagem e pesquisando o anime.",
                similaridade: "[❗] Nível de similaridade é muito baixo, certifique se enviar uma cena VÁLIDA de anime (Não funciona com imagens não oficiais, Wallpapers ou imagens recortadas e/ou baixa qualidade).",
                resposta: "〘 Pesquisa de anime 〙\n\n"+
                "Título: *{p1}*\n"+
                "Episódio: {p2}\n"+
                "Tempo da cena: *{p3} - {p4}*\n"+
                "Similaridade: *{p5}%*\n"+
                "Prévia : {p6}",
            },
            voz : {
                texto_vazio : '[❗] Tu é idiota, cadê o texto do comando?',
                texto_longo: '[❗] Texto muito longo.',
                erro_audio: "[❗] Houve um erro na criação do áudio",
                nao_suportado: "[❗] Sem dados do idioma ou idioma não suportado. Atualmente suportamos :\n\n"+
                `- 🇧🇷 Português - ${prefixo}voz pt\n`+
                `- 🇺🇸 Inglês - ${prefixo}voz en\n`+
                `- 🇯🇵 Japonês - ${prefixo}voz ja\n`+
                `- 🇮🇹 Italiano - ${prefixo}voz it\n`+
                `- 🇪🇸 Espanhol - ${prefixo}voz es\n`+
                `- 🇷🇺 Russo - ${prefixo}voz ru\n`+
                `- 🇰🇷 Coreano - ${prefixo}voz ko\n`+
                `- 🇸🇪 Sueco - ${prefixo}voz sv\n`
            },
            traduz: {
                nao_suportado: "[❗] Sem dados do idioma ou idioma não suportado. Atualmente suportamos :\n\n"+
                `- 🇧🇷 Português - ${prefixo}traduz pt\n`+
                `- 🇺🇸 Inglês - ${prefixo}traduz en\n`+
                `- 🇯🇵 Japonês - ${prefixo}traduz ja\n`+
                `- 🇮🇹 Italiano - ${prefixo}traduz it\n`+
                `- 🇪🇸 Espanhol - ${prefixo}traduz es\n`+
                `- 🇷🇺 Russo - ${prefixo}traduz ru\n`+
                `- 🇰🇷 Coreano - ${prefixo}traduz ko\n`,
                resposta: "🔠 *Resposta - Tradução* 🔠 :\n\n"+
                "*Texto*: {p1}\n\n"+
                "*Tradução* : {p2}"
            },
            noticia:{
                resposta_titulo: "〘🗞️ ULTIMAS NOTÍCIAS 〙\n\n",
                resposta_itens: "➥ 📰 *{p1}* \n"+
                "Publicado por *{p2}* há *{p3}*\n"+
                "*Link* : {p4}\n\n"
            },
            ddd:{
                somente_br: "[❗] Esse comando só é aceito com números brasileiros.",
                resposta: "📱 Estado : *{p1}* / Região : *{p2}*"
            },
            clima:{
                resposta: {
                    clima_atual: "☀️ CLIMA ATUAL ☀️\n\n"+
                    "Nome : {p1}\n"+
                    "Estado : {p2}\n"+
                    "País : {p3}\n"+
                    "Horário atual : {p4}\n"+
                    "Temperatura atual : {p5}\n"+
                    "Sensação térmica : {p6}\n"+
                    "Condição : {p7}\n"+
                    "Vento : {p8}\n"+
                    "Umidade : {p9}\n"+
                    "Nuvens : {p10}\n\n",
                    previsao:  "🗓️ Previsão {p1} 🗓️\n\n"+
                    "Max : {p2}\n"+
                    "Min : {p3}\n"+
                    "Condição : {p4}\n"+
                    "Vento máximo : {p5}\n"+
                    "Chuva? {p6} de chance\n"+
                    "Neve? {p7} de chance\n"+
                    "Nível UV : {p8}\n\n"
                }
            },
            encurtar:{
                resposta : "✂️ ENCURTADOR DE LINKS ✂️\n\n"+
                "*Link :* {p1}\n"
            },
            upimg:{
                resposta : "🖼️ UPLOAD DE IMAGEM 🖼️\n\n"+
                "*Link :* {p1}\n"
            },
            filmes:{
                resposta : "🎬 TÊNDENCIAS DE FILMES 🎬\n\n"+
                "{p1}\n"
            },
            series:{
                resposta : "📺 TÊNDENCIAS DE SÉRIES 📺\n\n"+
                "{p1}\n"
            },
            letra:{
                resposta : "🎼 LETRA DE MÚSICA 🎼\n\n"+
                "Música : *{p1}*\n"+
                "Artista : *{p2}*\n\n"+
                "{p3}"
            },
            moeda:{
                resposta_completa: "💵 Conversão - *{p1} {p2}*\n"+
                "{p3}",
                resposta_item:"----------------------------\n"+ 
                "*Conversão* : {p1}\n"+
                "*Valor convertido* : *{p2}* {p3}\n"+
                "*Última atualização* : {p4}\n\n"
            },
            pesquisa: {
                resposta_titulo: "🔎 Resultados da pesquisa de : *{p1}*🔎\n\n",
                resposta_itens: "🔎 {p1}\n"+
                "*Link* : {p2}\n\n"+
                "*Descrição* : {p3}\n\n"
            },
            calc:{
                resposta: "🧮 O resultado é *{p1}* "
            }
        },
        grupo: {
            regras:{
                sem_descrição: "[❗] O grupo ainda não tem uma descrição."
            },
            bemvindo:{
                ligado: "✅ O recurso de boas vindas foi ativado com sucesso",
                desligado: "✅ O recurso de boas vindas foi desativado com sucesso",
                mensagem: "👋 Olá, @{p1}\n"+
                "Seja bem vindo(a) ao grupo *{p2}*\n\n"+
                "{p3}"+
                "Digite "+`*${prefixo}menu*`+" para ver os comandos."
            },
            status:{
                resposta_titulo: "[ 🤖 STATUS DO GRUPO 🤖 ]\n\n",
                resposta_variavel: {
                    bemvindo:{
                        on: "- Recurso Boas Vindas : ✅\n",
                        off: "- Recurso Boas Vindas : ❌\n"
                    },
                    mutar:{
                        on: "- Recurso Mutar : ✅\n",
                        off: "- Recurso Mutar : ❌\n"
                    },
                    autosticker:{
                        on: "- Recurso Auto-Sticker : ✅\n",
                        off: "- Recurso Auto-Sticker : ❌\n"
                    },
                    antilink:{
                        on: "- Recurso Anti-Link : ✅\n",
                        off: "- Recurso Anti-Link : ❌\n"
                    },
                    antifake:{
                        on: "- Recurso Anti-Fake : ✅\n"+
                        "   - *Liberados* : {p1}\n",
                        off: "- Recurso Anti-Fake : ❌\n"
                    },
                    antiflood:{
                        on: "- Recurso Anti-Flood : ✅\n"+
                        "   - Máx: *{p1}* msgs / *{p2}* s \n",
                        off: "- Recurso Anti-Flood : ❌\n"
                    },
                    contador:{
                        on: "- Recurso Contador : ✅\n"+
                        "   - {p1}\n",
                        off: "- Recurso Contador : ❌\n"
                    },
                    bloqueiocmds:{
                        on: "- Bloqueio de comandos : ✅\n"+
                        "   - *{p1}*\n",
                        off: "- Bloqueio de comandos : ❌\n"
                    },
                    listanegra: "- Lista Negra : *{p1}*\n"
                }
            },
            fotogrupo: {
                sucesso: "🤖✅ A foto do GRUPO foi alterada com sucesso.",
            },
            addlista: {
                sucesso: "✅ O número desse usuário foi adicionado á lista negra e será banido do grupo caso ainda esteja aqui.",
                bot_erro: "[❗] Calma, você não pode adicionar o BOT a lista negra.",
                admin_erro: "[❗] Calma, você não pode adicionar um ADMINISTRADOR a lista negra.",
                ja_listado: "[❗] Este usuário já está na lista negra.",
            },
            remlista: {
                sucesso: "✅ O número desse usuário foi removido da lista negra.",
                nao_listado: "[❗] Este usuário não está na lista negra.",
            },
            listanegra: {
                motivo: "Banido por estar na LISTA NEGRA",
                lista_vazia: "🤖 Não existe usuários na lista negra deste grupo.",
                resposta_titulo: "╔══✪〘❌ Lista Negra 〙✪══\n╠\n",
                resposta_itens: "╠➥ +{p1}\n"
            },
            antilink:{
                motivo: "Banido pelo ANTI-LINK",
                detectou: "🤖 Ei @{p1}, o ANTI-LINK está ativado e um possível link foi detectado na sua mensagem, ela foi apagada por segurança.",
                ligado: "✅ O recurso de ANTI-LINK foi ativado com sucesso",
                desligado: "✅ O recurso de ANTI-LINK foi desativado com sucesso"
            },
            autosticker:{
                ligado: "✅ O recurso de AUTO-STICKER foi ativado com sucesso",
                desligado: "✅ O recurso de AUTO-STICKER foi desativado com sucesso"
            },
            antifake:{
                motivo: "Banido pelo ANTI-FAKE",
                ligado: "✅ O recurso de ANTI-FAKE foi ativado com sucesso",
                desligado: "✅ O recurso de ANTI-FAKE foi desativado com sucesso"
            },
            mutar:{
                ligado: "✅ O recurso de MUTAR GRUPO foi ativado com sucesso",
                desligado: "✅ O recurso de MUTAR GRUPO foi desativado com sucesso"
            },
            antiflood:{
                max: "[❗] Escolha um valor entre 5-20 mensagens para o anti-flood.",
                intervalo: "[❗] Escolha um valor entre 10-60 segundos para o intervalo do anti-flood.",
                motivo: "Banido pelo ANTI-FLOOD",
                ligado: "✅ O recurso de ANTI-FLOOD foi ativado para *{p1}* mensagens a cada *{p2}* segundos.",
                desligado: "✅ O recurso de ANTI-FLOOD foi desativado com sucesso"
            },
            add:{
                add_erro: "[❗] O número +{p1} não pode ser adicionado. Provavelmente está com privacidade ativada, já está no grupo ou o grupo não aceita mais membros.",
                numero_invalido: "[❗] Houve um erro em adicionar o número {p1}, verifique se o número existe ou tente tirar o 9.",
            },
            banir:{
                banir_admin: "[❗] O bot não pode banir um administrador",
                motivo: "Banimento manual",
                banir_erro: "[❗] Não foi possível banir este membro, provavelmente ele já saiu do grupo."
            },
            banirtodos:{
                banir_sucesso: '🤖✅ Todos banidos com sucesso.'
            },
            promover:{
                erro_bot: "[❗] O BOT não pode ser promovido por ele mesmo.",
                sucesso_usuario: "➥ @{p1} virou *ADMINISTRADOR*.\n",
                erro_usuario: "➥ @{p1} já é um *ADMINISTRADOR*.\n",
                resposta: "[👤 PROMOVER MEMBROS 👤]\n\n"+
                "{p1}"
            },
            rebaixar:{
                erro_bot: "[❗] O BOT não pode ser rebaixado por ele mesmo.",
                sucesso_usuario: "➥ @{p1} virou *MEMBRO*.\n",
                erro_usuario: "➥ @{p1} já é um *MEMBRO*.\n",
                resposta: "[👤 REBAIXAR MEMBROS 👤]\n\n"+
                "{p1}"
            },
            contador:{
                ligado: "✅ O recurso de CONTADOR foi ligado com sucesso",
                desligado: "✅ O recurso de CONTADOR foi desligado com sucesso",
            },
            atividade:{
                erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
                fora_grupo: "[❗] Não é possível ver a atividade de quem não está no grupo.",
                resposta: "🤖 *Atividade do usuário* 🤖\n\n"+
                "📱 *Total de mensagens* : {p1}\n"+
                "═════════════════\n"+
                "🔤 Textos enviados : {p2}\n"+
                "📸 Imagens enviadas : {p3}\n"+
                "🎥 Videos enviados : {p4}\n"+
                "🖼️ Figurinhas enviadas : {p5}\n"+
                "🎧 Aúdios enviados : {p6}\n"+
                "🧩 Outros : {p7}\n"
            },
            minativos:{
                erro_qtd: "[❗] A quantidade mínima de mensagens não é um número válido.",
                limite_qtd: "[❗] A quantidade mínima de mensagens deve ser entre [1-50]",
                erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
                sem_inativo: "✅ Não existe membros inativos neste grupo.",
                resposta_titulo: "╔══✪〘🤖 Marcando todos que tem menos de {p1} mensagens〙\n\n"+
                "👤 *Membros inativos* : {p2}\n",
                resposta_itens: "╠➥ @{p1} - *{p2}* Msgs\n"
            },
            binativos:{
                erro_qtd: "[❗] A quantidade mínima de mensagens não é um número válido.",
                limite_qtd: "[❗] A quantidade mínima de mensagens deve ser entre 1 e 50",
                erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
                sucesso: "🤖✅ {p1} Membros com menos de {p2} mensagens foram banidos.",
                sem_inativo: "✅ Não existem membros inativos válidos para serem banidos."
            },
            topativos:{
                erro_qtd: "[❗] A quantidade de pessoas não é um número válido.",
                limite_qtd: "[❗] A quantidade de pessoas deve ser entre 1 e 50",
                erro_contador: "[❗] Este comando só funciona quando o contador está ativado.",
                resposta_titulo: "╔══✪〘🏆 TOP {p1} ATIVOS 🏆 〙\n╠\n",
                resposta_itens: "╠➥ {p1} {p2}° Lugar @{p3} - *{p4}* Msgs\n"
            },
            enquete:{
                min_opcao: "[❗] A enquete precisa de no mínimo 2 opçôes",
                aberta: "✅ A enquete foi aberta com sucesso",
            },
            bcmd:{
                resposta_titulo: "[🤖 *Bloquear comandos* 🤖]\n\n",
                resposta_variavel: {
                    ja_bloqueado: "- Comando *{p1}* já está bloqueado.\n",
                    bloqueado_sucesso: "- Comando *{p1}* bloqueado com sucesso.\n",
                    erro : "- Comando *{p1}* não pode ser bloqueado.\n",
                    nao_existe: "- Comando *{p1}* não existe.\n"
                },
                resposta_cmd_bloqueado : "[❗] O comando *{p1}* está temporariamente bloqueado neste grupo pelo administrador."
            },
            dcmd:{
                resposta_titulo: "[🤖 *Desbloquear Comandos* 🤖]\n\n",
                resposta_variavel: {
                    desbloqueado_sucesso: "- Comando *{p1}* foi desbloqueado.\n",
                    ja_desbloqueado: "- Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
                }
            },
            link:{
                resposta: "〘 Grupo : *{p1}* 〙\n\n"+
                "- Link : {p2}"
            },
            adms:{
                resposta_titulo: "〘 🤖 Marquei os *{p1}* admins 〙\n\n",
                mensagem: "Mensagem: *{p1}* \n\n",
                resposta_itens: "➸ @{p1}\n",
            },
            mt:{
                resposta: "〘 🤖 Marquei os *{p1}* membros/admins 〙\n",
                resposta_motivo: "〘 🤖 Marquei os *{p1}* membros/admins 〙\n\n"+
                "Mensagem: *{p2}*\n"
            },
            mm:{
                resposta: "〘 🤖 Marquei os *{p1}* membros 〙\n",
                resposta_motivo: "〘 🤖 Marquei os *{p1}* membros 〙\n\n"+
                "Mensagem: *{p2}*\n",
                sem_membros: "[❗] Não existem membros comuns para serem marcados.\n",
            },
            dono:{
                resposta: "🤖 O Dono do grupo é : @{p1}",
                sem_dono: "🤖 O Dono do grupo teve o número banido ou cancelado."
            },
            rlink:{
                erro: "[❗] Houve um erro na redefinição de link",
                sucesso : "✅ Link foi redefinido com sucesso"
            }
        },
        diversao: {
            simi:{
                resposta : `{p1} - 🐤 *SIMI* : \n\n`+
                `{p2}`,
            },
            viadometro: {
                respostas: [' 0%\n\n - ESSE É MACHO ',
                '██                 20% \n\n - HMMMMM ',
                '████             40%\n\n - JÁ MAMOU O PRIMO',
                '██████         60%\n\n - EITA MAMOU O BONDE',
                '████████     80%\n\n - JÁ SENTOU EM ALGUEM',
                '██████████ 100%\n\n - BIXONA ALERTA VERMELHO CUIDADO COM SEUS ORGÃOS SEXUAIS'],
                apenas_um: "[❗] Erro: Apenas um membro por vez deve ser mencionado.",
                resposta: "🧩 *VIADÔMETRO* - {p1}"
            },
            gadometro:{
                respostas : [' 0%\n\n - ESSE NÃO É GADO ',
                '🐃 20% \n\n - GADO APRENDIZ, TÁ NO CAMINHO ',
                '🐃🐃 40%\n\n - GADO INTERMEDIÁRIO, JÁ INVADE PV DE UMAS E PENSA EM PAGAR PACK DE PEZINHO',
                '🐃🐃🐃 60%\n\n - CUIDADO : GADO EXPERIENTE, INVADE PV E FALA LINDA EM TODAS FOTOS',
                '🐃🐃🐃🐃 80%\n\n - ALERTA : GADO MASTER, SÓ APARECE COM MULHER ON',
                '🐃🐃🐃🐃🐃 100%\n\n - PERIGO : GADO MEGA BLASTER ULTRA PAGA BOLETO DE MULHER QUE TEM NAMORADO'],
                apenas_um: "[❗] Erro: Apenas um membro por vez deve ser mencionado.",
                resposta: "🧩 *GADÔMETRO* - {p1}"
            },
            bafometro:{
                respostas : [' 0%\n\n - ESTÁ SÓBRIO ',
                '🍺  20% \n\n - TOMOU UM GORÓZINHO ',
                '🍺🍺  40%\n\n - JÁ TÁ FICANDO MEIO CHAPADO E FALANDO BOSTA',
                '🍺🍺🍺  60%\n\n - TÁ MAMADO E COMEÇANDO A FAZER MERDA',
                '🍺🍺🍺🍺  80%\n\n - TÁ LOUCÃO NEM CONSEGUE DIFERENCIAR MULHER E HOMEM',
                '🍺🍺🍺🍺🍺  100%\n\n - ALERTA: ESTÁ FORA DE SI , BEIJANDO MENDIGO E CACHORRO DE RUA'],
                apenas_um: "[❗] Erro: Apenas um membro por vez deve ser mencionado.",
                resposta: "🧩 *BAFÔMETRO* - {p1}"
            },
            chance:{
                resposta: "🧩 *CHANCE* - Você tem *{p1}%* de chance {p2}"
            },
            detector: {
                espera: "⏳ Calibrando a máquina da verdade"
            },
            caracoroa:{
                espera: "🕹️ Lançando a moeda 🪙",
                resposta: {
                    vitoria: "🕹️ *VITÓRIA!* 🕹️\n\n"+
                    "O resultado caiu *{p1}*\n",
                    derrota: "🕹️ *DERROTA!* 🕹️\n\n"+
                    "O resultado caiu *{p1}*\n"
                }
            },
            ppt:{
                opcao_erro: "[❗] Você deve escolher entre *pedra*, *papel*  ou *tesoura*",
                resposta : {
                    vitoria: "🕹️ *VITÓRIA!* 🕹️\n\n"+
                    "Você escolheu {p1} e o bot escolheu {p2}\n",
                    derrota: "🕹️ *DERROTA!* 🕹️\n\n"+
                    "Você escolheu {p1} e o bot escolheu {p2}\n",
                    empate: "🕹️ *EMPATE!* 🕹️\n\n"+
                    "Você escolheu {p1} e o bot escolheu {p2}\n"
                }
            },
            roletarussa:{
                sem_membros: "[❗] Não existe membros válidos para participarem da roleta.",
                espera: "🎲 Sorteando uma vítima 🎲",
                motivo: "Selecionado pela roleta",
                resposta: "🔫 Você foi o escolhido @{p1}, até a próxima."
            },
            casal:{
                minimo: "[❗] Este comando precisa de no mínimo 2 membros no grupo.",
                resposta: "👩‍❤️‍👨 Está rolando um clima entre @{p1} e @{p2}"
            },
            top5:{
                erro_membros: "[❗] O grupo deve ter no mínimo 5 membros para usar este comando.",
                resposta_titulo: "╔══✪〘🏆 TOP 5 {p1} 🏆 〙\n╠\n",
                resposta_itens: "╠➥ {p1} {p2}° Lugar @{p3}\n"
            },
            fch:{
                resposta: "🧩〘*FRASES CONTRA A HUMANIDADE*〙\n\n - {p1}",
            },
            par:{
                respostas: [' *0%*\n - NÃO COMBINAM ',
                '❤️ *20%* \n - HMMM TALVEZ ',
                '❤️❤️ *40%*\n - PODE ROLAR ALGO SÉRIO', 
                '❤️❤️❤️ *60%*\n - UIA ESSES DOIS TEM FUTURO',
                '❤️❤️❤️❤️ *80%*\n - ESSES DOIS TEM QUÍMICA, TALVEZ UM CASAMENTO EM BREVE', 
                '❤️❤️❤️❤️❤️ *100%*\n - CASAL PERFEITO: PREPAREM-SE PARA VIVER ATÉ A VELHICE JUNTOS',
                ],
                resposta: "👩‍❤️‍👨 PAR - @{p1} & @{p2}\n\n{p3}"
            }
        },
        admin: {
            entrar_grupo:{
                link_invalido: "[❗] Isso não é um link válido 👊🤬",
                entrar_erro : "[❗] Houve um erro para entrar nesse grupo, verifique se o link está correto.",
                pendente: "🤖 Não foi possivel entrar neste momento, o grupo provavelmente está com modo para administrador aceitar solicitação.",
                entrar_sucesso: "🤖✅ Entendido, entrarei em breve no grupo."
            },
            infobot:{
                resposta_superior:"*Administrador do Bot* : {p1}\n"+
                "*Nome do bot* : {p2}\n"+
                "*Online desde* : {p3}\n"+
                "*Versão* : {p4}\n"+
                "*GitHub* : https://github.com/victorsouzaleal/lbot-whatsapp\n"+
                "-------------------\n",
                resposta_variavel:{
                    limite_diario: {
                        on: "*Limite diário* : ✅\n"+
                        "- Reseta em : *{p1}*\n"+
                        "-------------------\n",
                        off: "*Limite diário* : ❌\n"+
                        "-------------------\n"
                    },
                    autosticker: {
                        on: "*Auto-Sticker privado* : ✅\n"+
                        "-------------------\n",
                        off: "*Auto-Sticker privado* : ❌\n"+
                        "-------------------\n",
                    },
                    autorevelar: {
                        on: "*Auto-Revelar* : ✅\n"+
                        "-------------------\n",
                        off: "*Auto-Revelar* : ❌\n"+
                        "-------------------\n",
                    },
                    pvliberado: {
                        on: "*PV Liberado* : ✅\n"+
                        "-------------------\n",
                        off: "*PV Liberado* : ❌\n"+
                        "-------------------\n",
                    },
                    taxa_comandos:{
                        on: "*Taxa comandos/minuto* : ✅\n"+
                        "- *{p1}* Cmds/minuto por usuário\n"+
                        "- Bloqueio : *{p2}* s\n"+
                        "-------------------\n",
                        off: "*Taxa comandos/minuto* : ❌\n"+
                        "-------------------\n"
                    },
                    bloqueiocmds:{
                        on: "*Bloqueio de comandos* : ✅\n"+
                        "- Bloqueados: *{p1}*\n"+
                        "-------------------\n",
                        off: "*Bloqueio de comandos* : ❌\n"+
                        "-------------------\n"
                    }
                },
                resposta_inferior:"*Pessoas bloqueadas* : *{p1}* pessoas\n"+
                "*Comandos executados* : *{p2}*\n"+
                "*Contato do Administrador* : wa.me/{p3}\n"
            },
            listablock:{
                resposta_titulo: "🤖 Esse é o total de pessoas bloqueadas \nTotal : {p1}\n",
                lista_vazia: "[❗] O bot não tem pessoas bloqueadas.",
                resposta_itens: "➸ +{p1}\n",
            },
            bloquear:{
                erro_dono: "[❗] O Usuário +{p1} é dono do BOT, não foi possivel bloquear.",
                ja_bloqueado: "[❗] O Usuário +{p1} já está *bloqueado*.",
                sucesso: "✅ O Usuário +{p1} foi *bloqueado* com sucesso"
            },
            desbloquear:{
                ja_desbloqueado: "[❗] O Usuário +{p1} já está *desbloqueado*.",
                sucesso: "✅ O Usuário +{p1} foi *desbloqueado* com sucesso"
            },
            fotobot: {
                sucesso: "🤖✅ A foto do BOT foi alterada com sucesso."
            },
            desligar:{
                sucesso: "🤖✅ Entendido, o BOT será desligado"
            },
            usuarios: {
                nao_encontrado: "[❗] Não existem usuários com esse tipo ou você digitou um tipo inválido, confira os tipos disponíveis em "+`*${prefixo}tipos*`,
                resposta: {
                    titulo: "👥  USUÁRIOS - {p1} ({p2})\n\n",
                    item: "-> {p1} +{p2} - {p3} cmds\n"
                }
            },
            limpartipo:{
                erro: "[❗] O tipo de usuário que você inseriu é inválido, verifique os tipos disponíveis em "+`*${prefixo}tipos*`,
                sucesso: "✅Todos os usuários do tipo *{p1}* foram convertidos para *COMUM*"
            },
            tipocomandos: {
                invalido: "[❗] O número para definir o limite de comandos é inválido",
                tipo_invalido: "[❗] O tipo de usuário que você inseriu é inválido, verifique os tipos disponíveis em "+`*${prefixo}tipos*`,
                erro_limite_diario: "[❗] Este comando só pode ser usado com o "+`*${prefixo}limitediario*`+" ativado.",
                sucesso: "✅ O limite diário dos usuários do tipo *{p1}* foi definido para *{p2}* comandos/dia "
            },
            usuariotipo: {
                tipo_dono: "[❗] Não é possivel alterar cargo do dono",
                tipo_invalido: "[❗] O tipo de usuário que você inseriu é inválido, verifique os tipos disponíveis em "+`*${prefixo}tipos*`,
                nao_registrado: "[❗] Este usuário ainda não está registrado",
                sucesso: "✅ O tipo desse usuário foi definido para {p1}"
            },
            bcmdglobal:{
                resposta_titulo: "[🤖 *Bloquear comandos - Global* 🤖]\n\n",
                resposta_variavel: {
                    ja_bloqueado: "- Comando *{p1}* já está bloqueado.\n",
                    bloqueado_sucesso: "- Comando *{p1}* bloqueado com sucesso.\n",
                    erro: "- Comando *{p1}* não pode ser bloqueado.\n",
                    nao_existe: "- Comando *{p1}* não existe.\n"
                },
                resposta_cmd_bloqueado : "[❗] O comando *{p1}* está indisponível no momento por ordem do administrador, tente novamente mais tarde."
            },
            dcmdglobal:{
                resposta_titulo: "[🤖 *Desbloquear Comandos - Global* 🤖]\n\n",
                resposta_variavel: {
                    desbloqueado_sucesso: "- Comando *{p1}* foi desbloqueado.\n",
                    ja_desbloqueado: "- Comando *{p1}* já esta desbloqueado ou nunca foi bloqueado.\n"
                }
            },
            autostickerpv:{
                desativado: "✅ O AUTO-STICKER em mensagens privadas foi desativado com sucesso",
                ativado: "✅ O AUTO-STICKER em mensagens privadas foi ativado com sucesso",
            },
            autorevelar:{
                ativado: '✅ O AUTO-REVELAR em mensagens de visualização única foi ativado com sucesso',
                desativado: '✅ O AUTO-REVELAR em mensagens de visualização única foi desativado com sucesso',
                restransmissao: '[🕵️ *Revelar mensagens* 🕵️]\n\n'+
                '✉️ Nova mensagem detectada :\n'+
                `Nome : *{p1}*\n`+
                `Numero : *{p2}*\n`+
                'Grupo : *{p3}*\n'+
                'Tipo de mensagem : *{p4}*\n'
            },
            pvliberado:{
                desativado: "✅ Os comandos em MENSAGENS PRIVADAS foram desativados com sucesso.",
                ativado: "✅ Os comandos em MENSAGENS PRIVADAS foram ativados com sucesso."
            },
            limitediario:{
                qtd_invalida: "[❗] A quantidade de comandos por dia está inválida",
                ativado: "✅ O Limite diário de comandos foi ativado com sucesso",
                desativado: "✅ O Limite diário de comandos foi desativado com sucesso",
                resposta_excedeu_limite: "[❗] {p1} -> Você ultrapassou seu limite diário de comandos por dia.\n\n"+
                "Entre em contato com o dono para ver sua situação : https://wa.me/{p2}"
            },
            novotipo:{
                erro_comandos: "[❗] Houve um erro ao criar um novo tipo, a quantidade de comandos diários tem que ser um número e no mínimo 10.",
                sucesso_criacao: "✅ Um novo tipo de usuário foi criado com sucesso.\n"+
                "- Tipo : {p1}\n"+
                "- Titulo : {p2}\n"+
                "- Comandos diários : {p3}\n",
                erro_criacao: `[❗] Houve um erro ao criar um novo tipo, verifique se esse tipo já existe em *${prefixo}tipos*`
            },
            limitecomandos:{
                qtd_invalida: "[❗] A quantidade máxima de mensagens por minuto está inválida",
                tempo_invalido: "[❗] O tempo de bloqueio de mensagens está inválido",
                ativado: "✅ O Limitador de comandos por minuto foi ativado com sucesso",
                desativado: "✅ O Limitador de comandos por minuto foi desativado com sucesso",
                resposta_usuario_limitado: "[❗] Você está impossibilitado de mandar comandos por *{p1}* segundos, pega leve cara."
            },
            nomebot:{
                sucesso: "✅ O nome do bot foi alterado com sucesso.",
            },
            nomeadm:{
                sucesso: "✅ O nome do administrador foi alterado com sucesso.",
            },
            nomesticker:{
                sucesso: "✅ O nome do pacote de figurinhas foi alterado com sucesso.",
            },
            prefixo:{
                sucesso: "✅ O prefixo dos comandos foi alterado com sucesso.",
                nao_suportado: "[❗] Não suportado como prefixo, são suportados somente : ! # . *"
            },
            r: {
                sucesso: "✅ Os comandos diários desse usuário foram resetados",
                nao_registrado: "[❗] Este usuário ainda não está registrado",
                erro_limite_diario: `[❗] Este comando só pode ser usado com o *${prefixo}limitediario* ativado.`
            },
            rtodos:{
                sucesso: "✅ Os comandos diários de todos os usuários foram resetados",
                erro_limite_diario: "[❗] Este comando só pode ser usado com o "+`*${prefixo}limitediario*`+" ativado."
            },
            verdados:{
                nao_registrado: "[❗] Este usuário ainda não está registrado",
                resposta_superior: "[🤖*VER DADOS DE USO*🤖]\n\n"+
                "Nome : *{p1}*\n"+
                "Tipo de usuário : *{p2}*\n"+
                "Número : *{p3}*\n",
                resposta_variavel: {
                    limite_diario: {
                        on:"Comandos usados hoje : *{p1}/{p2}*\n"+
                        "Limite diário : *{p3}*\n",
                        off: ""
                    }
                },
                resposta_inferior: "Total de comandos usados : *{p1}* comandos\n"
            },
            tipos: {
                resposta : {
                    titulo : "👥 Tipos de usuários ({p1}) :\n\n",
                    item: "Tipo : {p1}\n"+
                    "Titulo : {p2}\n"+
                    "Comandos diários : {p3}\n\n"
                }
            },
            bcgrupos:{
                anuncio: `[🤖${nome_bot}® - Mensagem para os grupos]\n\n`+
                "{p1}",
                espera: "⏳ Em andamento , estou enviando sua mensagem para {p1} grupos.\n\n"+
                "Tempo estimado : *{p2}* segundos",
                bc_sucesso: "🤖✅ Anúncio feito com sucesso."
            },
            grupos: {
                resposta_titulo: "🤖 GRUPOS ATUAIS ({p1})\n",
                resposta_itens: "----------------------------\n"+
                "*N° Grupo* : {p1}\n"+
                "*Nome* : {p2}\n"+
                "*Participantes* : {p3}\n"+
                "*Admins* : {p4}\n"+
                "*Bot é admin?* {p5}\n"+
                `*Link*: {p6}\n`
            },
            linkgrupo: {
                resposta: `🤖✅ O link para este grupo atualmente é : {p1}`,
                nao_admin: '[❗] Não foi possível obter o link desse grupo, o bot não é administrador deste grupo.',
                nao_encontrado: `[❗] Não foi possível obter o link desse grupo, o grupo não foi encontrado ou o número é inválido. Cheque o comando correto em *${prefixo}grupos*`,
            },
            sair:{
                resposta_admin: "🤖✅ O bot saiu com sucesso do grupo escolhido.",
                nao_encontrado: `[❗] Não foi possível sair deste grupo, o grupo não foi encontrado ou o número é inválido. Cheque o comando correto em *${prefixo}grupos*`,
            },
            sairtodos:{
                resposta: "🤖✅ Saí de todos os grupos com sucesso, total de grupos : {p1}"
            },
            limpar:{
                limpar_sucesso : "🤖✅ Todos os chats foram limpos.",
            },
            estado:{
                sucesso: "🤖✅ Seu estado foi alterado com sucesso."
            },
            ping: {
                resposta: "🖥️ INFORMAÇÃO GERAL 🖥️\n\n"+
                "*OS*: {p1}\n"+
                "*CPU*: {p2}\n"+
                "*RAM*: {p3}GB/{p4}GB\n"+
                "*Resposta*: {p5}s\n"+
                "*Usuários cadastrados*: {p6}\n"+
                "*Grupos cadastrados*: {p7}\n"+
                "*Online desde*: {p8}"
            }
        },
        permissao: {
            grupo: '[❗] Este comando só pode ser usado em grupos',
            bot_admin: '[❗] Permita que o BOT tenha permissões administrativas.',
            banir_admin : '[❗] O Bot não tem permissão para banir um administrador',
            apenas_admin : '[❗] Apenas administradores podem usar este comando.',
            apenas_dono_bot: '[❗] Apenas o dono do BOT pode usar este comando',
            apenas_dono_grupo: '[❗] Apenas o dono do GRUPO pode usar este comando.',
        }
    }
}

