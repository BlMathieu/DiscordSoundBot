import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import HandlerError from "../errors/HandlerError";
import AudioFileUtils from "../utils/FileUtil";
import AudioFileValidityUtils from "../utils/ValidityUtil";
import AbstractAction from "./AbstractAction";

class DeleteAction extends AbstractAction {
    constructor() { super("delete"); }

    public getCommand(): SlashCommandOptionsOnlyBuilder {
        const deleteCommand = new SlashCommandBuilder()
            .setName("delete")
            .setDescription("Delete an audio file")
            .addStringOption(option => option
                .setName("file_name")
                .setDescription("Audio file to delete")
                .setRequired(true)
            );

        return deleteCommand;
    }

    public handleAction(interaction: ChatInputCommandInteraction): void {
        const fileName = interaction.options.getString('file_name');

        if (!fileName) throw new HandlerError("Le fichier n'existe pas !");

        AudioFileUtils.deleteAudioFile(fileName);

        const isFileRemoved = !AudioFileValidityUtils.doesAudioFileAlreadyExists(fileName);

        if (isFileRemoved) interaction.reply(`Le fichier '${fileName}' a été supprimé !`);
        else interaction.reply(`Le fichier n'a pas été supprimé !`);
    }
}

export default DeleteAction;