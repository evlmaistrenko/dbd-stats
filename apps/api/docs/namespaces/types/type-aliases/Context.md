[**@evlmaistrenko/dbd-stats-api**](../../../README.md)

---

[@evlmaistrenko/dbd-stats-api](../../../README.md) / [types](../README.md) / Context

# Type Alias: Context

> **Context**: `object`

GraphQL-context.

## Type declaration

### jwt?

> `optional` **jwt**: `object`

Decoded JWT access token.

#### jwt.expired?

> `optional` **expired**: `true`

If access token expired.

#### jwt.tokenId

> **tokenId**: `string`

Tokens pair ID.

#### jwt.userId

> **userId**: `string`

Associated user's ID.

### request?

> `optional` **request**: `http.IncomingMessage`

Client request.

### response?

> `optional` **response**: `Response`

Server response.
