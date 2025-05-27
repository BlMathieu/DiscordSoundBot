import { AudioPlayer, createAudioPlayer, createAudioResource, StreamType } from "@discordjs/voice";
import path from "path";
import { spawn } from "child_process";
import { DEFAULT_PATH } from "../constantes/path_const";
import AudioFileValidityUtils from "../utils/audiofile_validity_utils";
import HandlerError from "../errors/handler_error";

class SoundPlayer {

    private player: AudioPlayer;

    constructor() {
        this.player = createAudioPlayer();
    }

    public playSound(soundName: string, speed: number): AudioPlayer {
        if (!speed) speed = 1;

        const filePath = path.resolve(DEFAULT_PATH, soundName);

        if (!AudioFileValidityUtils.isAudioFilePathValid(filePath)) throw new HandlerError("Le chemin du fichier n'est pas valide ! ");
        if (!AudioFileValidityUtils.doesAudioFileAlreadyExists(soundName)) throw new HandlerError(`Le fichier n'existe pas !`);

        const ressource = this.createFastAudioResource(filePath, speed);
        this.player.play(ressource);

        return this.player;
    }

    private createFastAudioResource(filePath: string, speed: number) {
        const ffmpeg = spawn('ffmpeg', [
            '-i', filePath,
            '-filter:a', `atempo=${speed}`,
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
            'pipe:1'
        ]);

        return createAudioResource(ffmpeg.stdout, {
            inputType: StreamType.Raw,
        });
    }
}

export default SoundPlayer;