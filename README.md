<p align="center">
<img src="https://img95.pixhost.to/images/1083/472612217_8876.jpg" width="350" height="350"/>
</p>
<h1 align="center">🤖 LBot - Robô para WhatsApp</h1>
<p align="center">
<a href="https://hits.seeyoufarm.com"><img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fvictorsouzaleal%2Flbot-whatsapp&count_bg=%234dc61f&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=visualizacoes&edge_flat=false"/></a>
<a href="#"><img title="Versão" src="https://img.shields.io/github/package-json/v/victorsouzaleal/lbot-whatsapp?label=vers%C3%A3o&color=#79C83D"/></a>
<a href="https://github.com/victorsouzaleal/followers"><img title="Seguidores" src="https://img.shields.io/github/followers/victorsouzaleal?label=seguidores&style=flat&color=#79C83D"/></a>
<a href="https://github.com/victorsouzaleal/lbot-whatsapp/stargazers/"><img title="Estrelas" src="https://img.shields.io/github/stars/victorsouzaleal/lbot-whatsapp?label=estrelas&style=flat&color=#79C83D"></a>
<a href="https://github.com/victorsouzaleal/lbot-whatsapp/watchers"><img title="Acompanhando" src="https://img.shields.io/github/watchers/victorsouzaleal/lbot-whatsapp?label=acompanhando&style=flat&color=#79C83D"></a>
<a href="https://github.com/victorsouzaleal"><img title="Autor" src="https://img.shields.io/badge/autor-victorsouzaleal-blue.svg?logo=github&color=#79C83D"></a>
</p>

<br>

<h2 align="center"> 🔄 Notas de atualização: <a href="https://github.com/victorsouzaleal/lbot-whatsapp/blob/main/docs/CHANGELOG.md">AQUI</a>  </h2>

<br>

## 🚨 REQUERIMENTOS :
- Um **número de celular conectado ao WhatsApp** para ler o QR Code e conectar o bot. <br>
- Um **computador com sistema Windows/Linux** ou um **smartphone Android** para executar a aplicação.<br>

<br>

## 1 - 💿 Instalação :

### 🖥️ Windows/Linux :

Antes da instalação você tem que instalar os programas abaixo, no Windows é só instalar pelo link indicado e no Linux você tem que pesquisar qual é o comando para instalar na sua distribuição.
- Git 64-bit - [DOWNLOAD](https://git-scm.com/downloads/win)<br>
- Node.js LTS - [DOWNLOAD](https://nodejs.org/en/)<br><br>


Faça o download do **.zip** da [ultima versão lançada](https://github.com/victorsouzaleal/lbot-whatsapp/releases/latest)<br>

Extraia o **.zip**, entre na pasta e abra o **terminal/prompt de comando** do seu sistema **dentro dessa pasta** para executar o comando abaixo:

```bash
npm i -g yarn && yarn install
```
<br>

**OBS**: Caso o comando retorne erro no **Linux** você vai precisar se elevar a superusuário utilizando **sudo** antes do comando.<br><br>

Quando o comando terminar você pode iniciar o bot com o comando abaixo:
```bash
yarn start
```
<br>

Se tudo der certo será solicitado para ler o QR Code no terminal, pegue seu celular e faça a leitura do QR Code com seu aplicativo do **WhatsApp**.

<br>

### 📱 Termux :

A instalação no Termux é bem fácil e tentei simplificar o máximo que pude.<br>


Abra o **Termux** comece usando este comando para instalar automaticamente o bot, isso pode demorar algum tempo até instalar tudo.
```bash
pkg install wget -y && wget -O - bit.ly/lbot-whatsapp | bash
```
<br>

Se tudo der certo será solicitado para ler o QR Code no terminal, pegue seu celular e faça a leitura do QR Code com seu aplicativo do **WhatsApp**.<br><br>

Caso você feche o Termux e queira iniciar o bot novamente faça o comando abaixo:
```bash
cd LBOT && yarn start
```


<br><br>

## 2 - 🤖 Uso :

Seu bot já deve estar iniciando normalmente após o passo anterior, use os comandos abaixo para visualizar os comandos disponíveis.

<br>

**!menu** - Dá acesso ao **menu principal**.<br>
**!admin** - Dá acesso ao **menu de administrador**.

<br>

Todos os comandos tem um guia ao digitar: **!comando** guia

<br>

## 3 - ⚙️ Configuração do bot:

### Como configurar o DONO:
Para usar as funções de **administrador** digite **!admin** pela primeira vez ao iniciar ao bot e ai seu número será cadastrado como dono.<br><br>
Pronto, agora você tem acesso aos comandos de **ADMIN**. Use **!nomebot**, **!nomeautor**, **!nomepack** para personalizar o nome do seu bot em menus e em stickers, e veja todos os comandos de administrador com o **!admin**.<br><br>

### Como obter as chaves API para uso em comandos específicos :
Para usar comandos específicos como **!qualmusica** e **!ouvir** é necessário antes configurar as chaves de API, abaixo tem um guia completo com imagens para obter as chaves.<br>

**Informações detalhadas sobre como obter as chaves do ACRCloud(Reconhecimento de Músicas) e DEEPGRAM (Áudio para texto)** :  [Clique Aqui](docs/CHAVESAPI.md)

<br>

## 4 - 🛠️ Recursos/Comandos :

### 🖼️ Figurinhas
- Foto para sticker
- Video/GIF para sticker
- Sticker para foto
- EmojiMix
- Renomear sticker
- Auto sticker

### 📥 Downloads 
- Youtube (video/audio)
- Facebook (video)
- Instagram (video/imagem)
- X (video/imagem)
- Tiktok (video)
- Google (imagem)

### ⚒️ Utilidades Gerais
- Pergunte a IA 
- Criação de imagens com IA
- Brasileirão A/B 
- Têndencias de filmes/séries
- Encurtar links 
- Upload de imagens 
- Efeitos de aúdio 
- Texto para voz 
- Áudio para texto 
- Letra de música 
- Reconhecimento de músicas  
- Detector de DDD 
- Detector anime 
- Consulta de Clima/Previsão do Tempo
- Conversão de moedas
- Calculadora 
- Pesquisa Google      
- Noticias Google 
- Tradutor Google

<br>

### 👉 E muito mais... [Clique Aqui](docs/COMANDOS.md)

<br>

## 5 - 👤 Contato
Caso tenha algum problema ou queira ajudar de alguma forma com o projeto. Estou também procurando alguem que possa oferecer um número de WhatsApp
para eu deixar o bot rodando para o público.

* **Email**: victorsouzaleal@gmail.com
* **WhatsApp (NÃO É O BOT, É MEU CONTATO PESSOAL PELO AMOR DE DEUS)**: https://wa.me/5521995612287

<br>

## 6 - 🙏 Agradecimentos

* A minha mãe e o meu pai que me fizeram com muito amor
* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys) - Por disponibilizar a biblioteca Baileys e dar suporte no Discord principalmente a nós brasileiros.