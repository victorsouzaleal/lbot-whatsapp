<p align="center">
<img src="https://avatars0.githubusercontent.com/u/4674786?s=400&u=2f77d382a4428c141558772a2b7ad3a36bebf5bc&v=4" width="128" height="128"/>
</p>
<p align="center">
<a href="#"><img title="LBot-WhatsApp" src="https://img.shields.io/badge/LBot%20WhatsApp-green?colorA=%23ff0000&colorB=%23017e40&style=for-the-badge"></a>
</p>
<p align="center">
<a href="https://github.com/victorsouzaleal"><img title="Autor" src="https://img.shields.io/badge/Autor-victorsouzaleal-blue.svg?style=for-the-badge&logo=github"></a>
</p>
<p align="center">
<a href="https://www.codefactor.io/repository/github/victorsouzaleal/lbot-whatsapp"><img src="https://www.codefactor.io/repository/github/victorsouzaleal/lbot-whatsapp/badge" alt="CodeFactor" /></a>
</p>
<p align="center">
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fvictorsouzaleal%2Flbot-whatsapp&count_bg=%231D8ED9&title_bg=%23454545&icon=github.svg&icon_color=%23E7E7E7&title=visualizacoes&edge_flat=true"/></a>
<a href="#"><img title="Versão" src="https://img.shields.io/github/package-json/v/victorsouzaleal/lbot-whatsapp?label=vers%C3%A3o&style=flat-square"></a>
<a href="#"><img title="Tamanho" src="https://img.shields.io/github/repo-size/victorsouzaleal/lbot-whatsapp?label=tamanho&style=flat-square"></a>
<a href="https://github.com/victorsouzaleal/followers"><img title="Seguidores" src="https://img.shields.io/github/followers/victorsouzaleal?label=seguidores&style=flat-square"></a>
<a href="https://github.com/victorsouzaleal/lbot-whatsapp/stargazers/"><img title="Estrelas" src="https://img.shields.io/github/stars/victorsouzaleal/lbot-whatsapp?label=estrelas&style=flat-square"></a>
<a href="https://github.com/victorsouzaleal/lbot-whatsapp/watchers"><img title="Acompanhando" src="https://img.shields.io/github/watchers/victorsouzaleal/lbot-whatsapp?label=acompanhando&color=blue&style=flat-square"></a>
<a href="#"><img title="Atualizacao" src="https://img.shields.io/badge/atualizado-Sim-blue.svg"/></a>
</p>

## Sobre o projeto :

Esse é o LBOT que fiz no meu tempo livre para aprender mais sobre Node.js, tem diversas funções interessantes para uso individual ou em grupo. Espero que façam bom uso.<br>

Se forem usar para fazer modificações ou outras coisas, por favor deem crédito a esse Github ^^

### ESTE BOT É FUNCIONAL APENAS EM PC/COMPUTADORES
### VOCÊ DEVE TER O [GIT](https://git-scm.com/downloads) E O  [NODE VERSÃO LTS](https://nodejs.org/en/) INSTALADOS EM SEU COMPUTADOR

## 1 - Clone este projeto :
```bash
> git clone https://github.com/victorsouzaleal/lbot-whatsapp.git
> cd lbot-whatsapp
```

## 2 - Instale as dependências :
Antes de executar o comando abaixo, tenha certeza que você está 
no diretório do projeto que você clonou!

```bash
> npm i
```

#### Obs: Se houver algum erro vá para o [Passo 7](https://github.com/victorsouzaleal/lbot-whatsapp#7---solu%C3%A7%C3%A3o-de-problemas-)

## 3 - Uso :

Dentro da pasta do projeto após ter realizado todos os passos anteriores, execute este comando. 

```bash
> npm start
```

Se for a sua primeira vez executando escaneie o QR Code com o seu celular e digite no terminal **SEU** número de telefone **COM CÓDIGO DO PAÍS** no terminal. Ele irá encerrar o bot e você deverá inicia-lo novamente.

## 4 - Funcionamento :
Após todos os passos anteriores feitos, seu bot já deve estar iniciando normalmente, use os comandos abaixo para visualizar os comandos disponíveis.

    !ajuda - Dá acesso aos comandos disponíveis dependendo de onde ele for usado (Grupo ou Privado).
    !admin - Dá acesso aos comandos de ADMINISTRADOR/DONO DO BOT

Todos os comandos agora tem um guia ao digitar **!comando guia**

### Pronto! Seu bot já está funcionando!!

**Obs**: Se você deseja utilizar os comandos **!ssf** (remover fundo), **!img** (pesquisar imagem), **!pesquisar** (pesquisar na internet), **!noticias** (noticias atuais) e **!qualmusica**(reconhecimento de músicas) vá para o **passo 5**.
 

