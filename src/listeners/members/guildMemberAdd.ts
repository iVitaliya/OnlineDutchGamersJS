import type { ListenerOptions, PieceContext } from "@sapphire/framework";
import { Listener } from "@sapphire/framework";
import { ChannelType, Events, GuildMember, TextChannel } from "discord.js";
import {
  CacheResolver,
  Database,
  dataInObject,
  Defaults,
  Leveling,
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
    const guildId = guild.id;
    const cache = new CacheResolver(member.guild);

    const data = await dataInObject("leveling", "leveling", id);
    if (!data) {
      await Database.leveling.set(`leveling.${id}`, {
        userID: id,
        messages: 0,
        level: 0,
        prestige: 0,
        canPrestige: "false",
      } as Leveling);
    }

    // Gets the logging channel.
    const welcomeLogChannel = await Database.logging.get(
      `channels.welcome`,
      "null",
    );
    const welcomeMsg = await Database.logging.get(`messages.welcome`, "null");

    // Check an if statement for if the logging channel can't be found,
    // only message the server owner, message the server owner if enabled
    if (welcomeLogChannel === "null") {
      (async () => {
        const owner = await OWNER();

        owner.send({
          embeds: [
            new MessageEmbed("Blocked")
              .setAuthor({ name: "No Log-Channel" })
              .setDescription(
                "A member has joined the server but the log-channel to log joined members hasn't been setup yet, please do so by using \`/config log-members\`",
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
        member.user.displayName,
      )
        .replace("[User.Mention]", `<@${member.id}>`)
        .replace("[User.Id]", member.id)
        .replace("[Guild]", member.guild.name)
        .replace("[Guild.Id]", member.guild.id);

      if (!channelObj.valid_fetch) return;
      if (channelObj.channel_type !== ChannelType.GuildText) return;
      const channel = channelObj.channel as TextChannel;

      wlcmMsg.replace("[Channel]", channel.name)
        .replace("[Channel.Mention]", `<#${channel.id}>`)
        .replace("[Channel.Id]", channel.id);

      channel.send({
        embeds: [
          new MessageEmbed("Main")
            .setAuthor({ name: "A new member has joined!" })
            .setDescription(
              welcomeMsg === "null"
                ? Defaults.welcome_message(member.user)
                : wlcmMsg,
            )
            .build,
        ],
      });
      return;
    }
  }
}
