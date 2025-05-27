import DiscordController from "./controller/discord_controller";

const discord = new DiscordController();

discord.listen();
discord.login();