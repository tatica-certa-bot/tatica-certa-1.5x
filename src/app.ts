import express from "express";
import bodyParser from "body-parser";
import { PORT } from "./common/constants";
import { Telegraf } from "telegraf";
import { botServiceFactory } from "./common/factories/bot-service-factory";
const { TOKEN } = process.env;

const app = express();
app.use(bodyParser.json());

botServiceFactory().getResultsFromBlazeToBotTelegram();
