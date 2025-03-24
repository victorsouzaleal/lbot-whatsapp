import { Hercai } from "hercai"

export async function questionAI(text: string){
    try {
        const hercai = new Hercai({apiKey: ''})

        const modelsAvailable = await hercai.chat.models.retrieve().catch(() => {
            throw new Error("Houve um erro ao obter os modelos de IA disponíveis, tente novamente mais tarde")
        })

        const {reply} = await hercai.chat.completions.create({
            messages: [{role: 'user', content: text}],
            model: 'meta-llama/Llama-3.2-90b-Vision',
            stream: false
        }).catch(() => {
            throw new Error("Houve um erro ao obter a resposta da IA, tente novamente mais tarde.")
        })

        return reply
    } catch(err){
        throw err
    }
    
}

export async function imageAI(text: string){
    try {
        const hercai = new Hercai({apiKey: ''})

        const modelsAvailable = await hercai.images.models.retrieve().catch(() => {
            throw new Error("Houve um erro ao obter os modelos de IA disponíveis, tente novamente mais tarde")
        })

        const imageBuffer = await hercai.images.generations({
            prompt: 'text',
            size: '512x512',
            response_format: 'buffer',
            seed: '45',
            steps: 50,
            model: ''
        }).catch(() => {
            throw new Error("Houve um erro ao gerar a imagem com IA, tente novamente mais tarde.")
        })
        
        return imageBuffer
    } catch(err){
        throw err
    }
}
