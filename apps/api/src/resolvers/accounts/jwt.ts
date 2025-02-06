import * as assert from "node:assert"

import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import jsonWebToken from "jsonwebtoken"
import _ from "lodash"
import { Filter, ObjectId } from "mongodb"

import { config } from "../../config.js"
import { mongo } from "../../mongo/index.js"
import { types } from "../../types/index.js"
import * as utilities from "../../utilities/index.js"
import * as accountsUtilities from "./utilities.js"

/**
 * Refreshes an expired or active JWT session.
 *
 * @returns True if successful
 */
export const refreshJwt: (
	__: unknown,
	args: types.MutationRefreshJwtArgs,
	context: types.Context,
) => Promise<types.Mutation["refreshJwt"]> = async (
	__,
	___,
	{ jwt, response, request },
) => {
	try {
		const refreshToken = jsonWebToken.verify(
			utilities.getToken(config().jwtRefreshTokenName, request) ?? "",
			config().jwtSecret,
		) as { tokenId: string }
		assert.strictEqual(jwt?.tokenId, refreshToken.tokenId + "")
	} catch {
		throw new GraphQLError("Invalid tokens pair.", {
			extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
		})
	}
	const tokenId = new ObjectId()
	const { modifiedCount } = await mongo.main.sessions.updateOne(
		{
			userId: new ObjectId(jwt.userId),
			tokenId: new ObjectId(jwt.tokenId),
		},
		{ $set: { tokenId, updatedAt: new Date() } },
	)
	if (modifiedCount < 1) {
		throw new GraphQLError("Session not found.", {
			extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
		})
	}
	const [result, setCookies] = accountsUtilities.signJwt(
		new ObjectId(jwt.userId),
		tokenId,
		response,
	)
	setCookies()
	return result
}

/**
 * Revokes one or more JWT sessions for a user.
 *
 * @returns True if successful
 */
export const declineJwt: (
	__: unknown,
	args: types.MutationDeclineJwtArgs,
	context: types.Context,
) => Promise<types.Mutation["declineJwt"]> = async (
	__,
	{ userId, sessions },
	{ response, jwt },
) => {
	let filter: Filter<mongo.main.SessionDocument> = {}
	let clearCookies: () => void = () => {}

	if (sessions) {
		filter = {
			_id: { $in: sessions.map((sessionId) => new ObjectId(sessionId)) },
			userId: new ObjectId(userId),
		}
	} else if (jwt?.userId === userId) {
		filter = {
			userId: new ObjectId(jwt.userId),
			tokenId: new ObjectId(jwt.tokenId),
		}
		clearCookies = () => {
			response?.clearCookie(config().jwtAccessTokenName)
			response?.clearCookie(config().jwtRefreshTokenName)
		}
	} else {
		filter = { userId: new ObjectId(userId) }
	}

	const { modifiedCount } = await mongo.main.sessions.updateMany(filter, {
		$set: { deletedAt: new Date() },
	})

	if (modifiedCount < 1) {
		throw new GraphQLError("Nothing to decline.", {
			extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
		})
	}

	clearCookies()

	return true
}
