<p align="center">
<img src="https://img95.pixhost.to/images/1083/472612217_8876.jpg" width="350" height="350"/>
</p>
<h1 align="center">🤖 LBot - Robô para WhatsApp 🤖</h1>
<p align="center">
<a href="https://www.codefactor.io/repository/github/victorsouzaleal/lbot-whatsapp"><img src="https://img.shields.io/codefactor/grade/github/victorsouzaleal/lbot-whatsapp?label=qualidade&color=#79C83D" alt="CodeFactor" /></a>
</p>
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
- Um número de celular conectado ao WhatsApp para ler o QR Code e conectar o bot.
- Em sistemas **Windows/Linux** :<br>
        - Ter o [NODE VERSÃO LTS](https://nodejs.org/en/) instalado
- No **Termux** :<br>
        - Ter o [TERMUX](https://github.com/termux/termux-app/releases/download/v0.118.1/termux-app_v0.118.1+github-debug_universal.apk) instalado no celular

<br>

## 1 - 💿 Instalação :

### 🖥️ Windows/Linux :

Faça o download da última versão lançada no seguinte link: https://github.com/victorsouzaleal/lbot-whatsapp/releases/latest , extraia o zip e entre na pasta do bot para os passos seguintes.

Abra o prompt de comando (terminal) **DENTRO DA PASTA DO PROJETO** e execute os comandos abaixo :


#### Instalação do yarn (se estiver no Linux use sudo antes do comando)
```bash
npm i -g yarn
```

#### Instalação das dependências do projeto
```bash
yarn install
```

<br>

### 📱 Termux :
Para ver o guia de instalação no TERMUX :  [Clique AQUI](docs/TERMUX.md) 

<br><br>

## 2 - 🤖 Uso :

### Após ter realizado todos os passos anteriores, execute este comando "DENTRO DA PASTA DO PROJETO".

```bash
yarn start
```

Após a primeira inicialização escaneie o QR Code com o seu celular.

<br>

## 3 - ⌨️ Funcionamento :

### Seu bot já deve estar iniciando normalmente, use os comandos abaixo para visualizar os comandos disponíveis.<br><br>

**!menu** - Dá acesso ao **menu principal**.<br>
**!admin** - Dá acesso ao **menu de administrador**.

<br>

Todos os comandos tem um guia ao digitar: **!comando** guia<br><br>

## 4 - ⚙️ Configuração do bot:

### Como configurar o DONO:
Para usar as funções de **administrador** digite **!admin** pela primeira vez ao iniciar ao bot e ai seu número será cadastrado como dono.<br><br>
Pronto, agora você tem acesso aos comandos de **ADMIN**. Use **!nomebot**, **!nomeautor**, **!nomepack** para personalizar o nome do seu bot em menus e em stickers, e veja todos os comandos de administrador com o **!admin**.<br><br>

### Como obter as chaves API para usar em comandos específicos :
Para usar comandos específicos como **!qualmusica** e **!ouvir** é necessário antes configurar as chaves de API, abaixo tem um guia completo com imagens para obter as chaves.<br>

**Informações detalhadas sobre como obter as chaves do ACRCloud(Reconhecimento de Músicas) e DEEPGRAM (Áudio para texto)** :  [Clique AQUI](docs/CHAVESAPI.md)

<br>

## 5 - 🛠️ Recursos/Comandos :

### 🖼️ Figurinhas
- Foto para sticker ✅
- Video/gif para sticker ✅
- Sticker para foto ✅
- Renomear sticker ✅
- Auto sticker ✅

### 📥 Downloads 
- Youtube (video/audio) ✅
- Facebook (video) ✅
- Instagram (video/imagem) ✅
- Twitter (video/imagem) ✅
- Tiktok (video) ✅
- Google (imagem) ✅

### ⚒️ Utilidades Gerais
- Chat-GPT ✅
- Criação de imagens IA ✅
- Brasileirão A/B ✅
- Têndencias de Filmes/Séries ✅
- Encurtar Links ✅
- Upload de imagens ✅
- Efeitos de Aúdio ✅
- Texto para voz ✅
- Áudio para texto ✅
- Letra de Música ✅
- Reconhecimento de músicas ✅ 
- Detector de DDD ✅
- Consulta de Clima/Previsão do Tempo ✅
- Conversão de Moedas ✅
- Calculadora ✅
- Pesquisa Google ✅      
- Detector Anime ✅     
- Noticias Google ✅ 
- Tradutor Google ✅

<br>

### 👉 E muito mais... [Clique AQUI](docs/COMANDOS.md)

<br>

## 6 - 💻 Solução de problemas

### Termux
Algumas pessoas podem ter problemas para instalar as depêndencias no Termux, isso pode ser pelo fato da conexão a internet não estar estável o suficiente ou a versão do Termux estar desatualizada, o Termux da Play Store não é atualizada faz anos por isso eu forneço aqui um apk oficial dos desenvolvedores do Termux.

* **Termux APK :** https://github.com/termux/termux-app/releases/download/v0.118.1/termux-app_v0.118.1+github-debug_universal.apk

<br>

## 7 - 👤 Contato
Caso queira entrar em contato eu tento responder aos emails, ou abra uma issue aqui no GitHub explicando o problema.

* **Email**: victorsouzaleal@gmail.com

<br>

## 8 - 🙏 Agradecimentos

* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys) - Biblioteca Baileys.

