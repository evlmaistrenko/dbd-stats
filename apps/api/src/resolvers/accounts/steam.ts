import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import _ from "lodash"
import { MatchKeysAndValues, ObjectId, WithId } from "mongodb"

import * as mongo from "../../mongo/index.js"
import { steam } from "../../steam.js"
import { types } from "../../types/index.js"
import * as accountsUtilities from "./utilities.js"

/**
 * Authenticates a user via Steam OpenID. If the user does not exist, a new account is created.
 *
 * @returns Session information.
 */
export const signJwtViaSteam: (
	__: unknown,
	args: types.MutationSignJwtViaSteamArgs,
	context: types.Context,
) => any = async (__, { signedUrl, privacy }, { response }) => {
	const steamId = await getSteamId(signedUrl)
	const mongoSession = mongo.main.client.startSession()
	mongoSession.startTransaction()
	try {
		await mongo.main.steamAccounts.updateOne(
			{ steamId, userId: { $exists: false } },
			{
				$set: {
					userId: new ObjectId(),
					updatedAt: new Date(),
				},
			},
			{ session: mongoSession },
		)
		const account = (await mongo.main.steamAccounts.findOneAndUpdate(
			{ steamId },
			{
				$setOnInsert: {
					userId: new ObjectId(),
					settings: {
						privacy: privacy ?? types.SteamPrivacy.Private,
					},
					createdAt: new Date(),
				},
			},
			{ returnDocument: "after", upsert: true, session: mongoSession },
		)) as WithId<mongo.main.SteamAccountDocument>
		const user = (await mongo.main.users.findOneAndUpdate(
			{ _id: account.userId },
			{
				$setOnInsert: {
					roles: [],
					permissions: [],
					settings: { theme: types.Theme.Device },
					createdAt: new Date(),
				},
			},
			{ upsert: true, returnDocument: "after", session: mongoSession },
		)) as WithId<mongo.main.UserDocument>
		const tokenId = new ObjectId()
		await mongo.main.sessions.insertOne(
			{
				userId: user._id,
				tokenId,
				createdAt: new Date(),
			},
			{ session: mongoSession },
		)
		const [result, setCookies] = accountsUtilities.signJwt(
			user._id,
			tokenId,
			response,
		)
		await mongoSession.commitTransaction()
		setCookies()
		return result
	} catch (error) {
		await mongoSession.abortTransaction()
		throw error
	} finally {
		await mongoSession.endSession()
	}
}

/**
 * Links a Steam account to the specified user.
 *
 * @returns True if successful.
 */
export const linkSteamAccount: (
	__: unknown,
	args: types.MutationLinkSteamAccountArgs,
) => Promise<types.Mutation["linkSteamAccount"]> = async (
	__,
	{ userId, signedUrl, privacy },
) => {
	const steamId = await getSteamId(signedUrl)
	const mongoSession = mongo.main.client.startSession()
	mongoSession.startTransaction()
	try {
		const { upsertedId } = await mongo.main.steamAccounts.updateOne(
			{ steamId },
			{
				$set: {
					userId: new ObjectId(userId),
					settings: {
						privacy: privacy ?? types.SteamPrivacy.Private,
					},
					updatedAt: new Date(),
				},
				$setOnInsert: {
					createdAt: new Date(),
				},
			},
			{ upsert: true, session: mongoSession },
		)
		if (upsertedId) {
			await mongo.main.steamAccounts.updateOne(
				{ _id: upsertedId },
				{
					$unset: {
						updatedAt: true,
					},
				},
				{ session: mongoSession },
			)
		}
		await mongoSession.commitTransaction()
	} catch (error) {
		await mongoSession.abortTransaction()
		throw error
	} finally {
		await mongoSession.endSession()
	}
	return true
}

/**
 * Unlinks a Steam account to the specified user.
 *
 * @returns True if successful.
 */
export const unlinkSteamAccount: (
	__: unknown,
	args: types.MutationUnlinkSteamAccountArgs,
) => Promise<types.Mutation["unlinkSteamAccount"]> = async (
	__,
	{ userId, accountId },
) => {
	const { modifiedCount } = await mongo.main.steamAccounts.updateOne(
		{
			_id: new ObjectId(accountId),
			userId: new ObjectId(userId),
		},
		{ $unset: { userId: true }, $set: { updatedAt: new Date() } },
	)
	if (modifiedCount < 1)
		throw new GraphQLError("Could not find account to unlink", {
			extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
		})
	return true
}

/**
 * Updates the settings of a linked Steam account.
 *
 * @returns True if successful.
 */
export const updateSteamAccountSettings: (
	__: unknown,
	args: types.MutationUpdateSteamAccountSettingsArgs,
) => Promise<types.Mutation["updateSteamAccountSettings"]> = async (
	__,
	{ userId, accountId, privacy },
) => {
	const $set: MatchKeysAndValues<mongo.main.SteamAccountDocument> = {
		updatedAt: new Date(),
	}
	if (privacy) $set["settings.privacy"] = privacy
	const { modifiedCount } = await mongo.main.steamAccounts.updateOne(
		{ _id: new ObjectId(accountId), userId: new ObjectId(userId) },
		{ $set },
	)
	if (modifiedCount < 1)
		throw new GraphQLError("Nothing to update", {
			extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
		})
	return true
}

/**
 * Fetches the latest account data from the Steam API.
 *
 * @returns True if successful.
 */
export const updateSteamAccount: (
	__: unknown,
	args: types.MutationUpdateSteamAccountArgs,
) => Promise<types.Mutation["updateSteamAccount"]> = async (
	__,
	{ accountId },
) => {
	const account = await mongo.main.steamAccounts.findOne({
		_id: new ObjectId(accountId),
	})
	if (account) {
		const summaries = await steam.user.GetPlayerSummaries(account.steamId)
		await mongo.main.steamAccounts.updateOne(
			{
				_id: new ObjectId(accountId),
			},
			{
				$set: {
					nickname: summaries.response.players[0]?.personaname,
					updatedAt: new Date(),
				},
			},
		)
	}
	return true
}

/**
 * Checks signature by Steam OpenID.
 *
 * @param signedUrl Steam OpenID return url.
 * @returns 64-bit Steam ID
 */
async function getSteamId(signedUrl: string): Promise<string> {
	const url = new URL(signedUrl)
	const steamId = url.searchParams.get("openid.claimed_id")
	if (!steamId)
		throw new GraphQLError("Could not get steamId", {
			extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
		})
	return steamId
}
