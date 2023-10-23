import { send } from "@sapphire/plugin-editable-commands";
import {
  AuditLogEvent,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  ForumChannel,
  Guild,
  GuildChannel,
  Message,
  NewsChannel,
  PrivateThreadChannel,
  PublicThreadChannel,
  StageChannel,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import {
  Database,
  FooterText,
  KeyofType,
  logger,
  MessageContentMessages,
  MessageEmbed,
  RandomLoadingMessage,
} from "../lib/index";

const Log = logger({ name: "Utils" });

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
export function pickRandom<T>(array: readonly T[]): T {
  const { length } = array;
  const random = array[Math.floor(Math.random() * length)];

  if (random === undefined) {
    throw Log.error(
      "The provided array couldn't be used as an array to randomize from, please try another type of array or retry to make sure it's not working",
    );
  }
  return random;
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
export function sendLoadingMessage(message: Message): Promise<Message> {
  return send(message, {
    embeds: [
      new MessageEmbed("Settings")
        .setAuthor({ name: "Loading..." })
        .setDescription(pickRandom(RandomLoadingMessage))
        .setTimestamp()
        .setFooter({ text: FooterText })
        .build,
    ],
  });
}

export function sendErrorMessage(
  interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
  embed: MessageEmbed,
  checkReplied: boolean,
) {
  if (checkReplied && interaction.replied) {
    return interaction.editReply({
      content: MessageContentMessages.MEMBER_PERMISSIONS,
      embeds: [embed.build],
    });
  } else {return interaction.reply({
      content: MessageContentMessages.MEMBER_PERMISSIONS,
      embeds: [embed.build],
    });}
}

export function detectChannelSort(
  channel:
    | GuildChannel
    | NewsChannel
    | StageChannel
    | TextChannel
    | PrivateThreadChannel
    | PublicThreadChannel<boolean>
    | VoiceChannel,
) {
  const name = channel.constructor.name;

  return name.replace("Channel", " Channel");
}

export function detectTextChannelType(channel: GuildChannel) {
  if (channel instanceof TextChannel) return channel;
  if (channel instanceof NewsChannel) return channel;
  if (channel instanceof ForumChannel) return channel;
  else return null;
}

export function detectVoiceChannelType(channel: GuildChannel) {
  if (channel instanceof StageChannel) return channel;
  if (channel instanceof VoiceChannel) return channel;
  else return null;
}

export async function dataInObject(
  table: KeyofType<typeof Database>,
  obj: string,
  key: string,
) {
  const data = await Database[table].get(obj);

  // @ts-ignore It is an object
  if (key in data) return true;
  else return false;
}

export function sortAuditLogReason(type: string, reason: string) {
  const r = reason
    .replace("[ODG]", "")
    .replace("|", "")
    .replace(type, "");

  return removeSurroundedSpacing(r);
}

export function removeSurroundedSpacing(text: string) {
  const lastIndex = text.length - 1;
  let str: string = text;

  if (text.startsWith(" ", 0)) str = text[0].slice(0, 1);
  if (text.endsWith(" ")) str = text[lastIndex].slice(lastIndex - 1, lastIndex);

  return str;
}

export async function detectLog(guild: Guild, type: AuditLogEvent, ID: string) {
  const auditLog = await guild.fetchAuditLogs({
    limit: 1,
    type: type,
  });
  const punishment = auditLog.entries.find((entr) => entr.targetId === ID);

  return punishment!;
}
