import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import "dotenv/config";
import AbstractAction from "../actions/AbstractAction";
import DeleteAction from "../actions/DeleteAction";
import DownloadAction from "../actions/DownloadAction";
import ListAction from "../actions/ListAction";
import PlayAudioAction from "../actions/PlayAction";
import RenameAction from "../actions/RenameAction";
import YTDownloadAction from "../actions/YTDownloadAction";
import ClientHandler from "../handlers/ClientHandler";
import CommandHandler from "../handlers/CommandHandler";
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

class DiscordController {
    private client: Client;
    private restClient: REST;
    private TOKEN: string;
    private APPLICATION_ID: string;

    private actions: AbstractAction[];

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ]
        });

        this.APPLICATION_ID = process.env.APPLICATION_ID || "";
        this.TOKEN = process.env.TOKEN || "";
        this.restClient = new REST().setToken(this.TOKEN);

        this.actions = [new PlayAudioAction(), new RenameAction(), new DeleteAction(), new YTDownloadAction(), new DownloadAction(), new ListAction()];
    }

    public async login() {
        await this.client.login(this.TOKEN);
    }

    public registerCommands() {
        const commands = this.actions.map(a => a.getCommand());
        this.restClient.put(Routes.applicationCommands(this.APPLICATION_ID), { body: commands });
    }

    public listen() {
        const clientReady = new ClientHandler();
        const commandHandler = new CommandHandler(this.actions);

        this.client.once(Events.ClientReady, clientReady.processHandler);
        this.client.on(Events.InteractionCreate, (interaction) => {
            commandHandler.processHandler(interaction);
        });
    }
}

export default DiscordController;