import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./InterfaceAction";
import SoundPlayer from "../controller/SoundController";
import { AudioPlayerStatus, VoiceConnection } from "@discordjs/voice";

class PlayAudioAction extends AbstractAction {

    public static handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>, connection: VoiceConnection): void {
        try {
            let counter = 0;

            const soundPlayer = new SoundPlayer();
            const userDemande = message.content.split(" ");
            const fileNames = userDemande[1].split(',');
            const speed = Number(userDemande[2]);
            const isLoop = userDemande[3] == "loop";

            const sound = soundPlayer.playSound(fileNames[0], speed);
            connection.subscribe(sound);

            sound.on(AudioPlayerStatus.Idle, () => {
                try {
                    if (isLoop) (counter + 1 < fileNames.length) ? counter++ : counter = 0;
                    else counter++;
                    if (counter < fileNames.length) {
                        const sound = soundPlayer.playSound(fileNames[counter], speed);
                        connection.subscribe(sound);
                    }
                    else {
                        connection.destroy();
                        message.channel.send("Lecture terminé !");
                    }
                } catch (error) {
                    console.error(error)
                    connection.destroy();
                }

            });
        } catch (error) {
            console.error(error);
            connection.destroy();
        }
    }
}

export default PlayAudioAction;