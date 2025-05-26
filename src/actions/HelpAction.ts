import { VoiceConnection } from "@discordjs/voice";
import AbstractAction from "./AbstractAction";

class HelpAction extends AbstractAction {
    public handleAction(connection?: VoiceConnection): void {
        const text = `Liste des commandes : 
        # >play {music_name.ext} {?speed:[0.5 <= value <= 68 ]} {?loop}
        # >yt add {file_name.ext} {yt_url}
        # >stop
        # >list
        # >rename {old_music_name.ext} {new_music_name.ext}
        # >delete {music_name.ext}
Pour ajouter un audio, glisser déposer un fichier audio dans le channel !
        `;
        this.message.reply(text);
    }
}

export default HelpAction