import { deadByDaylight } from "@evlmaistrenko/tools-steam-api-client"
import { ObjectId } from "mongodb"

import { LifecycleTimestamps } from "../timestamps.js"
import { db } from "./db.js"

export type StatsDocument = {
	userId: ObjectId
} & deadByDaylight.UserStatsAndAchievements &
	LifecycleTimestamps

export const stats = db.collection<StatsDocument>("stats")
