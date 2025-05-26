import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./AbstractAction";
import SoundPlayer from "../controller/SoundController";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnection } from "@discordjs/voice";
import path from "path";
import { DEFAULT_PATH } from "../constantes/path_const";
import FSUtils from "../utils/FSUtils";
import { VoiceConnectionStatus } from "@discordjs/voice";

class PlayAudioAction extends AbstractAction {

    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message);
    }

    public handleAction(connection: VoiceConnection): void {
        try {
            // VARIABLES 
            let counter = 0;
            const soundPlayer = new SoundPlayer();
            const userDemande = this.message.content.split(" ");
            const fileNames = userDemande[1].split(',').filter(f => f != "");
            const speed = Number(userDemande[2]);
            const isLoop = userDemande[3] === "loop";

            // CONNECT SOUND
            const sound = soundPlayer.playSound(fileNames[0], speed);
            connection.subscribe(sound);

            // MANAGE SOUNDS
            sound.on(AudioPlayerStatus.Idle, () => this.onIdle(connection, isLoop, counter, fileNames, soundPlayer, speed));

        } catch (error) {
            console.error(error);
            connection.destroy();
        }
    }

    private onIdle(connection: VoiceConnection, isLoop: boolean, counter: number, fileNames: string[], soundPlayer: SoundPlayer, speed: number) {
        try {
            if (isLoop) (counter + 1 < fileNames.length) ? counter++ : counter = 0;
            else counter++;

            if (counter < fileNames.length) {
                const sound = soundPlayer.playSound(fileNames[counter], speed);
                connection.subscribe(sound);
            }
            else {
                connection.destroy();
                this.message.channel.send("Lecture terminé !");
            }
        } catch (error) {
            console.error(error)
            connection.destroy();
        }
    }
}

export default PlayAudioAction;