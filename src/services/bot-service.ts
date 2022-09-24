import { isEmpty } from "lodash";
import { BlazeBotRepository } from "../repository/blaze-bot-prisma-repository";
import { BlazeService, ICountForBetResult, IGameResult } from "./blaze-service";
import { TelegramService } from "./telegram-service";

export class BotService {
  constructor(
    private readonly blazeService: BlazeService,
    private readonly telegramService: TelegramService,
    private readonly blazeBotRepository: BlazeBotRepository
  ) {}

  async getResultsFromBlazeToBotTelegram(anteriorId?: string) {
    try {
      const { id, crash_point } = (await this.isReadyToStartBet(
        anteriorId
      )) as any;

      if (!id) {
        await this.getResultsFromBlazeToBotTelegram(anteriorId);
      }

      await this.telegramService.sendMessageToTelegramBot(
        `💵Após o ${crash_point} espere 3 rodadas para começar a apostar,  jogue no maximo 4 rodadas até vir o win!
-----------------------------------------------
👀 1 aposta + 3 Gales no MÁXIMO
-----------------------------------------------
🤑 Vela de 1.5x
-----------------------------------------------
🎯Link do Game:
https://blaze.com/pt/games/crash`.trim()
      );

      let result = await this.countRoundsForBet(3, id);

      if (!result) {
        result = await this.countRoundsForBet(3, id);
      }

      console.log("anteriorId " + result.id);

      await this.bet3TimesBeforeResult(0, result.id);
    } catch (error) {
      console.log(error);
    }
  }

  async blazeResultGamesBeforeResult(): Promise<IGameResult> {
    return new Promise((resolve) => {
      const gameResult = setInterval(async () => {
        let gameResults = await this.blazeService.getGameDatasFromBlaze();

        if (isEmpty(gameResults) || !gameResults) {
          gameResults = await this.blazeService.getGameDatasFromBlaze();
        }
        const { crash_point, id } = gameResults[0];
        clearInterval(gameResult);
        resolve({ crash_point, id });
      }, 5000);
    });
  }

  async bet3TimesBeforeResult(count: number = 0, anteriorId: string) {
    let { crash_point, id } = await this.blazeResultGamesBeforeResult();

    if (anteriorId === id) {
      const result = await this.blazeResultGamesBeforeResult();
      crash_point = result.crash_point;
      id = result.id;
    }

    if (Number(crash_point) > 1.499 && anteriorId !== id) {
      await this.telegramService.sendMessageToTelegramBot(
        `💰💰💰💰💰WIN💰💰💰💰💰
✅✅✅✅✅✅✅✅✅✅✅
______________________________
Deu WIN no sinal ${crash_point}x
______________________________
Acertamos o alvo🎯🎯🎯
______________________________
Espere o próximo sinal🕐🕐🕐`.trim()
      );

      await this.blazeBotRepository.insertCrashResult({
        crash_point,
        count,
        status: "win",
        created_at: new Date()
      });

      const newResultGame = await this.getNewResultId(anteriorId);

      await this.getResultsFromBlazeToBotTelegram(newResultGame.id);
    }

    if (anteriorId !== id) {
      count++;
      console.log(count);
    }

    if (count > 3) {
      const newResultGame = await this.getNewResultId(anteriorId);

      await this.telegramService.sendMessageToTelegramBot(
        `❌❌❌❌LOSS❌❌❌❌❌
❌❌❌❌❌❌❌❌❌❌
______________________________
Calma, não se desespere 😮‍💨😮‍💨😮‍💨
______________________________
Dobre a aposta💸💸 e aplique no próximo sinal nosso📢📢`.trim());

      await this.blazeBotRepository.insertCrashResult({
        crash_point,
        count,
        status: "loss",
        created_at: new Date()
      });

      await this.getResultsFromBlazeToBotTelegram(newResultGame.id);
    }

    await this.bet3TimesBeforeResult(count, id);
  }

  async countRoundsForBet(
    rounds: number,
    currentResultId: string
  ): Promise<ICountForBetResult> {
    let anteriorResultId = currentResultId;
    let count = 0;

    return new Promise((resolve) => {
      const result = setInterval(async () => {
        let gameResults = await this.blazeService.getGameDatasFromBlaze();

        if (isEmpty(gameResults) || !gameResults) {
          gameResults = await this.blazeService.getGameDatasFromBlaze();
        }

        const { crash_point, id } = gameResults[0];

        if (anteriorResultId !== id) {
          anteriorResultId = id;
          console.log("crash_point_count " + crash_point);
          count++;
        }

        if (count === rounds) {
          clearInterval(result);

          return resolve({ count, id });
        }
      }, 5000);
    });
  }

  async isReadyToStartBet(
    anteriorId?: string
  ): Promise<IGameResult | undefined> {
    try {
      return new Promise((resolve) => {
        const result = setInterval(async () => {
          let gameResults = await this.blazeService.getGameDatasFromBlaze();

          if (isEmpty(gameResults) || !gameResults) {
            gameResults = await this.blazeService.getGameDatasFromBlaze();

            const hasSameAnteriorId = gameResults[0].id === anteriorId;

            if (hasSameAnteriorId) {
              clearInterval(result);
              await this.isReadyToStartBet(anteriorId);
            }
          }

          let { id, crash_point: crash_1 } = gameResults[0];
          let { crash_point: crash_2 } = gameResults[1];

          if (id === anteriorId) {
            const newGameResults = await this.getResultsToNewRound(
              anteriorId!!
            );
            crash_1 = newGameResults[0].crash_point;
            crash_2 = newGameResults[1].crash_point;
          }

          const isTowLastResultsAboveParam = crash_1 > 1.299 && crash_2 > 1.299;

          if (isTowLastResultsAboveParam) {
            clearInterval(result);
            resolve(gameResults[0]);
          }
        }, 5000);

        return result;
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getNewResultId(anteriorId: string): Promise<IGameResult> {
    const gameResults = await this.blazeResultGamesBeforeResult();

    if (gameResults.id === anteriorId) {
      this.getNewResultId(anteriorId);
    }

    return gameResults;
  }

  async getResultsToNewRound(anteriorId: string): Promise<IGameResult[]> {
    return new Promise((resolve) => {
      const gameResult = setInterval(async () => {
        let gameResults = await this.blazeService.getGameDatasFromBlaze();

        if (isEmpty(gameResults) || !gameResults) {
          gameResults = await this.blazeService.getGameDatasFromBlaze();
        }

        if (anteriorId === gameResults[0].id) {
          clearInterval(gameResult);
          await this.getResultsToNewRound(anteriorId);
        }
        clearInterval(gameResult);
        resolve(gameResults);
      }, 5000);
    });
  }
}
