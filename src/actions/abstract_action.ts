import { VoiceConnection } from "@discordjs/voice";
import { Message, OmitPartialGroupDMChannel } from "discord.js";

abstract class AbstractAction {
    protected message: OmitPartialGroupDMChannel<Message<boolean>>;

    constructor(message:OmitPartialGroupDMChannel<Message<boolean>>){
        this.message = message;
    }
    public handleAction(connection?:VoiceConnection): void {};
}
export default AbstractAction;