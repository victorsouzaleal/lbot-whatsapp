# Tutorial para obter as chaves das API's

## 1 - ACRCloud - Reconhecimento de Músicas

#### Limite Gratuito: 14 dias de uso ou 5000 reconhecimentos, após isso o limite é de 100 reconhecimentos/dia.

### Crie uma conta no site https://console.acrcloud.com/avr?region=eu-west-1#/register

**IMPORTANTE**: Se houver algum problema para chegar a mensagem de verificação de email, crie outra conta usando qualquer VPN (Geralmente quando é a sua primeira conta sempre chega a mensagem, mas a partir da segunda pode ser necessário o uso do VPN)

Após a conta criada, email verificado e um formulário básico inicial preenchido.. Você chegará nesta tela, clique em **Audio & Video Recognition**
<img src="https://i.imgur.com/CeKSsjO.png"/>

Abra a aba de **Projects** e clique em **Audio & Video Recognition**
<img src="https://i.imgur.com/owgNhyv.png"/>

Agora clique em **Create Project** e depois preencha os dados como mostrado abaixo:
<img src="https://i.imgur.com/530RtLA.png"/>

Nessa tela agora você tem seu **acr_host**, **acr_access_key** e **acr_access_secret** respectivamente, copie eles e coloque-os no .env do Bot.

<img src="https://i.imgur.com/BA8aUA5.png"/>

### Pronto, você já tem suas chaves ACRCloud configuradas .

## 2 - DEEPGRAM - Transcrição Áudio para Texto

#### Limite Gratuito: $200 em transcrição, que é equivalente a aproximadamente 750 horas em transcrição.

### Crie uma conta no site https://console.deepgram.com/signup

Após a conta criada você chegará nesta tela, clique em **Create API Key**
<img src="https://i.imgur.com/2MFfmga.png">

Abrirá essa janela, preencha o nome que quiser e deixe marcado as opções abaixo, então confirme em **Create Key**
<img src="https://i.imgur.com/3YKuyKh.png">

Agora nessa janela já é a sua chave, copie a chave e clique em **Got It** para encerrar e agora coloque no seu .env no campo **dg_secret_key**
<img src="https://i.imgur.com/OSae2lZ.png">


### Pronto, você já tem sua chave DEEPGRAM configurada .


