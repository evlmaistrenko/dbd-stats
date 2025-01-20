import _ from "lodash"
import { ObjectId } from "mongodb"

import * as mongo from "../../mongo/index.js"
import * as types from "../../types.js"

const sortMap = {
	[types.UserStatsSort.TotalBloodpointsAsc]: { "stats.DBD_BloodwebPoints": 1 },
	[types.UserStatsSort.TotalBloodpointsDesc]: {
		"stats.DBD_BloodwebPoints": -1,
	},
}

/** @returns List of statistics */
export const stats: (
	source: unknown,
	args: types.QueryStatsArgs,
) => Promise<types.Query["stats"]> = async (_source, { userId, options }) =>
	mongo.main.stats
		.aggregate<{
			userId: ObjectId
			stats: {
				DBD_BloodwebPoints: number
			}
			user: [
				{
					_id: ObjectId
					steamProfile: { steamid: string; personaname: string }
				},
			]
			update: [mongo.main.StatsUpdateQueueDocument | null]
			updatedAt: Date
		}>([
			{
				$match: _.omitBy(
					{
						userId: userId ? new ObjectId(userId) : undefined,
					},
					(value) => _.isUndefined(value),
				),
			},
			{
				$lookup: {
					from: mongo.main.users.collectionName,
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $sort: { _id: -1 } },
			...(options?.sort?.map((value) => ({ $sort: sortMap[value] })) ?? []),
			{ $skip: options?.skip ?? 0 },
			{ $limit: options?.limit ?? 2 },
			{
				$lookup: {
					from: mongo.main.statsUpdateQueue.collectionName,
					let: { userId: "$userId" },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ["$payload.userId", "$$userId"],
								},
							},
						},
						{ $sort: { publishedAt: -1 } },
						{ $limit: 1 },
					],
					as: "update",
				},
			},
		])
		.toArray()
		.then((result) =>
			result.map(({ user: [user], stats, update: [update] }) => ({
				user: {
					id: user._id.toString(),
					steamProfile: {
						steamId: user.steamProfile.steamid,
						nickname: user.steamProfile.personaname,
					},
				},
				status: update?.consumedAt
					? types.UserStatsStatus.Actual
					: types.UserStatsStatus.Queued,
				bloodpoints: {
					total: stats.DBD_BloodwebPoints,
				},
			})),
		)
