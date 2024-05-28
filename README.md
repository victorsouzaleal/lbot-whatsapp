<p align="center">
<img src="https://img95.pixhost.to/images/1083/472612217_8876.jpg" width="350" height="350"/>
</p>
<h1 align="center">🤖 LBot - Robô para WhatsApp 🤖</h1>
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
<p align="center">
<a href="https://github.com/victorsouzaleal"><img title="Autor" src="https://img.shields.io/badge/Autor-victorsouzaleal-blue.svg?style=for-the-badge&logo=github"></a>
</p>


<br>

## 🔄 Última Atualização : 27/05/2024 - v2.7.0
**[CÓDIGO]** A estrutura da mensagem recebida foi totalmente modificada para facilitar na criação de novos comandos.<br>
**[CORREÇÃO/TERMUX]** Correção e melhoria no arquivo de instalação no TERMUX.<br>
**[CORREÇÃO/COMANDO]** Corrigido o comando de grupo **dcmd** para desbloquear comandos em um grupo.<br>
**[CORREÇÃO/COMANDO]** Corrigido o comando **encurtar** para encurtar um link.<br>
<br>


## 🚨 REQUERIMENTOS :
- Um número de celular conectado ao WhatsApp para ler o QR Code e conectar o bot.
- Em sistemas **Windows/Linux** :<br>
        - Ter o [NODE VERSÃO LTS](https://nodejs.org/en/) instalado
- No **Termux** :<br>
        - Ter o [TERMUX](https://play.google.com/store/apps/details?id=com.termux&hl=pt_BR&gl=US) instalado no celular

<br>

## 1 - 💿 Instalação :

### 🖥️ Windows/Linux :

Faça o download da última versão lançada no seguinte link: https://github.com/victorsouzaleal/lbot-whatsapp/releases/latest , extraia o zip e entre na pasta do bot para os passos seguintes.

Abra o prompt de comando (terminal) **DENTRO DA PASTA DO PROJETO** e execute os comandos abaixo :

```bash
npm i -g yarn
```

Após terminar de instalar o yarn digite o comando abaixo para instalar as dependências do projeto :

```bash
yarn install
```

<br>

### 📱 Termux :
Para ver o guia de instalação no TERMUX :  [Clique AQUI](docs/TERMUX.md)

<br>

## 2 - 🤖 Uso :

**Dentro da pasta do projeto** após ter realizado todos os passos anteriores, execute este comando. 

```bash
yarn start
```

Se for a sua primeira vez executando escaneie o QR Code com o seu celular.

<br>

## 3 - ⌨️ Funcionamento :
Após todos os passos anteriores feitos, seu bot já deve estar iniciando normalmente, use os comandos abaixo para visualizar os comandos disponíveis.
<br><br>
**!menu** - Dá acesso ao MENU PRINCIPAL.
<br>
**!admin** - Dá acesso ao MENU de ADMINISTRADOR/DONO DO BOT.
<br><br>
Todos os comandos agora tem um guia ao digitar **!comando guia**
<br><br>

### Pronto! Seu bot já está ONLINE, mas ainda não acabou continue lendo o próximo passo para configuração!!

<br>

## 4 - ⚙️ Configuração do bot e arquivo .env :

### Ao abrir o arquivo .env na raiz do projeto após iniciar o bot pela primeira vez ele vai se parecer com isso : </br>
        # CONFIGURAÇÃO DE API KEYS PARA COMANDOS

        # ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)
        acr_host=?????
        acr_access_key=?????
        acr_access_secret=?????

        # DEEPGRAM - Coloque abaixo sua chave do DEEPGRAM (Transcrição de aúdio para texto)
        dg_secret_key=??????


#### Como configurar o ADMINISTRADOR :
Para usar as funções de **ADMINISTRADOR** digite **!admin** pela primeira vez ao iniciar ao BOT e ai seu número será cadastrado como dono.<br><br>
Pronto, agora você tem acesso aos comandos de **ADMIN**. Use **!nomebot**, **!nomeadm**, **!nomesticker** para personalizar o nome do seu bot em menus e em stickers, e veja todos os comandos de administrador com o **!admin**.

<br>

#### Como obter as chaves API para usar em comandos específicos :
Para usar comandos específicos como **!qualmusica** e **!ouvir** é necessário antes configurar as chaves de API no .env, abaixo tem um guia completo com imagens para obter as chaves.<br><br>
**Informações detalhadas sobre como obter as chaves do NewsAPI(Notícias), ACRCloud(Reconhecimento de Músicas) e DEEPGRAM (Áudio para texto)** :  [Clique AQUI](docs/CHAVESAPI.md)

<br>

## 5 - 🛠️ Recursos/Comandos :

### Figurinhas

| Criador de Sticker |                Recursos        |
| :-----------: | :--------------------------------: |
|       ✅       | Foto para Sticker |
|       ✅       | Video/GIF para Sticker |
|       ✅       | Sticker Circular (IMAGENS) |
|       ✅       | Texto para Sticker |
|       ✅       | Sticker sem fundo |
|       ✅       | Sticker para foto |
|       ✅       | Renomear Stickers |
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
|       ✅        |   Chat-GPT |
|       ✅        |   Criação de imagens IA |
|       ✅        |   Têndencias de Filmes/Séries |
|       ✅        |   Encurtar Links |
|       ✅        |   Upload de imagens |
|       ✅        |   Efeitos de Aúdio |
|       ✅        |   Texto para voz   |
|       ✅        |   Áudio para texto |
|       ✅        |   Letra de Música  |
|       ✅        |   Reconhecimento de músicas |
|       ✅        |   Detector de DDD |
|       ✅        |   Consulta de Clima/Previsão do Tempo |
|       ✅        |   Conversão de Moedas |
|       ✅        |   Calculadora básica  |
|       ✅        |   Pesquisa Web        |
|       ✅        |   Detector Anime      |
|       ✅        |   Rastreamento Correios |
|       ✅        |   Noticias Atuais |
|       ✅        |   Tradutor |

<br>

**Veja todos os recursos/comandos do bot** :  [Clique AQUI](docs/COMANDOS.md)

<br>

## 6 - 👤 Contato
Fiquem a vontade para tirar dúvida, ou se quiser ajudar com ideia ou com qualquer valor para o projeto. O projeto sempre será gratuito, mas não nego uma ajudinha para pagar a internet pelo menos hehe

* **Discord :** victorsouzaleal
* **Email :** victorsouzaleal@gmail.com

<br>

## 7 - 🙏 Agradecimentos/Contribuições

* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys) - Biblioteca Baileys.
* [`Samuel/samucacastro`](https://github.com/samucacastro) - Desenvolvimento de API's

