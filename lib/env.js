const prompt = require("prompt")
const fs = require('fs-extra')
const path = require('path')

//NÃO MODIFICAR ESSA PARTE, O .ENV CORRETO ESTÁ NA RAIZ DO PROJETO!!!!!!!!!!!!!!!!
module.exports = {
    criacaoEnv: async ()=>{
         const env = "#############  DADOS DO BOT #############\n\n"+
         "NOME_ADMINISTRADOR=Leal\n"+
         "NOME_BOT=LBOT\n"+
         "NOME_AUTOR_FIGURINHAS = LBOT\n\n"+
         "############ CONFIGURAÇÕES DO DONO #############\n"+
         "# LEMBRE-SE SEU NÚMERO DE WHATSAPP E NÃO O DO BOT. (COM CÓDIGO DO PAÍS INCLUÍDO)\n"+
         "NUMERO_DONO=55219xxxxxxxx\n\n"+
         "# NEWSAPI- Coloque abaixo sua chave API do site newsapi.org (NOTICIAIS ATUAIS)\n"+
         "API_NEWS_ORG=??????\n\n"+
         "# ACRCLOUD - Coloque abaixo suas chaves do ACRCloud (Reconhecimento de Músicas)\n"+
         "acr_host=??????\n"+
         "acr_access_key=??????\n"+
         "acr_access_secret=??????\n\n"+
         "# DEEPGRAM - Coloque abaixo sua chave do DEEPGRAM (Transcrição de aúdio para texto)\n"+
         "dg_secret_key=??????\n\n"
         await fs.writeFile(path.resolve('.env'), env , 'utf8')
    },

    //NÃO MODIFICAR ESSA PARTE, O .ENV CORRETO ESTÁ NA RAIZ DO PROJETO!!!!!!!!!!!!!!!!
    verificarEnv:()=>{
      try{
        const {corTexto} = require(path.resolve("lib/util.js"))
        let resposta = {
            numero_dono : {
               resposta: (process.env.NUMERO_DONO?.trim() == "55219xxxxxxxx") ? "O número do DONO ainda não foi configurado" : "✓ Número do DONO configurado.",
               cor_resposta: (process.env.NUMERO_DONO?.trim() == "55219xxxxxxxx") ? "#d63e3e" : false
            },
            newsapi : {
              resposta: (process.env.API_NEWS_ORG?.trim() == "??????") ? "A API do NEWSAPI ainda não foi configurada" : "✓ API NEWSAPI configurada.",
              cor_resposta: (process.env.API_NEWS_ORG?.trim() == "??????") ? "#d63e3e" : false
            },
            acrcloud :{
              resposta: (process.env.acr_host?.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
               ? "A API do ACRCloud ainda não foi configurada corretamente" : "✓ API ACRCloud configurada.",
              cor_resposta: (process.env.acr_host?.trim() == "??????" || process.env.acr_access_key.trim() == "??????" || process.env.acr_access_secret.trim() == "??????")
              ? "#d63e3e" : false
            },
            deepgram : {
              resposta: (process.env.dg_secret_key?.trim() == "??????") ? "A API do DEEPGRAM ainda não foi configurada" : "✓ API DEEPGRAM configurada.",
              cor_resposta: (process.env.dg_secret_key?.trim() == "??????") ? "#d63e3e" : false
            },
          }
      
          console.log("[ENV]", corTexto(resposta.numero_dono.resposta, resposta.numero_dono.cor_resposta))
          console.log("[ENV]", corTexto(resposta.newsapi.resposta, resposta.newsapi.cor_resposta))
          console.log("[ENV]", corTexto(resposta.acrcloud.resposta, resposta.acrcloud.cor_resposta))
          console.log("[ENV]", corTexto(resposta.deepgram.resposta, resposta.deepgram.cor_resposta))
      } catch(err){
          err.message = `verificarEnv - ${err.message}`
          throw err
      }
    }
}