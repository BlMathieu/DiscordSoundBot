import DiscordController from "./controller/DiscordController";

const discord = new DiscordController();

discord.login();
discord.registerCommands();
discord.listen();