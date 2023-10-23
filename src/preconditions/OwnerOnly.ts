import { Command, Precondition } from "@sapphire/framework";
import { envParseArray } from "../lib/index";
import { MAIN_OWNER } from "../lib/index";

const OWNERS = envParseArray("OWNERS", [MAIN_OWNER.id]);

export class OwnerOnlyPrecondition extends Precondition {
  public chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }

  public contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    return this.checkOwner(interaction.user.id);
  }

  private checkOwner(userId: string) {
    return OWNERS.includes(userId) ? this.ok() : this.error({
      message: "This command can only be used by the bot owner.",
    });
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}
