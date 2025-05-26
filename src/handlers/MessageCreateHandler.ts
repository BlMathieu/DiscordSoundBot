import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractHandler from "./AbstractHandler";
import DownloadAction from "../actions/DownloadAction";
import ListAction from "../actions/ListAction";
import PlayAudioAction from "../actions/PlayAudioAction";
import HelpAction from "../actions/HelpAction";
import HandlerError from "../errors/HandlerError";
import RenameAction from "../actions/RenameAction";
import DeleteAction from "../actions/DeleteAction";
import YTAction from "../actions/YTAction";

class MessageCreateHandler extends AbstractHandler {
    constructor() { super(); }

    public async processHandler(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        try {
            // COMMANDLINES
            const hasFile = message.attachments.size > 0;
            const isCommandline = message.content.startsWith('>');
            const askList = message.content.toLowerCase().startsWith('>list');
            const askRename = message.content.toLowerCase().startsWith('>rename');
            const askDelete = message.content.toLowerCase().startsWith('>delete');
            const askHelp = message.content.toLowerCase().startsWith('>help') || message.content.toLowerCase() == '>';
            const askStop = message.content.toLowerCase().startsWith(">stop");
            const askPlay = message.content.toLowerCase().startsWith('>play');
            const askYt = message.content.toLowerCase().startsWith('>yt add');
            const needChannel = askPlay || askStop;

            // ACTIONS
            if (!isCommandline && !hasFile) throw new Error("Not a command")!
            if (hasFile) await new DownloadAction(message).handleAction();
            if (askList) new ListAction(message).handleAction();
            if (askRename) new RenameAction(message).handleAction();
            if (askDelete) new DeleteAction(message).handleAction();
            if (askHelp) new HelpAction(message).handleAction();
            if (askYt) new YTAction(message).handleAction();
            if (needChannel) {
                const connection = getChannelConnection(message);
                if (askPlay) new PlayAudioAction(message).handleAction(connection);
                if (askStop) connection.destroy();
            }
        }
        catch (error) {
            if (error instanceof HandlerError) message.reply(error.message);
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