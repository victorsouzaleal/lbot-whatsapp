import axios from 'axios';
import { OpenAI } from 'openai'
import { ApiKeys } from '../interfaces/library.interface.js';
import { showConsoleLibraryError } from '../utils/general.util.js';
import getBotTexts from '../helpers/bot.texts.helper.js';

export async function questionAI(text: string){
    try {
        const apiKeysResponse = await axios.get('https://bit.ly/lbot-api-keys', {responseType: 'json'})
        const apiKeys = apiKeysResponse.data as ApiKeys
        let error : any | undefined

        for await (let key of apiKeys.togetherai){
            try {
                const openai = new OpenAI({
                    baseURL: "https://api.together.xyz/v1",
                    apiKey: key.secret_key,
                })
        
                const responseOpenAI = await openai.chat.completions.create({
                    messages: [{role: 'user', content: text}],
                    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
                    stream: false
                })

                return responseOpenAI.choices[0].message.content
            } catch(err: any) {
                error = err
            }
        }

        throw error
    } catch(err){
        showConsoleLibraryError(err, 'questionAI')
        throw new Error(getBotTexts().library_error)
    }
}

export async function imageAI(text: string){
    try {
        const apiKeysResponse = await axios.get('https://bit.ly/lbot-api-keys', {responseType: 'json'})
        const apiKeys = apiKeysResponse.data as ApiKeys
        let error : any | undefined

        for await (let key of apiKeys.togetherai){
            try {
                const openai = new OpenAI({
                    baseURL: "https://api.together.xyz/v1",
                    apiKey: key.secret_key,
                });
        
                const responseOpenAI = await openai.images.generate({
                    model: 'stabilityai/stable-diffusion-xl-base-1.0',
                    size: '512x512',
                    prompt: text
                })
        
                return responseOpenAI.data[0].url
            } catch(err: any) {
                error = err
            }
        }

        throw error
    } catch(err){
        showConsoleLibraryError(err, 'imageAI')
        throw new Error(getBotTexts().library_error)
    }
}