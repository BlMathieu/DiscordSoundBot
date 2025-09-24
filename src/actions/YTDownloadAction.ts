import { spawn } from "child_process";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import path from "path";
import { DEFAULT_PATH } from "../constantes/PathConstante";
import HandlerError from "../errors/HandlerError";
import AudioFileValidityUtils from "../utils/ValidityUtil";
import AbstractAction from "./AbstractAction";

class YTDownloadAction extends AbstractAction {
    constructor() { super("yt_download"); }

    public getCommand(): SlashCommandOptionsOnlyBuilder {
        const command = new SlashCommandBuilder()
            .setName("yt_download")
            .setDescription("Download a music from youtube")
            .addStringOption(option => option
                .setName("file_name")
                .setDescription("Name of the downloaded file")
                .setRequired(true))
            .addStringOption(option => option
                .setName("url")
                .setDescription("Youtube URL")
                .setRequired(true));

        return command;
    }

    public handleAction(interaction: ChatInputCommandInteraction): void {
        const ytURL = interaction.options.getString("url");
        const fileName = interaction.options.getString("file_name");

        if (!ytURL) throw new HandlerError("URL invalide !");
        if (!fileName) throw new HandlerError("Fichier manquant !");

        const validFilePath = path.resolve(DEFAULT_PATH, fileName);

        if (AudioFileValidityUtils.doesAudioFileAlreadyExists(validFilePath)) throw new HandlerError(`Le fichier existe déjà !`);
        if (!AudioFileValidityUtils.isAudioFilePathValid(validFilePath)) throw new HandlerError(`Le chemin du fichier n'est pas valide !`);

        const args = [
            '-o', validFilePath,
            '-x',
            '--audio-format', 'mp3',
            '-f', 'bestaudio',
            ytURL
        ];

        interaction.reply("Téléchargement en cours...");

        const request = spawn("yt-dlp", args);

        request.on("error", () => {
            interaction.followUp("Une erreur est survenu lors du téléchargement du fichier !");
        });
        request.on('close', () => {
            interaction.followUp(`Le fichier ${fileName} à été ajouté avec succès !`);
        });
    }
}

export default YTDownloadAction;