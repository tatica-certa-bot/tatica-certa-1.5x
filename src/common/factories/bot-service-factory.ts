import { BlazeService } from "../../services/blaze-service";
import { BotService } from "../../services/bot-service";
import { TelegramService } from "../../services/telegram-service";
import axios from "axios";
import { blazeBotRepositoryFactory } from "./blaze-bot-repository-factory";

export function botServiceFactory() {
  return new BotService(
    new BlazeService(axios),
    new TelegramService(axios),
    blazeBotRepositoryFactory()
  );
}
