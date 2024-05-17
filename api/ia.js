import axios from 'axios'
import { Hercai } from "hercai"
import qs from 'node:querystring'
import {obterTraducao} from './gerais.js'

export const respostaHercaiTexto = async(textoUsuario, usuario)=>{
    return new Promise(async (resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            const herc = new Hercai()
            await herc.betaQuestion({content: textoUsuario, user: usuario}).then((respostaHercai)=>{
                resposta = {sucesso: true, resultado: respostaHercai.reply}
                resolve(resposta)
            }).catch((err)=>{
                if(err.message == 'Error: Request failed with status code 429'){
                    resposta = {sucesso: false, erro: 'Limite de pedidos foi excedido, tente novamente mais tarde'}
                } else {
                    resposta = {sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'}
                }
                reject(resposta)
            })
        } catch(err) {
            console.log(`API respostaHercaiTexto - ${err.message}`)
            reject({sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'})
        }
    })
}

export const respostaHercaiImagem= async(textoUsuario)=>{
    return new Promise(async (resolve,reject)=>{
        try{
            const herc = new Hercai()
            let resposta = {sucesso: false}
            let {resultado} = await obterTraducao(textoUsuario, 'en')
            await herc.betaDrawImage({prompt: resultado, width: 256, height:256}).then((respostaHercai)=>{
                if(respostaHercai.status == 404) {
                    resposta = {sucesso: false, erro: 'O texto que você colocou é inválido ou não pode ser criado.'}
                    reject(resposta)
                }else if(respostaHercai.status == 406) {
                    resposta = {sucesso: false, erro: 'Houve um erro para criar a imagem, o projeto ainda está em BETA então tente novamente.'}
                    reject(resposta)
                } else {
                    resposta = {sucesso: true, resultado: respostaHercai.url}
                    resolve(resposta)
                }
            }).catch((erro)=>{
                if(erro.message == 'Error: Request failed with status code 429'){
                    resposta = {sucesso: false, erro: 'Limite de pedidos foi excedido, tente novamente mais tarde'}
                } else {
                    resposta = {sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'}
                }
                reject(resposta)
            })
        } catch(err) {
            console.log(`API respostaHercaiImagem - ${err.message}`)
            reject({sucesso: false, erro:'Houve um erro no servidor, tente novamente mais tarde.'})
        }
    })
}

export const simiResponde = async(textoUsuario)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let resposta = {sucesso: false}
            let config = {
                url: "https://api.simsimi.vn/v2/simtalk",
                method: "post",
                headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                data : qs.stringify({text: textoUsuario, lc: 'pt'})
            }

            await axios(config).then((simiresposta)=>{
                resposta = {sucesso: true, resultado: simiresposta.data.message}
                resolve(resposta)
            }).catch((err)=>{
                if(err.response?.data?.message){
                    resposta = {sucesso: true, resultado: err.response.data.message}
                    resolve(resposta)
                } else {
                    resposta = {sucesso: false, erro: "Houve um erro no servidor do SimSimi."}
                    reject(resposta)
                }
            })
        } catch(err){
            console.log(`API simiResponde- ${err.message}`)
            reject({sucesso: false, erro: "Houve um erro no servidor do SimSimi."})
        }
    })
}
