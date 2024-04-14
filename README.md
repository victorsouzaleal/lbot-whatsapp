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
<a href="#"><img title="Atualizacao" src="https://img.shields.io/badge/atualizado-SIM-blue.svg"/></a>
</p>

<h3 align="center">
    Estou voltando a atualizar o bot, para contato e ajuda com a projeto vá para o <a href="#8---contatodoação-não-é-o-bot-é-o-numero-apenas-para-tirar-dúvidas-ou-ajudar-com-o-projeto">Passo 8</a>
</h3>
<br>

## Última Atualização : 14/04/2024 - v2.00.0
**[REFEITO]** Projeto foi reescrito para a biblioteca do Baileys<br>
**[MELHORIA]** O celular agora não precisa ficar sempre conectado.<br>
**[MELHORIA]** Melhoria gerais em comandos de download.<br>
**[MELHORIA]** Melhoria gerais em exibição de erros dos comandos.<br>
**[NOVO]** Comando !ouvir para transformar áudio em texto.<br>
<br>
OBRIGATÓRIO INSTALAR DO ZERO PARA QUE TUDO FUNCIONE CORRETAMENTE.
<br>

## REQUERIMENTOS :
- Um número de celular secundário para usar o bot.
- [NODE VERSÃO LTS](https://nodejs.org/en/) 

Isso tudo é necessário para o bot funcionar corretamente.

## 1 - Faça download da ultima versão :
Faça o download da última versão lançada no link abaixo (extraia o zip e entre na pasta para os passos seguintes):
https://github.com/victorsouzaleal/lbot-whatsapp/releases/latest

<br>

## 2 - Instale as dependências :
Abra o prompt de comando (CMD/Terminal) na **PASTA DO PROJETO QUE VOCÊ EXTRAIU** e execute os comandos abaixo :

```bash
npm i --global yarn
```

Após terminar de instalar o yarn digite o comando abaixo para instalar as dependências do projeto :

```bash
yarn install
```

#### Obs: Se houver algum erro vá para o [Passo 7](https://github.com/victorsouzaleal/lbot-whatsapp#7---solu%C3%A7%C3%A3o-de-problemas-)

<br>

## 3 - Uso :

**Dentro da pasta do projeto** após ter realizado todos os passos anteriores, execute este comando. 

```bash
yarn start
```

Se for a sua primeira vez executando escaneie o QR Code com o seu celular, bot será reiniciado para criar os arquivos necessários e você deverá inicia-lo novamente.
<br><br>


<br>

## 4 - Funcionamento :
Após todos os passos anteriores feitos, seu bot já deve estar iniciando normalmente, use os comandos abaixo para visualizar os comandos disponíveis.
<br><br>
**!menu** - Dá acesso ao MENU PRINCIPAL.
<br>
**!admin** - Dá acesso ao MENU de ADMINISTRADOR/DONO DO BOT.
<br><br>
Todos os comandos agora tem um guia ao digitar **!comando guia**

### Pronto! Seu bot já está funcionando!!

**Obs**: Se você deseja utilizar os comandos **!noticias** (noticias atuais), **!qualmusica**(reconhecimento de músicas) , **!ouvir** (áudio para texto)  e comandos de **ADMIN** vá para o **passo 5**.

<br>

## 5 - Configuração do arquivo .env :

#### Abra o arquivo .env na raiz do projeto e edite manualmente : </br>
        #############  DADOS DO BOT ############# 

        NOME_ADMINISTRADOR= Digite seu nome
        NOME_BOT= Digite o nome que o bot vai ter
        NOME_AUTOR_FIGURINHAS = Digite o nome que vai aparecer como autor das figurinhas

        ############ CONFIGURAÇÕES DO BOT ############# 
        # LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT.
        NÚMERO_DONO = SEU número com o código do país incluido. ex: 55219xxxxxxxx

        # NEWSAPI - NOTICIAS 
        API_NEWS_ORG = recebe a chave da conta que voce criar no site newsapi.org 

        # ACRCLOUD - RECONHECIMENTO DE MÚSICAS
        acr_host= recebe seu endereço de host obtido no https://acrcloud.com/
        acr_access_key= recebe seu access_key obtido no https://acrcloud.com/
        acr_access_secret= recebe seu access_secret obtido no https://acrcloud.com/

        # DEEPGRAM - Coloque abaixo sua chave do DEEPGRAM (Transcrição de aúdio para texto)
        dg_secret_key= recebe a chave da conta que voce criar no site https://deepgram.com/

**Obs**: Para usar as funções de administrador coloque o seu número principal que irá administrar o bot em **NUMERO_DONO**<br>

**Informações detalhadas sobre como obter as chaves do NewsAPI(Notícias), ACRCloud(Reconhecimento de Músicas) e DEEPGRAM (Áudio para texto)** :  [Clique AQUI](CHAVESAPI.md)

<br>

## 6 - Recursos Principais :

### Figurinhas

| Criador de Sticker |                Recursos        |
| :-----------: | :--------------------------------: |
|       ✅       | Foto para Sticker     |
|       ✅       | Sticker para foto              |
|       ✅       | Video/GIF para Sticker |
|       ✅       | Sticker circular |
|       ✅       | Auto Sticker |

### Downloads 

| Downloads      |                Recursos            |
| :------------: | :---------------------------------------------: |
|       ✅        |   Download de aúdio/videos (Youtube)    |
|       ✅        |   Download de videos (Facebook)            |
|       ✅        |   Download de imagens/videos (Instagram)  |
|       ✅        |   Download de imagens/videos (Twitter)            |
|       ✅        |   Download de videos (Tiktok)            |
|       ✅        |   Pesquisa/Download de Imagens                  |

### Utilidades Gerais

| Utilitários |                     Recursos            |
| :------------: | :---------------------------------------------: |
|       ✅       | Efeitos de Aúdio
|       ✅        |   Texto para voz                   |
|       ✅        |   Áudio para texto                   |
|       ✅        |   Letra de Música              |
|       ✅        |   Reconhecimento de músicas                 |
|       ✅        |   Detector de DDD             |
|       ✅        |   Consulta de Clima/Previsão do Tempo            |
|       ✅        |   Conversão de Moedas           |
|       ✅        |   Calculadora básica           |
|       ✅        |   Pesquisa Web                  |
|       ✅        |   Detector Anime                  |
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
|       ✅        |   Auto Sticker |
|       ✅        |   Anti Fake |
|       ✅        |   Anti Link  |
|       ✅        |   Anti Flood  |
|       ✅        |   Contagem de mensagens |
|       ✅        |   Marcar inativos |
|       ✅        |   Banir inativos |
|       ✅        |   Bloquear/Desbloquear Comandos |
|       ✅        |   Enquete |
|       ✅        |   Banir Todos  |
|       ✅        |   Apagar mensagens do bot  |

### Administração de Dono

| Apenas Dono do Bot  |              Recurso           |
| :------------: | :---------------------------------------------: |
|       ✅        |   Entrar em um grupo                 |
|       ✅        |   Sair de todos os grupos                  |
|       ✅        |   Broadcast - Grupos                  |
|       ✅        |   Bloquear/Desbloquear usuário                     |
|       ✅        |   Sistema de Tipos de Usuários        |
|       ✅        |   Limitador comandos diários (por usuário)            |
|       ✅        |   Limitador de comandos por minuto (por usuário)          |
|       ✅        |   Limitador de mensagens privadas (Anti-flood)    |
|       ✅        |   Auto Sticker Privado   |
|       ✅        |   Sair do grupo                     |
|       ✅        |   Obter lista de usuários bloqueados                |
|       ✅        |   Modificar status atual do bot                |

<br>

## 7 - Solução de Problemas :

#### SOLUÇÃO DE PROBLEMAS - WINDOWS :
Só faça os passos abaixo se você tiver algum erro :

- Se houver um erro na inicialização ou o comando !yt não funcionar corretamente, faça a instalação do Google Chrome : https://www.google.com/intl/pt-BR/chrome/


#### SOLUÇÃO DE PROBLEMAS - LINUX :
Só faça os passos abaixo se você tiver algum erro :

- Se houve algum problema na inicialização do script, instale o Google Chrome:
   ```bash
    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
    sudo apt install ./google-chrome-stable_current_amd64.deb
    ```

#### SOLUÇÃO DE PROBLEMAS - COMANDO NÃO FUNCIONANDO :
Se algum comando por acaso não estiver funcionando antes de tentar baixar uma nova versão ou relatar o erro tente usar dentro da pasta do projeto o comando :
```bash
yarn install 
```
Esse comando atualiza as dependências e pode resolver algum problema que você tenha sem precisar baixar ou esperar uma nova versão do bot.<br><br>

**Obs**: Não conseguiu resolver? Entre em contato no [Passo 8](https://github.com/victorsouzaleal)

## 8 - Contato/Doação (NÃO É O BOT, É O NUMERO APENAS PARA TIRAR DÚVIDAS OU AJUDAR COM O PROJETO)
Fiquem a vontade para tirar dúvida, ou se quiser ajudar com ideia ou com qualquer valor para o projeto. O projeto sempre será gratuito, mas não nego uma ajudinha para pagar a internet pelo menos hehe

* **WhatsApp :** https://wa.me/5521995612287
* **Chave PIX :** victorsouzaleal@gmail.com

## 9 - Agradecimentos
* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys)
