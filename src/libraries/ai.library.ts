import { OpenAI } from 'openai'

export async function questionAI(text: string){
    try {
        const openai = new OpenAI({
            baseURL: "https://api.together.xyz/v1",
            apiKey: "296255e9a520c9dded3f18447623ad4f76c014090aafd139056384ce1a7a11bc",
        });

        const responseOpenAI = await openai.chat.completions.create({
            messages: [{role: 'user', content: text}],
            model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
            stream: false
        }).catch(() => {
            throw new Error("Não foi possível obter uma resposta da IA nesse momento, tente novamente mais tarde.")
        })

        if(!responseOpenAI.choices[0].message.content) throw new Error('Não foi possível obter o conteúdo do texto.')

        return responseOpenAI.choices[0].message.content
    } catch(err){
        throw err
    }
}

export async function imageAI(text: string){
    try {
        const openai = new OpenAI({
            baseURL: "https://api.together.xyz/v1",
            apiKey: "296255e9a520c9dded3f18447623ad4f76c014090aafd139056384ce1a7a11bc",
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
    } catch(err){
        throw err
    }
}