[**@evlmaistrenko/dbd-stats-api**](../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../README.md) / [types](../README.md) / Jwt

# Type Alias: Jwt

> **Jwt**: `object`

Represents a JWT (JSON Web Token) for authentication and session management.

## Type declaration

### \_\_typename?

> `optional` **\_\_typename**: `"Jwt"`

### accessToken

> **accessToken**: [`Scalars`](Scalars.md)\[`"String"`\]\[`"output"`\]

Token used to access protected resources.

### refreshToken

> **refreshToken**: [`Scalars`](Scalars.md)\[`"String"`\]\[`"output"`\]

Token used to refresh the JWT session when it expires.

### userId

> **userId**: [`Scalars`](Scalars.md)\[`"ID"`\]\[`"output"`\]

ID of the user associated with this token.
