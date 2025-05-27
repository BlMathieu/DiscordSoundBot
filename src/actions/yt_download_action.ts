import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./abstract_action";
import { VoiceConnection } from "@discordjs/voice";
import { spawn } from "child_process";
import { DEFAULT_PATH } from "../constantes/path_const";
import AudioFileValidityUtils from "../utils/audiofile_validity_utils";
import path from "path";
import HandlerError from "../errors/handler_error";

class YTDownloadAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message);
    }

    public handleAction(connection?: VoiceConnection): void {
        const actions = this.message.content.split(" ");
        const ytURL = actions[3];
        const fileName = actions[2];

        const validFilePath = path.resolve(DEFAULT_PATH, fileName);

        if (!AudioFileValidityUtils.doesAudioFileAlreadyExists(validFilePath)) throw new HandlerError(`Le fichier existe déjà !`);
        if (!AudioFileValidityUtils.isAudioFilePathValid(validFilePath)) throw new HandlerError(`Le chemin du fichier n'est pas valide !`);

        const args = [
            '-o', validFilePath,
            '-x',
            '--audio-format', 'mp3',
            '-f', 'bestaudio',
            ytURL
        ];

        const request = spawn("yt-dlp", args);

        request.on("error", () => {
            this.message.reply("Une erreur est survenu lors du téléchargement du fichier !");
        });
        request.on('close', () => {
            this.message.reply(`Le fichier ${fileName} à été ajouté avec succès !`);
        });

    }
}

export default YTDownloadAction;