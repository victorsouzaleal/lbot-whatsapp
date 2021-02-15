<p align="center">
<img src="https://avatars0.githubusercontent.com/u/4674786?s=400&u=2f77d382a4428c141558772a2b7ad3a36bebf5bc&v=4" width="128" height="128"/>
</p>
<p align="center">
<a href="#"><img title="LBot-WhatsApp" src="https://img.shields.io/badge/LBot%20WhatsApp-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge"></a>
</p>
<p align="center">
<a href="https://github.com/Victorsouza02"><img title="Autor" src="https://img.shields.io/badge/Autor-Victorsouza02-blue.svg?style=for-the-badge&logo=github"></a>
</p>
<p align="center">
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FVictorsouza02%2Flbot-whatsapp&count_bg=%231D8ED9&title_bg=%23454545&icon=github.svg&icon_color=%23E7E7E7&title=visualizacoes&edge_flat=true"/></a>
<a href="#"><img title="Versão" src="https://img.shields.io/github/package-json/v/victorsouza02/lbot-whatsapp?label=vers%C3%A3o&style=flat-square"></a>
<a href="#"><img title="Tamanho" src="https://img.shields.io/github/repo-size/victorsouza02/lbot-whatsapp?label=tamanho&style=flat-square"></a>
<a href="https://github.com/Victorsouza02/followers"><img title="Seguidores" src="https://img.shields.io/github/followers/victorsouza02?label=seguidores&style=flat-square"></a>
<a href="https://github.com/Victorsouza02/lbot-whatsapp/stargazers/"><img title="Estrelas" src="https://img.shields.io/github/stars/victorsouza02/lbot-whatsapp?label=estrelas&style=flat-square"></a>
<a href="https://github.com/Victorsouza02/lbot-whatsapp/watchers"><img title="Acompanhando" src="https://img.shields.io/github/watchers/Victorsouza02/lbot-whatsapp?label=acompanhando&color=blue&style=flat-square"></a>
<a href="#"><img title="Atualizacao" src="https://img.shields.io/badge/atualizado-Sim-blue.svg"/></a>
</p>

## Sobre o projeto :

Esse é o LBOT que fiz no meu tempo livre para aprender mais sobre Node.js, tem diversas funções interessantes para uso individual ou em grupo. Espero que façam bom uso.

## Clone este projeto :
```bash
> git clone https://github.com/Victorsouza02/lbot-whatsapp.git
> cd lbot-whatsapp
```

## Instale as dependências :

### ESTE BOT É FUNCIONAL APENAS EM PC/COMPUTADORES
### VOCÊ DEVE TER O GIT E O NODE INSTALADOS EM SEU COMPUTADOR
Antes de executar o comando abaixo, tenha certeza que você está 
no diretório do projeto que você clonou!

```bash
> npm install gify-cli -g
> npm i
```
### Uso :
Dentro da pasta do projeto após ter realizado todos os passos anteriores, execute este comando. 
```bash
> npm start
```
Se for a sua primeira vez executando escaneie o QR Code com o seu celular e ainda não tiver configurado o arquivo .env, siga para o passo abaixo.

### Configuração do arquivo .env :
Na primeira inicialização o script criará os arquivos necessários para o funcionamento, após inicializar ele irá pedir para você configurar o .env na raiz do projeto. Vá até o .env e configure ele com o seu número de Whatsapp e as chaves de API necessárias para alguns comandos.

    # LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT.
    NÚMERO_DONO = SEU número com o código do país incluido. ex: 55219xxxxxxxx
    # CHAVE DO REMOVEBG (REMOVER FUNDO DE IMAGENS)
    API_REMOVE_BG = recebe a chave da conta que você criar no site remove.bg
    # CHAVE DO NEWSAPI (NOTICIAS ATUAIS)
    API_NEWS_ORG = recebe a chave da conta que voce criar no site newsapi.org 
    # CHAVE DO SCALESERP (PESQUISA DE IMAGENS)
    API_SCALE_SERP = recebe a chave da conta que você criar no site scaleserp.com 
    # CHAVES DO TWITTER (DOWNLOAD VIDEOS DO TWITTER)
    twitter_consumer_key = recebe sua consumer_key obtida no https://developer.twitter.com/
    twitter_consumer_secret= recebe sua consumer_secret obtida no https://developer.twitter.com/
    twitter_access_token= recebe seu access_token obtido no https://developer.twitter.com/
    twitter_access_token_secret= recebe seu access_token_secret obtido no https://developer.twitter.com/

