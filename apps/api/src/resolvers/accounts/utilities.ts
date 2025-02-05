import { CookieOptions } from "express"
import jsonWebToken from "jsonwebtoken"
import { ObjectId } from "mongodb"

import { config } from "../../config.js"
import { types } from "../../types/index.js"

/**
 * Signs JWT-tokens pair.
 *
 * @param userId Associated user's ID.
 * @param tokenId New ID of tokens pair.
 * @param response Server response. Using it to set cookies.
 * @returns Tokens pair and function that sets cookies.
 */
export function signJwt(
	userId: ObjectId,
	tokenId: ObjectId,
	response?: types.Context["response"],
): [jwtSession: types.Jwt, setCookies: () => void] {
	const result: types.Jwt = {
		userId: userId.toString(),
		accessToken: jsonWebToken.sign(
			{ userId: userId.toString(), tokenId: tokenId.toString() },
			config().jwtSecret,
			{
				expiresIn: Math.round(config().jwtAccessTokenTtl / 1000),
			},
		),
		refreshToken: jsonWebToken.sign(
			{ tokenId: tokenId.toString() },
			config().jwtSecret,
			{
				expiresIn: Math.round(config().jwtRefreshTokenTtl / 1000),
			},
		),
	}
	return [
		result,
		() => {
			const cookieConfig: CookieOptions = {
				maxAge: config().jwtRefreshTokenTtl,
				httpOnly: true,
				secure: config().jwtCookieSecure,
			}
			response?.cookie(
				config().jwtAccessTokenName,
				result.accessToken,
				cookieConfig,
			)
			response?.cookie(
				config().jwtRefreshTokenName,
				result.refreshToken,
				cookieConfig,
			)
		},
	]
}
