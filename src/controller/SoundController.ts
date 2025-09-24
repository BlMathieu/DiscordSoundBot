import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import { spawn } from "child_process";
import path from "path";
import { DEFAULT_PATH } from "../constantes/PathConstante";
import HandlerError from "../errors/HandlerError";
import AudioFileValidityUtils from "../utils/ValidityUtil";

class SoundController {
  private player: AudioPlayer;
  private connection: VoiceConnection;

  constructor(connection: VoiceConnection) {
    this.player = createAudioPlayer();
    this.connection = connection;
  }

  public playSound(soundName: string, speed: number = 1) {
    const filePath = path.resolve(DEFAULT_PATH, soundName);

    if (!AudioFileValidityUtils.isAudioFilePathValid(filePath)) {
      throw new HandlerError("Le chemin du fichier n'est pas valide ! ");
    }
    if (!AudioFileValidityUtils.doesAudioFileAlreadyExists(soundName)) {
      throw new HandlerError(`Le fichier n'existe pas !`);
    }

    const ressource = this.createFastAudioResource(filePath, speed);
    this.player.play(ressource);
  }

  public getPlayer(): AudioPlayer {
    return this.player;
  }

  public setIdleListener(fileNames: string[], isLoop: boolean, speed = 1, counter: number = 0) {
    this.player.on(AudioPlayerStatus.Idle, () => {
      try {
        if (isLoop) (counter + 1 < fileNames.length) ? counter++ : counter = 0;
        else counter++;

        if (counter < fileNames.length) {
          this.playSound(fileNames[counter], speed);
          this.connection.subscribe(this.player);
        } else this.connection.destroy();

      } catch (error) {
        console.error(error)
        this.connection.destroy();
      }
    });
  }

  private createFastAudioResource(filePath: string, speed: number): AudioResource {
    const ffmpeg = spawn("ffmpeg", [
      "-i",
      filePath,
      "-filter:a",
      `atempo=${speed}`,
      "-f",
      "s16le",
      "-ar",
      "48000",
      "-ac",
      "2",
      "pipe:1",
    ]);

    return createAudioResource(ffmpeg.stdout, {
      inputType: StreamType.Raw,
    });
  }
}

export default SoundController;
