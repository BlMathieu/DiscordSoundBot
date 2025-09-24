import { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";

abstract class AbstractAction {

    private command: string
    constructor(command: string) {
        this.command = command;
    }

    public abstract handleAction(message: ChatInputCommandInteraction): void;
    public abstract getCommand(): SlashCommandOptionsOnlyBuilder;

    public canHandle(command: string): boolean {
        return command === this.command;
    }
}
export default AbstractAction;