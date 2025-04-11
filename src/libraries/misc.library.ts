import axios from 'axios'
import qs from 'querystring'
import { showConsoleLibraryError } from '../utils/general.util.js'
import getBotTexts from '../helpers/bot.texts.helper.js'

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
        throw new Error(getBotTexts().library_error)
    }
}

export async function funnyRandomPhrases(){
    try {
        const URL_BASE = 'https://gist.githubusercontent.com/victorsouzaleal/bfbafb665a35436acc2310d51d754abb/raw/2be5f3b5333b2a9c97492888ed8e63b7c7675ae6/frases.json'
        const IMAGE_URL = 'https://i.imgur.com/pRSN2ml.png'
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

        const response = {
            image_url: IMAGE_URL,
            text: responsePhrase as string
        }

        return response
    } catch(err) {
        showConsoleLibraryError(err, 'funnyRandomPhrases')
        throw new Error(getBotTexts().library_error)
    }
}

export function truthMachine(){
    try {
        const imageCalibration = 'https://i.imgur.com/kEWjkyP.png'
        const imagesResult = [
            'https://i.imgur.com/0N7hY1V.png',
            'https://i.imgur.com/3JG8Cu2.png',
            'https://i.imgur.com/44V8MHp.png',
            'https://i.imgur.com/fky7kQl.png',
            'https://i.imgur.com/M7gSj0p.png',
            'https://i.imgur.com/2IhKZFI.png',
            'https://i.imgur.com/mmX6cmR.png',
            'https://i.imgur.com/hy9oYoX.png'
        ]

        const randomIndex = Math.floor(Math.random() * imagesResult.length)
        const response = {
            calibration_url : imageCalibration,
            result_url : imagesResult[randomIndex]
        }

        return response
    } catch(err) {
        showConsoleLibraryError(err, 'truthMachine')
        throw new Error(getBotTexts().library_error)
    }
}

export function flipCoin(){
    try {
        const coinSides = ['cara', 'coroa']
        const chosenSide = coinSides[Math.floor(Math.random() * coinSides.length)]
        const imageCoinUrl = chosenSide === 'cara' ? "https://i.imgur.com/E0jdBt1.png" : 'https://i.imgur.com/2uUDQab.png'
        const response = {
            chosen_side : chosenSide,
            image_coin_url : imageCoinUrl
        }
        
        return response
    } catch(err) {
        showConsoleLibraryError(err, 'flipCoin')
        throw new Error(getBotTexts().library_error)
    }
}

