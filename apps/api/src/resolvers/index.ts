import _ from "lodash"

import * as mongo from "../mongo/index.js"
import * as accounts from "./accounts/index.js"

type SlicedParameters<F> = F extends (arg0: any, ...rest: infer R) => any
	? R
	: never

/** To use with `graphql` function. */
export const rootValue = {
	user: accounts.user.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.user>
	) => ReturnType<typeof accounts.user>,
	updateUserSettings: accounts.updateUserSettings.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.updateUserSettings>
	) => ReturnType<typeof accounts.updateUserSettings>,

	refreshJwt: accounts.refreshJwt.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.refreshJwt>
	) => ReturnType<typeof accounts.refreshJwt>,
	declineJwt: accounts.declineJwt.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.declineJwt>
	) => ReturnType<typeof accounts.declineJwt>,

	signJwtViaSteam: accounts.signJwtViaSteam.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.signJwtViaSteam>
	) => ReturnType<typeof accounts.signJwtViaSteam>,
	linkSteamAccount: accounts.linkSteamAccount.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.linkSteamAccount>
	) => ReturnType<typeof accounts.linkSteamAccount>,
	updateSteamAccount: accounts.updateSteamAccount.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof accounts.updateSteamAccount>
	) => ReturnType<typeof accounts.updateSteamAccount>,
	updateSteamAccountSettings: accounts.updateSteamAccountSettings.bind(this, [
		undefined,
	]) as (
		...args: SlicedParameters<typeof accounts.updateSteamAccountSettings>
	) => ReturnType<typeof accounts.updateSteamAccountSettings>,
}

/** To use with Apollo server. */
export const resolvers = {
	Query: { user: accounts.user },
	Subscription: {
		user: {
			subscribe: (...args: Parameters<typeof accounts.user>) =>
				mongo.subscribe(async () => ({
					user: await accounts.user(...args),
				})),
		},
	},
	Mutation: {
		refreshJwt: accounts.refreshJwt,
		declineJwt: accounts.declineJwt,

		updateUserSettings: accounts.updateUserSettings,

		signJwtViaSteam: accounts.signJwtViaSteam,
		linkSteamAccount: accounts.linkSteamAccount,
		unlinkSteamAccount: accounts.unlinkSteamAccount,
		updateSteamAccount: accounts.updateSteamAccount,
		updateSteamAccountSettings: accounts.updateSteamAccountSettings,
	},
}