## 5 - Configuração do arquivo .env :

#### Abra o arquivo .env na raiz do projeto e edite manualmente : </br>

        # LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT.
        NÚMERO_DONO = SEU número com o código do país incluido. ex: 55219xxxxxxxx
        # REMOVEBG - REMOVER FUNDO 
        API_REMOVE_BG = recebe a chave da conta que você criar no site remove.bg
        # NEWSAPI - NOTICIAS 
        API_NEWS_ORG = recebe a chave da conta que voce criar no site newsapi.org 
        # RAPIDAPI - PESQUISA DE IMAGENS/WEB
        API_RAPIDAPI = recebe a chave da conta que você criar no site rapidapi.com 
        # ACRCLOUD - RECONHECIMENTO DE MÚSICAS
        acr_host= recebe seu endereço de host obtido no https://acrcloud.com/
        acr_access_key= recebe seu access_key obtido no https://acrcloud.com/
        acr_access_secret= recebe seu access_secret obtido no https://acrcloud.com/

**Obs**: Se o seu sistema for MAC, habilite a exibição de arquivos ocultos para exibir o .env na raiz do projeto.<br>

**Informações detalhadas sobre como obter as chaves do RemoveBG(Remover fundo), NewsAPI(Notícias), RapidAPI(Pesquisa Imagens/Web), ACRCloud(Reconhecimento de Músicas)** :  [Clique AQUI](CHAVESAPI.md)



## 6 - Recursos Principais :

### Criação

| Criador de Sticker |                Recursos        |
| :-----------: | :--------------------------------: |
|       ✅       | Foto para Sticker     |
|       ✅       | Sticker para foto              |
|       ✅       | Texto para Sticker                  |
|       ✅       | Video/GIF para Sticker |
|       ✅       | Foto para Sticker (Sem fundo) |
|       ✅       | Efeitos de Aúdio


### Utilidades Gerais

| Utilitários |                     Recursos            |
| :------------: | :---------------------------------------------: |
|       ✅        |   Texto para voz                   |
|       ✅        |   Reconhecimento de músicas                 |
|       ✅        |   Download de aúdio/videos (Youtube)    |
|       ✅        |   Download de imagens/videos (Instagram)  |
|       ✅        |   Download de imagens/videos (Twitter)            |
|       ✅        |   Detector de DDD             |
|       ✅        |   Consulta de Clima/Previsão do Tempo            |
|       ✅        |   Conversão de Moedas           |
|       ✅        |   Calculadora básica           |
|       ✅        |   Pesquisa Imagens                  |
|       ✅        |   Pesquisa Web                  |
|       ✅        |   Detector Anime                  |
|       ✅        |   Lançamentos recentes  - Animes                 |
|       ✅        |   Rastreamento Correios                  |
|       ✅        |   Noticias Atuais                 |
|       ✅        |   Tradutor                |

### Administração de Grupo

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
|       ✅        |   Lista Negra  |
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
|       ✅       | Limitador de mensagens privadas (Anti-flood)
|       ✅        |   Sair do grupo                     |
|       ✅        |   Limpar somente chat de contatos                 |
|       ✅        |   Obter lista de usuários bloqueados                |
|       ✅        |   Modificar status atual do bot                |


## 7 - Solução de Problemas :

#### SOLUÇÃO DE PROBLEMAS - WINDOWS :
Só faça os passos abaixo se você tiver algum erro :

- Se houver um erro na inicialização e você não tiver o Google Chrome instalado, faça a instalação : https://www.google.com/intl/pt-BR/chrome/


#### SOLUÇÃO DE PROBLEMAS - LINUX :
Só faça os passos abaixo se você tiver algum erro :

- Se houve algum problema na inicialização do script:
   ```bash
    > wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    > sudo apt install ./google-chrome-stable_current_amd64.deb
    ```

- Se houver algum erro relacionado a permissão ao tentar usar o  "npm i"
    ```bash
    > npm i --unsafe-perm
    ```

**Obs**: Não conseguiu resolver? Entre em contato no [Passo 8](https://github.com/victorsouzaleal/lbot-whatsapp#8---d%C3%BAvidas)


## 8 - Dúvidas?
Entre em contato comigo pelo WhatsApp : https://wa.me/5521995612287

## 9 - Agradecimentos
* [`open-wa/wa-automate-nodejs`](https://github.com/open-wa/wa-automate-nodejs)
* [`MhankBarBar/whatsapp-bot`](https://github.com/MhankBarBar/whatsapp-bot)
