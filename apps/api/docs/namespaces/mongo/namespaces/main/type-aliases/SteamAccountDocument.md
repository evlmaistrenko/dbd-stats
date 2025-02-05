[**@evlmaistrenko/dbd-stats-api**](../../../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../../../README.md) / [mongo](../../../README.md) / [main](../README.md) / SteamAccountDocument

# Type Alias: SteamAccountDocument

> **SteamAccountDocument**: `Omit`\<[`SteamAccount`](../../../../types/type-aliases/SteamAccount.md), `"id"`\> & `object` & [`LifecycleTimestamps`](../../../type-aliases/LifecycleTimestamps.md)

Steam account.

## Type declaration

### steamId

> **steamId**: `string`

64-bit Steam ID.

### userId?

> `optional` **userId**: `ObjectId`

Associated user.
