import { AudioPlayer, createAudioPlayer, createAudioResource, StreamType } from "@discordjs/voice";
import path from "path";
import ReaderUtils from "../utils/FSUtils";
import "dotenv/config";
import { spawn } from "child_process";

class SoundPlayer {

    private player: AudioPlayer;

    constructor() {
        this.player = createAudioPlayer();
    }

    public playSound(soundName: string, speed: number): AudioPlayer {
        if(!speed) speed = 1; 
        const DEFAULT_PATH = process.env.DEFAULT_PATH || "";
        const filePath = path.resolve(`${DEFAULT_PATH}/${soundName}`);
        ReaderUtils.checkPath(filePath);

        const audioFiles = ReaderUtils.getExistingAudioFilesNames();

        if (!audioFiles.includes(soundName)) throw new Error("Sound does not exists !");

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