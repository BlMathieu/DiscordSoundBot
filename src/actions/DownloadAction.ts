import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./InterfaceAction";
import FSUtils from "../utils/FSUtils";
import axios from "axios";

class DownloadAction extends AbstractAction{
    public static async handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>): Promise<void> {
        const attachment = message.attachments.first();
        if (attachment) {
            const url = attachment.url;
            const fileName = attachment.name

            if(!this.isValidExtension(fileName)) throw new Error("Incorrect file extension !");

            const existingFiles = FSUtils.getExistingAudioFilesNames();
            if (existingFiles.includes(fileName)) throw new Error('File already exists !');
            const data = await axios.get(url, { responseType: 'arraybuffer' });
            FSUtils.writeFile(data.data, fileName);
        }
    }

    private static isValidExtension(name:string):boolean{
        const supportedFilesExt = [".mp3",".mp4",".wav",".flac",".aac",".alac",".wma",".aiff",".pcm"];
        return supportedFilesExt.some(ext=> name.toLowerCase().endsWith(ext));
    }
}
export default DownloadAction;