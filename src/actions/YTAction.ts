import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./AbstractAction";
import { VoiceConnection } from "@discordjs/voice";
import { spawnSync } from "child_process";
import { DEFAULT_PATH } from "../constantes/path_const";
import FSUtils from "../utils/FSUtils";

class YTAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message);
    }

    public handleAction(connection?: VoiceConnection): void {
        const actions = this.message.content.split(" ");
        const ytURL = actions[3];
        const fileName = actions[2];

        const filePath = `${DEFAULT_PATH}/${fileName}`;
        FSUtils.checkPath(filePath);

        console.log(filePath, ytURL);

        const args = [
            '-o', filePath,
            '-x',
            '--audio-format', 'mp3',
            '-f', 'bestaudio',
            ytURL
        ];

        const request = spawnSync("yt-dlp", args);
        if (request.status === 0) this.message.reply(`Le fichier ${fileName} à été ajouté avec succès !`);
        else this.message.reply("Une erreur est survenu lors du téléchargement du fichier !");

        console.log("STATUT : ", request.status);
        console.log("SORTIE : ", request.stdout.toString());
        console.log("ERREUR : ", request.stderr.toString());
    }
}

export default YTAction;