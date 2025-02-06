import * as assert from "node:assert"
import { after, before, describe, it } from "node:test"

import _ from "lodash"
import { ObjectId } from "mongodb"

import { config, graphql, mongo, subscribe, types } from "../module.js"

const clean = async () => {
	await mongo.main.db.dropDatabase()
	await mongo.main.client.close(true)
}

if (config.tests.accounts.users.skip) await clean()

describe("Operations: accounts (users).", config.tests.accounts.users, () => {
	after(async () => {
		await clean()
	})

	describe("Query", () => {
		describe("user", () => {
			const userId = new ObjectId()

			before(async () => {
				await mongo.main.users.insertOne({
					_id: userId,
					settings: { theme: types.Theme.Light },
					permissions: [],
					roles: [],
					createdAt: new Date(),
				})
			})

			it("Retrieves account details for a specified user.", async () => {
				const permissions = [
					{ $set: { permissions: [], roles: [] }, expected: [] },
					{
						$set: { permissions: [types.Permissions.ReadAccounts], roles: [] },
						expected: [types.Permissions.ReadAccounts],
					},
					{
						$set: {
							permissions: [types.Permissions.ReadAccounts],
							roles: [types.Roles.DummyReader],
						},
						expected: [types.Permissions.ReadAccounts],
					},
					{
						$set: {
							permissions: [],
							roles: [types.Roles.DummyReader],
						},
						expected: [types.Permissions.ReadAccounts],
					},
					{
						$set: {
							permissions: [types.Permissions.ReadAccounts],
							roles: [types.Roles.DummyManager],
						},
						expected: [
							types.Permissions.ReadAccounts,
							types.Permissions.ManageAccounts,
						],
					},
					{
						$set: {
							permissions: [],
							roles: [types.Roles.Superuser],
						},
						expected: Object.values(types.Permissions),
					},
				]
				for (const { $set, expected } of permissions) {
					await mongo.main.users.updateOne({ _id: userId }, { $set })
					const { data } = await graphql({
						source: /* GraphQL */ `
							query ($userId: ID!) {
								user(userId: $userId) {
									id
									permissions
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
					assert.strictEqual(data?.user.id, userId.toString())
					assert.strictEqual(
						_.intersection(data?.user.permissions, expected).length,
						expected.length,
					)
				}
			})
		})
	})

	describe("Subscription", () => {
		describe("user", () => {
			const userId = new ObjectId()

			before(async () => {
				await mongo.main.users.insertOne({
					_id: userId,
					settings: { theme: types.Theme.Light },
					permissions: [],
					roles: [],
					createdAt: new Date(),
				})
			})

			it("Yields account details for a specified user.", async () => {
				let expected: string = types.Theme.Light
				for await (const { data } of subscribe({
					source: /* GraphQL */ `
						query ($userId: ID!) {
							user(userId: $userId) {
								id
								settings {
									theme
								}
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
				})) {
					assert.strictEqual(data?.user.settings.theme, expected)
					if (expected === types.Theme.Dark) break
					await mongo.main.users.updateOne(
						{ _id: userId },
						{ $set: { "settings.theme": types.Theme.Dark } },
					)
					expected = types.Theme.Dark
				}
			})
		})
	})

	describe("Mutation", () => {
		describe("updateUserSettings", () => {
			const userId = new ObjectId()

			before(async () => {
				await mongo.main.users.insertOne({
					_id: userId,
					settings: { theme: types.Theme.Light },
					permissions: [],
					roles: [],
					createdAt: new Date(),
				})
			})

			it("Updates user settings such as theme preferences.", async () => {
				await graphql({
					source: /* GraphQL */ `
						mutation ($userId: ID!, $theme: Theme) {
							updateUserSettings(userId: $userId, theme: $theme)
						}
					`,
					variableValues: {
						userId: userId.toString(),
						theme: types.Theme.Dark,
					},
					contextValue: {
						jwt: {
							userId: userId.toString(),
							tokenId: new ObjectId(),
						},
					},
				})
				assert.strictEqual(
					(await mongo.main.users.findOne({ _id: userId }))?.settings.theme,
					types.Theme.Dark,
				)
			})
		})
	})
})
