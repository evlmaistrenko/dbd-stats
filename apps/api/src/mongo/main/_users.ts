import { WithId } from "mongodb"

import { types } from "../../types/index.js"
import { LifecycleTimestamps } from "../timestamps.js"
import { db } from "./db.js"

/** API user. */
export type UserDocument = Omit<
	types.User,
	"id" | "steam" | "permissions" | "roles"
> & {
	/** Unique username (login). */
	name?: string
	/** List of granted permissions. */
	permissions: string[]
	/** List of assigned roles. */
	roles: string[]
} & LifecycleTimestamps

/** Collection of users. */
export const users = db.collection<UserDocument>("users")

await Promise.all([
	users.createIndex({ name: 1 }, { sparse: true, unique: true }),
])
