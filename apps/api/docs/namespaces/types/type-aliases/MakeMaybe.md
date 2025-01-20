[**@evlmaistrenko/dbd-stats-api**](../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../README.md) / [types](../README.md) / MakeMaybe

# Type Alias: MakeMaybe\<T, K\>

> **MakeMaybe**\<`T`, `K`\>: `Omit`\<`T`, `K`\> & `{ [SubKey in K]: Maybe<T[SubKey]> }`

## Type Parameters

• **T**

• **K** _extends_ keyof `T`
