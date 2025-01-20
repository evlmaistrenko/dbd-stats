import { MongoClient } from "mongodb"

import { config } from "../../config.js"

export const client = new MongoClient(config().mongoMainUrl)
await client.connect()

process.on("SIGINT", async () => {
	await client.close()
	process.exit()
})
