import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./AbstractAction";
import FSUtils from "../utils/FSUtils";
import HandlerError from "../errors/HandlerError";

class RenameAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) { super(message) }

    public handleAction() {
        const args = this.message.content.split(' ').filter(m => m != "");
        const oldName = args[1];
        const newName = args[2];

        const existingFiles = FSUtils.getExistingAudioFilesNames();
        const file = existingFiles.find(f => f == oldName);
        if (!file) throw new HandlerError("Cannot rename non-existing file !");

        const names = FSUtils.renameFile(oldName, newName);
        this.message.reply(`Le fichie '${names.old}' à été renommé en '${names.new}'`);
    }
}

export default RenameAction