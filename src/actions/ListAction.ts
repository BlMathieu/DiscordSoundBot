import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./InterfaceAction";
import ReaderUtils from "../utils/FSUtils";

class ListAction extends AbstractAction {
    public static handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>): void {
        const files = ReaderUtils.getExistingAudioFilesNames();
        let display: string = ""
        files.forEach((file) => { display += `${file},\n`; })
        message.reply(`Liste :\n${display}`);
    }    
}
export default ListAction;
