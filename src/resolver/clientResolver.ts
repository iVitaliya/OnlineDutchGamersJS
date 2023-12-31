import type { SapphireClient } from "@sapphire/framework";
import { User, GuildResolvable } from "discord.js";
import type {
  ChannelReturn,
  ChannelTypes,
  GuildReturn,
  TextBasedChannels,
  UserReturn
} from "../lib/index";

/** A class which helps with searching through the client for certain entities. */
export class ClientResolver {
  private client: SapphireClient;

  public constructor(client: SapphireClient) {
    this.client = client;
  }

  /**
   * A property which helps searching for a user with the provided value.
   * @param value - The value which will be used to search for a user, values that may be used are: ID, tag or mention.
   * @returns A object containing if the fetch was valid and the user object if the fetch was valid, if it wasn't valid then the user object will instead return `null` */
  public async user(value: string): Promise<UserReturn> {
    const user = await this.client.users.fetch(value.replace(/[\\<>@!]/g, ""), {
      cache: false,
      force: true,
    });

    if (!(user instanceof User)) {
      return {
        valid_fetch: false,
        user: null,
      };
    }

    return {
      valid_fetch: true,
      user: user,
    };
  }

  /**
   * A property which helps searching for a channel with the provided value.
   * @param value - The value which will be used to search for a channel, values that may be used are: Mention, Name, ID.
   * @returns A object containing if the fetch was valid and the channel object and the channel type if the fetch was valid, if it wasn't valid then the channel object and the channel type will instead return `null` */
  public async channel(value: string): Promise<ChannelReturn> {
    const channel = await this.client.channels.fetch(
      value.replace(/[\\<>#]/g, ""),
      {
        cache: false,
        force: true,
      },
    );

    if (channel === undefined || channel === null) {
      return {
        valid_fetch: false,
        channel: null,
        channel_type: null,
      };
    }

    return {
      valid_fetch: true,
      channel: channel as TextBasedChannels,
      channel_type: channel.type as ChannelTypes,
    };
  }

  /**
   * A property which helps searching for a guild with the provided value.
   * @param value - The value which will be used to search for a guild, values that may be used are: Name, ID.
   * @returns A object containing if the fetch was valid and the guild object if the fetch was valid, if it wasn't valid then the guild object will instead return `null` */
  public async guild(value: GuildResolvable): Promise<GuildReturn> {
    const guild = await this.client.guilds.resolve(value);

    if (guild === undefined || guild === null) {
      return {
        valid_fetch: false,
        guild: null
      };
    }

    return {
      valid_fetch: true,
      guild: guild
    };
  }
}
