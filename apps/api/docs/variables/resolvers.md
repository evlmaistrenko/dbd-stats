[**@evlmaistrenko/dbd-stats-api**](../README.md)

---

[@evlmaistrenko/dbd-stats-api](../README.md) / resolvers

# Variable: resolvers

> `const` **resolvers**: `object`

To use with Apollo server

## Type declaration

### Query

> **Query**: `__module` = `query`

### Subscription

> **Subscription**: `object`

#### Subscription.stats

> **stats**: `object`

#### Subscription.stats.subscribe()

> **subscribe**: (`source`, `args`) => `AsyncGenerator`\<\{ `stats`: `undefined` \| [`Maybe`](../namespaces/types/type-aliases/Maybe.md)\<[`Maybe`](../namespaces/types/type-aliases/Maybe.md)\<[`UserStats`](../namespaces/types/type-aliases/UserStats.md)\>[]\>; \}\> = `fn`

##### Parameters

###### source

`unknown`

###### args

[`SubscriptionStatsArgs`](../namespaces/types/type-aliases/SubscriptionStatsArgs.md)

##### Returns

`AsyncGenerator`\<\{ `stats`: `undefined` \| [`Maybe`](../namespaces/types/type-aliases/Maybe.md)\<[`Maybe`](../namespaces/types/type-aliases/Maybe.md)\<[`UserStats`](../namespaces/types/type-aliases/UserStats.md)\>[]\>; \}\>
