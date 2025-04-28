import { Client } from "discord.js";
import AbstractHandler from './AbstractHandler';

class ClientReadyHandler extends AbstractHandler {
    constructor() { super(); }

    public processHandler(readyClient: Client<true>): void {
        console.log("Logged at : ", readyClient.user?.tag);
    }
}

export default ClientReadyHandler;