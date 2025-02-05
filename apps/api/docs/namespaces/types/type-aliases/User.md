[**@evlmaistrenko/dbd-stats-api**](../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../README.md) / [types](../README.md) / User

# Type Alias: User

> **User**: `object`

## Type declaration

### \_\_typename?

> `optional` **\_\_typename**: `"User"`

### id

> **id**: [`Scalars`](Scalars.md)\[`"ID"`\]\[`"output"`\]

Unique identifier.

### permissions

> **permissions**: [`Maybe`](Maybe.md)\<[`Permissions`](../enumerations/Permissions.md)\>[]

List of granted permissions.

### roles

> **roles**: [`Maybe`](Maybe.md)\<[`Roles`](../enumerations/Roles.md)\>[]

List of assigned roles.

### settings

> **settings**: [`UserSettings`](UserSettings.md)

User settings.

### steam

> **steam**: [`Maybe`](Maybe.md)\<[`SteamAccount`](SteamAccount.md)\>[]

Linked Steam accounts.
