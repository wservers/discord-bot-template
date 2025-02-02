import { ClientEvents } from "discord.js"

export interface EventListener {
	once?: boolean;
	event: keyof ClientEvents;
	execute(...args: any[]): Promise<void>;
	break?(): Promise<void>;
}
