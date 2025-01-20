import { ExecutionResult, GraphQLArgs, graphql as graphqlRaw } from "graphql"
import _ from "lodash"

import { subscribe } from "./mongo/subscribe.js"
import { rootValue } from "./resolvers/index.js"
import { schema } from "./schema.js"
import * as types from "./types.js"

export type Operations = NonNullable<
	Omit<types.Query, "__typename"> & Omit<types.Subscription, "__typename">
>

/** Customized `graphql` function */
export function graphql(
	args: Omit<GraphQLArgs, "rootValue" | "schema">,
): Promise<ExecutionResult<Operations>>
export function graphql(
	args: Omit<GraphQLArgs, "rootValue" | "schema">,
	subscription: true,
): AsyncGenerator<ExecutionResult<Operations>>
export function graphql(
	args: Omit<GraphQLArgs, "rootValue" | "schema">,
	subscription?: true,
) {
	if (!subscription) return graphqlRaw({ ...args, schema, rootValue })
	return subscribe(() => graphqlRaw({ ...args, schema, rootValue }))
}
