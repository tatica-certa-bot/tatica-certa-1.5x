import { AxiosAdapter } from "../common/adapter/axios-adapter";
import { TELEGRAM_API, WEBHOOK_URL } from "../common/constants";

export class TelegramService {
  constructor(private readonly axios: AxiosAdapter) {}

  // async deleteWebhook() {
  //   await this.axios.get(`${TELEGRAM_API}/deleteWebhook?url=${WEBHOOK_URL}`);
  // }

  // async setWebhook() {
  //   await this.axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
  // }

  async sendMessageToTelegramBot(textmessage: string) {
    try {
      await this.axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: process.env.GROUP_CHAT_ID,
        text: textmessage,
        disable_web_page_preview: true
      });

      console.log(textmessage);
    } catch (error) {
      await this.sendMessageToTelegramBot(textmessage);
      throw error;
    }
  }

  // async getUpdates() {
  //   const { data: telegramUpdates } = await this.axios.get(
  //     `${TELEGRAM_API}/getUpdates`
  //   );
  //   return telegramUpdates;
  // }
}
