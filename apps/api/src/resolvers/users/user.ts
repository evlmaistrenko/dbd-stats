import { ObjectId } from "mongodb"

import * as mongo from "../../mongo/index.js"
import * as types from "../../types.js"

/** @returns User object */
export const user: (
	source: unknown,
	args: types.QueryUserArgs,
) => Promise<types.Query["user"]> = async (_source, { id }) =>
	mongo.main.users
		.findOne(
			{ _id: new ObjectId(id) },
			{
				projection: {
					"_id": 1,
					"steamProfile.steamid": 1,
					"steamProfile.personaname": 1,
				},
			},
		)
		.then((user) =>
			user
				? {
						id: user._id.toString(),
						steamProfile: {
							steamId: user.steamProfile.steamid,
							nickname: user.steamProfile.personaname,
						},
					}
				: user,
		)
