import { config } from "../../config.js"
import { client } from "./client.js"

export const db = client.db(config().mongoMainDbName)
