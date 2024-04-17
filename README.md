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

## Última Atualização : 17/04/2024 - v2.2.0
**[CÓDIGO]** Todos os módulos do projetos foram migrados do descontinuado CommonJS para ESM<br>
**[CÓDIGO]** Melhor filtragem nos tipos de mensagens que o bot receber, para evitar processamento desnecessário.<br>
**[COMANDO]** Comando **img** teve a api melhorada para minimizar erros e agora faz 3 tentativas de enviar uma imagem válida.<br>
**[COMANDO]** Comando **fb** atualizado para enviar o titulo e duração do vídeo, tendo agora limite máximo de 3 minutos<br>
**[CORREÇÃO]** Prefixo * que não estava funcionando foi corrigido.<br>
<br>


## REQUERIMENTOS :
- Um número de celular **SECUNDÁRIO** conectado ao WhatsApp para ler o QR Code e conectar o bot.
- [NODE VERSÃO LTS](https://nodejs.org/en/) 

<br>

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
**!admin** - Dá acesso ao MENU de ADMINISTRADOR/DONO DO BOT. (Precisa de configuração no .env, veja abaixo como)
<br><br>
Todos os comandos agora tem um guia ao digitar **!comando guia**
<br><br>

### Pronto! Seu bot já está ONLINE, mas ainda não acabou continue lendo o próximo passo para configuração!!
<br>


<br>

## 5 - Configuração do bot e arquivo .env :

### Ao abrir o arquivo .env na raiz do projeto após iniciar o bot pela primeira vez ele vai se parecer com isso : </br>
        ############ CONFIGURAÇÕES DO DONO ############# 
        # LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT.
        NUMERO_DONO=55219xxxxxxxx

        # NEWSAPI- Coloque abaixo sua chave API do site newsapi.org (NOTICIAIS ATUAIS)
        API_NEWS_ORG=?????

        # ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)
        acr_host=?????
        acr_access_key=?????
        acr_access_secret=?????

        # DEEPGRAM - Coloque abaixo sua chave do DEEPGRAM (Transcrição de aúdio para texto)
        dg_secret_key=??????


#### Como configurar o ADMINISTRADOR :
Para usar as funções de **ADMINISTRADOR** coloque o seu número principal que irá administrar o bot em **NUMERO_DONO**, com código do país (ex: Brasil é 55) e DDD (ex: Rio de Janeiro é 21).<br><br>
Reinicie o bot para as alterações terem efeito e agora você tem acesso aos comandos de **ADMIN**. Use **!nomebot**, **!nomeadm**, **!nomesticker** para personalizar o nome do seu bot em menus e em stickers, e veja todos os comandos de administrador com o **!admin**.

<br><br>

#### Como obter as chaves API para usar em comandos específicos :
Para usar comandos específicos como **!noticias**, **!qualmusica** e **!ouvir** é necessário antes configurar as chaves de API no .env, abaixo tem um guia completo com imagens para obter as chaves.<br><br>
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

#### 1 - MEU NÚMERO NO .ENV ESTÁ CORRETO MAS NÃO ME IDENTIFICOU COMO ADMINISTRADOR :
Se o seu número está correto no .env e ele não te indentifica como administrador tente tirar o 9 na frente do número, isso acontece porque em alguns DDD o WhatsApp não entende o 9 sendo parte do número do usuário.

<br>

#### 2 - COMANDO NÃO FUNCIONANDO :
Se algum comando por acaso não estiver funcionando antes de tentar baixar uma nova versão ou relatar o erro tente usar dentro da pasta do projeto o comando :
```bash
yarn install 
```
Esse comando atualiza as dependências e pode resolver algum problema que você tenha sem precisar baixar ou esperar uma nova versão do bot.<br><br>

**Obs**: Não conseguiu resolver? Entre em contato no [Passo 8](https://github.com/victorsouzaleal) 

<br>

## 8 - Contato/Doação (NÃO É O BOT, É O NUMERO APENAS PARA TIRAR DÚVIDAS OU AJUDAR COM O PROJETO)
Fiquem a vontade para tirar dúvida, ou se quiser ajudar com ideia ou com qualquer valor para o projeto. O projeto sempre será gratuito, mas não nego uma ajudinha para pagar a internet pelo menos hehe

* **WhatsApp :** https://wa.me/5521995612287
* **Chave PIX :** victorsouzaleal@gmail.com

## 9 - Agradecimentos
* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys)
