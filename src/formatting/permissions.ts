import type { GuildMember } from "discord.js";
import type { UserRoleInfo } from "../lib/index";

export class PermissionFormat {
  public formatPermission(permission: string): string {
    return permission
      .toLowerCase()
      .replace(/(^|"|_)(\S)/g, (perm) => perm.toUpperCase())
      .replace(/_/g, " ")
      .replace(/Guild/g, "Server")
      .replace(/Use Vad/g, "Use Voice Acitvity");
  }

  public formatPermissions(perm: string[]): string {
    let prms: string[] = [];

    perm.forEach((p) => {
      let prm = p.toLowerCase()
        .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
        .replace(/_/g, " ")
        .replace(/Guild/g, "Server")
        .replace(/Use Vad/g, "Use Voice Acitvity");

      prms.push(prm);
    });

    return prms.join(", ");
  }

  public compare(member: GuildMember, target: GuildMember): boolean {
    return member.roles.highest.position < target.roles.highest.position;
  }

  public info(member: GuildMember): UserRoleInfo {
    const obj: UserRoleInfo = {
      highest: {
        mention: `<@&${member.roles.highest.id}>`,
        name: member.roles.highest.name,
        id: member.roles.highest.id,
      },
      roles: member.roles.cache.map((rl) => rl)
        .sort((a: any, b: any) => b - a),
      roles_collection: member.roles.cache,
    };

    return obj as UserRoleInfo;
  }
}
