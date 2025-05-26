import { AudioPlayer, createAudioPlayer, createAudioResource, StreamType } from "@discordjs/voice";
import path from "path";
import FSUtils from "../utils/FSUtils";
import { spawn } from "child_process";
import { DEFAULT_PATH } from "../constantes/path_const";

class SoundPlayer {

    private player: AudioPlayer;

    constructor() {
        this.player = createAudioPlayer();
    }

    public playSound(soundName: string, speed: number): AudioPlayer {
        if(!speed) speed = 1;
        
        // FILE PATH
        const filePath = path.resolve(DEFAULT_PATH, soundName);
        FSUtils.checkPath(filePath);

        // AUDIO FILES
        const audioFiles = FSUtils.getExistingAudioFilesNames();
        if (!audioFiles.includes(soundName)) throw new Error("Sound does not exists !");

        // RESSOURCES
        const ressource = this.createFastAudioResource(filePath, speed);

        // PLAY AUDIO
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