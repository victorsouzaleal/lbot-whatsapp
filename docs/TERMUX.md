## Instalação no TERMUX

A instalação no Termux é um pouco diferente e vai precisar instalar alguns requerimentos antes de iniciar o bot.

### 1 - No Termux comece usando este comando para atualizar os pacotes e instalar o GIT.
```bash
pkg update && yes | pkg upgrade && pkg install git -y
```

### 2 - Após o GIT ser instalado vamos baixar o projeto do Bot e entrar na pasta.
```bash
git clone https://github.com/victorsouzaleal/lbot-whatsapp.git && cd lbot-whatsapp
```

### 3 - Instale as dependencias com o comando abaixo :
```bash
sh termux_reqs.sh
```

### 4 - Agora com os passos anteriores feitos agora vamos voltar a instalação normal do bot
```bash
yarn install
```

### 5 - Tudo pronto, agora é só iniciar o bot com o comando abaixo.
```bash
yarn start
```

<br>

### As demais informações de como configurar e usar os comandos estão no [READ ME](/README.md)


