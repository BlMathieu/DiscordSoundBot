import { Client, Events, GatewayIntentBits} from "discord.js";
import "dotenv/config";
import ClientReadyHandler from "../handlers/ClientReadyHandler";
import MessageCreateHandler from "../handlers/MessageCreateHandler";

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
        const clientReady = new ClientReadyHandler();
        const messageCreate = new MessageCreateHandler();
        this.client.once(Events.ClientReady, clientReady.processHandler)
        this.client.on(Events.MessageCreate, messageCreate.processHandler);
    }
}
export default DiscordController;