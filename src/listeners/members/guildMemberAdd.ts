import type { ListenerOptions, PieceContext } from "@sapphire/framework";
import { Listener } from "@sapphire/framework";
import { ChannelType, Events, GuildMember, TextChannel } from "discord.js";
import {
  CacheResolver,
  Database,
  Defaults,
  ensureDatabase,
  LoggingMessages,
  MessageEmbed,
  OWNER,
} from "../../lib/index";

export class GuildMemberAdd extends Listener {
  public constructor(context: PieceContext, options?: ListenerOptions) {
    super(context, {
      event: Events.GuildMemberAdd,
      ...options,
    });
  }

  public async run(member: GuildMember) {
    const { guild, id } = member;
    const cache = new CacheResolver(guild);

    await ensureDatabase("economy", id, Defaults.database_ensures.economy(id));
    await ensureDatabase(
      "profiles",
      id,
      Defaults.database_ensures.profiles(id),
    );
    await ensureDatabase(
      "leveling",
      id,
      Defaults.database_ensures.leveling(id),
    );
    await ensureDatabase("game", id, Defaults.database_ensures.game(id));

    // Gets the logging channel.
    const welcomeLogChannel = await Database.logging.get(
      LoggingMessages.CHANNELS.Welcome,
      "null",
    );
    const welcomeMsg = await Database.logging.get(
      LoggingMessages.MESSAGES.Welcome,
      "null",
    );

    // Check an if statement for if the logging channel can't be found,
    // only message the server owner, message the server owner if enabled
    if (welcomeLogChannel === "null") {
      (async () => {
        const owner = await OWNER();

        owner.send({
          embeds: [
            new MessageEmbed("Blocked")
              .setAuthor({ name: "No Log-Channel Detected" })
              .setDescription(
                "A member has joined the server but the log-channel to log joined members hasn't been setup yet, please do so by using \`/config welcome_channel\`",
              )
              .build,
          ],
        });
      })();

      return;
    } else if (welcomeLogChannel !== "null") {
      const channelObj = cache.channel(welcomeLogChannel as string);
      const wlcmMsg = (welcomeMsg as string).replace(
        "[User]",
        `<@${member.id}>`,
      )
        .replace(
          "[User.Name]".toLowerCase(),
          member.user.displayName.toLowerCase(),
        )
        .replace("[User.Id]", member.id)
        .replace("[Guild]".toLowerCase(), member.guild.name.toLowerCase())
        .replace("[Guild.Id]".toLowerCase(), member.guild.id);

      if (!channelObj.valid_fetch) return;
      if (channelObj.channel_type !== ChannelType.GuildText) return;
      const channel = channelObj.channel as TextChannel;

      wlcmMsg.replace("[Channel]", `<#${channel.id}>`)
        .replace("[Channel.Name]", channel.name)
        .replace("[Channel.Id]", channel.id);

      channel.send({
        embeds: [
          new MessageEmbed("Main")
            .setAuthor({ name: "A new member has joined!" })
            .setDescription(
              welcomeMsg === "null"
                ? Defaults.welcome_message(member.user) + " "
                : wlcmMsg,
            )
            .build,
        ],
      });
      return;
    }
  }
}
