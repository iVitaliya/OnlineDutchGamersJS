import {
	AuditLogEvent,
	type Guild,
	type GuildAuditLogsActionType,
	type GuildAuditLogsEntry,
	type GuildAuditLogsTargetType,
	PermissionFlagsBits,
} from "discord.js";
import { Database, guildMe, KeyofType, MAIN_OWNER } from "../lib/index";

const limits = {
	ownerID: MAIN_OWNER.id,
	_limits: "The following are defaults.",
	adminCanChangeLimits: true,
	limits: {
		user_removals: {
			per_minute: 8,
			per_hour: 24,
		},
		role_creations: {
			per_minute: 4,
			per_hour: 12,
		},
		channel_creations: {
			per_minute: 4,
			per_hour: 12,
		},
		role_deletions: {
			per_minute: 4,
			per_hour: 12,
		},
		channel_deletions: {
			per_minute: 4,
			per_hour: 12,
		},
		unbans: {
			per_minute: 8,
			per_hour: 24,
		},
	},
	_config: "The following are defaults.",
	config: {
		_null: "No options to configure currently.",
	},
};

export class GuildGuardian {
	private guild: Guild;

	public constructor(guild: Guild) {
		this.guild = guild;
	}

	async get(key: string, fallback?: any) {
		return await Database.logging.get(`guardian.${key}`, fallback);
	}

	async set(key: string, data: any) {
		return await Database.logging.set(`guardian.${key}`, data);
	}

	async delete(key: string) {
		return await Database.logging.delete(`guardian.${key}`);
	}

	get limits() {
		var obj = {};
		let limit = limits["limits"];

		for (let key in Object(limit)) {
      let l = limit[key as KeyofType<typeof limit>];

      // @ts-ignore
			obj[key] = {
				minute: this.get(
					`limits.${k}.minute`,
					l.per_minute
				),
				hour: this.get(`limits.${k}.hour`, l.per_hour)
			};
		}
		return obj;
}

	async find(
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
		const me = await guildMe(this.guild);
		const guild = this.guild;

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

	async push(
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
		let entries = this.get(action, []) as any;

		// Filter entries older than one hour to a new variable
		let olderThanOneHour = entries.filter((x: { timestamp: number }) =>
			!(x.timestamp > oneHourAgo)
		);

		// Prepend entries older than one hour to the archive
		if (olderThanOneHour.length > 0) {
			this.set(`archive.${action}`, [
				...olderThanOneHour,
				...(await this.get(`archive.${action}`, [] as any[])) as any,
			]);
		}

		// Filter entries older than one hour from old variable
		entries = entries.filter((x: { timestamp: number }) =>
			x.timestamp > oneHourAgo
		);

		// Prepend new entry if not already found
		if (
			!entries.find(
				(x: { target: { id: any }; executor: { id: string } }) =>
					x.target.id === entry!.targetId &&
					x.executor.id === entry!.executorId,
			)
		) {
			entries.unshift({
				timestamp: entry.createdTimestamp,
				action: entry.action,
				target: {
					id: entry!.targetId,
					displayName,
					targetType: entry.targetType,
				},
				executor: {
					id: entry!.executorId,
					displayName: entry!.executor!.displayName,
				},
			});
		}

		// Update entries newer than one hour.
		return this.set(action, entries);
	}

	async check_limits(entries: any, executorID: string, configAction: KeyofType<typeof limits["limits"]>) {
		// Ignore if exxecutor is the owner.
		if (executorID === MAIN_OWNER.id) return;

		// Filter actions relating to executor.
		const oneMinuteAgo = Date.now() - 1000 * 60;
		let executorActionsHour = entries.filter(
			(i: any) => i.executor.id === executorID
		);
			let executorActionsMinute = executorActionsHour.filter(
				i => i.timestamp > oneMinuteAgo
		);
		console.log(
			`${configAction}/${executorID}: LAST_HOUR: ${executorActionsHour.length} LAST_MINUTE: ${executorActionsMinute.length}`
		);

			let limit = this.limits;
			let limitReached = null;
			if (executorActionsHour.length >= limit[configAction].hour) 
	}
}
