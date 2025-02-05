import { ObjectId } from "mongodb"

import { types } from "../../types/index.js"
import { LifecycleTimestamps } from "../timestamps.js"
import { db } from "./db.js"

/** Steam account. */
export type SteamAccountDocument = Omit<types.SteamAccount, "id"> & {
	/** Associated user. */
	userId?: ObjectId
	/** 64-bit Steam ID. */
	steamId: string
} & LifecycleTimestamps

/** Collection of steam accounts. */
export const steamAccounts =
	db.collection<SteamAccountDocument>("steamAccounts")

await Promise.all([
	steamAccounts.createIndex({
		userId: 1,
	}),
	steamAccounts.createIndex({ steamId: 1 }, { unique: true }),
])
