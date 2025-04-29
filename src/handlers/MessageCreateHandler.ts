import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractHandler from "./AbstractHandler";
import DownloadAction from "../actions/DownloadAction";
import ListAction from "../actions/ListAction";
import PlayAudioAction from "../actions/PlayAudioAction";
import HelpAction from "../actions/HelpAction";
import HandlerError from "../errors/HandlerError";

class MessageCreateHandler extends AbstractHandler {
    constructor() {super();}

    public async processHandler(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        try {
            const hasFile = message.attachments.size > 0;
            const isCommandline = message.content.startsWith('>');
            const isList = message.content.toLowerCase().startsWith('>list');
            const askHelp = message.content.toLowerCase().startsWith('>help') || message.content.toLowerCase() == '>';
            const isStop = message.content.toLowerCase().startsWith(">stop");
            const isPlay = message.content.toLowerCase().startsWith('>play');
            const needChannel = isPlay || isStop;

            if (!isCommandline && !hasFile) throw new Error("Not a command")!

            if (hasFile) await DownloadAction.handleAction(message);
            if (isList) ListAction.handleAction(message);
            if (askHelp) HelpAction.handleAction(message);
            if (needChannel) {
                const connection = getChannelConnection(message);
                if (isPlay) PlayAudioAction.handleAction(message, connection);
                if (isStop) connection.destroy();
            }
        }
        catch (error) {
            if (error instanceof HandlerError) {
                console.error(error);
                message.reply(error.message);
            }
        }
    }
}

export default MessageCreateHandler;

function getChannelConnection(message: OmitPartialGroupDMChannel<Message<boolean>>): VoiceConnection {
    const channel = message.member?.voice.channel;
    if (!channel) throw new HandlerError('Not in vocal channel !');
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel?.guild.id,
        adapterCreator: channel?.guild.voiceAdapterCreator,
        selfDeaf: false,
    });
    return connection
}