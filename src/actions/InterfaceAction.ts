import { VoiceConnection } from "@discordjs/voice";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

abstract class AbstractAction {
    public handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>, connection?:VoiceConnection): void {};
}
export default AbstractAction;