import { BucketScope, LogLevel, SapphireClient } from "@sapphire/framework";
import {
  Collection,
  GatewayIntentBits,
  GuildBan,
  GuildEmoji,
  GuildMember,
  LifetimeSweepOptions,
  MessageReaction,
  Partials,
  Presence,
  StageInstance,
  Sticker,
  SweepOptions,
  ThreadMember,
  User,
  VoiceState,
} from "discord.js";
import {
  ClientResolver,
  Database,
  Environment,
  logger,
  LogLevels,
  MAIN_OWNER,
} from "./lib/index";
import "./lib/setup";

function Sweeper() {
  return {
    message: { lifetime: 3000, interval: 10300 } as LifetimeSweepOptions,
    invite: { lifetime: 1000, interval: 10500 } as LifetimeSweepOptions,
    ban: {
      interval: 8000,
      filter: (
        b: GuildBan,
        _key: string,
        _collection: Collection<string, GuildBan>,
      ) => !b.user.bot,
    } as unknown as SweepOptions<string, GuildBan>,
    reaction: { interval: 3000 } as SweepOptions<string, MessageReaction>,
    guildMember: {
      interval: 3500,
      filter: (
        m: GuildMember,
        _key: string,
        _collection: Collection<string, GuildMember>,
      ) => !m.user.bot,
    } as unknown as SweepOptions<string, GuildMember>,
    user: {
      interval: 5000,
      filter: (u: User, _key: string, _collection: Collection<string, User>) =>
        !u.bot,
    } as unknown as SweepOptions<string, User>,
    voiceState: { interval: 1500 } as SweepOptions<string, VoiceState>,
    presence: { interval: 1000 } as SweepOptions<string, Presence>,
    threadMember: { interval: 10000 } as SweepOptions<string, ThreadMember>,
    thread: { lifetime: 1000, interval: 1500 } as LifetimeSweepOptions,
    stageInstance: { interval: 1300 } as SweepOptions<string, StageInstance>,
    emoji: { interval: 1200 } as SweepOptions<string, GuildEmoji>,
    sticker: { interval: 950 } as SweepOptions<string, Sticker>,
  };
}

export const client = new SapphireClient({
  defaultPrefix: "odg!",
  regexPrefix: /^(hey +)?odg[,! ]/i,
  defaultCooldown: {
    scope: BucketScope.User,
    delay: 3 * 1000,
    limit: 3,
  },
  logger: {
    level: LogLevel.Debug,
  },
  shards: "auto",
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
  ],
  sweepers: {
    messages: Sweeper().message,
    invites: Sweeper().invite,
    bans: Sweeper().ban,
    reactions: Sweeper().reaction,
    guildMembers: Sweeper().guildMember,
    users: Sweeper().user,
    voiceStates: Sweeper().voiceState,
    presences: Sweeper().presence,
    threadMembers: Sweeper().threadMember,
    threads: Sweeper().thread,
    stageInstances: Sweeper().stageInstance,
    emojis: Sweeper().emoji,
    stickers: Sweeper().sticker,
  },
});

export const OWNER = async () =>
  (await (new ClientResolver(client).user(MAIN_OWNER.id))).user!;

(async () => {
  try {
    client.logger.info("Logging in");

    await client.login(Environment.get("TOKEN"));
    await connectDBs(client);

    client.logger.info(
      "Logged into Discord and connected all databases, serving Online Dutch Gamers ;)",
    );
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
})();

async function connectDBs(client: SapphireClient) {
  try {
    const Logger = logger({ name: "DATABASE" });
    const {
      economy,
      profiles,
      punishments,
      leveling,
      logging,
      game,
      tickets,
      verify,
    } = Database;

    await economy.connect();
    Logger.log(
      LogLevels.Debug,
      "The economy Database has connected successfully",
    );
    await game.connect();
    Logger.log(LogLevels.Debug, "The game Database has connected successfully");
    await leveling.connect();
    Logger.log(
      LogLevels.Debug,
      "The leveling Database has connected successfully",
    );
    await logging.connect();
    Logger.log(
      LogLevels.Debug,
      "The logging Database has connected successfully",
    );
    await profiles.connect();
    Logger.log(
      LogLevels.Debug,
      "The profiles Database has connected successfully",
    );
    await punishments.connect();
    Logger.log(
      LogLevels.Debug,
      "The punishments Database has connected successfully",
    );
    await tickets.connect();
    Logger.log(
      LogLevels.Debug,
      "The tickets Database has connected successfully",
    );
    await verify.connect();
    Logger.log(
      LogLevels.Debug,
      "The verify Database has connected successfully",
    );
  } catch (err) {
    client.logger.error(err);
  }
}
