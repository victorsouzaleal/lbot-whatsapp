import { Bot } from "../../interfaces/bot.interface.js"
import * as miscFunctions from './commands-functions.misc.js'

export function commandsMisc(botInfo?: Bot){
    const PREFIX = botInfo?.prefix, BOT_NAME = botInfo?.name
    const misc = {
        sorteio: {
            guide: `Ex: *${PREFIX}sorteio* 100 - Sorteia um número aleatório de 1 a 100.\n`,
            msgs: {
                reply: `🎲 *Sorteio (Número)*: \n`+
                '────────────────────────\n'+
                `O número sorteado foi *{p1}*`,
                error_invalid_value: 'O valor do número inserido é inválido, escolha um número maior que 1.'
            },
            function: miscFunctions.sorteioCommand
        },
        sorteiomembro: {
            guide: `Ex: *${PREFIX}sorteiomembro* - Sorteia um membro aleatório do grupo.\n`,
            msgs: {
                reply: `🎲 *Sorteio (Membro)*: \n`+
                '────────────────────────\n'+
                `O membro sorteado foi @{p1}`,
            },
            function: miscFunctions.sorteiomembroCommand
        },
        mascote: {
            guide: `Ex: *${PREFIX}mascote* - Exibe o inigualável e onipotente WhatsApp Jr.\n`,
            msgs: {
                reply: 'WhatsApp Jr.'
            },
            function: miscFunctions.mascoteCommand
        },
        simi: {
            guide: `Ex: *${PREFIX}simi* frase  - Envia um texto para o SimSimi responder.\n`,
            msgs: {
                reply: `🐤 *SimSimi*: \n`+
                '────────────────────────\n'+
                `{p1}: {p2}`,
            },
            function: miscFunctions.simiCommand
        },
        viadometro: {
            guide: `Ex: *${PREFIX}viadometro* @membro - Mede o nível de viadagem do membro mencionado.\n\n`+
            `Ex: Responder com *${PREFIX}viadometro* - Mede o nível de viadagem do membro respondido.\n`,
            msgs: {
                error_mention: "Apenas um membro deve ser marcado por vez.",
                error_message: "Houve um erro ao obter os dados da mensagem.",
                reply: "🏳️‍🌈 *Viadômetro*\n"+
                '────────────────────────\n'+
                'Foi detectado um nível de viadagem de *{p1}%*'
            },
            function: miscFunctions.viadometroCommand
        },
        detector: {
            guide: `Ex: Responder com *${PREFIX}detector* - Exibe o resultado da máquina da verdade.\n`,
            msgs: {
                wait: "⏳ Calibrando a máquina da verdade",
                error_message: "Houve um erro ao obter os dados da mensagem."
            },
            function: miscFunctions.detectorCommand
        },
        roletarussa: {
            guide: `Ex: *${PREFIX}roletarussa* - Teste sua sorte na roleta russa.\n\n`,
            msgs: {
                reply_alive: '🔫 *Roleta russa*\n'+
                '────────────────────────\n'+
                "😁 A arma não disparou, você sobreviveu a roleta russa.",
                reply_dead: '🔫 *Roleta russa*\n'+
                '────────────────────────\n'+
                "💀 A arma disparou, você morreu.",
            },
            function: miscFunctions.roletarussaCommand
        },
        casal: {
            guide: `Ex: *${PREFIX}casal* - Escolhe 2 pessoas aleatórias do grupo para formar um casal.\n`,
            msgs: {
                error: "Este comando precisa de no mínimo 2 membros no grupo.",
                reply: '👩‍❤️‍👨 *Casal*\n'+
                '────────────────────────\n'+
                "💕 Está rolando um clima entre @{p1} e @{p2}"
            },
            function: miscFunctions.casalCommand
        },
        caracoroa: {
            guide: `Ex: *${PREFIX}caracoroa* cara - Escolhe cara e joga a moeda.\n\n`+
            `Ex: *${PREFIX}caracoroa* coroa - Escolhe coroa e joga a moeda.\n`,
            msgs: {
                wait: "🪙 Lançando a moeda ",
                reply_victory: "😁 *Vitória!*\n"+
                '────────────────────────\n'+
                "O resultado caiu *{p1}*\n",
                reply_defeat: "😭 *Derrota!*\n"+
                '────────────────────────\n'+
                "O resultado caiu *{p1}*\n"
            },
            function: miscFunctions.caracoroaCommand
        },
        ppt: {
            guide: `Ex: *${PREFIX}ppt* pedra - Escolhe pedra, para jogar pedra, papel ou tesoura.\n\n`+
            `Ex: *${PREFIX}ppt* papel - Escolhe papel, para jogar pedra, papel ou tesoura.\n\n`+
            `Ex: *${PREFIX}ppt* tesoura - Escolhe tesoura, para jogar pedra, papel ou tesoura.\n`,
            msgs: {
                error: "[❗] Você deve escolher entre *pedra*, *papel*  ou *tesoura*",
                reply_victory: "😁 *Vitória!*\n"+
                '────────────────────────\n'+
                "Você escolheu {p1} e o bot escolheu {p2}\n",
                reply_defeat: "😭 *Derrota!*\n"+
                '────────────────────────\n'+
                "Você escolheu {p1} e o bot escolheu {p2}\n",
                reply_draw: "😐 *Empate!*\n"+
                '────────────────────────\n'+
                "Você escolheu {p1} e o bot escolheu {p2}\n"
            },
            function: miscFunctions.pptCommand
        },
        gadometro: {
            guide: `Ex: *${PREFIX}gadometro* @membro - Mede o nível de gadisse do membro mencionado.\n\n`+
            `Ex: Responder com *${PREFIX}gadometro* - Mede o nível de gadisse do membro respondido.\n`,
            msgs: {
                error_mention: "Apenas um membro deve ser marcado por vez.",
                error_message: "Houve um erro ao obter os dados da mensagem.",
                reply: "🐃 *Gadômetro*\n"+
                '────────────────────────\n'+
                'Foi detectado um nível de gado de *{p1}%*'
            },
            function: miscFunctions.gadometroCommand
        },
        bafometro: {
            guide: `Ex: *${PREFIX}bafometro* @membro - Mede o nível de alcool do membro mencionado.\n\n`+
            `Ex: Responder com *${PREFIX}bafometro* - Mede o nível de alcool do membro respondido.\n`,
            msgs: {
                reply: "🍺 *Bafômetro*\n"+
                '────────────────────────\n'+
                'Foi detectado um nível de álcool de *{p1}%*',
                error_mention: "Apenas um membro deve ser marcado por vez.",
                error_message: "Houve um erro ao obter os dados da mensagem.",
            },
            function: miscFunctions.bafometroCommand
        },
        top5: {
            guide: `Ex: *${PREFIX}top5* tema - Exibe uma ranking de 5 membros aleatórios com o tema que você escolher.\n`,
            msgs: {
                error_members: "O grupo deve ter no mínimo 5 membros para usar este comando.",
                reply_title: "🏆 *TOP 5 {p1}*\n"+
                '────────────────────────\n',
                reply_item: "{p1} {p2}° Lugar - @{p3}\n"
            },
            function: miscFunctions.top5Command
        },
        par: {
            guide: `Ex: *${PREFIX}par* @membro1 @membro2 - Mede o nível de compatibilidade dos 2 membros mencionados.\n`,
            msgs: {
                reply: "👩‍❤️‍👨 *Par*\n"+
                '────────────────────────\n'+
                'A chance de compatibilidade entre @{p1} e @{p2} é de *{p1}%*'
            },
            function: miscFunctions.parCommand
        },
        chance: {
            guide: `Ex: *${PREFIX}chance ficar rico* - Calcula sua chance de um tema aleatório a sua escolha.\n`,
            msgs: {
                reply: "📊 *Chance*\n"+
                '────────────────────────\n'+
                'Você tem *{p1}%* de chance de *{p2}*',
            },
            function: miscFunctions.chanceCommand
        }, 
        frase: {
            guide: `Ex: *${PREFIX}fch* - Exibe uma frase aleatória montada com as cartas do jogo Cartas contra a Humanidade.\n`,
            msgs: {
                reply: "🙊 *Frases do WhatsApp Jr.*\n"+
                '────────────────────────\n'+
                '{p1}'
            },
            function: miscFunctions.fraseCommand
        }
    }
    
    return misc
}