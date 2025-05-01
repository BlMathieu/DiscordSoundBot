import { VoiceConnection } from "@discordjs/voice";
import { OmitPartialGroupDMChannel, Message } from "discord.js";
import AbstractAction from "./AbstractAction";

class HelpAction extends AbstractAction {
    public static handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>, connection?: VoiceConnection): void {
        const text = `Liste des commandes : 
        # >play {music_name.ext} {?speed:[0.5 <= value <= 68 ]} {?loop}
        # >stop
        # >list
        # >rename {old_music_name.ext} {new_music_name.ext}
        # >delete {music_name.ext}
Pour ajouter un audio, glisser déposer un fichier audio dans le channel !
        `;
        message.reply(text);
    }
}

export default HelpAction