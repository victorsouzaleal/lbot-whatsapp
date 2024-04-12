const prompt = require("prompt")
const fs = require('fs-extra')
const path = require('path')

//NÃO MODIFICAR ESSA PARTE, O .ENV CORRETO ESTÁ NA RAIZ DO PROJETO!!!!!!!!!!!!!!!!
module.exports = {
    criacaoEnv: async ()=>{
        const {corTexto} = require(path.resolve("lib/util.js"))
        let schema = {
            properties: {
               numero_dono:{
                 description: corTexto("Digite seu número de WhatsApp com o código do país incluído - ex: 55219xxxxxxxx.(O SEU NÚMERO E NÃO O DO BOT) "),
                 required: true
               },
            }
         }
         const {numero_dono} = await prompt.get(schema)
         const env = "#############  DADOS DO BOT #############\n\n"+
         "NOME_ADMINISTRADOR=Leal\n"+
         "NOME_BOT=LBOT\n"+
         "NOME_AUTOR_FIGURINHAS = LBOT\n\n"+
         "############ CONFIGURAÇÕES DO BOT #############\n\n"+
         "# LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT. (COM CÓDIGO DO PAÍS INCLUÍDO)\n"+
         "NUMERO_DONO="+numero_dono+"\n"+
         "# NEWSAPI- Coloque abaixo sua chave API do site newsapi.org (NOTICIAIS ATUAIS)\n"+
         "API_NEWS_ORG=??????\n"+
         "# ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)\n"+
         "acr_host=??????\n"+
         "acr_access_key=??????\n"+
         "acr_access_secret=??????\n"
         await fs.writeFile(path.resolve('.env'), env , 'utf8')
    },

    //NÃO MODIFICAR ESSA PARTE, O .ENV CORRETO ESTÁ NA RAIZ DO PROJETO!!!!!!!!!!!!!!!!
    verificarEnv:()=>{
      try{
        const {corTexto} = require(path.resolve("lib/util.js"))
        let resposta = {
            numero_dono : {
               resposta: (process.env.NUMERO_DONO.trim() == "55219xxxxxxxx") ? "O número do DONO ainda não foi configurado" : "✓ Número do DONO configurado.",
               cor_resposta: (process.env.NUMERO_DONO.trim() == "55219xxxxxxxx") ? "#d63e3e" : false
            },
            newsapi : {
              resposta: (process.env.API_NEWS_ORG.trim() == "??????") ? "A API do NEWSAPI ainda não foi configurada" : "✓ API NEWSAPI Configurada.",
              cor_resposta: (process.env.API_NEWS_ORG.trim() == "??????") ? "#d63e3e" : false
            },
            acrcloud :{
              resposta: (process.env.acr_host.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
               ? "A API do ACRCloud ainda não foi configurada corretamente" : "✓ API ACRCloud Configurada.",
              cor_resposta: (process.env.acr_host.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
              ? "#d63e3e" : false
            }
          }
      
          console.log("[ENV]", corTexto(resposta.numero_dono.resposta, resposta.numero_dono.cor_resposta))
          console.log("[ENV]", corTexto(resposta.newsapi.resposta, resposta.newsapi.cor_resposta))
          console.log("[ENV]", corTexto(resposta.acrcloud.resposta, resposta.acrcloud.cor_resposta))
      } catch(err){
          err.message = `verificarEnv - ${err.message}`
          throw err
      }
    }
}