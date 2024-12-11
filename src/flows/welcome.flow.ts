import { addKeyword, EVENTS } from "@builderbot/bot";
import { confirmFlow } from "./confirm.flow";
import { ChatGPTInstance } from "~/ai/instance.chatgpt";
import PROMP from "~/prompts/chatgpt_prompt";


export const initialFLow = addKeyword(EVENTS.WELCOME)
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