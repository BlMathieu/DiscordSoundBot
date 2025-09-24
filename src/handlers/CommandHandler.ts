import AbstractAction from "../actions/AbstractAction";
import AbstractHandler from "./AbstractHandler";

class CommandHandler extends AbstractHandler {
  private actions: AbstractAction[];

  constructor(actions: AbstractAction[]) {
    super();
    this.actions = actions;
  }

  public async processHandler(interaction: any): Promise<void> {
    try {
      this.actions.forEach(a => {
        const command = interaction.commandName;
        if (a.canHandle(command)) a.handleAction(interaction);
      });
    } catch (error: any) {
      console.error(error);
      interaction.reply(error.message);
    }
  }
}

export default CommandHandler;


