import { AudioPlayerStatus, joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import SoundPlayer from "../controller/SoundController";
import AbstractHandler from "./AbstractHandler";
import ReaderUtils from "../utils/FSUtils";
import axios from "axios";
import FSUtils from "../utils/FSUtils";

class MessageCreateHandler extends AbstractHandler {
    constructor() {
        super();
    }
    public async processHandler(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        try {

            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment) {
                    const url = attachment.url;
                    const fileName = attachment.name
                    await downloadFile(url, fileName);
                }
            }

            const isCommandline = message.content.startsWith('>');
            if (isCommandline) {
                const isList = message.content.toLowerCase().startsWith('>list');
                if (isList) {
                    const files = ReaderUtils.getExistingAudioFilesNames();
                    let display: string = ""
                    files.forEach((file) => { display += `${file}\n`; })
                    message.reply(`Liste :\n${display}`);
                }
                else {
                    const isStop = message.content.toLowerCase().startsWith(">stop");
                    const isPlay = message.content.toLowerCase().startsWith('>play');
                    const connection = getChannelConnection(message);

                    if (isPlay) playAudio(connection, message);
                    else if (isStop) connection.destroy();
                }
            }
        } catch (error) {
            console.error(error);
            if (error instanceof Error) message.reply(error.message);
        }
    }
}

export default MessageCreateHandler;

function getChannelConnection(message: OmitPartialGroupDMChannel<Message<boolean>>): VoiceConnection {
    const channel = message.member?.voice.channel;
    if (!channel) {
        message.reply('Tu dois être dans un channel vocal !');
        throw new Error('Not in vocal channel !');
    }
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel?.guild.id,
        adapterCreator: channel?.guild.voiceAdapterCreator,
        selfDeaf: false,
    });
    return connection
}

function playAudio(connection: VoiceConnection, message: OmitPartialGroupDMChannel<Message<boolean>>) {
    try {
        const soundPlayer = new SoundPlayer();
        const userDemande = message.content.split(" ");
        const fileName = userDemande[1];
        const speed = Number(userDemande[2]);
        const loop = userDemande[3];

        const sound = soundPlayer.playSound(fileName, speed);
        connection.subscribe(sound);

        sound.on(AudioPlayerStatus.Idle, () => {
            if (loop) soundPlayer.playSound(fileName, speed);
            else {
                connection.destroy();
                message.channel.send('Lecture terminé ÇA GRAND M_ÈRE !');
            }
        });
    } catch (error) {
        console.error(error);
        connection.destroy();
    }
}

async function downloadFile(url: string, fileName: string) {
    const existingFiles = FSUtils.getExistingAudioFilesNames();
    if (existingFiles.includes(fileName)) throw new Error('File already exists !');
    const data = await axios.get(url, { responseType: 'arraybuffer' });
    FSUtils.writeFile(data.data, fileName);
}