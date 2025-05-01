import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./AbstractAction";
import FSUtils from "../utils/FSUtils";

class DeleteAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) { super(message) }

    public handleAction() {
        const args = this.message.content.split(' ').filter(m => m != "");
        const deletedFile = FSUtils.deleteFile(args[1]);
        this.message.reply(`Le fichier '${deletedFile}' a été supprimé !`);
    }
}

export default DeleteAction;