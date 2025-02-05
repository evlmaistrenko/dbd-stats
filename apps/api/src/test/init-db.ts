// import { SteamApiClient } from "@evlmaistrenko/tools-steam-api-client"
// import { ObjectId } from "mongodb"

// import { config } from "../config.js"

// export async function initDb(testName: string) {
// 	const { steamApiClientKey } = config({
// 		mongoMainDbName: `apiTest_${+new Date()}_${testName}`,
// 	})
// 	const mongo = await import("../mongo/index.js")
// 	const steamClient = new SteamApiClient(steamApiClientKey)
// 	const _id = new ObjectId()
// 	await Promise.all([
// 		steamClient.user.GetPlayerSummaries(
// 			process.env.STEAM_API_CLIENT_STEAMID ?? "",
// 		),
// 		steamClient.deadByDaylight.getUserStats(
// 			process.env.STEAM_API_CLIENT_STEAMID ?? "",
// 		),
// 	]).then(
// 		([
// 			{
// 				response: {
// 					players: [steamProfile],
// 				},
// 			},
// 			stats,
// 		]) =>
// 			Promise.all([
// 				mongo.main.users.insertOne({
// 					_id,
// 					steamProfile,
// 					createdAt: new Date(),
// 				}),
// 				mongo.main.stats.insertOne({
// 					userId: _id,
// 					...stats,
// 					createdAt: new Date(),
// 				}),
// 			]),
// 	)

// 	return mongo
// }
