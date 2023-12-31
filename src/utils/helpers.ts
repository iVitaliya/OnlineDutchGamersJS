import type { Command } from "@sapphire/framework";
import {
  AuditLogEvent,
  ChannelType,
  Collection,
  Guild,
  GuildAuditLogsActionType,
  GuildAuditLogsEntry,
  GuildAuditLogsTargetType,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel as GuildTextChannel,
} from "discord.js";
import moment from "moment";
import ms from "parse-ms";
import {
  Database,
  DestinationType,
  EnsurableObjects,
  FooterText,
  KeyofType,
  Leveling,
  MAIN_OWNER,
  MessageContentMessages,
  MessageEmbed,
  OwnerType,
  UserType,
} from "../lib/index";

interface IPager<T> {
  arr: T[] | any[];
  itemsPerPage: number;
  page: number;
}

// interface ICooldown {
//     user: string;
//     amount: number;
//     date_started: number;
//     date_ended: number;
// }

// const cooldownedUsers = new Map<string, ICooldown>();

export const Time = (to_format?: number) =>
  typeof to_format === "number"
    ? moment(to_format).format("MMMM [the] Do, YYYY [@] h:mm:ss A")
    : moment().format("MMMM [the] Do, YYYY [@] h:mm:ss A");

// export const CooldownTime = (to_format: number) => moment(to_format).format("LTS");

export function formatPerms(perm: string) {
  return perm
    .toLowerCase()
    .replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
    .replace(/_/g, " ")
    .replace(/Guild/g, "Server")
    .replace(/Use Vad/g, "Use Voice Acitvity");
}

export function Pager<T>(data: IPager<T>) {
  if (!data.page) {
    data.page = 1;
  }

  const maxPages = Math.ceil(data.arr.length / data.itemsPerPage);
  if (data.page < 1 || data.page > maxPages) return null;

  return {
    data: data.arr.slice(
      (data.page - 1) * data.itemsPerPage,
      data.page * data.itemsPerPage,
    ) as T[],
    max: maxPages,
  };
}

function checkPermissions(
  permissions: PermissionResolvable[],
  channel: GuildTextChannel,
  member: GuildMember,
) {
  const p = permissions.sort();
  const perms = channel.permissionsFor(member, true);

  for (const perm of p) {
    if (perms.has(perm, true)) {
      p.splice(p.indexOf(perm));
    }
  }

  return p;
}

export async function sendCheckedPermissions(
  interaction: Command.ChatInputCommandInteraction,
  perms: PermissionResolvable[],
  dest_type: DestinationType,
  user_type: UserType,
) {
  const { channel } = interaction;
  const member = interaction.member as GuildMember;
  const permissions = checkPermissions(
    perms,
    channel as GuildTextChannel,
    member,
  );

  if (permissions.length || permissions.length > 0) {
    let str: string;
    // const _p = (permissions as string[]).sort();
    permissions.forEach((x, i) => {
      const lastIndex = permissions.length - 1;
      if (i === lastIndex) {
        str = str + formatPerms(x as string);
      } else {
        str = str + formatPerms(x as string) + ", ";
      }
    });

    if (interaction.channel!.type !== ChannelType.GuildText) return;

    await interaction.reply({
      content: MessageContentMessages.MEMBER_PERMISSIONS,
      embeds: [
        new MessageEmbed("Failed")
          .setAuthor({ name: "An Error Occurred" })
          .setDescription(
            "You don't have the required permissions for this command, please make sure you have the permissions listed below, if this seems like an false error then please report this using `/bugreport`.",
          )
          .addField({
            name: "Required Permission" + (permissions.length === 1 ? "" : "s"),
            // @ts-ignore Assigned through for-loop
            value: str,
            inline: true,
          })
          .addField({
            name: `Occurrence`,
            value: [
              `**On** ${dest_type === "role" ? "Role" : "Channel"}`,
              `**For** ${user_type === "client" ? "Bot (Me)" : "Author (You)"}`,
            ].join("\n"),
            inline: true,
          })
          .setFooter({ text: `ODG Errors | ${FooterText}` })
          .build,
      ],
      ephemeral: true,
    });

    return true;
  } else return false;
}

export async function checkID(
  interaction: Command.ChatInputCommandInteraction,
  data: {
    user: string;
    supposed_user: string;
    type: OwnerType;
    setting: boolean;
  },
) {
  if (data.setting) return false;
  if (data.user !== data.supposed_user) {
    await interaction.reply({
      content: MessageContentMessages.MEMBER_PERMISSIONS,
      embeds: [
        new MessageEmbed("Failed")
          .setAuthor({ name: "An Error Occurred" })
          .setDescription(
            `You can't execute this command as it's a \`${
              data.type === "owner" ? "Server Owner" : "Bot Developer"
            }\` **ONLY** command, if this seems like an false error then please report this using \`/bugreport\`.`,
          )
          .setFooter({ text: `ODG Errors | ${FooterText}` })
          .build,
      ],
      ephemeral: true,
    });

    return true;
  }

  return false;
}

