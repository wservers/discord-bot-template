import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";

export interface AppCommand extends ChatInputApplicationCommandData {
	execute(interaction: CommandInteraction): Promise<void>;
	break?(): Promise<void>;
}
