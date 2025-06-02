import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./abstract_action";
import AudioFileUtils from "../utils/audiofile_utils";
import axios from "axios";
import AudioFileValidityUtils from "../utils/audiofile_validity_utils";

class DownloadAction extends AbstractAction {
  constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
    super(message);
  }

  public async handleAction(): Promise<void> {
    const attachment = this.message.attachments.first();
    if (!attachment) throw new Error("Aucun fichier trouvé !");

    const url = attachment.url;
    const fileName = attachment.name;

    if (!AudioFileValidityUtils.isAudioFileExtensionValid(fileName))
      throw new Error("L'extension du fichier n'est pas correcte !");

    const audioBuffer = await axios.get(url, { responseType: "arraybuffer" });
    AudioFileUtils.writeAudioFile(audioBuffer.data, fileName);
    this.message.reply(`'${fileName}' a été ajouté !`);
  }
}
export default DownloadAction;
