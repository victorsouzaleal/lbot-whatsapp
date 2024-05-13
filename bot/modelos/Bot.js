import path from 'node:path'
import fs from 'fs-extra'


export class Bot{
    constructor(){
        this.caminhoJSON =  path.resolve("dados/bot.json")
    }


    async atualizarDados(dados){
        fs.writeFileSync(this.caminhoJSON, JSON.stringify(dados))
    }

    async obterDados(){
        return JSON.parse(fs.readFileSync(this.caminhoJSON))
    }

    async atualizarComandos(){
        let bot = await this.obterDados()
        bot.cmds_executados++
        await this.atualizarDados(bot)
    }

}