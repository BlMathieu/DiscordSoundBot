import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./abstract_action";
import AudioFileUtils from "../utils/audiofile_utils";
import AudioFileValidityUtils from "../utils/audiofile_validity_utils";

class DeleteAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) { super(message) }

    public handleAction() {
        const args = this.message.content.split(' ').filter(m => m != "");
        const fileName = args[1];

        AudioFileUtils.deleteAudioFile(fileName);

        const isFileRemoved = !AudioFileValidityUtils.doesAudioFileAlreadyExists(fileName);
        if (isFileRemoved) this.message.reply(`Le fichier '${fileName}' a été supprimé !`);
        else this.message.reply(`Le fichier n'a pas été supprimé !`);
    }
}

export default DeleteAction;