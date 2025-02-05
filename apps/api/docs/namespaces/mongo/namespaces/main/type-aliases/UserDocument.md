[**@evlmaistrenko/dbd-stats-api**](../../../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../../../README.md) / [mongo](../../../README.md) / [main](../README.md) / UserDocument

# Type Alias: UserDocument

> **UserDocument**: `Omit`\<[`User`](../../../../types/type-aliases/User.md), `"id"` \| `"steam"` \| `"permissions"` \| `"roles"`\> & `object` & [`LifecycleTimestamps`](../../../type-aliases/LifecycleTimestamps.md)

API user.

## Type declaration

### name?

> `optional` **name**: `string`

Unique username (login).

### permissions

> **permissions**: `string`[]

List of granted permissions.

### roles

> **roles**: `string`[]

List of assigned roles.
