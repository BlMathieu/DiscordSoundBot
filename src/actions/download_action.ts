import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./abstract_action";
import AudioFileUtils from "../utils/audiofile_utils";
import axios from "axios";
import HandlerError from "../errors/handler_error";
import AudioFileValidityUtils from "../utils/audiofile_validity_utils";

class DownloadAction extends AbstractAction {

    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message);
    }

    public async handleAction(): Promise<void> {
        const attachment = this.message.attachments.first();
        if (!attachment) throw new HandlerError("Aucun fichier trouvé !");

        const url = attachment.url;
        const fileName = attachment.name
        
        if (!AudioFileValidityUtils.isAudioFileExtensionValid(fileName)) throw new HandlerError("L'extension du fichier n'est pas correcte !");

        const audioBuffer = await axios.get(url, { responseType: 'arraybuffer' });
        AudioFileUtils.writeAudioFile(audioBuffer.data, fileName);
        this.message.reply(`'${fileName}' a été ajouté !`);
    }

}
export default DownloadAction;