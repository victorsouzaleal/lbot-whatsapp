## Atualização LBOT v3.0.0

### GERAL

- O bot foi totalmente reescrito para Typescript.
- O bot agora utiliza a [**biblioteca-lbot**](https://www.npmjs.com/package/@victorsouzaleal/biblioteca-lbot) para obter dados externos para os comandos.
- Não há mais checagem de contador de grupos toda vez que o bot é iniciado para melhorar a performance principalmente com quem tem muitos grupos.
- A fila de eventos em espera enquanto o bot inicializa foi melhorada e é armazenada em cache.
- Melhor tratamento de erro nos comandos para o usuário saber o que houve de errado.
- Simplificação de criação de comandos.
- Adicionado suporte a múltiplos administradores do bot. (EM PROGRESSO)
- As mensagens do bot agora são adicionadas a um cache temporário por 5 minutos caso alguma mensagem precise ser reenviada.
- O bot não alerta mais sobre a falta de chaves API na inicialização e .env não é mais criado automaticamente, sendo necessário o próprio usuário criar o arquivo e inserir as chaves de API de acordo com o tutorial.
- Criado um arquivo de database próprio para o Anti-SPAM de comandos e o status se o usuário está limitado agora é registrado na database de Usuário. Isso ajudará a evitar o problema de corrupção/dessincronia do bot.json ao ficar atualizando a todo momento. (PARA FAZER)
- Criado um arquivo de database próprio para o Anti-SPAM em grupos. Isso ajudará a evitar problemas em grupos muito grandes. (PARA FAZER)
- Melhorias em comandos e remoção de comandos que não estão mais funcionando.


### COMANDOS 

- Melhoria nos comandos de DOWNLOAD dando mais informações sobre a mídia baixada e agora permite downloads de no máximo **6 MINUTOS**.
- Comando **!status** foi renomeado para **!grupo** e agora exibe mais informações sobre o grupo inclusive quantos comandos foram feitos e quais recursos estão ativos/desativados.
- Comando **!regras** foi removido e foi integrado ao **!grupo**
- Comando **!info** agora exibe o contatos de todos que estão registrados como administrador do bot.
- Comando **!reportar** agora reporta a mensagem para todos que estão registrados como administrador do bot.
- Comando **!remlista** foi renomeado para **!rmlista** e agora não é mais necessário digitar o número completo da pessoa que você quer remover da lista negra, é só usar o **!listanegra** e ver qual posição da lista a pessoa que você quer remover está e usar o rmlista. Por exemplo **!rmlista 1** remove a pessoa da posição 1 da lista negra.
- Comando **!listanegra** agora exibe quantos usuários estão na lista negra, e se o usuário que está na lista já tiver tido contato com o bot também será exibido o nome dele ao lado do número.
- Comandos **!ia**, **!criarimg** e **!rastreio** foram removidos por não estarem funcionando, se eu conseguir outras alternativas eles podem voltar ao bot em futuras atualizações.
- Novos comandos **!addadmin**, **!rmadmin**, **!veradmins** para adicionar, remover e listar os administradores do bot. (PARA FAZER)
- Comando **!nomeadm** foi renomeado para **!nomeautor** e agora serve para renomear o nome do autor das figurinhas. (PARA FAZER)
- Comando **!nomesticker** foi renomeado para **!nomepack** e agora serve para renomear o nome do pack das figurinhas. (PARA FAZER)
- Comando **!alink** foi renomeado para **!antilink**.
- Comando **!afake** foi renomeado para **!antifake**.
- Comando **!aflood** foi renomeado para **!antispam**.
- Comando **!bv** foi renomeado para **!bemvindo**.
- Comando **!fch** foi renomeado para **!frase**.
- Comando **!add** teve a resposta melhorada e só adiciona 1 membro pro comando ao grupo para evitar banimentos.
- Comando **!ban** teve a resposta melhorada e exibe se conseguiu banir ou não o participante.
- Comando **!bantodos** foi removido, não há necessidade dele existir além de ser um comando perigoso de ser usado acidentalmente.
- Comando **!enquete** foi removido, enquetes podem ser criadas fácilmente pelo próprio aplicativo do WhatsApp.
- Todos os comandos de marcação **!mm**, **!mt** e **!adms** agora usam marcação silenciosa para evitar mostrar uma lista muito grande de pessoas marcadas.
- Comando **!topativos** como padrão agora exibe o ranking dos 10 membros com mais mensagens no grupo.
- Os comandos **!imarcar** e **ibanir** foram removidos, não eram usados com o propósito certo e podiam acabar gerando banimento acidental.


