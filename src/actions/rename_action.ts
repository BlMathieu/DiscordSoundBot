import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./abstract_action";
import AudioFileUtils from "../utils/audiofile_utils";
import HandlerError from "../errors/handler_error";
import AudioFileValidityUtils from "../utils/audiofile_validity_utils";

class RenameAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) { super(message) }

    public handleAction(): void {
        const args = this.message.content.split(' ').filter(m => m != "");
        const oldName = args[1];
        const newName = args[2];

        const doesFileExists = AudioFileValidityUtils.doesAudioFileAlreadyExists(oldName);
        if (!doesFileExists) throw new HandlerError(`Le fichier n'existe pas !`);

        AudioFileUtils.renameAudioFile(oldName, newName);

        this.message.reply(`Le fichie '${oldName}' à été renommé en '${newName}'`);
    }
}

export default RenameAction