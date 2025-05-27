import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./abstract_action";
import { VoiceConnection } from "@discordjs/voice";
import { CONNOR_RESPONSE, INJURIES_EN, INJURIES_FR, NAMES } from "../constantes/trash_const";

export default class AntiHarrasmentAction extends AbstractAction {
    constructor(message: OmitPartialGroupDMChannel<Message<boolean>>) {
        super(message)
    }

    public handleAction(connection?: VoiceConnection): void {
        const messageArray = this.message.content.toLowerCase().split(" ");
        const callConnor = NAMES.some(n => messageArray.includes(n.toLowerCase()));
        if (callConnor) {
            const insultFR = INJURIES_FR.some(i => messageArray.includes(i.toLowerCase()));
            const insultEN = INJURIES_EN.some(i => messageArray.includes(i.toLowerCase()));
            if (insultFR || insultEN) {
                const index = Math.floor(Math.random() * CONNOR_RESPONSE.length);
                const response = CONNOR_RESPONSE[index];
                this.message.reply(response);
            }
        }
    }
}