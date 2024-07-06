import { makeWASocket, useMultiFileAuthState, fetchLatestWaWebVersion, DisconnectReason } from '@whiskeysockets/baileys';
import * as eventosSocket from './bot/baileys/eventosSocket.js';
import { BotControle } from './bot/controles/BotControle.js';
import { MensagemControle } from './bot/controles/MensagemControle.js';
import configSocket from './bot/baileys/configTel.js';
import moment from "moment-timezone";
import NodeCache from 'node-cache';
import readline from "readline";
moment.tz.setDefault('America/Sao_Paulo');

const cacheTentativasEnvio = new NodeCache();

const question = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
};

const onlyNumbers = (str) => str.replace(/\D/g, '');

async function connectToWhatsApp() {
    let inicializacaoCompleta = false, eventosEsperando = [];
    const { state: estadoAuth, saveCreds } = await useMultiFileAuthState('sessao');
    const { version: versaoWaWeb } = await fetchLatestWaWebVersion();
    const c = makeWASocket(configSocket(estadoAuth, cacheTentativasEnvio, versaoWaWeb));
    const bot = new BotControle();

    if (!c.authState.creds.registered) {
        const phoneNumber = await question("Informe o seu número de telefone: ");
        if (!phoneNumber) throw new Error("Número de telefone inválido!");
        const code = await c.requestPairingCode(onlyNumbers(phoneNumber));
        console.log(`Código de pareamento: ${code}`);
    }

    await new MensagemControle().limparMensagensArmazenadas();

    c.ev.process(async (events) => {
        const botInfo = await bot.obterInformacoesBot();

        if (events['connection.update']) {
            const update = events['connection.update'];
            const { connection, lastDisconnect } = update;
            let necessarioReconectar = false;
            if (connection === 'open') {
                await eventosSocket.conexaoAberta(c, botInfo);
                inicializacaoCompleta = await eventosSocket.atualizacaoDadosGrupos(c, botInfo);
                await eventosSocket.realizarEventosEspera(c, eventosEsperando);
            } else if (connection === 'close') {
                necessarioReconectar = await eventosSocket.conexaoEncerrada(update, botInfo);
                if (necessarioReconectar) {
                    const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    if (shouldReconnect) connectToWhatsApp();
                }
            }
        }

        if (events['creds.update']) await saveCreds();

        if (events['messages.upsert']) {
            const m = events['messages.upsert'];
            if (inicializacaoCompleta) {
                await eventosSocket.receberMensagem(c, m, botInfo);
            } else {
                eventosEsperando.push({ evento: 'messages.upsert', dados: m });
            }
        }

        if (events['group-participants.update']) {
            const atualizacao = events['group-participants.update'];
            if (inicializacaoCompleta) {
                await eventosSocket.atualizacaoParticipantesGrupo(c, atualizacao, botInfo);
            } else {
                eventosEsperando.push({ evento: 'group-participants.update', dados: atualizacao });
            }
        }

        if (events['groups.upsert']) {
            const grupo = events['groups.upsert'];
            if (inicializacaoCompleta) {
                await eventosSocket.adicionadoEmGrupo(c, grupo, botInfo);
            } else {
                eventosEsperando.push({ evento: 'groups.upsert', dados: grupo });
            }
        }

        if (events['groups.update']) {
            const grupos = events['groups.update'];
            if (grupos.length == 1 && grupos[0].participants == undefined) {
                if (inicializacaoCompleta) {
                    await eventosSocket.atualizacaoDadosGrupo(grupos[0]);
                } else {
                    eventosEsperando.push({ evento: 'groups.update', dados: grupos });
                }
            }
        }
    });
}

connectToWhatsApp();
