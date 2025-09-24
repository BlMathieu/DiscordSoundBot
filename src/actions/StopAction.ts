import { getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import HandlerError from "../errors/HandlerError";
import AbstractAction from "./AbstractAction";

class StopAction extends AbstractAction {
    constructor() {
        super("stop");
    }

    public getCommand(): SlashCommandOptionsOnlyBuilder {
        const commmand = new SlashCommandBuilder()
            .setName("stop")
            .setDescription("Stop the current track");

        return commmand;
    }

    public handleAction(message: ChatInputCommandInteraction): void {
        const id = message.guild?.id;

        if (!id) throw new HandlerError("Not in vocal channel !");

        const connection = getVoiceConnection(id);
        connection?.destroy();

        message.reply("Channel quitté !");
    }



}