import { config } from "dotenv";

config();

const { TOKEN, SERVER_URL } = process.env;

export const WEBHOOK_URL = `${SERVER_URL}/webhook/${TOKEN}`;

export const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

export const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID;

export const PORT = process.env.PORT;
