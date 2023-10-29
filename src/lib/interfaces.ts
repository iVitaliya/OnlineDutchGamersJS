import type { Collection, Role } from "discord.js";
import type { MonoxityDB } from "monoxity.db";
import type { PunishTypes, RemoveField } from "./types";

export interface UserRoleInfo {
  highest: {
    mention: string;
    id: string;
    name: string;
  };
  roles: Role[];
  roles_collection: Collection<string, Role>;
}

export interface ITime {
  state: "Completed" | "In Progress";
  changed: "lowered" | "none" | "raised";
  current_time: number;
}

export interface IDatabase {
  economy: MonoxityDB;
  punishments: MonoxityDB;
  profiles: MonoxityDB;
  leveling: MonoxityDB;
  game: MonoxityDB;
  tickets: MonoxityDB;
  logging: MonoxityDB;
  verify: MonoxityDB;
}

export interface Logging {
  modLoggingChannelID: string;
  inviteLogChannelID: string;
  memberLogChannelID: string;
  messageLogChannelID: string;
  reportsLogChannelID: string;
  actionsChannelID: string;
}

export interface Economy {
  userID: string;
  balance: number;
  bank: number;
  /** The Date.now() */
  last_worked: number;
  last_robbed: number;
}

export interface Leveling {
  userID: string;
  messages: number;
  level: number;
  prestige: number;
  canPrestige: "true" | "false";
}

export interface Profile {
  userID: string;
  // country: string;
  // hobbies: string[];
  // age: number;
  bio: string;
  country: string;
  display_created_at: boolean;
  display_account_joined_at: boolean;
  embed_color: string;
  footer: string;
  // Display server leveling, containing only the level and the amount of messages.
  display_own_level: boolean;
  // Displays the user with the most messages and level.
  display_highest_level: boolean;
}

export interface Game {
  userID: string;
  current_equiped_weapon: string;
  items: string[];
  already_bought_nickname: boolean;
  next_nickname_allowance_at: string;
  slain_monsters: number;
}

export interface Punishment {
  type: PunishTypes;
  userID: string;
  time?: {
    str: string;
    duration: number;
  };
  temporary: "true" | "false";
  at: string;
  modID: string;
  reason: string;
  silent: "true" | "false";
  revoked: "true" | "false";
}

export interface Infractions {
  userID: string;
  /** Count of total punishments */
  infractions: number;
  warnings: RemoveField<Punishment, "temporary" | "time">[];
  mutes: Punishment[];
  kicks: RemoveField<Punishment, "temporary" | "time" | "revoked">[];
  bans: Punishment[];
}

export interface GuildConfig {
  /** The message prefix */
  prefix: string;
  banProtection: "true" | "false";
  memberProtection: "true" | "false";
  channelProtection: "true" | "false";
  roleProtection: "true" | "false";
  blacklistedUsers: string[];
  blacklistedLinks: string[];
  blacklistedWords: string[];
  whitelistedLinks: string[];
  antiSpam: "true" | "false";
  antiCaps: "true" | "false";
  antiSwear: "true" | "false";
  blacklistedSwears: "true" | "false";
  xpIgnoredChannelsID: string;
  mods: string[];
  admins: string[];
}

export interface Verify {
  verifyChannelID: string;
  verifyRoleID: string;
}

export interface Tickets {
  creatorID: string;
  channelID: string;
  categoryID: string;
  isClosed: "true" | "false";
  allowInvites: "true" | "false";
  allowLinks: "true" | "false";
  /** message ID of the dashboard sent */
  dashboard: string;
}

export interface Partner {
  partnerRoleID: string;
  partnerChannelID: string;
  allowPartnerChatInvitesChannels: string[];
}
