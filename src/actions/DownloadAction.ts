import axios from "axios";
import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";
import AudioFileUtils from "../utils/FileUtil";
import AudioFileValidityUtils from "../utils/ValidityUtil";
import AbstractAction from "./AbstractAction";

class DownloadAction extends AbstractAction {
  constructor() { super("download"); }

  public getCommand(): SlashCommandOptionsOnlyBuilder {
    const downloadCommand = new SlashCommandBuilder()
      .setName("download")
      .setDescription("Download a file attachment")
      .addAttachmentOption(option => option
        .setName("attachment")
        .setDescription("Audio file to attach"));

    return downloadCommand;
  }

  public async handleAction(interaction: ChatInputCommandInteraction): Promise<void> {
    const attachment = interaction.options.getAttachment("attachment");

    if (!attachment) throw new Error("Aucun fichier trouvé !");

    const url = attachment.url;
    const fileName = attachment.name;

    if (!AudioFileValidityUtils.isAudioFileExtensionValid(fileName)) {
      throw new Error("L'extension du fichier n'est pas correcte !");
    }

    interaction.reply("Téléchargement en cours...");

    const audioBuffer = await axios.get(url, { responseType: "arraybuffer" });
    AudioFileUtils.writeAudioFile(audioBuffer.data, fileName);

    interaction.followUp(`'${fileName}' a été ajouté !`);
  }
}
export default DownloadAction;
