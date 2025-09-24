import { Client } from "discord.js";
import AbstractHandler from './AbstractHandler';

class ClientHandler extends AbstractHandler {
    constructor() { super(); }

    public processHandler(readyClient: Client<true>): void {
        console.log("Logged at : ", readyClient.user?.tag);
    }
}

export default ClientHandler;