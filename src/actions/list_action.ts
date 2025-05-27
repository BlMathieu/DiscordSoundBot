import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./abstract_action";
import AudioFileUtils from "../utils/audiofile_utils";

class ListAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>){
        super(message)
    }
    public handleAction(): void {
        const files = AudioFileUtils.getExistingAudioFilesNames();

        const display = files.map((file) => { return `${file}\n`; })

        this.message.reply(`Liste :\n${display}`);
    }    
}
export default ListAction;