## Funcionamento :
Apos tudo configurado corretamente, estes são os comandos iniciais que dão acesso a todos os outros.

    !ajuda - Dá acesso aos comandos disponíveis dependendo de onde ele for usado (Grupo ou Privado).
    !admin - Dá acesso aos comandos de ADMINISTRADOR/DONO DO BOT
 

## Recursos Principais :


### Criação
#
| Criador de Sticker |                Recursos        |
| :-----------: | :--------------------------------: |
|       ✅       | Foto para Sticker     |
|       ✅       | Sticker para foto              |
|       ✅       | Texto para Sticker                  |
|       ✅       | Video/GIF para Sticker |
|       ✅       | Foto para Sticker (Sem fundo) |
|       ✅       | Efeitos de Aúdio


### Utilidades Gerais
#

| Utilitários |                     Recursos            |
| :------------: | :---------------------------------------------: |
|       ✅        |   Texto para voz                   |
|       ✅        |   Download de aúdio (Youtube)    |
|       ✅        |   Download de videos (Youtube)            |
|       ✅        |   Download de videos (Twitter)            |
|       ✅        |   Detector de DDD             |
|       ✅        |   Consulta de Clima/Previsão do Tempo            |
|       ✅        |   Conversão de Moedas           |
|       ✅        |   Calculadora básica           |
|       ✅        |   Pesquisa de imagens                  |
|       ✅        |   Pesquisa de anime                  |
|       ✅        |   Lançamentos recentes  - Animes                 |
|       ✅        |   Rastreamento Correios                  |
|       ✅        |   Noticias Atuais                 |
|       ✅        |   Tradutor                |

### Administração de Grupo
#
| Apenas Grupo  |                     Recursos             |
| :------------: | :---------------------------------------------: |
|       ✅        |   Promover usuário                  |
|       ✅        |   Rebaixar usuário                |
|       ✅        |   Remover usuário                     |
|       ✅        |   Adicionar usuário                      |
|       ✅        |   Marcar todos              |
|       ✅        |   Obter link do grupo               |
|       ✅        |   Redefinir link do grupo               |
|       ✅        |   Obter lista de administradores               |
|       ✅        |   Obter dono do grupo              |
|       ✅        |   Mutar Grupo
|       ✅        |   Bem Vindo  |
|       ✅        |   Anti Fake (números estrangeiros)|
|       ✅        |   Anti Link  |
|       ✅        |   Anti Flood  |
|       ✅        |   Contagem de mensagens |
|       ✅        |   Marcar inativos |
|       ✅        |   Banir inativos |
|       ✅        |   Bloquear/Desbloquear Comandos |
|       ✅        |   Votação de Ban |
|       ✅        |   Enquete |
|       ✅        |   Banir Todos  |
|       ✅        |   Apagar mensagens do bot  |

### Administração de Dono
#
| Apenas Dono do Bot  |              Recurso           |
| :------------: | :---------------------------------------------: |
|       ✅        |   Entrar em um grupo                 |
|       ✅        |   Sair de todos os grupos                  |
|       ✅        |   Limpar todos os chats              |
|       ✅        |   Broadcast - Anuncio Geral                     |
|       ✅        |   Bloquear/Desbloquear usuário                     |
|       ✅        |   Sistema Comum/VIP         |
|       ✅        |   Limitador comandos diários (por usuário)            |
|       ✅        |   Limitador de comandos por minuto (por usuário)          |
|       ✅       | Limitador de mensagens (Anti-flood)
|       ✅        |   Sair do grupo                     |
|       ✅        |   Limpar somente chat de contatos                 |
|       ✅        |   Obter lista de usuários bloqueados                |
|       ✅        |   Modificar status atual do bot                |


### Solucão de problemas
Tenha certeza que todas as depêndencias necessárias estão instaladas
https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md

Corrigir travamento no Linux , instale o  google chrome stable:
```bash
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt install ./google-chrome-stable_current_amd64.deb
```

### Dúvidas?
Entre em contato comigo pelo WhatsApp : https://wa.me/5521995612287

## Agradecimentos
* [`open-wa/wa-automate-nodejs`](https://github.com/open-wa/wa-automate-nodejs)
* [`MhankBarBar/whatsapp-bot`](https://github.com/MhankBarBar/whatsapp-bot)
