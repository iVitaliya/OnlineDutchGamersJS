import type { ListenerOptions, PieceContext } from "@sapphire/framework";
import { Listener } from "@sapphire/framework";
import {
  AuditLogEvent,
  ChannelType,
  Events,
  GuildMember,
  TextChannel,
} from "discord.js";
import {
  CacheResolver,
  client,
  ClientResolver,
  Database,
  Defaults,
  ensureDatabase,
  findEntry,
  hasDatabaseItem,
  KeyofType,
  Leveling,
  LoggingMessages,
  MessageEmbed,
  OWNER,
  pushEntry,
} from "../../lib/index";

export class GuildMemberRemove extends Listener {
  public constructor(context: PieceContext, options?: ListenerOptions) {
    super(context, {
      event: Events.GuildMemberRemove,
      ...options,
    });
  }

  public async run(member: GuildMember) {
    const { id, guild } = member;
    const cache = new CacheResolver(guild);

    const leaveLogChannel = await Database.logging.get(
      LoggingMessages.CHANNELS.Leave,
      "null",
    );
    const leaveMsg = await Database.logging.get(
      LoggingMessages.MESSAGES.Leave,
      "null",
    );

    const databases = [
      "economy",
      "punishments",
      "profiles",
      "leveling",
      "game",
      "tickets",
      "logging",
      "verify",
    ] as KeyofType<typeof Database>[];

    let entry = await findEntry(
      guild,
      AuditLogEvent.MemberKick,
      (x) =>
        x.targetId === member.id &&
        x.createdTimestamp > Date.now() - 1000 * 60,
    );
    if (!entry) return;

    let entries = await pushEntry(entry, member.user.username);

    
  }
}
