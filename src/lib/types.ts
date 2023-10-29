import type {
    ChannelType,
    DMChannel,
    ForumChannel,
    Guild,
    GuildBasedChannel, GuildEmoji,
    GuildMember, Message, NewsChannel, PartialDMChannel,
    PartialGroupDMChannel, Role,
    StageChannel,
    TextBasedChannel, TextChannel, User
} from "discord.js";
import type {
    Economy,
    Game,
    Leveling,
    Logging,
    Profile,
    Punishment,
    Tickets,
    Verify
} from "./index";

/** Gets the keys of a type as a type */
export type KeyofType<T extends any> = T extends any ? keyof T : never;

/** Creates getters for specified object type */
export type Getters<T> = {
    [Property in KeyofType<T> as `get${Capitalize<string & Property>}`]: () => T[Property]
};

/** Removes the specified field from the specified type */
export type RemoveField<T, K extends KeyofType<T>> = {
    [Property in KeyofType<T> as Exclude<Property, K>]: T[Property];
};

/** Returns a type as an array */
export type ToArray<T> = T extends any ? T[] : never;

/** Removal 'optional' attributes from T */
export type Concrete<T> = {
    [Property in KeyofType<T>]-?: T[Property];
};

export type Optional<T, P extends KeyofType<T>> = {
    [Property in KeyofType<T>]?: T[Property];
} & { [Property in P]-?: T[P]; };

/** Find P in T, if it exists it returns the found result, otherwise, return unknown */
export type FindProperty<
    T,
    P extends KeyofType<T>
> = T[P] extends undefined ? unknown : T[P];

/** Represents a type that may or may not be a promise */
export type Awaitable<T> = PromiseLike<T> | T;

export type DestinationType =
    | "role"
    | "channel";

export type UserType =
    | "user"
    | "client";

export type OwnerType =
    | "owner"
    | "developer";

export type TextBasedChannels = Exclude<TextBasedChannel, DMChannel | PartialDMChannel | PartialGroupDMChannel>;
export type ChannelTypes =
    | ChannelType.GuildText
    | ChannelType.GuildVoice
    | ChannelType.GuildCategory
    | ChannelType.GuildAnnouncement
    | ChannelType.AnnouncementThread
    | ChannelType.PublicThread
    | ChannelType.PrivateThread
    | ChannelType.GuildStageVoice
    | ChannelType.GuildForum;

export type MemberReturn = {
    valid_fetch: boolean;
    member: GuildMember | null;
};

export type RoleReturn = {
    valid_fetch: boolean;
    role: Role | null;
};

export type ChannelReturn = {
    valid_fetch: boolean;
    channel: GuildBasedChannel | null;
    channel_type: ChannelTypes | null;
};

export type GuildReturn = {
    valid_fetch: boolean;
    guild: Guild | null;
};

export type MessageReturn = {
    valid_fetch: boolean;
    message: Message | null;
};

export type EmojiReturn = {
    valid_fetch: boolean;
    emoji: GuildEmoji | null;
};

export type UserReturn = {
    valid_fetch: boolean;
    user: User | null;
};

/** Make all properties in T readonly, except those defined in P */
export type PerformReadonly<T, P extends KeyofType<T>> = {
    readonly [Property in KeyofType<T>]: T[Property]
} & { -readonly [Prop in P]: T[P] };

/** Removes the properties defined in P from T to be readonly, other properties will be ignored */
export type ReduceReadonly<T, P extends KeyofType<T>> = {
    -readonly [Property in P]: T[Property];
} & { [Property in keyof T]: T[Property] };

export type PunishTypes =
    | "Warning"
    | "TempMute"
    | "Mute"
    | "Kick"
    // Ban before user even joined.
    | "PreBan"
    // Ban with no deletion of messages.
    | "SoftBan"
    | "TempBan"
    | "Ban";

export type GuildTextChannels =
    | NewsChannel
    | StageChannel
    | TextChannel
    | ForumChannel;

export type EnsurableObjects =
    | Leveling
    | Economy
    | Profile
    | Punishment
    | Tickets
    | Logging
    | Verify
    | Profile
    | Game;
