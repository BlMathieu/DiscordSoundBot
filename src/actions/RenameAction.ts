import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import HandlerError from "../errors/HandlerError";
import AudioFileUtils from "../utils/FileUtil";
import AudioFileValidityUtils from "../utils/ValidityUtil";
import AbstractAction from "./AbstractAction";

class RenameAction extends AbstractAction {
    constructor() { super("rename"); }

    public getCommand(): SlashCommandOptionsOnlyBuilder {
        const renameCommand = new SlashCommandBuilder()
            .setName("rename")
            .setDescription("Rename an audio file")
            .addStringOption(option => option
                .setName("old_name")
                .setDescription("Audio file to rename")
                .setRequired(true))
            .addStringOption(option => option
                .setName("new_name")
                .setDescription("New audio file name")
                .setRequired(true));

        return renameCommand;
    }

    public handleAction(interaction: ChatInputCommandInteraction): void {
        const oldName = interaction.options.getString("old_name");
        const newName = interaction.options.getString("new_name");

        if (!oldName || !newName) throw new HandlerError("Argument manquant !");

        const doesFileExists = AudioFileValidityUtils.doesAudioFileAlreadyExists(oldName);

        if (!doesFileExists) throw new HandlerError(`Le fichier n'existe pas !`);

        AudioFileUtils.renameAudioFile(oldName, newName);

        interaction.reply(`Le fichie '${oldName}' à été renommé en '${newName}'`);
    }
}

export default RenameAction;