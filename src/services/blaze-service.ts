import { AxiosAdapter } from "../common/adapter/axios-adapter";
import { isEmpty, isUndefined, isNull, isArray } from "lodash";
import { TELEGRAM_API } from "../common/constants";

export class BlazeService {
  constructor(private readonly axios: AxiosAdapter) {}

  async getGameDatasFromBlaze() {
    try {
      const { data: gameResults } = await this.axios.get(
        "https://blaze.com/api/crash_games/recent"
      );

      if (
        !isArray(gameResults) ||
        isNull(gameResults) ||
        isUndefined(gameResults) ||
        isEmpty(gameResults)
      ) {
        await this.getGameDatasFromBlaze();
      }
      return gameResults;
    } catch (error) {
      try {
        // await this.axios.post(`${TELEGRAM_API}/sendMessage`, {
        //   chat_id: process.env.GROUP_CHAT_ID,
        //   text: "deu erro"
        // });
        console.error(error);
      } catch (error) {
        await this.getGameDatasFromBlaze();
      }
      await this.getGameDatasFromBlaze();
    }
  }
}

export interface IGameResult {
  id: string;
  crash_point: string;
}

export interface ICountForBetResult {
  id: string;
  count: number;
}
