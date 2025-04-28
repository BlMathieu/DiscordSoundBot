import DiscordController from "./controller/DiscordController";

const discord = new DiscordController();

discord.listen();
discord.login();