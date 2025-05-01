import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./InterfaceAction";
import FSUtils from "../utils/FSUtils";
import axios from "axios";

class DownloadAction extends AbstractAction {
    public static async handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        const attachment = message.attachments.first();
        if (attachment) {
            const url = attachment.url;
            const fileName = attachment.name

            if (!FSUtils.isValidExtension(fileName)) throw new Error("Incorrect file extension !");

            const existingFiles = FSUtils.getExistingAudioFilesNames();
            if (existingFiles.includes(fileName)) throw new Error('File already exists !');
            const data = await axios.get(url, { responseType: 'arraybuffer' });
            const cleanName = FSUtils.writeFile(data.data, fileName);
            message.reply(`'${cleanName}' a été ajouté !`);
        }
    }
}
export default DownloadAction;