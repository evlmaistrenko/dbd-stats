export type Config = {
	mainUrl: string
}

let value: Config = {
	mainUrl: process.env.MONGODB_URL ?? "",
}

/**
 * Returns current configuration modifying it if `next` parameter present
 *
 * @example
 * 	import { config } from "@evlmaistrenko/dbd-stats-mongodb/config"
 *
 * 	config({ mainUrl: "<your url>" })
 * 	const mongo = await import("@evlmaistrenko/dbd-stats-mongodb")
 *
 * 	// Use databases
 *
 * @param next Parameters to modify values
 * @returns Current value
 */
export function config(next?: Partial<Config>): Config {
	value = {
		...value,
		...next,
	}
	return value
}
