import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractHandler from "./abstract_handler";
import DownloadAction from "../actions/download_action";
import ListAction from "../actions/list_action";
import PlayAudioAction from "../actions/play_audio_action";
import HelpAction from "../actions/help_action";
import HandlerError from "../errors/handler_error";
import RenameAction from "../actions/rename_action";
import DeleteAction from "../actions/delete_action";
import YTDownloadAction from "../actions/yt_download_action";
import { QUOICOUBEH } from "../constantes/trash_const";
import SearchAction from "../actions/search_action";
import AntiHarrasmentAction from "../actions/anti_harrasment_action";

class CommandHandler extends AbstractHandler {
    constructor() { super(); }

    public async processHandler(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        try {
            new AntiHarrasmentAction(message).handleAction();
            if(message.content.toLowerCase().split(" ").includes("quoi")) message.reply(QUOICOUBEH);

            const hasFile = message.attachments.size > 0;
            const isCommandline = message.content.startsWith('>');
            const askList = message.content.toLowerCase().startsWith('>list');
            const askSearch = message.content.toLowerCase().startsWith('>search');
            const askRename = message.content.toLowerCase().startsWith('>rename');
            const askDelete = message.content.toLowerCase().startsWith('>delete');
            const askHelp = message.content.toLowerCase().startsWith('>help') || message.content.toLowerCase() == '>';
            const askStop = message.content.toLowerCase().startsWith(">stop");
            const askPlay = message.content.toLowerCase().startsWith('>play');
            const askYt = message.content.toLowerCase().startsWith('>yt add');
            const needChannel = askPlay || askStop;


            if (!isCommandline && !hasFile) throw new Error("Not a command")!

            if (hasFile) await new DownloadAction(message).handleAction();
            if (askList) new ListAction(message).handleAction();
            if (askSearch) new SearchAction(message).handleAction();
            if (askRename) new RenameAction(message).handleAction();
            if (askDelete) new DeleteAction(message).handleAction();
            if (askHelp) new HelpAction(message).handleAction();
            if (askYt) new YTDownloadAction(message).handleAction();

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

export default CommandHandler;

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