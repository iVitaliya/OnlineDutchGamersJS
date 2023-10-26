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
    OWNER
} from "../../lib/index";

export class GuildMemberRemove extends Listener {
    public constructor(context: PieceContext, options?: ListenerOptions) {
        super(context, {
            event: Events.GuildMemberRemove,
            ...options
        });
    }

    public async run(member: GuildMember) {
        const { guild, id } = member;
        const cache = new CacheResolver(guild);

        const data = await dataInObject("leveling", "leveling", ìd);
        if (!data) {
            
        }
    }
}