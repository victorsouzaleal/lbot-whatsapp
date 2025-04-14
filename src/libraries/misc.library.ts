import axios from 'axios'
import qs from 'querystring'
import { showConsoleLibraryError } from '../utils/general.util.js'
import botTexts from '../helpers/bot.texts.helper.js'

export async function simSimi(text: string){
    try {
        const URL_BASE = 'https://api.simsimi.vn/v2/simtalk'
        const config = {
            url: URL_BASE,
            method: "post",
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            data : qs.stringify({text, lc: 'pt'})
        }

        const {data : simiResponse} = await axios(config).catch((err)=>{
            if (err.response?.data?.message){
                return err.response
            } else {
                throw err
            }
        })

        return simiResponse.message as string | null | undefined
    } catch(err){
        showConsoleLibraryError(err, 'simSimi')
        throw new Error(botTexts.library_error)
    }
}

export async function funnyRandomPhrases(){
    try {
        const URL_BASE = 'https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/2be5f3b5333b2a9c97492888ed8e63b7c7675ae6/frases.json'
        let { data } = await axios.get(URL_BASE)
        let responsePhrase = data.frases[Math.floor(Math.random() * data.frases.length)]
        let cont_params = 1

        if(responsePhrase.indexOf("{p3}") != -1) {
            cont_params = 3
        } else if (responsePhrase.indexOf("{p2}") != -1){
            cont_params = 2
        } 
    
        for(let i = 1; i <= cont_params; i++){
            let complementChosen = data.complementos[Math.floor(Math.random() * data.complementos.length)]
            responsePhrase = responsePhrase.replace(`{p${i}}`, `*${complementChosen}*`)
            data.complementos.splice(data.complementos.indexOf(complementChosen, 1))
        }

        return responsePhrase as string
    } catch(err) {
        showConsoleLibraryError(err, 'funnyRandomPhrases')
        throw new Error(botTexts.library_error)
    }
}
