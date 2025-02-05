// import "dotenv/config"

// import * as assert from "node:assert"
// import { after, before, describe, it } from "node:test"

// import { initDb } from "./init-db.js"

// let graphql: typeof import("../index.js").graphql
// let mongo: typeof import("../index.js").mongo

// describe("#stats", () => {
// 	before(async () => {
// 		mongo = await initDb("stats")
// 		graphql = (await import("../index.js")).graphql
// 	})

// 	after(async () => {
// 		await mongo.main.db.dropDatabase()
// 		await mongo.main.client.close(true)
// 	})

// 	it("Returns stats continuously", async () => {
// 		let {
// 			userId,
// 			stats: { DBD_BloodwebPoints: expected },
// 		} = (await mongo.main.stats.findOne({}))!

// 		for await (const result of graphql(
// 			{
// 				source: /* GraphQL */ `
// 					subscription {
// 						stats(userId: "${userId}") {
// 							bloodpoints {
// 								total
// 							}
// 						}
// 					}
// 				`,
// 			},
// 			true,
// 		)) {
// 			assert.strictEqual(result.data?.stats?.[0]?.bloodpoints?.total, expected)
// 			if (expected === 1) break
// 			expected = 1
// 			await mongo.main.stats.updateOne(
// 				{ userId },
// 				{ $set: { "stats.DBD_BloodwebPoints": expected } },
// 			)
// 		}
// 	})
// })
