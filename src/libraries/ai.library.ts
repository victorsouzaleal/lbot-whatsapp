import axios from 'axios';
import { OpenAI } from 'openai'
import { ApiKeys } from '../interfaces/library.interface';

export async function questionAI(text: string){
    try {
        const apiKeysResponse = await axios.get('https://bit.ly/lbot-api-keys', {responseType: 'json'}).catch(()=> {
            throw new Error("Houve um erro ao obter as chaves API.")
        })

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
                }).catch(() => {
                    throw new Error("Não foi possível obter uma resposta da IA nesse momento, tente novamente mais tarde.")
                })

                if(!responseOpenAI.choices[0].message.content) throw new Error('Não foi possível obter o conteúdo da resposta.')

                return responseOpenAI.choices[0].message.content
            } catch(err: any) {
                error = err
            }
        }

        throw error
    } catch(err){
        throw err
    }
}

export async function imageAI(text: string){
    try {
        const apiKeysResponse = await axios.get('https://bit.ly/lbot-api-keys', {responseType: 'json'}).catch(()=> {
            throw new Error("Houve um erro ao obter as chaves API.")
        })

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
                }).catch(() => {
                    throw new Error("Não foi possível obter uma imagem da IA nesse momento, tente novamente mais tarde.")
                })
        
                if(!responseOpenAI.data[0].url) throw new Error('Não foi possível obter a URL da imagem.')
        
                return responseOpenAI.data[0].url
            } catch(err: any) {
                error = err
            }
        }

        throw error
    } catch(err){
        throw err
    }
}