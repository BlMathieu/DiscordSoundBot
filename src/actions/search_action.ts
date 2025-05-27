import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./abstract_action";
import AudioFileUtils from "../utils/audiofile_utils";

class ListAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message)
    }
    public handleAction(): void {
        const args = this.message.content.split(' ').filter(m => m != "");
        const nameToSearch = args[1];

        const files = AudioFileUtils.getExistingAudioFilesNames();
        const filteredFiles = files.filter(f => f.toLowerCase().includes(nameToSearch.toLowerCase()));

        const display = filteredFiles.map((file) => { return `${file},\n`; })

        this.message.reply(`Liste :\n${display}`);
    }
}
export default ListAction;
