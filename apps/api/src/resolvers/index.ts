import _ from "lodash"

import * as mongo from "../mongo/index.js"
import * as accounts from "./accounts/index.js"

/** Resolvers. */
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
