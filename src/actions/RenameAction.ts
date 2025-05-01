import { Message, OmitPartialGroupDMChannel } from "discord.js";
import AbstractAction from "./InterfaceAction";

class RenameAction extends AbstractAction {
    constructor(){super()}
    
    public static handleAction(message: OmitPartialGroupDMChannel<Message<boolean>>){

    }
}

export default RenameAction