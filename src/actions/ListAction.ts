import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./AbstractAction";
import FSUtils from "../utils/FSUtils";

class ListAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>){
        super(message)
    }
    public handleAction(): void {
        const files = FSUtils.getExistingAudioFilesNames();
        let display: string = ""
        files.forEach((file) => { display += `${file},\n`; })
        this.message.reply(`Liste :\n${display}`);
    }    
}
export default ListAction;
