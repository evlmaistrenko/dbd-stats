import { MongoClient } from "mongodb"

import { config } from "../../config.js"

/** Main database client. */
export const client = new MongoClient(config().mongoMainUrl)
await client.connect()

process.on("SIGINT", async () => {
	await client.close()
	process.exit()
})
