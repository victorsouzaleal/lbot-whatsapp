const prompt = require("prompt")
const fs = require('fs-extra')
const color = require('./color')
const path = require('path')

module.exports = {
    criacaoEnv: async ()=>{
        let schema = {
            properties: {
               numero_dono:{
                 description: color("Digite seu número de WhatsApp com o código do país incluído - ex: 55219xxxxxxxx.(O SEU NÚMERO E NÃO O DO BOT) "),
                 required: true
               },
            }
         }
         const {numero_dono} = await prompt.get(schema)
         const env = "# LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT. (COM CÓDIGO DO PAÍS INCLUÍDO)\n"+
         "NUMERO_DONO="+numero_dono+"\n"+
         "# REMOVEBG - Coloque abaixo sua chave API do site remove.bg (REMOVER FUNDO DE IMAGENS)\n"+
         "API_REMOVE_BG=??????\n"+
         "# NEWSAPI- Coloque abaixo sua chave API do site newsapi.org (NOTICIAIS ATUAIS)\n"+
         "API_NEWS_ORG=??????\n"+
         "# RAPIDAPI - Coloque sua chave API do site rapidapi.com (PESQUISA IMAGENS/WEB/ETC)\n"+
         "API_RAPIDAPI=??????\n"+
         "# ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)\n"+
         "acr_host=??????\n"+
         "acr_access_key=??????\n"+
         "acr_access_secret=??????\n"
         await fs.writeFile(path.resolve('.env'), env , 'utf8')
    },

    verificarEnv:()=>{
        let resposta = {
            numero_dono : {
               resposta: (process.env.NUMERO_DONO.trim() == "55219xxxxxxxx") ? "O número do DONO ainda não foi configurado" : "✓ Número do DONO configurado.",
               cor_resposta: (process.env.NUMERO_DONO.trim() == "55219xxxxxxxx") ? "red" : false
            },
            removebg : {
              resposta: (process.env.API_REMOVE_BG.trim() == "??????") ? "A API do REMOVEBG ainda não foi configurada" : "✓ API REMOVEBG Configurada.",
              cor_resposta: (process.env.API_REMOVE_BG.trim() == "??????") ? "red" : false
            },
            newsapi : {
              resposta: (process.env.API_NEWS_ORG.trim() == "??????") ? "A API do NEWSAPI ainda não foi configurada" : "✓ API NEWSAPI Configurada.",
              cor_resposta: (process.env.API_NEWS_ORG.trim() == "??????") ? "red" : false
            },
            rapidapi : {
              resposta: (process.env.API_RAPIDAPI.trim() == "??????") ? "A API do RAPIDAPI ainda não foi configurada" : "✓ API RAPIDAPI Configurada.",
              cor_resposta: (process.env.API_RAPIDAPI.trim() == "??????") ? "red" : false
            },
            acrcloud :{
              resposta: (process.env.acr_host.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
               ? "A API do ACRCloud ainda não foi configurada corretamente" : "✓ API ACRCloud Configurada.",
              cor_resposta: (process.env.acr_host.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
              ? "red" : false
            }
          }
      
          console.log("[ENV]", color(resposta.numero_dono.resposta, resposta.numero_dono.cor_resposta))
          console.log("[ENV]", color(resposta.removebg.resposta, resposta.removebg.cor_resposta))
          console.log("[ENV]", color(resposta.newsapi.resposta, resposta.newsapi.cor_resposta))
          console.log("[ENV]", color(resposta.rapidapi.resposta, resposta.rapidapi.cor_resposta))
          console.log("[ENV]", color(resposta.acrcloud.resposta, resposta.acrcloud.cor_resposta))
    }
}