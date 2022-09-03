import { BlazeBotRepository } from "../../repository/blaze-bot-prisma-repository";
import { PrismaClient } from "@prisma/client";

export const blazeBotRepositoryFactory = () =>
  new BlazeBotRepository(new PrismaClient());
