import dotenv from "dotenv";
import { Kernel } from "./bot/kernel";
import process from "node:process";
import { IntentsBitField, Partials } from "discord.js";

dotenv.config();

if (process.env.BOT_TOKEN === undefined) {
	console.error(".env 파일에 BOT_TOKEN 변수가 선언 되어 있지 않습니다!");
	process.exit(1);
}

const bot = new Kernel({
	intents: [
		IntentsBitField.Flags.DirectMessages,
		IntentsBitField.Flags.GuildPresences,
		IntentsBitField.Flags.MessageContent,
		IntentsBitField.Flags.GuildMessages
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
});
bot.useEvent("event");
bot.useCommand("command");

bot.build(process.env.BOT_TOKEN);

