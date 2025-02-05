import { ObjectId } from "mongodb"

import { LifecycleTimestamps } from "../timestamps.js"
import { db } from "./db.js"

/** JWT-session. */
export type SessionDocument = {
	/** Associated user's ID. */
	userId: ObjectId
	/** Current tokens pair ID. */
	tokenId: ObjectId
} & LifecycleTimestamps

/** Collection of JWT-sessions. */
export const sessions = db.collection<SessionDocument>("sessions")
