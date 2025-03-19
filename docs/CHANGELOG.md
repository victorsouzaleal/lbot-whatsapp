# Notas de atualização
Colocarei neste arquivos as mudanças significativas em cada versão começando na versão 3.0.0

## 3.0.0 - 21/03/2025

### GERAL
- O bot foi totalmente reescrito para Typescript.
- O bot agora tem uma verificação de versão ao iniciar e se for possível ele fará a atualização automaticamente.
- Simplificação de criação de comandos.
- Os menus e mensagens de resposta foram reformulados.
- O bot agora utiliza a [**biblioteca-lbot**](https://www.npmjs.com/package/@victorsouzaleal/biblioteca-lbot) para obter dados externos para os comandos.
- O recurso de grupo **Contador** agora não checa toda vez que o bot é inicializado, ele apenas registra na contagem quando um membro enviar mensagem no grupo e quando for solicitado algum comando que necessite disso, isso vai melhorar o tempo de carregamento para quem tem muitos grupos com a contagem ligada.
- O recurso **Taxa de comandos** foi reescrito e foi criado um arquivo de database próprio para este recurso, isso vai ajudar a evitar problemas de corrupção ou dessincronia no bot.json.
- O recurso **Anti-flood** foi reescrito e foi criado um arquivo de database próprio para este recurso, isso vai ajudar na velocidade do recurso em grupos muito grandes.
- Os recursos de **Limite diário de comandos** e de **Tipo de usuário** foram removidos, isso tornava o bot muito complexo e pouca gente sabia usar esse recurso.
- O recurso de **Revelar mensagens de visualização única** foi removido por motivos de privacidade e por ter risco de banimento manipulando esses tipos de mensagens.
- Adicionado recurso de **múltiplos administradores do bot**.
- A fila de eventos em espera enquanto o bot inicializa foi melhorada e é armazenada em cache.
- Melhor tratamento de erro nos comandos para o usuário saber o que houve de errado.
- As mensagens do bot agora são adicionadas a um cache temporário por 5 minutos caso alguma mensagem precise ser reenviada.
- O bot não alerta mais sobre a falta de chaves API na inicialização, agora a configuração de chaves de API é feita por comando.
- Melhorias em comandos e remoção de comandos que não estão mais funcionando.
- Os comandos de diversão foram refeitos.


### COMANDOS 

#### Mudanças
- Melhoria nos comandos de DOWNLOAD dando mais informações sobre a mídia baixada e agora permite downloads de no máximo **6 MINUTOS**.
- Comando **!s** agora possibilita fazer sticker sem redimensionar a imagem original usando o comando **!s 2**.
- Comando **!status** foi renomeado para **!grupo** e agora exibe mais informações sobre o grupo inclusive quantos comandos foram feitos e quais recursos estão ativos/desativados.
- Comando **!info** agora exibe o contatos de todos que estão registrados como administrador do bot.
- Comando **!reportar** agora reporta a mensagem para todos que estão registrados como administrador do bot.
- Comando **!remlista** foi renomeado para **!rmlista** e agora não é mais necessário digitar o número completo da pessoa que você quer remover da lista negra, é só usar o **!listanegra** e ver qual posição da lista a pessoa que você quer remover está e usar o rmlista. Por exemplo **!rmlista 1** remove a pessoa da posição 1 da lista negra.
- Comando **!listanegra** agora exibe quantos usuários estão na lista negra, e se o usuário que está na lista já tiver tido contato com o bot também será exibido o nome dele ao lado do número.
- Comando **!tw** foi renomeado para **!x**
- Comando **!nomeadm** foi renomeado para **!nomeautor** e agora serve para renomear o nome do autor das figurinhas.
- Comando **!nomesticker** foi renomeado para **!nomepack** e agora serve para renomear o nome do pack das figurinhas.
- Comando **!alink** foi renomeado para **!antilink**.
- Comando **!afake** foi renomeado para **!antifake**.
- Comando **!aflood** foi renomeado para **!antiflood**.
- Comando **!bv** foi renomeado para **!bemvindo**.
- Comando **!fch** foi renomeado para **!frase**.
- Comando **!add** teve a resposta melhorada e só adiciona 1 membro pro comando ao grupo para evitar banimentos.
- Comando **!ban** teve a resposta melhorada e exibe se conseguiu banir ou não o participante.
- Todos os comandos de marcação **!mm**, **!mt** e **!adms** agora usam marcação silenciosa para evitar mostrar uma lista muito grande de pessoas marcadas.
- Comando **!topativos** como padrão agora exibe o ranking dos 10 membros com mais mensagens no grupo.
- Comando **imarcar** foi renomeado para **!inativos**.
- Comando **!verdados** foi renomeado para **!verusuario**
- Comando **!grupos** foi renomeado para **!vergrupos**
- Comando **!estado** foi renomeado para **!recado** e agora pode ser usado para colocar qualquer texto na parte de recado/status no perfil do bot.
- Os comandos **!sair** , **!linkgrupo** e **!sairgrupos** não ficarão mais expostos no menu de admin, eles serão subcomandos do comando **!vergrupos**.
- Comando **!pvliberado** foi renomeado para **!comandospv**
- Comando **!info** agora exibe quais recursos do bot estão ligados/desligados se quem fizer o comando for administrador do bot.

#### Novo
- Novos comandos **!addadmin**, **!rmadmin**, **!veradmins** para adicionar, remover e listar os administradores do bot.
- Novo comando **!api** para configurar as chaves de API sem a necessidade de alterar o .env.

#### Removidos
- Comandos de limite diário e de tipos de usuários **!limitediario**, **!usuarios**, **!tipos**, **!novotipo**, **!tipotitulo**, **!deltipo**, **!usuariotipo**, **!limpartipo**, **!tipocomandos**, **!rtodos**, **!r** foram removidos.
- Comandos de revelar mensagens **!autorevelar** e **!revelar** foram removidos.
- Comando **!rt** foi removido, estava sendo usado por pessoas com más intenções em grupos para marcar os membros em anúncios.
- Comando **!enquete** foi removido, enquetes podem ser criadas fácilmente pelo próprio aplicativo do WhatsApp.
- Comando **!regras** foi removido e foi integrado ao **!grupo**
- Comando **!rastreio** foi removido por não ter mais suporte dos Correios, se eu conseguir outra alternativa ele podem voltar ao bot em futuras atualizações.
- Comando **!bantodos** foi removido, não há necessidade dele existir além de ser um comando perigoso de ser usado acidentalmente.
- Comando **ibanir** foi removido,  o comando tinha um grande risco de gerar banimento em massa se a pessoa usasse errado.
- Comando **!infobot** foi removido, o comando **!info** vai servir para a função dele.