export async function guildMe(guild: Guild) {
  return await guild.members.fetchMe({
    cache: false,
    force: true,
  });
}

export function toProperCase(str: string) {
  let s = str.split("_");

  s = s.map((i) => i.charAt(0).toUpperCase() + i.substring(1));
  return s.join(" ");
}

export function canWorkAgain(last_worked: number) {
  const canWork = last_worked + 5000;

  if (Date.now() === canWork) return true;
  else return false;
}

export function canRobAgain(last_robbed: number) {
  const canRob = last_robbed + 10000;

  if (Date.now() === canRob) return true;
  else return false;
}

export const lvlCol = new Collection<string, number>();

export const levelForPrestige = [
  25,
  50,
  75,
  100,
  125,
  150,
  175,
  200,
  225,
  250,
  275,
  300,
  325,
  350,
  375,
  400,
  425,
  450,
  475,
  500,
  525,
  550,
  575,
  600,
  625,
  650,
  675,
  700,
  725,
  750,
  775,
  800,
  825,
  850,
  875,
  900,
  925,
  950,
  975,
  1000,
  1025,
  1050,
  1075,
  1100,
  1125,
  1150,
  1175,
  1200,
  1225,
  1250,
  1275,
  1300,
  1325,
  1350,
  1375,
  1400,
  1425,
  1450,
  1475,
  1500,
  1525,
  1550,
  1575,
  1600,
  1625,
  1650,
  1675,
  1700,
  1725,
  1750,
  1775,
  1800,
  1825,
  1850,
  1875,
  1900,
  1925,
  1950,
  1975,
  2000,
  2025,
  2050,
  2075,
  2100,
  2125,
  2150,
  2175,
  2200,
  2225,
  2250,
  2275,
  2300,
  2325,
  2350,
  2375,
  2400,
  2425,
  2450,
  2475,
  2500,
];

export async function canPrestige(ids: {
  guild: string;
  user: string;
}, level: number) {
  const data = await Database.leveling.get<Leveling>(
    `${ids.guild}.${ids.user}`,
  );

  if (data.prestige === 100) {
    return {
      neededLevel: 0,
      valid: false,
    };
  }

  const requirement = levelForPrestige[data.prestige];
  if (requirement === level) return true;
  else return false;
}

function trueLevel(prestige: number, level: number) {
  const nextPres = levelForPrestige[prestige];

  if (level === nextPres) return nextPres;
  else if (level > nextPres) return nextPres;
  else return level;
}

export async function setLevel(ids: {
  guild: string;
  user: string;
}, level: number) {
  const data = await Database.leveling.get<Leveling>(
    `${ids.guild}.${ids.user}`,
  );
  const trueLvl = trueLevel(data.prestige, level);

  await Database.leveling.set(`${ids.guild}.${ids.user}`, {
    userID: ids.user,
    messages: 25 * trueLvl,
    level: trueLvl,
    prestige: data.prestige,
    canPrestige: data.canPrestige,
  } as Leveling);
}

export async function resetLevelCollection(guildID: string, userID: string) {
  if (!lvlCol.has(userID)) {
    lvlCol.set(userID, 1);
  }

  const msgs = lvlCol.get(userID)!;
  if (msgs !== 1) lvlCol.set(userID, 1);

  await Database.leveling.set(`${guildID}.${userID}`, {
    userID: userID,
    messages: 1,
    level: 0,
    prestige: 0,
    canPrestige: "false",
  } as Leveling);
}

export function checkIfAltAccount(member: GuildMember): boolean {
  const timestamp = Math.floor(member.user.createdTimestamp - Date.now());
  const created = ms(timestamp);

  if (created.days < 7) return true;
  else return false;
}

export async function hasModule(
  table: keyof typeof Database,
  guildID: string,
  key: string,
) {
  const mods = await Database[table].getAll();
  let mod: boolean = false;

  for (const m of mods) {
    mod = m.key === `${guildID}.${key}`;
  }

  return mod;
}

export async function moduleFetch(
  table: keyof typeof Database,
  guildID: string,
  key: string,
) {
  const mod = await Database[table].get(`${guildID}.${key}`);
  const included = hasModule(table, guildID, key);

  return !included ? false : mod;
}

// export async function findEntry(
//   guild: Guild,
//   event: AuditLogEvent,
//   callback: (entry: GuildAuditLogsEntry<AuditLogEvent>) => boolean,
// ) {
//   const logs = await guild.fetchAuditLogs();
//   const entries = logs.entries;

//   entries.filter((x) => x.action === event);

//   return callback;
// }

export async function hasDatabaseItem(
  table: KeyofType<typeof Database>,
  key: string,
): Promise<boolean> {
  const tab = Database[table];
  const data = await tab.getAll();

  for (let i = 0; i < data.length; i++) {
    let payload = data[i];

    if (payload.key === key) {
      return true;
    }
  }

  return false;
}

