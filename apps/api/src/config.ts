import "dotenv/config"

export type Config = {
	port: number
	mongoMainUrl: string
	mongoMainDbName: string
	steamApiClientKey: string
}

let value: Config = {
	port: parseInt(process.env.PORT ?? "4000"),
	mongoMainUrl: process.env.MONGODB_MAIN_URL ?? "",
	mongoMainDbName: process.env.MONGODB_MAIN_DB_NAME ?? "main",
	steamApiClientKey: process.env.STEAM_API_CLIENT_KEY ?? "",
}

/**
 * Returns current configuration modifying it if `next` parameter present
 *
 * @example
 * 	// Pre-configure:
 * 	import { config } from "@evlmaistrenko/dbd-stats-api/config"
 *
 * 	config({ mongoMainUrl: "<your url>" })
 * 	const api = await import("@evlmaistrenko/dbd-stats-api")
 *
 * 	// Use api
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
