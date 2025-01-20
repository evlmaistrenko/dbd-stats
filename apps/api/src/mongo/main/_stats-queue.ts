import { MessageDocument } from "@evlmaistrenko/tools-mongomq"
import { ObjectId } from "mongodb"

import { db } from "./db.js"

export type StatsUpdateQueueDocument = MessageDocument<{ userId: ObjectId }>

export const statsUpdateQueue =
	db.collection<StatsUpdateQueueDocument>("stats_updateQueue")

await Promise.all([statsUpdateQueue.createIndex({ "payload.userId": 1 })])
