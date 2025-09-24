import { EmbedBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import AudioFileUtils from "../utils/FileUtil";
import AbstractAction from "./AbstractAction";

class ListAction extends AbstractAction {
    constructor() {
        super("list");
    }

    public getCommand(): SlashCommandOptionsOnlyBuilder {
        const command = new SlashCommandBuilder()
            .setName("list")
            .setDescription("Liste les fichiers disponible")

        return command;
    }

    public handleAction(message: ChatInputCommandInteraction): void {
        const files = AudioFileUtils.getExistingAudioFilesNames();
        const reply = new EmbedBuilder()
            .setTitle("Liste des fichiers disponible")
            .setDescription("Voici la liste des fichiers disponible :")
            .addFields(files.map(f => ({ name: "###", value: f })));

        message.reply({ embeds: [reply] });
    }

}

export default ListAction;