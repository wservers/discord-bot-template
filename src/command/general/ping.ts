import { CommandInteraction } from "discord.js";
import { AppCommand } from "../../interfaces/AppCommand";

export class PingPong implements AppCommand {
	name = "ping";
	description = "Discord API 레이턴시를 확인 합니다.";

	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.followUp(`:ping_pong: **Pong!** ${interaction.client.ws.ping}ms`);
	}
}
