import { ExecutionResult, GraphQLArgs, graphql as graphqlRaw } from "graphql"
import _ from "lodash"

import { subscribe } from "./mongo/subscribe.js"
import { schema } from "./schema/index.js"
import { types } from "./types/index.js"

export type Operations = NonNullable<
	Omit<types.Query, "__typename"> &
		Omit<types.Subscription, "__typename"> &
		Omit<types.Mutation, "__typename">
>

/** Customized `graphql` function. */
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
	if (!subscription) return graphqlRaw({ ...args, schema })
	return subscribe(() => graphqlRaw({ ...args, schema }))
}
