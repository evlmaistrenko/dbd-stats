import * as assert from "node:assert"
import { after, before, describe, it } from "node:test"

import { ObjectId } from "mongodb"

import { config, graphql, mongo, subscribe, types } from "./module.js"

const clean = async () => {
	await mongo.main.db.dropDatabase()
	await mongo.main.client.close(true)
}

if (config.tests.access.skip) await clean()

describe("Access directives.", config.tests.access, () => {
	after(async () => {
		await clean()
	})

	describe("@access", () => {
		const userId = new ObjectId()
		const administratorId = new ObjectId()

		before(async () => {
			await mongo.main.users.insertMany([
				{
					_id: userId,
					settings: { theme: types.Theme.Light },
					permissions: [],
					roles: [],
					createdAt: new Date(),
				},
				{
					_id: administratorId,
					settings: { theme: types.Theme.Light },
					permissions: [],
					roles: [types.Roles.Administrator],
					createdAt: new Date(),
				},
			])
		})

		it("Allows to execute operations by ownership.", async () => {
			assert.strictEqual(
				(
					await graphql({
						source: /* GraphQL */ `
							query ($userId: ID!) {
								user(userId: $userId) {
									id
								}
							}
						`,
						variableValues: { userId: userId.toString() },
						contextValue: {
							jwt: {
								userId: userId.toString(),
								tokenId: new ObjectId(),
							},
						},
					})
				).data?.user.id,
				userId.toString(),
			)
		})

		it("Allows to execute operations by permissions.", async () => {
			assert.strictEqual(
				(
					await graphql({
						source: /* GraphQL */ `
							query ($userId: ID!) {
								user(userId: $userId) {
									id
								}
							}
						`,
						variableValues: { userId: userId.toString() },
						contextValue: {
							jwt: {
								userId: administratorId.toString(),
								tokenId: new ObjectId(),
							},
						},
					})
				).data?.user.id,
				userId.toString(),
			)
		})

		it("Denies to execute operations by ownership (if not an owner).", async () => {
			assert.strictEqual(
				(
					await graphql({
						source: /* GraphQL */ `
							query ($userId: ID!) {
								user(userId: $userId) {
									id
								}
							}
						`,
						variableValues: { userId: administratorId.toString() },
						contextValue: {
							jwt: {
								userId: userId.toString(),
								tokenId: new ObjectId(),
							},
						},
					})
				).errors?.[0].extensions.code,
				types.ErrorCode.AccessDenied,
			)
			for await (const { errors } of subscribe({
				source: /* GraphQL */ `
					query ($userId: ID!) {
						user(userId: $userId) {
							id
						}
					}
				`,
				variableValues: { userId: administratorId.toString() },
				contextValue: {
					jwt: {
						userId: userId.toString(),
						tokenId: new ObjectId(),
					},
				},
			})) {
				assert.strictEqual(
					errors?.[0].extensions.code,
					types.ErrorCode.AccessDenied,
				)
				break
			}
		})

		it("Denies to execute protected operations if not authenticated.", async () => {
			assert.strictEqual(
				(
					await graphql({
						source: /* GraphQL */ `
							query ($userId: ID!) {
								user(userId: $userId) {
									id
								}
							}
						`,
						variableValues: { userId: userId.toString() },
						contextValue: {},
					}).then((r) => {
						return r
					})
				).errors?.[0].extensions.code,
				types.ErrorCode.Unauthorized,
			)
			assert.strictEqual(
				(
					await graphql({
						source: /* GraphQL */ `
							query ($userId: ID!) {
								user(userId: $userId) {
									id
								}
							}
						`,
						variableValues: { userId: userId.toString() },
						contextValue: {
							jwt: {
								userId: administratorId.toString(),
								tokenId: new ObjectId(),
								expired: true,
							},
						},
					})
				).errors?.[0].extensions.code,
				types.ErrorCode.Unauthorized,
			)
		})
	})
})
