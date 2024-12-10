import { config } from 'dotenv';
import { ChatGPTAPI, ChatMessage } from 'chatgpt';

config();

class ChatGPTClass {
  private queue: ChatMessage[] = [];
  private optionsGPT = { model: "gpt-3.5-turbo" };
  private openai: ChatGPTAPI | undefined;

  constructor() {
    this.init();
  }

  private init = async (): Promise<void> => {
    const { ChatGPTAPI } = await import("chatgpt");
    this.openai = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY || ''
    });
  };

  public handleMsgChatGPT = async (body: { from: string; body: string }): Promise<any> => {
    const interaccionChatGPT = await this.openai.sendMessage(body.body, {
        conversationId: this.queue.length
          ? this.queue[this.queue.length - 1].conversationId
          : undefined,
        parentMessageId: this.queue.length
          ? this.queue[this.queue.length - 1].id
          : undefined,
      });
  
      this.queue.push(interaccionChatGPT);
      return interaccionChatGPT;
  };
}

export default ChatGPTClass;
