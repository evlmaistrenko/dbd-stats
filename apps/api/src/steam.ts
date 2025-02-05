import { SteamApiClient } from "@evlmaistrenko/tools-steam-api-client"

import { config } from "./config.js"

/** Steam-API client. */
export const steam = new SteamApiClient(config().steamApiClientKey)
