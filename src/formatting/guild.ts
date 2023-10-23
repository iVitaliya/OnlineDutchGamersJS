import type { Collection, Guild, GuildMember, Role } from "discord.js";

export class GuildFormat {
  public roles(guild: Guild): string {
    return guild.roles.cache
      .sort((a: Role, b: Role) => b.position - a.position)
      .map((role: Role) => role.name)
      .join(", ");
  }

  public async members(guild: Guild): Promise<string> {
    const memberList: Collection<string, GuildMember> = await guild
      .members.list({ cache: true });
    let res: string = "";

    memberList.sort((a: GuildMember, b: GuildMember) =>
      b.joinedAt!.getDate() - a.joinedAt!.getDate()
    ).forEach((user: GuildMember) =>
      res = res + `${user.user.displayName} (${user.user.id})\n`
    );

    return res;
  }
}
