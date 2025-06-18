<p align="center">
<img src="https://img95.pixhost.to/images/1083/472612217_8876.jpg" width="350" height="350"/>
</p>
<h1 align="center">🤖 LBot - Robô para WhatsApp</h1>
<p align="center">
<a href="#"><img title="Versão" src="https://img.shields.io/github/package-json/v/victorsouzaleal/lbot-whatsapp?label=vers%C3%A3o&color=#79C83D"/></a>
<a href="https://github.com/victorsouzaleal/followers"><img title="Seguidores" src="https://img.shields.io/github/followers/victorsouzaleal?label=seguidores&style=flat&color=#79C83D"/></a>
<a href="https://github.com/victorsouzaleal/lbot-whatsapp/stargazers/"><img title="Estrelas" src="https://img.shields.io/github/stars/victorsouzaleal/lbot-whatsapp?label=estrelas&style=flat&color=#79C83D"></a>
<a href="https://github.com/victorsouzaleal/lbot-whatsapp/watchers"><img title="Acompanhando" src="https://img.shields.io/github/watchers/victorsouzaleal/lbot-whatsapp?label=acompanhando&style=flat&color=#79C83D"></a>
<a href="https://github.com/victorsouzaleal"><img title="Autor" src="https://img.shields.io/badge/autor-victorsouzaleal-blue.svg?logo=github&color=#79C83D"></a>
</p>

<br>
<h2 align="center"> Esse projeto não está sendo mais atualizado</h2>
<h2 align="center"> 🔄 Notas de atualização: <a href="https://github.com/victorsouzaleal/lbot-whatsapp/blob/main/docs/CHANGELOG.md">AQUI</a></h2>

<br>

## 🚨 REQUERIMENTOS
- Conhecimento básico de informática. <br>
- Um **número de celular conectado ao WhatsApp** para conectar o bot. <br>
- Um **computador com sistema Windows/Linux** ou um **smartphone Android** para executar a aplicação.<br>

<br>

## 💿 Instalação

### 🖥️ Desktop (Windows/Linux)

Antes da instalação você tem que instalar os programas abaixo, no Windows é só instalar pelo link indicado e no Linux você tem que pesquisar qual é o comando para instalar na sua distribuição.
- Git 64-bit - [DOWNLOAD](https://git-scm.com/downloads/win)<br>
- Node.js LTS - [DOWNLOAD](https://nodejs.org/en/)<br><br>

Faça o download do **.zip** da última versão lançada [AQUI](https://github.com/victorsouzaleal/lbot-whatsapp/releases/latest), extraia o **.zip** e abra o **terminal/prompt de comando** dentro do local extraído.

<br>

**TODOS OS COMANDOS ABAIXO DEVEM SER EXECUTADOS NO TERMINAL/PROMPT DE COMANDO DENTRO DA PASTA EXTRAÍDA DO BOT!!** 

<br>

Se for a sua primeira vez instalando o bot você vai ter que digitar esse comando para instalar o **Yarn**
```bash
npm i -g yarn
```

**OBS**: Caso o comando retorne erro no **Linux** você vai precisar se elevar a superusuário utilizando **sudo** antes do comando.

<br>

Após instalar o **Yarn** ou se ele já tiver instalado, você só precisa iniciar o bot com o comando abaixo:
```bash
yarn start
```

<br>

É normal demorar na primeira vez será feito o download de todas as dependências, se tudo der certo será perguntado se você quer se conectar com **QR Code** ou **Código de Pareamento**, faça a sua escolha e se conecte com o aplicativo do WhatsApp. 

<br>

### 📱 Smartphone (Android)

Faça a instalação do .apk mais atual do Termux: [AQUI](https://github.com/termux/termux-app/releases/download/v0.118.2/termux-app_v0.118.2+github-debug_universal.apk).

Abra o **Termux** comece usando este comando para fazer o download e instalação do bot, isso pode demorar algum tempo até instalar tudo.
```bash
pkg install wget -y && wget -O - tinyurl.com/lbot-termux | bash && cd ~/LBOT && yarn start
```
<br>

É normal demorar na primeira vez será feito o download de todas as dependências, se tudo der certo será perguntado se você quer se conectar com **QR Code** ou **Código de Pareamento**, faça a sua escolha e se conecte com o aplicativo do WhatsApp. 

<br>
<br>

Caso você feche o Termux e queira iniciar o bot novamente faça o comando abaixo:
```bash
cd ~/LBOT && yarn start
```

<br>
<br>

## 🤖 Uso

Seu bot já deve estar iniciando normalmente após o passo anterior, use os comandos abaixo para visualizar os comandos disponíveis.

<br>

**!menu** - Dá acesso ao **menu principal**.<br>
**!admin** - Dá acesso ao **menu de administrador**.

<br>

Todos os comandos tem um guia ao digitar: **!comando** guia

<br>

## ⚙️ Administração do bot/grupo

Como ver os comandos de administração geral do **BOT**? <br>
Envie **!admin** para o WhatsApp do bot e seu número será cadastrado como dono, após ser cadastrado você pode usar o **!admin** para ter acesso ao **menu do administrador**

<br>

Como ver os comandos de administração do **GRUPO**? <br>
Se você for administrador do grupo envie **!menu 5** dentro de um grupo para ter acesso ao menu completo do grupo, caso você não seja administrador do grupo você só terá acesso a um menu limitado.

<br>

## 🛠️ Recursos/Comandos

### 🖼️ Figurinhas
Diversos comandos para criação de figurinhas

### 📥 Downloads 
Diversos comandos para download de mídias das principais redes sociais : X, Youtube, Instagram, TikTok...

### ⚒️ Utilidades Gerais
Diversos comandos de utilidades como encurtar link, editar áudio, obter letra de música, etc...

### 👾 Entretenimento
Diversos comandos para entretenimento do grupo

### 👨‍👩‍👦‍👦 Administração de Grupo
Diversos comandos de grupo para ajudar na administração

### ⚙️ Administração geral do bot
Diversos para administrar o bot e ter controle sobre ele.

<br>

### 👉 Lista completa de comandos... [Clique Aqui](docs/COMANDOS.md)

<br>

## 🙏 Agradecimentos

* A minha mãe e o meu pai que me fizeram com muito amor
* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys) - Por disponibilizar a biblioteca Baileys e dar suporte no Discord principalmente a nós brasileiros.
