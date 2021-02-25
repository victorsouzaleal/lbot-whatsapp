# Tutorial para obter as chaves das API's


## 1 - RemoveBG (Remover fundo de fotos)

#### Limite Gratuito: 50 stickers sem fundo/conta, após isso você terá que criar uma nova conta.


### Crie uma conta no site https://accounts.kaleido.ai/users/sign_up?locale=pt-br

Após criar a conta, clique em **API Key**
<img src="https://i.imgur.com/llKh6JL.png" >

Após apertar em **"Show"**, a sua **chave** será exibida e deverá ser usada no campo **API_REMOVEBG** no .env do Bot.
<img src="https://i.imgur.com/kyANXdb.png"/>

### Pronto, você já tem sua chave RemoveBG .




<br>

## 2 - NewsAPI (Noticias)

### Crie uma conta no site https://newsapi.org/register

Após a criação da conta a sua **chave** já será exibida para ser usada no campo **API_NEWS_ORG** no .env do Bot.
<img src="https://i.imgur.com/WteuFSj.png">

### Pronto, você já tem sua chave NewsAPI .

<br>

## 3 - RapidAPI (Pesquisa Imagens/Web)
#### Limite Gratuito: 1000 pesquisas/conta, após isso você terá que criar uma nova conta.

### Crie uma conta no site https://rapidapi.com/

Após a conta ser criada, vá em **My Apps**
<img src="https://i.imgur.com/WBrfNFU.png">

Clique em **default-application_XXXXXX** e depois em **Security**
<img src="https://i.imgur.com/UG0a6oI.png">

E aqui vai estar a **chave** para usar no campo designado **API_RAPIDAPI** no .env do Bot.
<img src="https://i.imgur.com/2iLagG6.png">

#### Ainda não acabou, temos que nos inscrever nas API's do Bing para podermos usar os serviços deles.

Se inscrevendo no **Bing Web Search** : https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/bing-web-search1/pricing

Clique em **"Select Plan"** para se inscrever no plano gratuito
<img src="https://i.imgur.com/m7I0Mwo.png">

Se inscrevendo no **Bing Image Search** : https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/bing-image-search1/pricing

Faça a mesma coisa da ultima inscrição, clique em **"Select Plan"**

### Pronto, você já tem sua chave RapidAPI totalmente configurada.

<br>

## 4 - ACRCloud - Reconhecimento de Músicas

#### Limite Gratuito: 14 dias de uso ou 5000 reconhecimentos, após isso você terá que criar uma nova conta.

### Crie uma conta no site https://console.acrcloud.com/avr?region=eu-west-1#/register

**IMPORTANTE**: Se houver algum problema para chegar a mensagem de verificação de email, crie outra conta usando qualquer VPN (Geralmente quando é a sua primeira conta sempre chega a mensagem, mas a partir da segunda pode ser necessário o uso do VPN)

Após a conta criada, email verificado e um formulário básico inicial preenchido.. Você chegará nesta tela, clique em **Audio & Video Recognition**
<img src="https://i.imgur.com/CeKSsjO.png"/>

Abra a aba de **Projects** e clique em **Audio & Video Recognition**
<img src="https://i.imgur.com/owgNhyv.png"/>

Agora clique em **Create Project** e depois preencha os dados como mostrado abaixo:
<img src="https://i.imgur.com/530RtLA.png"/>

Nessa tela agora você tem seu **acr_host**, **acr_access_key** e **acr_access_secret** respectivamente, copie eles e coloque nos campos designados no .env do Bot.

<img src="https://i.imgur.com/BA8aUA5.png"/>

### Pronto, você já tem suas chaves ACRCloud .









