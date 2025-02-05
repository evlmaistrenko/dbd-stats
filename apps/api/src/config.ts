import "dotenv/config"

/** Configuration of application. */
export type Config = {
	/** Port to listen. */
	port: number
	/** Main MongoDB connection URL. */
	mongoMainUrl: string
	/** Main MongoDB database name. */
	mongoMainDbName: string
	/** Steam API key. */
	steamApiClientKey: string
	/** JsonWebToken secret key. */
	jwtSecret: string
	/** Name of JWT access token (camelCased). */
	jwtAccessTokenName: string
	/** Name of JWT refresh token (camelCased). */
	jwtRefreshTokenName: string
	/** TTL of access token (ms). */
	jwtAccessTokenTtl: number
	/** TTL of refresh token (ms). */
	jwtRefreshTokenTtl: number
	/** `secure` parameter of JWT-cookies. */
	jwtCookieSecure: boolean
}

let value: Config = {
	port: parseInt(process.env.PORT ?? "4000"),
	mongoMainUrl: process.env.MONGODB_MAIN_URL ?? "",
	mongoMainDbName: process.env.MONGODB_MAIN_DB_NAME ?? "main",
	steamApiClientKey: process.env.STEAM_API_CLIENT_KEY ?? "",
	jwtSecret: process.env.JWT_SECRET ?? "",
	jwtAccessTokenName: "accessToken",
	jwtRefreshTokenName: "refreshToken",
	jwtAccessTokenTtl: 15 * 60 * 1000,
	jwtRefreshTokenTtl: 30 * 24 * 3600 * 1000,
	jwtCookieSecure: process.env.NODE_ENV === "production",
}

/**
 * Returns current configuration modifying it if `next` parameter present.
 *
 * @example
 * 	// Pre-configure:
 * 	import { config } from "@evlmaistrenko/dbd-stats-api/config"
 *
 * 	config({ mongoMainUrl: "<your url>" })
 * 	const api = await import("@evlmaistrenko/dbd-stats-api")
 *
 * 	// Use api...
 *
 * @param next Parameters to modify values.
 * @returns Current value.
 */
export function config(next?: Partial<Config>): Config {
	value = {
		...value,
		...next,
	}
	return value
}
