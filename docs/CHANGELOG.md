# Notas de atualização
Colocarei neste arquivos as mudanças significativas em cada versão começando na versão 3.0.0

## 3.0.0 - 21/03/2025

### GERAL
- O projeto foi totalmente reescrito para Typescript.
- Agora o projeto utiliza a [**biblioteca-lbot**](https://www.npmjs.com/package/@victorsouzaleal/biblioteca-lbot) para obter dados externos para os comandos.
- Adicionada verificação de versão ao iniciar e se for possível ele fará a atualização automaticamente.
- O visual dos menus e das mensagens de resposta foram reformulados.
- Adicionado suporte a chats que tem mensagens temporárias que desaparecem com o tempo.
- Adicionado recurso de **múltiplos administradores do bot**.
- A configuração de chaves de API agora é feita por comando.
- O recurso de grupo **contador** foi reescrito
- O recurso **Taxa de comandos** foi reescrito
- O recurso **Anti-flood** foi reescrito 
- Os recursos de **Limite diário de comandos** e de **Tipo de usuário** foram removidos.
- O recurso de **Revelar mensagens de visualização única** foi removido.
- Melhoria na fila de eventos em espera enquanto o bot inicializa.
- Melhoria no tratamento de erro nos comandos para o usuário saber o que houve de errado.
- Melhoria no armazenamento de mensagens do bot.
- Melhorias em geral em comandos.
- A categoria de comando **DIVERSÃO** foi renomeada para **VARIADO**


### COMANDOS 

#### Mudanças
- Melhoria nos comandos da categoria DOWNLOAD dando mais informações sobre a mídia baixada e agora permite downloads de no máximo **6 MINUTOS**.
- Melhorias nos comandos da categoria VARIADO, alguns comandos foram reescritos.
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
- Comando **!rt** foi removido.
- Comando **!enquete** foi removido.
- Comando **!regras** foi removido e foi integrado ao **!grupo**
- Comando **!rastreio** foi removido por não ter mais suporte dos Correios.
- Comandos **!ia** e **!criarimg** removidos, e serão adicionados novamente se voltarem a funcionar ou eu achar alguma alternativa gratuita.
- Comando **!bantodos** foi removido.
- Comando **ibanir** foi removido.
- Comando **!infobot** foi removido, o comando **!info** vai servir para a função dele.