export async function ensureDatabase(
  table: KeyofType<typeof Database>,
  key: string,
  ensurables: EnsurableObjects,
) {
  const tab = Database[table];
  const data = await hasDatabaseItem(table, key);

  if (data) return;

  tab.set(key, ensurables);
}

export async function limits() {
  
}

export async function getEntry(key: string, fallback?: any) {
  return Database.logging.get(`guardian.${key}`, fallback);
}

export async function setEntry(key: string, data: any) {
  return Database.logging.set(`guardian.${key}`, data);
}

export async function deleteEntry(key: string) {
  return Database.logging.delete(`guardian.${key}`);
}

export async function findEntry(
  guild: Guild,
  action: AuditLogEvent,
  filter: (
    fn: GuildAuditLogsEntry<
      null,
      GuildAuditLogsActionType,
      GuildAuditLogsTargetType,
      AuditLogEvent
    >,
  ) => boolean,
): Promise<
  GuildAuditLogsEntry<
    AuditLogEvent,
    GuildAuditLogsActionType,
    GuildAuditLogsTargetType,
    AuditLogEvent
  > | null
> {
  const me = await guildMe(guild);

  return new Promise(
    (resolve) => {
      // @ts-ignore
      (async function search(iter) {
        if (!me) return resolve(null);

        if (me.permissions.has(PermissionFlagsBits.ViewAuditLog, true)) {
          let logs = await guild.fetchAuditLogs({
            limit: 10,
            type: action,
          });
          let entries = logs.entries;
          let entry:
            | GuildAuditLogsEntry<
              AuditLogEvent,
              GuildAuditLogsActionType,
              GuildAuditLogsTargetType,
              AuditLogEvent
            >
            | null = null;

          entries = entries.filter(filter);

          for (var e of entries) {
            if (!entry || e[0] > entry.id) entry = e[1];
          }

          // @ts-ignore
          if (entry) return resolve(entry);
        }

        if (++iter === 5) return resolve(null);
        else return setTimeout(search, 200, iter);
      })(0);
    },
  );
}

export async function pushEntry(
  entry: GuildAuditLogsEntry<
    AuditLogEvent,
    GuildAuditLogsActionType,
    GuildAuditLogsTargetType,
    AuditLogEvent
  >,
  displayName: string,
) {
  const action =
    [AuditLogEvent.MemberKick, AuditLogEvent.MemberBanAdd].includes(
        entry.action,
      )
      ? "MEMBER_REMOVE"
      : (
        entry.action === AuditLogEvent.MemberKick
          ? "MEMBER_KICK"
          : (entry.action === AuditLogEvent.MemberBanAdd
            ? "MEMBER_BAN_ADD"
            : "UNKNOWN")
      );
  const oneHourAgo = Date.now() - 1000 * 60 * 60;

  // Fetch Entries for a sepcific action (Last Hour)
  let entries = await getEntry(action, [] as any[]) as any;

  // Filter entries older than one hour to a new variable
  let olderThanOneHour = entries.filter((x: { timestamp: number; }) => !(x.timestamp > oneHourAgo));

  // Prepend entries older than one hour to the archive
  if (olderThanOneHour.length > 0) {
    setEntry(`archive.${action}`, [
      ...olderThanOneHour,
      ...await getEntry(`archive.${action}`, [] as any[]) as any,
    ]);
  }

  // Filter entries older than one hour from old variable
  entries = entries.filter((x: { timestamp: number; }) => x.timestamp > oneHourAgo);

  // Prepend new entry if not already found
  if (
    !entries.find(
      (x: { target: { id: string | null; }; executor: { id: string | null; }; }) =>
        x.target.id === entry.targetId &&
        x.executor.id === entry.executorId,
    )
  ) {
    entries.unshift({
      timestamp: entry.createdTimestamp,
      action: entry.action,
      target: {
        id: entry.targetId,
        displayName,
        targetType: entry.targetType,
      },
      executor: {
        id: entry.executorId,
        displayName: entry.executor!.username,
      },
    });
  }

  // Update entries newer than one hour.
  return setEntry(action, entries);
}

export async function checkLimits(
  guild: Guild,  
  entries: false | {
    key: string | number;
    value: any;
  },
  executorID: string,
  configAction: string
) {
  if (executorID === guild.ownerId) return;

  const oneMinuteAgo = Date.now() - 1000 * 60;
  let executorActionsHour = (entries as any).filter(
    (i: { executor: { id: string; }; }) => i.executor.id === executorID
  );
  let executorActionsMinute = executorActionsHour.filter(
    (i: { timestamp: number; }) => i.timestamp > oneMinuteAgo
  );

  console.log(`${configAction}/${executorID}: LAST_HOUR: ${executorActionsHour.length} LAST_MINUTE: ${executorActionsMinute.length}`);

  let l = await limits();
}
