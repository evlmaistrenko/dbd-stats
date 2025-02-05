import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import _ from "lodash"
import { MatchKeysAndValues, ObjectId, WithId } from "mongodb"

import * as mongo from "../../mongo/index.js"
import { types } from "../../types/index.js"

/**
 * Retrieves account details for a specified user.
 *
 * @returns Account details.
 */
export const user: (
	__: unknown,
	args: types.QueryUserArgs,
) => Promise<types.Query["user"]> = (__, { userId }) =>
	mongo.main.users
		.aggregate<
			WithId<mongo.main.UserDocument> & {
				steam: WithId<mongo.main.SteamAccountDocument>[]
			}
		>([
			{ $match: { _id: new ObjectId(userId) } },
			{
				$lookup: {
					from: mongo.main.steamAccounts.collectionName,
					localField: "_id",
					foreignField: "userId",
					as: "steam",
				},
			},
		])
		.toArray()
		.then(([user]) => {
			if (!user) {
				throw new GraphQLError(`Could not find user with id: ${userId}`, {
					extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
				})
			}
			return user
		})
		.then(async (user) => {
			const roles = _.intersection<types.Roles>(
				Object.values(types.Roles),
				user.roles as any,
			)
			const { permissions } = await import("../../schema/index.js")
			return {
				...user,
				id: user._id.toString(),
				permissions: [
					..._.intersection<types.Permissions>(
						Object.values(types.Permissions),
						user.permissions as any,
					),
					...roles.map((role) => permissions[role]).flat(),
				],
				roles,
				steam: user.steam.map((account) => ({
					...account,
					id: account._id.toString(),
				})),
			}
		})

/**
 * Updates user settings such as theme preferences.
 *
 * @returns True if successful.
 */
export const updateUserSettings: (
	__: unknown,
	args: types.MutationUpdateUserSettingsArgs,
) => Promise<types.Mutation["updateUserSettings"]> = async (
	__,
	{ userId, theme },
) => {
	const $set: MatchKeysAndValues<mongo.main.UserDocument> = {
		updatedAt: new Date(),
	}
	if (theme) $set["settings.theme"] = theme
	await mongo.main.users.updateOne({ _id: new ObjectId(userId) }, { $set })
	return true
}
