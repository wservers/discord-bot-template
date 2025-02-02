import fs from "node:fs";
import path from "node:path";
import { AppCommand } from "../interfaces/AppCommand";
import { EventListener } from "../interfaces/EventListener";
import { Client, ClientOptions, Interaction } from "discord.js";

export class Kernel {
	private app: Client<boolean>;
	private commands: Map<string, AppCommand> = new Map();

	constructor(opts: ClientOptions) {
		this.app = new Client(opts);
	}

	async useEvent(dirname: string) {
		const base = __dirname.replace("/bot", "");
		const entries = fs.readdirSync(path.join(base, dirname)).filter((v) => v.endsWith(".ts"));
		for (const entry of entries) {
			const paths = path.join(base, dirname, entry.replace(".ts", ""));
			const module = await import(paths);
				
			const Clazz = module.default || Object.values(module)[0];
			if (typeof Clazz !== "function") {
				console.warn(`Skipping ${entry}: No valid event class found.`);
				continue;
			}

			try {
				const listener: EventListener = new Clazz();

				if (!listener.once) {
					this.app.on(listener.event, listener.execute);
					console.log(`registered event: ${entry}`);
					continue;
				}

				this.app.once(listener.event, listener.execute);
				console.log(`registered once event: ${entry}`);
			} catch (err) {
				console.error(err);
			}
		}
	}

	async useCommand(dirname: string) {
		const base = __dirname.replace("/bot", "");
		const entries = fs.readdirSync(path.join(base, dirname));
		for (const entry of entries) {
			const dir = fs.readdirSync(path.join(base, dirname, entry)).filter((v) => v.endsWith(".ts"));
			for (const f of dir) {
				const paths = path.join(base, dirname, entry, f.replace(".ts", ""));
				const module = await import(paths);
				
				const Clazz = module.default || Object.values(module)[0];
				if (typeof Clazz !== "function") {
					console.warn(`Skipping ${f}: No valid command class found.`);
					continue;
				}
				
				try {
					const command: AppCommand = new Clazz();
					this.commands.set(command.name, command);
					console.log(`add command: ${f}`);
				} catch (err) {
					console.error(err);
				}
			}
		}
	}

	async build(token: string) {
		this.app.once("ready", async (client) => {
			const data = Array.from(this.commands.values());

			await client.application.commands.set(data);
			console.log("logged in as %s#%d", client.user.username, client.user.discriminator);
		});

		this.app.on("interactionCreate", async (interaction: Interaction) => {
			if (!interaction.isCommand())
				return;

			this.commands.forEach(async (command) => {
				if (interaction.commandName === command.name) {
					await interaction.deferReply();

					try {
						await command.execute(interaction);
					} catch (err) {
						console.error(err);
					} finally {
						if (command.break === undefined)
							return;

						await command.break();
					}
				}
			});
		});

		await this.app.login(token);
	}
}
