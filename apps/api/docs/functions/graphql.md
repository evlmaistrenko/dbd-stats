[**@evlmaistrenko/dbd-stats-api**](../README.md)

---

[@evlmaistrenko/dbd-stats-api](../README.md) / graphql

# Function: graphql()

## Call Signature

> **graphql**(`args`): `Promise`\<`ExecutionResult`\<[`Operations`](../type-aliases/Operations.md)\>\>

Customized `graphql` function

### Parameters

#### args

`Omit`\<`GraphQLArgs`, `"schema"` \| `"rootValue"`\>

### Returns

`Promise`\<`ExecutionResult`\<[`Operations`](../type-aliases/Operations.md)\>\>

## Call Signature

> **graphql**(`args`, `subscription`): `AsyncGenerator`\<`ExecutionResult`\<[`Operations`](../type-aliases/Operations.md)\>\>

Customized `graphql` function

### Parameters

#### args

`Omit`\<`GraphQLArgs`, `"schema"` \| `"rootValue"`\>

#### subscription

`true`

### Returns

`AsyncGenerator`\<`ExecutionResult`\<[`Operations`](../type-aliases/Operations.md)\>\>
