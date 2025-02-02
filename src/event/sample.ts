import { ClientEvents, Message, OmitPartialGroupDMChannel } from "discord.js";
import { EventListener } from "../interfaces/EventListener";

export class Sample implements EventListener {
	event: keyof ClientEvents = "messageCreate";

	async execute(message: OmitPartialGroupDMChannel<Message<boolean>>) {
		if (message.author.bot)
			return;

		await message.channel.send("Hello, World!");
	}
}
