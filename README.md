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
<h3 align="center">⭐ Atualizações toda Sexta-Feira, em outros dias somente em emergência.</h3>


<br>

## 🔄 Última Atualização : 07/06/2024 - v2.8.0
**[ALTERAÇÃO]** Antes de iniciar o bot verifica qual a última versão do WhatsApp Web e usa ela.<br>
**[ALTERAÇÃO]** O sistema de tipo de usuário foi melhorado e agora é possivel criar, deletar e modificar o titulo de exibição em menus de cada tipo.<br>
**[NOVO]** Comando de admin **novotipo** para criar um novo tipo de usuário.<br>
**[NOVO]** Comando de admin **deltipo** para deletar um tipo de usuário.<br>
**[NOVO]** Comando de admin **tipotitulo** para modificar o titulo de exibição de um tipo de usuário.<br>
**[ALTERAÇÃO]** Comando de admin **alterartipo** foi alterado para **usuariotipo**.<br>
**[ALTERAÇÃO]** Comando de admin **taxalimite** foi alterado para **taxacomandos**.<br>
**[ALTERAÇÃO]** Comando de admin **mudarlimite** foi alterado para **tipocomandos**.<br>
**[ALTERAÇÃO]** Comando de admin **infocompleta** foi alterado para **infobot**.<br>
**[ALTERAÇÃO]** Comando de grupo **f** foi alterado para **restrito**.<br>
**[ALTERAÇÃO]** Comando de grupo **blista** foi alterado para **addlista**.<br>
**[ALTERAÇÃO]** Comando de grupo **dlista** foi alterado para **remlista**.<br>
**[ALTERAÇÃO]** Comando de admin **usuarios** agora exibe por padrão todos os usuários do tipo "comum" se nenhum tipo for especificado.<br>
**[ALTERAÇÃO]** Comando de admin **tipos** agora exibe quantos usuários tem em cada tipo.<br>
**[ALTERAÇÃO]** Comando de admin **taxacomandos** agora tem como tempo de bloqueio padrão 60 segundos se nenhum tempo de bloqueio for especificado.<br>
**[CODIGO]** Refatoração e correções gerais no código.
<br>


## 🚨 REQUERIMENTOS :
- Um número de celular conectado ao WhatsApp para ler o QR Code e conectar o bot.
- Em sistemas **Windows/Linux** :<br>
        - Ter o [NODE VERSÃO LTS](https://nodejs.org/en/) instalado
- No **Termux** :<br>
        - Ter o [TERMUX](https://github.com/termux/termux-app/releases/download/v0.118.0/termux-app_v0.118.0+github-debug_universal.apk) instalado no celular

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

### 🖼️ Figurinhas
- Foto para sticker ✅
- Video/gif para sticker ✅
- Texto para sticker ✅
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
- Rastreamento Correios ✅ 
- Noticias Google ✅ 
- Tradutor Google ✅

<br>

### 👉 E muito mais... [Clique AQUI](docs/COMANDOS.md)

<br>

## 6 - 👤 Contato
Fiquem a vontade para tirar dúvida, ou se quiser ajudar com ideia ou com qualquer valor para o projeto. O projeto sempre será gratuito, mas não nego uma ajudinha para pagar a internet pelo menos hehe

* **Discord :** victorsouzaleal
* **Email :** victorsouzaleal@gmail.com

<br>

## 7 - 🙏 Agradecimentos/Contribuições

* [`WhiskeySockets/Baileys`](https://github.com/WhiskeySockets/Baileys) - Biblioteca Baileys.
* [`Samuel/samucacastro`](https://github.com/samucacastro) - Desenvolvimento de API's

