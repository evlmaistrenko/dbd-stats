import "dotenv/config"

import * as assert from "node:assert"
import { after, before, describe, it } from "node:test"

import { initDb } from "./init-db.js"

let graphql: typeof import("../index.js").graphql
let mongo: typeof import("../index.js").mongo

describe("#user", () => {
	before(async () => {
		mongo = await initDb("user")
		graphql = (await import("../index.js")).graphql
	})

	after(async () => {
		await mongo.main.db.dropDatabase()
		await mongo.main.client.close(true)
	})

	it("Returns profile", async () => {
		const {
			_id: userId,
			steamProfile: { personaname },
		} = (await mongo.main.users.findOne({}))!
		const { data } = await graphql({
			source: /* GraphQL */ `
				{
					user(id: "${userId}") {
						steamProfile {
							nickname
						}
					}
				}
			`,
		})
		assert.strictEqual(data?.user?.steamProfile.nickname, personaname)
	})
})
