import { Client, Events, GatewayIntentBits} from "discord.js";
import "dotenv/config";
import ClientHandler from "../handlers/client_handler";
import CommandHandler from "../handlers/command_handler";

class DiscordController {
    private client: Client;
    private token: string;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildVoiceStates,
            ]
        });
        this.token = process.env.TOKEN || "";
    }

    public async login() {
        await this.client.login(this.token);
    }

    public listen() {
        const clientReady = new ClientHandler();
        const messageCreate = new CommandHandler();
        this.client.once(Events.ClientReady, clientReady.processHandler)
        this.client.on(Events.MessageCreate, messageCreate.processHandler);
    }
}
export default DiscordController;