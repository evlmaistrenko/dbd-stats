import { subscribe } from "../mongo/subscribe.js"
import * as types from "../types.js"
import * as query from "./query.js"

export const stats: (
	source: unknown,
	args: types.SubscriptionStatsArgs,
) => AsyncGenerator<{ stats: types.Subscription["stats"] }> = (...args) =>
	subscribe(async () => ({
		stats: await query.stats(...args),
	}))
