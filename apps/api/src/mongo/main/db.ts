import { config } from "../../config.js"
import { client } from "./client.js"

/** Main database. */
export const db = client.db(config().mongoMainDbName)
