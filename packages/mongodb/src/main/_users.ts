import { user } from "@evlmaistrenko/tools-steam-api-client"

import { LifecycleTimestamps } from "../timestamps.js"
import { db } from "./db.js"

export type UserDocument = {
	steamProfile: user.PlayerSummaries
} & LifecycleTimestamps

export const users = db.collection<UserDocument>("users")
