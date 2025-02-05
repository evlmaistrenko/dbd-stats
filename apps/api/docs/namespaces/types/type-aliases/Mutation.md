[**@evlmaistrenko/dbd-stats-api**](../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../README.md) / [types](../README.md) / Mutation

# Type Alias: Mutation

> **Mutation**: `object`

## Type declaration

### \_\_typename?

> `optional` **\_\_typename**: `"Mutation"`

### declineJwt

> **declineJwt**: [`Scalars`](Scalars.md)\[`"Boolean"`\]\[`"output"`\]

Revokes one or more JWT sessions for a user. Requires `MANAGE_ACCOUNTS` permission or strict ownership.

### linkSteamAccount

> **linkSteamAccount**: [`Scalars`](Scalars.md)\[`"Boolean"`\]\[`"output"`\]

Links a Steam account to the specified user. Requires `MANAGE_ACCOUNTS` permission or strict ownership.

### refreshJwt

> **refreshJwt**: [`Jwt`](Jwt.md)

Refreshes an expired or active JWT session. Requires `MAYBE_EXPIRED` ownership validation.

### signJwtViaSteam

> **signJwtViaSteam**: [`Jwt`](Jwt.md)

Authenticates a user via Steam OpenID. If the user does not exist, a new account is created.

### unlinkSteamAccount

> **unlinkSteamAccount**: [`Scalars`](Scalars.md)\[`"Boolean"`\]\[`"output"`\]

Unlinks a Steam account from the specified user. Requires `MANAGE_ACCOUNTS` permission or strict ownership.

### updateSteamAccount

> **updateSteamAccount**: [`Scalars`](Scalars.md)\[`"Boolean"`\]\[`"output"`\]

Fetches the latest account data from the Steam API. Requires `MANAGE_ACCOUNTS` permission.

### updateSteamAccountSettings

> **updateSteamAccountSettings**: [`Scalars`](Scalars.md)\[`"Boolean"`\]\[`"output"`\]

Updates the settings of a linked Steam account. Requires `MANAGE_ACCOUNTS` permission or strict ownership.

### updateUserSettings

> **updateUserSettings**: [`Scalars`](Scalars.md)\[`"Boolean"`\]\[`"output"`\]

Updates user settings such as theme preferences. Requires `MANAGE_ACCOUNTS` permission or strict ownership.
