import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./AbstractAction";
import FSUtils from "../utils/FSUtils";
import axios from "axios";
import HandlerError from "../errors/HandlerError";

class DownloadAction extends AbstractAction {

    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message);
    }

    public async handleAction(): Promise<void> {
        const attachment = this.message.attachments.first();
        if (!attachment) throw new HandlerError("Aucun fichier trouvé !");

        const url = attachment.url;
        const fileName = attachment.name

        // CHECKING FILE VALIDITY
        if (!FSUtils.isValidExtension(fileName)) throw new HandlerError("Incorrect file extension !");
        const existingFiles = FSUtils.getExistingAudioFilesNames();
        if (existingFiles.includes(fileName)) throw new HandlerError('File already exists !');

        // WRITE FILE
        const data = await axios.get(url, { responseType: 'arraybuffer' });
        const cleanName = FSUtils.writeFile(data.data, fileName);

        this.message.reply(`'${cleanName}' a été ajouté !`);
    }
}
export default DownloadAction;