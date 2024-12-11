import { join } from "path";
import {
    createBot,
    createProvider,
    createFlow,
    addKeyword,
    utils,
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { title } from "process";
import { text } from "stream/consumers";
import ChatGPTClass from "./ai/chatgpt.class";
import PROMP from "./prompts/chatgpt_prompt";

const PORT = process.env.PORT ?? 3008;

const ChatGPTInstance = new ChatGPTClass();

const confirmFlow = addKeyword(['si', 'no']).addAnswer('¿Necesitas que te ayude con algo mas?', { capture: true },)

const initialFLow = addKeyword(['hola', 'Hola'])
.addAnswer('Hola, soy un ingeniero de software creado con IA', null, async () => {
    return await ChatGPTInstance.handleMsgChatGPT({ from: 'system', body: PROMP });
})
.addAnswer('¿En qué puedo ayudarte hoy?', { capture: true }, 
    async (ctx, {flowDynamic, fallBack}) => {
        const resp = await ChatGPTInstance.handleMsgChatGPT({ from: ctx.from, body: ctx.body });
        const message = resp.text;
        if (ctx.body.toString() !== 'si') {
            // eslint-disable-next-line builderbot/func-prefix-fall-back-return
            fallBack(message)
        }
    }, [confirmFlow]
)

const main = async () => {
  const adapterFlow = createFlow([initialFLow]);

  const adapterProvider = createProvider(Provider);
  const adapterDB = new Database();

  const { httpServer } = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  httpServer(+PORT);
};

main();
