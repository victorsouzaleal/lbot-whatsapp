# Tutorial para obter as chaves das API's

## 1 - ACRCloud - Reconhecimento de Músicas

#### Limite Gratuito: 14 dias de uso ou 5000 reconhecimentos, após isso o limite é de 100 reconhecimentos/dia.

#### 1.1 - Crie uma conta no site https://console.acrcloud.com/avr?region=eu-west-1#/register

**IMPORTANTE**: Se houver algum problema para chegar a mensagem de verificação de email, crie outra conta usando qualquer VPN (Geralmente quando é a sua primeira conta sempre chega a mensagem, mas a partir da segunda pode ser necessário o uso do VPN)

<br>

#### 1.2 - Após a conta criada, email verificado e um formulário básico inicial preenchido.. Você chegará nesta tela, clique em "Audio & Video Recognition"

<br>

<img src="https://i.imgur.com/CeKSsjO.png"/>

<br>

#### 1.3 - Abra a aba de "Projects" e clique em "Audio & Video Recognition"

<br>

<img src="https://i.imgur.com/owgNhyv.png"/>

<br>

#### 1.4 - Agora clique em "Create Project" e depois preencha os dados como mostrado abaixo:

<br>

<img src="https://i.imgur.com/530RtLA.png"/>

<br>

#### 1.5 - Nessa tela agora você tem seu "host", "access_key" e "secret_key" respectivamente, substitua os valores no comando abaixo separando por virgulas e envie para o bot: 

<br>

Comando : !api acrcloud, **host**, **access_key**,  **secret_key**

<br>

<img src="https://i.imgur.com/BA8aUA5.png"/>

### Pronto, você já tem suas chaves ACRCloud configuradas .

<br>
<br>
<br>

## 2 - DEEPGRAM - Transcrição Áudio para Texto

#### Limite Gratuito: $200 em transcrição, que é equivalente a aproximadamente 750 horas em transcrição.

#### 2.1 - Crie uma conta no site https://console.deepgram.com/signup

<br>

#### 2.2 - Após a conta criada você chegará nesta tela, clique em "Create API Key"

<br>

<img src="https://i.imgur.com/2MFfmga.png">

<br>

#### 2.3 - Abrirá essa janela, preencha o nome que quiser e deixe marcado as opções abaixo, então confirme em "Create Key"

<br>

<img src="https://i.imgur.com/3YKuyKh.png">

<br>

#### 2.4 - Nessa tela agora você já tem a sua chave, copie a chave e clique em "Got It" para encerrar e substitua o valor no comando abaixo separando por virgulas e envie para o bot : 

<br>

Comando : !api deepgram, **secret_key**

<br>

<img src="https://i.imgur.com/OSae2lZ.png">


### Pronto, você já tem sua chave DEEPGRAM configurada.