import { PrismaClient } from "@prisma/client";
import {
  ICrashResultDto,
  IInserCrashResult
} from "./interfaces/blaze-bot-repository-interfaces";
import { ObjectId } from "mongodb";

export class BlazeBotRepository implements IInserCrashResult {
  constructor(private readonly prismaClient: PrismaClient) {}

  async insertCrashResult(crashResult: ICrashResultDto): Promise<void> {
    await this.prismaClient.results.create({
      data: { id: new ObjectId().toString(), ...crashResult }
    });
  }
}
